import * as THREE from 'three';
import { AlgebraicNumber } from './exact';
import { ExactPlane, ExactVector3, ExactQuaternion } from './math';
import { cube_polygeometry, slice_polygeometry } from './piece';
import { Puzzle, find_cuts, find_stops } from './move';

let fromNumber = AlgebraicNumber.fromInteger;

function exactPlane(a, b, c, d) {
    return new ExactPlane(
        new ExactVector3(fromNumber(a), fromNumber(b), fromNumber(c)),
        fromNumber(d)
    );
}

let shell = cube_polygeometry(fromNumber(2));
let cuts = [
    {plane: exactPlane(0, 0, 1, 1), stops: [0, 90, 180, 270]},
    {plane: exactPlane(0, 0, 1, 0), stops: [0, 90, 180, 270]},
    {plane: exactPlane(0, 0, 1, -1), stops: [0, 90, 180, 270]},
    {plane: exactPlane(0, 1, 0, 1), stops: [0, 90, 180, 270]},
    {plane: exactPlane(0, 1, 0, 0), stops: [0, 90, 180, 270]},
    {plane: exactPlane(0, 1, 0, -1), stops: [0, 90, 180, 270]},
    {plane: exactPlane(1, 0, 0, 1), stops: [0, 90, 180, 270]},
    {plane: exactPlane(1, 0, 0, 0), stops: [0, 90, 180, 270]},
    {plane: exactPlane(1, 0, 0, -1), stops: [0, 90, 180, 270]}
];

let pieces = [shell];

for (let cut of cuts) {
    let newpieces = [];
    for (let piece of pieces)
        for (let newpiece of slice_polygeometry(piece, cut.plane, new THREE.Color(), true))
            if (newpiece.vertices.length > 0)
                newpieces.push(newpiece);
    pieces = newpieces;
}

let puzzle = new Puzzle();
puzzle.pieces = pieces;

function planeEqual(p1: ExactPlane, p2: ExactPlane) {
    return (p1.normal.x.equals(p2.normal.x) &&
        p1.normal.y.equals(p2.normal.y) &&
        p1.normal.z.equals(p2.normal.z) &&
        p1.constant.equals(p2.constant));
}

test('find_cuts', () => {
    let found = find_cuts(puzzle);
    expect(found.length).toBe(cuts.length);
    for (let foundcut of found.map(x => x.plane.canonicalize()))
        expect(cuts.some(x => planeEqual(foundcut, x.plane.canonicalize()))).toBe(true);
});

test('find_stops', () => {
    for (let cut of find_cuts(puzzle)) {
        let found_stops = find_stops(puzzle, cut);
        let found_angles = found_stops.map(rot => rot.approxAngle() / Math.PI * 180);
        let true_angles = cuts.filter(x => planeEqual(cut.plane, x.plane.canonicalize()))[0].stops;
        expect(found_angles.length).toBe(true_angles.length);
        for (let i=0; i<true_angles.length; i++)
            expect(found_angles[i]).toBeCloseTo(true_angles[i]);
    }
});
