import should from 'should';
import _ from 'underscore';
import combo from '../src/combinatorics.js';

describe('combinatorics', () => {
    describe('nCr', () => {
        it('Should return 1 when n equals r', () => {
            combo.nCr(5, 5).should.be.exactly(1);
        });

        it('Should fail if r is greater than n', () => {
            should.throws(() => combo.nCr(2,3));
        });

        it('Should fail if n is less than 1', () => {
            should.throws(() => combo.nCr(0, 0));
        });

        it('Should fail if r is less than 1', () => {
            should.throws(() => combo.nCr(2, 0));
        });

        let tests = [
            {n: 10, r: 1, result: 10},
            {n: 10, r: 2, result: 45},
            {n: 10, r: 3, result: 120},
            {n: 10, r: 4, result: 210},
            {n: 10, r: 5, result: 252},
            {n: 10, r: 6, result: 210},
            {n: 10, r: 7, result: 120},
            {n: 10, r: 8, result: 45},
            {n: 10, r: 9, result: 10},
            {n: 10, r: 10, result: 1}
        ];

        tests.forEach(t => {
            it(`Should have the expected outcome of ${t.result} for ${t.n}C${t.r}`, () => {
                combo.nCr(t.n, t.r).should.be.exactly(t.result);
            });
        });
    });

    describe('getCombinations', () => {

        it('Should fail if n is greater than the length of the array', () => {
            should.throws(() => combo.getCombinations([1, 2, 3], 4).toArray());
        });

        it('Should fail if n is less than or equal to zero', () => {
            should.throws(() => combo.getCombinations([1, 2, 3], 0).toArray());
        });

        let tests = [
            {n: 5, r: 1, combos: '0 1 2 3 4'},
            {n: 5, r: 2, combos: '01 02 03 04 12 13 14 23 24 34'},
            {n: 5, r: 3, combos: '012 013 014 023 024 034 123 124 134 234'},
            {n: 5, r: 4, combos: '0123 0124 0134 0234 1234'},
            {n: 5, r: 5, combos: '01234'}
        ];

        tests.forEach(t => {
            it(`Should have the expected combinations for ${t.n}C${t.r}`, () => {
                let arr = _.range(t.n);
                let combinations = combo.getCombinations(arr, t.r).toArray();
                combinations.length.should.be.exactly(combo.nCr(t.n, t.r));

                let result = _.map(combinations, x => x.sort().join('')).sort().join(' ');
                result.should.be.exactly(t.combos);
            });
        });
    });
});
