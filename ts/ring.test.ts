import { RingElement, Ring, Integer, ZZ, IntegersMod, power } from './ring';

test('TestInteger', () => {
});

let ZZmod10 = new IntegersMod(10n);
function mod10(n) { return ZZmod10.fromInt(n); }

function int(n) { return ZZ.fromInt(n); }

test('TestIntegerMod', () => {
    expect(mod10(5).add(mod10(7))).toStrictEqual(mod10(2));
    expect(mod10(5).sub(mod10(7))).toStrictEqual(mod10(8));
    expect(mod10(5).mul(mod10(7))).toStrictEqual(mod10(5));
    expect(mod10(1).div(mod10(3))).toStrictEqual(mod10(7));
    expect(() => mod10(1).div(mod10(2))).toThrow("Division by zero");
    expect(mod10(3).inv()).toStrictEqual(mod10(7));
    expect(() => mod10(2).inv()).toThrow("Division by zero");
});

test('power', () => {
    expect(power(ZZ, int(2n), 0n)).toStrictEqual(int(1n));
    expect(power(ZZ, int(2n), 1n)).toStrictEqual(int(2n));
    expect(power(ZZ, int(2n), 10n)).toStrictEqual(int(1024n));
});
