# cli wordle bot

Using the list of all possible solutions this simple bot reduces the list based on your guesses.

not optimized, was a messy first pass at getting the code to work and do what it needs to do
is fast enough when running locally

## To run solver

`npm i`
`npm start`

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

## Bot vs a Sim of Wordle

Wins: 2290 Losses: 25 Out of: 2315

The lost games came down to equally weighted list of words at which point it is just random guessing to hope to win.

Full results of lost games can be found in resultsAgainstFullList

## Apr 1 - nytimes

Wordle 286 3/6

⬛⬛🟩🟨⬛

🟩⬛🟩🟩🟩

🟩🟩🟩🟩🟩
