import { RingElement, Ring, Ordered } from './ring';
import { gcd, sign, abs } from './bigutils';

export class Fraction implements RingElement<Fraction>, Ordered<Fraction> {
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
    
    clone(): Fraction { return new Fraction(this.n, this.d, false); }
    
    equals(y: Fraction): boolean {
        return this.n * y.d == this.d * y.n;
    }
    
    reduce(): Fraction {
        let g = gcd(this.n, this.d);
        this.n /= g;
        this.d /= g;
        return this;
    }


    toString(): string {
        if (this.d == 1n)
            return String(this.n);
        else
            return String(this.n) + '/' + String(this.d);
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
        this.reduce();
        return this;
    }
    div(y: Fraction): Fraction { return this.clone().idiv(y); }
    
    toNumber(): number {
        let [a,b] = [this.n, this.d];
        if (a == 0n) return 0;
        let e = 0;
        // Want b/2 <= a < b
        while (abs(2n*a) < abs(b)) {
            a *= 2n;
            e--;
        }
        while (abs(a) >= abs(b)) {
            b *= 2n;
            e++;
        }
        const p = 53;
        let x = Number(a*2n**BigInt(p)/b)*2**(e-p);
        return x;
    }
    sign(): number { return sign(this.n); }
    compare(y: Fraction): number {
        return sign(this.n * y.d - y.n * this.d);
    }
    iabs(): Fraction { this.n = abs(this.n); return this; }
    abs(): Fraction { return this.clone().iabs(); }

    /* Find a fraction between this and y whose denominator is a power of 2 */
    middle(y: Fraction): Fraction {
        let x = this;
        if (x.equals(y)) return x;
        let d = 1n;
        while (y.sub(x).abs().compare(fraction(1n,d)) <= 0)
            d *= 2n;
        let m = x.add(y).imul(fraction(d, 2n));
        m.iadd(fraction(BigInt(m.sign()), 2n));
        let n = m.n / m.d;
        return new Fraction(n, d);
    }
}

export function fraction(n: bigint|number, d: bigint|number = 1): Fraction {
    if (typeof n === 'number') n = BigInt(n);
    if (typeof d === 'number') d = BigInt(d);
    return new Fraction(n as bigint, d);
}

class Fractions implements Ring<Fraction> {
    zero(): Fraction { return new Fraction(0n, 1n); }
    one(): Fraction { return new Fraction(1n, 1n); }
    fromInt(n: number): Fraction { return new Fraction(BigInt(n), 1n); }
}

export const QQ = new Fractions();
