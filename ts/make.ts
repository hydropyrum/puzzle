/* Various utility functions for creating pieces. */

import * as THREE from 'three';
import { PolyGeometry, cube_polygeometry, ExactVector3, ExactPlane} from './piece';
import { slice_polygeometry } from './slice';
import { PHI } from './util';
import * as polyhedra from './polyhedra';
import { algebraicNumberField, AlgebraicNumber } from './exact';
import { Fraction, fraction } from './fraction';

function get_color(i: number): THREE.Color {
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

export function make_shell(faces: ExactPlane[]): PolyGeometry {
    /* Find intersection of backs of faces and return as a Geometry. 
       Only works for convex polyhedra. */
    let g = cube_polygeometry();
    let front;
    for (let i=0; i<faces.length; i++)
        [front, g] = slice_polygeometry(g, faces[i], get_color(i), false);
    return g;
}

export function make_cuts(cuts: ExactPlane[], pieces: PolyGeometry[]): PolyGeometry[] {
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

export function polyhedron(name: string, d: number): ExactPlane[] {
    let fd = Fraction.fromNumber(d);
    switch (name) {
        case "T":  return polyhedra.tetrahedron(fd);
        case "C":  return polyhedra.cube(fd);
        case "O":  return polyhedra.octahedron(fd);
        case "D":  return polyhedra.dodecahedron(fd);
        case "I":  return polyhedra.icosahedron(fd);
        case "jC": return polyhedra.rhombicDodecahedron(fd);
        case "jD": return polyhedra.rhombicTriacontahedron(fd);
    }
    return [];
}
