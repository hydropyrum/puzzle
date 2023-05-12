import { Polynomial, polynomial } from './polynomial';
import { Fraction, fraction } from './fraction';

/* ℚ(θ) where θ is a root of a polynomial with rational coefficients. */
export class AlgebraicNumberField {
    degree: number;
    poly: Polynomial; // minimal polynomial of θ
    lower: Fraction;  // lower bound on θ
    approx: number;   // floating-point approximation of θ
    upper: Fraction;  // upper bound on θ
    powers: Polynomial[];
    constructor(poly: Polynomial,
                approx: number) {
        this.degree = poly.degree;
        this.poly = poly;
        this.approx = approx;
        [this.lower, this.upper] = poly.isolate_root(approx);

        // Precompute powers of poly up to 2*degree to speed up multiplication (Cohen)
        this.powers = [];
        this.powers.push(polynomial([1]));
        for (let i=1; i<this.degree; i++)
            this.powers.push(Polynomial.multiply(this.powers[i-1], polynomial([0,1])));
        for (let i=this.degree; i<=2*this.degree; i++)
            this.powers.push(Polynomial.remainder(
                Polynomial.multiply(this.powers[i-1], polynomial([0,1])),
                this.poly));
    }

    toString(): string {
        return this.poly.toString();
    }

    refine() {
        let mid = this.lower.add(this.upper).div(fraction(2));
        let sl = this.poly.eval(this.lower).sign();
        let sm = this.poly.eval(mid).sign();
        let su = this.poly.eval(this.upper).sign();
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
        //return this.poly.toString();
        return String(this.poly.eval_approx(this.field.approx));
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
        let p = Polynomial.multiply(a.poly, b.poly);
        //return new AlgebraicNumber(K, Polynomial.remainder(p, K.poly));
        let coeffs = [];
        for (let i=0; i<K.poly.degree; i++) {
            if (i <= p.degree)
                coeffs.push(p.coeffs[i]);
            else
                coeffs.push(fraction(0));
        }
        for (let i=K.poly.degree; i<=p.degree; i++)
            for (let j=0; j<=K.powers[i].degree; j++)
                coeffs[j] = coeffs[j].add(K.powers[i].coeffs[j].mul(p.coeffs[i]));
        return new AlgebraicNumber(K, new Polynomial(coeffs));
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
        /* // Loos
        let c = d.count_roots(K.lower, K.upper);
        while (c > 0) {
            K.refine();
            c = d.count_roots(K.lower, K.upper);
            }
        return d.eval(K.lower).sign();*/
        let [val_l, val_u] = d.eval_interval(K.lower, K.upper);
        while (val_l.sign() != val_u.sign()) {
            K.refine();
            [val_l, val_u] = d.eval_interval(K.lower, K.upper);
        }
        return val_l.sign();
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
