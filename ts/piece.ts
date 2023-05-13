import * as THREE from 'three';
import { AlgebraicNumberField, algebraicNumberField, AlgebraicNumber } from './exact';
import { fraction } from './fraction';

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
        return new THREE.Vector3(this.x.toNumber(), this.y.toNumber(), this.z.toNumber());
    }

    toString(): string {
        return '[' + this.x.toString() + ',' + this.y.toString() + ',' + this.z.toString() + ']';
    }

    add (other: ExactVector3): ExactVector3 {
        return new ExactVector3(this.x.add(other.x), this.y.add(other.y), this.z.add(other.z));
    }
    sub (other: ExactVector3): ExactVector3 {
        return new ExactVector3(this.x.sub(other.x), this.y.sub(other.y), this.z.sub(other.z));
    }
    scale (other: AlgebraicNumber): ExactVector3 {
        return new ExactVector3(this.x.mul(other), this.y.mul(other), this.z.mul(other));
    }

    dot (other: ExactVector3): AlgebraicNumber {
        return this.x.mul(other.x).add(this.y.mul(other.y)).add(this.z.mul(other.z));
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
        return new THREE.Plane(this.normal.toThree(), this.constant.toNumber()).normalize();
    }

    negate(): ExactPlane {
        return new ExactPlane(
            new ExactVector3(this.normal.x.neg(), this.normal.y.neg(), this.normal.z.neg()),
            this.constant.neg()
        );
    }

    side(v: ExactVector3) {
        return this.normal.dot(v).add(this.constant).sign();
    }

    intersectLine(a: ExactVector3, b: ExactVector3) {
        // n·x + d = 0
        // x = a + (b-a) t
        // => n·a + n·(b-a) t + d = 0
        // => t = - (n·a + d) / n·(b-a)
        let ab = b.sub(a);
        let t = this.normal.dot(a).add(this.constant).div(this.normal.dot(ab));
        return a.sub(ab.scale(t));
    }
};

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

export function cube_polygeometry(d?: AlgebraicNumber): PolyGeometry {
    if (d === undefined) {
        let K = algebraicNumberField([-1, 1], 1); // trivial
        d = K.fromVector([fraction(1000)]);
    }
    let g = new PolyGeometry([], []);
    for (let z of [d.neg(), d])
        for (let y of [d.neg(), d])
            for (let x of [d.neg(), d])
                g.vertices.push(new ExactVector3(x, y, z));
    let zero = d.field.fromVector([]);
    let dummy_plane = new ExactPlane(new ExactVector3(zero, zero, zero), zero); // to do: make not dumb
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

