/* Various utility functions for creating pieces. */

import * as THREE from 'three';
import { PolyGeometry, really_big_polygeometry} from './piece.js';
import { slice_polygeometry } from './slice.js';
import { PHI } from './util.js';

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
        [front, g] = slice_polygeometry(g, faces[i], get_color(i));
    return g;
}

export function make_cuts(cuts: THREE.Plane[], pieces: PolyGeometry[]) {
    for (let cut of cuts) {
        let newpieces: PolyGeometry[] = [];
        for (let piece of pieces) {
            for (let p of slice_polygeometry(piece, cut, cut_color)) {
                // Delete empty pieces
                if (p.faces.length == 0)
                    continue;
                // Delete interior pieces
                if (p.faces.every(f => f.color === cut_color))
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

export function tetrahedron(d: number) {
    /* Tetrahedron with inradius d and
       - Circumradius: 3d
       - Midradius: √3d */
    let cuts = [];
    cuts.push(new_plane(-1, -1, -1, -d));
    cuts.push(new_plane(-1,  1,  1, -d));
    cuts.push(new_plane( 1, -1,  1, -d));
    cuts.push(new_plane( 1,  1, -1, -d));
    return cuts;
}

export function cube(d: number) {
    /* Cube with inradius d and
       - Circumradius: √3d
       - Midradius: √2d */
    let cuts = [];

    for (let x of [-1, 1]) {
        cuts.push(new_plane(x, 0, 0, -d));
        cuts.push(new_plane(0, x, 0, -d));
        cuts.push(new_plane(0, 0, x, -d));
    }
    return cuts;
}

export function octahedron(d: number) {
    /* Octahedron with inradius d and
       - Circumradius: √3
       - Midradius: √6/2 */
    
    let cuts = [];
    for (let x of [-1, 1])
        for (let y of [-1, 1]) {
            cuts.push(new_plane(x, y, 1, -d));
            cuts.push(new_plane(x, y, -1, -d));
        }
    return cuts;
}

export function rhombic_dodecahedron(d: number) {
    /* Rhombic dodecahedron with inradius d */
    let cuts = [];
    for (let x of [-1, 1])
        for (let y of [-1, 1]) {
            cuts.push(new_plane(x, y, 0, -d));
            cuts.push(new_plane(0, x, y, -d));
            cuts.push(new_plane(y, 0, x, -d));
        }
    return cuts;
}

export function dodecahedron(d: number) {
    /* Dodecahedron with inradius d */
    let cuts = [];
    for (let x of [-PHI, PHI])
        for (let y of [-1, 1]) {
            cuts.push(new_plane(x, y, 0, -d));
            cuts.push(new_plane(0, x, y, -d));
            cuts.push(new_plane(y, 0, x, -d));
        }
    return cuts;
}

export function icosahedron(d: number) {
    /* Icosahedron with inradius d */
    let cuts = [];
    for (let x of [-1, 1])
        for (let y of [-1, 1])
            for (let z of [-1, 1])
                cuts.push(new_plane(x, y, z, -d));
    for (let x of [-1/PHI, 1/PHI])
        for (let y of [-PHI, PHI]) {
            cuts.push(new_plane(x, y, 0, -d));
            cuts.push(new_plane(0, x, y, -d));
            cuts.push(new_plane(y, 0, x, -d));
        }
    return cuts;
}

export function rhombic_triacontahedron(d: number) {
    /* Rhombic triacontahedron with inradius d */
    let cuts = []
    for (let x of [-1, 1]) {
        cuts.push(new_plane(x, 0, 0, -d));
        cuts.push(new_plane(0, x, 0, -d));
        cuts.push(new_plane(0, 0, x, -d));
    }
    for (let x of [-1/2, 1/2])
        for (let y of [-PHI/2, PHI/2])
            for (let z of [-(PHI+1)/2, (PHI+1)/2]) {
                cuts.push(new_plane(x, y, z, -d));
                cuts.push(new_plane(z, x, y, -d));
                cuts.push(new_plane(y, z, x, -d));
            }
    return cuts;
}

