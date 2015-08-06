import _ from "underscore";

import combo from "./combinatorics";
import Card from "./card";
import Pocket from "./pocket";
import Hand from "./hand";

export default class Round {
	constructor(pocket) {
		this.pocket = pocket;
		this.communityCards = [];
	}

	addCommunityCards(...cards) {
		this.communityCards = this.communityCards.concat(...cards);
	}

	getPlayerCurrentBestHand() {
		let combos = combo.getCombinations(this.getSeenCards(), 5).toArray();
		return _.chain(combos)
				.map(h => new Hand(h, this.pocket))
				.max(h => h.score().points)
				.value();
	}

	getPlayerImprovedHands(numExtraCard) {
		let seen = this.getSeenCards();
		let unseen = this.getUnseenCards();
		let currentBest = this.getPlayerCurrentBestHand();

		let scoreMap = {};

		for(let extras of combo.getCombinationsM(unseen, 2, 1)) {
			let combinedSet = seen.concat(...extras);
			for(let cardArray of combo.getCombinations(combinedSet, 5)) {
				let hand = new Hand(cardArray, this.pocket);

				if(hand.score().points >= currentBest.score().points) {
					let truncated = hand.score().truncate();
					let tier = scoreMap[truncated] || {bestMember: null, numMembers: 0};
					tier.numMembers++;
					if(tier.bestMember === null || hand.score().points > tier.bestMember.score().points) {
						tier.bestMember = hand;
					}

					scoreMap[truncated] = tier;
				}
			}
		}

		let result = _.chain(scoreMap)
					  .keys()
					  .sortBy(x => -x)
					  .map(x => scoreMap[x])
					  .value();

		return result;
	}

	getPossibleCurrentBetterHands() {
		let unseen = this.getUnseenCards();
		let currentBest = this.getPlayerCurrentBestHand();

		let better = [];

		for(let pocketCards of combo.getCombinations(unseen, 2)) {
			let pocket = new Pocket(pocketCards);
			let set = this.communityCards.concat(pocket.cards);

			for(let cardArray of combo.getCombinations(set, 5)) {
				let hand = new Hand(cardArray, pocket);

				if(hand.score().points > currentBest.score().points) {
					better.push(hand);
				}
			}
		}

		return _.sortBy(better, h => -h.score().points);
	}

	getPossibleChasingHands(numExtraCards) {

	}

	getSeenCards() {
		return this.pocket.cards.concat(...this.communityCards);
	}

	getUnseenCards() {
		return _.without(Card.types, ...this.getSeenCards());
	}
}
