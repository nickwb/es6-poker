import _ from 'underscore';

import Hand from "./hand";
import Card from "./card";
import Player from "./player";

export default class Deal {
	constructor(players, communityCards) {
		this.players = players;
		this.communityCards = communityCards;
	}

	addToCommunityCards(...cards) {
		if(this.communityCards.length + cards.length > 5) {
			throw 'Too many commnuity cards.'
		}

		this.communityCards = this.communityCards.concat(...cards);
	}

	getWinners() {
		let playerScores = _.chain(this.players)
		 		.map(p => ({ player: p, bestHand: _.max(p.getHands(this.communityCards), h => h.getScore().points)}))
		 		.map(p => _.extend(p, { bestScore: p.bestHand.getScore() }))
		 		.value();

 		let winningScore = _.chain(playerScores).map(p => p.bestScore.points).max();

 		return _.filter(playerScores, p => p.bestScore.points == winningScore);
	}
}

Deal.random = function(numPlayers) {
	var cards = _.chain(Card.types)
			.values()
			.shuffle()
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