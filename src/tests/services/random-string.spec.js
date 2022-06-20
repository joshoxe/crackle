import { RandomString } from '../../services/random-string';
import { describe, expect, it } from 'vitest';

describe('Random String', () => {
  it('generateWordsFromIndex gets random words from the word file', () => {
    const sut = new RandomString();
    const result = sut.generateWordsFromIndex(2, 0);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(2);
  });

  it('generateRandomNonAlphaNumericString generates a string of characters of the right length', () => {
    const sut = new RandomString();
    const result = sut.generateRandomNonAlphaNumericString(5);

    expect(typeof result).toBe('string');
    expect(result.length).toBe(5);
  });
});
