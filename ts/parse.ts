/* Parse expressions and URLs */

import { AlgebraicNumberField, AlgebraicNumber } from './exact';
import { fraction, Fraction } from './fraction';

export class ParseError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
    }
};

export interface Expr {
    op: string;
    args: Expr[];
    val?: Fraction;
}

export interface Polyhedron {
    tag: "polyhedron";
    name: string;
    d: Expr;
};

export interface Plane {
    tag: "plane";
    a: Expr;
    b: Expr;
    c: Expr;
    d: Expr;
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
  F -> <constant>
*/

export function evalExpr(x: Expr, field: AlgebraicNumberField, values: {[key: string]: AlgebraicNumber}): AlgebraicNumber {
    function visit(x: Expr): AlgebraicNumber {
        let args = x.args.map(visit);
        switch (x.op) {
            case '+': return args[0].add(args[1]);
            case '-': return args[0].sub(args[1]);
            case '*': return args[0].mul(args[1]);
            case '/': return args[0].div(args[1]);
            case 'neg': return args[0].neg();
            case 'num': return field.fromVector([x.val!]);
            case 'sqrt':
                if (x.args.length !== 1)
                    throw new ParseError('sqrt must have an argument');
                let s = generateExpr(x);
                if (s in values)
                    return values[s];
                else
                    throw new ParseError(`I can't compute ${s}`);
            default: throw new ParseError(`unknown operation '${x.op}'`);
        }
    }
    return visit(x);
}

export function parseExpr(s: string): Expr {
    let tokens: (string|Fraction)[] = [];
    let tokenRE = /\s*(?:([+\-*/()])|([A-Za-z_][A-Za-z_0-9]*)|(\d+)(\.\d+)?)\s*/y;
    while (tokenRE.lastIndex < s.length) {
        let pos = tokenRE.lastIndex;
        let m = tokenRE.exec(s);
        if (m === null)
            throw new ParseError(`Unexpected character <code>${s[pos]}</code>`);
        else if (m[1] !== undefined) {
            tokens.push(m[1]);
        } else if (m[2] !== undefined) {
            tokens.push('$' + m[2]);
        } else if (m[3] !== undefined) {
            let n = parseInt(m[3]);
            let d = 1;
            if (m[4] !== undefined) {
                d = 10**(m[4].length-1);
                n *= d;
                if (m[4].length > 1)
                    n += parseInt(m[4].substring(1));
            }
            tokens.push(fraction(n,d));
        } else
            throw new ParseError(`Unexpected character <code>${s[pos]}</code> (this shouldn't happen)`);
    }

    let i = 0;
    let n = tokens.length;
    
    function parseStart(): Expr {
        let x = parseTerm();
        while (i < n && (tokens[i] == '+' || tokens[i] == '-')) {
            let op = tokens[i] as string;
            i++;
            let y = parseTerm();
            x = {op: op, args: [x, y]};
        }
        return x;
    }
    function parseTerm(): Expr {
        let x = parseFactor();
        while (i < n && (tokens[i] == '*' || tokens[i] == '/')) {
            let op = tokens[i] as string;
            i++;
            let y = parseFactor();
            x = {op: op, args: [x, y]};
        }
        return x;
    }
    function parseFactor(): Expr {
        if (i == n)
            throw new ParseError('Unexpected end of expression');
        let token = tokens[i];
        if (token == '-') {
            i++;
            let x = parseFactor();
            return {op: 'neg', args: [x]};
        } else if (token == '(') {
            i++;
            let x = parseStart();
            parseToken(')');
            return x;
        } else if (token instanceof Fraction) {
            i++;
            return {op: 'num', args: [], val: token};
        } else if (typeof token === 'string' && token[0] === '$') {
            let id = token.substring(1);
            i++;
            if (i < n && tokens[i] === '(') { // function call
                i++;
                let x = parseStart();
                parseToken(')');
                return {op: id, args: [x]};
            } else {
                return {op: id, args: []};
            }
        } else
            throw new ParseError(`Unexpected <code>${tokens[i]}</code>`);
    }
    function parseToken(tok: string): string {
        if (i >= n)
            throw new ParseError(`Expected <code>${tok}</code>, but reached end of expression`);
        else if (tokens[i] !== tok) {
            throw new ParseError(`Expected <code>${tok}</code>, but found <code>${tokens[i]}</code>`);
        } else {
            i++;
            return tok;
        }
    }
    let x = parseStart();
    if (i < n) throw new ParseError(`Expected end of string, but found <code>${tokens[i]}</code>`);
    return x;
}

function parseShape(s: string): Shape {
    let parts = s.split("$");
    if (parts.length !== 2)
        throw new ParseError("expected $");
    let d = parseExpr(parts[1]);
    s = parts[0];
    let coeffs = s.split(",").map(parseExpr);
    if (coeffs.length === 3) {
        return {tag: 'plane', a: coeffs[0], b: coeffs[1], c: coeffs[2], d: d};
    } else {
        return {tag: 'polyhedron', name: s, d: d};
    }
}

export function parseQuery(s: string): Puzzle {
    let ret: Puzzle = {shell: [], cuts: []};
    s = decodeURIComponent(s);
    if (s.length == 0)
        return ret;
    if (s.charAt(0) !== '?') throw new ParseError("expected ?");
    s = s.substring(1);
    let kvs: [string,string][] = [];
    for (let kvstring of s.split('&')) {
        let kv = kvstring.split('=');
        if (kv.length !== 2) throw new ParseError("expected exactly one =");
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

export function generateExpr(x: Expr, prec: number = 10): string {
    let s: string;
    switch (x.op) {
        case '+':
        case '-':
            s = `${generateExpr(x.args[0], 4)}${x.op}${generateExpr(x.args[1], 3)}`;
            if (prec < 4) s = `(${s})`;
            return s;
        case '*':
        case '/':
            s = `${generateExpr(x.args[0], 2)}${x.op}${generateExpr(x.args[1], 1)}`;
            if (prec < 2) s = `(${s})`;
            return s;
        case 'neg':
            return `-${generateExpr(x.args[0], 0)}`;
        case 'num':
            return String(x.val);
        case 'sqrt':
            return `sqrt(${generateExpr(x.args[0])})`;
        default:
            throw new ParseError(`generateExpr: invalid operation '${x.op}'`);
    }
}

function generateShape(s: Shape): string {
    if (s.tag == 'polyhedron') {
        return s.name + '$' + generateExpr(s.d);
    } else if (s.tag == 'plane') {
        return generateExpr(s.a) + ',' + generateExpr(s.b) + ',' + generateExpr(s.c) + '$' + generateExpr(s.d);
    } else {
        throw new ParseError("tag must be 'polyhedron' or 'plane'");
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
