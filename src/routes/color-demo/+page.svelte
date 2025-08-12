<script lang="ts">
	import {
		generateRandomColorScheme,
		generateRandomColorSchemeByType,
		generateAnyRandomColorScheme,
		type RandomSchemeType,
		type ColorScheme
	} from '$lib/color';
	import { setSeed } from '$lib/Functions';
	import RenderColorScheme from '$lib/RenderColorScheme.svelte';

	let colorCount = $state(8);
	let selectedSchemeType: RandomSchemeType = $state('random');
	let currentSeed = $state(42);
	let generatedSchemes: ColorScheme[] = $state([]);

	// Initialize seed
	$effect(() => {
		setSeed(currentSeed);
	});

	const schemeTypes: { value: RandomSchemeType; label: string }[] = [
		{ value: 'random', label: 'Random Distribution' },
		{ value: 'monochrome', label: 'Monochrome' },
		{ value: 'analogous', label: 'Analogous' },
		{ value: 'complementary', label: 'Complementary' },
		{ value: 'triadic', label: 'Triadic' },
		{ value: 'warm', label: 'Warm Colors' },
		{ value: 'cool', label: 'Cool Colors' },
		{ value: 'pastel', label: 'Pastel' },
		{ value: 'vibrant', label: 'Vibrant' },
		{ value: 'earth', label: 'Earth Tones' }
	];

	function generateSingleScheme() {
		setSeed(currentSeed);
		const scheme = generateRandomColorSchemeByType(colorCount, selectedSchemeType);
		generatedSchemes = [scheme, ...generatedSchemes.slice(0, 9)]; // Keep last 10
	}

	function generateMultipleSchemes() {
		setSeed(currentSeed);
		const schemes: ColorScheme[] = [];
		for (const type of schemeTypes) {
			schemes.push(generateRandomColorSchemeByType(colorCount, type.value));
		}
		generatedSchemes = schemes;
	}

	function generateRandomSchemes() {
		setSeed(currentSeed);
		const schemes: ColorScheme[] = [];
		for (let i = 0; i < 10; i++) {
			schemes.push(generateAnyRandomColorScheme(colorCount));
		}
		generatedSchemes = schemes;
	}

	// Generate initial schemes
	$effect(() => {
		if (generatedSchemes.length === 0) {
			generateMultipleSchemes();
		}
	});
</script>

<svelte:head>
	<title>Color Scheme Generator Demo</title>
</svelte:head>

<div class="container">
	<h1>Random Color Scheme Generator</h1>
	<p>
		Generate random color schemes of any size using chroma.js with seeded randomization for
		reproducible results.
	</p>

	<div class="controls">
		<div class="control-group">
			<label for="seed">Seed:</label>
			<input id="seed" type="number" bind:value={currentSeed} />
		</div>

		<div class="control-group">
			<label for="count">Color Count:</label>
			<input id="count" type="number" min="2" max="20" bind:value={colorCount} />
		</div>

		<div class="control-group">
			<label for="type">Scheme Type:</label>
			<select id="type" bind:value={selectedSchemeType}>
				{#each schemeTypes as type}
					<option value={type.value}>{type.label}</option>
				{/each}
			</select>
		</div>

		<div class="button-group">
			<button onclick={generateSingleScheme}>Generate Selected Type</button>
			<button onclick={generateMultipleSchemes}>Generate All Types</button>
			<button onclick={generateRandomSchemes}>Generate 10 Random</button>
		</div>
	</div>

	<div class="schemes-grid">
		{#each generatedSchemes as scheme, index (index)}
			<div class="scheme-card">
				<h3>{scheme.name}</h3>
				<RenderColorScheme {scheme} />
				<div class="color-info">
					<p>{scheme.colors.length} colors</p>
					<details>
						<summary>Color Values</summary>
						<div class="color-list">
							{#each scheme.colors as color}
								<div class="color-item">
									<div class="color-swatch" style="background-color: {color}"></div>
									<code>{color}</code>
								</div>
							{/each}
						</div>
					</details>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		color: #333;
		margin-bottom: 0.5rem;
	}

	p {
		color: #666;
		margin-bottom: 2rem;
	}

	.controls {
		background: #f5f5f5;
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: end;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.control-group label {
		font-weight: 600;
		color: #333;
	}

	.control-group input,
	.control-group select {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	.control-group input[type='number'] {
		width: 80px;
	}

	.control-group select {
		min-width: 150px;
	}

	.button-group {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	button {
		padding: 0.75rem 1rem;
		background: #007acc;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background-color 0.2s;
	}

	button:hover {
		background: #005a9e;
	}

	.schemes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.scheme-card {
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.scheme-card h3 {
		margin: 0 0 1rem 0;
		color: #333;
		font-size: 1.1rem;
	}

	.color-info {
		margin-top: 1rem;
	}

	.color-info p {
		margin: 0.5rem 0;
		font-size: 0.9rem;
		color: #666;
	}

	details {
		margin-top: 0.5rem;
	}

	summary {
		cursor: pointer;
		font-size: 0.9rem;
		color: #007acc;
		padding: 0.25rem 0;
	}

	summary:hover {
		color: #005a9e;
	}

	.color-list {
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.color-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem;
		background: #f9f9f9;
		border-radius: 4px;
	}

	.color-swatch {
		width: 20px;
		height: 20px;
		border-radius: 3px;
		border: 1px solid #ccc;
	}

	.color-item code {
		font-size: 0.8rem;
		color: #666;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	}

	@media (max-width: 768px) {
		.controls {
			flex-direction: column;
			align-items: stretch;
		}

		.button-group {
			justify-content: center;
		}
	}
</style>
