import sympy
import sys
import re
import requests

def download(name):
    url = f'http://dmccooey.com/polyhedra/{name}.txt'
    r = requests.get(url)
    r.raise_for_status()
    return r.text

class ParseError(Exception):
    pass

float_re = r'-?\d+\.\d+'
int_re = r'-?\d+'

def parse_def(s):
    toks = re.findall(r'\s*([CV]\d+|[a-z]+|[+-]|'+float_re+'|'+int_re+'|\S)', s)
    i = 0
    lhs = toks[i]
    defs = []
    i += 1
    if lhs[0] == 'C':
        while i < len(toks) and toks[i] == '=':
            i += 1
            rhs, i = parse_expr(toks, i)
            if isinstance(rhs, sympy.Float): continue
            defs.append((lhs, rhs))
    elif lhs[0] == 'V':
        i = expect(toks, i, '=')
        rhs, i = parse_tuple(toks, i)
        defs.append((lhs, rhs))
    else:
        raise ParseError()
    if i < len(toks):
        raise ParseError(f"expected '=' (not '{toks[i]}')")
    return defs

def expect(toks, i, what):
    if i >= len(toks):
        raise ParseError(f"expected '{what}' (not end of line)")
    if toks[i] != what:
        raise ParseError(f"expected '{what}' (not '{toks[i:]}')")
    i += 1
    return i

def parse_expr(toks, i):
    x, i = parse_term(toks, i)
    while i < len(toks) and toks[i] in "+-":
        op = toks[i]
        i += 1
        y, i = parse_term(toks, i)
        if op == "+":
            x = x + y
        elif op == "-":
            x = x - y
    return x, i

def parse_term(toks, i):
    x, i = parse_factor(toks, i)
    while i < len(toks) and toks[i] in "*/":
        op = toks[i]
        i += 1
        y, i = parse_factor(toks, i)
        if op == "*":
            x = x * y
        elif op == "/":
            x = x / y
    return x, i

def parse_factor(toks, i):
    if i >= len(toks):
        raise ParseError()
    if toks[i] == '(':
        i += 1
        x, i = parse_expr(toks, i)
        i = expect(toks, i, ')')
        return x, i
    elif re.fullmatch(float_re, toks[i]):
        x = sympy.Float(float(toks[i]))
        i += 1
        return x, i
    elif re.fullmatch(int_re, toks[i]):
        x = sympy.Rational(int(toks[i]))
        i += 1
        return x, i
    elif toks[i] in ['sqrt', 'cbrt']:
        fn = toks[i]
        i += 1
        i = expect(toks, i, '(')
        x, i = parse_expr(toks, i)
        i = expect(toks, i, ')')
        if fn == 'sqrt':
            return sympy.sqrt(x), i
        elif fn == 'cbrt':
            return sympy.cbrt(x), i
    else:
        raise ParseError()

def parse_tuple(toks, i):
    xs = []
    i = expect(toks, i, '(')
    x, i = parse_coord(toks, i)
    xs.append(x)
    while i < len(toks) and toks[i] == ',':
        i += 1
        x, i = parse_coord(toks, i)
        xs.append(x)
    i = expect(toks, i, ')')
    return tuple(xs), i

def parse_coord(toks, i):
    if i < len(toks) and toks[i] == '-':
        i += 1
        x, i = parse_coord(toks, i)
        return -x, i
    elif re.fullmatch(float_re, toks[i]):
        x = sympy.Rational(float(toks[i]))
        i += 1
        return x, i
    else:
        x = sympy.Symbol(toks[i])
        i += 1
        return x, i

def parse(name, text):
    data = {
        'name': name,
        'fullname': None,
        'faces': [],
        'consts': {},
        'vertices': [],
    }

    vertices = {}

    state = "name"
    for line in text.splitlines():
        line = line.rstrip()
        if line == "":
            continue
        elif line == "Faces:":
            state = "faces"
        elif state == "name":
            data['fullname'] = line
            state = "defs"
        elif state == "defs":
            defs = parse_def(line)
            for lhs, rhs in defs:
                if lhs[0] == 'C':
                    data['consts'].setdefault(lhs, []).append(rhs)
                elif lhs[0] == 'V':
                    vertices[int(lhs[1:])] = rhs
        elif state == "faces":
            m = re.match(r'{(.*)}', line)
            data['faces'].append([int(v) for v in m.group(1).split(',')])

    for ind, expr in sorted(vertices.items()):
        assert ind == len(data['vertices'])
        data['vertices'].append(expr)

    return data

def process(data):
    generators = [sympy.sqrt(2), sympy.sqrt(5)]
    (prim_poly, prim_coeffs) = sympy.primitive_element(generators, polys=True)
    prim_element = sum(g*p for g, p in zip(generators, prim_coeffs))

    def translate_number(x):
        coeffs = list(reversed(sympy.to_number_field(x, prim_element).coeffs()))
        coeff_strings = []
        for c in coeffs:
            if c.denominator == 1:
                coeff_strings.append(str(c))
            else:
                coeff_strings.append(f'fraction({c.numerator},{c.denominator})')
        return 'K.fromVector(['+', '.join(coeff_strings)+'])'
    
    sub = {}
    for name in data['consts']:
        sub[name] = None
        for val in data['consts'][name]:
            if isinstance(val, sympy.Expr):
                sub[name] = val

    poly_name = data["name"][0].lower() + data["name"][1:]
    print(f'export function {poly_name}(scale: Fraction): ExactPlane[] {{')
    print(f'    let K = algebraicNumberField({list(reversed(prim_poly.all_coeffs()))}, {float(prim_element)});')
    print( '    let cuts = [')
                
    for fi, face in enumerate(data['faces']):
        vertices = [sympy.Matrix(list(data['vertices'][i])) for i in face]
        normal = (vertices[1]-vertices[0]).cross(vertices[2]-vertices[1])
        constant = -normal.dot(vertices[0])
        # bug: need to ensure that all face normals are computed from pairs
        # of vectors with the same angle
        normal = sympy.simplify(normal.subs(sub))
        constant = sympy.simplify(constant.subs(sub))
        
        print(f'        // [{normal[0]}, {normal[1]}, {normal[2]}] · x + {constant} scale = 0')
        
        normal = [translate_number(x) for x in normal]
        constant = translate_number(constant)
        print(f'        new ExactPlane(new ExactVector3({normal[0]}, {normal[1]}, {normal[2]}), AlgebraicNumber.multiply({constant}, K.fromVector([scale])))', end='')
        if fi < len(data['faces'])-1:
            print(',')
        else:
            print('')
    print( '    ];')
    print( '    return cuts;')
    print( '}')
    print( '')

if __name__ == "__main__":
    
    print("import { Fraction, fraction } from './fraction';")
    print("import { AlgebraicNumberField, algebraicNumberField, AlgebraicNumber } from './exact';")
    print("import { ExactVector3, ExactPlane } from './piece';")
    print("")

    for name in ['Tetrahedron',
                 'Octahedron',
                 'Cube',
                 'Icosahedron',
                 'Dodecahedron',
                 #'TriakisTetrahedron',
                 'RhombicDodecahedron',
                 #'TetrakisHexahedron',
                 #'TriakisOctahedron',
                 #'DeltoidalIcositetrahedron',
                 #'RpentagonalIcositetrahedron',
                 #'LpentagonalIcositetrahedron',
                 'RhombicTriacontahedron',
                 #'DisdyakisDodecahedron',
                 #'PentakisDodecahedron',
                 #'TriakisIcosahedron',
                 #'DeltoidalHexecontahedron',
                 #'LpentagonalHexecontahedron',
                 #'RpentagonalHexecontahedron',
                 #'DisdyakisTriacontahedron'
                 ]:
        text = download(name)
        data = parse(name, text)
        process(data)
