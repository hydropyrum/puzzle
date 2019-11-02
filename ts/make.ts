/* Various utility functions for creating pieces. */

import * as THREE from 'three';
import { PolyGeometry, really_big_polygeometry} from './piece.js';
import { slice_polygeometry } from './slice.js';
import { PHI } from './util.js';
import * as polyhedra from './polyhedra.js';

function get_color(i: number) {
    /* Generate colors. The first six colors are the original Rubik's
    Cube colors, and after that are chosen to contrast with previous
    colors:
    https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/ */
    let basic_colors = [0xFFFFFF, 0xC41E3A, 0x009E60, 0x0051BA, 0xFF5800, 0xFFD500];
    if (i < 6)
        return new THREE.Color(basic_colors[i]);
    else
        return (new THREE.Color()).setHSL((i/PHI)%1, 1, 0.5);
}

const cut_color = new THREE.Color(0x666666);

export function make_shell(faces: THREE.Plane[]) {
    /* Find intersection of backs of faces and return as a Geometry. 
       Only works for convex polyhedra. */
    let g = really_big_polygeometry();
    let front;
    for (let i=0; i<faces.length; i++)
        [front, g] = slice_polygeometry(g, faces[i], get_color(i), false);
    return g;
}

export function make_cuts(cuts: THREE.Plane[], pieces: PolyGeometry[]) {
    for (let cut of cuts) {
        let newpieces: PolyGeometry[] = [];
        for (let piece of pieces) {
            for (let p of slice_polygeometry(piece, cut, cut_color, true)) {
                // Delete empty pieces
                if (p.faces.length == 0)
                    continue;
                // Delete interior pieces
                if (p.faces.every(f => f.interior))
                    continue;
                newpieces.push(p);
            }
        }
        pieces = newpieces;
    }
    return pieces;
}

function new_plane(nx: number, ny: number, nz: number, d: number) {
    let n = new THREE.Vector3(nx, ny, nz);
    n.normalize();
    return new THREE.Plane(n, d);
}

export function polyhedron(name: string, d: number) {
    switch (name) {
    case "T":  return polyhedra.tetrahedron(d); break;
    case "C":  return polyhedra.cube(d); break;
    case "O":  return polyhedra.octahedron(d); break;
    case "D":  return polyhedra.dodecahedron(d); break;
    case "I":  return polyhedra.icosahedron(d); break;
    case "kT": return polyhedra.triakisTetrahedron(d); break;
    case "jC": return polyhedra.rhombicDodecahedron(d); break;
    case "kO": return polyhedra.triakisOctahedron(d); break;
    case "kC": return polyhedra.tetrakisHexahedron(d); break;
    case "oC": return polyhedra.deltoidalIcositetrahedron(d); break;
    case "mC": return polyhedra.disdyakisDodecahedron(d); break;
    case "gC": return polyhedra.lpentagonalIcositetrahedron(d); break;
    case "jD": return polyhedra.rhombicTriacontahedron(d); break;
    case "kI": return polyhedra.triakisIcosahedron(d); break;
    case "kD": return polyhedra.pentakisDodecahedron(d); break;
    case "oD": return polyhedra.deltoidalHexecontahedron(d); break;
    case "mD": return polyhedra.disdyakisTriacontahedron(d); break;
    case "gD": return polyhedra.lpentagonalHexecontahedron(d); break;
    }
    return [];
}
