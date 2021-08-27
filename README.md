# Dice

A dice system for D&amp;D and other dice games

## Install

### using npm

`npm install @fdw/dice`

### using yarn

`yarn add @fdw/dice`

## Dice notation

A dice in D&D can be represented as a string. This string starts with the number of dice (technically the string represent a roll of several dice of the same size) followed by the letter 'd' and the number of faces of the dice:

> '2d6' represents 2 dices of 6 faces

A dice can also have a modificator value (positive or negative) that influences the result of the roll:

> '1d8+3' representents 1 dice of 8 faces plus 3 (the values will be in range [4, 11])

You sometimes may need to roll different types of dices. In this case each dice pattern is separated from the next one with ' ' (<kbd>space</kbd> character):

> '2d8+3 1d4' represents 2 dices of 8 faces plus 3 and 1 dice of 4 faces

## How it works

If you need to roll a single dice type you can use the Dice class:

```
const Dice = require('dice/Dice');

// create a Dice from a string
const d1 = new Dice('4d4+3');

/* log a DiceRoll object containing:
{
  total: random number in range [d1.min, d1.max],
  diceValues: an array containing the roll value for each dice,
  dice: the dice rolled
}
*/
console.log(d1.roll());

const d2 = new Dice({
  size: 6,
  count: 2, // count is optional, default value is 1
  modificator: 3 // modificator is optional, default value is 0
}); // equivalent to new Dice('2d6+3')

const gen = d2.generator() // create a generator for the dice

console.log(gen.next().value) // same as d2.roll() but the generator is iterable

```

Dice also provide information to allow probability analysis:

```
const d = new Dice('2d6+3');

console.log(d.min); // the smallest value possible with this dice (i.e. 5 for this dice)

console.log(d.max); // the greatest value possible with this dice (i.e. 15 for this dice)

console.log(d.cardinal); // the number of possible combinations (i.e. size<sup>count</sup>)

console.log(d.valuesCardinal); // the number of possible values (i.e. max - min + 1)

```

_Dice_ is inmutable, it means you cannot modify size, count or modificator once the Dice is instantiated.
