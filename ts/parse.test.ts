import { AlgebraicNumber, algebraicNumberField } from './exact';
import { fraction } from './fraction';
import { parseExpr, evalExpr } from './parse';

let ints = [-11, -1, 0, 1, 11];

function parseReal(s) {
    return evalExpr(parseExpr(s));
};

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

test('pow', () => {
    expect(
        evalExpr({op: '^',
                  args: [{op: 'num', args: [], val: fraction(2)},
                         {op: 'num', args: [], val: fraction(3)}]}).toNumber()
    ).toBeCloseTo(8);
    expect(
        evalExpr({op: '^',
                  args: [{op: 'num', args: [], val: fraction(2)},
                         {op: 'num', args: [], val: fraction(1,2)}]}).toNumber()
    ).toBeCloseTo(2**0.5);
    expect(() => {
        evalExpr({op: '^',
                  args: [{op: 'num', args: [], val: fraction(2)},
                         {op: 'sqrt', args: [], val: fraction(2)}]})
    }).toThrow();
    expect(() => {
        evalExpr({op: '^',
                  args: [{op: 'num', args: [], val: fraction(-1)},
                         {op: 'sqrt', args: [], val: fraction(2)}]})
    }).toThrow();

    expect(parseExpr('2^3')).toStrictEqual(
        {op: '^',
         args: [{op: 'num', args: [], val: fraction(2)},
                {op: 'num', args: [], val: fraction(3)}]}
    );
});

test('neg', () => {
    expect(parseExpr('-1')).toStrictEqual(
        {op: 'neg', args: [{op: 'num', args: [], val: fraction(1)}]}
    );
    expect(parseExpr('--1')).toStrictEqual(
        {op: 'neg', args: [{op: 'neg', args: [{op: 'num', args: [], val: fraction(1)}]}]}
    );
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
    expect(parseReal('2*3^4').toNumber()).toBe(2*3**4);
    expect(parseReal('2^3*4').toNumber()).toBe(2**3*4);
    expect(parseReal('-2^2').toNumber()).toBe(-4);
});
