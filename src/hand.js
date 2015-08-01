import _ from 'underscore';
import Card from './card';

class HandType {
	constructor(name) {
		this.name = name;
	}

	doesHandMatch(hand) {
		return this.predicate(hand);
	}

	describeHand(hand) {
		return this.describer(hand);
	}
}

class RoyalFlush extends HandType {
	constructor() { 
		super('Royal Flush');
		this.predicate = hand => hand.isStraight() && hand.isFlush() && hand.cards[4].rank === 'A';
		this.describer = hand => '';
	}
}

class StraightFlush extends HandType {
	constructor() { 
		super('Straight Flush');
		this.predicate = hand => hand.isStraight() && hand.isFlush();
		this.describer = hand => `${hand.getHighCardWord()} High`;
	}
}

class FourOfAKind extends HandType {
	constructor() { 
		super('Four of a Kind');
		this.predicate = hand => hand.hasMultiples(4);
		this.describer = hand => `${hand.getWordOfMultiple(4)}, ${hand.getHighCardWord()} High`;
	}
}

class FullHouse extends HandType {
	constructor() { 
		super('Full House');
		this.predicate = hand => hand.hasMultiples(3) && hand.hasMultiples(2);
		this.describer = hand => `${hand.getWordOfMultiple(3)} full of ${hand.getWordOfMultiple(2)}`;
	}
}

class Flush extends HandType {
	constructor() { 
		super('Flush');
		this.predicate = hand => hand.isFlush();
		this.describer = hand => `${hand.cards[0].getSuitAsWord(true)}`;
	}
}

class Straight extends HandType {
	constructor() { 
		super('Straight');
		this.predicate = hand => hand.isStraight();
		this.describer = hand => `${hand.getHighCardWord()} High`;
	}
}

class ThreeOfAKind extends HandType {
	constructor() { 
		super('Three of a Kind');
		this.predicate = hand => hand.hasMultiples(3);
		this.describer = hand => `${hand.getWordOfMultiple(3)}, ${hand.getHighCardWord()} High`;
	}
}

class TwoPair extends HandType {
	constructor() { 
		super('Two Pair');
		this.predicate = hand => hand.hasMultiples(2, 2);
		this.describer = hand => `${hand.getWordOfMultiple(2, 0)} and ${hand.getWordOfMultiple(2, 1)}, ${hand.getHighCardWord()} High`;
	}
}

class OnePair extends HandType {
	constructor() { 
		super('One Pair');
		this.predicate = hand => hand.hasMultiples(2, 1);
		this.describer = hand => `${hand.getWordOfMultiple(2)}, ${hand.getHighCardWord()} High`;
	}
}

class HighCard extends HandType {
	constructor() { 
		super('High Card');
		this.predicate = hand => true;
		this.describer = hand => `${hand.getHighCardWord()}`;
	}
}

var HandTypes = [
	new RoyalFlush(),
	new StraightFlush(),
	new FourOfAKind(),
	new FullHouse(),
	new Flush(),
	new Straight(),
	new ThreeOfAKind(),
	new TwoPair(),
	new OnePair(),
	new HighCard()
];

_.each(HandTypes, (t, idx) => t.baseScore = HandTypes.length - idx);

export default class Hand {

	constructor(...cards) {
		this.cards = _.sortBy(cards, c => c.sortOrder());
		this.multiples = getMultiples(this.cards);
	}

	toString() {
		return this.cards.join(', ');
	}

	isFullHand() {
		return this.cards.length === 5;
	}

	isFlush() {
		return this.isFullHand() && _.all(this.cards, c => c.suit == this.cards[0].suit);
	}

	isStraight() {
		return this.isFullHand() && _.all(this.cards, (c, i) => i == 0 || this.cards[i-1].rankScore() + 1 == c.rankScore());
	}

	hasMultiples(n, m = 1) {
		return this.multiples[n] && this.multiples[n].length == m;
	}

	getWordOfMultiple(n, idx = 0) {
		return this.multiples[n][idx][0].getRankAsWord(true);
	}

	getHighCard() {
		return this.cards[this.cards.length - 1];
	}

	getHighCardWord() {
		return this.getHighCard().getRankAsWord();
	}

	getScore() {
		if(!this.isFullHand()) { return 0; }

		return _.chain(HandTypes)
			.map(t => { 
				if(!t.doesHandMatch(this)) {
					return { score: 0 }
				}

				return { 
					name: t.name,
					description: t.describeHand(this),
					score: t.baseScore * 100 + this.getHighCard().rankScore()
				};
			})
			.max(t => t.score)
			.value();
	}
}

function getMultiples(cards) {
	var byRank = {},
		multiples = {};

	_.each(cards, c => {
		byRank[c.rank] = byRank[c.rank] || [];
		byRank[c.rank].push(c);
	});

	_.each(byRank, (cards, rank) => {
		_.each([2, 3, 4], k => {
			if(cards.length === k) {
				var m = (multiples[k] || []);
				m.push(cards);
				if(m.length > 1) {	m = _.sortBy(m, cards => cards[0].sortOrder());	}
				multiples[k] = m;
			}
		});
	});

	return multiples;
}