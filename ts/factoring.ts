import { Ring, Integer, ZZ, IntegerMod, IntegersMod, power_mod, product, gcd, extended_gcd, DivisionError } from './ring';
import { Fraction, QQ } from './fraction';
import { Polynomial, Polynomials, QQ_x } from './polynomial';
import { primes, comb, sqrt, random, gcd as bigint_gcd } from './bigutils';

function factor_bound(P: Polynomial<Integer>) {
    // bound on coefficients of factors of degree <= deg(P)/2
    let d = BigInt(P.degree)/2n;
    let n = 0n;
    for (let c of P.coeffs)
        n += c.n*c.n;
    n = sqrt(n);
    return comb(d-1n, d/2n-1n) * P.lc().n + comb(d-1n, d/2n) * n;
}

export function* combinations<T>(xs: T[], k: number, i: number = 0): Generator<T[]> {
    if (i+k == xs.length)
        yield xs.slice(i);
    else {
        for (let comb of combinations(xs, k, i+1))
            yield comb;
        if (k > 0)
            for (let comb of combinations(xs, k-1, i+1))
                yield [xs[i]].concat(comb);
    }
}

function factor_squarefree(A: Polynomial<Fraction>): Polynomial<Integer> {
    /* Make A squarefree and primitive. */
    let A_sf = A.div(gcd(QQ_x, A, A.derivative()).monic());
    let n_gcd = A_sf.coeffs[0].n;
    let d_lcm = A_sf.coeffs[0].d;
    for (let c of A_sf.coeffs) {
        n_gcd = bigint_gcd(n_gcd, c.n);
        d_lcm = d_lcm * c.d / bigint_gcd(d_lcm, c.d);
    }
    return A_sf.map(ZZ, (c: Fraction) => new Integer(c.n*d_lcm/c.d/n_gcd));
}

function factor_distinct_degrees(A: Polynomial<IntegerMod>, p: bigint) {
    /* Factor A into A0, ..., Ad, where Ai is the product of the
       irreducible factors of A of degree i.
      
       Arguments:
       - A: squarefree polynomial in F_p[x]
       - p: prime
       
       Returns:
       - array of Polynomials
       
       Cohen, Algorithm 3.4.3. */
    
    let Fp = new IntegersMod(p);
    let Fpx = new Polynomials(Fp);
    let one = new Polynomial(Fp, [Fp.one()]);
    let x = new Polynomial(Fp, [Fp.zero(), Fp.one()]);
    let factors = [one];
    let V = A;
    let W = x;
    for (let d=1; 2*d<=A.degree; d++) {
        W = power_mod(Fpx, W, p, V); // ≡ x**(p**d) mod V
        let A_d = gcd(Fpx, W.sub(x), V);
        factors.push(A_d);
        V = V.div(A_d);
    }
    while (factors.length < V.degree)
        factors.push(one);
    factors.push(V);
    console.assert(product(Fpx, factors).equals(A));
    return factors;
}

function factor_cantor_zassenhaus(A: Polynomial<IntegerMod>, d: number, p: bigint): Polynomial<IntegerMod>[] {
    /* Factor A.

       Arguments:
       - A: squarefree polynomial in F_p[x] whose factors all have degree d
       - d: natural number
       - p: prime
       
       Cohen, Algorithm 3.4.6. */
    
    let Fp = new IntegersMod(p);
    let Fpx = new Polynomials(Fp);
    let one = new Polynomial(Fp, [Fp.one()]);
    if (p == 2n) throw RangeError("p=2 not implemented");
    if (A.degree == d)
        return [A];
    for (let t=0; t<1000; t++) {
        // Generate a random monic polynomial of degree 2d-1
        let coeffs: IntegerMod[] = [];
        for (let i=0; i<2*d-1; i++)
            coeffs.push(new IntegerMod(random(p), p));
        coeffs.push(new IntegerMod(1n, p));
        let T = new Polynomial(Fp, coeffs);
        // This is a non-trivial factor of A with probability close to 1/2
        let B1 = gcd(Fpx, A, power_mod(Fpx, T, (p**BigInt(d)-1n)/2n, A).sub(one)).monic();
        if (0 < B1.degree && B1.degree < A.degree) {
            let [B2,] = A.divmod(B1);
            let factors = factor_cantor_zassenhaus(B1, d, p).concat(factor_cantor_zassenhaus(B2, d, p));
            console.assert(product(Fpx, factors).equals(A));
            return factors;
        }
    }
    throw new Error("This (probably) shouldn't happen");
}

function factor_mod(A: Polynomial<IntegerMod>, p: bigint, verbose: boolean = false) {
    /* Factor a squarefree polynomial in F_p[x], ignoring multiplicities and constant factors.
       
       Arguments:
       - A: squarefree polynomial in F_p[x]
       - p: prime

       Returns:
       - array of Polynomials */
    
    let factors_ddf = factor_distinct_degrees(A, p);
    if (verbose) console.log('distinct degrees:', factors_ddf.map(String));
    let factors_modp = [];
    for (let d=0; d<factors_ddf.length; d++)
        if (factors_ddf[d].degree != 0)
            factors_modp.push(...factor_cantor_zassenhaus(factors_ddf[d], d, p));
    return factors_modp.map(p => p.monic());
}

/* Some convenience functions to make working with different moduli less painful */
type mapping<A, B> = [Ring<B>, (c: A) => B];
let int: mapping<IntegerMod,Integer> = [ZZ, (c: IntegerMod) => new Integer(c.n)];
function mod(p: bigint): mapping<Integer|IntegerMod,IntegerMod> {
    return [new IntegersMod(p), (c: Integer|IntegerMod) => new IntegerMod(c.n, p)];
}
function divmod(A: Polynomial<Integer>, B: Polynomial<Integer>, p: bigint): [Polynomial<Integer>, Polynomial<Integer>] {
    let [Q_p, R_p] = A.map(...mod(p)).divmod(B.map(...mod(p)));
    return [Q_p.map(...int), R_p.map(...int)];
}

function hensel_lift_two(C: Polynomial<Integer>,
                         A_p: Polynomial<IntegerMod>,
                         B_p: Polynomial<IntegerMod>,
                         p: bigint, e: bigint) {
    /* Lift a factorization of C mod p into a factorization mod q=p**e.
       
       Arguments:
       - C: polynomial
       - A_p, B_p: polynomials with coefficients mod p
       - such that C = A_p * B_p (mod p)

       Returns:
       A_q = A_p (mod q) and B_q = B_p (mod q) such that
       - A_q.lc() = A_p.lc()
       - A_q.degree() = A_p.degree()
       - B_q.degree() = B_p.degree()
       - C = A_q * B_q (mod q).
       
       Cohen, Algorithm 3.5.5 and 3.5.6. */

    let Fp = new IntegersMod(p);
    let Fpx = new Polynomials(Fp);
    let [lc, U_p, V_p] = extended_gcd(Fpx, A_p, B_p);
    console.assert(lc.degree == 0, String(lc) + ' is not constant');
    [U_p, V_p] = [U_p.div(lc), V_p.div(lc)];

    // Since we will be changing moduli often, it's easier to work in Z
    let [A, B] = [A_p.map(...int), B_p.map(...int)];
    let [U, V] = [U_p.map(...int), V_p.map(...int)];
    let one = new Polynomial(ZZ, [ZZ.one()]);

    let q = p;
    let q_final = p**e;
    // We will overshoot and lift to p**(2**k) where 2**k >= e
    while (q < q_final) {
        console.assert(A.mul(B).map(...mod(p)).equals(C.map(...mod(p))));
        console.assert(U.mul(A).add(V.mul(B)).map(...mod(p)).equals(one.map(...mod(p))));

        let pint = new Integer(p);
        q = p * p; // lifting from p to q
        
        let f = C.sub(A.mul(B)).sdiv(pint);
        let [t, A0] = divmod(V.mul(f), A, p);
        let B0 = U.mul(f).add(B.mul(t)).map(ZZ, c => c.mod(new Integer(p)));
        [A, B] = [A.add(A0.smul(pint)), B = B.add(B0.smul(pint))];
                  
        let g = (one.sub(U.mul(A)).sub(V.mul(B))).sdiv(pint);
        let [s, V0] = divmod(V.mul(g), A, p);
        let U0 = U.mul(g).add(B.mul(s));
        U0 = U0.map(ZZ, c => c.mod(new Integer(p)));
        [U, V] = [U.add(U0.smul(new Integer(p))), V.add(V0.smul(new Integer(p)))];

        p = q;
    }
    console.assert(A.mul(B).map(...mod(q)).equals(C.map(...mod(q))));
    return [A.map(...mod(q_final)), B.map(...mod(q_final))];
}

function hensel_lift(C: Polynomial<Integer>, C_factors: Polynomial<IntegerMod>[], p: bigint, e: bigint): Polynomial<IntegerMod>[] {
    /* Lift a factorization of C mod p into a factorization mod q=p**e.
       
       var zur Gathen, Algorithm 15.17.
     */
    if (C_factors.length == 1)
        return [C.map(...mod(p**e)).monic()];
    let Fp = new IntegersMod(p);
    let Fpx = new Polynomials(Fp);
    let split = Math.trunc(C_factors.length/2);
    let [A_factors, B_factors] = [C_factors.slice(0, split), C_factors.slice(split)];
    let A_p = product(Fpx, A_factors);
    let B_p = product(Fpx, B_factors).smul(new IntegerMod(C.lc().n, p));
    let [A_q, B_q] = hensel_lift_two(C, A_p, B_p, p, e);
    let [A, B] = [A_q.map(...int), B_q.map(...int)];
    return hensel_lift(A, A_factors, p, e).concat(hensel_lift(B, B_factors, p, e));
}

function combine_factors(U: Polynomial<Integer>, factors_modp: Polynomial<IntegerMod>[], p: bigint): Polynomial<Integer>[] {
    /* Arguments:
    - U primitive
    - factors_modp: The factors of U mod p. Each is monic.
    - p > 0 (not necessarily prime)

    Assumes that the coefficients of the factors of U are in [-p/2, p/2).
    
    Cohen, Algorithm 3.5.7, step 5 */

    let Fpx = new Polynomials(new IntegersMod(p));
    let factors = [];
    let d = 1;
    while (d <= U.degree/2) {
        for (let comb of combinations(factors_modp, d)) {
            let V = product(Fpx, comb).smul(new IntegerMod(U.lc().n, p));

            // Move from Fₚ[x] to Z[x], using the fact that the
            // coefficients must be in [-p/2, p/2)
            let V_Z = V.map(ZZ, c => new Integer(2n*c.n < p ? c.n : c.n-p));
            let R;
            try {
                R = U.smul(U.lc()).mod(V_Z);
            } catch (error) {
                if (error instanceof DivisionError)
                    continue;
                else
                    throw error;
            }
            if (R.degree == -1) {
                // to do: remove the factor from the remaining combinations
                let n_gcd = V_Z.coeffs[0].n;
                for (let c of V_Z.coeffs)
                    n_gcd = bigint_gcd(n_gcd, c.n);
                V_Z = V_Z.sdiv(new Integer(n_gcd));
                factors.push(V_Z);
                U = U.div(V_Z);
            }
        }
        d++;
    }
    if (U.degree > 0)
        factors.push(U);
    return factors;
}

function choose_prime(U: Polynomial<Integer>): [bigint, Polynomial<IntegerMod>] {
    for (let p of primes()) {
        let Fpx = new Polynomials(new IntegersMod(p));
        if (p == 2n) continue;
        if (bigint_gcd(p, U.lc().n) != 1n) continue;
        let U_modp = U.map(...mod(p));
        if (gcd(Fpx, U_modp, U_modp.derivative()).degree == 0)
            return [p, U_modp];
    }
    throw new Error("this shouldn't happen");
}

export function factor(A: Polynomial<Fraction>) {
    let verbose = false;
    if (verbose) console.log('to factor:', String(A));

    // Make squarefree and primitive
    let U = factor_squarefree(A);
    if (verbose) console.log('squarefree and primitive:', String(U));

    // Choose p such that U is squarefree mod p
    let [p, U_modp] = choose_prime(U);
    if (verbose) console.log('mod ' + String(p) + ':', String(U_modp));
    
    // Factor mod p
    let factors_p = factor_mod(U_modp, p, verbose);
    if (verbose) console.log('factors mod', p, factors_p.map(String));

    // Choose exponent e
    let B = factor_bound(U);
    let e = 1n;
    while (p**e <= 2n*U.lc().n*B) e++;

    // Lift to mod p**e
    let factors_q = hensel_lift(U, factors_p, p, e);
    if (verbose) console.log('factors mod', p**e, factors_q.map(String));

    // Final combination and convert to rational
    return combine_factors(U, factors_q, p**e).map(f => f.map(QQ, c => new Fraction(c.n, 1n)));
}
