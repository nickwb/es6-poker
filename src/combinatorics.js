
import _ from 'underscore';

function* _getCombinations(list, n, initialSet = -1) {
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
					indices[i] = indices[i + 1] + 1;
					stable = false;
				}
			}

			if(stable) { break; }
		}

		if(initialSet !== -1) {
			let valid = false;
			for(let i = 0; i < n; i++) {
				if(indices[i] <= initialSet) {
					valid = true;
					break;
				}
			}

			if(!valid) { return; }
		}
	}
}

class IteratorWrapper {
    constructor(it) {
        this._it = it;
    }
    [Symbol.iterator]() {
        return this._it;
    }
    toArray() {
        var result = [];
        for(var e of this._it) {
            result.push(e);
        }

        return result;
    }
}

export default {
    getCombinations: (list, n) => new IteratorWrapper(_getCombinations(list, n)),
    getCombinationsM: (list, n, initialSet) => new IteratorWrapper(_getCombinations(list, n, initialSet))
};
