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
		let petalCounts = generateRandomArrayWithCommonDenominator(
			corollaCount,
			repetitionDenomonator,
			maxMultiplier
		).sort();
		let increment = 2 / corollaCount;
		let vectorMatrices = [];

		for (let i = 0; i < corollaCount; i++) {
			let radius = i * increment;
			let repetitions = petalCounts[i];

			vectorMatrices.push(
				corollaGenerator(baseGielis, baseGielisScale, radius, radius, repetitions)
			);
		}

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
	let showRangeEditor = $state(false);

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

<div class="flower-display">
	<FlowerRender {flower} />
</div>

<div class="controls">
	<button
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
		🎲 Randomize
	</button>

	{#if false}
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
	{/if}
	<div class="checkbox lock">
		<input bind:checked={colorLock} type="checkbox" id="color-lock" />
		<label for="color-lock">🎨 Lock Colors</label>
	</div>
</div>

{#each Object.keys(fvrs) as key (key)}
	{@const obj = fvrs[key]}
	<div class="control-group">
		<div class="param-header">
			<span class="param-name">{obj.name}</span>
			<span class="param-value">
				{obj.floor ? Math.floor(obj.value) : obj.value.toFixed(2)}
			</span>
			<div class="checkbox lock">
				<input id="{key}-locked" type="checkbox" bind:checked={obj.locked} />
				<label for="{key}-locked">🔒</label>
			</div>
		</div>
		<div>
			<input
				type="range"
				min={obj.min}
				max={obj.max}
				step={obj.floor ? 1 : 0.01}
				bind:value={obj.value}
			/>
		</div>
		{#if showRangeEditor}
			<div class="param-controls">
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
		{/if}
	</div>
{/each}

<style>
	:global(body) {
		margin: 0;
		padding: 8px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: #f8fafc;
		color: #1e293b;
	}

	/* Flower Display */
	.flower-display {
		background: white;
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		display: flex;
		justify-content: center;
	}

	/* Main Controls */
	.controls {
		background: white;
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
	}

	button {
		background: #3b82f6;
		color: white;
		border: none;
		padding: 10px 16px;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		font-size: 14px;
		transition: all 0.2s;
		min-height: 40px;
	}

	button:hover {
		background: #2563eb;
		transform: translateY(-1px);
	}

	.checkbox {
		display: flex;
		align-items: center;
		gap: 8px;
		padding-top: 4px;
		padding-bottom: 4px;
		background: #f1f5f9;
		border-radius: 8px;
		font-size: 14px;
		border: 1px solid #e2e8f0;
	}

	.checkbox input[type='checkbox'] {
		width: 16px;
		height: 16px;
		accent-color: #3b82f6;
	}

	.seed-control,
	.color-controls {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;

		background: #f8fafc;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
	}

	input[type='number'],
	select {
		padding: 8px 10px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 14px;
		width: 80px;
		min-height: 36px;
		box-sizing: border-box;
	}

	select {
		width: 140px;
		cursor: pointer;
	}

	.color-controls input[type='number'] {
		width: 60px;
	}

	.color-controls select {
		width: 120px;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	label {
		font-size: 14px;
		color: #475569;
		font-weight: 500;
	}

	/* Parameter Controls */
	.control-group {
		background: white;
		border-radius: 12px;
		padding: 5px;
		margin-bottom: 5px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		border: 1px solid #e2e8f0;
	}

	.param-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1px;
		gap: 4px;
		flex-wrap: nowrap;
	}

	.param-name {
		font-weight: 600;
		color: #1e293b;
		font-size: 15px;
	}

	.param-value {
		display: flex;
		justify-content: center;
		width: 100%;
		background: #dbeafe;
		color: #1d4ed8;
		padding: 4px 8px;
		border-radius: 6px;
		font-weight: 600;
		font-size: 14px;
		min-width: 60px;
		text-align: center;
	}

	input[type='range'] {
		width: 100%;
		margin: 6px 0;
		height: 6px;
		border-radius: 3px;
		background: #e2e8f0;
		outline: none;
		accent-color: #3b82f6;
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
		transition: all 0.2s;
	}

	input[type='range']::-webkit-slider-thumb:hover {
		transform: scale(1.2);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
	}

	.param-controls {
		display: flex;
		gap: 12px;
		align-items: center;
		flex-wrap: wrap;
	}

	.param-controls input[type='number'] {
		width: 70px;
	}

	.lock {
		display: flex;
		margin-left: auto;
		background: #fef3c7;
		color: #92400e;
		border-color: #fcd34d;
	}

	/* Mobile Responsive */
	@media (max-width: 640px) {
		:global(body) {
			padding: 4px;
		}

		.controls {
			flex-direction: column;
			align-items: stretch;
			padding: 12px;
		}

		.controls > * {
			width: 100%;
			justify-content: center;
		}

		.seed-control,
		.color-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.seed-control input,
		.color-controls input,
		.color-controls select {
			width: 100%;
			box-sizing: border-box;
		}

		.param-controls {
			justify-content: space-between;
		}

		.param-controls .checkbox {
			margin-left: 0;
			width: fit-content;
			align-self: center;
		}

		.flower-display {
			padding: 12px;
		}

		.control-group {
			padding: 12px;
		}
	}

	@media (max-width: 480px) {
		.param-header {
			flex-direction: row;
			gap: 8px;
			align-items: center;
			text-align: left;
			justify-content: space-between;
		}

		.param-controls {
			flex-direction: column;
			gap: 8px;
		}

		.param-controls input[type='number'] {
			width: 100%;
		}
	}
</style>
