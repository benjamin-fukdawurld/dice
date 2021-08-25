import seedRandom from 'seedrandom';

const rng = seedRandom(process.env.DICE_RANDOM_SEED);
/**
 * Return a random integer in range [min, max]. The random number generator seed can be set using
 * DICE_RANDOM_SEED env variable
 * @param  {number} min the smallest value of the range
 * @param  {number} max the greatest value of the range
 * @returns {number} a random value in range [min, max]
 */
function randomInt(min: number, max: number): number {
  return Math.floor(rng() * (max + 1 - min) + min);
}

export default { randomInt };
