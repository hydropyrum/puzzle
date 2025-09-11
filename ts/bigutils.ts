export function abs(x: bigint): bigint {
    return x < 0n ? -x : x;
}

export function sign(x: bigint): number {
    if (x == 0n) return 0;
    else if (x < 0n) return -1;
    else /* if (x > 0n) */ return +1;
}

export function* primes() {
    let prevs: bigint[] = [];
    for (let cur=2n; true; cur++) {
        let is_prime = true;
        for (let prev of prevs) {
            if (prev * prev > cur) break;
            if (cur % prev == 0n) {
                is_prime = false;
                break;
            }
        }
        if (is_prime) {
            yield cur
            prevs.push(cur)
        }
    }
}

export function factorial(n: bigint) {
    let nfac = 1n;
    for (let i=2n; i<=n; i++)
        nfac *= i;
    return nfac;
}

export function comb(n: bigint, k: bigint) {
    return factorial(n)/(factorial(k)*factorial(n-k));
}

export function sqrt(n: bigint) {
    // Find an upper bound on sqrt(n) using Newton's method.
    let s_prev = -1n;
    let s = n;
    while (s > 0 && s != s_prev) {
        s_prev = s;
        s = (s*s+n-1n)/(2n*s)+1n;
    }
    return s;
}

/* Find GCD using Euclid's algorithm. */
export function gcd(x: bigint, y: bigint): bigint {
    x = abs(x);
    y = abs(y);
    if (x < y)
        [x, y] = [y, x];
    while (y !== 0n)
        [x, y] = [y, x % y];
    return x;
}

export function extended_gcd(a: bigint, b: bigint) {
    /* Extended Euclidean algorithm: Find r, s, t such that r = as + bt */
    let [r0, r1] = [a, b];
    let [s0, s1] = [1n, 0n];
    let [t0, t1] = [0n, 1n];
    while (r1 != 0n) {
        let [q, r2] = [r0/r1, r0%r1];
        [r0, r1] = [r1, r2];
        [s0, s1] = [s1, s0 - q*s1];
        [t0, t1] = [t1, t0 - q*t1];
    }
    return [r0, s0, t0];
}
