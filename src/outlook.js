import _ from "underscore";

class HandBracket {
    constructor(bracketPoints) {
        this.bracketPoints = bracketPoints;
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
        if(this.handCount === 1) {
            return `${this.bestHand.score()} from ${this.bestHand}`;
        } else {
            return `${this.bestHand.score()} (+${this.handCount - 1} variants) from ${this.bestHand}`;
        }
    }
}

export default class HandOutlook {
    constructor(minScore) {
        this.minScore = minScore;
        this.brackets = {};
        this.totalCount = 0;
    }

    addCandidateHand(hand) {
        if(hand.score().points <= this.minScore) {
            return;
        }

        let bracket = hand.score().truncate();
        if(!this.brackets[bracket]) {
            this.brackets[bracket] = new HandBracket(bracket);
        }

        this.brackets[bracket].addHand(hand);
        this.totalCount++;
    }

    getBrackets() {
        return _.chain(this.brackets)
                .keys()
                .sortBy(x => -x)
                .map(x => this.brackets[x])
                .value();
    }
}
