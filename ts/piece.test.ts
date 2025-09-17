import * as THREE from 'three';
import { AlgebraicNumber, QQ } from './exact';
import { ExactPlane, ExactVector3 } from './math';
import { PolyGeometry, cube_polygeometry, slice_polygeometry } from './piece';

let fromNumber = (n) => QQ.fromInt(n);
let cube = cube_polygeometry(fromNumber(1), new THREE.Color(), false);

function exactPlane(a, b, c, d) {
    return new ExactPlane(
        new ExactVector3(fromNumber(a), fromNumber(b), fromNumber(c)),
        fromNumber(d)
    );
}

test('no_cut', () => {
    let plane = exactPlane(0, 0, -1, 2);
    let [front, back] = slice_polygeometry(cube, plane, new THREE.Color(), true);
    expect(front.vertices.length).toBe(8);
    expect(front.faces.map(f => f.vertices.length).sort()).toEqual([4,4,4,4,4,4]);
    expect(back.faces.length).toBe(0);
});

test('cut_face', () => {
    let plane = exactPlane(0, 0, -1, 1);
    let [front, back] = slice_polygeometry(cube, plane, new THREE.Color(), true);
    expect(front.vertices.length).toBe(8);
    expect(front.faces.map(f => f.vertices.length).sort()).toEqual([4,4,4,4,4,4]);
    expect(front.faces.map(f => f.interior).sort()).toEqual([false,false,false,false,false,false]);
    expect(back.faces.length).toBe(0);
});

test('cut_edge', () => {
    let plane = exactPlane(0, -1, -1, 2);
    let [front, back] = slice_polygeometry(cube, plane, new THREE.Color(), true);
    expect(front.vertices.length).toBe(8);
    expect(front.faces.map(f => f.vertices.length).sort()).toEqual([4,4,4,4,4,4]);
    expect(front.faces.map(f => f.interior).sort()).toEqual([false,false,false,false,false,false]);
    expect(back.faces.length).toBe(0);
});

test('cut_vertex', () => {
    let plane = exactPlane(-1, -1, -1, 3);
    let [front, back] = slice_polygeometry(cube, plane, new THREE.Color(), true);
    expect(front.vertices.length).toBe(8);
    expect(front.faces.map(f => f.vertices.length).sort()).toEqual([4,4,4,4,4,4]);
    expect(front.faces.map(f => f.interior).sort()).toEqual([false,false,false,false,false,false]);
    expect(back.faces.length).toBe(0);
});

test('cut_square', () => {
    let plane = exactPlane(0, 0, -1, 0);
    let [front, back] = slice_polygeometry(cube, plane, new THREE.Color(), true);
    expect(front.vertices.length).toBe(8);
    expect(front.faces.map(f => f.vertices.length).sort()).toEqual([4,4,4,4,4,4]);
    expect(back.vertices.length).toBe(8);
    expect(back.faces.map(f => f.vertices.length).sort()).toEqual([4,4,4,4,4,4]);
});

test('cut_diagonal0', () => { // cut goes through edges
    let plane = exactPlane(0, -1, -1, 0);
    let [front, back] = slice_polygeometry(cube, plane, new THREE.Color(), true);
    expect(front.vertices.length).toBe(6);
    expect(front.faces.map(f => f.vertices.length).sort()).toEqual([3,3,4,4,4]);
    expect(back.vertices.length).toBe(6);
    expect(back.faces.map(f => f.vertices.length).sort()).toEqual([3,3,4,4,4]);
});

test('cut_diagonal1', () => {
    let plane = exactPlane(0, -1, -1, 1);
    let [front, back] = slice_polygeometry(cube, plane, new THREE.Color(), true);
    expect(front.vertices.length).toBe(10);
    expect(front.faces.map(f => f.vertices.length).sort()).toEqual([4,4,4,4,4,5,5]);
    expect(back.vertices.length).toBe(6);
    expect(back.faces.map(f => f.vertices.length).sort()).toEqual([3,3,4,4,4]);
});

test('cut_triangle1', () => { // cut goes through vertices
    let plane = exactPlane(-1, -1, -1, 1);
    let [front, back] = slice_polygeometry(cube, plane, new THREE.Color(), true);
    expect(front.vertices.length).toBe(7);
    expect(front.faces.map(f => f.vertices.length).sort()).toEqual([3,3,3,3,4,4,4]);
    expect(back.vertices.length).toBe(4);
    expect(back.faces.map(f => f.vertices.length).sort()).toEqual([3,3,3,3]);
});

test('cut_triangle2', () => {
    let plane = exactPlane(-1, -1, -1, 2);
    let [front, back] = slice_polygeometry(cube, plane, new THREE.Color(), true);
    expect(front.vertices.length).toBe(10);
    expect(front.faces.map(f => f.vertices.length).sort()).toEqual([3,4,4,4,5,5,5]);
    expect(back.vertices.length).toBe(4);
    expect(back.faces.map(f => f.vertices.length).sort()).toEqual([3,3,3,3]);
});

test('cut_hexagon', () => {
    let plane = exactPlane(-1, -1, -1, 0);
    let [front, back] = slice_polygeometry(cube, plane, new THREE.Color(), true);
    expect(front.vertices.length).toBe(10);
    expect(front.faces.map(f => f.vertices.length).sort()).toEqual([3,3,3,5,5,5,6]);
    expect(back.vertices.length).toBe(10);
    expect(back.faces.map(f => f.vertices.length).sort()).toEqual([3,3,3,5,5,5,6]);
});

