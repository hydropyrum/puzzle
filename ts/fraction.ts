/* Similar interface as Fraction.js (https://github.com/infusion/Fraction.js/), but uses JSBI for integers. */

import JSBI from "jsbi";

const jsbi_zero = JSBI.BigInt(0);

function jsbi_abs(x: JSBI): JSBI {
    return JSBI.lessThan(x, jsbi_zero) ? JSBI.unaryMinus(x) : x;
}

function jsbi_sign(x: JSBI): number {
    if (JSBI.equal(x, jsbi_zero)) return 0;
    if (JSBI.lessThan(x, jsbi_zero)) return -1;
    else /*if (JSBI.greaterThan(x, jsbi_zero))*/ return +1;
}

/* Find GCD using Euclid's algorithm. */
function jsbi_gcd(x: JSBI, y: JSBI): JSBI {
    x = jsbi_abs(x);
    y = jsbi_abs(y);
    if (JSBI.lessThan(x, y)) [x, y] = [y, x];
    let r;
    while (JSBI.notEqual(y, jsbi_zero)) {
        r = JSBI.remainder(x, y);
        [x, y] = [y, r];
    }
    return x;
}

export class Fraction {
    n: JSBI;
    d: JSBI;
    constructor(n: JSBI, d: JSBI, reduce: boolean = true) {
        if (JSBI.lessThan(d, jsbi_zero)) {
            n = JSBI.unaryMinus(n);
            d = JSBI.unaryMinus(d);
        } else if (JSBI.equal(d, jsbi_zero)) {
            throw new RangeError("Division by zero");
        }
        this.n = n;
        this.d = d;
        if (reduce) this.reduce();
    }

    reduce(): Fraction {
        let g = jsbi_gcd(this.n, this.d);
        this.n = JSBI.divide(this.n, g);
        this.d = JSBI.divide(this.d, g);
        return this;
    }

    clone(): Fraction { return new Fraction(this.n, this.d, false); }

    toString(): string {
        if (JSBI.EQ(this.d, 1))
            return String(this.n);
        else
            return String(this.n) + '/' + String(this.d);
    }

    toNumber(): number {
        return JSBI.toNumber(this.n)/JSBI.toNumber(this.d);
    }

    ineg(): Fraction { this.n = JSBI.unaryMinus(this.n); return this; }
    neg(): Fraction { return this.clone().ineg(); }
    
    iadd(y: Fraction): Fraction {
        this.n = JSBI.add(JSBI.multiply(this.n, y.d), JSBI.multiply(this.d, y.n));
        this.d = JSBI.multiply(this.d, y.d);
        return this.reduce();
    }
    add(y: Fraction): Fraction { return this.clone().iadd(y); }
    
    isub(y: Fraction): Fraction {
        this.n = JSBI.subtract(JSBI.multiply(this.n, y.d), JSBI.multiply(this.d, y.n));
        this.d = JSBI.multiply(this.d, y.d);
        return this.reduce();
    }
    sub(y: Fraction): Fraction { return this.clone().isub(y); }

    imul(y: Fraction): Fraction {
        this.n = JSBI.multiply(this.n, y.n);
        this.d = JSBI.multiply(this.d, y.d);
        return this;
    }
    mul(y: Fraction): Fraction { return this.clone().imul(y); }

    iinv(): Fraction {
        if (JSBI.equal(this.n, jsbi_zero))
            throw new RangeError("Division by zero");
        [this.n, this.d] = [this.d, this.n];
        return this;
    }
    inverse(): Fraction { return this.clone().iinv(); }

    idiv(y: Fraction): Fraction {
        if (JSBI.equal(y.n, jsbi_zero))
            throw new RangeError("Division by zero");
        this.n = JSBI.multiply(this.n, y.d);
        this.d = JSBI.multiply(this.d, y.n);
        return this;
    }
    div(y: Fraction): Fraction { return this.clone().idiv(y); }
    
    equals(y: Fraction): boolean {
        return JSBI.equal(JSBI.multiply(this.n, y.d), JSBI.multiply(this.d, y.n));
    }
    sign(): number { return jsbi_sign(this.n); }
    compare(y: Fraction): number {
        return jsbi_sign(JSBI.subtract(JSBI.multiply(this.n, y.d), JSBI.multiply(y.n, this.d)));
    }
    iabs(): Fraction { this.n = jsbi_abs(this.n); return this; }
    abs(): Fraction { return this.clone().iabs(); }
}

export function fraction(n: JSBI|number, d: JSBI|number = 1): Fraction {
    if (typeof n === 'number') n = JSBI.BigInt(n);
    if (typeof d === 'number') d = JSBI.BigInt(d);
    return new Fraction(n, d);
}
