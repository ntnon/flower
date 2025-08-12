<script lang="ts">
	import { Gielis } from '$lib/Gielis';
	import FlowerRender from '$lib/FlowerRender.svelte';
	import { ranEven, ranInRange, setSeed } from '$lib/Functions';
	import { Flower } from '$lib/Flower';
	import { randomBrewerScheme, randomColorScheme, type ColorScheme } from '$lib/color';
	import RenderColorScheme from '$lib/RenderColorScheme.svelte';

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
			value: 12
		},
		repetitionDenomonator: {
			min: 2,
			max: 12,
			value: 3,
			floor: true
		},
		maxMultiplier: {
			min: 1,
			max: 9,
			value: 3
		},
		colorSchemeIndexOffset: {
			min: 6,
			max: 24,
			value: 12,
			floor: true
		},
		baseGielisScale: {
			min: 0,
			max: 1,
			value: 0.5
		}
	});

	const rangesToRandom = (ranges: FlowerRangeStates): FlowerRangeStates => {
		let newRanges: FlowerRangeStates = { ...ranges };
		Object.keys(newRanges).forEach((r) => {
			newRanges[r] = { ...newRanges[r], value: updateRange(newRanges[r]) };
		});
		return newRanges;
	};

	const updateRange = (fvr: FlowerVarRange): number => {
		if (fvr.locked) return fvr.value ?? fvr.min;

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
	let baseGielis = $state(new Gielis());

	// Initialize with current seed
	setSeed(currentSeed);
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

<FlowerRender {flower} />

<div class="controls">
	<button
		onclick={() => {
			currentSeed = Date.now();
			setSeed(currentSeed);
			fvrs = rangesToRandom(fvrs);
			colorScheme = randomColorScheme();
		}}>randomize</button
	>

	<div class="seed-control">
		<label for="seed-input">Seed:</label>
		<input
			id="seed-input"
			type="number"
			bind:value={currentSeed}
			onchange={() => {
				setSeed(currentSeed);
				fvrs = rangesToRandom(fvrs);
				colorScheme = randomColorScheme();
			}}
		/>
		<button
			onclick={() => {
				setSeed(currentSeed);
				fvrs = rangesToRandom(fvrs);
				colorScheme = randomColorScheme();
			}}>Apply Seed</button
		>
	</div>
</div>

{#each Object.keys(fvrs) as key (key)}
	{@const obj = fvrs[key]}
	<div class="control-group">
		<div class="control-header">{key}</div>
		<label for="{key}-min">Min</label>
		<input id="{key}-min" type="number" max={obj.max} bind:value={obj.min} />

		<input
			type="range"
			min={obj.min}
			max={obj.max}
			step={obj.floor ? Math.floor((obj.max - obj.min) / 100) : (obj.max - obj.min) / 100}
			bind:value={obj.value}
		/>

		<label for="{key}-max">Max</label>
		<input id="{key}-max" type="number" min={obj.min} bind:value={obj.max} />

		<div class="checkbox">
			<input id="{key}-locked" type="checkbox" bind:checked={obj.locked} />
			<label for="{key}-locked">Locked</label>
		</div>

		<div>Value: {obj.value}</div>
	</div>
{/each}
<RenderColorScheme scheme={flower.colorScheme} />

<style>
	.controls {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-bottom: 1rem;
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.seed-control {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.control-group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.5rem;
		margin-bottom: 0.3rem;
		border-bottom: 1px solid #ddd;
		font-size: 0.85rem;
	}

	.control-header {
		font-weight: 600;
		margin-right: 0.5rem;
		white-space: nowrap;
	}

	input[type='number'] {
		width: 50px;
		padding: 0.1rem;
		font-size: 0.8rem;
	}

	input[type='range'] {
		flex: 1;
		min-width: 100px;
		accent-color: #007acc;
	}

	label {
		font-size: 0.75rem;
		white-space: nowrap;
	}

	.checkbox {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	button {
		padding: 0.5rem 1rem;
		background: #007acc;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background: #005a9e;
	}
</style>
