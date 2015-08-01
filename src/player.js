import _ from "underscore";

import Hand from "./hand";

export default class Player {
	constructor(name) {
		this.name = name;
		this.pocket = [];
	}

	setPocket(...cards) {
		if(cards.length !== 2) {
			throw 'A pocket is two cards.';
		}

		this.pocket = cards;
	}

	getHands(...communityCards) {
		var allCards = this.pocket.concat(...communityCards),
			hands = [];

		for(let i = 0; i < allCards.length; i++) {
			for(let j = i + 1; j < allCards.length; j++) {
				var h = _.filter(allCards, (card, idx) => idx != i && idx != j);
				hands.push(new Hand(...h));
			}
		}

		return hands;
	}
}