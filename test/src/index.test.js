import should from 'should';
import * as markov from '../../src';

describe('buildMatrix', () => {
  it('should work', () => {
    const expected = {
      meta: {
        firstLetters: ['m', 'k'],
      },
      chain: {
        m: { tokens: ['a'], weights: [2] },
        a: { tokens: ['r', 'm'], weights: [1, 2] },
        r: { tokens: ['k', 'a'], weights: [1, 2] },
        k: { tokens: ['r'], weights: [1] },
      },
    };

    const actual = markov.buildMatrix(['mark', 'krama']);
    should(actual).deepEqual(expected);
  });
});

describe('generateWeightedMatrix', () => {
  it('should work', () => {
    const MATRIX = {
      m: { a: 2 },
      a: { r: 1, m: 1 },
      r: { k: 1, a: 1 },
      k: { r: 1 },
    };

    const expected = {
      m: { tokens: ['a'], weights: [2] },
      a: { tokens: ['r', 'm'], weights: [1, 2] },
      r: { tokens: ['k', 'a'], weights: [1, 2] },
      k: { tokens: ['r'], weights: [1] },
    };

    const actual = markov.generateWeightedMatrix(MATRIX);

    should(actual).deepEqual(expected);
  });
});


describe('getToken', () => {
  it('should work', () => {
    const ROW = { tokens: ['a', 'b', 'c'], weights: [1, 4, 9] };

    const expected = 'b';
    const actual = markov.getToken(ROW, 3);

    should(actual).equal(expected);
  });
});

describe('walkWeightedMatrix', () => {
  const MARIX = {
    meta: {
      firstLetters: ['m', 'k'],
    },
    chain: {
      m: { tokens: ['a'], weights: [2] },
      a: { tokens: ['r', 'm'], weights: [1, 2] },
      r: { tokens: ['k', 'a'], weights: [1, 2] },
      k: { tokens: ['r'], weights: [1] },
    },
  };

  it('should work', () => {
    const expected = 'krama';
    const actual = markov.walkWeightedMatrix(MARIX, 5);
    should(actual.length).equal(expected.length);
  });
});

describe('generateNames', () => {
  const LIST = [
    'mark',
    'jeni',
    'remus',
    'frances',
    'squids',
    'griffon',
    'joan',
  ];
  it('should work', () => {
    const expected = '';
    const actual = markov.generateNames(LIST, 10);

    should(actual).equal(expected);
  });
});
