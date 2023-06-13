import * as THREE from 'three';
import { setdefault } from './util';
import { PolyGeometry } from './piece';
import { ExactPlane, ExactQuaternion, ExactVector3 } from './math';
import { AlgebraicNumber } from './exact';

export class Puzzle {
    pieces: PolyGeometry[];
    global_rot: THREE.Quaternion;
    axes: Axis[];
    constructor(pieces?: PolyGeometry[]) {
        this.pieces = pieces !== undefined ? pieces : [];
        this.global_rot = new THREE.Quaternion().identity();
        this.axes = [];
        make_axes(this);
    }
};

enum PointType { Begin = 1, End = -1 }; // numeric values are used for sorting

interface Point {
    proj: AlgebraicNumber;
    type: PointType;
    pieceNums: number[];
}

interface Axis {
    dir: ExactVector3;
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

function make_axis(puzzle: Puzzle, dir: ExactVector3, pieceNums: number[]): Axis {
    let ax: Axis = {dir: dir, points: []};
    
    // Make a list of pieces, sorted by their projection onto
    // ax. Each element of this list is a triple [proj,
    // type, pieces], where proj is the projection, type is +1 for
    // begin piece and -1 for end piece, and pieces is a list of
    // piece indices.

    // Find the minimum and maximum projection of each piece onto ax
    let begin: {[key: string]: [AlgebraicNumber, number[]]} = {};
    let end: {[key: string]: [AlgebraicNumber, number[]]} = {};
    for (let p of pieceNums) {
        let xmin: AlgebraicNumber|null = null; // ∞
        let xmax: AlgebraicNumber|null = null; // -∞
        for (let v of puzzle.pieces[p].vertices) {
            let x = ax.dir.dot(v);
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
    return ax;
}

function make_axes(puzzle: Puzzle): void {
    // Every face normal (removing duplicates) is a potential axis
    let dirs: {[key: string]: ExactVector3} = {};
    for (let piece of puzzle.pieces)
        for (let face of piece.faces)
            if (face.interior) {
                let dir = face.plane.canonicalize().normal;
                setdefault(dirs, String(dir), dir);
            }
    let pieceNums: number[] = [];
    for (let i=0; i<puzzle.pieces.length; i++)
        pieceNums.push(i);
    
    puzzle.axes = [];
    for (let dir of Object.values(dirs))
        puzzle.axes.push(make_axis(puzzle, dir, pieceNums));
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

    if (ps === undefined) {
        ps = [];
        for (let i=0; i<puzzle.pieces.length; i++)
            ps.push(i);
    }
    let cuts: Cut[] = [];
    for (let ax of puzzle.axes) {
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
                if (inside === 0 && c > 0 && i+1 < ax.points.length && ax.points[i+1].type === PointType.Begin && point.proj.equals(ax.points[i+1].proj)) {
                    let c = 0;
                    for (let p of ax.points[i+1].pieceNums)
                        if (ps.includes(p))
                            c++;
                    if (c > 0) {
                        cuts.push(new Cut(ax, i, +1, new ExactPlane(ax.dir, point.proj.neg())));
                    }
                }
            }
        }
    }
    return cuts;
}

export function find_stops(puzzle: Puzzle, cut: Cut): ExactQuaternion[] {
    let one = AlgebraicNumber.fromInteger(1);
    let c = cut.plane.normal;
    
    let move_pieces = cut.front();
    let stay_pieces = cut.back();

    // Find cuts of moved pieces and not-moved pieces
    // To do: Actually perform the split, so that we don't have to
    // check for membership in move_pieces and stay_pieces.
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

function select_pieces(puzzle: Puzzle, sub: number[]): Axis[] {
    // Collect all the face normals of the selected pieces
    // to do: remove duplicate code with find_axes
    let dirs_sub: {[key: string]: ExactVector3} = {};
    for (let p of sub)
        for (let face of puzzle.pieces[p].faces)
            if (face.interior) {
                let dir = face.plane.canonicalize().normal;
                setdefault(dirs_sub, String(dir), dir);
            }
    // For each axis in the direction of a face normal,
    // keep only the extents of selected pieces
    let axes_sub: Axis[] = [];
    for (let ax of puzzle.axes) {
        if (!(String(ax.dir) in dirs_sub)) continue;
        let ax_sub: Axis = {dir: ax.dir, points: []};
        for (let point of ax.points) {
            let pieceNums_sub = [];
            for (let p of point.pieceNums)
                if (sub.includes(p)) pieceNums_sub.push(p);
            if (pieceNums_sub.length > 0)
                ax_sub.points.push({proj: point.proj, type: point.type, pieceNums: pieceNums_sub});
        }
        axes_sub.push(ax_sub);
    }
    return axes_sub;
}

function merge_axis(ax1: Axis, ax2: Axis): Axis {
    // assert(ax1.dir.equals(ax2.dir));
    let ax: Axis = {dir: ax1.dir, points: []};
    let i1 = 0, i2 = 0;
    while (i1 < ax1.points.length && i2 < ax2.points.length) {
        let c = ax1.points[i1].proj.compare(ax2.points[i2].proj);
        if (c < 0)
            ax.points.push(ax1.points[i1++]);
        else if (c > 0)
            ax.points.push(ax2.points[i2++]);
        else if (ax1.points[i1].type < ax2.points[i2].type)
            ax.points.push(ax1.points[i1++]);
        else if (ax1.points[i1].type > ax2.points[i2].type)
            ax.points.push(ax2.points[i2++]);
        else {
            ax.points.push({
                proj: ax1.points[i1].proj,
                type: ax1.points[i1].type,
                pieceNums: ax1.points[i1].pieceNums.concat(ax2.points[i2].pieceNums)
            });
            i1++; i2++;
        }
    }
    while (i1 < ax1.points.length)
        ax.points.push(ax1.points[i1++]);
    while (i2 < ax2.points.length)
        ax.points.push(ax2.points[i2++]);
    return ax;
}

function merge_axes(puzzle: Puzzle,
                    axes1: Axis[], pieceNums1: number[],
                    axes2: Axis[], pieceNums2: number[]): Axis[] {
    let axes: Axis[] = [];
    let axes1_index: {[key: string]: Axis} = {};
    for (let ax of axes1) axes1_index[String(ax.dir)] = ax;
    let axes2_index: {[key: string]: Axis} = {};
    for (let ax of axes2) axes2_index[String(ax.dir)] = ax;
    for (let ax1 of axes1) {
        let vh = String(ax1.dir);
        if (vh in axes2_index)
            axes.push(merge_axis(ax1, axes2_index[vh]));
        else
            axes.push(merge_axis(ax1, make_axis(puzzle, ax1.dir, pieceNums2)));
    }
    for (let ax2 of axes2)
        if (!(String(ax2.dir) in axes1_index))
            axes.push(merge_axis(make_axis(puzzle, ax2.dir, pieceNums1), ax2));
    return axes;
}

export function make_move(puzzle: Puzzle, cut: Cut, rot: ExactQuaternion): void {
    let move_pieces = cut.front();
    let stay_pieces = cut.back();
    
    // Piece 0 is immovable. This guarantees that the rotations are
    // the composition of a bounded number of rotations. This ensures
    // there is no coefficient explosion and might make it possible to
    // cache computations.
    
    if (move_pieces.includes(0)) {
        puzzle.global_rot.multiply(rot.toThree()).normalize();
        rot = rot.conj();
        [move_pieces, stay_pieces] = [stay_pieces, move_pieces];
    }
    
    // Split axes in two
    let move_axes = select_pieces(puzzle, move_pieces);
    let stay_axes = select_pieces(puzzle, stay_pieces);

    // Rotate pieces
    for (let p of move_pieces) {
        let pg = puzzle.pieces[p];
        pg.rot = rot.mul(puzzle.pieces[p].rot).pseudoNormalize();
        for (let i=0; i<pg.vertices.length; i++)
            pg.vertices[i] = rot.apply(pg.vertices[i]);
        for (let face of pg.faces)
            face.plane = new ExactPlane(rot.apply(face.plane.normal), face.plane.constant);
    }
    
    // Rotate move_axes
    for (let ax of move_axes) {
        ax.dir = rot.apply(ax.dir);
        if (ax.dir.pseudoSign() < 0) {
            ax.dir = ax.dir.neg();
            ax.points.reverse();
            for (let point of ax.points) {
                point.proj = point.proj.neg();
                point.type = -point.type; // Begin <-> End
            }
        }
    }
    
    // Merge two halves
    puzzle.axes = merge_axes(puzzle, move_axes, move_pieces, stay_axes, stay_pieces);
}
