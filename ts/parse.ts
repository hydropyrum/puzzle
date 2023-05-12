/* Parse URL */

import { algebraicNumberField } from './exact';

export interface Polyhedron {
    tag: "polyhedron";
    name: string;
    d: number;
};

export interface Plane {
    tag: "plane";
    a: number;
    b: number;
    c: number;
    d: number;
};

export type Shape = Polyhedron|Plane;

export interface Puzzle {
    shell: Shape[];
    cuts: Shape[];
};

/* Grammar:

  E -> E + T
  E -> E - T
  E -> T
  T -> T * F
  T -> T / F
  T -> F
  F -> <integer>
  F -> ( E )
  F -> - F
  F -> <function> ( E )
*/

/* why does cut +1 on tetrahedron make it disappear
   sqrt not working yet
 */

export function parseReal(s: string): number {
    let tokens: (string|number)[] = [];
    let tokenRE = /[+\-*/()]|sqrt|(\d+\.\d+)|(\d+)/y;
    let m = tokenRE.exec(s);
    while (m !== null) {
        if (m[2] !== undefined)
            tokens.push(parseInt(m[2]));
        else if (m[1] !== undefined) // to do: remove this case
            tokens.push(parseFloat(m[1]));
        else
            tokens.push(m[0]);
        m = tokenRE.exec(s);
    }

    let i = 0;
    let n = tokens.length;
    
    function parseExpr(): number {
        let x = parseTerm();
        while (i < n && (tokens[i] == '+' || tokens[i] == '-')) {
            let op = tokens[i];
            i++;
            let y = parseTerm();
            if (op == '+') x += y;
            else if (op == '-') x -= y;
        }
        return x;
    }
    function parseTerm(): number {
        let x = parseFactor();
        while (i < n && (tokens[i] == '*' || tokens[i] == '/')) {
            let op = tokens[i];
            i++;
            let y = parseFactor();
            if (op == '*') x *= y;
            else if (op == '/') x /= y;
        }
        return x;
    }
    function parseFactor(): number {
        if (i < n && tokens[i] == '-') {
            i++;
            let x = parseFactor();
            return -x;
        } else if (i < n && tokens[i] == '(') {
            i++;
            let x = parseExpr();
            parseToken(')');
            return x;
        } else if (i < n && typeof tokens[i] === 'number') {
            let x = tokens[i] as number;
            i++;
            return x;
        } else if (i < n && tokens[i] == 'sqrt') {
            i++;
            parseToken('(');
            let x = parseExpr();
            parseToken(')');
            return Math.sqrt(x);
        } else
            throw new Error('parse error');
    }
    function parseToken(tok: string): string {
        if (i < n && tokens[i] == tok) {
            i++;
            return tok;
        } else
            throw new Error(`parse error: expected ${tok}`);
    }
    let x = parseExpr();
    if (i < n) throw new Error("parse error: expected end of string");
    console.log(`parsed ${s} as ${x}`);
    return x;
}

function parseShape(s: string): Shape {
    let parts = s.split("$");
    console.assert(parts.length == 2, "parse error: expected $");
    let d = parseReal(parts[1]);
    s = parts[0];

    if (s == 'plane') {
        let coeffs = s.split(",");
        console.assert(coeffs.length == 3, "parse error: expected exactly 3 coefficients");
        return {tag: 'plane',
                a: parseReal(coeffs[0]),
                b: parseReal(coeffs[1]),
                c: parseReal(coeffs[2]),
                d: d};
    } else {
        return {tag: 'polyhedron', name: s, d: d};
    }
}

export function parseQuery(s: string): Puzzle {
    let ret: Puzzle = {shell: [], cuts: []};
    if (s.length == 0)
        return ret;
    console.assert(s.charAt(0) == '?', "parse error: expected ?");
    s = s.substring(1);
    let kvs: [string,string][] = [];
    for (let kvstring of s.split('&')) {
        let kv = kvstring.split('=');
        console.assert(kv.length == 2, "parse error: expected exactly one =");
        kvs.push([kv[0], kv[1]]);
    }
    for (let [k, v] of kvs) {
        if (k == "shell")
            ret.shell.push(parseShape(v));
        else if (k == "cut")
            ret.cuts.push(parseShape(v));
        else
            console.warn("warning: ignoring unknown key", k);
    }
    return ret;
}

function generateShape(s: Shape): string {
    if (s.tag == 'polyhedron') {
        return s.name + '$' + s.d;
    } else if (s.tag == 'plane') {
        return s.a + ',' + s.b + ',' + s.c + '$' + s.d;
    } else {
        console.assert("error: tag must be 'polyhedron' or 'plane'");
        return '';
    }
}

export function generateQuery(p: Puzzle): string {
    let ret: string[] = [];
    for (let s of p.shell)
        ret.push('shell=' + generateShape(s));
    for (let s of p.cuts)
        ret.push('cut=' + generateShape(s));
    return '?' + ret.join('&');
}
