import math from './math';

describe("math.randomInt, given the random seed 'test'", () => {
  it('should return the expected values', () => {
    expect([...Array(10)].map(() => math.randomInt(1, 8))).toEqual([7, 4, 8, 3, 3, 3, 4, 1, 6, 4]);
  });
});
