import { extended_gcd as bigint_extended_gcd, sign, abs } from './bigutils';

export class DivisionError extends Error {
    constructor(message: string, public errorCode?: number) {
        super(message);
        this.name = "DivisionError";
        Object.setPrototypeOf(this, DivisionError.prototype);
    }
}

export interface RingElement<E> {
    clone(): E;
    equals(y: E): boolean;
    toString(): string;
    iadd(y: E): E;
    add(y: E): E;
    isub(y: E): E;
    sub(y: E): E;
    neg(): E;
    imul(y: E): E;
    mul(y: E): E;
    // If ring is a field (otherwise may throw)
    idiv(y: E): E;
    div(y: E): E;
    inv(): E;
}

export interface Euclidean<E> {
    euclidean(): bigint;
    divmod(y: E): [E, E];
    floordiv(y: E): E;
    mod(y: E): E;
}

export interface Ordered<E> {
    toNumber(): number;
    sign(): number; 
    compare(y: E): number;
    abs(): E;
}

export interface Ring<E> {
    zero(): E;
    one(): E;
    fromInt(n: number): E;
}

export class Integer implements RingElement<Integer>, Euclidean<Integer>, Ordered<Integer> {
    n: bigint;
    constructor(n: bigint) { this.n = n; }
    clone(): Integer { return new Integer(this.n); }
    equals(y: Integer): boolean { return this.n == y.n; }
    toString(): string { return String(this.n); }
    
    iadd(y: Integer): Integer { this.n += y.n; return this; }
    add(y: Integer): Integer { return this.clone().iadd(y); }
    isub(y: Integer): Integer { this.n -= y.n; return this; }
    sub(y: Integer): Integer { return this.clone().isub(y); }
    neg(): Integer { return new Integer(-this.n); }
    imul(y: Integer): Integer { this.n *= y.n; return this; }
    mul(y: Integer): Integer { return this.clone().imul(y); }

    euclidean(): bigint { return abs(this.n); }
    divmod(y: Integer): [Integer, Integer] {
        if (y.n <= 0n) throw new DivisionError('Division by zero');
        let [q, r] = [this.n/y.n, this.n%y.n];
        if (r < 0) {
            q -= 1n;
            r += y.n;
        }
        return [new Integer(q), new Integer(r)];
    }
    floordiv(y: Integer): Integer { let [q, r] = this.divmod(y); return q; }
    mod(y: Integer): Integer { let [q, r] = this.divmod(y); return r; }

    inv(): Integer {
        if (this.n == 1n || this.n == -1n)
            return this.clone();
        else
            throw new DivisionError("Multiplicative inverse does not exist");
    }
    idiv(y: Integer): Integer {
        if (this.n % y.n == 0n)
            this.n /= y.n;
        else
            throw new DivisionError("Not divisible");
        return this;
    }
    div(y: Integer): Integer { return this.clone().idiv(y); }
    
    toNumber(): number { return Number(this.n); }
    sign(): number { return sign(this.n); }
    abs(): Integer { return new Integer(abs(this.n)); }
    compare(y: Integer): number {
        if (this.n == y.n) return 0;
        else if (this.n < y.n) return -1;
        else /* if (this.n > 0n) */ return +1;
    }
}

export class Integers implements Ring<Integer> {
    zero(): Integer { return new Integer(0n); }
    one(): Integer { return new Integer(1n); }
    fromInt(n: number): Integer { return new Integer(BigInt(n)); }
}

export const ZZ = new Integers();

export class IntegerMod implements RingElement<IntegerMod> {
    m: bigint;
    n: bigint;
    constructor(n: bigint, m: bigint) {
        this.n = n;
        this.m = m;
        this.reduce();
    }
    clone(): IntegerMod { return new IntegerMod(this.n, this.m); }
    private check(y: IntegerMod) {
        if (this.m != y.m) throw new TypeError("Numbers have different moduli");
    }
    private reduce() { this.n = ((this.n % this.m) + this.m) % this.m; }
    
    equals(y: IntegerMod): boolean { this.check(y); return this.n == y.n; }
    toString(): string { return String(this.n); }
    
    iadd(y: IntegerMod): IntegerMod {
        this.check(y);
        this.n += y.n;
        this.reduce();
        return this;
    }
    add(y: IntegerMod): IntegerMod { return this.clone().iadd(y); }
    isub(y: IntegerMod): IntegerMod {
        this.check(y);
        this.n -= y.n;
        this.reduce();
        return this;
    }
    sub(y: IntegerMod): IntegerMod { return this.clone().isub(y); }
    neg(): IntegerMod { return new IntegerMod(-this.n, this.m); }
    imul(y: IntegerMod): IntegerMod {
        this.check(y);
        this.n *= y.n;
        this.reduce();
        return this;
    }
    mul(y: IntegerMod): IntegerMod { return this.clone().imul(y); }

    idiv(y: IntegerMod): IntegerMod {
        this.check(y);
        let [r, s, t] = bigint_extended_gcd(y.n, this.m);
        if (this.n % r == 0n) {
            this.n = s * (this.n / r);
            this.reduce();
            return this;
        } else
            throw new DivisionError("Not divisible");
    }
    div(y: IntegerMod): IntegerMod { return this.clone().idiv(y); }
    inv(): IntegerMod {
        let [r, s, t] = bigint_extended_gcd(this.n, this.m);
        if (r == 1n) {
            return new IntegerMod(s, this.m)
        } else
            throw new DivisionError("Multiplicative inverse does not exist");
    }
}

export class IntegersMod implements Ring<IntegerMod> {
    m: bigint;
    constructor(m: bigint) { this.m = m; }
    zero(): IntegerMod { return new IntegerMod(0n, this.m); }
    one(): IntegerMod { return new IntegerMod(1n, this.m); }
    fromInt(n: number): IntegerMod { return new IntegerMod(BigInt(n), this.m); }
}

export function power<E extends RingElement<E>>(K: Ring<E>, g: E, n: bigint) {
    /* Compute g**n by repeated squaring. Cohen, Algorithm 1.2.1. */
    if (n < 0) throw new RangeError();
    // k = 0
    let y = K.one();
    let z = g;
    let m = n;
    while (m > 0n) {
        // invariant: g^n = (g^(m * 2^k)) * y, z = g^(2^k)
        if (m % 2n == 1n) {
            y = y.mul(z);
            m--;
        } else {
            z = z.mul(z);
            // k += 1
            m /= 2n;
        }
    }
    return y;
}

export function power_mod<E extends RingElement<E> & Euclidean<E>>(K: Ring<E>, g: E, n: bigint, q: E) {
    let y = K.one();
    let z = g;
    let m = n;
    while (m > 0n) {
        if (m % 2n == 1n) {
            y = y.mul(z).mod(q);
            m--;
        } else {
            z = z.mul(z).mod(q);
            m /= 2n;
        }
    }
    return y;
}

export function product<E extends RingElement<E>>(K: Ring<E>, xs: E[]) {
    let prod = K.one();
    for (let x of xs)
        prod = prod.mul(x);
    return prod;
}

export function gcd<E extends RingElement<E> & Euclidean<E>>(K: Ring<E>, x: E, y: E): E {
    if (x.euclidean() < y.euclidean())
        [x, y] = [y, x];
    while (!y.equals(K.zero()))
        [x, [,y]] = [y, x.divmod(y)];
    return x;
}

export function extended_gcd<E extends RingElement<E> & Euclidean<E>>(K: Ring<E>, x: E, y: E): [E, E, E] {
    /* Returns r, s, and t such that r = xs+yt. */
    let swap = false;
    if (x.euclidean() < y.euclidean()) {
        [x, y] = [y, x];
        swap = true;
    }
    
    let [r0, r1] = [x, y];
    let [s0, s1] = [K.one(), K.zero()];
    let [t0, t1] = [K.zero(), K.one()];

    // Invariant: x*s + y*t == r
    while (!r1.equals(K.zero())) {
        let [q, r2] = r0.divmod(r1);
        [r0, r1] = [r1, r2];
        [s0, s1] = [s1, s0.sub(q.mul(s1))];
        [t0, t1] = [t1, t0.sub(q.mul(t1))];
    }

    if (swap)
        [s0, t0] = [t0, s0];
    return [r0, s0, t0];
}
