import { AlgebraicNumberField, algebraicNumberField, AlgebraicNumber } from './exact';
import { polynomial } from './polynomial';
import { fraction } from './fraction';

// ℚ(√2,√3)
let K = algebraicNumberField([1, 0, -10, 0, 1], fraction(3146264,1000000));

let vals = [
    {c: [fraction(0), fraction(0), fraction(0), fraction(0)], a: 0},
    {c: [fraction(1), fraction(0), fraction(0), fraction(0)], a: 1},
    {c: [fraction(-1), fraction(0), fraction(0), fraction(0)], a: -1},
    {c: [fraction(0), fraction(-9,2), fraction(0), fraction(1,2)], a: Math.sqrt(2)},
    {c: [fraction(0), fraction(-9,4), fraction(0), fraction(1,4)], a: Math.sqrt(2)/2},
    {c: [fraction(0), fraction(11,2), fraction(0), fraction(-1,2)], a: Math.sqrt(3)}
    //{c: [fraction(0), fraction(-9*1224744871391589,2*1000000000000000), fraction(0), fraction(1*1224744871391589,2*1000000000000000)], a: Math.sqrt(2)*1.224744871391589} // very close to sqrt(3)
];

test('toNumber', () => {
    for (let val of vals)
        expect(K.fromVector(val.c).toNumber()).toBeCloseTo(val.a);
})

test('equals', () => {
    for (let a of vals.map(v => K.fromVector(v.c)))
        for (let b of vals.map(v => K.fromVector(v.c))) {
            if (a.equals(b))
                expect(a.toNumber()).toBeCloseTo(b.toNumber(), 15);
            else
                expect(a.toNumber()).not.toBeCloseTo(b.toNumber(), 15);
        }
});

test('add', () => {
    for (let a of vals)
        for (let b of vals)
            expect(K.fromVector(a.c).add(K.fromVector(b.c)).toNumber()).toBeCloseTo(a.a + b.a);
});
test('neg', () => {
    for (let a of vals)
        expect(K.fromVector(a.c).neg().toNumber()).toBeCloseTo(-a.a);
});
test('sub', () => {
    for (let a of vals)
        for (let b of vals)
            expect(K.fromVector(a.c).sub(K.fromVector(b.c)).toNumber()).toBeCloseTo(a.a - b.a);
});
test('mul', () => {
    for (let a of vals)
        for (let b of vals)
            expect(K.fromVector(a.c).mul(K.fromVector(b.c)).toNumber()).toBeCloseTo(a.a * b.a);
});
test('inv', () => {
    for (let a of vals) {
        let p = K.fromVector(a.c);
        if (!p.isZero())
            expect(p.inv().toNumber()).toBeCloseTo(1/a.a);
        else
            expect(() => p.inv()).toThrow("Division by zero");
    }
});
test('divide', () => {
    for (let a of vals)
        for (let b of vals) {
            let ap = K.fromVector(a.c), bp = K.fromVector(b.c);
            if (!bp.isZero())
                expect(ap.div(bp).toNumber()).toBeCloseTo(a.a / b.a);
            else
                expect(() => ap.div(bp)).toThrow("Division by zero");
        }
});

test('sign', () => {
    for (let a of vals.map(v => K.fromVector(v.c)))
        expect(a.sign()).toBe(Math.sign(a.toNumber()));
});
