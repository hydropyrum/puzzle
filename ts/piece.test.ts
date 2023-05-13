import { ExactVector3, ExactPlane } from './piece';
import { algebraicNumberField } from './exact';
import * as THREE from 'three';

let K = algebraicNumberField([-1, 1], 1); // trivial
let planes = [
    new ExactPlane(new ExactVector3(K.fromVector([1]), K.fromVector([1]), K.fromVector([1])), K.fromVector([0])),
    new ExactPlane(new ExactVector3(K.fromVector([1]), K.fromVector([1]), K.fromVector([1])), K.fromVector([3])),
    new ExactPlane(new ExactVector3(K.fromVector([1]), K.fromVector([1]), K.fromVector([1])), K.fromVector([-3]))
];
let points = [
    new ExactVector3(K.fromVector([0]), K.fromVector([0]), K.fromVector([0])),
    new ExactVector3(K.fromVector([1]), K.fromVector([1]), K.fromVector([1])),
    new ExactVector3(K.fromVector([-1]), K.fromVector([-1]), K.fromVector([-1]))
];
let endpoints = [
    new ExactVector3(K.fromVector([10]), K.fromVector([10]), K.fromVector([10])),
    new ExactVector3(K.fromVector([-10]), K.fromVector([-10]), K.fromVector([-10]))
];

test('side', () => {
    for (let plane of planes)
        for (let point of points)
            expect(plane.side(point)).toBe(Math.sign(plane.toThree().distanceToPoint(point.toThree())));
});

test('intersectWithLine', () => {
    let inter = new THREE.Vector3();
    for (let plane of planes)
        for (let i=0; i<endpoints.length; i++)
            for (let j=0; j<endpoints.length; j++)
                if (i != j) {
                    let res = plane.toThree().intersectLine(new THREE.Line3(endpoints[i].toThree(), endpoints[j].toThree()), inter);
                    if (res !== null)
                        expect(plane.intersectLine(endpoints[i], endpoints[j]).toThree().distanceTo(inter)).toBeLessThan(1e-3);
                }
});
