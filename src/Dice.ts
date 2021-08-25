import { DiceOptions } from './interfaces/DiceOptions';
import { DiceRoll } from './interfaces/DiceRoll';
import math from './math';

/**
 * Class that represents a dice type. It technically does not represent one dice it is more a dice
 * pattern (e.g. 2d6+3), it represents several dices of the same type with an unique modifier.
 */
export default class Dice {
  /**
   * The number of faces of the dice.
   * @member {number} mSize
   * @private
   */
  private mSize: number = 2;

  /**
   * The number of dices.
   * @member {number} [mCount = 1]
   * @private
   */
  private mCount: number = 1;

  /**
   * The value applied to the roll total.
   * @member {number} [mModificator = 0]
   * @private
   */
  private mModificator: number = 0;

  /**
   * Regular expression to match dice patterns.
   * @member {RegExp} DiceRegex
   * @static
   * @readonly
   */
  static readonly DiceRegex = /^([1-9]\d*)d([1-9]\d*)(?:(\+|-)([1-9]\d*))?$/i;

  /**
   * Create a Dice given a pattern or options describing the dice.
   * @param {DiceOptions | string} options either a DiceOptions object or a string representing a
   * dice pattern.
   * @param {number} options.size the number of faces of the dice if options is a DiceObject.
   * @param {number} [options.count = 1] the number of dice if options is a DiceObject.
   * @param {number} [options.modificator = 0] the modificator of the dice if options is a
   * DiceObject.
   * @throws {Error} if options is a string but does not match the DiceRegex or if options is a
   * DiceOptions and size < 2 or count < 1.
   */
  constructor(options: DiceOptions | string) {
    if (typeof options === 'string') {
      this.parse(options);
      return;
    }

    this.size = options.size;
    this.count = options.count ?? 1;
    this.mModificator = options.modificator ?? 0;
  }

  /**
   * Get the number of faces of the dice.
   * @return The number of faces of the dice.
   */
  public get size(): number {
    return this.mSize;
  }

  /**
   * Set the number of faces of the dice.
   * @param {number} value the number of face you want to set to the dice
   * @private
   * @throws {Error} if value < 2
   */
  private set size(value: number) {
    if (value < 2) {
      throw new Error(`Dice size must be greater or equal to 2 (received ${value})`);
    }

    this.mSize = value;
  }

  /**
   * Get the number of dice.
   * @return The number of dice.
   */
  public get count(): number {
    return this.mCount;
  }

  /**
   * Set the number of dice.
   * @param {number} value the number you want to set
   * @private
   * @throws {Error} if value < 1
   */
  private set count(value: number) {
    if (value < 1) {
      throw new Error(`Dice count must be greater or equal to 1 (received ${value})`);
    }

    this.mCount = value;
  }

  /**
   * Get the modificator value of the dice.
   * @return The modificator value of the dice.
   */
  public get modificator() {
    return this.mModificator;
  }

  /**
   * Get the minimum value possible for this Dice.
   * @return The minimum value possible for this Dice.
   */
  public get min(): number {
    return this.count + this.modificator;
  }

  /**
   * Get the maximum value possible for this Dice.
   * @return The maximum value possible for this Dice.
   */
  public get max(): number {
    return this.count * this.size + this.modificator;
  }

  /**
   * Get the number of possible combinations for this Dice.
   * @return The number of possible combinations for this Dice.
   */
  public get cardinal(): number {
    return this.size ** this.count;
  }

  /**
   * Get the number of possible values for this Dice.
   * @return The number of possible values for this Dice.
   */
  public get valuesCardinal(): number {
    return this.max - this.min + 1;
  }

  /**
   * Get the dice as a string (i.e the pattern representing the dice).
   * @returns The dice as a string (i.e the pattern representing the dice).
   */
  public toString(): string {
    return `${this.count}d${this.size}${this.getModificatorString()}`;
  }

  /**
   * Roll the dice and return a DiceRoll object representing the result.
   * The DiceRoll object contains:
   * {
   *   total: random number in range [this.min, this.max],
   *   diceValues: an array containing the roll value for each dice,
   *   dice: the dice rolled
   * }
   * @returns {DiceRoll} The result of the dice roll.
   */
  public roll(): DiceRoll {
    const result = {
      total: this.modificator,
      diceValues: [] as number[],
      dice: this,
    };

    for (let i = 0; i < this.count; ++i) {
      const current = math.randomInt(1, this.size);
      result.total += current;
      result.diceValues.push(current);
    }

    return result;
  }

  /**
   * Get an infinite iterable generator that roll the dice on each iteration.
   * @returns {Generator<DiceRoll, never, never>} A generator that roll the dice on each iteration.
   * The generator never ends and does not take any arguments.
   */
  public *generator(): Generator<DiceRoll, never, never> {
    while (true) {
      yield this.roll();
    }
  }

  /**
   * Get a string representing the modificator
   * @returns {string} A string representing the modificator.
   * @private
   */
  private getModificatorString(): string {
    if (this.modificator > 0) {
      return `+${this.modificator}`;
    }

    if (this.modificator < 0) {
      return `${this.modificator}`;
    }

    return '';
  }

  /**
   * Parse a pattern to hydrate the Dice.
   * @param  {string} pattern The pattern to parse.
   * @returns {Dice} this
   * @private
   */
  private parse(pattern: string): this {
    const diceInfo = pattern.match(Dice.DiceRegex);
    if (diceInfo === null) {
      throw new Error(
        `'${pattern}' does not match the dice string format 'xdy[(+|-)w]' (examples: '1d6', '2d8+4', '1d20-2')`,
      );
    }

    this.count = Number.parseInt(diceInfo[1], 10);
    this.size = Number.parseInt(diceInfo[2], 10);

    if (diceInfo[3] && diceInfo[4]) {
      this.mModificator = Number.parseInt(diceInfo[4], 10) * (diceInfo[3] === '+' ? 1 : -1);
    } else {
      this.mModificator = 0;
    }

    return this;
  }
}
