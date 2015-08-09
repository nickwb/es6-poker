import _ from "underscore";

import Extensions from "./extensions";

class HandBracket {
    constructor(bracketPoints, parent) {
        this.bracketPoints = bracketPoints;
        this._parent = parent;
        this.bestHand = null;
        this.handCount = 0;
    }

    addHand(hand) {
        if(this.bestHand === null || hand.score().points > this.bestHand.score().points) {
            this.bestHand = hand;
        }

        this.handCount++;
    }

    toString() {
        let probability = this.getProbability().formatPercentage();
        if(this.handCount === 1) {
            return `${probability} chance of ${this.bestHand.score()} from ${this.bestHand}`;
        } else {
            return `${probability} chance of ${this.bestHand.score()} (+${this.handCount - 1} variants) from ${this.bestHand}`;
        }
    }

    getProbability() {
        return this.handCount / this._parent.totalCombinations;
    }
}

export default class HandOutlook {
    constructor(minScore) {
        this.minScore = minScore;
        this.brackets = {};
        this.totalCount = 0;
        this.totalCombinations = null;
    }

    setTotalCombinations(n) {
        this.totalCombinations = n;
    }

    getProbability() {
        return _.reduce(this.brackets, (sum, b) => sum + b.getProbability(), 0);
    }

    addCandidateHand(hand) {
        if(hand.score().points <= this.minScore) {
            return;
        }

        let bracket = hand.score().truncate();
        if(!this.brackets[bracket]) {
            this.brackets[bracket] = new HandBracket(bracket, this);
        }

        this.brackets[bracket].addHand(hand);
        this.totalCount++;
    }

    getBrackets() {
        return _.chain(this.brackets)
                .values()
                .sortBy(x => -x.getProbability())
                .value();
    }
}
