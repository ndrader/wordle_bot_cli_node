const fs = require("fs");

const text = fs.readFileSync("./list").toString('utf-8').split('\n');
const { getSuggestionFromList, getGuessAndPattern, filterListByGuess } = require('./cliSolver');

const writeNewList = (list) =>  {
  try {
    fs.writeFileSync('./list', list.join('\n'))
  } catch (err) {
    console.error(err)
  }
}

const removeWord = (list, word) => {
  const index = list.indexOf(word);
  if (index !== -1) {
    list.splice(index, 1);
  }
  writeNewList(list);
  return list;
}

const addWord = (list) => {
  const newWord = getNewWord();
  list.push(newWord);
  list.sort();
  writeNewList(list);
  console.log("New word added to dictionary: " + newWord);
}

const getNewWord = () => {
  let word = "";
  while(typeof word !== 'string' && !(word instanceof String) || word.length !== 5 || !/^[a-z]+$/i.test(word)){
    word = prompt('Enter your solution to add to dictionary: ');
  }
  return word;
}

const game = (list) => {
  console.log("Welcome to Wordle Bot!")

  console.log("First Guess Suggestion: " + getSuggestionFromList(list).word);
  console.log("Remaining Possible Words: " + list.length);

  let tempList = [...list]
  for(let k = 0; k < 6; k++){
    const guess = getGuessAndPattern();
    console.log("Guess: " + guess.guess, " Pattern: " + guess.pattern );
    if(guess.pattern === 'eeeee') {
      console.log('I guess we outsmarted Wordle if they dont even know ' + guess.guess);
      console.log('Removing ' + guess.guess + ' from dictionary...');
      list = removeWord(list, guess.guess);
    }
    if(guess.pattern === 'ggggg') {
      console.log('Congrats you won!');
      return;
    }
    const newList = filterListByGuess(tempList, guess);
    if(newList.length === 0){
      console.log("No solutions left! Looks like we're missing some words...🤷");
      addWord(list);
      return;
    }
    console.log("Guess Suggestion: " + getSuggestionFromList(newList).word);
    console.log("Remaining Possible Words: " + newList.length);
    tempList = [...newList]
  }
}

game(text);
