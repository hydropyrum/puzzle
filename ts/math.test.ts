import { ExactVector3, ExactPlane, ExactQuaternion } from './math';
import { AlgebraicNumber } from './exact';
import * as THREE from 'three';

let fromNumber = AlgebraicNumber.fromInteger;
let planes = [
    new ExactPlane(new ExactVector3(fromNumber(1), fromNumber(1), fromNumber(1)), fromNumber(0)),
    new ExactPlane(new ExactVector3(fromNumber(1), fromNumber(1), fromNumber(1)), fromNumber(3)),
    new ExactPlane(new ExactVector3(fromNumber(1), fromNumber(1), fromNumber(1)), fromNumber(-3))
];
let points = [
    new ExactVector3(fromNumber(0), fromNumber(0), fromNumber(0)),
    new ExactVector3(fromNumber(1), fromNumber(1), fromNumber(1)),
    new ExactVector3(fromNumber(-1), fromNumber(-1), fromNumber(-1))
];
let endpoints = [
    new ExactVector3(fromNumber(10), fromNumber(10), fromNumber(10)),
    new ExactVector3(fromNumber(-10), fromNumber(-10), fromNumber(-10))
];

test('ExactPlane.side', () => {
    for (let plane of planes)
        for (let point of points)
            expect(plane.side(point)).toBe(Math.sign(plane.toThree().distanceToPoint(point.toThree())));
});

test('ExactPlane.intersectWithLine', () => {
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

let quats = [
    new ExactQuaternion(fromNumber(0), fromNumber(0), fromNumber(1), fromNumber(1)),
    new ExactQuaternion(fromNumber(0), fromNumber(1), fromNumber(0), fromNumber(1)),
    new ExactQuaternion(fromNumber(1), fromNumber(1), fromNumber(0), fromNumber(1))
];

test('ExactQuaternion.equals', () => {
    for (let i=0; i<quats.length; i++)
        for (let j=0; j<quats.length; j++) {
            if (i == j)
                expect(quats[i].equals(quats[j])).toBe(true);
            else
                expect(quats[i].equals(quats[j])).not.toBe(true);
        }
});
     
test('ExactQuaternion.identity', () => {
    let id = ExactQuaternion.identity();
    for (let q of quats) {
        expect(q.mul(id).equals(q)).toBe(true);
        expect(id.mul(q).equals(q)).toBe(true);
    }
});

test('ExactQuaternion.inverse', () => {
    let id = ExactQuaternion.identity();
    for (let q of quats) {
        expect(q.mul(q.inverse()).equals(id)).toBe(true);
        expect(q.inverse().mul(q).equals(id)).toBe(true);
    }
});

test('ExactQuaternion.pseudoAngle', () => {
    let id = ExactQuaternion.identity();
    expect(id.pseudoAngle().toNumber()).toBe(0);
    for (let q1 of quats)
        for (let q2 of quats)
            expect(q1.pseudoAngle().compare(q2.pseudoAngle())).toBe(Math.sign(q1.approxAngle()-q2.approxAngle()));
});

test('ExactQuaternion.mul', () => {
    let i = new ExactQuaternion(fromNumber(1), fromNumber(0), fromNumber(0), fromNumber(0));
    let j = new ExactQuaternion(fromNumber(0), fromNumber(1), fromNumber(0), fromNumber(0));
    let k = new ExactQuaternion(fromNumber(0), fromNumber(0), fromNumber(1), fromNumber(0));
    let m1 = new ExactQuaternion(fromNumber(0), fromNumber(0), fromNumber(0), fromNumber(-1));
    expect(i.mul(i).equals(m1)).toBe(true);
    expect(j.mul(j).equals(m1)).toBe(true);
    expect(k.mul(k).equals(m1)).toBe(true);
    expect(i.mul(j).mul(k).equals(m1)).toBe(true);
});

let axes = [
    new ExactVector3(fromNumber(0), fromNumber(0), fromNumber(1))
];

points = [
    new ExactVector3(fromNumber(2), fromNumber(1), fromNumber(0)),
    new ExactVector3(fromNumber(1), fromNumber(2), fromNumber(0)),
    new ExactVector3(fromNumber(-1), fromNumber(2), fromNumber(0)),
    new ExactVector3(fromNumber(-2), fromNumber(1), fromNumber(0)),
    new ExactVector3(fromNumber(-2), fromNumber(-1), fromNumber(0)),
    new ExactVector3(fromNumber(-1), fromNumber(-2), fromNumber(0)),
    new ExactVector3(fromNumber(1), fromNumber(-2), fromNumber(0)),
    new ExactVector3(fromNumber(2), fromNumber(-1), fromNumber(0))
];

test('ExactQuaternion.apply', () => {
    for (let k of axes)
        for (let x of points)
            for (let y of points) {
                if (x.dot(x).equals(y.dot(y)) && k.dot(x).equals(k.dot(y))) {
                    let q = ExactQuaternion.fromAxisPoints(k, x, y);
                    let y1 = q.apply(x);
                    expect(y1.equals(y)).toBe(true);
                }
        }
});

