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
