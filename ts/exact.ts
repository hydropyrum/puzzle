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

    toString(): string {
        return this.poly.toString();
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

    fromVector(coeffs: (number|Fraction)[]): AlgebraicNumber {
        return new AlgebraicNumber(this, polynomial(coeffs));
    }
};

export function algebraicNumberField(poly: Polynomial|number[],
                                     approx: number) : AlgebraicNumberField {
    if (poly instanceof Array<number>) poly = polynomial(poly);
    return new AlgebraicNumberField(poly, approx);
}

export class AlgebraicNumber {
    field: AlgebraicNumberField;
    poly: Polynomial;

    constructor(field: AlgebraicNumberField, poly: Polynomial) {
        this.field = field;
        this.poly = poly;
    }

    toString(): string {
        return this.poly.toString();
    }
    
    // alternatively, could initially refine a few times and use
    // midpoint of isolating interval
    static toNumber(a: AlgebraicNumber): number {
        return a.poly.eval_approx(a.field.approx);
    }

    static check_same_field(a: AlgebraicNumber, b: AlgebraicNumber): AlgebraicNumberField {
        if (a.field === b.field)
            return a.field;
        if (Polynomial.equal(a.field.poly, b.field.poly))
            return a.field;
        if (a.field.poly.degree == 1)
            return b.field;
        if (b.field.poly.degree == 1)
            return a.field;
        throw RangeError("AlgebraicNumbers must have same field (" + a.field.toString() + " != " + b.field.toString() + ")");
    }

    static add(a: AlgebraicNumber, b: AlgebraicNumber): AlgebraicNumber {
        let K = AlgebraicNumber.check_same_field(a, b);
        return new AlgebraicNumber(K, Polynomial.add(a.poly, b.poly));
    }
    static unaryMinus(a: AlgebraicNumber): AlgebraicNumber {
        return new AlgebraicNumber(a.field, Polynomial.unaryMinus(a.poly));
    }
    static subtract(a: AlgebraicNumber, b: AlgebraicNumber): AlgebraicNumber {
        let K = AlgebraicNumber.check_same_field(a, b);
        return new AlgebraicNumber(K, Polynomial.subtract(a.poly, b.poly));
    }
    static multiply(a: AlgebraicNumber, b: AlgebraicNumber): AlgebraicNumber {
        let K = AlgebraicNumber.check_same_field(a, b);
        return new AlgebraicNumber(K, Polynomial.remainder(Polynomial.multiply(a.poly, b.poly), K.poly));
    }
    static invert(n: AlgebraicNumber): AlgebraicNumber {
        // Inverse of a modulo b=this.poly
        // Extended Euclidean algorithm to find ra+sb=1
        let K = n.field;
        let a = K.poly;
        let b = n.poly;
        let zero = polynomial([0]);
        let r0 = a, r1 = b;
        let t0 = zero, t1 = polynomial([1]);
        while (!Polynomial.equal(r1, zero)) {
            let [q, r2] = Polynomial.divmod(r0, r1);
            [r0, r1] = [r1, r2];
            [t0, t1] = [t1, Polynomial.subtract(t0, Polynomial.multiply(q, t1))];
        }
        if (r0.degree > 0)
            throw new RangeError("Division by zero: " + n);
        return new AlgebraicNumber(K, Polynomial.divide(t0, r0));
    }
    
    static divide(a: AlgebraicNumber, b: AlgebraicNumber): AlgebraicNumber {
        return AlgebraicNumber.multiply(a, AlgebraicNumber.invert(b));
    }
    
    static equal(a: AlgebraicNumber, b: AlgebraicNumber): boolean {
        let K = AlgebraicNumber.check_same_field(a, b);
        return Polynomial.equal(a.poly, b.poly);
    }

    static isZero(a: AlgebraicNumber): boolean {
        return a.poly.degree == -1;
    }

    static compare(a: AlgebraicNumber, b: AlgebraicNumber): number {
        let K = AlgebraicNumber.check_same_field(a, b);
        let d = Polynomial.subtract(a.poly, b.poly);
        if (d.degree == -1) return 0;
        let c = d.count_roots(K.lower, K.upper);
        while (c > 0) {
            K.refine();
            c = d.count_roots(K.lower, K.upper);
        }
        return Fraction.sign(d.eval(K.lower));
    }

    static lessThan(a: AlgebraicNumber, b: AlgebraicNumber): boolean {
        return AlgebraicNumber.compare(a, b) < 0;
    }
    static greaterThan(a: AlgebraicNumber, b: AlgebraicNumber): boolean {
        return AlgebraicNumber.compare(a, b) > 0;
    }
    static lessThanOrEqual(a: AlgebraicNumber, b: AlgebraicNumber): boolean {
        return AlgebraicNumber.compare(a, b) <= 0;
    }
    static greaterThanOrEqual(a: AlgebraicNumber, b: AlgebraicNumber): boolean {
        return AlgebraicNumber.compare(a, b) >= 0;
    }

    static sign(a: AlgebraicNumber): number {
        return AlgebraicNumber.compare(a, a.field.fromVector([]));
    }
}
