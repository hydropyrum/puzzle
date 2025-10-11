import sympy
import sys, os
import re

class ParseError(Exception):
    pass

float_re = r'-?\d+\.\d+'
int_re = r'-?\d+'

def parse_def(s):
    toks = re.findall(r'\s*([CV]\d+|[a-z]+|[+-]|'+float_re+'|'+int_re+r'|\S)', s)
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

def parse(code, name, text):
    data = {
        'code': code,
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
    def translate_number(x):
        if isinstance(x, sympy.Rational):
            return f'{{op: "num", args: [], val: fraction({x.numerator}, {x.denominator})}}'
        elif isinstance(x, sympy.Pow) and x.args[1] == sympy.Rational(1, 2):
            return f'{{op: "sqrt", args: [{translate_number(x.args[0])}]}}'
        elif isinstance(x, sympy.Pow) and isinstance(x.args[1], sympy.Integer):
            return f'{{op: "*", args: [{translate_number(x.args[0])}, {translate_number(sympy.Pow(x.args[0], x.args[1]-1))}]}}'
        elif isinstance(x, sympy.Mul):
            return f'{{op: "*", args: [{translate_number(x.args[0])}, {translate_number(sympy.Mul(*x.args[1:]))}]}}'
        elif isinstance(x, sympy.Add):
            return f'{{op: "+", args: [{translate_number(x.args[0])}, {translate_number(sympy.Add(*x.args[1:]))}]}}'
        elif isinstance(x, sympy.Symbol):
            return str(x)
        else:
            raise TypeError(type(x))
    
    sub = {}
    for name in data['consts']:
        sub[name] = None
        for val in data['consts'][name]:
            if isinstance(val, sympy.Expr):
                sub[name] = val

    print(f'    case "{data["code"]}": // {data["fullname"]}')
    scale = sympy.Symbol('scale')
    print( '      return [')
                
    for fi, face in enumerate(data['faces']):
        vertices = [sympy.Matrix(list(data['vertices'][i])) for i in face]
        normal = (vertices[1]-vertices[0]).cross(vertices[2]-vertices[1])
        constant = -normal.dot(vertices[0])
        # bug: need to ensure that all face normals are computed from pairs
        # of vectors with the same angle
        normal = sympy.simplify(normal.subs(sub))
        constant = sympy.simplify(constant.subs(sub)*scale)
        
        print(f'        // [{normal[0]}, {normal[1]}, {normal[2]}] · x + {constant} = 0')
        
        normal = [translate_number(x) for x in normal]
        constant = translate_number(constant)
        print(f'        {{tag: "plane", a: {normal[0]}, b: {normal[1]}, c: {normal[2]}, d: {constant}}}', end='')
        if fi < len(data['faces'])-1:
            print(',')
        else:
            print('')
    print( '    ];')
    print( '')

if __name__ == "__main__":

    dir = sys.argv[1]
    
    print("import { fraction } from './fraction';")
    print("import * as parse from './parse';")
    print("")
    print('export function polyhedron(code: string, scale: parse.Expr): parse.Plane[] {')
    print('  switch(code) {')

    shapes = {
        # Platonic
        'T': 'Tetrahedron',
        'C': 'Cube',
        'O': 'Octahedron',
        'D': 'Dodecahedron',
        'I': 'Icosahedron',
        # Catalan
        'kT': 'TriakisTetrahedron',
        'jC': 'RhombicDodecahedron',
        'kC': 'TetrakisHexahedron',
        'kO': 'TriakisOctahedron',
        'oC': 'DeltoidalIcositetrahedron',
        #'gC': 'RpentagonalIcositetrahedron',
        'jD': 'RhombicTriacontahedron',
        'mC': 'DisdyakisDodecahedron',
        'kD': 'PentakisDodecahedron',
        'kI': 'TriakisIcosahedron',
        'oD': 'DeltoidalHexecontahedron',
        #'gD': 'RpentagonalHexecontahedron',
        'mD': 'DisdyakisTriacontahedron',
        # Prisms and antiprisms
        'P3': 'TriangularPrism',
        'P5': 'PentagonalPrism',
        'P6': 'HexagonalPrism',
        #'A4': 'SquareAntiprism',
        'A5': 'PentagonalAntiprism',
        #'A6': 'HexagonalAntiprism',
        # Dipyramids and trapezohedra
        'dP3': 'TriangularDipyramid',
        #'dP5': 'PentagonalDipyramid',
        'dP6': 'HexagonalDipyramid',
        #'dA4': 'TetragonalTrapezohedron',
        'dA5': 'PentagonalTrapezohedron',
        #'dA6': 'HexagonalTrapezohedron',
    }
    for code, name in shapes.items():
        text = open(os.path.join(dir, name+'.txt')).read()
        data = parse(code, name, text)
        process(data)
    print("    default: throw new Error(`unknown polyhedron: '${code}'`)");
    print('  }')
    print('}')
