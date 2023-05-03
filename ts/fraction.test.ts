import { Fraction, fraction } from './fraction';
import JSBI from 'jsbi';

let fracs = [
    {n: -1, d: 1, s: "-1"},
    {n: 0, d: 1, s: "0"},
    {n: 1, d: 1, s: "1"},
    {n: -1, d: 2, s: "-1/2"},
    {n: 1, d: 2, s: "1/2"},
    {n: -2, d: 3, s: "-2/3"},
    {n: -1, d: 3, s: "-1/3"},
    {n: 1, d: 3, s: "1/3"},
    {n: 2, d: 3, s: "2/3"},
    {n: -3, d: 4, s: "-3/4"},
    {n: -1, d: 4, s: "-1/4"},
    {n: 1, d: 4, s: "1/4"},
    {n: 3, d: 4, s: "3/4"}
];

let unreduced_fracs =[
    {n: -2, d: 2, s: "-1"},
    {n: 0, d: 2, s: "0"},
    {n: 2, d: 2, s: "1"},
    {n: -2, d: 4, s: "-1/2"},
    {n: 2, d: 4, s: "1/2"}
];

test('toString', () => {
    for (let frac of fracs.concat(unreduced_fracs))
        expect(String(fraction(frac.n, frac.d))).toBe(frac.s);
});

test('toNumber', () => {
    for (let frac of fracs.concat(unreduced_fracs))
        expect(Fraction.toNumber(fraction(frac.n, frac.d)))
            .toBeCloseTo(frac.n/frac.d);
});

test('unaryMinus', () => {
    for (let frac of fracs)
        expect(Fraction.toNumber(Fraction.unaryMinus(fraction(frac.n, frac.d))))
            .toBeCloseTo(-frac.n/frac.d);
});

test('add', () => {
    for (let a of fracs)
        for (let b of fracs)
            expect(Fraction.toNumber(Fraction.add(fraction(a.n, a.d), fraction(b.n, b.d))))
                .toBeCloseTo(a.n/a.d + b.n/b.d);
});

test('subtract', () => {
    for (let a of fracs)
        for (let b of fracs)
            expect(Fraction.toNumber(Fraction.subtract(fraction(a.n, a.d), fraction(b.n, b.d))))
                .toBeCloseTo(a.n/a.d - b.n/b.d);
});

test('multiply', () => {
    for (let a of fracs)
        for (let b of fracs)
            expect(Fraction.toNumber(Fraction.multiply(fraction(a.n, a.d), fraction(b.n, b.d))))
                .toBeCloseTo((a.n/a.d) * (b.n/b.d));
});

test('invert', () => {
    for (let frac of fracs)
        if (frac.n != 0) {
            expect(Fraction.toNumber(Fraction.invert(fraction(frac.n, frac.d))))
                .toBeCloseTo(1/(frac.n/frac.d));
        } else {
            expect(() => Fraction.toNumber(Fraction.invert(fraction(frac.n, frac.d))))
                .toThrow();
        }
});

test('divide', () => {
    for (let a of fracs)
        for (let b of fracs)
            if (b.n != 0) {
                expect(Fraction.toNumber(Fraction.divide(fraction(a.n, a.d), fraction(b.n, b.d))))
                    .toBeCloseTo((a.n/a.d) / (b.n/b.d));
            } else {
                expect(() => Fraction.toNumber(Fraction.divide(fraction(a.n, a.d), fraction(b.n, b.d))))
                    .toThrow();
                
            }
});

test('lessThan', () => {
    for (let a of fracs)
        for (let b of fracs)
            expect(Fraction.lessThan(fraction(a.n, a.d), fraction(b.n, b.d)))
                .toBe(a.n/a.d < b.n/b.d);
});

test('lessThanOrEqual', () => {
    for (let a of fracs)
        for (let b of fracs)
            expect(Fraction.lessThanOrEqual(fraction(a.n, a.d), fraction(b.n, b.d)))
                .toBe(a.n/a.d <= b.n/b.d);
});

test('greaterThan', () => {
    for (let a of fracs)
        for (let b of fracs)
            expect(Fraction.greaterThan(fraction(a.n, a.d), fraction(b.n, b.d)))
                .toBe(a.n/a.d > b.n/b.d);
});

test('greaterThanOrEqual', () => {
    for (let a of fracs)
        for (let b of fracs)
            expect(Fraction.greaterThanOrEqual(fraction(a.n, a.d), fraction(b.n, b.d)))
                .toBe(a.n/a.d >= b.n/b.d);
});

test('equal', () => {
    for (let a of fracs.concat(unreduced_fracs))
        for (let b of fracs.concat(unreduced_fracs))
            expect(Fraction.equal(fraction(a.n, a.d), fraction(b.n, b.d)))
                .toBe(a.n/a.d == b.n/b.d);
});

test('sign', () => {
    for (let frac of fracs)
        expect(Fraction.sign(fraction(frac.n, frac.d)))
            .toBe(Math.sign(frac.n/frac.d));
});

test('abs', () => {
    for (let frac of fracs)
        expect(Fraction.toNumber(Fraction.abs(fraction(frac.n, frac.d))))
            .toBe(Math.abs(frac.n/frac.d));
});

