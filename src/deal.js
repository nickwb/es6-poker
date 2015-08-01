import _ from 'underscore';

import Hand from "./hand";
import Card from "./card";
import Player from "./player";

export default class Deal {
	constructor(players, communityCards) {
		if(players.length <= 1) {
			throw 'You must have at least two players.';
		}
		if(communityCards.length !== 5) {
			throw 'There are five community cards.';
		}
		this.players = players;
		this.communityCards = communityCards;
	}

	getWinner() {
		return _.chain(this.players)
		 		.map(p => ({ player: p, bestHand: _.max(p.getHands(this.communityCards), h => h.getScore().score)}))
		 		.map(p => _.extend(p, { bestScore: p.bestHand.getScore() }))
		 		.max(p => p.bestScore.score)
		 		.value();
	}
}

Deal.random = function(numPlayers) {
	var cards = _.chain(Card.types)
			.values()
			.map(c => ({card: c, r: Math.random()}))
			.sortBy(c => c.r).map(c => c.card)
			.first(5 + numPlayers * 2)
			.value();

	var players = [];

	for(let i = 0; i < numPlayers; i++) {
		var p = new Player(`Player ${i+1}`);
		p.setPocket(cards[i*2], cards[1 + i*2]);
		players.push(p);
	}

	return new Deal(players, cards.slice(numPlayers * 2, numPlayers*2 + 5))
};