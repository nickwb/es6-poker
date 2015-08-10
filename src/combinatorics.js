
import _ from 'underscore';

function* _getCombinations(list, n, initialSet = -1) {

	if(!_.isArray(list)) {
		throw new TypeError('You must provide an array.');
	}

	if(!_.isNumber(n) || !_.isFinite(n) || n <= 0) {
		throw new TypeError('n must be a finite number greater than zero.');
	}

	if(!_.isNumber(initialSet) || !_.isFinite(initialSet) || (initialSet !== -1 && initialSet <= 0)) {
		throw new TypeError('initialSet must be a finite number greater than zero.');
	}

	if(n > list.length) {
		throw new RangeError('n must be less than or equal to the length of the array.');
	}

	if(initialSet > list.length) {
		throw new RangeError('initialSet must be less than or equal to the length of the array.');
	}

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
				if(indices[i] < initialSet) {
					valid = true;
					break;
				}
			}

			if(!valid) { return; }
		}
	}
}

// Borrowed from: https://github.com/dankogai/js-combinatorics
function nPr(n, r) {
	if(!_.isNumber(n) || !_.isFinite(n) || n <= 0) {
		throw new TypeError('n must be a finite number greater than zero.');
	}

	if(!_.isNumber(r) || !_.isFinite(r) || r <= 0) {
		throw new TypeError('r must be a finite number greater than zero.');
	}

	if(r > n) {
		throw new RangeError('r must be less than or equal to n.');
	}

	var t, p = 1;
    if (n < r) {
        t = n;
        n = r;
        r = t;
    }
    while (r--) p *= n--;
    return p;
}

function nCr(n, r) {
	if(!_.isNumber(n) || !_.isFinite(n) || n <= 0) {
		throw new TypeError('n must be a finite number greater than zero.');
	}

	if(!_.isNumber(r) || !_.isFinite(r) || r <= 0) {
		throw new TypeError('r must be a finite number greater than zero.');
	}

	if(r > n) {
		throw new RangeError('r must be less than or equal to n.');
	}

    return nPr(n, r) / nPr(r, r);
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
    getCombinationsM: (list, n, initialSet) => new IteratorWrapper(_getCombinations(list, n, initialSet)),
	nCr: nCr
};
