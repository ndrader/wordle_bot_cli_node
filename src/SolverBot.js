const fs = require("fs");

const text = fs.readFileSync("./list").toString('utf-8').split('\r\n');

const {getSuggestionFromList, filterListByGuess} = require('./cliSolver');

class SolverBot {
  constructor() {
    this.remainingList = [...text];
    this.suggestion = '';
  }

  updateListAfterGuess(pattern) {
    if(this.suggestion === '') return;
    this.remainingList = filterListByGuess(this.remainingList, {guess: this.suggestion, pattern});
  }

  getNextSuggestion() {
    this.suggestion = getSuggestionFromList(this.remainingList).word;
    return this.suggestion;
  }

}
module.exports = {
  SolverBot: SolverBot
};
