import { describe, jest, it, expect } from '@jest/globals';

import Dice from './Dice';
import DiceSet from './DiceSet';

let randomIntCounter = 0;

function resetCounter() {
  randomIntCounter = 0;
}

jest.mock('./math', () => ({
  randomInt: (min: number, max: number) => {
    const size = max - min;
    const value = randomIntCounter % (size + 1);

    ++randomIntCounter;
    return min + value;
  },
}));

describe('DiceSet', () => {
  describe('constructor', () => {
    it('should throw an error if the string is not a valid pattern', () => {
      expect(() => new DiceSet('')).toThrow();
      expect(() => new DiceSet('1b2')).toThrow();
      expect(() => new DiceSet('0d2')).toThrow();
      expect(() => new DiceSet('1d1')).toThrow();
      expect(() => new DiceSet('1d6a')).toThrow();
      expect(() => new DiceSet('1d+b')).toThrow();
    });

    it('should instantiate a dice set from a valid pattern', () => {
      expect(() => new DiceSet('1d6')).not.toThrow();
      expect(() => new DiceSet('1d6 2d8')).not.toThrow();
      expect(() => new DiceSet('1d6 2d8 4d4+1')).not.toThrow();
    });

    it('should instantiate a dice set from valid options', () => {
      expect(() => new DiceSet({ dices: [new Dice('1d6'), new Dice('2d8+4')] })).not.toThrow();
      expect(
        () => new DiceSet({ diceOptions: [{ size: 6 }, { size: 8, count: 2, modificator: 4 }] }),
      ).not.toThrow();
      expect(
        () =>
          new DiceSet({
            dices: [new Dice('1d6'), new Dice('2d8+4')],
            diceOptions: [{ size: 6 }, { size: 8, count: 2, modificator: 4 }],
          }),
      ).not.toThrow();
    });

    it('should throw an error if options contains 0 dices and 0 dice options', () => {
      expect(() => new DiceSet({})).toThrow();
      expect(() => new DiceSet({ dices: [] })).toThrow();
      expect(() => new DiceSet({ diceOptions: [] })).toThrow();
      expect(() => new DiceSet({ dices: [], diceOptions: [] })).toThrow();
    });
  });

  describe('getters', () => {
    const d = new DiceSet('2d6+3 1d4');
    it('should return 6 as the min value of the dice set', () => {
      expect(d.min).toBe(6);
    });

    it('should return 15 as the max value of the dice', () => {
      expect(d.max).toBe(19);
    });

    it('should return 36 as the cardinality of the dice', () => {
      expect(d.cardinal).toBe(144);
    });

    it('should return 11 as the values cardinality of the dice', () => {
      expect(d.valuesCardinal).toBe(14);
    });
  });

  describe('a DiceSet string', () => {
    it('should be equal to the pattern used to create the same dice set', () => {
      expect(new DiceSet('1d4').toString()).toEqual('1d4');
      expect(new DiceSet('1d8+3 2d8+3').toString()).toEqual('1d8+3 2d8+3');
      expect(new DiceSet('3d6-3 2d6-9').toString()).toEqual('3d6-3 2d6-9');
    });
  });

  describe('a DiceSet roll', () => {
    it('should return the expected mocked value', () => {
      resetCounter();

      let d = new DiceSet('2d6+3');
      let rollResult = d.roll();

      expect(rollResult.total).toBe(6);

      rollResult = d.roll();

      expect(rollResult.total).toBe(10);

      resetCounter();
      d = new DiceSet('2d6+3 2d8');
      rollResult = d.roll();
      expect(rollResult.total).toBe(13);

      rollResult = d.roll();
      expect(rollResult.total).toBe(5 + 6 + 3 + 7 + 8);
    });
  });

  describe('a DiceSet generator', () => {
    it('should return the expected mocked value', () => {
      resetCounter();

      let d = new DiceSet('2d6+3');
      let gen = d.generator();
      let rollResult = d.roll();

      expect(rollResult.total).toBe(6);

      rollResult = gen.next().value;

      expect(rollResult.total).toBe(10);

      resetCounter();
      d = new DiceSet('2d6+3 2d8');
      gen = d.generator();

      rollResult = gen.next().value;

      expect(rollResult.total).toBe(13);

      rollResult = gen.next().value;

      expect(rollResult.total).toBe(5 + 6 + 3 + 7 + 8);
    });
  });
});
