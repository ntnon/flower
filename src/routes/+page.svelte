<script lang="ts">
	import { Gielis } from '$lib/Gielis';
	import FlowerRender from '$lib/FlowerRender.svelte';
	import { ranEven, ranInRange, setSeed } from '$lib/Functions';
	import { Flower } from '$lib/Flower';
	import {
		randomBrewerScheme,
		generateAnyRandomColorScheme,
		type ColorScheme,
		type RandomSchemeType
	} from '$lib/color';

	function generateRandomArrayWithCommonDenominator(
		length: number,
		denominator: number,
		maxMultiplier: number
	): number[] {
		if (denominator === 0) {
			throw new Error('Denominator must be non-zero.');
		}

		const result: number[] = [];
		for (let i = 0; i < length; i++) {
			const randomMultiplier = Math.floor(ranInRange(1, maxMultiplier + 1));
			result.push(randomMultiplier * denominator);
		}
		return result;
	}

	interface FlowerVarRange {
		min: number;
		max: number;
		floor?: boolean;
		even?: boolean;
		locked?: boolean;
		value: number;
		name: string;
	}

	interface RangeState {
		[key: string]: FlowerVarRange;
	}

	interface FlowerRangeStates extends RangeState {
		corollaCount: FlowerVarRange;
		repetitionDenomonator: FlowerVarRange;
		maxMultiplier: FlowerVarRange;
		colorSchemeIndexOffset: FlowerVarRange;
		baseGielisScale: FlowerVarRange;
	}

	let fvrs: FlowerRangeStates = $state({
		corollaCount: {
			min: 3,
			max: 70,
			floor: true,
			value: 12,
			name: 'Layers'
		},
		repetitionDenomonator: {
			min: 2,
			max: 12,
			value: 3,
			floor: true,
			name: 'Leaves'
		},
		baseGielisScale: {
			min: 0,
			max: 1,
			value: 0.5,
			name: 'Leaf Scale'
		},
		maxMultiplier: {
			min: 1,
			max: 9,
			value: 3,
			name: 'Max'
		},
		colorSchemeIndexOffset: {
			min: 6,
			max: 24,
			value: 12,
			floor: true,
			name: 'Color Offset'
		}
	});

	const rangesToRandom = (ranges: FlowerRangeStates): FlowerRangeStates => {
		const newRanges: FlowerRangeStates = {} as FlowerRangeStates;
		Object.keys(ranges).forEach((key) => {
			const r = key as keyof FlowerRangeStates;
			const originalRange = ranges[r];

			// ONLY update the value, preserve min/max exactly as defined
			newRanges[r] = {
				min: originalRange.min,
				max: originalRange.max,
				floor: originalRange.floor,
				even: originalRange.even,
				locked: originalRange.locked,
				value: updateRange(originalRange),
				name: originalRange.name
			};
		});
		return newRanges;
	};

	const updateRange = (fvr: FlowerVarRange): number => {
		if (fvr.locked) return fvr.value ?? fvr.min;

		// Ensure we have valid min/max (should never happen with predefined ranges)
		if (fvr.min > fvr.max) {
			console.error(`Invalid predefined range: min (${fvr.min}) > max (${fvr.max})`);
			return fvr.min;
		}

		let newVal = ranInRange(fvr.min, fvr.max);
		if (fvr.even) {
			return ranEven(fvr.min, fvr.max);
		} else if (fvr.floor) {
			return Math.floor(newVal);
		} else {
			return newVal;
		}
	};

	const flowerGenerator = (
		baseGielis: Gielis,
		corollaCount: number,
		repetitionDenomonator: number,
		maxMultiplier: number,
		colorSchemeIndexOffset: number,
		baseGielisScale: number,
		colorScheme: ColorScheme
	) => {
		//let corollaCount = Math.floor(ranInRange(6, 24));
		let petalCounts = generateRandomArrayWithCommonDenominator(
			corollaCount,
			repetitionDenomonator,
			maxMultiplier
		).sort();
		let increment = 2 / corollaCount;
		let vectorMatrices = []; //type this?

		for (let i = 0; i < corollaCount; i++) {
			let radius = i * increment;
			let repetitions = petalCounts[i];

			vectorMatrices.push(
				corollaGenerator(baseGielis, baseGielisScale, radius, radius, repetitions)
			);
		}
		/*
        let colorCount = Math.floor(
            Math.random() * corollaCount + corollaCount * 1.5,
        );
        */
		let f = new Flower(vectorMatrices.reverse(), colorScheme, colorSchemeIndexOffset);

		return f;
	};

	const corollaGenerator = (
		baseGielis: Gielis,
		baseGielisScale: number,
		distFromCenter: number,
		radius: number,
		repetitions: number
	) => {
		return baseGielis
			.setVariables({ m: 2, steps: 50 })
			.vectorMatrix.scaleToRadius(baseGielisScale * radius - 1)
			.createCircularPattern(repetitions, distFromCenter)
			.scaleToRadius(radius);
	};

	let currentSeed = $state(Date.now());
	let colorScheme = $state(randomBrewerScheme(20));
	let colorLock = $state(false);
	let baseGielis = $state(new Gielis());
	let colorCount = $state(20);
	let selectedSchemeType: RandomSchemeType = $state('random');
	let showRangeEditor = $state(true);
	let showSeedControl = $state(false);

	// Define original ranges for reset functionality
	const originalRanges: FlowerRangeStates = {
		corollaCount: {
			min: 3,
			max: 70,
			floor: true,
			value: 12,
			name: 'Layers'
		},
		repetitionDenomonator: {
			min: 2,
			max: 12,
			value: 3,
			floor: true,
			name: 'Leaves'
		},
		baseGielisScale: {
			min: 0,
			max: 1,
			value: 0.5,
			name: 'Leaf Scale'
		},
		maxMultiplier: {
			min: 1,
			max: 9,
			value: 3,
			name: 'Max'
		},
		colorSchemeIndexOffset: {
			min: 6,
			max: 24,
			value: 12,
			floor: true,
			name: 'Color Offset'
		}
	};

	const resetRanges = () => {
		fvrs = { ...originalRanges };
	};

	// Initialize with current seed
	$effect(() => {
		setSeed(currentSeed);
	});

	let flower = $derived(
		flowerGenerator(
			baseGielis,
			fvrs.corollaCount.value,
			fvrs.repetitionDenomonator.value,
			fvrs.maxMultiplier.value,
			fvrs.colorSchemeIndexOffset.value,
			fvrs.baseGielisScale.value,
			colorScheme
		)
	);
</script>

<div class="container">
	<div class="flower-display glass-card">
		<FlowerRender {flower} />
	</div>

	<div class="controls glass-card">
		<button
			class="primary-btn"
			onclick={() => {
				currentSeed = Date.now();
				setSeed(currentSeed);
				const newRanges = rangesToRandom(fvrs);
				fvrs = newRanges;
				if (!colorLock) {
					colorScheme = generateAnyRandomColorScheme(colorCount);
				}
			}}
		>
			✨ Generate New Flower
		</button>

		<div class="checkbox">
			<input bind:checked={colorLock} type="checkbox" id="color-lock" />
			<label for="color-lock">🎨 Lock Colors</label>
		</div>

		<div class="seed-control">
			<label for="seed-input">Seed</label>
			<input
				id="seed-input"
				type="number"
				bind:value={currentSeed}
				onchange={() => {
					setSeed(currentSeed);
					const newRanges = rangesToRandom(fvrs);
					fvrs = newRanges;
					if (!colorLock) {
						colorScheme = generateAnyRandomColorScheme(colorCount);
					}
				}}
			/>
		</div>

		<div class="color-controls">
			<label for="color-count">Colors</label>
			<input
				id="color-count"
				type="number"
				min="2"
				max="50"
				bind:value={colorCount}
				onchange={() => {
					if (!colorLock) {
						colorScheme = generateAnyRandomColorScheme(colorCount);
					}
				}}
			/>

			<label for="scheme-type">Palette</label>
			<select
				id="scheme-type"
				bind:value={selectedSchemeType}
				onchange={() => {
					if (!colorLock) {
						colorScheme = generateAnyRandomColorScheme(colorCount);
					}
				}}
			>
				<option value="random">Random</option>
				<option value="monochrome">Monochrome</option>
				<option value="analogous">Analogous</option>
				<option value="complementary">Complementary</option>
				<option value="triadic">Triadic</option>
				<option value="warm">Warm</option>
				<option value="cool">Cool</option>
				<option value="pastel">Pastel</option>
				<option value="vibrant">Vibrant</option>
				<option value="earth">Earth</option>
			</select>
		</div>
	</div>

	<div class="parameters-section">
		{#each Object.keys(fvrs) as key (key)}
			{@const obj = fvrs[key]}
			<div class="control-group glass-card">
				<div class="parameter-header">
					<h3>{obj.name}</h3>
					<div class="value-display">
						{obj.floor ? Math.floor(obj.value) : obj.value.toFixed(2)}
					</div>
				</div>

				<div class="range-container">
					<input
						type="range"
						min={obj.min}
						max={obj.max}
						step={obj.floor ? 1 : 0.01}
						bind:value={obj.value}
						class="modern-range"
					/>
				</div>

				<div class="parameter-controls">
					<div class="min-max-inputs">
						<div class="input-group">
							<label for="{key}-min">Min</label>
							<input
								id="{key}-min"
								type="number"
								bind:value={obj.min}
								onchange={() => {
									if (obj.min > obj.max) {
										obj.max = obj.min;
									}
									if (obj.value < obj.min) {
										obj.value = obj.min;
									}
								}}
							/>
						</div>
						<div class="input-group">
							<label for="{key}-max">Max</label>
							<input
								id="{key}-max"
								type="number"
								bind:value={obj.max}
								onchange={() => {
									if (obj.max < obj.min) {
										obj.min = obj.max;
									}
									if (obj.value > obj.max) {
										obj.value = obj.max;
									}
								}}
							/>
						</div>
					</div>

					<div class="checkbox parameter-lock">
						<input id="{key}-locked" type="checkbox" bind:checked={obj.locked} />
						<label for="{key}-locked">🔒</label>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
