<script lang="ts">
	import type { Flower, FlowerPart } from './Flower';

	let { flower }: { flower: Flower } = $props();
</script>

{#snippet flowerPath(f: FlowerPart)}
	<path d={f.vectors.path} fill={f.color} stroke="black" stroke-width="0"></path>
{/snippet}

<div class="container">
	<svg viewBox="-2 -2 4 4" height="400" width="400">
		{#each flower.flowerParts as part, index (index)}
			{@render flowerPath(part)}
		{/each}
	</svg>
</div>

<style>
	path {
		opacity: 1;
	}
	svg {
		background-color: gray;
	}
</style>
