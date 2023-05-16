/* Various utility functions for creating pieces. */

import * as THREE from 'three';
import { PolyGeometry, cube_polygeometry, slice_polygeometry } from './piece';
import { ExactPlane } from './math';
import { setdefault } from './util';
import * as polyhedra from './polyhedra';
import { AlgebraicNumber } from './exact';

function get_color(i: number): THREE.Color {
    /* Generate colors. The first six colors are the original Rubik's
    Cube colors, and after that are chosen to contrast with previous
    colors:
    https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/ */
    let basic_colors = [0xFFFFFF, 0xC41E3A, 0x009E60, 0x0051BA, 0xFF5800, 0xFFD500];
    let PHI = (1+Math.sqrt(5))/2;
    if (i < 6)
        return new THREE.Color(basic_colors[i]);
    else
        return (new THREE.Color()).setHSL((i/PHI)%1, 1, 0.5);
}

const cut_color = new THREE.Color(0x666666);

export function make_shell(faces: ExactPlane[]): PolyGeometry {
    /* Find intersection of backs of faces and return as a Geometry. 
       Only works for convex polyhedra. */
    console.time('shell constructed in');
    let g = cube_polygeometry();
    let front;
    for (let i=0; i<faces.length; i++)
        [front, g] = slice_polygeometry(g, faces[i], get_color(i), false);
    console.timeEnd('shell constructed in');
    return g;
}

export function make_cuts(cuts: ExactPlane[], pieces: PolyGeometry[]): PolyGeometry[] {
    let count = 0;

    let planes: {[key: string]: ExactPlane[]} = {};
    for (let p of cuts)
        setdefault(planes, String(p.normal), []).push(p);
    
    for (let ps of Object.values(planes)) {
        let backpieces: PolyGeometry[] = [];
        ps.sort((a,b) => -a.constant.compare(b.constant));
        for (let cut of ps) {
            let frontpieces: PolyGeometry[] = [];
            for (let piece of pieces) {
                count += 1;
                let [frontpiece, backpiece] = slice_polygeometry(piece, cut, cut_color, true);
                if (frontpiece.faces.length > 0 && !frontpiece.faces.every(f => f.interior))
                    frontpieces.push(frontpiece);
                if (backpiece.faces.length > 0 && !backpiece.faces.every(f => f.interior))
                    backpieces.push(backpiece);
            }
            pieces = frontpieces;
        }
        pieces.push(...backpieces);
    }
    
    console.log('slices performed:', count);
    return pieces;
}

export function polyhedron(name: string, d: AlgebraicNumber): ExactPlane[] {
    switch (name) {
        case "T":  return polyhedra.tetrahedron(d);
        case "C":  return polyhedra.cube(d);
        case "O":  return polyhedra.octahedron(d);
        case "D":  return polyhedra.dodecahedron(d);
        case "I":  return polyhedra.icosahedron(d);
        case "jC": return polyhedra.rhombicDodecahedron(d);
        case "jD": return polyhedra.rhombicTriacontahedron(d);
    }
    return [];
}
