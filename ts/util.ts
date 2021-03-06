import * as THREE from 'three';

export const EPSILON = 1e-4;
export const PHI = (1+Math.sqrt(5))/2;

export function setdefault(d: any, k: any, v: any) {
    if (!(k in d))
        d[k] = v;
    return d[k];
}

export function keys<T extends {}>(o: T): Array<keyof T> {
    return <Array<keyof T>>Object.keys(o);
}

/* Representations of floats, Vector3s, and Planes that allow testing
   for equality within EPSILON. */

export function floathash(x: number) {
    return Math.round(x/EPSILON);
}
export function pointhash(v: THREE.Vector3) {
    return floathash(v.x) + "," + floathash(v.y) + "," + floathash(v.z);
}
export function rothash(q: THREE.Quaternion) {
    return floathash(q.x) + "," + floathash(q.y) + "," + floathash(q.z) + "," + floathash(q.w);
}

/* Canonicalize so that if two planes are (almost) parallel, their
   normals should have the same pointhash. */
export function canonicalize_plane(p: THREE.Plane) {
    let hx = floathash(p.normal.x);
    let hy = floathash(p.normal.y);
    let hz = floathash(p.normal.z);
    if (hx < 0)
        p.negate();
    else if (hx == 0 && hy < 0)
        p.negate();
    else if (hx == 0 && hy == 0 && hz < 0)
        p.negate();
    return p;
}

