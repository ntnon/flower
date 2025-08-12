<script lang="ts">
    import type { Flower, FlowerPart } from './Flower';
    import RenderColorScheme from './RenderColorScheme.svelte';

    let { flower }: { flower: Flower } = $props();
    let inspect = $state(false);
</script>

inspect-mode:
<input bind:checked={inspect} type="checkbox" />

{#snippet flowerPath(f: FlowerPart)}
    <path d={f.vectors.path} fill={f.color} stroke="black" stroke-width="0"
    ></path>
{/snippet}

<div class="container">
    <svg viewBox="-2 -2 4 4" height="400" width="400">
        {#each flower.flowerParts as part}
            {@render flowerPath(part)}
        {/each}
    </svg>
</div>

{#if inspect}
    <div class="inspect">
        {#each flower.flowerParts as part}
            <svg viewBox="-2 -2 4 4" height="400" width="400">
                {@render flowerPath(part)}
            </svg>
        {/each}
    </div>

    <RenderColorScheme scheme={flower.colorScheme} />
{/if}

<style>
    path {
        opacity: 1;
    }
    svg {
        background-color: gray;
    }
    .inspect {
        display: flex;
        flex-direction: row;
        margin: 0px;
    }
</style>
