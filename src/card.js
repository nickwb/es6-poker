import _ from 'underscore';

var Suits = ['h', 'd', 's', 'c'];
var Ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function initCards() {
	var rankScores = {};
	var suitSortOrder = {};

	_.each(Suits, (s, i) => suitSortOrder[s] = i + 1);

	Card.types = {};

	_.each(Ranks, (r, i) => {
		rankScores[r] = i + 2;
		_.each(Suits, s => {
			var cardName = '_' + r + s;
			Card.types[cardName] = new Card(r, s);
		});
	});

	Ranks.scores = rankScores;
	Suits.sortOrder = suitSortOrder;
}

export default class Card {

	constructor(rank, suit) {
		this.rank = rank;
		this.suit = suit;
	}

	toString() {
		return this.rank + this.suit;
	}

	rankScore() {
		return Ranks.scores[this.rank];
	}

	sortOrder() {
		return (this.rankScore() * 10) + Suits.sortOrder[this.suit];
	}

	getRankAsWord(pluralise = false) {
		var pl = (word, suffix = 's') => pluralise ? word + suffix : word;
		switch(this.rank) {
			case '2': return pl('Two');
			case '3': return pl('Three');
			case '4': return pl('Four');
			case '5': return pl('Five');
			case '6': return pl('Six', 'es');
			case '7': return pl('Seven');
			case '8': return pl('Eight');
			case '9': return pl('Nine');
			case '10': return pl('Ten');
			case 'J': return pl('Jack');
			case 'Q': return pl('Queen');
			case 'K': return pl('King');
			case 'A': return pl('Ace');
		}	
	}

	getSuitAsWord(pluralise = false) {
		var pl = word => pluralise ? word +'s' : word;
		switch(this.suit) {
			case 'h': return pl('Heart');
			case 'd': return pl('Diamond');
			case 's': return pl('Spade');
			case 'c': return pl('Club');
		}
	}
}


initCards();