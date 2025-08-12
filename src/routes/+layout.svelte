<script>
	const { children } = $props();
	let checked = $state(false);
	import Corolla from './corolla/+page.svelte';
</script>

show todo:<input type="checkbox" bind:checked /><br />

{#if checked}
	<div style="display: flex; gap: 10px; flex-direction: row;">
		<a href="/gielis">Gielis</a>
		<a href="/color">Color</a>
		<a href="/editor">Editor</a>
		<a href="/corolla">Corolla</a>
	</div>
	<h1>TODO:</h1>
	<ol>
		<li>Create interface for modifying flower dynamically</li>
		<li>
			Express entire flower as "svg" path? Ask ChatGPT - This would simplify flower rendering,
			needing only one snippet for each flower-element
		</li>
		<li>Is it possible to express color in svg-path-objects or whatever they are..?</li>
		<li>Express "sepal" as path - rather than circle-tag</li>
		<li>Add imperfections to flowers</li>
		<li>
			Add background to every flower. Circlular. Extrapolate color from scheme, in some fancy way
		</li>
		<li>Create idea for simulation - generations? - mutations? - survival of the prettiest?</li>
		<li>rotating VectorMatrices should be different than rotating every child matrix</li>
	</ol>
{/if}

{@render children()}
<Corolla />

<style>
	li {
		margin: 3px;
	}
</style>
