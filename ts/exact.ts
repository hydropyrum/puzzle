import { RingElement, Ring, Ordered, power, extended_gcd } from './ring';
import { Polynomial, Polynomials, polynomial, QQ_x, count_roots, gcd, resultant } from './polynomial';
import { factor } from './factoring';
import { Fraction, fraction, QQ } from './fraction';

/* ℚ(θ) where θ is a root of a polynomial with rational coefficients. */
export class AlgebraicNumberField implements Ring<AlgebraicNumber> {
    degree: number;
    poly: Polynomial<Fraction>; // minimal polynomial of θ
    lower: Fraction; // lower bound on θ
    upper: Fraction; // upper bound on θ
    powers: Polynomial<Fraction>[];
    powers_upper: Fraction[] = [];
    powers_lower: Fraction[] = [];
    constructor(poly: Polynomial<Fraction>, lower: Fraction, upper: Fraction) {
        this.degree = poly.degree;
        this.poly = poly;

        // Precompute powers of poly up to 2*degree to speed up multiplication (Cohen)
        this.powers = [];
        this.powers.push(polynomial([1]));
        for (let i=1; i<this.degree; i++)
            this.powers.push(this.powers[i-1].mul(polynomial([0,1])));
        for (let i=this.degree; i<=2*this.degree; i++)
            this.powers.push(this.powers[i-1].mul(polynomial([0,1])).mod(this.poly));

        if (count_roots(poly, lower, upper) != 1)
            throw Error("Interval must contain exactly one root");
        [this.lower, this.upper] = [lower, upper];
        this.precompute_interval_powers();
    }

    clone(): AlgebraicNumberField {
        return new AlgebraicNumberField(this.poly.clone(), this.lower.clone(), this.upper.clone());
    }
    equals(other: AlgebraicNumberField) {
        if (this === other) return true;
        if (!this.poly.equals(other.poly)) return false;
        let lower = this.lower.compare(other.lower) > 0 ? this.lower : other.lower;
        let upper = this.upper.compare(other.upper) < 0 ? this.upper : other.upper;
        if (lower.compare(upper) > 0) return false;
        return count_roots(this.poly, lower, upper) == 1;
    }

    toString(): string {
        return `Q(root of ${this.poly} in [${this.lower},${this.upper}])`;
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
        //console.assert(count_roots(this.poly, this.lower, this.upper) == 1);
        this.precompute_interval_powers();
    }

    fromVector(coeffs: (number|bigint|Fraction)[]): AlgebraicNumber {
        return new AlgebraicNumber(this, polynomial(coeffs));
    }
};

export function algebraicNumberField(poly: Polynomial<Fraction>|(Fraction|number|bigint)[],
                                     lower: Fraction|number|bigint,
                                     upper: Fraction|number|bigint) : AlgebraicNumberField {
    if (!(poly instanceof Polynomial<Fraction>)) poly = polynomial(poly);
    if (!(lower instanceof Fraction)) lower = fraction(lower);
    if (!(upper instanceof Fraction)) upper = fraction(upper);
    return new AlgebraicNumberField(poly, lower, upper);
}

export var QQ_nothing = algebraicNumberField([-1, 1], fraction(1), fraction(1));

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
        if (a.field.equals(b.field))
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
        let [r, s, t] = extended_gcd(QQ_x, this.field.poly, this.poly);
        if (r.degree > 0)
            throw new RangeError("Division by zero: " + this);
        return new AlgebraicNumber(this.field, t.div(r));
    }
    
    div(b: AlgebraicNumber): AlgebraicNumber { return this.mul(b.inv()); }
    idiv(b: AlgebraicNumber): AlgebraicNumber { return this.imul(b.inv()); }

    toNumber(): number {
        // cloning the field helps with debugging
        //let K = this.field.clone();
        //let x = new AlgebraicNumber(K, this.poly);
        let K = this.field;
        let x = this;
        let [lo, hi] = x.interval();
        while (hi.toNumber() - lo.toNumber() > 1e-3) {
            K.refine();
            [lo, hi] = x.interval();
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
    B_normal.idiv(gcd(B_normal, B_normal.derivative()));
    return B_normal.monic();
}

export function extend(Q_alpha: AlgebraicNumberField, Q_beta: AlgebraicNumberField): [AlgebraicNumberField, AlgebraicNumber, AlgebraicNumber] {
    /* Given Q(α) and Q(β), construct Q(α,β).
       Arguments:
       - Q_alpha, Q_beta: AlgebraicNumberFields
       Returns: [Q_alpha_beta, alpha, beta]
       - Q_alpha_beta: the new field
       - alpha: the primitive element of Q_alpha, represented in Q_alpha_beta
       - beta: the primitive element of Q_beta, represented in Q_alpha_beta
    */

    // Check if the fields are the same
    if (Q_alpha.equals(Q_beta))
        return [Q_alpha, Q_alpha.fromVector([0,1]), Q_beta.fromVector([0,1])];

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
        if (gcd(C_mult, C_mult.derivative()).degree == 0)
            break;
    }

    // Choose the factor of C_mult that has kα+β as a root. This is the minimal polynomial.
    let C_factors = factor(C_mult);
    let C: Polynomial<Fraction>|null = null;
    let lower = Q_alpha.lower.mul(fraction(k)).iadd(Q_beta.lower);
    let upper = Q_alpha.upper.mul(fraction(k)).iadd(Q_beta.upper);
    while (true) {
        let total = 0;
        for (let factor of C_factors) {
            let count = count_roots(factor, lower, upper);
            total += count;
            if (count > 0) C = factor;
        }
        if (total == 1) break;
        Q_alpha.refine();
        Q_beta.refine();
        lower = Q_alpha.lower.mul(fraction(k)).iadd(Q_beta.lower);
        upper = Q_alpha.upper.mul(fraction(k)).iadd(Q_beta.upper);
    }
    if (C === null)
        throw new Error("Could not construct C (this shouldn't happen)");
    
    let Q_gamma = new AlgebraicNumberField(C as Polynomial<Fraction>,
                                           lower as Fraction, upper as Fraction);

    // Choose the new field and represent α and β in it.

    let field, alpha_vec, beta_vec;

    beta_vec = extend_helper(Q_alpha, B, C, [[0, k], [1]]);
    if (beta_vec !== null) {
        field = Q_alpha;
        alpha_vec = Q_alpha.fromVector([0, 1]);
    } else {
        alpha_vec = extend_helper(Q_beta, A, C, [[0, 1], [k]]);
        if (alpha_vec !== null) {
            field = Q_beta;
            beta_vec = Q_beta.fromVector([0, 1]);
        } else {
            field = Q_gamma;
            alpha_vec = extend_helper(Q_gamma, A, B, [[0, 1], [-k]]);
            beta_vec = extend_helper(Q_gamma, B, A, [[0, fraction(1, k)], [fraction(-1, k)]]);
        }
    }
    if (alpha_vec === null || beta_vec === null)
        throw new Error("Could not represent alpha and beta (this shouldn't happen)");
    //console.assert(Math.abs(Q_alpha.fromVector([0, 1]).toNumber() - alpha_vec!.toNumber()) < 1e-9);
    //console.assert(Math.abs(Q_beta.fromVector([0, 1]).toNumber() - beta_vec!.toNumber()) < 1e-9);
    return [field, alpha_vec, beta_vec];
}

function extend_helper(Q_alpha: AlgebraicNumberField, B: Polynomial<Fraction>, C: Polynomial<Fraction>, g: (Fraction|number)[][]): AlgebraicNumber|null {
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
    let B_factor = gcd(B_alpha, C_alpha_x.eval(gamma));
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

export function root(x: AlgebraicNumber, k: bigint) {
    /* Compute the k-th root of x, possibly in a different number field. */
    let field = x.field;
    let coeffs = [x.neg()];
    for (let i=0; i<k-1n; i++)
        coeffs.push(field.fromInt(0));
    coeffs.push(field.fromInt(1));
    let poly = normal(new Polynomial(field, coeffs));
    let lower = fraction(0);
    // bug: what if x is negative?
    let upper = x.interval()[1].add(fraction(1));
    while (count_roots(poly, lower, upper) > 1) {
        let mid = lower.middle(upper);
        if (QQ_nothing.fromVector([power(QQ, mid, k)]).compare(x) < 0)
            lower = mid;
        else
            upper = mid;
    }
    let new_field = new AlgebraicNumberField(poly, lower, upper)
    return new_field.fromVector([0, 1]);
}
