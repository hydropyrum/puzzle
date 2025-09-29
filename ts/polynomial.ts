import { RingElement, Ring, ZZ, Euclidean, DivisionError, power } from './ring';
import { Fraction, fraction, QQ } from './fraction';

export class Polynomial<E extends RingElement<E>> implements RingElement<Polynomial<E>>, Euclidean<Polynomial<E>> {
    coeff_ring: Ring<E>;
    coeffs: E[]; // coeffs[i] is coefficient on x^i
    degree: number;

    constructor(coeff_ring: Ring<E>, coeffs: E[]) {
        this.coeff_ring = coeff_ring;
        this.coeffs = coeffs;
        this.degree = this.coeffs.length-1;
        this.trim();
    }

    trim(): Polynomial<E> {
        while (this.coeffs.length > 0 && this.coeffs[this.coeffs.length-1].equals(this.coeff_ring.zero())) {
            this.coeffs.pop();
            this.degree--;
        }
        return this;
    }

    clone(): Polynomial<E> {
        return new Polynomial(this.coeff_ring, this.coeffs.map(c => c.clone()));
    }

    toString(): string {
        let s = "";
        if (this.degree == -1) return "0";
        for (let i=this.degree; i>=0; i--) {
            if (this.coeffs[i].equals(this.coeff_ring.zero()))
                continue;
            else if (i < this.degree)
                s += " + "

            if (!this.coeffs[i].equals(this.coeff_ring.one()) || i == 0) {
                if (this.coeffs[i] instanceof Polynomial)
                    s += "(" + String(this.coeffs[i]) + ")";
                else
                    s += String(this.coeffs[i]);
            }

            if (i >= 1)
                s += "x";
            if (i > 1) {
                let si = String(i);
                for (let j=0; j<si.length; j++)
                    s += '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(si[j])];
            }
        }
        return s;
    }

    map<E1 extends RingElement<E1>>(K1: Ring<E1>, f: (c: E) => E1): Polynomial<E1> {
        return new Polynomial<E1>(K1, this.coeffs.map(f));
    }

    lc(): E { return this.coeffs[this.degree]; }
    monic(): Polynomial<E> {
        return this.map(this.coeff_ring, c => c.div(this.lc()));
    }

    eval(arg: E): E {
        // Horner's rule
        let sum = this.coeff_ring.zero();
        for (let i=this.degree; i>=0; i--)
            sum = sum.imul(arg).iadd(this.coeffs[i]);
        return sum;
    }

    iadd(b: Polynomial<E>): Polynomial<E> {
        for (let i=0; i<b.coeffs.length; i++) {
            if (i < this.coeffs.length)
                this.coeffs[i].iadd(b.coeffs[i]);
            else {
                this.coeffs.push(b.coeffs[i]);
                this.degree++;
            }
        }
        this.trim();
        return this;
    }
    add(b: Polynomial<E>): Polynomial<E> { return this.clone().iadd(b); }

    neg(): Polynomial<E> {
        return new Polynomial<E>(this.coeff_ring, this.coeffs.map(c => c.neg()));
    }
    isub(b: Polynomial<E>): Polynomial<E> { return this.iadd(b.neg()); }
    sub(b: Polynomial<E>): Polynomial<E> { return this.add(b.neg()); }
        
    mul(b: Polynomial<E>): Polynomial<E> {
        let m = this.degree;
        let n = b.degree;
        let coeffs: E[] = [];
        for (let k=0; k<=m+n; k++) {
            let ck = this.coeff_ring.zero();
            for (let i=Math.max(0,k-n); i<=Math.min(k,m); i++)
                ck.iadd(this.coeffs[i].mul(b.coeffs[k-i]) /*, false*/ );
            //ck.reduce(); // to do: restore
            coeffs.push(ck);
        }
        return new Polynomial<E>(this.coeff_ring, coeffs);
    }
    imul(b: Polynomial<E>): Polynomial<E> {
        let c = this.mul(b);
        this.coeffs = c.coeffs;
        this.degree = c.degree;
        return this;
    }

    ismul(b: E): Polynomial<E> { for (let c of this.coeffs) c.imul(b); this.trim(); return this; }
    smul(b: E): Polynomial<E> { return this.clone().ismul(b); }
    isdiv(b: E): Polynomial<E> { for (let c of this.coeffs) c.idiv(b); this.trim(); return this; }
    sdiv(b: E): Polynomial<E> { return this.clone().isdiv(b); }
    pseudo_divmod(b: Polynomial<E>): [E, Polynomial<E>, Polynomial<E>] {
        let m = this.degree;
        let n = b.degree;
        let p = this.coeff_ring.one();
        if (n == -1) throw new DivisionError("Division by zero");
        // c[0..k-1] is the remainder so far
        // c[k..m] is the quotient so far
        let c = this.coeffs.map(x => x.clone());
        for (let k=m; k>=n; k--) {
            for (let i=0; i<=m; i++)
                if (i != k)
                    c[i].imul(b.coeffs[n]);
            p.imul(b.coeffs[n]);
            for (let i=0; i<n; i++)
                c[k-n+i].isub(c[k].mul(b.coeffs[i]));
        }
        return [p,
                new Polynomial<E>(this.coeff_ring, c.slice(n,m+1)),
                new Polynomial<E>(this.coeff_ring, c.slice(0,n))];
    }

    euclidean(): bigint { return BigInt(this.degree); }
    divmod(b: Polynomial<E>): [Polynomial<E>, Polynomial<E>] {
        let [p, q, r] = this.pseudo_divmod(b);
        q.isdiv(p); r.isdiv(p);
        return [q, r];
    }
    floordiv(y: Polynomial<E>): Polynomial<E> { let [q, r] = this.divmod(y); return q; }
    mod(y: Polynomial<E>): Polynomial<E> { let [q, r] = this.divmod(y); return r; }
    
    div(b: Polynomial<E>): Polynomial<E> {
        if (b.degree == 0) // special faster case
            return new Polynomial<E>(this.coeff_ring, this.coeffs.map(x => x.div(b.coeffs[0])));
        else {
            let [q, r] = this.divmod(b);
            if (r.degree > -1)
                throw new DivisionError("not divisible");
            return q;
        }
    }
    idiv(b: Polynomial<E>): Polynomial<E> {
        let c = this.div(b);
        this.coeffs = c.coeffs;
        this.degree = c.degree;
        return this;
    }

    inv(): Polynomial<E> {
        throw Error("not implemented");
    }
    
    equals(b: Polynomial<E>): boolean {
        if (this.degree != b.degree) return false;
        for (let i=0; i<=this.degree; i++)
            if (!this.coeffs[i].equals(b.coeffs[i])) return false;
        return true;
    }

    derivative(): Polynomial<E> {
        let coeffs: E[] = [];
        for (let i=1; i<=this.degree; i++)
            coeffs.push(this.coeff_ring.fromInt(i).imul(this.coeffs[i]));
        return new Polynomial<E>(this.coeff_ring, coeffs);
    }
}

export function resultant<E extends RingElement<E>>(a: Polynomial<E>, b: Polynomial<E>) {
    let K = a.coeff_ring;
    let res = K.one();
    let res_d = K.one();
    if (a.degree < b.degree) {
        [a, b] = [b, a];
        res.imul(K.fromInt((-1)**(a.degree*b.degree)));
    }
    while (b.degree > 0) {
        let [p, q, r] = a.pseudo_divmod(b);
        res.imul(K.fromInt((-1)**(a.degree*b.degree)));
        res.imul(power(K, b.coeffs[b.degree], BigInt(a.degree-r.degree)));
        res_d.imul(power(K, p, BigInt(b.degree)));
        [a, b] = [b, r];
    }
    if (b.degree == -1) return K.zero();
    res.imul(power(K, b.coeffs[0], BigInt(a.degree)));
    return res.div(res_d);
}

function sturm_sequence(p0: Polynomial<Fraction>, arg: Fraction): number {
    /* Number of sign changes in Sturm sequence at arg. */
    let p1 = p0.derivative();
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

export function count_roots(p: Polynomial<Fraction>, lower: Fraction, upper: Fraction): number {
    /* Number of real roots in interval [lower, upper] */
    return (p.eval(lower).sign() == 0 ? 1 : 0) + sturm_sequence(p, lower) - sturm_sequence(p, upper);
}
        
/* Find an isolating interval for the real root nearest x.
   If there is a tie, chooses the higher root. */
export function isolate_root(p: Polynomial<Fraction>, x: Fraction): [Fraction, Fraction] {
    if (p.degree <= 0) throw new RangeError("can't isolate root of a constant polynomial");
    
    // Bound distance to root
    let bound = p.coeff_ring.zero();
    for (let i=0; i<p.degree; i++)
        if (bound.compare(p.coeffs[i].abs()) > 0)
            bound = p.coeffs[i].abs();
    bound.idiv(p.coeffs[p.degree].abs());
    bound.iadd(p.coeff_ring.one());
    
    // Binary search for distance
    let dmin = p.coeff_ring.zero();
    let dmax = bound.add(x.abs());
    for (let i=0; i<100; i++) {
        let dmid = dmin.middle(dmax);
        let lower = x.sub(dmid);
        let upper = x.add(dmid);
        let c = count_roots(p, lower, upper);
        if (c == 1)
            return [lower, upper];
        else if (c == 0)
            dmin = dmid;
        else /* if (c > 1) */
            dmax = dmid;
    }
    throw new Error(`can't isolate root nearest to ${x} (perhaps there was a tie)`);
}

export function polynomial(coeffs: (Fraction|bigint|number)[]): Polynomial<Fraction> {
    return new Polynomial(QQ, coeffs.map(c => c instanceof Fraction ? c : fraction(c)));
}

export class Polynomials<E extends RingElement<E>> implements Ring<Polynomial<E>> {
    coeff_ring: Ring<E>;
    constructor(coeff_ring: Ring<E>) { this.coeff_ring = coeff_ring; }
    zero(): Polynomial<E> {
        return new Polynomial<E>(this.coeff_ring, []);
    }
    one(): Polynomial<E> {
        return new Polynomial<E>(this.coeff_ring, [this.coeff_ring.one()]);
    }
    fromInt(n: number): Polynomial<E> {
        return new Polynomial<E>(this.coeff_ring, [this.coeff_ring.fromInt(n)]);
    }
}

export const ZZ_x = new Polynomials(ZZ);
export const QQ_x = new Polynomials(QQ);
