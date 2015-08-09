import should from 'should';
import _ from 'underscore';
import combo from '../src/combinatorics.js';

describe('combinatorics', () => {
    describe('nCr', () => {
        it('Should return 1 when n equals r', () => {
            combo.nCr(5, 5).should.equal(1);
        });
    });

    describe('getCombinations', () => {
        var tests = [
            {n: 5, r: 1, combos: '0 1 2 3 4'},
            {n: 5, r: 2, combos: '01 02 03 04 12 13 14 23 24 34'},
            {n: 5, r: 3, combos: '012 013 014 023 024 034 123 124 134 234'},
            {n: 5, r: 4, combos: '0123 0124 0134 0234 1234'},
            {n: 5, r: 5, combos: '01234'}
        ];

        tests.forEach(t => {
            it(`Should have the expected combinations for ${t.n}C${t.r}.`, () => {
                let arr = _.range(t.n);
                let combinations = combo.getCombinations(arr, t.r).toArray();
                combinations.length.should.equal(combo.nCr(t.n, t.r));

                let result = _.map(combinations, x => x.sort().join('')).sort().join(' ');
                result.should.equal(t.combos);
            });
        });
    });
});
