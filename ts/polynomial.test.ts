import { Polynomial, polynomial } from './polynomial';
import { Fraction, fraction } from './fraction';

let polys = [
    {c: [], s: "0", f: x=>0},
    {c: [1], s: "1", f: x=>1},
    {c: [-1], s: " - 1", f: x=>-1},
    {c: [0, 1], s: "x", f: x=>x},
    {c: [1, 1], s: "x + 1", f: x=>x+1},
    {c: [-1, 1], s: "x - 1", f: x=>x-1},
    {c: [1, -1], s: " - x + 1", f: x=>-x+1},
    {c: [-1, -1], s: " - x - 1", f: x=>-x-1},
    {c: [0, 2], s: "2x", f: x=>2*x},
    {c: [0, -2], s: " - 2x", f: x=>-2*x},
    {c: [0, 0, 1], s: "x^2", f: x=>x**2}
];

let for_string = [
    {c: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], s: "x^{10}", f: x=>x**10}
]

let leading_zeros = [
    {c: [0], s: "0", f: x=>0},
    {c: [1, 0], s: "1", f: x=>1},
];

let args = [-2, -1, 0, 1, 2];

test('toString', () => {
    for (let p of polys.concat(for_string).concat(leading_zeros))
        expect(String(polynomial(p.c))).toBe(p.s);
});

test('eval', () => {
    for (let p of polys)
        for (let x of args)
            expect(polynomial(p.c).eval(fraction(x)).toNumber())
                .toBeCloseTo(p.f(x));
});

test('eval_approx', () => {
    for (let p of polys)
        for (let x of args)
            expect(polynomial(p.c).eval_approx(x))
                .toBeCloseTo(p.f(x));
});

test('equals', () => {
    for (let p of polys.concat(leading_zeros).map(p => polynomial(p.c)))
        for (let q of polys.concat(leading_zeros).map(q => polynomial(q.c)))
            if (p.equals(q)) {
                for (let x of args.map(x => fraction(x)))
                    expect(p.eval(x).equals(q.eval(x))).toBe(true);
            } else {
                let flag = true;
                for (let x of args.map(x => fraction(x)))
                    if (!p.eval(x).equals(q.eval(x))) flag = false;
                expect(flag).toBe(false);
            }
});

test('add', () => {
    for (let p of polys.map(p => polynomial(p.c)))
        for (let q of polys.map(q => polynomial(q.c)))
            for (let x of args.map(x => fraction(x)))
                expect(p.add(q).eval(x).equals(
                    p.eval(x).add(q.eval(x)))).toBe(true);
});
test('unaryMinus', () => {
    for (let p of polys.map(p => polynomial(p.c)))
        for (let x of args.map(x => fraction(x)))
            expect(p.neg().eval(x).equals(
                p.eval(x).neg())).toBe(true);
});
test('subtract', () => {
    for (let p of polys.map(p => polynomial(p.c)))
        for (let q of polys.map(q => polynomial(q.c)))
            for (let x of args.map(x => fraction(x)))
                expect(p.sub(q).eval(x).equals(
                    p.eval(x).sub(q.eval(x)))).toBe(true);
});
test('multiply', () => {
    for (let p of polys.map(p => polynomial(p.c)))
        for (let q of polys.map(q => polynomial(q.c)))
            for (let x of args.map(x => fraction(x)))
                expect(p.mul(q).eval(x).equals(
                    p.eval(x).mul(q.eval(x)))).toBe(true);
});
test('divmod', () => {
    for (let dividend of polys.map(p => polynomial(p.c)))
        for (let divisor of polys.map(q => polynomial(q.c))) {
            if (divisor.degree >= 0) {
                let [quotient, remainder] = dividend.divmod(divisor);
                expect(divisor.mul(quotient).add(remainder).equals(dividend)).toBe(true);
            } else {
                expect(() => dividend.divmod(divisor)).toThrow("Division by zero");
            }
        }
});

test('count_roots', () => {
    let roots = [-3, 0, 3];
    let points = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    let factors = roots.map(x => polynomial([fraction(-x), fraction(1)]));
    let poly = factors.reduce((p, q) => p.mul(q));
    for (let i=0; i<points.length; i++)
        for (let j=i; j<points.length; j++) {
            let true_count = 0;
            for (let r of roots)
                if (points[i] <= r && r <= points[j])
                    true_count += 1;
            expect(poly.count_roots(fraction(points[i]), fraction(points[j]))).toBe(true_count);
        }
});

test('isolate_root', () => {
    let roots = [-3, 0, 3];
    let points = [-100, -3.1, -3, -2.9, -0.1, 0, 0.1, 2.9, 3, 3.1, 100];
    let tie_points = [1.5];
    let factors = roots.map(x => polynomial([fraction(-x), fraction(1)]));
    let poly = factors.reduce((p, q) => p.mul(q));
    for (let x of points) {
        roots.sort((a,b) => Math.abs(a-x) - Math.abs(b-x));
        let root = roots[0];
        let [lower, upper] = poly.isolate_root(x);
        expect(roots.filter(r => lower.toNumber() <= r && r <= upper.toNumber())).toEqual([root]);
    }
    for (let x of tie_points)
        expect(() => poly.isolate_root(x)).toThrow();
});
