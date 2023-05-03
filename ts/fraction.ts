import JSBI from "jsbi";

function jsbi_abs(x: JSBI): JSBI {
    return JSBI.LT(x, 0) ? JSBI.unaryMinus(x) : x;
}

/* Find GCD using Euclid's algorithm. 
 * To do: use binary version (https://en.wikipedia.org/wiki/Binary_GCD_algorithm)?
 */
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
    constructor(n: JSBI, d: JSBI) {
        if (JSBI.LT(d, 0)) {
            n = JSBI.unaryMinus(n);
            d = JSBI.unaryMinus(d);
        } else if (JSBI.EQ(d, 0)) {
            throw new RangeError("Division by zero");
        }
        this.n = n;
        this.d = d;
    }

    reduce(): Fraction {
        let g = jsbi_gcd(this.n, this.d);
        this.n = JSBI.divide(this.n, g);
        this.d = JSBI.divide(this.d, g);
        return this;
    }

    toString(): String {
        if (JSBI.EQ(this.d, 1))
            return String(this.n);
        else
            return String(this.n) + '/' + String(this.d);
    }

    toNumber(): number {
        return JSBI.toNumber(this.n)/JSBI.toNumber(this.d);
    }
    
    static unaryMinus(x: Fraction) {
        return new Fraction(JSBI.unaryMinus(x.n), x.d);
    }
    static add(x: Fraction, y: Fraction) {
        return new Fraction(
            JSBI.add(JSBI.multiply(x.n, y.d), JSBI.multiply(x.d, y.n)),
            JSBI.multiply(x.d, y.d)
        ).reduce();
    }
    static subtract(x: Fraction, y: Fraction) {
        return Fraction.add(x, Fraction.unaryMinus(y));
    }
    static multiply(x: Fraction, y: Fraction) {
        return new Fraction(
            JSBI.multiply(x.n, y.n),
            JSBI.multiply(x.d, y.d)
        ).reduce();
    }
    static invert(x: Fraction) {
        return new Fraction(x.d, x.n);
    }
    static divide(x: Fraction, y: Fraction) {
        return Fraction.multiply(x, Fraction.invert(y));
    }
    static lessThan(x: Fraction, y: Fraction) {
        return JSBI.LT(Fraction.subtract(x, y).n, 0);
    }
    static greaterThan(x: Fraction, y: Fraction) {
        return JSBI.GT(Fraction.subtract(x, y).n, 0);
    }
    static equal(x: Fraction, y: Fraction) {
        return JSBI.EQ(Fraction.subtract(x, y).n, 0);
    }
    static sign(x: Fraction): number {
        if (JSBI.EQ(x.n, 0)) return 0;
        else if (JSBI.LT(x.n, 0)) return -1;
        else /* if (JSBI.GT(x.n, 0)) */ return +1;
    }
    static abs(x: Fraction): Fraction {
        return JSBI.GE(x.n, 0) ? x : Fraction.unaryMinus(x);
    }
}

export function fraction(n: JSBI|number, d: JSBI|number = 1) {
    if (typeof n === 'number') n = JSBI.BigInt(n);
    if (typeof d === 'number') d = JSBI.BigInt(d);
    return new Fraction(n, d).reduce();
}
