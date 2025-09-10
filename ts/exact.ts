import { Polynomial, polynomial } from './polynomial';
import { Fraction, fraction } from './fraction';

/* ℚ(θ) where θ is a root of a polynomial with rational coefficients. */
export class AlgebraicNumberField {
    degree: number;
    poly: Polynomial<Fraction>; // minimal polynomial of θ
    lower: Fraction;  // lower bound on θ
    approx: Fraction; // approximation of θ
    upper: Fraction;  // upper bound on θ
    powers: Polynomial<Fraction>[];
    powers_upper: Fraction[] = [];
    powers_lower: Fraction[] = [];
    constructor(poly: Polynomial<Fraction>, approx: Fraction) {
        this.degree = poly.degree;
        this.poly = poly;
        [this.lower, this.upper] = poly.isolate_root(approx);
        while (this.upper.sub(this.lower).compare(fraction(1,1000)) > 0)
            this.refine();
        this.approx = this.lower.middle(this.upper);

        // Precompute powers of poly up to 2*degree to speed up multiplication (Cohen)
        this.powers = [];
        this.powers.push(polynomial([1]));
        for (let i=1; i<this.degree; i++)
            this.powers.push(this.powers[i-1].mul(polynomial([0,1])));
        for (let i=this.degree; i<=2*this.degree; i++)
            this.powers.push(this.powers[i-1].mul(polynomial([0,1])).mod(this.poly));

        this.precompute_interval_powers();
    }

    toString(): string {
        return this.poly.toString();
    }

    precompute_interval_powers() {
        this.powers_lower = [fraction(1)];
        this.powers_upper = [fraction(1)];
        for (let i=1; i <= this.degree; i++) {
            let vals = [this.powers_lower[i-1].mul(this.lower),
                        this.powers_lower[i-1].mul(this.upper),
                        this.powers_upper[i-1].mul(this.lower),
                        this.powers_upper[i-1].mul(this.upper)];
            vals.sort((a,b) => a.compare(b));
            this.powers_lower.push(vals[0]);
            this.powers_upper.push(vals[3]);
        }
    }

    refine() {
        let mid = this.lower.middle(this.upper);
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
        this.precompute_interval_powers();
    }

    fromVector(coeffs: (number|bigint|Fraction)[]): AlgebraicNumber {
        return new AlgebraicNumber(this, polynomial(coeffs));
    }
};

export function algebraicNumberField(poly: Polynomial<Fraction>|(Fraction|number|bigint)[],
                                     approx: Fraction|number|bigint) : AlgebraicNumberField {
    if (!(poly instanceof Polynomial<Fraction>)) poly = polynomial(poly);
    if (!(approx instanceof Fraction)) approx = fraction(approx);
    return new AlgebraicNumberField(poly, approx);
}

var Q = algebraicNumberField([-1, 1], fraction(1));

export class AlgebraicNumber {
    field: AlgebraicNumberField;
    poly: Polynomial<Fraction>;

    constructor(field: AlgebraicNumberField, poly: Polynomial<Fraction>) {
        this.field = field;
        this.poly = poly;
    }

    static fromInteger(x: number): AlgebraicNumber {
        if (!Number.isInteger(x))
            throw new RangeError('x must be an integer');
        return Q.fromVector([fraction(x)]);
    }

    toString(): string {
        return this.poly.toString();
    }
    
    // alternatively, could initially refine a few times and use
    // midpoint of isolating interval
    toNumber(): number {
        return this.poly.eval_approx(this.field.approx.toNumber());
    }

    static check_same_field(a: AlgebraicNumber, b: AlgebraicNumber): AlgebraicNumberField {
        if (a.field === b.field)
            return a.field;
        if (a.field.poly.equals(b.field.poly))
            return a.field;
        if (a.field.poly.degree == 1)
            return b.field;
        if (b.field.poly.degree == 1)
            return a.field;
        throw RangeError("AlgebraicNumbers must have same field (" + a.field.toString() + " != " + b.field.toString() + ")");
    }

    add(b: AlgebraicNumber): AlgebraicNumber {
        let K = AlgebraicNumber.check_same_field(this, b);
        return new AlgebraicNumber(K, this.poly.add(b.poly));
    }
    neg(): AlgebraicNumber {
        return new AlgebraicNumber(this.field, this.poly.neg());
    }
    sub(b: AlgebraicNumber): AlgebraicNumber {
        let K = AlgebraicNumber.check_same_field(this, b);
        return new AlgebraicNumber(K, this.poly.sub(b.poly));
    }
    mul(b: AlgebraicNumber): AlgebraicNumber {
        let K = AlgebraicNumber.check_same_field(this, b);
        let p = this.poly.mul(b.poly);
        //return new AlgebraicNumber(K, p.mod(K.poly));
        let coeffs = [];
        for (let i=0; i<K.poly.degree; i++) {
            if (i <= p.degree)
                coeffs.push(p.coeffs[i].clone());
            else
                coeffs.push(fraction(0));
        }
        for (let i=K.poly.degree; i<=p.degree; i++)
            for (let j=0; j<=K.powers[i].degree; j++)
                coeffs[j].iadd(K.powers[i].coeffs[j].mul(p.coeffs[i]), false);
        for (let c of coeffs)
            c.reduce();
        return new AlgebraicNumber(K, polynomial(coeffs));
    }
    inverse(): AlgebraicNumber {
        // Inverse of a modulo b=this.poly
        // Extended Euclidean algorithm to find ra+sb=1
        let K = this.field;
        let a = K.poly;
        let b = this.poly;
        let zero = polynomial([0]);
        let r0 = a, r1 = b;
        let t0 = zero, t1 = polynomial([1]);
        while (!r1.equals(zero)) {
            let [q, r2] = r0.divmod(r1);
            [r0, r1] = [r1, r2];
            [t0, t1] = [t1, t0.sub(q.mul(t1))];
        }
        if (r0.degree > 0)
            throw new RangeError("Division by zero: " + this);
        return new AlgebraicNumber(K, t0.div(r0));
    }
    
    div(b: AlgebraicNumber): AlgebraicNumber { return this.mul(b.inverse()); }
    
    equals(b: AlgebraicNumber): boolean {
        let K = AlgebraicNumber.check_same_field(this, b);
        return this.poly.equals(b.poly);
    }

    isZero(): boolean { return this.poly.degree == -1; }

    compare(b: AlgebraicNumber): number { return this.sub(b).sign(); }

    interval(): [Fraction, Fraction] {
        let K = this.field;
        let p = this.poly;
        let l = fraction(0), u = fraction(0);
        for (let i=0; i<=p.degree; i++) {
            let s = p.coeffs[i].sign();
            if (s > 0) {
                l.iadd(p.coeffs[i].mul(K.powers_lower[i]), false);
                u.iadd(p.coeffs[i].mul(K.powers_upper[i]), false);
            } else if (s < 0) {
                l.iadd(p.coeffs[i].mul(K.powers_upper[i]), false);
                u.iadd(p.coeffs[i].mul(K.powers_lower[i]), false);
            }
        }
        l.reduce();
        u.reduce();
        return [l, u];
    }

    sign(): number {
        let K = this.field;
        let p = this.poly;
        if (p.degree == -1) return 0;
        let [val_l, val_u] = this.interval();
        while (val_l.sign() != val_u.sign()) {
            K.refine();
            [val_l, val_u] = this.interval();
        }
        return val_l.sign();
    }
    
    abs(): AlgebraicNumber {
        if (this.sign() < 0)
            return this.neg();
        else
            return this;
    }
}
