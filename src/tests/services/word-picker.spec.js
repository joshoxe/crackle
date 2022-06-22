import { WordPicker } from '../../services/word-picker';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Word Picker', () => {
  let sut;

  beforeEach(() => {
    sut = new WordPicker();
  });

  it('getDateIndex returns correct number of days between two dates', () => {
    sut.originalDate = new Date(2022, 6, 12);
    const result = sut.getDateIndex(new Date(2022, 6, 13));

    expect(result).toBe(1);
  });

  it('getDateIndex returns correct number of days between two dates if second date is in the past', () => {
    sut.originalDate = new Date(2022, 6, 12);
    const result = sut.getDateIndex(new Date(2022, 6, 10));

    expect(result).toBe(2);
  });

  it('getDateIndex throws an error if input passed is not of type Date', () => {
    sut.originalDate = new Date(2022, 6, 12);

    expect(() => sut.getDateIndex('bad input')).toThrow(TypeError);
  });

  it('getWord retrieves the correct word', () => {
    sut.words = ['women', 'men'];
    const result = sut.getWord(0);

    expect(result).toBe('women');
  });
});
