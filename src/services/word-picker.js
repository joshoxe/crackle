import { words } from '../assets/words';

export class WordPicker {
  originalDate = new Date(2022, 5, 13, 12, 0, 0, 0);
  wordsList = [];

  constructor() {
    this.wordsList = words;
  }

  /**
   *
   * @param {Date} currentDate - Today's date.
   * @returns An integer number of the amount of days passed since 13/06/2022, used for indexing a word list.
   */
  getDateIndex(currentDate) {
    if (!(currentDate instanceof Date)) {
      throw TypeError(`${currentDate} is not of type Date`);
    }

    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((this.originalDate - currentDate) / oneDay));
  }

  /**
   * Retrieves a word from the word list
   * @param {number} index - Index of word to retrieve
   * @returns {string} A word
   */
  getWord(index) {
    return this.wordsList[index];
  }

  /**
   * Gets the next index available from the words list - loops if out of bounds
   * @param {number} index
   */
  getNextIndex(index) {
    const currentDay = new Date();
    index = index * 2 + currentDay.getDate();

    if (this.wordsList.length <= index) {
      const difference = index - this.wordsList.length;
      index = difference;
    }

    return index;
  }
}
