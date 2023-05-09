import * as THREE from 'three';
import { floathash, setdefault, keys } from './util';
import { PolyGeometry, PolyFace } from './piece';

/* slice_polygeometry
  
   Slices a PolyGeometry into one or two PolyGeometries.
   
   - geometry: the PolyGeometry to slice
   - plane: the plane along which to slice
   - color: what color to make any newly created faces
   - interior: whether any newly created faces are interior faces
   
   Returns: [front, back] where either front or back might be empty.
   
   cf. https://github.com/tdhooper/threejs-slice-geometry, but
   - preserves colors of faces
   - creates new faces where the geometry is sliced */

export function slice_polygeometry(geometry: PolyGeometry, plane: THREE.Plane, color: THREE.Color, interior: boolean): [PolyGeometry, PolyGeometry] {
    
    let vertices = [];
    vertices.push(...geometry.vertices); // copy so we can append to it
    
    let sides = vertices.map(
        v => Math.sign(floathash(plane.distanceToPoint(v))));

    let front = new PolyGeometry([], []);
    let frontmap: {[key: number]: number} = {}; // map geometry.vertices to front.vertices
    let back = new PolyGeometry([], []);
    back.vertices = [];
    back.faces = [];
    let backmap: {[key:number]: number} = {}; // map geometry.vertices to back.vertices
    let cross_index: {[key: string]: number} = {}; // cache for intersections
    for (let face of geometry.faces) {
        // Slice face into frontpoints and backpoints
        let frontpoints: number[] = [], backpoints: number[] = [];
        let prev = face.vertices[face.vertices.length-1];
        for (let cur of face.vertices) {
            if (sides[cur] * sides[prev] < 0) {
                // cur and prev are on opposite sides;
                // add intersection point as new vertex.
                let h = sides[cur] > 0 ? prev+","+cur : cur+","+prev;
                let c;
                if (h in cross_index)
                    c = cross_index[h];
                else {
                    let point = new THREE.Vector3();
                    plane.intersectLine(new THREE.Line3(vertices[prev],
                                                        vertices[cur]),
                                        point);
                    vertices.push(point);
                    sides.push(0);
                    c = vertices.length-1;
                    cross_index[h] = c;
                }
                frontpoints.push(c);
                backpoints.push(c);
            }
            if (sides[cur] >= 0) frontpoints.push(cur);
            if (sides[cur] <= 0) backpoints.push(cur);
            prev = cur;
        }
        // If face lies entirely on plane, don't add it to either half-face.
        if (face.vertices.every(v => sides[v] == 0)) {
            frontpoints = [];
            backpoints = [];
        }
        if (frontpoints.length >= 3) {
            for (let i=0; i<frontpoints.length; i++) {
                let v = frontpoints[i];
                if (!(v in frontmap)) {
                    front.vertices.push(vertices[v]);
                    frontmap[v] = front.vertices.length-1;
                }
                frontpoints[i] = frontmap[v];
            }
            let frontface = Object.assign({}, face);
            frontface.vertices = frontpoints;
            front.faces.push(frontface);
        }
        if (backpoints.length >= 3) {
            for (let i=0; i<backpoints.length; i++) {
                let v = backpoints[i];
                if (!(v in backmap)) {
                    back.vertices.push(vertices[v]);
                    backmap[v] = back.vertices.length-1;
                }
                backpoints[i] = backmap[v];
            }
            let backface = Object.assign({}, face);
            backface.vertices = backpoints;
            back.faces.push(backface);
        }
    }

    close_polyhedron(back, plane, color, interior);
    close_polyhedron(front, plane.clone().negate(), color, interior);
    
    return [front, back];
}

/* close_polyhedron

   Finds the missing face and adds it.

   - geometry: a PolyGeometry for a polyhedron possibly with a missing face
   - plane: the plane in which the missing face (if any) lies
   - color: what color to make any newly created faces
   - interior: whether any newly created faces are interior faces */

function close_polyhedron(geometry: PolyGeometry, plane: THREE.Plane, color: THREE.Color, interior: boolean): void {
    let edge_index: {[key: number]: [number, number][]} = {};
    function count_edge(a: number, b: number) {
        let h = a < b ? a+","+b : b+","+a;
        setdefault(edge_index, h, []).push([a, b]);
    }
    for (let face of geometry.faces) {
        let prev = face.vertices[face.vertices.length-1];
        for (let cur of face.vertices) {
            count_edge(prev, cur);
            prev = cur;
        }
    }
    // The edges of the missing face appear only once.
    // Make an undirected graph out of these.
    let cutgraph: {[key: number]: number[]} = {};
    for (let edges of Object.values(edge_index)) {
        console.assert(edges.length <= 2);
        if (edges.length == 1) {
            let [a, b] = edges[0];
            setdefault(cutgraph, b, []).push(a);
        }
    }

    let visited: {[key: number]: boolean} = {};
    let n_visited = 0;
    let vs = keys(cutgraph) as number[];

    // Traverse cutgraph to put points in ccw order
    while (n_visited < vs.length) {
        let cutpoints = [];
        let v: number|undefined;
        v = vs.find(u => !(u in visited)); // arbitrary point
        while (v !== undefined) {
            cutpoints.push(v);
            visited[v] = true;
            n_visited += 1;
            v = cutgraph[v].find(u => !(u in visited));
        }
        if (cutpoints.length == 0) {
            console.error("not all cut points visited");
            break;
        }
        let cutface = {vertices: cutpoints, plane: plane, color: color, interior: interior};
        geometry.faces.push(cutface);
    }
}
