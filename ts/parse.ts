/* Parse URL */

import { algebraicNumberField, AlgebraicNumber } from './exact';
import { Fraction, fraction } from './fraction';

export interface Polyhedron {
    tag: "polyhedron";
    name: string;
    d: string;
};

export interface Plane {
    tag: "plane";
    a: string;
    b: string;
    c: string;
    d: string;
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

export function parseReal(s: string): AlgebraicNumber {
    let K = algebraicNumberField([9, 0, -14, 0, 1], 3.6502815398728847); // Q(sqrt(2), sqrt(5))
    let tokens: (string|AlgebraicNumber)[] = [];
    let tokenRE = /[+\-*/()]|sqrt\((\d+)\)|(\d+\.\d+)|(\d+)/y;
    let m = tokenRE.exec(s);
    while (m !== null) {
        if (m[1] !== undefined) {
            let arg = parseInt(m[1]);
            if (arg == 2)
                tokens.push(K.fromVector([0, fraction(-11,6), 0, fraction(1,6)]));
            else if (arg == 5)
                tokens.push(K.fromVector([0, fraction(17,6), 0, fraction(-1,6)]));
            else
                throw new Error(`I don't know how to take the sqrt of ${arg}`);
        } else if (m[2] !== undefined) // to do: remove this case
            tokens.push(K.fromVector([Fraction.fromNumber(parseFloat(m[2]))]));
        else if (m[3] !== undefined)
            tokens.push(K.fromVector([parseInt(m[3])]));
        else
            tokens.push(m[0]);
        m = tokenRE.exec(s);
    }

    let i = 0;
    let n = tokens.length;
    
    function parseExpr(): AlgebraicNumber {
        let x = parseTerm();
        while (i < n && (tokens[i] == '+' || tokens[i] == '-')) {
            let op = tokens[i];
            i++;
            let y = parseTerm();
            if (op == '+') x = AlgebraicNumber.add(x, y);
            else if (op == '-') x = AlgebraicNumber.subtract(x, y);
        }
        return x;
    }
    function parseTerm(): AlgebraicNumber {
        let x = parseFactor();
        while (i < n && (tokens[i] == '*' || tokens[i] == '/')) {
            let op = tokens[i];
            i++;
            let y = parseFactor();
            if (op == '*') x = AlgebraicNumber.multiply(x, y);
            else if (op == '/') x = AlgebraicNumber.divide(x, y);
        }
        return x;
    }
    function parseFactor(): AlgebraicNumber {
        if (i < n && tokens[i] == '-') {
            i++;
            let x = parseFactor();
            return AlgebraicNumber.unaryMinus(x);
        } else if (i < n && tokens[i] == '(') {
            i++;
            let x = parseExpr();
            parseToken(')');
            return x;
        } else if (i < n && tokens[i] instanceof AlgebraicNumber) {
            let x = tokens[i] as AlgebraicNumber;
            i++;
            return x;
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
    return x;
}

function parseShape(s: string): Shape {
    let parts = s.split("$");
    console.assert(parts.length == 2, "parse error: expected $");
    let d = parts[1];
    s = parts[0];

    if (s == 'plane') {
        let coeffs = s.split(",");
        console.assert(coeffs.length == 3, "parse error: expected exactly 3 coefficients");
        return {tag: 'plane', a: coeffs[0], b: coeffs[1], c: coeffs[2], d: d};
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
