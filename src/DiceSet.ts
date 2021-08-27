import { DiceSetOptions } from './interfaces/DiceSetOptions';
import { DiceOptions } from './interfaces/DiceOptions';
import { DiceSetRoll } from './interfaces/DiceSetRoll';

import Dice from './Dice';

/**
 * Class that represents a set of different dices of different types.
 */
export default class DiceSet {
  /**
   * The dices that compose the set.
   * @member {number} dices
   * @private
   */
  private mDices: Dice[];

  /**
   * Create a DiceSet given a pattern or options describing the set.
   * @param {DiceSetOptions|string} options either a DiceSetoptions object or a string representing
   * a set of dice
   * @throws {Error} if options is a string but does not match the DiceRegex for each dice or if
   * options is a DiceSetOptions contains neither dices nor diceOptions or size < 2 or count < 1 for
   * at least 1 dice.
   */
  constructor(options: DiceSetOptions | string) {
    this.mDices = [];
    if (typeof options === 'string') {
      this.parse(options);
      return;
    }

    if (options.dices?.length) {
      this.mDices.push(...options.dices);
    }

    if (options.diceOptions?.length) {
      this.mDices.push(...options.diceOptions.map((opt: DiceOptions): Dice => new Dice(opt)));
    }

    if (this.mDices.length === 0) {
      throw new Error('Cannot instantiate empty DiceSet');
    }
  }

  /**
   * Get the minimum value possible for this DiceSet
   * @return The minimum value possible for this DiceSet
   */
  public get min(): number {
    return this.mDices.reduce((total: number, current: Dice): number => total + current.min, 0);
  }

  /**
   * Get the maximum value possible for this DiceSet
   * @return The maximum value possible for this DiceSet
   */
  public get max(): number {
    return this.mDices.reduce((total: number, current: Dice): number => total + current.max, 0);
  }

  /**
   * Get the number of possible combinations for this DiceSet.
   * @return The number of possible combinations for this DiceSet.
   */
  public get cardinal() {
    return this.mDices.reduce(
      (total: number, current: Dice): number => total * current.cardinal,
      1,
    );
  }

  /**
   * Get the number of possible values for this DiceSet.
   * @return The number of possible values for this DiceSet.
   */
  public get valuesCardinal() {
    return this.max - this.min + 1;
  }

  /**
   * Get a string representing the set as Dice patterns separated by ' ' (space character).
   * @returns a string representing the set as Dice patterns separated by ' ' (space character).
   */
  public toString(): string {
    return this.mDices.map((dice: Dice): string => dice.toString()).join(' ');
  }

  /**
   * Parse a set of Dice patterns separated by a space character (' ') to hydrate the DiceSet
   * @param {string} pattern A set of Dice patterns separated by a space character (' ')
   * @returns {DiceSet} this
   * @private
   */
  private parse(pattern: string): this {
    this.mDices.push(...pattern.split(' ').map((diceStr: string): Dice => new Dice(diceStr)));
    return this;
  }

  /**
   * Roll the dice set and return a DiceSetRoll object representing the result.
   * The DiceSetRoll object contains:
   * {
   *   total: random number in range [7, 19],
   *   diceRolls: an array containing the rolls result for each dice
   * }
   * @returns {DiceSetRoll} The result of the dice set roll.
   */
  public roll(): DiceSetRoll {
    return this.mDices.reduce<DiceSetRoll>(
      (totalRoll: DiceSetRoll, current: Dice): DiceSetRoll => {
        const currentRoll = current.roll();
        const result = totalRoll;
        result.total += currentRoll.total;
        result.diceRolls.push(currentRoll);
        return result;
      },
      { total: 0, diceRolls: [] },
    );
  }

  /**
   * Get an infinite iterable generator that roll the dice set on each iteration.
   * @returns {Generator<DiceRoll, never, never>} A generator that roll the dice set on each
   * iteration.
   * The generator never ends and does not take any arguments.
   */
  public *generator(): Generator<DiceSetRoll, never, never> {
    while (true) {
      yield this.roll();
    }
  }
}
