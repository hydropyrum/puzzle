import * as THREE from 'three';
import { setdefault } from './util';
import { PolyGeometry, Puzzle } from './piece';
import { ExactPlane, ExactQuaternion } from './math';
import { AlgebraicNumber } from './exact';

export class Cut {
    plane: ExactPlane;
    front: () => number[];
    back: () => number[];

    constructor(plane: ExactPlane, front: () => number[], back: () => number[]) {
        this.plane = plane;
        this.front = front;
        this.back = back;
    }

    neg(): Cut { return new Cut(this.plane.neg(), this.back, this.front); }
}

export function find_cuts(puzzle: PolyGeometry[], ps?: number[]): Cut[] {
    /* Given a list of (indexes of) pieces, find all planes that touch
       but don't cut them. The return value is a list of objects; each
       has three fields:
       - plane: ExactPlane
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
    // and removing duplicate planes
    let planes: {[key: string]: {[key: string]: ExactPlane}} = {};
    for (let p of ps)
        for (let face of puzzle[p].faces) {
            let plane = new ExactPlane(
                puzzle[p].rot.apply(face.plane.normal),
                face.plane.constant).canonicalize();
            setdefault(planes, String(plane.normal), {})[String(plane.constant)] = plane;
        }

    let cuts: Cut[] = [];

    for (let nh in planes) {
        
        // Make a list of pieces and planes, sorted by their
        // projection onto the current axis (represented by nh). Each
        // element of this list is a triple [proj, type, plane], where
        // proj is the projection, type is +1 for begin piece, -1 for
        // end piece, and 0 for plane, and plane is an ExactPlane or
        // list of piece indices.

        const BEGIN_PIECE = 1, END_PIECE = -1, PLANE = 0;
        
        let a: [AlgebraicNumber, number, ExactPlane|number[]][] = [];
        let planes_n = Object.values(planes[nh]);
        let n = planes_n[0].normal;
        for (let plane of planes_n)
            a.push([plane.constant.neg(), PLANE, plane]);
        let extents: {[key: string]: [AlgebraicNumber, AlgebraicNumber, number[]]} = {};
        for (let p of ps) {
            let xmin: AlgebraicNumber|null = null; // ∞
            let xmax: AlgebraicNumber|null = null; // -∞
            // Instead of rotating all of p's vertices,
            // rotate n in the opposite direction.
            let nq = puzzle[p].rot.conj().apply(n);
            for (let v of puzzle[p].vertices) {
                let x = nq.dot(v);
                if (xmin === null || x.compare(xmin) < 0) xmin = x;
                if (xmax === null || x.compare(xmax) > 0) xmax = x;
            }
            if (xmin !== null && xmax !== null) {
                let key = String(xmin)+":"+String(xmax);
                setdefault(extents, key, [xmin, xmax, []])[2].push(p);
            }
        }
        for (let e of Object.values(extents)) {
            a.push([e[0], BEGIN_PIECE, e[2]]);
            a.push([e[1], END_PIECE, e[2]]);
        }
        console.log('sorting', a.length);
        a.sort(function (x, y) {
            let d = x[0].compare(y[0]);
            return d == 0 ? x[1] - y[1] : d;
        });

        let get_pieces = function (start: number, stop: number) {
            let ret = [];
            for (let i=start; i<stop; i++) {
                let [d, type, what] = a[i];
                if (type == BEGIN_PIECE)
                    ret.push(...what as number[]);
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
                     what instanceof ExactPlane) {
                let h = get_pieces(0, i).sort().join(',');
                cuts.push( new Cut(
                    what, 
                    function () { return get_pieces(i+1, a.length) },
                    function () { return get_pieces(0, i) }
                ));
            }
        }
    }
    return cuts;
}

export function find_stops(puzzle: PolyGeometry[], cut: Cut): ExactQuaternion[] {
    let one = AlgebraicNumber.fromInteger(1);
    let c = cut.plane.normal;
    
    let move_pieces = cut.front();
    let stay_pieces = cut.back();

    // Find cuts of moved pieces and not-moved pieces
    let move_cuts = find_cuts(puzzle, move_pieces);
    let stay_cuts = find_cuts(puzzle, stay_pieces);

    // Find all rotation angles that form a total cut
    let stops: {[key: string]: ExactQuaternion} = {}; // set of rotations
    for (let half1 of move_cuts)
        for (let half2 of stay_cuts) {
            let p1 = half1.plane.normal, p2 = half2.plane.normal;
            let d1 = half1.plane.constant, d2 = half2.plane.constant;
            let h1 = c.dot(p1), h2 = c.dot(p2);

            // If parallel to cut, then skip
            if (h1.mul(h1).equals(c.dot(c).mul(p1.dot(p1)))) continue;

            // Check if half1.plane can be rotated to half2.plane (or its negation)
            // and compute rotation quaternion
            if (d1.equals(d2) && h1.equals(h2)) {
                let rot = ExactQuaternion.fromAxisPoints(c, p1, p2);
                stops[String(rot)] = rot;
            }
            if (d1.neg().equals(d2) && h1.neg().equals(h2)) {
                let rot = ExactQuaternion.fromAxisPoints(c, p1, p2.neg());
                stops[String(rot)] = rot;
            }
        }
    
    // Sort the cuts by (pseudo)angle
    let ret: [AlgebraicNumber, ExactQuaternion][] = Object.values(stops).map(
        rot => [rot.pseudoAngle(), rot]
    );
    ret.sort((a,b) => a[0].compare(b[0]));
    return ret.map(x => x[1]);
}

export function make_move(puzzle: Puzzle, cut: Cut, rot: ExactQuaternion): void {
    // Piece 0 is immovable. This guarantees that the rotations are
    // the composition of a bounded number of rotations. This ensures
    // there is no coefficient explosion and might make it possible to
    // cache computations.
    if (cut.front().includes(0)) {
        puzzle.global_rot = puzzle.global_rot.mul(rot);
        rot = rot.conj();
        for (let p of cut.back())
            puzzle.pieces[p].rot = rot.mul(puzzle.pieces[p].rot);
    } else {
        for (let p of cut.front())
            puzzle.pieces[p].rot = rot.mul(puzzle.pieces[p].rot);
    }
}
