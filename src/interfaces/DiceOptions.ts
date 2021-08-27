/**
 * An interface representing the informations necessary to create a Dice
 */
export interface DiceOptions {
  /** The number of faces of the Dice */
  size: number;

  /** The number of dice */
  count?: number;

  /** The modificator to apply to the dice roll results */
  modificator?: number;
}
