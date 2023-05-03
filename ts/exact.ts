import { Polynomial, polynomial } from './polynomial';
import { Fraction, fraction } from './fraction';

/* ℚ(θ) where θ is a root of a polynomial with rational coefficients. */
export class AlgebraicNumberField {
    degree: number;
    poly: Polynomial; // minimal polynomial of θ
    lower: Fraction;  // lower bound on θ
    approx: number;   // floating-point approximation of θ
    upper: Fraction;  // upper bound on θ
    basis: Polynomial[];
    constructor(poly: Polynomial,
                approx: number) {
        this.degree = poly.degree;
        this.poly = poly;
        this.approx = approx;
        [this.lower, this.upper] = poly.isolate_root(approx);
        
        this.basis = [];
        this.basis.push(polynomial([1]));
        for (let i=1; i<this.degree; i++)
            this.basis.push(Polynomial.multiply(this.basis[i-1], polynomial([0,1])));
    }

    refine() {
        let mid = Fraction.divide(Fraction.add(this.lower, this.upper), fraction(2));
        let sl = Fraction.sign(this.poly.eval(this.lower));
        let sm = Fraction.sign(this.poly.eval(mid));
        let su = Fraction.sign(this.poly.eval(this.upper));
        if (sl == 0)
            this.upper = this.lower;
        else if (su == 0)
            this.lower = this.upper;
        else if (sm == 0)
            this.lower = this.upper = mid;
        else if (sm == sl)
            this.lower = mid;
        else /* if (sm == su) */
            this.upper = mid;
    }

    // alternatively, could initially refine a few times and use
    // midpoint of isolating interval
    toNumber(a: Polynomial) { return a.eval_approx(this.approx); }

    add(a: Polynomial, b: Polynomial) { return Polynomial.add(a, b); }
    unaryMinus(a: Polynomial) { return Polynomial.unaryMinus(a); }
    subtract(a: Polynomial, b: Polynomial) { return Polynomial.subtract(a, b); }
    multiply(a: Polynomial, b: Polynomial) {
        return Polynomial.remainder(Polynomial.multiply(a, b), this.poly);
    }
    invert(b: Polynomial) {
        // Inverse of a modulo b=this.poly
        // Extended Euclidean algorithm to find ra+sb=1
        let a = this.poly;
        let zero = polynomial([0]);
        let r0 = a, r1 = b;
        let t0 = zero, t1 = polynomial([1]);
        while (!Polynomial.equal(r1, zero)) {
            let [q, r2] = Polynomial.divmod(r0, r1);
            [r0, r1] = [r1, r2];
            [t0, t1] = [t1, Polynomial.subtract(t0, Polynomial.multiply(q, t1))];
        }
        if (r0.degree > 0)
            throw new RangeError("inverse does not exist (remainder=" + String(r0) + ")");
        return Polynomial.divide(t0, r0);
    }

    divide(a: Polynomial, b: Polynomial): Polynomial {
        return Polynomial.multiply(a, this.invert(b));
    }

    equal(a: Polynomial, b: Polynomial): boolean { return Polynomial.equal(a, b);  }

    private compare(a: Polynomial, b: Polynomial): number {
        let d = Polynomial.subtract(a, b);
        let c = d.count_roots(this.lower, this.upper);
        while (c > 0) {
            this.refine();
            c = d.count_roots(this.lower, this.upper);
        }
        return Fraction.sign(d.eval(this.lower));
    }

    lessThan(a: Polynomial, b: Polynomial): boolean {
        return !Polynomial.equal(a, b) && this.compare(a, b) < 0;
    }
    greaterThan(a: Polynomial, b: Polynomial): boolean {
        return !Polynomial.equal(a, b) && this.compare(a, b) > 0;
    }
    lessThanOrEqual(a: Polynomial, b: Polynomial): boolean {
        return Polynomial.equal(a, b) || this.compare(a, b) < 0;
    }
    greaterThanOrEqual(a: Polynomial, b: Polynomial): boolean {
        return Polynomial.equal(a, b) || this.compare(a, b) > 0;
    }
};

export function algebraicNumberField(poly: Polynomial|number[],
                                     approx: number) : AlgebraicNumberField {
    if (poly instanceof Array<number>) poly = polynomial(poly);
    return new AlgebraicNumberField(poly, approx);
}

export type AlgebraicNumber = Polynomial;
