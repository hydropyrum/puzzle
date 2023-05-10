import { AlgebraicNumberField, algebraicNumberField, AlgebraicNumber } from './exact';
import { polynomial } from './polynomial';
import { fraction } from './fraction';

// ℚ(√2,√3)
let K = algebraicNumberField([1, 0, -10, 0, 1], Math.sqrt(2)+Math.sqrt(3));

let vals = [
    {c: [fraction(0), fraction(0), fraction(0), fraction(0)], a: 0},
    {c: [fraction(1), fraction(0), fraction(0), fraction(0)], a: 1},
    {c: [fraction(-1), fraction(0), fraction(0), fraction(0)], a: -1},
    {c: [fraction(0), fraction(-9,2), fraction(0), fraction(1,2)], a: Math.sqrt(2)},
    {c: [fraction(0), fraction(-9,4), fraction(0), fraction(1,4)], a: Math.sqrt(2)/2},
    {c: [fraction(0), fraction(11,2), fraction(0), fraction(-1,2)], a: Math.sqrt(3)},
    {c: [fraction(0), fraction(-9*1224744871391589,2*1000000000000000), fraction(0), fraction(1*1224744871391589,2*1000000000000000)], a: Math.sqrt(2)*1.224744871391589} // very close to sqrt(3)
];

test('toNumber', () => {
    for (let val of vals)
        expect(AlgebraicNumber.toNumber(K.fromVector(val.c))).toBeCloseTo(val.a);
})

test('equal', () => {
    for (let a of vals.map(v => K.fromVector(v.c)))
        for (let b of vals.map(v => K.fromVector(v.c))) {
            if (AlgebraicNumber.equal(a,b))
                expect(AlgebraicNumber.toNumber(a)).toBeCloseTo(AlgebraicNumber.toNumber(b), 15);
            else
                expect(AlgebraicNumber.toNumber(a)).not.toBeCloseTo(AlgebraicNumber.toNumber(b), 15);
        }
});

test('add', () => {
    for (let a of vals)
        for (let b of vals)
            expect(AlgebraicNumber.toNumber(AlgebraicNumber.add(K.fromVector(a.c), K.fromVector(b.c)))).toBeCloseTo(a.a + b.a);
});
test('unaryMinus', () => {
    for (let a of vals)
        expect(AlgebraicNumber.toNumber(AlgebraicNumber.unaryMinus(K.fromVector(a.c)))).toBeCloseTo(-a.a);
});
test('subtract', () => {
    for (let a of vals)
        for (let b of vals)
            expect(AlgebraicNumber.toNumber(AlgebraicNumber.subtract(K.fromVector(a.c), K.fromVector(b.c)))).toBeCloseTo(a.a - b.a);
});
test('multiply', () => {
    for (let a of vals)
        for (let b of vals)
            expect(AlgebraicNumber.toNumber(AlgebraicNumber.multiply(K.fromVector(a.c), K.fromVector(b.c)))).toBeCloseTo(a.a * b.a);
});
test('invert', () => {
    for (let a of vals) {
        let p = K.fromVector(a.c);
        if (!AlgebraicNumber.isZero(p))
            expect(AlgebraicNumber.toNumber(AlgebraicNumber.invert(p))).toBeCloseTo(1/a.a);
        else
            expect(() => AlgebraicNumber.invert(p)).toThrow("Division by zero");
    }
});
test('divide', () => {
    for (let a of vals)
        for (let b of vals) {
            let ap = K.fromVector(a.c), bp = K.fromVector(b.c);
            if (!AlgebraicNumber.isZero(bp))
                expect(AlgebraicNumber.toNumber(AlgebraicNumber.divide(ap, bp))).toBeCloseTo(a.a / b.a);
            else
                expect(() => AlgebraicNumber.divide(ap, bp)).toThrow("Division by zero");
        }
});

test('lessThan', () => {
    for (let a of vals.map(v => K.fromVector(v.c)))
        for (let b of vals.map(v => K.fromVector(v.c)))
            expect(AlgebraicNumber.lessThan(a,b)).toBe(AlgebraicNumber.toNumber(a) < AlgebraicNumber.toNumber(b));
});
test('lessThanOrEqual', () => {
    for (let a of vals.map(v => K.fromVector(v.c)))
        for (let b of vals.map(v => K.fromVector(v.c)))
            expect(AlgebraicNumber.lessThanOrEqual(a,b)).toBe(AlgebraicNumber.toNumber(a) <= AlgebraicNumber.toNumber(b));
});
test('greaterThan', () => {
    for (let a of vals.map(v => K.fromVector(v.c)))
        for (let b of vals.map(v => K.fromVector(v.c)))
            expect(AlgebraicNumber.greaterThan(a,b)).toBe(AlgebraicNumber.toNumber(a) > AlgebraicNumber.toNumber(b));
});
test('greaterThanOrEqual', () => {
    for (let a of vals.map(v => K.fromVector(v.c)))
        for (let b of vals.map(v => K.fromVector(v.c)))
            expect(AlgebraicNumber.greaterThanOrEqual(a,b)).toBe(AlgebraicNumber.toNumber(a) >= AlgebraicNumber.toNumber(b));
});

test('sign', () => {
    for (let a of vals.map(v => K.fromVector(v.c)))
        expect(AlgebraicNumber.sign(a)).toBe(Math.sign(AlgebraicNumber.toNumber(a)));
});
