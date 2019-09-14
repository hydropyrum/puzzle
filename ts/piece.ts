import * as THREE from 'three';

export class PolyGeometry {
    vertices: THREE.Vector3[];
    faces: PolyFace[];
    rot: THREE.Quaternion;
    object: THREE.Object3D | null;
    constructor(vertices: THREE.Vector3[], faces: PolyFace[]) {
        this.vertices = vertices;
        this.faces = faces;
        this.rot = new THREE.Quaternion();
        this.object = null;
    }
};

export class PolyFace {
    vertices: number[];
    plane: THREE.Plane;
    color: THREE.Color;
    constructor(vertices: number[], plane: THREE.Plane, color: THREE.Color) {
        this.vertices = vertices;
        this.plane = plane;
        this.color = color;
    }
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
        g.faces.push(new PolyFace([0, k, j+k, j],
                                  new THREE.Plane(),
                                  new THREE.Color()));
        g.faces.push(new PolyFace([i, i+j, i+j+k, i+k],
                                  new THREE.Plane(),
                                  new THREE.Color()));
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

