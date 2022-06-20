export class StorageService {
  constructor() {
    this.statisticsStoreName = 'crackleStats';
    this.currentStateStoreName = 'crackleCurrentState';
  }

  createLocalStatistics() {
    if (!localStorage.crackleStats) {
      const gameStats = {
        gamesPlayed: 0,
        winPercentage: 0,
        currentStreak: 0,
        maxStreak: 0,
        guesses: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          fail: 0,
        },
      };

      this.saveStatistics(gameStats);
    }
  }

  getLocalStatistics() {
    if (!localStorage.crackleStats) {
      this.createLocalStatistics();
    }

    return JSON.parse(localStorage.getItem(this.statisticsStoreName));
  }

  saveStatistics(gameStats) {
    localStorage.setItem(this.statisticsStoreName, JSON.stringify(gameStats));
  }

  saveState(state) {
    localStorage.setItem(this.currentStateStoreName, JSON.stringify(state));
  }

  calculateWinPercentage(gameStats) {
    return (
      ((gameStats.guesses[1] +
        gameStats.guesses[2] +
        gameStats.guesses[3] +
        gameStats.guesses[4]) /
        gameStats.gamesPlayed) *
      100
    );
  }

  recordGamePlayed(numOfGuesses, win) {
    const gameStats = this.getLocalStatistics();

    gameStats.gamesPlayed++;

    if (!win) {
      gameStats.currentStreak = 0;
      gameStats.guesses['fail']++;
      gameStats.winPercentage = this.calculateWinPercentage(gameStats);
      this.saveStatistics(gameStats);
      return;
    }

    gameStats.guesses[numOfGuesses]++;
    gameStats.currentStreak++;

    if (gameStats.currentStreak > gameStats.maxStreak) {
      gameStats.maxStreak = gameStats.currentStreak;
    }

    gameStats.winPercentage = this.calculateWinPercentage(gameStats);
    this.saveStatistics(gameStats);
    return;
  }

  saveCurrentState(guessLog, gameState) {
    const state = {
      guessLog: guessLog,
      gameState: gameState,
      lastPlayedTime: new Date(),
    };

    this.saveState(state);
  }

  getCurrentState() {
    if (!localStorage.getItem(this.currentStateStoreName)) {
      return false;
    }

    return JSON.parse(localStorage.getItem(this.currentStateStoreName));
  }

  resetCurrentState() {
    localStorage.removeItem(this.currentStateStoreName);
  }
}
