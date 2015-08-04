import _ from "underscore";
import combo from "js-combinatorics";

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
		let combos = combo.combination(this.getSeenCards(), 5);
		return _.chain(combos.toArray())
				.map(h => makeHand(h))
				.max(h => h.score.points)
				.value();
	}

	getPlayerImprovedHands(numExtraCard, forcePocket = true) {
		let seen = this.getSeenCards();
		let unseen = this.getUnseenCards();
		let currentBest = this.getPlayerCurrentBestHand();

		let scoreMap = {};

		for(let extras of getCombinations(unseen, 2, forcePocket ? 1 : -1)) {
			let combinedSet = seen.concat(...extras);
			for(let cardArray of getCombinations(combinedSet, 5)) {
				let hand = makeHand(cardArray);
				
				if(hand.score.points >= currentBest.score.points) {
					let truncated = Hand.truncateScore(hand.score.points);
					let tier = scoreMap[truncated] || {bestMember: null, bestPoints: 0, numMembers: 0};
					tier.numMembers++;
					if(hand.score.points > tier.bestPoints) {
						tier.bestMember = hand;
						tier.bestPoints = hand.score.points;
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

function makeHand(cardArray) {
	let h = new Hand(...cardArray);
	return { hand: h, score: h.getScore() };
}

function* getCombinations(list, n, goldenIndices = -1) {
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

		if(goldenIndices !== -1) {
			let valid = false;
			for(let i = 0; i < n; i++) {
				if(indices[i] <= goldenIndices) {
					valid = true;
					break;
				}
			}

			if(!valid) { return; }
		}
	}
}