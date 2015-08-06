import _ from "underscore";

import combo from "./combinatorics";
import Card from "./card";
import Hand from "./hand";

export default class Round {
	constructor(...pocketCards) {
		this.pocket = _.sortBy(pocketCards, p => p.sortOrder());
		this.communityCards = [];

		this.pocketMap = {};
		_.each(pocketCards, p => this.pocketMap[p.toString()] = true);
	}

	addCommunityCards(...cards) {
		this.communityCards = this.communityCards.concat(...cards);
	}

	getPlayerCurrentBestHand() {
		let combos = combo.getCombinations(this.getSeenCards(), 5).toArray();
		return _.chain(combos)
				.map(h => new Hand(h))
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
				let hand = new Hand(cardArray);

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

		for(let otherPocket of combo.getCombinations(unseen, 2)) {
			let otherSet = this.communityCards.concat(...otherPocket);

			for(let cardArray of combo.getCombinations(otherSet, 5)) {
				let hand = new Hand(cardArray);

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
		return this.pocket.concat(...this.communityCards);
	}

	getUnseenCards() {
		return _.without(Card.types, ...this.getSeenCards());
	}
}
