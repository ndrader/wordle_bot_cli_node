var fs = require("fs");

var text = fs.readFileSync("./list").toString('utf-8').split('\n');

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
    for(const [key, value] of Object.entries(reduceWord(item))) {
        sum += numListObj[key];
    }
    return sum;
}

const getMaxWeighted = (list) => list.reduce( (max, obj) => (max.weight > obj.weight) ? max : obj );

const getSuggestions = (list, numList, numListObj, depth = 0) => {
    if(depth === 0 && list.length === 1) return list[0];
    if(depth === 5) return list;
    if(list.length === 1) return list;
    const newList = list.filter(item => item.word.includes(numList[depth][0]));
    if(newList.length < 2) return list;
    const unweightedSuggestions = getSuggestions(newList, numList, numListObj, depth + 1);
    if (depth > 0) return unweightedSuggestions;

    if (unweightedSuggestions.length > 1) {
        const weightedSuggestions = unweightedSuggestions.map(item => ({ ...item, weight: getWeight(item, numListObj)  }));
        return getMaxWeighted(weightedSuggestions);
    }
    return unweightedSuggestions[0];
}

const getSuggestionFromList = (list) => {
    const countedList = getCharCountList(list);
    const sumListObj = getLetterFrequency(countedList);
    const sumList = getSortedNumList(sumListObj);
    const suggestion = getSuggestions(countedList, sumList, sumListObj);
    return suggestion;
}

const prompt = require('prompt-sync')({ sigint: true});

const getGuessAndPattern = () => {
    let guess = "";
    while(typeof guess !== 'string' && !(guess instanceof String) || guess.length !== 5 || !/^[a-z]+$/i.test(guess)){
        guess = prompt('What was your guess? ');
    }
    let pattern = "";
    while(typeof pattern !== 'string' && !(pattern instanceof String) || pattern.length !== 5 || !/^[gxy]+$/i.test(pattern)){
        pattern = prompt('What was the pattern g - green, y - yellow, x - grey, ex: ggxyx? ');
    }
    return { guess, pattern };
}

const filterListByGuess = (list, guess) => {
    let temp = [ ...list ];
    let newTemp = [];
    for(i = 0; i < 5; i++){
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
            default: {
                console.error('Error in filterListByGuess, exiting');
                process.exit(9);
            }
        }
        temp = [ ...newTemp ];
    }
    return temp;
}

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
        console.log("Remaining Possilbe Words: " + newList.length);
        tempList = [...newList]
    }
}

game(text);
