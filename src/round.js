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

		for(let extras of pickIndices(unseen.length, numExtraCards)) {
			let combinedSet = seen.concat(..._.map(extras, e => unseen[e]));
/*			for(let handSet of pickIndices(combinedSet.length, 5)) {
				let hand = new Hand(..._.map(handSet, i => combinedSet[i]));
				let handScore = hand.getScore();
				if(handScore.points > currentBest.points) {
					improved.push({ hand: hand, score: handScore });
				}
			}*/
		}

		//console.log(improved);
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

function* pickIndices(count, n) {
	let stack = [];
	_.range(n).forEach(x => stack.push(0));

	for(;;) {
		if(_.uniq(stack).length === n) {
			yield stack.slice(0);
		}

		stack[0]++;
		for(let i = 0; i < n; i++) {
			if(stack[i] === count) {
				if(i === n-1) { return; }
				stack[i + 1]++;
				stack[i] = 0;
			}
		}
	}
}