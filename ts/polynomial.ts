import JSBI from 'jsbi';
import { Fraction, fraction } from './fraction';

export class Polynomial {
    coeffs: Fraction[]; // coeffs[i] is coefficient on x^i
    degree: number;

    constructor(coeffs: Fraction[]) {
        // drop leading zero coefficients
        let zero = fraction(0);
        while (coeffs.length > 0 && Fraction.equal(coeffs[coeffs.length-1], zero))
            coeffs.pop();
        this.coeffs = coeffs;
        this.degree = coeffs.length-1;
    }

    toString(): string {
        let s = "";
        if (this.degree == -1) return "0";
        for (let i=this.degree; i>=0; i--) {
            let sign = Fraction.sign(this.coeffs[i]);
            let abs = Fraction.abs(this.coeffs[i]);

            if (sign < 0)
                s += " - ";
            else if (sign == 0)
                continue;
            else if (sign > 0 && i < this.degree)
                s += " + "

            if (!Fraction.equal(abs, fraction(1)) || i == 0)
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
            sum = Fraction.add(Fraction.multiply(sum, arg), this.coeffs[i]);
        return sum;
    }
    
    eval_approx(arg: number): number {
        // Horner's rule
        let sum = 0;
        for (let i=this.degree; i>=0; i--)
            sum = sum*arg + Fraction.toNumber(this.coeffs[i]);
        return sum;
    }

    static add(a: Polynomial, b: Polynomial): Polynomial {
        let coeffs: Fraction[] = [];
        for (let i=0; i<Math.max(a.coeffs.length, b.coeffs.length); i++) {
            if (i < a.coeffs.length && i < b.coeffs.length)
                coeffs.push(Fraction.add(a.coeffs[i], b.coeffs[i]));
            else if (i < a.coeffs.length)
                coeffs.push(a.coeffs[i]);
            else /* if (i < b.coeffs.length) */
                coeffs.push(b.coeffs[i]);
        }
        return new Polynomial(coeffs);
    }

    static unaryMinus(a: Polynomial): Polynomial {
        return new Polynomial(a.coeffs.map(Fraction.unaryMinus));
    }

    static subtract(a: Polynomial, b: Polynomial): Polynomial {
        return Polynomial.add(a, Polynomial.unaryMinus(b));
    }
        
    static multiply(a: Polynomial, b: Polynomial): Polynomial {
        let coeffs: Fraction[] = [];
        let m = a.degree;
        let n = b.degree;
        for (let k=0; k<=m+n; k++) {
            let ck = fraction(0);
            for (let i=Math.max(0,k-n); i<=Math.min(k,m); i++)
                ck = Fraction.add(ck, Fraction.multiply(a.coeffs[i], b.coeffs[k-i]));
            coeffs.push(ck);
        }
        return new Polynomial(coeffs);
    }

    static divmod(a: Polynomial, b: Polynomial): [Polynomial, Polynomial] {
        let m = a.degree;
        let n = b.degree;
        if (n == -1) throw new RangeError("division by zero");
        let rem = a.coeffs.map(x => x);
        let quo: Fraction[] = [];
        for (let k=m; k>=n; k--) {
            let q = Fraction.divide(rem[k], b.coeffs[n]);
            quo.push(q);
            for (let j=0; j<=n; j++)
                rem[k-n+j] = Fraction.subtract(rem[k-n+j], Fraction.multiply(q, b.coeffs[j]));
        }
        quo = quo.reverse();
        return [new Polynomial(quo), new Polynomial(rem)];
    }
    
    static divide(a: Polynomial, b: Polynomial): Polynomial {
        if (b.degree == 0) // special faster case
            return new Polynomial(a.coeffs.map(x => Fraction.divide(x, b.coeffs[0])));
        else {
            let [q, r] = Polynomial.divmod(a, b);
            return q;
        }
    }
    static remainder(a: Polynomial, b: Polynomial): Polynomial {
        let [q, r] = Polynomial.divmod(a, b);
        return r;
    }

    static equal(a: Polynomial, b: Polynomial): boolean {
        if (a.degree != b.degree) return false;
        for (let i=0; i<=a.degree; i++)
            if (!Fraction.equal(a.coeffs[i], b.coeffs[i])) return false;
        return true;
    }

    derivative(): Polynomial {
        let coeffs: Fraction[] = [];
        for (let i=1; i<=this.degree; i++)
            coeffs.push(Fraction.multiply(fraction(i), this.coeffs[i]));
        return new Polynomial(coeffs);
    }

    sturm_sequence(arg: Fraction): number {
        /* Number of sign changes in Sturm sequence at arg. */
        let p0: Polynomial = this, p1 = this.derivative();
        let prev_sign = Fraction.sign(p0.eval(arg));
        let changes = 0;
        while (p1.degree >= 0) {
            let cur_sign = Fraction.sign(p1.eval(arg));
            if (cur_sign != 0) {
                if (prev_sign != 0 && cur_sign != prev_sign)
                    changes++;
                prev_sign = cur_sign;
            }
            [p0, p1] = [p1, Polynomial.unaryMinus(Polynomial.remainder(p0, p1))];
        }
        return changes;
    }

    count_roots(lower: Fraction, upper: Fraction): number {
        /* Number of roots in interval [lower, upper] */
        return (Fraction.sign(this.eval(lower)) == 0 ? 1 : 0) + this.sturm_sequence(lower) - this.sturm_sequence(upper);
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