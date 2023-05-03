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
            expect(Fraction.toNumber(polynomial(p.c).eval(fraction(x))))
                .toBeCloseTo(p.f(x));
});

test('eval_approx', () => {
    for (let p of polys)
        for (let x of args)
            expect(polynomial(p.c).eval_approx(x))
                .toBeCloseTo(p.f(x));
});

test('equal', () => {
    for (let p of polys.concat(leading_zeros).map(p => polynomial(p.c)))
        for (let q of polys.concat(leading_zeros).map(q => polynomial(q.c)))
            if (Polynomial.equal(p, q)) {
                for (let x of args.map(x => fraction(x)))
                    expect(Fraction.equal(p.eval(x), q.eval(x))).toBe(true);
            } else {
                let flag = true;
                for (let x of args.map(x => fraction(x)))
                    if (!Fraction.equal(p.eval(x), q.eval(x))) flag = false;
                expect(flag).toBe(false);
            }
});

test('add', () => {
    for (let p of polys.map(p => polynomial(p.c)))
        for (let q of polys.map(q => polynomial(q.c)))
            for (let x of args.map(x => fraction(x)))
                expect(Fraction.equal(Polynomial.add(p, q).eval(x),
                                      Fraction.add(p.eval(x), q.eval(x)))).toBe(true);
});
test('unaryMinus', () => {
    for (let p of polys.map(p => polynomial(p.c)))
        for (let x of args.map(x => fraction(x)))
            expect(Fraction.equal(Polynomial.unaryMinus(p).eval(x),
                                  Fraction.unaryMinus(p.eval(x)))).toBe(true);
});
test('subtract', () => {
    for (let p of polys.map(p => polynomial(p.c)))
        for (let q of polys.map(q => polynomial(q.c)))
            for (let x of args.map(x => fraction(x)))
                expect(Fraction.equal(Polynomial.subtract(p, q).eval(x),
                                      Fraction.subtract(p.eval(x), q.eval(x)))).toBe(true);
});
test('multiply', () => {
    for (let p of polys.map(p => polynomial(p.c)))
        for (let q of polys.map(q => polynomial(q.c)))
            for (let x of args.map(x => fraction(x)))
                expect(Fraction.equal(Polynomial.multiply(p, q).eval(x),
                                      Fraction.multiply(p.eval(x), q.eval(x)))).toBe(true);
});
test('divmod', () => {
    for (let dividend of polys.map(p => polynomial(p.c)))
        for (let divisor of polys.map(q => polynomial(q.c))) {
            if (divisor.degree >= 0) {
                let [quotient, remainder] = Polynomial.divmod(dividend, divisor);
                expect(Polynomial.equal(Polynomial.add(Polynomial.multiply(divisor, quotient), remainder),
                                        dividend)).toBe(true);
            } else {
                expect(() => Polynomial.divmod(dividend, divisor)).toThrow("Division by zero");
            }
        }
});

test('count_roots', () => {
    let roots = [-3, 0, 3];
    let points = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    let factors = roots.map(x => polynomial([Fraction.unaryMinus(fraction(x)), fraction(1)]));
    let poly = factors.reduce(Polynomial.multiply);
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
    let points = [-3.1, -3, -2.9, -0.1, 0, 0.1, 2.9, 3, 3.1];
    let factors = roots.map(x => polynomial([Fraction.unaryMinus(fraction(x)), fraction(1)]));
    let poly = factors.reduce(Polynomial.multiply);
    for (let x of points) {
        roots.sort((a,b) => Math.abs(a-x) - Math.abs(b-x));
        let root = roots[0];
        let [lower, upper] = poly.isolate_root(x);
        expect(roots.filter(r => Fraction.toNumber(lower) <= r && r <= Fraction.toNumber(upper))).toEqual([root]);
    }
});
