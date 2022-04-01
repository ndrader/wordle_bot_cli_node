# cli wordle bot

Using the list of all possible solutions this simple bot reduces the list based on your guesses.

not optimized, was a messy first pass at getting the code to work and do what it needs to do
is fast enough when running locally

## To run

`npm i`
`node index.js`

## Entering a guess

enter the word you played (lowercase)
enter the pattern that was returned in order (lowercase)
    - g for Green
    - x for Grey
    - y for Yellow

example: 
```
word: arose
pattern: xxgyx
```

If a suggestion given by the program is not accepted by Wordle, enter pattern 'eeeee' to see the next suggestion and remove it from the dictionary.

## Apr 1 - nytimes

Wordle 286 3/6

⬛⬛🟩🟨⬛

🟩⬛🟩🟩🟩

🟩🟩🟩🟩🟩
