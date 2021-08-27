import Dice from '../Dice';
import { DiceOptions } from './DiceOptions';

/**
 * An interface representing the informations necessary to create a DiceSet
 */
export interface DiceSetOptions {
  /** An array of dices to add to the set */
  dices?: Dice[];

  /** An array of options to create dices for the set */
  diceOptions?: DiceOptions[];
}
