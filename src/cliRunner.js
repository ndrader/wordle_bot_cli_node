const fs = require("fs");

const text = fs.readFileSync("./list").toString('utf-8').split('\n');
const { getSuggestionFromList, getGuessAndPattern, filterListByGuess } = require('./cliSolver');

const game = (list) => {
  console.log("Welcome to Wordle Bot!")

  console.log("First Guess Suggestion: " + getSuggestionFromList(list).word);
  console.log("Remaining Possible Words: " + list.length);

  let tempList = [...list]
  for(let k = 0; k < 6; k++){
    const guess = getGuessAndPattern();
    console.log("Guess: " + guess.guess, " Pattern: " + guess.pattern );
    if(guess.pattern === 'ggggg') {
      console.log('Congrats you won!');
      return;
    }
    const newList = filterListByGuess(tempList, guess);
    console.log("Guess Suggestion: " + getSuggestionFromList(newList).word);
    console.log("Remaining Possible Words: " + newList.length);
    tempList = [...newList]
  }
}

game(text);
