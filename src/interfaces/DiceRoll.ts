import Dice from '../Dice';

/**
 * An interface representing the result of a dice roll
 */
export interface DiceRoll {
  /** The result of the dice roll */
  total: number;

  /** The result of the roll for each dice without applying the modificator */
  diceValues: number[];

  /** The Dice rolled */
  dice: Dice;
}
