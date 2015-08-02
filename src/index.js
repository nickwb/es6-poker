import _ from 'underscore';

import Card from "./card";
import Hand from "./hand";
import Deal from "./deal";

let deal = Deal.random(6);
_.each(deal.players, p => console.log(`${p.name} has ${p.pocket.join(', ')}.`));

console.log(`The community cards are ${deal.communityCards.join(', ')}.`);

let winners = deal.getWinners();
if(winners.length == 1) {
	let w = winners[0];
	console.log(`The winner is ${w.player.name} with a ${w.bestScore.name} (${w.bestScore.description}). ${w.bestHand}`);
} else {
	console.log(`There is a tie between: ${_.map(winners, w => w.player.name).join(', ')}.`);
	_.each(winners, w => console.log(`${w.player.name} has ${w.bestHand}. ${w.bestScore.name} (${w.bestScore.description}).`));
}