import _ from 'underscore';

import Card from "./card";
import Pocket from "./pocket";
import Hand from "./hand";
import Deal from "./deal";

import Round from "./round";
import Deck from "./deck";

// {
// 	let deal = Deal.random(6);
// 	_.each(deal.players, p => console.log(`${p.name} has ${p.pocket}.`));
//
// 	console.log(`The community cards are ${deal.communityCards.join(', ')}.`);
//
// 	let winners = deal.getWinners();
// 	if(winners.length == 1) {
// 		let w = winners[0];
// 		console.log(`The winner is ${w.player.name} with a ${w.bestHand.score()}. ${w.bestHand}`);
// 	} else {
// 		console.log(`There is a tie between: ${_.map(winners, w => w.player.name).join(', ')}.`);
// 		_.each(winners, w => console.log(`${w.player.name} has ${w.bestHand}. ${w.bestHand.score()}.`));
// 	}
// }

{
	let d = Deck.random();

	let r = new Round(new Pocket(d.deal(2)));
	r.addCommunityCards(...d.deal(3));

	console.log(`Your pocket is ${r.pocket}.`);
	console.log(`The community cards are ${r.communityCards.join(' ')}.`);

	let best = r.getPlayerCurrentBestHand();
	console.log(`The best hand you can currently make is: ${best.score()}.`);

	let better = r.getPossibleCurrentBetterHands();
	console.log(`There are ${better.totalCount} pockets which can beat you.`);
	_.each(better.getBrackets(), b => console.log(b.toString()));
	console.log(`Probability of a better pocket: ${better.getProbability().formatPercentage()}`);

	let improved = r.getPlayerImprovedHands(2);
	console.log(`There are ${improved.totalCount} improvements for your hand.`);
	_.each(improved.getBrackets(), b => console.log(b.toString()));
	console.log(`Total chance of improving is: ${improved.getProbability().formatPercentage()}`);
}
