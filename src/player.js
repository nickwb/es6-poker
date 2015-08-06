
export default class Player {
	constructor(name, pocket) {
		this.name = name;
		this.pocket = pocket;
	}

	getHands(communityCards) {
		return this.pocket.getHands(communityCards);
	}
}
