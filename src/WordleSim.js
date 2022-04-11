// driver
// - takes start word from param, so we can test results
// - takes in guess
// - outputs result pattern of guess and game end flag

// fully automated use case so no input validators needed

class WordleSim {
  constructor(startWord) {
    this.startWord = startWord;
    this.guesses = [];
    this.patterns = [];
    this.hasFinished = false;
    this.hasWon = false;
  }

  guess(guessWord) {
    this.guesses.push(guessWord);
    let guessPattern = [];
    for(let i = 0; i < 5; i++){
      if(guessWord[i] === this.startWord[i]){
        guessPattern.push('g');
        continue;
      }
      if(this.startWord.includes(guessWord[i])){
        guessPattern.push('y');
        continue;
      }
      guessPattern.push('x');
    }
    const pattern = guessPattern.join('');
    this.patterns.push(pattern);
    this.checkWin(pattern);
    return pattern;
  }

  checkWin(pattern){
    this.hasWon = !(pattern.includes('x') || pattern.includes('y'));
    this.hasFinished = this.hasWon || this.guesses.length === 6;
  }

}
module.exports = {
  WordleSim: WordleSim
};
