import * as _ from 'lodash';

/**
 * Generate an object for each key in matrix with array of tokens and
 * array of weights for each token to use in randomly selecting token
 * based on probability it would appear
 *
 * @param  {object} matrix
 * @return {object}
 */
export function generateWeightedMatrix(matrix) {
  const weightedMatrix = {};
  _.each(matrix, (element, key) => {
    const tokens = [];
    const weights = [];
    let sum = 0;

    _.each(element, (weight, token) => {
      tokens.push(token);
      // build a cumulative sum of weights
      sum += weight;
      // push current sum on our weights array
      weights.push(sum);
    });

    weightedMatrix[key] = {
      tokens,
      weights,
    };
  });

  return weightedMatrix;
}

/**
 * For each char on our array of strings create a key in matrix that contains an object to
 * record and count every char that follows our initial char.
 *
 * [banana] would yield
 * matrix = {
 *   b: {a: 1},
 *   a: {n: 2},
 *   n: {a: 2}
 * }
 *
 * @param  {array} array [an array of strings to build our matrix from]
 * @return {object}
 */
export function buildMatrix(array) {
  const matrix = {
    meta: {
      firstLetters: [],
    },
    chain: {},
  };

  _.each(array, (el) => {
    // for each element (string) in our array, check each character
    // add first letter to first letters array
    matrix.meta.firstLetters.push(el.charAt(0));

    for (let i = 0; i < el.length; i += 1) {
      // the character we are checking
      const c = el.charAt(i);
      // the character following the charcter we are checking
      const d = el.charAt(i + 1);

      // if a character follows the one we are checking
      if (d) {
        // if the character we are checking does not already exist in matrix
        if (_.isUndefined(matrix.chain[c])) {
          // set it equal to an empty object
          matrix.chain[c] = {};
        }

        if (_.isUndefined(matrix.chain[c][d])) {
          // set initial count
          matrix.chain[c][d] = 1;
        } else {
          // increment existing count
          matrix.chain[c][d] += 1;
        }
      }
    }
  });

  matrix.chain = generateWeightedMatrix(matrix.chain);

  return matrix;
}

/**
 * Returns first token in tokens whose index matches first weight in weights
 * that is less than or equal to integer
 *
 * @param  {object} row      contains 2 corresponding arrays;
 *                             tokens [strings] and weights [numbers]
 * @param  {Number} integer  [Random integer between 0 and largest weight in weights]
 * @return {String}
 */
export function getToken(row, integer) {
  const index = _.findIndex(row.weights, o => integer <= o);

  return row.tokens[index];
}

/**
 * Generate a name from our weighted matrix
 * @param  {Object} matrix [fully built and weighted matrix]
 * @param  {Number} length [max possible length of the retrurned name]
 * @return {String}        [a name]
 */
export function walkWeightedMatrix(matrix, length) {
  // grab a random seedToken from our firstLetters
  const seedToken = _.sample(matrix.meta.firstLetters);
  // start our name with the seedToken
  const name = [seedToken];
  // begin our traverse with seedToken row
  let row = matrix.chain[seedToken];

  // while our return value is less than length
  for (let i = 1; i < length; i += 1) {
    // grab weights from our current row
    const weights = row.weights;
    // grab a token
    const token = getToken(row, _.random(0, weights[weights.length - 1]));
    // add token to our name
    name.push(token);

    // walk to the next row
    row = matrix.chain[token];

    // if there happens to not be a row where we are looking just return what we have already.
    if (!row) {
      return name.join('');
    }
  }

  // join the tokens into a single string and return the name
  return name.join('');
}

/**
 * Create a list of names of length n
 * @param  {Array} list    [Array of strings to feed our algorithm]
 * @param  {Number} [n=1]  [Number fo names to generate - default = 1]
 * @return {Array}         [Array of generates names]
 */
export function generateNames(list, n = 1) {
  const names = [];
  // build the matrix from a list of names
  const matrix = buildMatrix(list);

  // generate n names
  for (let i = 0; i < n; i += 1) {
    names.push(walkWeightedMatrix(matrix, 5));
  }

  return names;
}
