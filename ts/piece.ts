import * as THREE from 'three';

export class PolyGeometry {
    vertices: THREE.Vector3[];
    faces: PolyFace[];
    rot: THREE.Quaternion;
    cache: {[key: string]: THREE.Quaternion};
    object: THREE.Object3D | null;
    constructor(vertices: THREE.Vector3[], faces: PolyFace[]) {
        this.vertices = vertices;
        this.faces = faces;
        this.rot = new THREE.Quaternion();
        this.cache = {};
        this.object = null;
    }
};

export interface PolyFace {
    vertices: number[];
    plane: THREE.Plane;
    color: THREE.Color;
    interior: boolean;
};

export function really_big_polygeometry() {
    let g = new PolyGeometry([], []);
    let d = 1000;
    for (let z of [-d, d])
        for (let y of [-d, d])
            for (let x of [-d, d])
                g.vertices.push(new THREE.Vector3(x, y, z));
    for (let i of [1, 2, 4]) {
        let j = i < 4 ? i * 2 : 1;
        let k = j < 4 ? j * 2 : 1;
        g.faces.push({vertices: [0, k, j+k, j],
                      plane: new THREE.Plane(),
                      color: new THREE.Color(),
                      interior: false});
        g.faces.push({vertices: [i, i+j, i+j+k, i+k],
                      plane: new THREE.Plane(),
                      color: new THREE.Color(),
                      interior: false});
    }
    return g;
}

export function triangulate_polygeometry(pg: PolyGeometry) {
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

