import * as THREE from 'three';
import { setdefault } from './util';
import { PolyGeometry } from './piece';
import { ExactPlane, ExactQuaternion, ExactVector3 } from './math';
import { AlgebraicNumber } from './exact';

export class Puzzle {
    pieces: PolyGeometry[];
    global_rot: ExactQuaternion;
    axes?: Axis[];
    constructor() {
        this.pieces = [];
        this.global_rot = ExactQuaternion.identity();
        this.axes = undefined;
    }
};

enum PointType { Begin = 1, End = -1 }; // numeric values are used for sorting

export interface Point {
    proj: AlgebraicNumber;
    type: PointType;
    pieceNums: number[];
}

export interface Axis {
    vector: ExactVector3;
    points: Point[];
};

export class Cut {
    axis: Axis;
    pos: number;
    dir: number;
    plane: ExactPlane;

    constructor(axis: Axis, pos: number, dir: number, plane: ExactPlane) {
        this.axis = axis;
        this.pos = pos; // front side starts at this.axis.points[pos]+1
        this.dir = dir;
        this.plane = plane;
    }

    neg(): Cut {
        return new Cut(this.axis, this.pos, -this.dir, this.plane.neg());
    }

    private get_pieces(start: number, stop: number) {
        let ret = [];
        for (let i=start; i<stop; i++) {
            let point = this.axis.points[i];
            if (point.type === PointType.Begin)
                ret.push(...point.pieceNums);
        }
        return ret;
    };
    
        
    front(): number[] {
        if (this.dir > 0)
            return this.get_pieces(this.pos+1, this.axis.points.length);
        else
            return this.get_pieces(0, this.pos);
    }

    back(): number[] {
        if (this.dir > 0)
            return this.get_pieces(0, this.pos);
        else
            return this.get_pieces(this.pos+1, this.axis.points.length);
    }
}

export function find_axes(puzzle: Puzzle): void {
    // Every face normal (removing duplicates) is a potential axis
    // to do: skip exterior faces
    let axes: {[key: string]: Axis} = {};
    for (let piece of puzzle.pieces)
        for (let face of piece.faces) {
            let n = face.plane.canonicalize().normal;
            setdefault(axes, String(n), {vector: n, points: []});
        }
    puzzle.axes = Object.values(axes);

    for (let ax of puzzle.axes) {
        // Make a list of pieces, sorted by their projection onto
        // ax. Each element of this list is a triple [proj,
        // type, pieces], where proj is the projection, type is +1 for
        // begin piece and -1 for end piece, and pieces is a list of
        // piece indices.

        // Find the minimum and maximum projection of each piece onto ax
        let begin: {[key: string]: [AlgebraicNumber, number[]]} = {};
        let end: {[key: string]: [AlgebraicNumber, number[]]} = {};
        for (let p=0; p<puzzle.pieces.length; p++) {
            let xmin: AlgebraicNumber|null = null; // ∞
            let xmax: AlgebraicNumber|null = null; // -∞
            for (let v of puzzle.pieces[p].vertices) {
                let x = ax.vector.dot(v);
                if (xmin === null || x.compare(xmin) < 0) xmin = x;
                if (xmax === null || x.compare(xmax) > 0) xmax = x;
            }
            if (xmin !== null && xmax !== null) {
                setdefault(begin, String(xmin), [xmin, []])[1].push(p);
                setdefault(end, String(xmax), [xmax, []])[1].push(p);
            } /* else assert(false); */
        }

        // Assemble them into a sorted list
        for (let e of Object.values(begin))
            ax.points.push({proj: e[0], type: PointType.Begin, pieceNums: e[1]});
        for (let e of Object.values(end))
            ax.points.push({proj: e[0], type: PointType.End, pieceNums: e[1]});
        ax.points.sort(function (x, y) {
            let d = x.proj.compare(y.proj);
            return d == 0 ? x.type - y.type : d;
        });
    }
}

export function find_cuts(puzzle: Puzzle, ps?: number[]): Cut[] {
    /* Given a list of (indexes of) pieces, find all planes that touch
       but don't cut them. The return value is a list of objects; each
       has three fields:
       - plane: ExactPlane
       - front: function (taking no arguments) that returns a list of pieces in front of the plane
       - back: function (taking no arguments) that returns a list of pieces behind the plane 

       Only considers infinite planes, and so could miss places where
       pieces could physically move.
    */
    if (puzzle.axes === undefined)
        find_axes(puzzle);

    if (ps === undefined) {
        ps = [];
        for (let i=0; i<puzzle.pieces.length; i++)
            ps.push(i);
    }
    
    let cuts: Cut[] = [];
    for (let ax of puzzle.axes!) {
        // Traverse the list to find the planes that are cuts
        let inside = 0; // running count of how many pieces are open
        for (let i=0; i<ax.points.length; i++) {
            let point = ax.points[i];
            let c = 0;
            for (let p of point.pieceNums)
                if (ps.includes(p))
                    c++;
            if (point.type === PointType.Begin)
                inside += c;
            else if (point.type === PointType.End) {
                inside -= c;
                if (inside === 0 && i+1 < ax.points.length && ax.points[i+1].type === PointType.Begin) {
                    if (!point.proj.equals(ax.points[i+1].proj))
                        console.log("warning: nonzero gap");
                    cuts.push(new Cut(ax, i, +1, new ExactPlane(ax.vector, point.proj.neg())));
                }
            }
        }
    }
    return cuts;
}

export function find_stops(puzzle: Puzzle, cut: Cut): ExactQuaternion[] {
    if (puzzle.axes === undefined)
        throw new Error("Puzzle is missing axes");
        
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
    let ps: number[] = cut.front();
    if (ps.includes(0)) {
        puzzle.global_rot = puzzle.global_rot.mul(rot);
        rot = rot.conj();
        ps = cut.back();
    }
    for (let p of ps) {
        let pg = puzzle.pieces[p];
        pg.rot = rot.mul(puzzle.pieces[p].rot);
        for (let i=0; i<pg.vertices.length; i++)
            pg.vertices[i] = rot.apply(pg.vertices[i]);
        for (let face of pg.faces) {
            face.plane = new ExactPlane(rot.apply(face.plane.normal), face.plane.constant);
        }
    }
    puzzle.axes = undefined;
}
