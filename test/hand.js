import should from 'should';
import _ from 'underscore';
import Hand from '../src/hand.js';
import Card from '../src/card.js';

function makeHand(handStr) {
    return new Hand(_.map(handStr.split(' '), c => Card.types[`_${c}`]));
}

describe('hand', () => {
    describe('scoring', () => {


        let tests = [
            {win: 'Ah Ad 2s 3s 4s', lose: 'Kh Kd 2s 3s 4s', note: 'Aces beat Kings.'},
            {win: 'Kh Kd As 2s 3s', lose: 'Kh Kd 2s 3s 4s', note: 'Kicker wins against identical pair.'},
            {win: 'Kh Kd Qh Qd 2s', lose: 'Ah Ad 2s 3s 4s', note: 'Two pair bets a single pair.'},
            {win: 'Kh Kd Qh Qd As', lose: 'Kh Kd Qh Qd 2s', note: 'Kicker wins against identical two pair.'},
            {win: 'Kh Kd Kc 2s 3s', lose: 'Ah Ad 2s 3s 4s', note: 'A set beats a pair.'},
            {win: 'Kh Kd Kc 2s 3s', lose: 'Ah Ad Qh Qd 2s', note: 'A set beats two pair.'},
            {win: 'Kh Kd Kc As 3s', lose: 'Kh Kd Kc 2s 3s', note: 'Kicker wins against identical set.'},
        ];

        tests.forEach(t => {
            it(`A hand of [${t.win}] should beat a hand of [${t.lose}], because: ${t.note}`, () => {
                let winningHand = makeHand(t.win),
                    losingHand = makeHand(t.lose);

                winningHand.score().points.should.be.above(losingHand.score().points);
            });
        });
    });
});
