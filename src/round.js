import _ from "underscore";
import combo from "js-combinatorics";

import Card from "./card";
import Hand from "./hand";

export default class Round {
	constructor(...pocketCards) {
		this.pocket = _.sortBy(pocketCards, p => p.sortOrder());
		this.communityCards = [];
	}

	addCommunityCards(...cards) {
		this.communityCards = this.communityCards.concat(...cards);
	}

	getPlayerCurrentBestHand() {
		let combos = combo.combination(this.getSeenCards(), 5);
		return _.chain(combos.toArray())
				.map(h => new Hand(...h))
				.map(h => ({ hand: h, score: h.getScore() }))
				.max(h => h.score.points)
				.value();
	}

	getPlayerImprovedHands(numExtraCards) {
		let seen = this.getSeenCards();
		let unseen = this.getUnseenCards();
		let currentBest = this.getPlayerCurrentBestHand();

		let improved = [];

		for(let extras of getCombinations(unseen, 2)) {
			let combinedSet = seen.concat(...extras);
			for(let handSet of getCombinations(combinedSet, 5)) {
				let hand = new Hand(...handSet);
				let handScore = hand.getScore();
				if(handScore.points > currentBest.score.points) {
					improved.push({ hand: hand, score: handScore });
				}
			}
		}

		return improved;
	}

	getPossibleCurrentBetterHands() {

	}

	getPossibleChasingHands(numExtraCards) {

	}

	getSeenCards() {
		return this.communityCards.concat(...this.pocket);
	}

	getUnseenCards() {
		return _.without(Card.types, ...this.getSeenCards());
	}
}

function* getCombinations(list, n) {
	let indices = [];
	_.range(n).forEach(x => indices.push(n - (x + 1)));

	for(;;) {
		yield _.map(indices, i => list[i]);

		indices[0]++;
		for(;;) {
			let stable = true;
			for(let i = 0; i < n; i++) {
				if(indices[i] >= list.length) {
					if(i === n - 1) { return; }
					indices[i + 1]++;
					stable = false;
				}
			}
			for(let i = n-1; i >= 0; i--) {
				if(indices[i] >= list.length) {
					if(i === n - 1) { return; }
					indices[i] = indices[i + 1] + 1;
					stable = false;
				}
			}

			if(stable) { break; }
		}
	}
}