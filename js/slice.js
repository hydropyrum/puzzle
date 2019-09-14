import * as THREE from 'three';
import { floathash, setdefault } from './util.js';

export function really_big_polygeometry() {
    let g = {vertices: [], faces: []};
    let d = 1000;
    for (let z of [-d, d])
        for (let y of [-d, d])
            for (let x of [-d, d])
                g.vertices.push(new THREE.Vector3(x, y, z));
    for (let i of [1, 2, 4]) {
        let j = i < 4 ? i * 2 : 1;
        let k = j < 4 ? j * 2 : 1;
        g.faces.push({vertices: [0, k, j+k, j]});
        g.faces.push({vertices: [i, i+j, i+j+k, i+k]});
    }
    return g;
}

export function triangulate_polygeometry(pg) {
    let g = new THREE.Geometry();
    g.vertices.push(...pg.vertices);
    for (let pf of pg.faces) {
        let vs = pf.vertices;
        for (let i=1; i<vs.length-1; i++)
            g.faces.push(new THREE.Face3(vs[0], vs[i], vs[i+1],
                                         pf.plane.normal, pf.color));
    }
    g.elementsNeedUpdate = true;
    return g;
}

export function slice_polygeometry(geometry, plane, attrs) {
    /* cf. https://github.com/tdhooper/threejs-slice-geometry, but
       - preserves colors of faces
       - creates new faces where the geometry is sliced */
    
    let vertices = [];
    vertices.push(...geometry.vertices); // copy so we can append to it
    
    let sides = vertices.map(
        v => Math.sign(floathash(plane.distanceToPoint(v))));

    let front = {};
    front.vertices = [];
    front.faces = [];
    let frontmap = {}; // map geometry.vertices to front.vertices
    let back = {};
    back.vertices = [];
    back.faces = [];
    let backmap = {}; // map geometry.vertices to back.vertices
    let cross_index = {};
    for (let face of geometry.faces) {
        // Slice face into frontpoints and backpoints
        let frontpoints = [], backpoints = [];
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

    attrs = Object.assign({}, attrs);
    attrs.plane = plane;
    attrs.direction = 1;
    close_polyhedron(back, attrs);
    attrs = Object.assign({}, attrs);
    attrs.plane = plane;
    attrs.direction = -1;
    close_polyhedron(front, attrs);
    
    return [front, back];
    
}

function close_polyhedron(geometry, attrs) {
    let edge_index = {};
    function count_edge(a, b) {
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
    let cutgraph = {};
    for (let edges of Object.values(edge_index)) {
        console.assert(edges.length <= 2);
        if (edges.length == 1) {
            let [a, b] = edges[0];
            setdefault(cutgraph, b, []).push(a);
        }
    }

    let visited = {};
    let n_visited = 0;
    let vs = Object.keys(cutgraph); // bug: converts to strings

    // Traverse cutgraph to put points in ccw order
    while (n_visited < vs.length) {
        let cutpoints = [];
        let v = vs.find(u => !(u in visited)); // arbitrary point
        while (v !== undefined) {
            cutpoints.push(v);
            visited[v] = 1;
            n_visited += 1;
            v = cutgraph[v].find(u => !(u in visited));
        }
        if (cutpoints.length == 0) {
            console.error("not all cut points visited");
            break;
        }
        let cutface = Object.assign({}, attrs);
        cutface.vertices = cutpoints;
        geometry.faces.push(cutface);
    }
}

