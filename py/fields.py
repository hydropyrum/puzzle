import sympy
import itertools

elements = {
    'sqrt(2)': sympy.sqrt(2),
    'sqrt(3)': sympy.sqrt(3),
    'sqrt(5)': sympy.sqrt(5),
}

def subsets(s):
    for i in range(len(s)+1):
        yield from itertools.combinations(s, i)
        
def rational_to_string(e):
    if e.denominator == 1:
        return f'{e}n'
    else:
        return f'fraction({e.numerator}n, {e.denominator}n)'

fields = []
for subset in subsets(elements):
    if len(subset) == 0: continue
    
    # If there is a field that contains all the elements, reuse it
    found_field = False
    for _, prim, values in fields:
        field_good = True
        for e in subset:
            if e in values: continue
            try:
                rep = sympy.to_number_field(elements[e], prim).coeffs()
            except sympy.IsomorphismFailed:
                field_good = False
                break
            values[e] = list(reversed([sympy.S(r) for r in rep]))
        if field_good:
            found_field = True
            break

    if not found_field:
        poly, coeffs, reps = sympy.primitive_element([elements[e] for e in subset], ex=True, polys=True)
        prim = sum(c*elements[e] for (c,e) in zip(coeffs, subset))
        values = {}
        for (x, rep) in zip(subset, reps):
            values[x] = list(reversed([sympy.S(r) for r in rep]))
        fields.append((poly, prim, values))

print("import { fraction } from './fraction';")
print("import { algebraicNumberField, AlgebraicNumberField, AlgebraicNumber } from './exact';")

print('')
print('export function makeFields() {')
print('  let fields = [];')
print('  let K: AlgebraicNumberField;')
print('  let values: {[key: string]: AlgebraicNumber};')

for poly, prim, values in fields:
    for ((a, b), _) in sympy.intervals(poly):
        if a <= prim <= b:
            approx = a+b/2
            break
    print('')
    coeffs = [rational_to_string(c) for c in reversed(poly.all_coeffs())]
    print(f'  K = algebraicNumberField([{", ".join(coeffs)}], {rational_to_string(approx)});')
    print('  values = {')
    for i, (name, coeffs) in enumerate(values.items()):
        coeffs = [rational_to_string(c) for c in coeffs]
        print(f'    "{name}": K.fromVector([{", ".join(coeffs)}])', end='')
        if i < len(values)-1:
            print(',')
        else:
            print('')
    print('  };')
    print('  fields.push({field: K, values: values});')
print('  return fields;')
print('}')

