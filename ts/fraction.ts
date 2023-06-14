function big_abs(x: bigint): bigint {
    return x < 0n ? -x : x;
}

function big_sign(x: bigint): number {
    if (x == 0n) return 0;
    else if (x < 0n) return -1;
    else /* if (x > 0n) */ return +1;
}

/* Find GCD using Euclid's algorithm. */
function big_gcd(x: bigint, y: bigint): bigint {
    x = big_abs(x);
    y = big_abs(y);
    if (x < y)
        [x, y] = [y, x];
    while (y !== 0n)
        [x, y] = [y, x % y];
    return x;
}

export class Fraction {
    n: bigint;
    d: bigint;
    constructor(n: bigint, d: bigint, reduce: boolean = true) {
        if (d < 0n) {
            n = -n;
            d = -d;
        } else if (d == 0n) {
            throw new RangeError("Division by zero");
        }
        this.n = n;
        this.d = d;
        if (reduce) this.reduce();
    }

    reduce(): Fraction {
        let g = big_gcd(this.n, this.d);
        this.n /= g;
        this.d /= g;
        return this;
    }

    clone(): Fraction { return new Fraction(this.n, this.d, false); }

    toString(): string {
        if (this.d == 1n)
            return String(this.n);
        else
            return String(this.n) + '/' + String(this.d);
    }

    toNumber(): number {
        return Number(this.n)/Number(this.d);
    }

    ineg(): Fraction { this.n = -this.n; return this; }
    neg(): Fraction { return this.clone().ineg(); }
    
    iadd(y: Fraction, reduce: boolean = true): Fraction {
        this.n = this.n * y.d + this.d * y.n;
        this.d *= y.d;
        if (reduce) this.reduce();
        return this;
    }
    add(y: Fraction): Fraction { return this.clone().iadd(y); }
    
    isub(y: Fraction): Fraction {
        this.n = this.n * y.d - this.d * y.n;
        this.d *= y.d;
        return this.reduce();
    }
    sub(y: Fraction): Fraction { return this.clone().isub(y); }

    imul(y: Fraction, reduce: boolean = true): Fraction {
        this.n *= y.n;
        this.d *= y.d;
        if (reduce) this.reduce();
        return this;
    }
    mul(y: Fraction): Fraction { return this.clone().imul(y); }

    iinv(): Fraction {
        if (this.n > 0n) {
            [this.n, this.d] = [this.d, this.n];
        } else if (this.n < 0n) {
            [this.n, this.d] = [-this.d, -this.n];
        } else /* if (this.n == 0n) */ {
            throw new RangeError("Division by zero");
        }
        return this;
    }
    inv(): Fraction { return this.clone().iinv(); }

    idiv(y: Fraction): Fraction {
        if (y.n > 0n) {
            this.n *= y.d;
            this.d *= y.n;
        } else if (y.n < 0n) {
            this.n *= -y.d;
            this.d *= -y.n;
        } else /* if (y.n == 0n) */ {
            throw new RangeError("Division by zero");
        }
        return this;
    }
    div(y: Fraction): Fraction { return this.clone().idiv(y); }
    
    equals(y: Fraction): boolean {
        return this.n * y.d == this.d * y.n;
    }
    sign(): number { return big_sign(this.n); }
    compare(y: Fraction): number {
        return big_sign(this.n * y.d - y.n * this.d);
    }
    iabs(): Fraction { this.n = big_abs(this.n); return this; }
    abs(): Fraction { return this.clone().iabs(); }

    /* Find a fraction between this and y that doesn't increase denominator too much */
    middle(y: Fraction): Fraction {
        let x = this;
        let d = x.d * y.d / big_gcd(x.d, y.d);
        let xn = x.n * d / x.d;
        let yn = y.n * d / y.d;
        if (xn > yn)
            [xn, yn] = [yn, xn];
        if (yn - xn >= 2n)
            return new Fraction((xn+yn)/2n, d);
        else
            return new Fraction(xn+yn, 2n*d);
    }
}

export function fraction(n: bigint|number, d: bigint|number = 1): Fraction {
    if (typeof n === 'number') n = BigInt(n);
    if (typeof d === 'number') d = BigInt(d);
    return new Fraction(n as bigint, d);
}
