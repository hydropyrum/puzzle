import * as THREE from 'three';
import { setdefault, canonicalize_plane, floathash, pointhash, planehash } from './util.js';

export function find_cuts(puzzle, ps) {
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
    let planes = {};
    for (let p of ps)
        for (let face of puzzle[p].faces) {
            let plane = face.plane.clone();
            plane.normal.applyQuaternion(puzzle[p].rot);
            canonicalize_plane(plane);
            setdefault(planes, pointhash(plane.normal), {})[planehash(plane)] = plane;
        }

    let ret = [];

    for (let nh of Object.keys(planes)) {
        
        // Make a list of pieces and planes, sorted by their
        // projection onto the current axis (represented by nh). Each
        // element of this list is a triple [proj, type, what], where
        // proj is the integerized projection, type is +1 for begin
        // piece, -1 for end piece, and 0 for plane, and what is a
        // piece index or a plane.

        const BEGIN_PIECE = 1, END_PIECE = -1, PLANE = 0;
        
        let a = [];
        let plane;
        for (plane of Object.values(planes[nh]))
            a.push([floathash(-plane.constant), PLANE, plane]);
        for (let p of ps) {
            let xs = puzzle[p].vertices.map(function(x) {
                x = x.clone();
                x.applyQuaternion(puzzle[p].rot);
                return plane.normal.dot(x);
            });
            xs.sort((a, b) => a - b);
            a.push([floathash(xs[0]), BEGIN_PIECE, p]);
            a.push([floathash(xs[xs.length-1]), END_PIECE, p]);
        }
        a.sort(function (x, y) {
            let d = x[0] - y[0];
            return d == 0 ? x[1] - y[1] : d;
        });

        function get_pieces(start, stop) {
            let ret = [];
            for (let i=start; i<stop; i++) {
                let [hash, type, what] = a[i];
                if (type == BEGIN_PIECE)
                    ret.push(what);
            }
            return ret;
        }
        
        // Now traverse the list to find the planes that are cuts
        let inside = 0; // running count of how many pieces are open
        for (let i=0; i<a.length; i++) {
            let [hash, type, what] = a[i];
            if (type == BEGIN_PIECE)
                inside += 1;
            else if (type == END_PIECE)
                inside -= 1;
            else if (type == PLANE &&
                     inside == 0 && // only keep planes not inside pieces
                     i > 0 && i < a.length-1) // only keep planes between pieces
                ret.push({
                    plane: what,
                    front: function () { return get_pieces(i+1, a.length) },
                    back: function () { return get_pieces(0, i) }
                });
        }
    }
    return ret;
}

function partition_cuts(cuts, axis) {
    // Partition cuts according to their distance from origin and angle relative to axis
    let q = (new THREE.Quaternion()).setFromUnitVectors(axis, new THREE.Vector3(0, 1, 0)); // y-axis is pole of spherical coordinates
    var ret = {};
    for (let c of cuts) {
        let p = c.plane;
        let v = p.normal.clone().applyQuaternion(q);
        let s = (new THREE.Spherical()).setFromVector3(v);
        let dh = floathash(p.constant);
        let phi = floathash(s.phi);
        let phic = floathash(Math.PI-s.phi);
        if (phi == 0 || phic == 0) continue; // perpendicular to axis
        if (dh >= 0)
            setdefault(ret, dh + "," + phi, []).push(s.theta);
        if (dh <= 0)
            setdefault(ret, -dh + "," + phic, []).push(
                s.theta>0 ? s.theta-Math.PI : s.theta+Math.PI
            );
    }
    return ret;
}

export function find_stops(puzzle, cut) {
    let move_pieces = cut.front();
    let stay_pieces = cut.back();

    // Find cuts of moved pieces and not-moved pieces
    let move_cuts = find_cuts(puzzle, move_pieces);
    let stay_cuts = find_cuts(puzzle, stay_pieces);

    // Find all rotation angles that form a total cut
    let move_partition = partition_cuts(move_cuts, cut.plane.normal);
    let stay_partition = partition_cuts(stay_cuts, cut.plane.normal);

    let stops = {};
    for (let h of Object.keys(move_partition)) {
        if (!(h in stay_partition)) continue;
        // to do: sort, then find minimum difference
        for (let a1 of move_partition[h])
            for (let a2 of stay_partition[h]) {
                let d = a2 - a1;
                while (floathash(d) < floathash(-Math.PI)) d += 2*Math.PI;
                while (floathash(d) >= floathash(Math.PI)) d -= 2*Math.PI;
                stops[floathash(d)] = d;
            }
    }
    stops = Object.values(stops);
    stops.sort((a,b) => a-b);
    return stops;
}

export function make_move(puzzle, cut, angle) {
    let rot = new THREE.Quaternion();
    rot.setFromAxisAngle(cut.plane.normal, angle);
    for (let p of cut.front())
        puzzle[p].rot.premultiply(rot);
}
