import { fraction } from './fraction';
import { algebraicNumberField, AlgebraicNumber } from './exact';
import { ExactVector3, ExactPlane } from './math';

export function tetrahedron(scale: AlgebraicNumber): ExactPlane[] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], fraction(365, 100));
    let cuts = [
        // [1/2, 1/2, 1/2] · x + -sqrt(2)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([0, fraction(11,48), 0, fraction(-1,48)]).mul(scale)),
        // [1/2, -1/2, -1/2] · x + -sqrt(2)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([0, fraction(11,48), 0, fraction(-1,48)]).mul(scale)),
        // [-1/2, -1/2, 1/2] · x + -sqrt(2)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([0, fraction(11,48), 0, fraction(-1,48)]).mul(scale)),
        // [-1/2, 1/2, -1/2] · x + -sqrt(2)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([0, fraction(11,48), 0, fraction(-1,48)]).mul(scale))
    ];
    return cuts;
}

export function octahedron(scale: AlgebraicNumber): ExactPlane[] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], fraction(365, 100));
    let cuts = [
        // [1/2, 1/2, 1/2] · x + -sqrt(2)/4 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([0, fraction(11,24), 0, fraction(-1,24)]).mul(scale)),
        // [-1/2, 1/2, 1/2] · x + -sqrt(2)/4 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([0, fraction(11,24), 0, fraction(-1,24)]).mul(scale)),
        // [-1/2, -1/2, 1/2] · x + -sqrt(2)/4 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([0, fraction(11,24), 0, fraction(-1,24)]).mul(scale)),
        // [1/2, -1/2, 1/2] · x + -sqrt(2)/4 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([0, fraction(11,24), 0, fraction(-1,24)]).mul(scale)),
        // [1/2, -1/2, -1/2] · x + -sqrt(2)/4 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([0, fraction(11,24), 0, fraction(-1,24)]).mul(scale)),
        // [-1/2, -1/2, -1/2] · x + -sqrt(2)/4 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([0, fraction(11,24), 0, fraction(-1,24)]).mul(scale)),
        // [-1/2, 1/2, -1/2] · x + -sqrt(2)/4 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([0, fraction(11,24), 0, fraction(-1,24)]).mul(scale)),
        // [1/2, 1/2, -1/2] · x + -sqrt(2)/4 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([0, fraction(11,24), 0, fraction(-1,24)]).mul(scale))
    ];
    return cuts;
}

export function cube(scale: AlgebraicNumber): ExactPlane[] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], fraction(365, 100));
    let cuts = [
        // [0, 1, 0] · x + -1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([1]), K.fromVector([0])), K.fromVector([fraction(-1,2)]).mul(scale)),
        // [0, 0, 1] · x + -1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([0]), K.fromVector([1])), K.fromVector([fraction(-1,2)]).mul(scale)),
        // [1, 0, 0] · x + -1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([1]), K.fromVector([0]), K.fromVector([0])), K.fromVector([fraction(-1,2)]).mul(scale)),
        // [0, -1, 0] · x + -1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([-1]), K.fromVector([0])), K.fromVector([fraction(-1,2)]).mul(scale)),
        // [-1, 0, 0] · x + -1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([-1]), K.fromVector([0]), K.fromVector([0])), K.fromVector([fraction(-1,2)]).mul(scale)),
        // [0, 0, -1] · x + -1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([0]), K.fromVector([-1])), K.fromVector([fraction(-1,2)]).mul(scale))
    ];
    return cuts;
}

export function icosahedron(scale: AlgebraicNumber): ExactPlane[] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], fraction(365, 100));
    let cuts = [
        // [0, 1/4 - sqrt(5)/4, 1/4 + sqrt(5)/4] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [1/2, -1/2, 1/2] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [1/4 + sqrt(5)/4, 0, -1/4 + sqrt(5)/4] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(17,24), 0, fraction(-1,24)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [1/2, 1/2, 1/2] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [0, -1/4 + sqrt(5)/4, 1/4 + sqrt(5)/4] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [0, 1/4 - sqrt(5)/4, -sqrt(5)/4 - 1/4] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [-1/2, -1/2, -1/2] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [-sqrt(5)/4 - 1/4, 0, 1/4 - sqrt(5)/4] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([0]), K.fromVector([fraction(1,4), fraction(-17,24), 0, fraction(1,24)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [-1/2, 1/2, -1/2] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [0, -1/4 + sqrt(5)/4, -sqrt(5)/4 - 1/4] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [-sqrt(5)/4 - 1/4, 0, -1/4 + sqrt(5)/4] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(17,24), 0, fraction(-1,24)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [-1/2, -1/2, 1/2] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [1/4 - sqrt(5)/4, -sqrt(5)/4 - 1/4, 0] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([0])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [-1/4 + sqrt(5)/4, -sqrt(5)/4 - 1/4, 0] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([0])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [1/2, -1/2, -1/2] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [1/4 + sqrt(5)/4, 0, 1/4 - sqrt(5)/4] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([0]), K.fromVector([fraction(1,4), fraction(-17,24), 0, fraction(1,24)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [1/2, 1/2, -1/2] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [-1/4 + sqrt(5)/4, 1/4 + sqrt(5)/4, 0] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([0])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [1/4 - sqrt(5)/4, 1/4 + sqrt(5)/4, 0] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([0])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale)),
        // [-1/2, 1/2, 1/2] · x + -3/8 - sqrt(5)/8 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([fraction(-3,8), fraction(-17,48), 0, fraction(1,48)]).mul(scale))
    ];
    return cuts;
}

export function dodecahedron(scale: AlgebraicNumber): ExactPlane[] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], fraction(365, 100));
    let cuts = [
        // [1/2, 0, 1/4 + sqrt(5)/4] · x + -sqrt(5)/4 - 1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([0]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)])), K.fromVector([fraction(-1,2), fraction(-17,24), 0, fraction(1,24)]).mul(scale)),
        // [0, 1/4 + sqrt(5)/4, 1/2] · x + -sqrt(5)/4 - 1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(1,2)])), K.fromVector([fraction(-1,2), fraction(-17,24), 0, fraction(1,24)]).mul(scale)),
        // [-1/2, 0, 1/4 + sqrt(5)/4] · x + -sqrt(5)/4 - 1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([0]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)])), K.fromVector([fraction(-1,2), fraction(-17,24), 0, fraction(1,24)]).mul(scale)),
        // [-sqrt(5)/4 - 1/4, 1/2, 0] · x + -sqrt(5)/4 - 1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(1,2)]), K.fromVector([0])), K.fromVector([fraction(-1,2), fraction(-17,24), 0, fraction(1,24)]).mul(scale)),
        // [-1/2, 0, -sqrt(5)/4 - 1/4] · x + -sqrt(5)/4 - 1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)])), K.fromVector([fraction(-1,2), fraction(-17,24), 0, fraction(1,24)]).mul(scale)),
        // [-sqrt(5)/4 - 1/4, -1/2, 0] · x + -sqrt(5)/4 - 1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(-1,2)]), K.fromVector([0])), K.fromVector([fraction(-1,2), fraction(-17,24), 0, fraction(1,24)]).mul(scale)),
        // [0, -sqrt(5)/4 - 1/4, -1/2] · x + -sqrt(5)/4 - 1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(-1,2)])), K.fromVector([fraction(-1,2), fraction(-17,24), 0, fraction(1,24)]).mul(scale)),
        // [1/4 + sqrt(5)/4, -1/2, 0] · x + -sqrt(5)/4 - 1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(-1,2)]), K.fromVector([0])), K.fromVector([fraction(-1,2), fraction(-17,24), 0, fraction(1,24)]).mul(scale)),
        // [0, -sqrt(5)/4 - 1/4, 1/2] · x + -sqrt(5)/4 - 1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(1,2)])), K.fromVector([fraction(-1,2), fraction(-17,24), 0, fraction(1,24)]).mul(scale)),
        // [0, 1/4 + sqrt(5)/4, -1/2] · x + -sqrt(5)/4 - 1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(-1,2)])), K.fromVector([fraction(-1,2), fraction(-17,24), 0, fraction(1,24)]).mul(scale)),
        // [1/4 + sqrt(5)/4, 1/2, 0] · x + -sqrt(5)/4 - 1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(1,2)]), K.fromVector([0])), K.fromVector([fraction(-1,2), fraction(-17,24), 0, fraction(1,24)]).mul(scale)),
        // [1/2, 0, -sqrt(5)/4 - 1/4] · x + -sqrt(5)/4 - 1/2 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)])), K.fromVector([fraction(-1,2), fraction(-17,24), 0, fraction(1,24)]).mul(scale))
    ];
    return cuts;
}

export function rhombicDodecahedron(scale: AlgebraicNumber): ExactPlane[] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], fraction(365, 100));
    let cuts = [
        // [9/16, 0, 9/16] · x + -27*sqrt(2)/64 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(9,16)]), K.fromVector([0]), K.fromVector([fraction(9,16)])), K.fromVector([0, fraction(99,128), 0, fraction(-9,128)]).mul(scale)),
        // [9/16, 9/16, 0] · x + -27*sqrt(2)/64 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(9,16)]), K.fromVector([fraction(9,16)]), K.fromVector([0])), K.fromVector([0, fraction(99,128), 0, fraction(-9,128)]).mul(scale)),
        // [0, 9/16, 9/16] · x + -27*sqrt(2)/64 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(9,16)]), K.fromVector([fraction(9,16)])), K.fromVector([0, fraction(99,128), 0, fraction(-9,128)]).mul(scale)),
        // [9/16, 0, -9/16] · x + -27*sqrt(2)/64 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(9,16)]), K.fromVector([0]), K.fromVector([fraction(-9,16)])), K.fromVector([0, fraction(99,128), 0, fraction(-9,128)]).mul(scale)),
        // [9/16, -9/16, 0] · x + -27*sqrt(2)/64 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(9,16)]), K.fromVector([fraction(-9,16)]), K.fromVector([0])), K.fromVector([0, fraction(99,128), 0, fraction(-9,128)]).mul(scale)),
        // [0, -9/16, -9/16] · x + -27*sqrt(2)/64 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-9,16)]), K.fromVector([fraction(-9,16)])), K.fromVector([0, fraction(99,128), 0, fraction(-9,128)]).mul(scale)),
        // [-9/16, 0, -9/16] · x + -27*sqrt(2)/64 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-9,16)]), K.fromVector([0]), K.fromVector([fraction(-9,16)])), K.fromVector([0, fraction(99,128), 0, fraction(-9,128)]).mul(scale)),
        // [-9/16, 9/16, 0] · x + -27*sqrt(2)/64 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-9,16)]), K.fromVector([fraction(9,16)]), K.fromVector([0])), K.fromVector([0, fraction(99,128), 0, fraction(-9,128)]).mul(scale)),
        // [0, 9/16, -9/16] · x + -27*sqrt(2)/64 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(9,16)]), K.fromVector([fraction(-9,16)])), K.fromVector([0, fraction(99,128), 0, fraction(-9,128)]).mul(scale)),
        // [-9/16, 0, 9/16] · x + -27*sqrt(2)/64 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-9,16)]), K.fromVector([0]), K.fromVector([fraction(9,16)])), K.fromVector([0, fraction(99,128), 0, fraction(-9,128)]).mul(scale)),
        // [-9/16, -9/16, 0] · x + -27*sqrt(2)/64 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-9,16)]), K.fromVector([fraction(-9,16)]), K.fromVector([0])), K.fromVector([0, fraction(99,128), 0, fraction(-9,128)]).mul(scale)),
        // [0, -9/16, 9/16] · x + -27*sqrt(2)/64 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-9,16)]), K.fromVector([fraction(9,16)])), K.fromVector([0, fraction(99,128), 0, fraction(-9,128)]).mul(scale))
    ];
    return cuts;
}

export function rhombicTriacontahedron(scale: AlgebraicNumber): ExactPlane[] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], fraction(365, 100));
    let cuts = [
        // [0, 0, 5/16 + 5*sqrt(5)/16] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([0]), K.fromVector([fraction(5,16), fraction(85,96), 0, fraction(-5,96)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [5/16, -5*sqrt(5)/32 - 5/32, (sqrt(5) + 5)**2/64] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [(sqrt(5) + 5)**2/64, -5/16, 5/32 + 5*sqrt(5)/32] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [5/16, 5/32 + 5*sqrt(5)/32, -(sqrt(5) + 5)**2/64] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [(sqrt(5) + 5)**2/64, 5/16, -5*sqrt(5)/32 - 5/32] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [(sqrt(5) + 5)**2/64, -5/16, -5*sqrt(5)/32 - 5/32] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-(sqrt(5) + 5)**2/64, 5/16, 5/32 + 5*sqrt(5)/32] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-(sqrt(5) + 5)**2/64, -5/16, 5/32 + 5*sqrt(5)/32] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-5/16, -5*sqrt(5)/32 - 5/32, (sqrt(5) + 5)**2/64] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-(sqrt(5) + 5)**2/64, 5/16, -5*sqrt(5)/32 - 5/32] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-5/16, 5/32 + 5*sqrt(5)/32, -(sqrt(5) + 5)**2/64] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [0, 0, -5*sqrt(5)/16 - 5/16] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([0]), K.fromVector([fraction(-5,16), fraction(-85,96), 0, fraction(5,96)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [5/32 + 5*sqrt(5)/32, (sqrt(5) + 5)**2/64, 5/16] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(5,16)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [(sqrt(5) + 5)**2/64, 5/16, 5/32 + 5*sqrt(5)/32] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [5/16 + 5*sqrt(5)/16, 0, 0] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,16), fraction(85,96), 0, fraction(-5,96)]), K.fromVector([0]), K.fromVector([0])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-5*sqrt(5)/16 - 5/16, 0, 0] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,16), fraction(-85,96), 0, fraction(5,96)]), K.fromVector([0]), K.fromVector([0])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-(sqrt(5) + 5)**2/64, -5/16, -5*sqrt(5)/32 - 5/32] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-5*sqrt(5)/32 - 5/32, -(sqrt(5) + 5)**2/64, -5/16] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-5,16)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-5*sqrt(5)/32 - 5/32, (sqrt(5) + 5)**2/64, 5/16] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(5,16)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-5/16, 5/32 + 5*sqrt(5)/32, (sqrt(5) + 5)**2/64] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [5/16, 5/32 + 5*sqrt(5)/32, (sqrt(5) + 5)**2/64] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-5*sqrt(5)/32 - 5/32, (sqrt(5) + 5)**2/64, -5/16] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-5,16)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [0, 5/16 + 5*sqrt(5)/16, 0] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(5,16), fraction(85,96), 0, fraction(-5,96)]), K.fromVector([0])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [5/32 + 5*sqrt(5)/32, (sqrt(5) + 5)**2/64, -5/16] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-5,16)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-5*sqrt(5)/32 - 5/32, -(sqrt(5) + 5)**2/64, 5/16] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(5,16)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [0, -5*sqrt(5)/16 - 5/16, 0] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-5,16), fraction(-85,96), 0, fraction(5,96)]), K.fromVector([0])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [5/32 + 5*sqrt(5)/32, -(sqrt(5) + 5)**2/64, 5/16] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(5,16)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [-5/16, -5*sqrt(5)/32 - 5/32, -(sqrt(5) + 5)**2/64] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [5/16, -5*sqrt(5)/32 - 5/32, -(sqrt(5) + 5)**2/64] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale)),
        // [5/32 + 5*sqrt(5)/32, -(sqrt(5) + 5)**2/64, -5/16] · x + -25/32 - 5*sqrt(5)/16 scale = 0
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-5,16)])), K.fromVector([fraction(-25,32), fraction(-85,96), 0, fraction(5,96)]).mul(scale))
    ];
    return cuts;
}

