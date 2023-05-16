/* Similar interface as Fraction.js (https://github.com/infusion/Fraction.js/), but uses JSBI for integers. */

import JSBI from "jsbi";

function jsbi_abs(x: JSBI): JSBI {
    return JSBI.LT(x, 0) ? JSBI.unaryMinus(x) : x;
}

function jsbi_sign(x: JSBI): number {
    if (JSBI.EQ(x, 0)) return 0;
    else if (JSBI.LT(x, 0)) return -1;
    else /* if (JSBI.GT(x, 0)) */ return +1;
}

/* Find GCD using Euclid's algorithm. */
function jsbi_gcd(x: JSBI, y: JSBI) {
    x = jsbi_abs(x);
    y = jsbi_abs(y);
    if (JSBI.lessThan(x, y)) [x, y] = [y, x];
    let r;
    while (JSBI.NE(y, 0)) {
        r = JSBI.remainder(x, y);
        [x, y] = [y, r];
    }
    return x;
}

export class Fraction {
    n: JSBI;
    d: JSBI;
    constructor(n: JSBI, d: JSBI, reduce: boolean = true) {
        if (JSBI.LT(d, 0)) {
            n = JSBI.unaryMinus(n);
            d = JSBI.unaryMinus(d);
        } else if (JSBI.EQ(d, 0)) {
            throw new RangeError("Division by zero");
        }
        if (reduce) {
            let g = jsbi_gcd(n, d);
            n = JSBI.divide(n, g);
            d = JSBI.divide(d, g);
        }
        this.n = n;
        this.d = d;
    }

    toString(): string {
        if (JSBI.EQ(this.d, 1))
            return String(this.n);
        else
            return String(this.n) + '/' + String(this.d);
    }

    toNumber(): number {
        return JSBI.toNumber(this.n)/JSBI.toNumber(this.d);
    }
    
    neg() {
        return new Fraction(JSBI.unaryMinus(this.n), this.d, false);
    }
    add(y: Fraction) {
        return new Fraction(
            JSBI.add(JSBI.multiply(this.n, y.d), JSBI.multiply(this.d, y.n)),
            JSBI.multiply(this.d, y.d)
        );
    }
    sub(y: Fraction) { return this.add(y.neg()); }
    mul(y: Fraction) {
        return new Fraction(
            JSBI.multiply(this.n, y.n),
            JSBI.multiply(this.d, y.d)
        );
    }
    inverse() { return new Fraction(this.d, this.n, false); }
    div(y: Fraction) { return this.mul(y.inverse()); }
    
    equals(y: Fraction) { return JSBI.EQ(this.sub(y).n, 0); }
    sign(): number { return jsbi_sign(this.n); }
    compare(y: Fraction): number { return jsbi_sign(this.sub(y).n); }
    abs(): Fraction { return new Fraction(jsbi_abs(this.n), this.d); }
}

export function fraction(n: JSBI|number, d: JSBI|number = 1) {
    if (typeof n === 'number') n = JSBI.BigInt(n);
    if (typeof d === 'number') d = JSBI.BigInt(d);
    return new Fraction(n, d);
}
