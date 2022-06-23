import { removeFromArray } from '../helpers/array-helper';

export class Game {
  constructor(wordPicker, randomString) {
    this.wordPicker = wordPicker;
    this.randomString = randomString;
    this.gameBoard = [[]];
    this.answer = '';
    this.rowLength = 14;
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

  /**
   * Checks a guess against the answer to find the `likeness` and `partial likeness` of the guess.
   * A guess with 5 `likeness` is equal to the answer. The check code stores characters found as it goes
   * to make sure it doesn't count characters more than once.
   * @param {string} guess - A string of length equal to the answer to check against
   * @returns {(object|boolean)} - A guess log object containing the likenesses found, or false if no remaining guesses
   */
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

    // Check off characters found in answer and guess by storing them, as to not double count them
    const guessCharsFound = {};
    const answerCharsFound = {};

    // Check whole guess for full likeness so it has priority
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === this.answer[i]) {
        if (i in guessCharsFound) {
          continue;
        }

        guessLog.likeness++;
        guessCharsFound[i] = guess[i];
        answerCharsFound[i] = this.answer[i];
        continue;
      }
    }

    // Go back through guess for partial likeness
    for (let i = 0; i < guess.length; i++) {
      if (i in guessCharsFound) {
        continue;
      }

      for (let x = 0; x < this.answer.length; x++) {
        if (x in answerCharsFound) {
          continue;
        }

        if (guess[i] === this.answer[x]) {
          guessCharsFound[i] = guess[i];
          answerCharsFound[x] = this.answer[x];
          guessLog.partial_likeness++;
          break;
        }
      }
    }

    return guessLog;
  }
}
