import { SeededRNG } from './SeededRNG';

// Global seeded RNG instance - can be re-seeded as needed
let globalRNG = new SeededRNG();

export function setSeed(seed: number) {
	globalRNG = new SeededRNG(seed);
}

export function getSeed(): number {
	return globalRNG.seed;
}

export function ranInRange(min: number, max: number): number {
	return min + (max - min) * globalRNG.random();
}

export function ranEven(min: number, max: number): number {
	const value = Math.floor(ranInRange(min, max));
	return value % 2 === 0 ? value : value + 1;
}

export function ranInt(min: number, max: number): number {
	return Math.floor(ranInRange(min, max));
}

export function ranChoice<T>(array: T[]): T {
	return array[ranInt(0, array.length)];
}

export function ranBool(): boolean {
	return globalRNG.random() < 0.5;
}

// Shuffle array using seeded random
export function ranShuffle<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = ranInt(0, i + 1);
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
