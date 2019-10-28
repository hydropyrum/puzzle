import * as THREE from 'three';
import { setdefault, canonicalize_plane, floathash, pointhash, rothash } from './util.js';
import { PolyGeometry } from './piece.js';
import { keys, EPSILON } from './util.js';

export interface Cut {
    plane: THREE.Plane;
    front: () => number[];
    back: () => number[];
}

export function find_cuts(puzzle: PolyGeometry[], ps?: number[]) {
    /* Given a list of (indexes of) pieces, find all planes that touch
       but don't cut them. The return value is a list of objects; each
       has three fields:
       - plane: Plane
       - front: function (taking no arguments) that returns a list of pieces in front of the plane
       - back: function (taking no arguments) that returns a list of pieces behind the plane 

       Only considers infinite planes, and so could miss places where
       pieces could physically move.
    */

    // Default is all pieces
    if (ps === undefined) {
        ps = [];
        for (let i=0; i<puzzle.length; i++)
            ps.push(i);
    }

    // Make list of candidate planes, grouping together parallel planes
    let planes: {[key: string]: THREE.Plane} = {};
    for (let p of ps)
        for (let face of puzzle[p].faces) {
            let plane = face.plane.clone();
            plane.normal.applyQuaternion(puzzle[p].rot).normalize();
            canonicalize_plane(plane);
            setdefault(planes, pointhash(plane.normal), {})[floathash(plane.constant)] = plane;
        }

    let cuts: {[key: string]: Cut} = {};

    for (let nh in planes) {
        
        // Make a list of pieces and planes, sorted by their
        // projection onto the current axis (represented by nh). Each
        // element of this list is a triple [proj, type, what], where
        // proj is the projection, type is +1 for begin piece, -1 for
        // end piece, and 0 for plane, and what is a piece index or a
        // plane.

        const BEGIN_PIECE = 1, END_PIECE = -1, PLANE = 0;
        
        let a: [number, number, number|THREE.Plane][] = [];
        let planes_n = Object.values(planes[nh]);
        let n = planes_n[0].normal;
        for (let plane of planes_n)
            a.push([-plane.constant, PLANE, plane]);
        for (let p of ps) {
            let xmin = Infinity;
            let xmax = -Infinity;
            // Instead of rotating all of p's vertices,
            // rotate n in the opposite direction.
            let nq = n.clone();
            nq.applyQuaternion(puzzle[p].rot.clone().conjugate());
            for (let v of puzzle[p].vertices) {
                let x = nq.dot(v);
                if (x < xmin) xmin = x;
                if (x > xmax) xmax = x;
            }
            // Shrink piece by EPSILON in case of rounding errors
            a.push([xmin+EPSILON, BEGIN_PIECE, p]);
            a.push([xmax-EPSILON, END_PIECE, p]);
        }
        a.sort(function (x, y) {
            let d = x[0] - y[0];
            return d == 0 ? x[1] - y[1] : d;
        });

        let get_pieces = function (start: number, stop: number) {
            let ret = [];
            for (let i=start; i<stop; i++) {
                let [d, type, what] = a[i];
                if (type == BEGIN_PIECE && typeof what === "number")
                    ret.push(what);
            }
            return ret;
        };
        
        // Now traverse the list to find the planes that are cuts
        let inside = 0; // running count of how many pieces are open
        for (let i=0; i<a.length; i++) {
            let [d, type, what] = a[i];
            if (type == BEGIN_PIECE)
                inside += 1;
            else if (type == END_PIECE)
                inside -= 1;
            else if (type == PLANE &&
                     inside == 0 && // only keep planes not inside pieces
                     i > 0 && i < a.length-1 && // only keep planes between pieces
                     what instanceof THREE.Plane) {
                // hash by back-side pieces to avoid duplication
                let h = get_pieces(0, i).sort().join(',');
                cuts[h] = {plane: what, 
                           front: function () { return get_pieces(i+1, a.length) },
                           back: function () { return get_pieces(0, i) }};
            }
        }
    }
    return Object.values(cuts);
}

export function find_stops(puzzle: PolyGeometry[], cut: Cut) {
    let move_pieces = cut.front();
    let stay_pieces = cut.back();

    // Find cuts of moved pieces and not-moved pieces
    let move_cuts = find_cuts(puzzle, move_pieces);
    let stay_cuts = find_cuts(puzzle, stay_pieces);

    // Find all rotation angles that form a total cut

    let stops: {[key: string]: THREE.Quaternion} = {};
    for (let half1 of move_cuts)
        for (let half2 of stay_cuts) {
            let c = cut.plane.normal;
            let p1 = half1.plane.normal, p2 = half2.plane.normal;
            let d1 = half1.plane.constant, d2 = half2.plane.constant;
            let h1 = c.dot(p1), h2 = c.dot(p2);
            let h: number;

            // Check if half1.plane can be rotated to half2.plane (or its negation)
            if (Math.abs(d1 - d2) < EPSILON &&
                Math.abs(h1 - h2) < EPSILON)
                h = h2;
            else if (Math.abs(d1 + d2) < EPSILON &&
                     Math.abs(h1 + h2) < EPSILON) {
                p2 = p2.clone().negate();
                h = -h2;
            } else
                continue;
            
            // Skip if half1 and half2 are parallel to cut
            if (Math.abs(h) >= 1-EPSILON)
                continue;

            // Project p1 and p2 onto cut.plane and find half-angle between them
            let r = Math.sqrt(1-h*h);
            // cos ∠(n1,n2)/2 = ‖n1/‖n1‖ + n2/‖n2‖‖/2
            let cos_half = c.clone().multiplyScalar(-2*h).add(p1).add(p2).length()/(2*r);
            // sin ∠(n1,n2)/2 = ‖n1/‖n1‖ - n2/‖n2‖‖/2
            let sin_half = p1.clone().sub(p2).length()/(2*r);
            
            // This makes q.w lie in [+1, -1), which corresponds to [0, 360) degrees
            let triple = p1.clone().cross(p2).dot(c);
            if (triple < 0 && cos_half < 1)
                cos_half = -cos_half;
            let q = new THREE.Quaternion(
                sin_half * c.x,
                sin_half * c.y,
                sin_half * c.z,
                cos_half
            ).normalize();
            // bug: a rounding error here could cause two stops to be
            // found differing only by a very small angle, but this
            // doesn't matter, because we (currently) are only
            // interested in the smallest nonzero stop.
            stops[floathash(q.w)] = q;
        }
    let ret = Object.values(stops);
    ret.sort((a: THREE.Quaternion, b: THREE.Quaternion) => b.w-a.w);
    return ret;
}

export function make_move(puzzle: PolyGeometry[], cut: Cut, rot: THREE.Quaternion, global_rot: THREE.Quaternion) {
    // Piece 0 is immovable
    if (cut.front().includes(0)) {
        global_rot.multiply(rot).normalize();
        let inv = rot.clone().conjugate();
        for (let p of cut.back())
            puzzle[p].rot.premultiply(inv).normalize();
    } else {
        for (let p of cut.front())
            puzzle[p].rot.premultiply(rot).normalize();
    }
    // If a piece's rotation is close to a previous one,
    // use the old rotation. This eliminates buildup of rounding errors.
    for (let piece of puzzle) {
        let h = rothash(piece.rot);
        if (h in piece.cache)
            piece.rot.copy(piece.cache[h]);
        else
            piece.cache[h] = piece.rot.clone();
    }
}
