import { WordPicker } from './word-picker';

export class RandomString {
  generateRandomNonAlphaNumericString(length) {
    const nonAlphaNumerics = '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';

    let result = '';
    for (var i = 0; i < length; i++) {
      result +=
        nonAlphaNumerics[Math.floor(Math.random() * nonAlphaNumerics.length)];
    }

    return result;
  }

  generateWordsFromIndex(count, initialIndex) {
    const wordPicker = new WordPicker();
    const words = [];
    let index = initialIndex;
    for (var i = 0; i < count; i++) {
      index = wordPicker.getNextIndex(index);
      words.push(wordPicker.getWord(index));
    }

    return words;
  }
}
