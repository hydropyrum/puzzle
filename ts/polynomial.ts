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

    toString(): String {
        let s: String = "";
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

    eval_interval(argl: Fraction, argu: Fraction): [Fraction, Fraction] {
        let suml = fraction(0);
        let sumu = fraction(0);
        for (let i=this.degree; i>=0; i--) {
            let sums = [Fraction.multiply(suml, argl),
                        Fraction.multiply(suml, argu),
                        Fraction.multiply(sumu, argl),
                        Fraction.multiply(sumu, argu)];
            sums.sort((a, b) => Fraction.sign(Fraction.subtract(a, b)));
            suml = Fraction.add(sums[0], this.coeffs[i]);
            sumu = Fraction.add(sums[3], this.coeffs[i]);
        }
        return [suml, sumu];
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
}

export function polynomial(coeffs: (Fraction|number)[]) {
    return new Polynomial(
        coeffs.map(x => typeof x === 'number' ? fraction(x) : x)
    );
}
