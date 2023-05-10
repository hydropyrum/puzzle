import * as THREE from 'three';
import { AlgebraicNumberField, algebraicNumberField, AlgebraicNumber } from './exact';
import { Fraction } from './fraction';

export class ExactVector3 {
    x: AlgebraicNumber;
    y: AlgebraicNumber;
    z: AlgebraicNumber;
    constructor (x: AlgebraicNumber, y: AlgebraicNumber, z: AlgebraicNumber) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toThree(): THREE.Vector3 {
        return new THREE.Vector3(
            AlgebraicNumber.toNumber(this.x),
            AlgebraicNumber.toNumber(this.y),
            AlgebraicNumber.toNumber(this.z));
    }

    add (other: ExactVector3): ExactVector3 {
        return new ExactVector3(
            AlgebraicNumber.add(this.x, other.x),
            AlgebraicNumber.add(this.y, other.y),
            AlgebraicNumber.add(this.z, other.z));
    }
    sub (other: ExactVector3): ExactVector3 {
        return new ExactVector3(
            AlgebraicNumber.subtract(this.x, other.x),
            AlgebraicNumber.subtract(this.y, other.y),
            AlgebraicNumber.subtract(this.z, other.z));
    }
    scale (other: AlgebraicNumber): ExactVector3 {
        return new ExactVector3(
            AlgebraicNumber.multiply(this.x, other),
            AlgebraicNumber.multiply(this.y, other),
            AlgebraicNumber.multiply(this.z, other));
    }

    dot (other: ExactVector3): AlgebraicNumber {
        return AlgebraicNumber.add(
            AlgebraicNumber.multiply(this.x, other.x),
            AlgebraicNumber.add(
                AlgebraicNumber.multiply(this.y, other.y),
                AlgebraicNumber.multiply(this.z, other.z)));
    }
};

export class ExactPlane {
    normal: ExactVector3; // unlike THREE.Plane, does not need to be normalized
    constant: AlgebraicNumber;
    constructor (normal: ExactVector3, constant: AlgebraicNumber) {
        this.normal = normal;
        this.constant = constant;
    }
    toThree(): THREE.Plane {
        return new THREE.Plane(
            this.normal.toThree(),
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

    side(v: ExactVector3) {
        return AlgebraicNumber.sign(AlgebraicNumber.add(this.normal.dot(v), this.constant));
    }

    intersectLine(a: ExactVector3, b: ExactVector3) {
        // n·x + d = 0
        // x = a + (b-a) t
        // => n·a + n·(b-a) t + d = 0
        // => t = - (n·a + d) / n·(b-a)
        let ab = b.sub(a);
        let t = AlgebraicNumber.divide(
            AlgebraicNumber.add(this.normal.dot(a), this.constant),
            this.normal.dot(ab));
        return a.sub(ab.scale(t));
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
    vertices: ExactVector3[];
    faces: PolyFace[];
    rot: THREE.Quaternion;
    cache: {[key: string]: THREE.Quaternion};
    object: THREE.Object3D | null;
    constructor(vertices: ExactVector3[], faces: PolyFace[]) {
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
                g.vertices.push(
                    new ExactVector3(K.fromVector([Fraction.fromNumber(x)]),
                                     K.fromVector([Fraction.fromNumber(y)]),
                                     K.fromVector([Fraction.fromNumber(z)])));
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
            let v0 = pg.vertices[vs[0]].toThree();
            let vcur = pg.vertices[vs[i]].toThree();
            let vnext = pg.vertices[vs[i+1]].toThree();
            positions.push(v0.x, v0.y, v0.z);
            positions.push(vcur.x, vcur.y, vcur.z);
            positions.push(vnext.x, vnext.y, vnext.z);
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

