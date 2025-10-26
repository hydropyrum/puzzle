import { AlgebraicNumberField, algebraicNumberField, AlgebraicNumber, QQ_nothing, normal, extend, root } from './exact';
import { Polynomial, polynomial } from './polynomial';
import { fraction } from './fraction';

// ℚ(√2,√3)
let K = algebraicNumberField([1, 0, -10, 0, 1], fraction(3146264,1000000), fraction(3146265,1000000));

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

test('normal', () => {
    // x² - √2
    let p = new Polynomial(K, [
        K.fromVector([fraction(0), fraction(-9,2), fraction(0), fraction(1,2)]).neg(),
        K.fromVector([]),
        K.fromVector([fraction(1)])]);
    expect(normal(p)).toStrictEqual(polynomial([-2, 0, 0, 0, 1]));
});

let K2 = algebraicNumberField([-2, 0, 1], fraction(1414213,1000000), fraction(1414214,1000000));
let K3 = algebraicNumberField([-3, 0, 1], fraction(1732050,1000000), fraction(1732051,1000000));
let K5 = algebraicNumberField([-5, 0, 1], fraction(2236067,1000000), fraction(2236068,1000000));
let K2p3 = algebraicNumberField([1, 0, -10, 0, 1], fraction(3146264,1000000), fraction(3146265,1000000));
let K3p5 = algebraicNumberField([4, 0, -16, 0, 1], fraction(3968118,1000000), fraction(3968119,1000000));

function equals(Q_gamma, alpha, Q_alpha) {
    // Check whether alpha ∈ Q_gamma is equal to primitive element of Q_alpha
    let [alpha_lower, alpha_upper] = alpha.interval();
    for (let t=0; t<100; t++) {
        if (alpha_lower.compare(Q_alpha.lower) >= 0 && alpha_upper.compare(Q_alpha.upper) <= 0)
            return true;
        if (alpha_upper.compare(Q_alpha.lower) < 0 || alpha_lower.compare(Q_alpha.upper) > 0)
            return false;

        Q_gamma.refine();
        [alpha_lower, alpha_upper] = alpha.interval();
    }
    return false;
}

test('extend', () => {
    for (let Q_alpha of [QQ_nothing, K2, K3, K5, K2p3, K3p5])
        for (let Q_beta of [QQ_nothing, K2, K3, K5, K2p3, K3p5]) {
            let [Q_gamma, alpha, beta] = extend(Q_alpha, Q_beta);
            
            expect(Q_alpha.poly.map(Q_gamma, c => Q_gamma.fromVector([c])).eval(alpha)).toStrictEqual(Q_gamma.zero());
            expect(equals(Q_gamma, alpha, Q_alpha)).toBe(true);
            
            expect(Q_beta.poly.map(Q_gamma, c => Q_gamma.fromVector([c])).eval(beta)).toStrictEqual(Q_gamma.zero());
            expect(equals(Q_gamma, beta, Q_beta)).toBe(true);
        }
});

test('pentagon', () => {
    function sqrt(x) { return root(x, 2n); }
    function num(x) { return QQ_nothing.fromInt(x); }
    let C0 = sqrt(num(10).mul(num(5).sub(sqrt(num(5))))).div(num(20));
    let C1 = sqrt(num(5).mul(num(5).add(num(2).mul(sqrt(num(5)))))).div(num(10));
    let C2 = num(1).add(sqrt(num(5))).div(num(4));
    let C3 = sqrt(num(10).mul(num(5).add(sqrt(num(5))))).div(num(10));
    let [K0, a0, b0] = extend(QQ_nothing, C0.field);
    let [K1, a1, b1] = extend(K0, C1.field);
    let [K2, a2, b2] = extend(K1, C2.field);
    let [K3, a3, b3] = extend(K2, C3.field);
    expect(K3.poly).toStrictEqual(polynomial([2000,0,-100,0,1]));
});
