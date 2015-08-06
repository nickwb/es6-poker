import _ from "underscore";
import combo from "js-combinatorics";

import Hand from "./hand";

export default class Player {
	constructor(name) {
		this.name = name;
		this.pocket = [];
	}

	setPocket(cards) {
		if(cards.length !== 2) {
			throw 'A pocket is two cards.';
		}

		this.pocket = cards;
	}

	getHands(communityCards) {
		let combos = combo.combination(this.pocket.concat(...communityCards), 5);
		return _.map(combos.toArray(), h => new Hand(h));
	}
}
