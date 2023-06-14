import * as THREE from 'three';
import { setdefault } from './util';
import { PolyGeometry } from './piece';
import { ExactPlane, ExactQuaternion, ExactVector3 } from './math';
import { AlgebraicNumber } from './exact';

export class Puzzle {
    pieces: PolyGeometry[];
    global_rot: THREE.Quaternion;
    extent_cache: {[key: string]: [AlgebraicNumber, AlgebraicNumber]} = {};
    side_cache: {[key: string]: number} = {};
    constructor(pieces?: PolyGeometry[]) {
        this.pieces = pieces !== undefined ? pieces : [];
        this.global_rot = new THREE.Quaternion().identity();
    }
};

export class Cut {
    plane: ExactPlane;
    front: number[];
    back: number[]

    constructor(plane: ExactPlane, front: number[], back: number[]) {
        this.plane = plane;
        this.front = front;
        this.back = back;
    }

    neg(): Cut {
        return new Cut(this.plane.neg(), this.back, this.front);
    }
}

function get_side(puzzle: Puzzle, pieceNum: number, plane: ExactPlane): number {
    /* Given a piece and a plane, find which side of the plane the
       piece lies on, or both sides. Returns +1 if the piece is on the
       front side of the plane, -1 if on the back side, 0 if on both
       sides. */

    let piece = puzzle.pieces[pieceNum];
    let side_key = `${plane}/${pieceNum},${piece.rot}`;
    if (side_key in puzzle.side_cache)
        return puzzle.side_cache[side_key];
    
    let xmin: AlgebraicNumber|null = null; // ∞
    let xmax: AlgebraicNumber|null = null; // -∞
    let extent_key = `${plane.normal}/${pieceNum},${piece.rot}`;
    if (extent_key in puzzle.extent_cache)
        [xmin, xmax] = puzzle.extent_cache[extent_key];
    else {
        // Instead of rotating all vertices, rotate axis in opposite direction
        let axis = piece.rot.conj().apply(plane.normal);
        for (let v of piece.vertices) {
            let x = axis.dot(v);
            if (xmin === null || x.compare(xmin) < 0) xmin = x;
            if (xmax === null || x.compare(xmax) > 0) xmax = x;
        }
        puzzle.extent_cache[extent_key] = [xmin!, xmax!];
    }
    let side = 0;
    let d = plane.constant.neg();
    if (d.compare(xmin!) <= 0)
        side = +1;
    else if (d.compare(xmax!) >= 0)
        side = -1;
    else
        side = 0;
    puzzle.side_cache[side_key] = side;
    return side;
}

export function find_cuts(puzzle: Puzzle, pieceNums?: number[]): Cut[] {
    /* Given a list of (indexes of) pieces, find all planes that touch
       but don't intersect them. */

    if (pieceNums === undefined) {
        pieceNums = [];
        for (let i=0; i<puzzle.pieces.length; i++)
            pieceNums.push(i);
    }
    
    // Every exterior face normal is a potential axis
    let planes: {[key: string]: ExactPlane} = {};
    for (let piece of puzzle.pieces)
        for (let face of piece.faces)
            if (face.interior) {
                let normal = piece.rot.apply(face.plane.normal);
                let plane = new ExactPlane(normal, face.plane.constant).canonicalize();
                setdefault(planes, String(plane), plane);
            }
    
    let cuts: Cut[] = [];
    for (let plane of Object.values(planes)) {
        let is_cut = true;
        let front: number[] = [], back: number[] = [];
        for (let p of pieceNums) {
            let side = get_side(puzzle, p, plane);
            if (side < 0)
                back.push(p)
            else if (side > 0)
                front.push(p)
            else {/* if (side === 0) */
                is_cut = false;
                break;
            }
        }
        if (is_cut && front.length > 0 && back.length > 0)
            cuts.push(new Cut(plane, front, back));
    }
    return cuts;
}

export function find_stops(puzzle: Puzzle, cut: Cut): ExactQuaternion[] {
    let c = cut.plane.normal;
    let front_cuts = find_cuts(puzzle, cut.front);
    let back_cuts = find_cuts(puzzle, cut.back);
    
    // Find all rotation angles that form a total cut
    let stops: {[key: string]: ExactQuaternion} = {}; // set of rotations
    for (let half1 of front_cuts)
        for (let half2 of back_cuts) {
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
    // Piece 0 is immovable
    if (cut.front.includes(0)) {
        puzzle.global_rot.multiply(rot.toThree()).normalize();
        rot = rot.conj();
        cut = cut.neg();
    }
    
    // Rotate pieces
    for (let p of cut.front) {
        let pg = puzzle.pieces[p];
        pg.rot = rot.mul(puzzle.pieces[p].rot).pseudoNormalize();
    }
}
