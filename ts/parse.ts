/* Parse URL */

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

function parseReal(s: string) {
    // to do: algebraic numbers
    return parseFloat(s);
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

export function parseQuery(s: string) {
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

function generateShape(s: Shape) {
    if (s.tag == 'polyhedron') {
        return s.name + '$' + s.d;
    } else if (s.tag == 'plane') {
        return s.a + ',' + s.b + ',' + s.c + '$' + s.d;
    }
}

export function generateQuery(p: Puzzle) {
    let ret: string[] = [];
    for (let s of p.shell)
        ret.push('shell=' + generateShape(s));
    for (let s of p.cuts)
        ret.push('cut=' + generateShape(s));
    return '?' + ret.join('&');
}
