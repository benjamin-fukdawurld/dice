import { DiceRoll } from './DiceRoll';

/**
 * An interface representing the result of a dice set roll
 */
export interface DiceSetRoll {
  /** The result of the dice set roll */
  total: number;

  /** The result of each dice roll */
  diceRolls: DiceRoll[];
}
