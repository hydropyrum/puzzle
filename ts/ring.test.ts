import { RingElement, Ring, Integer, ZZ, IntegersMod, power, gcd } from './ring';

test('TestInteger', () => {
});

let ZZmod10 = new IntegersMod(10n);
function mod10(n) { return ZZmod10.fromInt(n); }

function int(n) { return ZZ.fromInt(n); }

test('TestInteger', () => {
    expect(int(0).mod(int(10))).toStrictEqual(int(0));
    expect(int(1).mod(int(10))).toStrictEqual(int(1));
    expect(int(9).mod(int(10))).toStrictEqual(int(9));
    expect(int(10).mod(int(10))).toStrictEqual(int(0));
    expect(int(11).mod(int(10))).toStrictEqual(int(1));
    expect(int(-1).mod(int(10))).toStrictEqual(int(9));
    expect(int(-9).mod(int(10))).toStrictEqual(int(1));
    expect(int(-10).mod(int(10))).toStrictEqual(int(0));
    expect(int(-11).mod(int(10))).toStrictEqual(int(9));
});

test('TestIntegerMod', () => {
    expect(mod10(5).add(mod10(7))).toStrictEqual(mod10(2));
    expect(mod10(5).sub(mod10(7))).toStrictEqual(mod10(8));
    expect(mod10(5).mul(mod10(7))).toStrictEqual(mod10(5));
    expect(mod10(1).div(mod10(3))).toStrictEqual(mod10(7));
    expect(() => mod10(1).div(mod10(2))).toThrow("Not divisible");
    expect(mod10(3).inv()).toStrictEqual(mod10(7));
    expect(() => mod10(2).inv()).toThrow("Multiplicative inverse does not exist");
});

test('power', () => {
    expect(power(ZZ, int(2n), 0n, int(100n))).toStrictEqual(int(1n));
    expect(power(ZZ, int(2n), 1n, int(100n))).toStrictEqual(int(2n));
    expect(power(ZZ, int(2n), 10n, int(100n))).toStrictEqual(int(24n));
});

test('gcd', () => {
    expect(gcd(ZZ, int(100n), int(128n))).toStrictEqual(int(4n));
});
