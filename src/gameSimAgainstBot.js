const fs = require("fs");
const {WordleSim} = require("./WordleSim");
const {SolverBot} = require("./SolverBot");

const text = fs.readFileSync("./list").toString('utf-8').split('\r\n');

const gameSimAgainstBot = (list) => {
  let wins = 0;
  let losses = 0;
  let lostGameStats = [];

  list.forEach( word => {
    const wordleSim = new WordleSim(word);
    const solverBot = new SolverBot();

    while(!wordleSim.hasFinished){
      const guess = solverBot.getNextSuggestion();
      if(guess.length !== 5) {
        console.error("Suggested word not returned properly, exiting; guess: " + guess)
        process.exit(1);
      }
      const pattern = wordleSim.guess(guess);
      solverBot.updateListAfterGuess(pattern);
    }
    if(wordleSim.hasWon){
      wins++;
    } else {
      losses++;
      lostGameStats.push({remainingList: solverBot.remainingList, startWord: word, guesses: wordleSim.guesses, patterns: wordleSim.patterns})
    }
  });

  console.log("Wins: " + wins + " Losses: " + losses + " Out of: " + list.length);
  console.log("Lost game stats: ");
  console.log(lostGameStats)
}

const cleanList = (list) => list.filter(word => word.length === 5)

const cleanedList = cleanList(text);
gameSimAgainstBot(cleanedList);