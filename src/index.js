import _ from 'underscore';

import Card from "./card";
import Hand from "./hand";
import Deal from "./deal";

import Round from "./round";
import Deck from "./deck";

/*{
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
}*/

{
	let d = Deck.random();

	let r = new Round(...d.deal(2));
	r.addCommunityCards(...d.deal(3));

	console.log(`Your pocket is ${r.pocket.join(' ')}.`);
	console.log(`The community cards are ${r.communityCards.join(' ')}.`);

	let best = r.getPlayerCurrentBestHand();
	console.log(`The best hand you can currently make is: ${best.score.name} (${best.score.description}).`);

	let better = r.getPossibleCurrentBetterHands();
	console.log(`There are ${better.length} pockets which can beat you.`);

	_.each(better, b => console.log(`${b.hand}: ${b.score.name} (${b.score.description})`));

/*	console.log('The following improved hands are possible:');
	let improved = r.getPlayerImprovedHands(2);
	_.each(improved, i => {
		let best = i.bestMember;
		console.log(`${best.hand}: ${best.score.name} (${best.score.description}). (${i.numMembers} variants)`);
	});*/
}