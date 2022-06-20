import { removeFromArray } from '../helpers/array-helper';

export class Game {
  constructor(wordPicker, randomString) {
    this.wordPicker = wordPicker;
    this.randomString = randomString;
    this.gameBoard = [[]];
    this.answer = '';
    this.rowLength = window.innerWidth >= 9000 ? 22 : 14;
    this.wordCount = 7;
    this.remainingGuesses = 4;
  }

  loadGame() {
    const dailyWords = this.getDailyWords();
    this.gameBoard = this.generateBoardArray(
      this.rowLength * dailyWords.length
    );

    this.insertDailyWordsToGameBoard(dailyWords);

    return this.gameBoard;
  }

  /**
   * Iterates through a string of `length` length and adds each individual character to a 2D array. When the current length of an inner array is >= the maximum row length, will create a new row.
   * @param {number} length The length of nonalphanumeric characters to generate - this should be equal to your row length * count of how many words will be inserted.
   * @returns {Array<Array>} A 2D array of non alphanumeric characters
   */
  generateBoardArray(length) {
    let string = this.randomString.generateRandomNonAlphaNumericString(length);

    let currentRowIndex = 0;
    let rowCharCount = 0;
    let board = [[]];
    for (var i = 0; i < string.length; i++) {
      board[currentRowIndex].push(string.charAt(i));
      rowCharCount++;

      if (rowCharCount >= this.rowLength) {
        board.push([]);
        rowCharCount = 0;
        currentRowIndex++;
      }
    }
    return board;
  }

  getDailyWords() {
    const dateIndex = this.wordPicker.getDateIndex(new Date());
    this.answer = this.wordPicker.getWord(dateIndex);

    let words = this.randomString.generateWordsFromIndex(
      this.wordCount,
      dateIndex
    );
    words.push(this.answer);

    return words;
  }

  insertDailyWordsToGameBoard(dailyWords) {
    this.gameBoard.forEach(row => {
      const word = dailyWords[Math.floor(Math.random() * dailyWords.length)];
      row[Math.floor(Math.random() * row.length)] = word;
      removeFromArray(dailyWords, word);
    });
  }

  checkGuess(guess) {
    if (this.answer.length !== guess.length) {
      throw Error('Guess and answer length do not match');
    }

    if (this.remainingGuesses <= 0) {
      return false;
    }

    this.remainingGuesses--;

    const guessLog = {
      guess: guess,
      likeness: 0,
      partial_likeness: 0,
    };

    // Store characters from answer found and their positions, as to not double count them
    const likenessCache = {};

    // Check whole guess for full likeness so it has priority
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === this.answer[i] && likenessCache[i] !== this.answer[i]) {
        guessLog.likeness++;
        likenessCache[i] = this.answer[i];
        continue;
      }
    }

    // Go back through guess for partial likeness
    for (let i = 0; i < guess.length; i++) {
      for (let x = 0; x < this.answer.length; x++) {
        if (
          guess[i] === this.answer[x] &&
          likenessCache[x] !== this.answer[x]
        ) {
          likenessCache[x] = this.answer[x];
          guessLog.partial_likeness++;
          break;
        }
      }
    }

    return guessLog;
  }
}
