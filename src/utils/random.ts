import { MersenneTwister19937, Random } from 'random-js';

export const random = new Random(MersenneTwister19937.autoSeed());
