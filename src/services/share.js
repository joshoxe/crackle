import { Clipboard } from './clipboard';
import { StorageService } from './storage';
import { WordPicker } from './word-picker';

export class ShareService {
  constructor() {
    this.clipboard = new Clipboard();
    this.storageService = new StorageService();
    this.wordPicker = new WordPicker();
  }
  getEmoteLine(guessLog) {
    if (guessLog.likeness === 0 && guessLog.partial_likeness === 0) {
      return '\r\n';
    }

    let stringLine = '';

    for (let i = 0; i < guessLog.likeness; i++) {
      stringLine += '🟢';
    }

    for (let i = 0; i < guessLog.partial_likeness; i++) {
      stringLine += '🟡';
    }

    return stringLine + '\r\n';
  }

  getShareText(guessLogArray, countValue) {
    let shareText = `crackle ${countValue}/4\r\n\r\n`;
    guessLogArray.forEach(guessLog => {
      shareText += this.getEmoteLine(guessLog);
    });

    return shareText;
  }

  copyResult() {
    const state = this.storageService.getCurrentState();
    const guessLogArray = state.guessLog;
    const countValue =
      state.gameState !== 'IN_PROGRESS' ? guessLogArray.length : 'X';
    const text = this.getShareText(guessLogArray, countValue);
    this.clipboard.copy(text);
  }
}
