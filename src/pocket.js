
import _ from 'underscore';

import combo from "./combinatorics";
import Hand from "./hand";

export default class Pocket {
    constructor(pocketCards) {
        this.cards = _.sortBy(pocketCards, c => c.sortOrder());
        this._map = {};
        _.each(pocketCards, x => this._map[x.toString()] = true);
    }

    contains(card) {
        return !!this._map[card.toString()];
    }

    toString() {
        return this.cards.join(' ');
    }

    getHands(communityCards) {
		let combos = combo.getCombinations(this.cards.concat(...communityCards), 5);
		return _.map(combos.toArray(), h => new Hand(h, this));
	}
}
