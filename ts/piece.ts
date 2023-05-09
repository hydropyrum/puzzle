import * as THREE from 'three';
import { AlgebraicNumberField, algebraicNumberField, AlgebraicNumber } from './exact';

export class ExactVector3 {
    x: AlgebraicNumber;
    y: AlgebraicNumber;
    z: AlgebraicNumber;
    constructor (x: AlgebraicNumber, y: AlgebraicNumber, z: AlgebraicNumber) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
};

export class ExactPlane {
    normal: ExactVector3;
    constant: AlgebraicNumber;
    constructor (normal: ExactVector3, constant: AlgebraicNumber) {
        this.normal = normal;
        this.constant = constant;
    }
    toThree(): THREE.Plane {
        return new THREE.Plane(
            new THREE.Vector3(
                AlgebraicNumber.toNumber(this.normal.x),
                AlgebraicNumber.toNumber(this.normal.y),
                AlgebraicNumber.toNumber(this.normal.z)
            ),
            AlgebraicNumber.toNumber(this.constant)
        ).normalize();
    }

    negate(): ExactPlane {
        return new ExactPlane(
            new ExactVector3(
                AlgebraicNumber.unaryMinus(this.normal.x),
                AlgebraicNumber.unaryMinus(this.normal.y),
                AlgebraicNumber.unaryMinus(this.normal.z)
            ),
            AlgebraicNumber.unaryMinus(this.constant));
    }
};

export function exactPlane(a: number, b: number, c: number, d: number): ExactPlane {
    let K = algebraicNumberField([-1, 1], 1); // trivial
    return new ExactPlane(
        new ExactVector3(
            K.fromVector([a]),
            K.fromVector([b]),
            K.fromVector([c])
        ),
        K.fromVector([d])
    );
}

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
    plane: ExactPlane;
    color: THREE.Color;
    interior: boolean;
};

export function cube_polygeometry(d: number = 1000): PolyGeometry {
    let K = algebraicNumberField([-1, 1], 1); // trivial
    let g = new PolyGeometry([], []);
    for (let z of [-d, d])
        for (let y of [-d, d])
            for (let x of [-d, d])
                g.vertices.push(new THREE.Vector3(x, y, z));
    let dummy_plane = exactPlane(0, 0, 0, 0); // to do: make not dumb
    for (let i of [1, 2, 4]) {
        let j = i < 4 ? i * 2 : 1;
        let k = j < 4 ? j * 2 : 1;
        g.faces.push({vertices: [0, k, j+k, j],
                      plane: dummy_plane,
                      color: new THREE.Color(),
                      interior: false});
        g.faces.push({vertices: [i, i+j, i+j+k, i+k],
                      plane: dummy_plane,
                      color: new THREE.Color(),
                      interior: false});
    }
    return g;
}

export function triangulate_polygeometry(pg: PolyGeometry): THREE.BufferGeometry {
    let positions: number[] = [];
    let normals: number[] = [];
    let colors: number[] = [];
    let g = new THREE.BufferGeometry();
    for (let pf of pg.faces) {
        let vs = pf.vertices;
        let n = pf.plane.toThree().normal;
        for (let i=1; i<vs.length-1; i++) {
            positions.push(pg.vertices[vs[0]].x, pg.vertices[vs[0]].y, pg.vertices[vs[0]].z);
            positions.push(pg.vertices[vs[i]].x, pg.vertices[vs[i]].y, pg.vertices[vs[i]].z);
            positions.push(pg.vertices[vs[i+1]].x, pg.vertices[vs[i+1]].y, pg.vertices[vs[i+1]].z);
            normals.push(n.x, n.y, n.z);
            normals.push(n.x, n.y, n.z);
            normals.push(n.x, n.y, n.z);
            colors.push(pf.color.r, pf.color.g, pf.color.b, 1);
            colors.push(pf.color.r, pf.color.g, pf.color.b, 1);
            colors.push(pf.color.r, pf.color.g, pf.color.b, 1);
        }
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));
    return g;
}

