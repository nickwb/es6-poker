* Move getCombinations to a combinatorics.js file and then remove the dependency on js-combinatorics
* Create an iterator wrapper which supports .asArray()
* Factor out the similar "try all combinations, and find ones better than current" logic in to a single function
* Create a class for score summary, and have it lazy evaluate the various values
* Wrap up the current Hand class, and have it always accept an array rather than relying on the rest operator
* Create a class for handling summary results for many different hands