import { RingElement, Ring, Ordered, gcd } from './ring';
import { Polynomial, Polynomials, polynomial, QQ_x, count_roots, isolate_root, resultant } from './polynomial';
import { factor } from './factoring';
import { Fraction, fraction, QQ } from './fraction';

/* ℚ(θ) where θ is a root of a polynomial with rational coefficients. */
export class AlgebraicNumberField implements Ring<AlgebraicNumber> {
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
        [this.lower, this.upper] = isolate_root(poly, approx);
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
        return `Q(root of ${this.poly})`;
    }

    zero() { return new AlgebraicNumber(this, polynomial([])); }
    one() { return new AlgebraicNumber(this, polynomial([1n])); }
    fromInt(n: number) { return new AlgebraicNumber(this, polynomial([n])); }

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

export var QQ_nothing = algebraicNumberField([-1, 1], fraction(1));

export class AlgebraicNumber implements RingElement<AlgebraicNumber>, Ordered<AlgebraicNumber> {
    field: AlgebraicNumberField;
    poly: Polynomial<Fraction>;

    constructor(field: AlgebraicNumberField, poly: Polynomial<Fraction>) {
        this.field = field;
        this.poly = poly.mod(field.poly);
    }

    equals(b: AlgebraicNumber): boolean {
        let K = AlgebraicNumber.check_same_field(this, b);
        return this.poly.equals(b.poly);
    }
    isZero(): boolean { return this.poly.degree == -1; }

    clone(): AlgebraicNumber {
        return new AlgebraicNumber(this.field, this.poly.clone());
    }

    toString(): string {
        return `${this.poly} in ${this.field}`;
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

    iadd(b: AlgebraicNumber): AlgebraicNumber {
        this.field = AlgebraicNumber.check_same_field(this, b);
        this.poly.iadd(b.poly);
        return this;
    }
    add(b: AlgebraicNumber): AlgebraicNumber {
        let K = AlgebraicNumber.check_same_field(this, b);
        return new AlgebraicNumber(K, this.poly.add(b.poly));
    }
    neg(): AlgebraicNumber {
        return new AlgebraicNumber(this.field, this.poly.neg());
    }
    isub(b: AlgebraicNumber): AlgebraicNumber {
        this.field = AlgebraicNumber.check_same_field(this, b);
        this.poly.isub(b.poly);
        return this;
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
    imul(b: AlgebraicNumber): AlgebraicNumber {
        let c = this.mul(b);
        [this.field, this.poly] = [c.field, c.poly];
        return this;
    }
    inv(): AlgebraicNumber {
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
    
    div(b: AlgebraicNumber): AlgebraicNumber { return this.mul(b.inv()); }
    idiv(b: AlgebraicNumber): AlgebraicNumber { return this.imul(b.inv()); }

    toNumber(): number {
        let [lo, hi] = this.interval();
        let t = 0;
        while (hi.toNumber()-lo.toNumber() > 1e-10) { // arbitrary
            this.field.refine();
            [lo, hi] = this.interval();
        }
        return (lo.toNumber()+hi.toNumber())/2;
    }
    
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

function poly2(coeffs: (number|Fraction)[][]) { return new Polynomial(QQ_x, coeffs.map(polynomial)); }

export function normal(B: Polynomial<AlgebraicNumber>): Polynomial<Fraction> {
    /* If B is the minimal polynomial of β over K, find the minimal polynomial of β over Q.

       Arguments:
       - B: polynomial with coefficients in K

       Returns:
       - polynomial with coefficients in Q
    */

    let A = (B.coeff_ring as AlgebraicNumberField).poly;

    // change α into inner variable, "transpose" inner and outer
    let B_coeffs: Fraction[][] = [];
    for (let i=0; i<=A.degree; i++)
        B_coeffs.push(B.coeffs.map(c => i <= c.poly.degree ? c.poly.coeffs[i] : fraction(0)));

    // Res_x(A(x), B(x,y))
    let B_normal = resultant(poly2(A.coeffs.map(c => [c])), poly2(B_coeffs));
    
    // make squarefree
    B_normal.idiv(gcd(QQ_x, B_normal, B_normal.derivative()));
    return B_normal.monic();
}

export function extend(Q_alpha: AlgebraicNumberField, Q_beta: AlgebraicNumberField): [AlgebraicNumberField, AlgebraicNumber, AlgebraicNumber] {
    /* Given Q(α) and Q(β), construct Q(α,β).
       Arguments:
       - Q_alpha, Q_beta: AlgebraicNumberFields
       Returns: (Q_alpha_beta, alpha, beta)
       - Q_alpha_beta: the new field
       - alpha: the primitive element of Q_alpha, represented in Q_alpha_beta
       - beta: the primitive element of Q_beta, represented in Q_alpha_beta
    */
    
    let [A, B] = [Q_alpha.poly, Q_beta.poly];

    // Choose primitive element. It will be of the form kα+β for some k.
    let k: number;
    let C_mult: Polynomial<Fraction>;
    for (k=1;; k++) {
        // Find a polynomial with root kα+β
        let QQ_x_y = new Polynomials(QQ_x);
        let A_bivar = poly2(A.coeffs.map(c => [c]));
        let B_bivar = B.map(QQ_x_y, c => poly2([[c]]));
        let beta = poly2([[0, 1], [-k]]); // z-kx
        C_mult = resultant(A_bivar, B_bivar.eval(beta)); // Res_x(A(x), B(z-kx))
        // If C_mult is squarefree, then all the conjugates of kα+β are distinct,
        // so kα+β is a primitive element of Q(α,β).
        if (gcd(QQ_x, C_mult, C_mult.derivative()).degree == 0)
            break;
    }

    // Choose the factor of C_mult that has kα+β as a root. This is the minimal polynomial.
    let C_factors = factor(C_mult);
    let C: Polynomial<Fraction>|null = null;
    let lower: Fraction|null = null;
    let upper: Fraction|null = null;
    for (let factor of C_factors) {
        let count: number;
        while (true) {
            console.assert(k >= 0);
            lower = Q_alpha.lower.mul(fraction(k)).iadd(Q_beta.lower);
            upper = Q_alpha.upper.mul(fraction(k)).iadd(Q_beta.upper);
            count = count_roots(factor, lower, upper);
            if (count < 2)
                break;
            else {
                Q_alpha.refine();
                Q_beta.refine();
            }
        }
        if (count == 1) {
            C = factor;
            break;
        }
    }
    if (C === null)
        throw new Error("Could not construct C (this shouldn't happen)");
    
    // to do: don't convert interval to midpoint and then back to interval again
    let Q_gamma = new AlgebraicNumberField(C as Polynomial<Fraction>,
                                           (lower as Fraction).middle(upper as Fraction));

    // Choose the new field and represent α and β in it.

    let field, alpha_vec, beta_vec;

    beta_vec = helper(Q_alpha, B, C, [[0, k], [1]]);
    if (beta_vec !== null) {
        field = Q_alpha;
        alpha_vec = Q_alpha.fromVector([0, 1]);
    } else {
        alpha_vec = helper(Q_beta, A, C, [[0, 1], [k]]);
        if (alpha_vec !== null) {
            field = Q_beta;
            beta_vec = Q_beta.fromVector([0, 1]);
        } else {
            field = Q_gamma;
            alpha_vec = helper(Q_gamma, A, B, [[0, 1], [-k]]);
            beta_vec = helper(Q_gamma, B, A, [[0, fraction(1, k)], [fraction(-1, k)]]);
        }
    }
    if (alpha_vec === null || beta_vec === null)
        throw new Error("Could not represent alpha and beta (this shouldn't happen)");
    
    return [field, alpha_vec, beta_vec];
}

function helper(Q_alpha: AlgebraicNumberField, B: Polynomial<Fraction>, C: Polynomial<Fraction>, g: (Fraction|number)[][]): AlgebraicNumber|null {
    /* Test whether the roots of f are in K.

       Arguments:
       - Q_alpha: an AlgebraicNumberField
       - B: the Polynomial (in Q[y]) to be tested
       - C: another Polynomial in Q[z]
       - g: another Polynomial in Q[x,y]

       C(g(α, y)) should have β as a root, but not any of its other conjugates.
     */
    // Represent β in Q(α) as gcd(B(y), C(g(α, y)))
    function poly_alpha(coeffs: (number|Fraction)[][]) {
        return new Polynomial(Q_alpha, coeffs.map(c => Q_alpha.fromVector(c)));
    }
    let Q_alpha_x = new Polynomials(Q_alpha);
    let B_alpha = poly_alpha(B.coeffs.map(c => [c]));
    let C_alpha_x = C.map(Q_alpha_x, c => poly_alpha([[c]]));
    let gamma = poly_alpha(g);
    let B_factor = gcd(Q_alpha_x, B_alpha, C_alpha_x.eval(gamma));
    if (B_factor.degree == 1)
        return B_factor.monic().coeffs[0].neg();
    else
        return null;
}

export function promote(xs: AlgebraicNumber[]) {
    /* Promote a list of algebraic numbers to all be in the same number field. */
    for (let i=1; i<xs.length; i++) {
        let [field, alpha, beta] = extend(xs[i-1].field, xs[i].field);
        if (field !== xs[i-1].field)
            for (let j=0; j<i; j++)
                xs[j] = xs[j].poly.map(field, c => field.fromVector([c])).eval(alpha);
        if (field !== xs[i].field)
            xs[i] = xs[i].poly.map(field, c => field.fromVector([c])).eval(beta);
    }
    return xs;
}
