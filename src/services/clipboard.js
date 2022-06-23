/**
 * Generic clipboard functionality
 */
export class Clipboard {
  constructor() {
    // this.clipboard = navigator.clipboard;
  }

  copy(text) {
    try {
      console.log(`Trying to write ${text} to clipboard`);
      navigator.clipboard.writeText(text);
    } catch (err) {
      // TODO: Add a message to the toast service?
      console.error(`Unable to copy to clipboard: ${err}`);
    }
  }
}
