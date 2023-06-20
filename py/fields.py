import sympy
import itertools

elements = [
    sympy.sqrt(2),
    sympy.sqrt(3),
    sympy.sqrt(5),
]

def subsets(s):
    for i in range(len(s)+1):
        yield from itertools.combinations(s, i)
        
print("import { fraction } from './fraction';")
print("import { algebraicNumberField, AlgebraicNumberField, AlgebraicNumber } from './exact';")

print('')
print('export function makeFields() {')
print('  let fields = [];')
print('  let K: AlgebraicNumberField;')
print('  let values: {[key: string]: AlgebraicNumber};')
    
for subset in subsets(elements):
    if len(subset) == 0: continue
    f, coeffs, reps = sympy.primitive_element(subset, ex=True, polys=True)
    prim = sum(c*e for (c,e) in zip(coeffs, subset))
    for ((a, b), _) in sympy.intervals(f):
        if a <= prim <= b:
            approx = a+b/2
            break
    print('')
    print(f'  K = algebraicNumberField({list(reversed(f.all_coeffs()))}, fraction({approx.numerator}, {approx.denominator}));')
    print('  values = {')
    values = []
    for (x, rep) in zip(subset, reps):
        rep = [sympy.S(r) for r in rep]
        rep.reverse()
        rep = [f'fraction({r.numerator},{r.denominator})' for r in rep]
        values.append(f'"{x}": K.fromVector([{", ".join(rep)}])')
    print('    '+',\n    '.join(values))
    print('  };')
    print('  fields.push({field: K, values: values});')
print('  return fields;')
print('}')

