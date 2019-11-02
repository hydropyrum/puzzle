import requests
import re

def parse(name, url):
    r = requests.get(url)
    r.raise_for_status()
    state = 0
    
    for line in r.text.splitlines():
        if line == "":
            pass
        elif line == "Faces:":
            print('  let cuts = [');
            state = 2
        elif state == 0:
            print(f'/* {line} */')
            name = name[0].lower() + name[1:];
            print(f'export function {name}(d: number) {{')
            print(f'  // {url}')
            state = 1
        elif state == 1:
            exprs = line.split('=')
            lhs = exprs[0].strip()
            if lhs[0] == 'C':
                for rhs in exprs[1:]:
                    rhs = rhs.strip()
                    try:
                        _ = float(rhs)
                    except ValueError:
                        print(f'  // {lhs} = {rhs}')
                        continue
                    print(f'  let {lhs} = {rhs};')
            elif lhs[0] == 'V':
                rhs = exprs[1].strip()
                print(f'  let {lhs} = new THREE.Vector3{rhs};')
            else:
                print(f'  // {line}')
        elif state == 2:
            m = re.match(r'\{(.*)\}', line)
            vs = ', '.join(f'V{int(v)}' for v in m.group(1).split(',')[:3])
            print(f'    // {line}')
            print(f'    new THREE.Plane().setFromCoplanarPoints({vs}),')
    print('  ];')
    print('  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });');
    print('  return cuts;')
    print('}\n')

print("import * as THREE from 'three';")
    
for name in ['Tetrahedron',
             'Octahedron',
             'Cube',
             'Icosahedron',
             'Dodecahedron',
             'TriakisTetrahedron',
             'RhombicDodecahedron',
             'TetrakisHexahedron',
             'TriakisOctahedron',
             'DeltoidalIcositetrahedron',
             'RpentagonalIcositetrahedron',
             'LpentagonalIcositetrahedron',
             'RhombicTriacontahedron',
             'DisdyakisDodecahedron',
             'PentakisDodecahedron',
             'TriakisIcosahedron',
             'DeltoidalHexecontahedron',
             'LpentagonalHexecontahedron',
             'RpentagonalHexecontahedron',
             'DisdyakisTriacontahedron']:
    url = f'http://dmccooey.com/polyhedra/{name}.txt'
    parse(name, url)
