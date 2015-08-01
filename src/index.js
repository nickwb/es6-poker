import _ from 'underscore';

import Card from "./card";
import Hand from "./hand";
import Deal from "./deal";

var d = Deal.random(4);
_.each(d.players, p => console.log(`${p.name} has ${p.pocket.join(', ')}.`));

console.log(`The community cards are ${d.communityCards.join(', ')}.`);

var w = d.getWinner();
console.log(`The winner is ${w.player.name} with a ${w.bestScore.name} (${w.bestScore.description}). ${w.bestHand}`);