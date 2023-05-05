import { Fraction, fraction } from './fraction';
import { AlgebraicNumberField, algebraicNumberField } from './exact';
import { ExactVector3, ExactPlane } from './piece';

export function tetrahedron(inradius: Fraction): [AlgebraicNumberField, ExactPlane[]] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], 3.6502815398728847);
    let cuts = [
        // [1/2, 1/2, 1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/2, -1/2, -1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/2, -1/2, 1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/2, 1/2, -1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([Fraction.unaryMinus(inradius)]))
    ];
    return [K, cuts];
}

export function octahedron(inradius: Fraction): [AlgebraicNumberField, ExactPlane[]] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], 3.6502815398728847);
    let cuts = [
        // [1/2, 1/2, 1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/2, 1/2, 1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/2, -1/2, 1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/2, -1/2, 1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/2, -1/2, -1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/2, -1/2, -1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/2, 1/2, -1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/2, 1/2, -1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([Fraction.unaryMinus(inradius)]))
    ];
    return [K, cuts];
}

export function cube(inradius: Fraction): [AlgebraicNumberField, ExactPlane[]] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], 3.6502815398728847);
    let cuts = [
        // [0, 1, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([1]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, 0, 1] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([0]), K.fromVector([1])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1, 0, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([1]), K.fromVector([0]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, -1, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([-1]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1, 0, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([-1]), K.fromVector([0]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, 0, -1] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([0]), K.fromVector([-1])), K.fromVector([Fraction.unaryMinus(inradius)]))
    ];
    return [K, cuts];
}

export function icosahedron(inradius: Fraction): [AlgebraicNumberField, ExactPlane[]] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], 3.6502815398728847);
    let cuts = [
        // [0, 1/4 - sqrt(5)/4, 1/4 + sqrt(5)/4] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/2, -1/2, 1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/4 + sqrt(5)/4, 0, -1/4 + sqrt(5)/4] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(17,24), 0, fraction(-1,24)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/2, 1/2, 1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, -1/4 + sqrt(5)/4, 1/4 + sqrt(5)/4] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, 1/4 - sqrt(5)/4, -sqrt(5)/4 - 1/4] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/2, -1/2, -1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-sqrt(5)/4 - 1/4, 0, 1/4 - sqrt(5)/4] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([0]), K.fromVector([fraction(1,4), fraction(-17,24), 0, fraction(1,24)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/2, 1/2, -1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, -1/4 + sqrt(5)/4, -sqrt(5)/4 - 1/4] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-sqrt(5)/4 - 1/4, 0, -1/4 + sqrt(5)/4] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(17,24), 0, fraction(-1,24)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/2, -1/2, 1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/4 - sqrt(5)/4, -sqrt(5)/4 - 1/4, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/4 + sqrt(5)/4, -sqrt(5)/4 - 1/4, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/2, -1/2, -1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/4 + sqrt(5)/4, 0, 1/4 - sqrt(5)/4] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([0]), K.fromVector([fraction(1,4), fraction(-17,24), 0, fraction(1,24)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/2, 1/2, -1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(-1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/4 + sqrt(5)/4, 1/4 + sqrt(5)/4, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/4 - sqrt(5)/4, 1/4 + sqrt(5)/4, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/2, 1/2, 1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([fraction(1,2)]), K.fromVector([fraction(1,2)])), K.fromVector([Fraction.unaryMinus(inradius)]))
    ];
    return [K, cuts];
}

export function dodecahedron(inradius: Fraction): [AlgebraicNumberField, ExactPlane[]] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], 3.6502815398728847);
    let cuts = [
        // [1/2, 0, 1/4 + sqrt(5)/4] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([0]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, 1/4 + sqrt(5)/4, 1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/2, 0, 1/4 + sqrt(5)/4] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([0]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-sqrt(5)/4 - 1/4, 1/2, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(1,2)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-1/2, 0, -sqrt(5)/4 - 1/4] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,2)]), K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-sqrt(5)/4 - 1/4, -1/2, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(-1,2)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, -sqrt(5)/4 - 1/4, -1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(-1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/4 + sqrt(5)/4, -1/2, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(-1,2)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, -sqrt(5)/4 - 1/4, 1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)]), K.fromVector([fraction(1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, 1/4 + sqrt(5)/4, -1/2] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(-1,2)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/4 + sqrt(5)/4, 1/2, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,4), fraction(17,24), 0, fraction(-1,24)]), K.fromVector([fraction(1,2)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [1/2, 0, -sqrt(5)/4 - 1/4] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(1,2)]), K.fromVector([0]), K.fromVector([fraction(-1,4), fraction(-17,24), 0, fraction(1,24)])), K.fromVector([Fraction.unaryMinus(inradius)]))
    ];
    return [K, cuts];
}

export function rhombicDodecahedron(inradius: Fraction): [AlgebraicNumberField, ExactPlane[]] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], 3.6502815398728847);
    let cuts = [
        // [9/16, 0, 9/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(9,16)]), K.fromVector([0]), K.fromVector([fraction(9,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [9/16, 9/16, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(9,16)]), K.fromVector([fraction(9,16)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, 9/16, 9/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(9,16)]), K.fromVector([fraction(9,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [9/16, 0, -9/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(9,16)]), K.fromVector([0]), K.fromVector([fraction(-9,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [9/16, -9/16, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(9,16)]), K.fromVector([fraction(-9,16)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, -9/16, -9/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-9,16)]), K.fromVector([fraction(-9,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-9/16, 0, -9/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-9,16)]), K.fromVector([0]), K.fromVector([fraction(-9,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-9/16, 9/16, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-9,16)]), K.fromVector([fraction(9,16)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, 9/16, -9/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(9,16)]), K.fromVector([fraction(-9,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-9/16, 0, 9/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-9,16)]), K.fromVector([0]), K.fromVector([fraction(9,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-9/16, -9/16, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-9,16)]), K.fromVector([fraction(-9,16)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, -9/16, 9/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-9,16)]), K.fromVector([fraction(9,16)])), K.fromVector([Fraction.unaryMinus(inradius)]))
    ];
    return [K, cuts];
}

export function rhombicTriacontahedron(inradius: Fraction): [AlgebraicNumberField, ExactPlane[]] {
    let K = algebraicNumberField([9, 0, -14, 0, 1], 3.6502815398728847);
    let cuts = [
        // [0, 0, 5/16 + 5*sqrt(5)/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([0]), K.fromVector([fraction(5,16), fraction(85,96), 0, fraction(-5,96)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [5/16, -5*sqrt(5)/32 - 5/32, (sqrt(5) + 5)**2/64] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [(sqrt(5) + 5)**2/64, -5/16, 5/32 + 5*sqrt(5)/32] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [5/16, 5/32 + 5*sqrt(5)/32, -(sqrt(5) + 5)**2/64] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [(sqrt(5) + 5)**2/64, 5/16, -5*sqrt(5)/32 - 5/32] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [(sqrt(5) + 5)**2/64, -5/16, -5*sqrt(5)/32 - 5/32] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-(sqrt(5) + 5)**2/64, 5/16, 5/32 + 5*sqrt(5)/32] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-(sqrt(5) + 5)**2/64, -5/16, 5/32 + 5*sqrt(5)/32] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-5/16, -5*sqrt(5)/32 - 5/32, (sqrt(5) + 5)**2/64] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-(sqrt(5) + 5)**2/64, 5/16, -5*sqrt(5)/32 - 5/32] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-5/16, 5/32 + 5*sqrt(5)/32, -(sqrt(5) + 5)**2/64] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, 0, -5*sqrt(5)/16 - 5/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([0]), K.fromVector([fraction(-5,16), fraction(-85,96), 0, fraction(5,96)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [5/32 + 5*sqrt(5)/32, (sqrt(5) + 5)**2/64, 5/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(5,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [(sqrt(5) + 5)**2/64, 5/16, 5/32 + 5*sqrt(5)/32] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [5/16 + 5*sqrt(5)/16, 0, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,16), fraction(85,96), 0, fraction(-5,96)]), K.fromVector([0]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-5*sqrt(5)/16 - 5/16, 0, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,16), fraction(-85,96), 0, fraction(5,96)]), K.fromVector([0]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-(sqrt(5) + 5)**2/64, -5/16, -5*sqrt(5)/32 - 5/32] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-5*sqrt(5)/32 - 5/32, -(sqrt(5) + 5)**2/64, -5/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-5,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-5*sqrt(5)/32 - 5/32, (sqrt(5) + 5)**2/64, 5/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(5,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-5/16, 5/32 + 5*sqrt(5)/32, (sqrt(5) + 5)**2/64] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [5/16, 5/32 + 5*sqrt(5)/32, (sqrt(5) + 5)**2/64] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,16)]), K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-5*sqrt(5)/32 - 5/32, (sqrt(5) + 5)**2/64, -5/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-5,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, 5/16 + 5*sqrt(5)/16, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(5,16), fraction(85,96), 0, fraction(-5,96)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [5/32 + 5*sqrt(5)/32, (sqrt(5) + 5)**2/64, -5/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(15,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-5,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-5*sqrt(5)/32 - 5/32, -(sqrt(5) + 5)**2/64, 5/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(5,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [0, -5*sqrt(5)/16 - 5/16, 0] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([0]), K.fromVector([fraction(-5,16), fraction(-85,96), 0, fraction(5,96)]), K.fromVector([0])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [5/32 + 5*sqrt(5)/32, -(sqrt(5) + 5)**2/64, 5/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(5,16)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [-5/16, -5*sqrt(5)/32 - 5/32, -(sqrt(5) + 5)**2/64] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(-5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [5/16, -5*sqrt(5)/32 - 5/32, -(sqrt(5) + 5)**2/64] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,16)]), K.fromVector([fraction(-5,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)])), K.fromVector([Fraction.unaryMinus(inradius)])),
        // [5/32 + 5*sqrt(5)/32, -(sqrt(5) + 5)**2/64, -5/16] · x = inradius
        new ExactPlane(new ExactVector3(K.fromVector([fraction(5,32), fraction(85,192), 0, fraction(-5,192)]), K.fromVector([fraction(-15,32), fraction(-85,192), 0, fraction(5,192)]), K.fromVector([fraction(-5,16)])), K.fromVector([Fraction.unaryMinus(inradius)]))
    ];
    return [K, cuts];
}

