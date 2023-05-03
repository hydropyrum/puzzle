import { AlgebraicNumberField, algebraicNumberField } from './exact';
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
        expect(K.toNumber(polynomial(val.c))).toBeCloseTo(val.a);
})

test('equal', () => {
    for (let a of vals.map(v => polynomial(v.c)))
        for (let b of vals.map(v => polynomial(v.c))) {
            if (K.equal(a,b))
                expect(K.toNumber(a)).toBeCloseTo(K.toNumber(b), 15);
            else
                expect(K.toNumber(a)).not.toBeCloseTo(K.toNumber(b), 15);
        }
});

test('add', () => {
    for (let a of vals)
        for (let b of vals)
            expect(K.toNumber(K.add(polynomial(a.c), polynomial(b.c)))).toBeCloseTo(a.a + b.a);
});
test('unaryMinus', () => {
    for (let a of vals)
        expect(K.toNumber(K.unaryMinus(polynomial(a.c)))).toBeCloseTo(-a.a);
});
test('subtract', () => {
    for (let a of vals)
        for (let b of vals)
            expect(K.toNumber(K.subtract(polynomial(a.c), polynomial(b.c)))).toBeCloseTo(a.a - b.a);
});
test('multiply', () => {
    for (let a of vals)
        for (let b of vals)
            expect(K.toNumber(K.multiply(polynomial(a.c), polynomial(b.c)))).toBeCloseTo(a.a * b.a);
});
test('invert', () => {
    for (let a of vals) {
        let p = polynomial(a.c);
        if (p.degree >= 0)
            expect(K.toNumber(K.invert(p))).toBeCloseTo(1/a.a);
        else
            expect(() => K.invert(p)).toThrow("Division by zero");
    }
});
test('divide', () => {
    for (let a of vals)
        for (let b of vals) {
            let ap = polynomial(a.c), bp = polynomial(b.c);
            if (bp.degree >= 0)
                expect(K.toNumber(K.divide(ap, bp))).toBeCloseTo(a.a / b.a);
            else
                expect(() => K.divide(ap, bp)).toThrow("Division by zero");
        }
});

test('lessThan', () => {
    for (let a of vals.map(v => polynomial(v.c)))
        for (let b of vals.map(v => polynomial(v.c)))
            expect(K.lessThan(a,b)).toBe(K.toNumber(a) < K.toNumber(b));
});
test('lessThanOrEqual', () => {
    for (let a of vals.map(v => polynomial(v.c)))
        for (let b of vals.map(v => polynomial(v.c)))
            expect(K.lessThanOrEqual(a,b)).toBe(K.toNumber(a) <= K.toNumber(b));
});
test('greaterThan', () => {
    for (let a of vals.map(v => polynomial(v.c)))
        for (let b of vals.map(v => polynomial(v.c)))
            expect(K.greaterThan(a,b)).toBe(K.toNumber(a) > K.toNumber(b));
});
test('greaterThanOrEqual', () => {
    for (let a of vals.map(v => polynomial(v.c)))
        for (let b of vals.map(v => polynomial(v.c)))
            expect(K.greaterThanOrEqual(a,b)).toBe(K.toNumber(a) >= K.toNumber(b));
});
