interface Range {
	min: number;
	max: number;
}

export class SeededRNG {
	seed: number;

	constructor(seed: number = Math.floor(Math.random() * 2147483647)) {
		this.seed = seed;
	}

	random() {
		// Linear Congruential Generator
		this.seed = (this.seed * 16807) % 2147483647;
		return (this.seed - 1) / 2147483646;
	}

	randomInRange(range: Range) {
		return range.min + (range.max - range.min) * this.random();
	}

	randomEvenInRange(range: Range) {
		const value = Math.floor(this.randomInRange(range));
		return value % 2 === 0 ? value : value + 1;
	}
}
