
import _ from "underscore";

import Card from "./card";

export default class Deck {
	constructor(cards) {
		this.cards = cards;
		this.nextToDeal = 0;
	}
	deal(count) {
		var result = this.cards.slice(this.nextToDeal, this.nextToDeal + count);
		this.nextToDeal += count;
		return result;
	}
	static random() {
		return new Deck(_.shuffle(Card.types));
	}
}
