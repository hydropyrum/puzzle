import { AlgebraicNumber } from './exact';
import { parseReal } from './parse';

let ints = [-11, -1, 0, 1, 11];

test('integer', () => {
    for (let i of ints)
        expect(parseReal(String(i)).toNumber()).toBe(i);
});

test('addition', () => {
    for (let i of ints)
        for (let j of ints)
            expect(parseReal(String(i)+"+"+String(j)).toNumber()).toBe(i+j);
});

test('subtraction', () => {
    for (let i of ints)
        for (let j of ints)
            expect(parseReal(String(i)+"-"+String(j)).toNumber()).toBe(i-j);
});

test('multiplication', () => {
    for (let i of ints)
        for (let j of ints)
            expect(parseReal(String(i)+"*"+String(j)).toNumber()).toBeCloseTo(i*j);
});

test('division', () => {
    for (let i of ints)
        for (let j of ints)
            if (j != 0)
                expect(parseReal(String(i)+"/"+String(j)).toNumber()).toBeCloseTo(i/j);
});

test('sqrt', () => {
    for (let i of [2,5])
        expect(parseReal(`sqrt(${i})`).toNumber()).toBeCloseTo(Math.sqrt(i));
});

test('precedence', () => {
    expect(parseReal('1+2*3').toNumber()).toBe(1+2*3);
    expect(parseReal('1*2+3').toNumber()).toBe(1*2+3);
    expect(parseReal('(1+2)*3').toNumber()).toBe((1+2)*3);
    expect(parseReal('1*(2+3)').toNumber()).toBe(1*(2+3));
});
