import JSBI from 'jsbi';
import { Fraction, fraction } from './fraction';

export class Polynomial {
    coeffs: Fraction[]; // coeffs[i] is coefficient on x^i
    degree: number;

    constructor(coeffs: Fraction[]) {
        // drop leading zero coefficients
        while (coeffs.length > 0 && coeffs[coeffs.length-1].sign() == 0)
            coeffs.pop();
        this.coeffs = coeffs;
        this.degree = coeffs.length-1;
    }

    toString(): string {
        let s = "";
        if (this.degree == -1) return "0";
        for (let i=this.degree; i>=0; i--) {
            let sign = this.coeffs[i].sign();
            let abs = this.coeffs[i].abs();

            if (sign < 0)
                s += " - ";
            else if (sign == 0)
                continue;
            else if (sign > 0 && i < this.degree)
                s += " + "

            if (!abs.equals(fraction(1)) || i == 0)
                s += String(abs);

            if (i == 1)
                s += "x";
            if (i > 1 && i < 10)
                s += "x^" + String(i);
            else if (i >= 10)
                s += "x^{" + String(i) + "}";
        }
        return s;
    }

    eval(arg: Fraction): Fraction {
        // Horner's rule
        let sum = fraction(0);
        for (let i=this.degree; i>=0; i--)
            sum = sum.mul(arg).add(this.coeffs[i]);
        return sum;
    }
    
    eval_approx(arg: number): number {
        let sum = 0;
        for (let i=this.degree; i>=0; i--)
            sum = sum*arg + this.coeffs[i].toNumber();
        return sum;
    }

    eval_interval(arg_l: Fraction, arg_u: Fraction): [Fraction, Fraction] {
        let sum_l = fraction(0), sum_u = fraction(0);
        for (let i=this.degree; i>=0; i--) {
            let sums = [sum_l.mul(arg_l),
                        sum_l.mul(arg_u),
                        sum_u.mul(arg_l),
                        sum_u.mul(arg_u)];
            sums.sort((a,b) => a.compare(b));
            sum_l = sums[0].add(this.coeffs[i]);
            sum_u = sums[3].add(this.coeffs[i]);
        }
        return [sum_l, sum_u];
    }

    add(b: Polynomial): Polynomial {
        let a = this;
        let coeffs: Fraction[] = [];
        for (let i=0; i<Math.max(a.coeffs.length, b.coeffs.length); i++) {
            if (i < a.coeffs.length && i < b.coeffs.length)
                coeffs.push(a.coeffs[i].add(b.coeffs[i]));
            else if (i < a.coeffs.length)
                coeffs.push(a.coeffs[i]);
            else /* if (i < b.coeffs.length) */
                coeffs.push(b.coeffs[i]);
        }
        return new Polynomial(coeffs);
    }

    neg(): Polynomial { return new Polynomial(this.coeffs.map(c => c.neg())); }
    sub(b: Polynomial): Polynomial { return this.add(b.neg()); }
        
    mul(b: Polynomial): Polynomial {
        let coeffs: Fraction[] = [];
        let m = this.degree;
        let n = b.degree;
        for (let k=0; k<=m+n; k++) {
            let ck = fraction(0);
            for (let i=Math.max(0,k-n); i<=Math.min(k,m); i++)
                ck = ck.add(this.coeffs[i].mul(b.coeffs[k-i]));
            coeffs.push(ck);
        }
        return new Polynomial(coeffs);
    }

    divmod(b: Polynomial): [Polynomial, Polynomial] {
        let m = this.degree;
        let n = b.degree;
        if (n == -1) throw new RangeError("Division by zero");
        let rem = this.coeffs.map(x => x);
        let quo: Fraction[] = [];
        for (let k=m; k>=n; k--) {
            let q = rem[k].div(b.coeffs[n]);
            quo.push(q);
            for (let j=0; j<=n; j++)
                rem[k-n+j] = rem[k-n+j].sub(q.mul(b.coeffs[j]));
        }
        quo = quo.reverse();
        return [new Polynomial(quo), new Polynomial(rem)];
    }
    
    div(b: Polynomial): Polynomial {
        if (b.degree == 0) // special faster case
            return new Polynomial(this.coeffs.map(x => x.div(b.coeffs[0])));
        else {
            let [q, r] = this.divmod(b);
            return q;
        }
    }
    mod(b: Polynomial): Polynomial {
        let [q, r] = this.divmod(b);
        return r;
    }

    equals(b: Polynomial): boolean {
        if (this.degree != b.degree) return false;
        for (let i=0; i<=this.degree; i++)
            if (!this.coeffs[i].equals(b.coeffs[i])) return false;
        return true;
    }

    derivative(): Polynomial {
        let coeffs: Fraction[] = [];
        for (let i=1; i<=this.degree; i++)
            coeffs.push(fraction(i).mul(this.coeffs[i]));
        return new Polynomial(coeffs);
    }

    sturm_sequence(arg: Fraction): number {
        /* Number of sign changes in Sturm sequence at arg. */
        let p0: Polynomial = this, p1 = this.derivative();
        let prev_sign = p0.eval(arg).sign();
        let changes = 0;
        while (p1.degree >= 0) {
            let cur_sign = p1.eval(arg).sign();
            if (cur_sign != 0) {
                if (prev_sign != 0 && cur_sign != prev_sign)
                    changes++;
                prev_sign = cur_sign;
            }
            [p0, p1] = [p1, p0.mod(p1).neg()];
        }
        return changes;
    }

    count_roots(lower: Fraction, upper: Fraction): number {
        /* Number of roots in interval [lower, upper] */
        return (this.eval(lower).sign() == 0 ? 1 : 0) + this.sturm_sequence(lower) - this.sturm_sequence(upper);
    }
    
    /* Find an isolating interval for the root of p nearest x. */
    isolate_root(x: number): [Fraction, Fraction] {
        let denom = JSBI.BigInt(1);
        while (true) {
            let lnumer = JSBI.BigInt(Math.floor(x * JSBI.toNumber(denom)));
            let unumer = JSBI.add(lnumer, JSBI.BigInt(1));
            let lower = fraction(lnumer, denom), upper = fraction(unumer, denom);
            let c = this.count_roots(lower, upper);
            if (c == 1)
                return [lower, upper];
            else if (c == 0)
                throw new RangeError("no root in interval [" + String(lower) + "," + String(upper) + "]");
            denom = JSBI.multiply(denom, JSBI.BigInt(2));
        }
    }
}

export function polynomial(coeffs: (Fraction|number)[]) {
    return new Polynomial(
        coeffs.map(x => typeof x === 'number' ? fraction(x) : x)
    );
}
