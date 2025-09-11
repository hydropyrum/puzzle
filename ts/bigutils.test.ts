import { primes, sqrt } from './bigutils';

test('primes', () => {
    let ps = [];
    for (let p of primes()) {
        if (p > 10) break;
        ps.push(p);
    }
    expect(ps).toStrictEqual([2n,3n,5n,7n]);
});

test('sqrt', () => {
    expect(sqrt(0n)).toBe(0n);
    expect(sqrt(1n)).toBe(1n);
    expect(sqrt(9999n) >= 100n).toBe(true);
    expect(sqrt(10000n) >= 100n).toBe(true);
    expect(sqrt(10001n) >= 101n).toBe(true);
});
