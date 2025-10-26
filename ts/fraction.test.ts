import { Fraction, fraction } from './fraction';

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
        expect(fraction(frac.n, frac.d).toNumber())
            .toBeCloseTo(frac.n/frac.d);
});

test('neg', () => {
    for (let frac of fracs)
        expect(fraction(frac.n, frac.d).neg().toNumber())
            .toBeCloseTo(-frac.n/frac.d);
});

test('add', () => {
    for (let a of fracs)
        for (let b of fracs)
            expect(fraction(a.n, a.d).add(fraction(b.n, b.d)).toNumber())
                .toBeCloseTo(a.n/a.d + b.n/b.d);
});

test('sub', () => {
    for (let a of fracs)
        for (let b of fracs)
            expect(fraction(a.n, a.d).sub(fraction(b.n, b.d)).toNumber())
                .toBeCloseTo(a.n/a.d - b.n/b.d);
});

test('mul', () => {
    for (let a of fracs)
        for (let b of fracs)
            expect(fraction(a.n, a.d).mul(fraction(b.n, b.d)).toNumber())
                .toBeCloseTo((a.n/a.d) * (b.n/b.d));
});

test('inv', () => {
    for (let frac of fracs)
        if (frac.n != 0) {
            expect(fraction(frac.n, frac.d).inv().toNumber())
                .toBeCloseTo(1/(frac.n/frac.d));
        } else {
            expect(() => fraction(frac.n, frac.d).inv())
                .toThrow("Division by zero");
        }
});

test('div', () => {
    for (let a of fracs)
        for (let b of fracs)
            if (b.n != 0) {
                expect(fraction(a.n, a.d).div(fraction(b.n, b.d)).toNumber())
                    .toBeCloseTo((a.n/a.d) / (b.n/b.d));
            } else {
                expect(() => fraction(a.n, a.d).div(fraction(b.n, b.d)))
                    .toThrow("Division by zero");
                
            }
});

test('equals', () => {
    for (let a of fracs.concat(unreduced_fracs))
        for (let b of fracs.concat(unreduced_fracs))
            expect(fraction(a.n, a.d).equals(fraction(b.n, b.d)))
                .toBe(a.n/a.d == b.n/b.d);
});

test('sign', () => {
    for (let frac of fracs)
        expect(fraction(frac.n, frac.d).sign())
            .toBe(Math.sign(frac.n/frac.d));
});

test('abs', () => {
    for (let frac of fracs)
        expect(fraction(frac.n, frac.d).abs().toNumber())
            .toBe(Math.abs(frac.n/frac.d));
});

test('middle', () => {
    for (let a of fracs)
        for (let b of fracs) {
            let fa = fraction(a.n, a.d);
            let fb = fraction(b.n, b.d);
            let m = fa.middle(fb);
            /*expect(m.compare(fa)).toBeGreaterThanOrEqual(0);
            expect(m.compare(fb)).toBeLessThanOrEqual(0);*/
        }
});
