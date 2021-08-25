import Dice from './Dice';

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

describe('Dice', () => {
  describe('contructor', () => {
    it('should throw an error if the string is not a valid pattern', () => {
      expect(() => new Dice('')).toThrow(
        "'' does not match the dice string format 'xdy[(+|-)w]' (examples: '1d6', '2d8+4', '1d20-2')",
      );

      expect(() => new Dice('1b6')).toThrow(
        "'1b6' does not match the dice string format 'xdy[(+|-)w]' (examples: '1d6', '2d8+4', '1d20-2')",
      );

      expect(() => new Dice('0d6')).toThrow(
        "'0d6' does not match the dice string format 'xdy[(+|-)w]' (examples: '1d6', '2d8+4', '1d20-2')",
      );

      expect(() => new Dice('1d0')).toThrow(
        "'1d0' does not match the dice string format 'xdy[(+|-)w]' (examples: '1d6', '2d8+4', '1d20-2')",
      );

      expect(() => new Dice('1d6+0')).toThrow(
        "'1d6+0' does not match the dice string format 'xdy[(+|-)w]' (examples: '1d6', '2d8+4', '1d20-2')",
      );
    });

    it('should instantiate a Dice from a valid pattern', () => {
      let d = new Dice('1d6');
      expect(d.size).toBe(6);
      expect(d.count).toBe(1);
      expect(d.modificator).toBe(0);

      d = new Dice('2d8+2');
      expect(d.size).toBe(8);
      expect(d.count).toBe(2);
      expect(d.modificator).toBe(2);

      d = new Dice('3d8-2');
      expect(d.size).toBe(8);
      expect(d.count).toBe(3);
      expect(d.modificator).toBe(-2);
    });

    it('shoud instantiate a Dice from Dice Options', () => {
      let d = new Dice({ size: 6 });
      expect(d.size).toBe(6);
      expect(d.count).toBe(1);
      expect(d.modificator).toBe(0);

      d = new Dice({ size: 8, count: 2, modificator: -1 });
      expect(d.size).toBe(8);
      expect(d.count).toBe(2);
      expect(d.modificator).toBe(-1);
    });

    it('shoud throw an error if the number of faces is less than 2', () => {
      expect(() => new Dice('1d1')).toThrow();
      expect(() => new Dice({ size: 1 })).toThrow();
      expect(() => new Dice({ size: -6 })).toThrow();
    });

    it('shoud throw an error if the number of dices is less than 1', () => {
      expect(() => new Dice('0d1')).toThrow();
      expect(() => new Dice({ size: 6, count: 0 })).toThrow();
      expect(() => new Dice({ size: 6, count: -6 })).toThrow();
    });
  });

  describe('getters', () => {
    const d = new Dice('2d6+3');
    it('should return 5 as the min value of the dice', () => {
      expect(d.min).toBe(5);
    });

    it('should return 15 as the max value of the dice', () => {
      expect(d.max).toBe(15);
    });

    it('should return 36 as the cardinality of the dice', () => {
      expect(d.cardinal).toBe(36);
    });

    it('should return 11 as the values cardinality of the dice', () => {
      expect(d.valuesCardinal).toBe(11);
    });
  });

  describe('a Dice string', () => {
    it('should be equal to the pattern used to create the same dice', () => {
      expect(new Dice('1d4').toString()).toEqual('1d4');
      expect(new Dice('1d8+3').toString()).toEqual('1d8+3');
      expect(new Dice('3d6-3').toString()).toEqual('3d6-3');
    });
  });

  describe('a Dice roll', () => {
    it('should return the expected mocked value', () => {
      resetCounter();

      const d = new Dice('2d6+3');
      let rollResult = d.roll();

      expect(rollResult.diceValues).toEqual([1, 2]);
      expect(rollResult.total).toBe(6);

      rollResult = d.roll();

      expect(rollResult.diceValues).toEqual([3, 4]);
      expect(rollResult.total).toBe(10);
    });
  });

  describe('a Dice generator', () => {
    it('should return the expected mocked value', () => {
      resetCounter();

      const d = new Dice('2d6+3');
      const gen = d.generator();
      let rollResult = gen.next().value;

      expect(rollResult.diceValues).toEqual([1, 2]);
      expect(rollResult.total).toBe(6);

      rollResult = gen.next().value;

      expect(rollResult.diceValues).toEqual([3, 4]);
      expect(rollResult.total).toBe(10);
    });
  });
});
