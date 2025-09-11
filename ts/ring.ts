export interface RingElement<E> {
    clone(): E;
    equals(y: E): boolean;
    toString(): string;
    toNumber(): number;
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
    // If ring is ordered (otherwise may throw)
    sign(): number; 
    compare(y: E): number;
    abs(): E;
}

export interface Ring<E> {
    zero(): E;
    one(): E;
    fromInt(n: number): E;
}

export class Integer implements RingElement<Integer> {
    n: bigint;
    constructor(n: bigint) { this.n = n; }
    clone(): Integer { return new Integer(this.n); }
    equals(y: Integer): boolean { return this.n == y.n; }
    toString(): string { return String(this.n); }
    toNumber(): number { return Number(this.n); }
    
    iadd(y: Integer): Integer { this.n += y.n; return this; }
    add(y: Integer): Integer { return this.clone().iadd(y); }
    isub(y: Integer): Integer { this.n -= y.n; return this; }
    sub(y: Integer): Integer { return this.clone().isub(y); }
    neg(): Integer { return new Integer(-this.n); }
    imul(y: Integer): Integer { this.n *= y.n; return this; }
    mul(y: Integer): Integer { return this.clone().imul(y); }

    inv(): Integer {
        if (this.n == 1n || this.n == -1n)
            return this.clone();
        else
            throw RangeError("multiplicative inverse does not exist");
    }
    idiv(y: Integer): Integer {
        if (this.n % y.n == 0n)
            this.n /= y.n;
        else
            throw RangeError("not divisible by y");
        return this;
    }
    div(y: Integer): Integer { return this.clone().idiv(y); }
    
    // to do: deduplicate with big_sign and big_abs in fraction.ts
    sign(): number {
        if (this.n == 0n) return 0;
        else if (this.n < 0n) return -1;
        else /* if (this.n > 0n) */ return +1;
    }
    abs(): Integer { return this.n < 0n ? this.neg() : this; }
    compare(y: Integer): number {
        if (this.n == y.n) return 0;
        else if (this.n < y.n) return -1;
        else /* if (this.n > 0n) */ return +1;
    }
}

export class Integers implements Ring<Integer> {
    zero(): Integer { return new Integer(0n); }
    one(): Integer { return new Integer(0n); }
    fromInt(n: number): Integer { return new Integer(BigInt(n)); }
}

export const ZZ = new Integers();

export class IntegerMod implements RingElement<IntegerMod> {
    m: bigint;
    n: bigint;
    constructor(n: bigint, m: bigint) {
        this.n = n;
        this.m = m;
        this.normalize();
    }
    clone(): IntegerMod { return new IntegerMod(this.n, this.m); }
    private check(y: IntegerMod) {
        if (this.m != y.m) throw RangeError("numbers have different moduli");
    }
    private normalize() { this.n = ((this.n % this.m) + this.m) % this.m; }
    
    equals(y: IntegerMod): boolean { this.check(y); return this.n == y.n; }
    toString(): string { return String(this.n); }
    toNumber(): number { return Number(this.n); }
    
    iadd(y: IntegerMod): IntegerMod {
        this.check(y);
        this.n += y.n;
        this.normalize();
        return this;
    }
    add(y: IntegerMod): IntegerMod { return this.clone().iadd(y); }
    isub(y: IntegerMod): IntegerMod {
        this.check(y);
        this.n -= y.n;
        this.normalize();
        return this;
    }
    sub(y: IntegerMod): IntegerMod { return this.clone().isub(y); }
    neg(): IntegerMod { return new IntegerMod(-this.n, this.m); }
    imul(y: IntegerMod): IntegerMod {
        this.check(y);
        this.n *= y.n;
        this.normalize();
        return this;
    }
    mul(y: IntegerMod): IntegerMod { return this.clone().imul(y); }

    idiv(y: IntegerMod): IntegerMod {
        this.check(y);
        let [r, s, t] = extended_gcd(y.n, this.m);
        if (this.n % r == 0n) {
            this.n = s * (this.n / r);
            this.normalize();
            return this;
        } else
            throw new RangeError("Division by zero");
    }
    div(y: IntegerMod): IntegerMod { return this.clone().idiv(y); }
    inv(): IntegerMod {
        let [r, s, t] = extended_gcd(this.n, this.m);
        if (r == 1n) {
            return new IntegerMod(s, this.m)
        } else
            throw new RangeError("Division by zero");
    }

    // These don't make sense mod m
    sign(): number { throw TypeError('unsupported operation') }
    abs(): IntegerMod { throw TypeError('unsupported operation') }
    compare(y: IntegerMod): number { throw TypeError('unsupported operation') }
}

export class IntegersMod implements Ring<IntegerMod> {
    m: bigint;
    constructor(m: bigint) { this.m = m; }
    zero(): IntegerMod { return new IntegerMod(0n, this.m); }
    one(): IntegerMod { return new IntegerMod(0n, this.m); }
    fromInt(n: number): IntegerMod { return new IntegerMod(BigInt(n), this.m); }
}

export function extended_gcd(a: bigint, b: bigint) {
    /* Extended Euclid: Find r, s, t such that r = as + bt */
    let [r0, r1] = [a, b];
    let [s0, s1] = [1n, 0n];
    let [t0, t1] = [0n, 1n];
    while (r1 != 0n) {
        let [q, r2] = [r0/r1, r0%r1];
        [r0, r1] = [r1, r2];
        [s0, s1] = [s1, s0 - q*s1];
        [t0, t1] = [t1, t0 - q*t1];
    }
    return [r0, s0, t0];
}
