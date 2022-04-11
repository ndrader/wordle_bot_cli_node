
const getCharCount = (word) => [...word].reduce((a, e) => { a[e] = a[e] ? a[e] + 1 : 1; return a }, {}); 

const getCharCountList = (list) => list.map(item => ({ word: item, ...getCharCount(item) }));

const reduceWord = ({ ['word']: deletedKey, ...others}) => others;

const sortFunction = (a, b) => {
  if(a[1] === b[1]) return 0;
  return (a[1] < b[1]) ? 1 : -1
}

const getLetterFrequency = (list) => {
  const result = {};
  list.forEach(item => {
    const reducedItem = reduceWord(item);
      for (const [key, value] of Object.entries(reducedItem)) {
      result[key] = (result[key] || 0) + value;
    }
  });
  
  return result
}

const getSortedNumList = (list) => Object.entries(list).sort(sortFunction);

const getWeight = (item, numListObj) => {
  let sum = 0;
  for(const [key] of Object.entries(reduceWord(item))) {
    sum += numListObj[key];
  }
  return sum;
}

const getMaxWeighted = (list) => list.reduce( (max, obj) => (max.weight > obj.weight) ? max : obj );

const getSuggestions = (list, numList, numListObj, depth = 0) => {
  if(depth === 0 && list.length === 1) return list[0];
  if(depth === 5 || (depth === numList.length && depth !== 0)) return list;
  if(list.length === 1) return list;
  const newList = list.filter(item => item.word.includes(numList[depth][0]));
  if(newList.length < 2 && depth !== 0) return list;
  const unweightedSuggestions = getSuggestions(newList, numList, numListObj, depth + 1);
  if (depth > 0) return unweightedSuggestions;

  if (unweightedSuggestions.length > 1) {
    const weightedSuggestions = unweightedSuggestions.map(item => ({ ...item, weight: getWeight(item, numListObj) }));
    return getMaxWeighted(weightedSuggestions);
  }
  return unweightedSuggestions[0];
}

const getSuggestionFromList = (list) => {
  const countedList = getCharCountList(list);
  const sumListObj = getLetterFrequency(countedList);
  const sumList = getSortedNumList(sumListObj);
  return getSuggestions(countedList, sumList, sumListObj);
}

const prompt = require('prompt-sync')({ sigint: true});

const getGuessAndPattern = () => {
  let guess = "";
  while(typeof guess !== 'string' && !(guess instanceof String) || guess.length !== 5 || !/^[a-z]+$/i.test(guess)){
    guess = prompt('What was your guess? ');
  }
  let pattern = "";
  while(typeof pattern !== 'string' && !(pattern instanceof String) || pattern.length !== 5 || !/^[egxy]+$/i.test(pattern)){
    pattern = prompt('What was the pattern g - green, y - yellow, x - grey, eeeee - word unknown ex: ggxyx? ');
  }
  return { guess, pattern };
}

const filterListByGuess = (list, guess) => {
  let temp = [ ...list ];
  let newTemp = [];
  for(let i = 0; i < 5; i++){
    switch(guess.pattern[i]) {
      case 'g': {
        newTemp = temp.filter(item => item[i] === guess.guess[i]);
        break;
      }
      case 'x': {
        newTemp = temp.filter(item => !item.includes(guess.guess[i]));
        break;
      }
      case 'y': {
        newTemp = temp.filter(item => item.includes(guess.guess[i]) && item[i] !== guess.guess[i]);
        break;
      }
      case 'e': {
        newTemp = temp.filter(item => item !== guess.guess);
        break;
      }
      default: {
        console.error('Error in filterListByGuess, exiting; pattern: ' + guess.pattern);
        process.exit(9);
      }
    }
    temp = [ ...newTemp ];
  }
  return temp;
}

module.exports = {
  getGuessAndPattern: getGuessAndPattern,
  filterListByGuess: filterListByGuess,
  getSuggestionFromList: getSuggestionFromList
};