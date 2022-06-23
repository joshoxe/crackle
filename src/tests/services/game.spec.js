import { Game } from '../../services/game';
import { RandomString } from '../../services/random-string';
import { WordPicker } from '../../services/word-picker';
import { beforeEach, describe, it, expect } from 'vitest';

describe('Game Service', () => {
  let sut;

  beforeEach(() => {
    const wordPicker = new WordPicker();
    const randomString = new RandomString();
    sut = new Game(wordPicker, randomString);
  });
  it.each(['anise', 'snnez'])(
    'checkGuess returns correct partial likeness for different guesses',
    value => {
      const expectedResult = {
        guess: value,
        partial_likeness: 3,
        likeness: 0,
      };
      sut.answer = 'wrens';

      const result = sut.checkGuess(value);

      expect(result).toStrictEqual(expectedResult);
    }
  );

  it('checkGuess only counts double letters once given that a guess has a single letter and an answer has a double letter', () => {
    const expectedResult = {
      guess: 'anise',
      partial_likeness: 3,
      likeness: 0,
    };
    sut.answer = 'feens';

    const result = sut.checkGuess('anise');

    expect(result).toStrictEqual(expectedResult);
  });

  it('checkGuess only counts double letters once given that a guess has a single letter and an answer has a double letter, and the double letter has full likeness in the 1st position', () => {
    const expectedResult = {
      guess: 'sownd',
      partial_likeness: 2,
      likeness: 1,
    };
    sut.answer = 'woops';

    const result = sut.checkGuess('sownd');

    expect(result).toStrictEqual(expectedResult);
  });

  it('checkGuess only counts double letters once given that a guess has a single letter and an answer has a double letter, and the double letter has full likeness in the 2nd position', () => {
    const expectedResult = {
      guess: 'swond',
      partial_likeness: 2,
      likeness: 1,
    };
    sut.answer = 'woops';

    const result = sut.checkGuess('swond');

    expect(result).toStrictEqual(expectedResult);
  });

  it('checkGuess only counts double letters once given that an answer has a single letter and a guess has a double letter', () => {
    const expectedResult = {
      guess: 'feens',
      partial_likeness: 3,
      likeness: 0,
    };
    sut.answer = 'anise';

    const result = sut.checkGuess('feens');

    expect(result).toStrictEqual(expectedResult);
  });

  const doubleLetterValues = [
    { guess: 'feels', partial_likeness: 0, likeness: 2 },
    { guess: 'every', partial_likeness: 1, likeness: 1 },
  ];

  it.each(doubleLetterValues)(
    'checkGuess counts double letters correctly given both guess and answer have double letters',
    expectedResult => {
      sut.answer = 'keeno';

      const result = sut.checkGuess(expectedResult.guess);

      expect(result).toStrictEqual(expectedResult);
    }
  );

  it('checkGuess provides correct likeness result if given guess has both partial and full likeness for one letter', () => {
    const expectedResult = {
      guess: 'knee',
      partial_likeness: 0,
      likeness: 1,
    };

    // guess every, answer knees?

    sut.answer = 'fire';

    const result = sut.checkGuess('knee');

    expect(result).toStrictEqual(expectedResult);
  });

  it('checkGuess gives full likeness if guess is the same as answer', () => {
    const expectedResult = {
      guess: 'answer',
      partial_likeness: 0,
      likeness: 6,
    };

    sut.answer = 'answer';
    const result = sut.checkGuess('answer');

    expect(result).toStrictEqual(expectedResult);
  });

  it('checkGuess gives both likeness and partial likeness if guess contains both', () => {
    const expectedResult = {
      guess: 'abcd',
      partial_likeness: 3,
      likeness: 1,
    };

    sut.answer = 'cabd';

    const result = sut.checkGuess('abcd');
    expect(result).toStrictEqual(expectedResult);
  });
});
