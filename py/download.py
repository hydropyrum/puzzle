import sys, os
import requests

def download(name):
    url = f'http://dmccooey.com/polyhedra/{name}.txt'
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    return r.text

if __name__ == "__main__":
    dir = sys.argv[1]
    
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
        'gD': 'RpentagonalHexecontahedron',
        'mD': 'DisdyakisTriacontahedron',
        # Prisms and antiprisms
        'P3': 'TriangularPrism',
        'P5': 'PentagonalPrism',
        'P6': 'HexagonalPrism',
        'A4': 'SquareAntiprism',
        'A5': 'PentagonalAntiprism',
        'A6': 'HexagonalAntiprism',
        # Dipyramids and trapezohedra
        'dP3': 'TriangularDipyramid',
        'dP5': 'PentagonalDipyramid',
        'dP6': 'HexagonalDipyramid',
        'dA4': 'TetragonalTrapezohedron',
        'dA5': 'PentagonalTrapezohedron',
        'dA6': 'HexagonalTrapezohedron',
    }
    for code, name in shapes.items():
        print(name)
        text = download(name)
        with open(os.path.join(dir, name+'.txt'), 'w') as outfile:
            outfile.write(text)
