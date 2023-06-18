import * as THREE from 'three';
import { AlgebraicNumber } from './exact';

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
        return `[${this.x},${this.y},${this.z}]`;
    }

    pseudoSign(): number {
        if (this.x.sign() !== 0)
            return this.x.sign();
        else if (this.y.sign() !== 0)
            return this.y.sign();
        else
            return this.z.sign();
    }

    equals(other: ExactVector3): boolean {
        return this.x.equals(other.x) && this.y.equals(other.y) && this.z.equals(other.z);
    }

    add (other: ExactVector3): ExactVector3 {
        return new ExactVector3(this.x.add(other.x), this.y.add(other.y), this.z.add(other.z));
    }
    sub (other: ExactVector3): ExactVector3 {
        return new ExactVector3(this.x.sub(other.x), this.y.sub(other.y), this.z.sub(other.z));
    }
    neg(): ExactVector3 {
        return new ExactVector3(this.x.neg(), this.y.neg(), this.z.neg());
    }
    scale (other: AlgebraicNumber): ExactVector3 {
        return new ExactVector3(this.x.mul(other), this.y.mul(other), this.z.mul(other));
    }

    dot (other: ExactVector3): AlgebraicNumber {
        return this.x.mul(other.x).add(this.y.mul(other.y)).add(this.z.mul(other.z));
    }

    cross (other: ExactVector3): ExactVector3 {
        return new ExactVector3(
            this.y.mul(other.z).sub(this.z.mul(other.y)),
            this.z.mul(other.x).sub(this.x.mul(other.z)),
            this.x.mul(other.y).sub(this.y.mul(other.x))
        );
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
    toString(): string {
        return `[${this.normal},${this.constant}]`;
    }

    neg(): ExactPlane { return new ExactPlane(this.normal.neg(), this.constant.neg()); }
    side(v: ExactVector3) { return this.normal.dot(v).add(this.constant).sign(); }

    intersectLine(a: ExactVector3, b: ExactVector3) {
        // n·x + d = 0
        // x = a + (b-a) t
        // => n·a + n·(b-a) t + d = 0
        // => t = - (n·a + d) / n·(b-a)
        let ab = b.sub(a);
        let t = this.normal.dot(a).add(this.constant).div(this.normal.dot(ab));
        return a.sub(ab.scale(t));
    }

    /* Take the "absolute value" of a plane so that it compares equal with its negation. */
    canonicalize() {
        if (this.normal.pseudoSign() < 0)
            return this.neg();
        else
            return this;
    }
};

export class ExactQuaternion {
    x: AlgebraicNumber;
    y: AlgebraicNumber;
    z: AlgebraicNumber;
    w: AlgebraicNumber;
    constructor(x: AlgebraicNumber, y: AlgebraicNumber, z: AlgebraicNumber, w: AlgebraicNumber) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static identity(): ExactQuaternion {
        let zero = AlgebraicNumber.fromInteger(0);
        let one = AlgebraicNumber.fromInteger(1);
        return new ExactQuaternion(zero, zero, zero, one);
    }

    /* Given an axis k (not necessarily normalized, and x, y such that
       ||x|| = ||y|| and k·x = k·y, find the rotation about k that takes x to y. */
    static fromAxisPoints(k: ExactVector3, x: ExactVector3, y: ExactVector3): ExactQuaternion {
        let kxy = k.dot(x.cross(y));
        let kx = k.dot(x); // = k.dot(y)
        let xy = x.dot(y);
        if (kxy.isZero()) {
            if (xy.sign() > 0)
                return ExactQuaternion.identity(); // 0 degrees
            else
                return new ExactQuaternion(k.x, k.y, k.z, AlgebraicNumber.fromInteger(0)); // 180 degrees
        } else {
            return new ExactQuaternion(k.x, k.y, k.z, kxy.div(x.dot(x).sub(xy)));
        }
    }

    toString(): string {
        return `[${this.x},${this.y},${this.z},${this.w}]`;
    }

    toThree(): THREE.Quaternion {
        return new THREE.Quaternion(this.x.toNumber(), this.y.toNumber(),
                                    this.z.toNumber(), this.w.toNumber()).normalize();
    }

    equals(other: ExactQuaternion): boolean {
        return this.x.equals(other.x) && this.y.equals(other.y) && this.z.equals(other.z) && this.w.equals(other.w);
    }

    normSquared(): AlgebraicNumber {
        let x = this.x, y = this.y, z = this.z, w = this.w;
        return w.mul(w).add(x.mul(x).add(y.mul(y)).add(z.mul(z)));
    }

    approxAngle(): number {
        let x = this.x.toNumber(), y = this.y.toNumber();
        let z = this.z.toNumber(), w = this.w.toNumber();
        return Math.acos(w / Math.sqrt(x*x+y*y+z*z+w*w))*2;
    }

    pseudoAngle(): AlgebraicNumber {
        let one = AlgebraicNumber.fromInteger(1);
        let w = this.w;
        return one.sub(w.mul(w.abs()).div(this.normSquared()));
    }

    mul(b: ExactQuaternion): ExactQuaternion {
        let a = this;
        return new ExactQuaternion(
            a.w.mul(b.x).add(a.x.mul(b.w)).add(a.y.mul(b.z)).sub(a.z.mul(b.y)),
            a.w.mul(b.y).sub(a.x.mul(b.z)).add(a.y.mul(b.w)).add(a.z.mul(b.x)),
            a.w.mul(b.z).add(a.x.mul(b.y)).sub(a.y.mul(b.x)).add(a.z.mul(b.w)),
            a.w.mul(b.w).sub(a.x.mul(b.x)).sub(a.y.mul(b.y)).sub(a.z.mul(b.z))
        );
    }
    scale(b: AlgebraicNumber): ExactQuaternion {
        return new ExactQuaternion(
            this.x.mul(b), this.y.mul(b), this.z.mul(b), this.w.mul(b)
        );
    }

    conj(): ExactQuaternion {
        return new ExactQuaternion(this.x.neg(), this.y.neg(), this.z.neg(), this.w);
    }

    inverse(): ExactQuaternion {
        return this.conj().scale(this.normSquared().inverse());
    }

    apply(v: ExactVector3): ExactVector3 {
        let zero = AlgebraicNumber.fromInteger(0);
        let vq = new ExactQuaternion(v.x, v.y, v.z, zero);
        let vr = this.mul(vq).mul(this.inverse());
        console.assert(vr.w.isZero());
        return new ExactVector3(vr.x, vr.y, vr.z);
    }

    pseudoNormalize(): ExactQuaternion {
        let x = this.x, y = this.y, z = this.z, w = this.w;
        let n = w.abs().add(x.abs()).add(y.abs()).add(z.abs());
        if (w.sign() < 0) n = n.neg();
        return this.scale(n.inverse());
    }
}
