import _ from 'underscore';

import Hand from "./hand";
import Card from "./card";
import Pocket from "./pocket";
import Deck from "./deck";
import Player from "./player";

export default class Deal {
	constructor(players, communityCards) {
		this.players = players;
		this.communityCards = communityCards;
	}

	addToCommunityCards(cards) {
		if(this.communityCards.length + cards.length > 5) {
			throw 'Too many commnuity cards.'
		}

		this.communityCards = this.communityCards.concat(...cards);
	}

	getWinners() {
		let playerScores = _.chain(this.players)
		 		.map(p => ({ player: p, bestHand: _.max(p.getHands(this.communityCards), h => h.score().points)}))
		 		.value();

 		let winningScore = _.chain(playerScores).map(p => p.bestHand.score().points).max();

 		return _.filter(playerScores, p => p.bestHand.score().points == winningScore);
	}
}

Deal.random = function(numPlayers) {
	let deck = Deck.random();
	let players = [];

	for(let i = 0; i < numPlayers; i++) {
		players.push(new Player(`Player ${i+1}`, new Pocket(deck.deal(2))));
	}

	return new Deal(players, deck.deal(5));
};
