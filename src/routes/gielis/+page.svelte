<script lang="ts">
    import { randomColorScheme } from '$lib/color';
    import { Flower } from '$lib/Flower';
    import type { FlowerPart } from '$lib/Flower';
    import { ranEven, ranInRange } from '$lib/Functions';
    import { Gielis } from '$lib/Gielis';
    import RenderColorScheme from '$lib/RenderColorScheme.svelte';

    const randomFlowerVectors = () => {
        return new Gielis({
            m: ranEven(6, 24),
            a: ranInRange(0.1, 2.4),
            b: ranInRange(0.1, 0.4),
            n1: ranInRange(1.5, 5.0),
            n2: ranInRange(0.5, 4.0),
            n3: ranInRange(0.5, 1.6),
            steps: 600,
        }).vectors;
    };

    const colorScheme = randomColorScheme();
    let fl1 = randomFlowerVectors();
    let f2 = randomFlowerVectors();

    let f = $state(new Flower([fl1, f2], colorScheme));
    let b = f.flowerParts[0];
</script>

<button onclick={() => (f = new Flower([fl1.rotate(5), f2], colorScheme))}
    >rotate</button
>
<button
    onclick={() =>
        (f = new Flower([randomFlowerVectors(), randomFlowerVectors()]))}
    >new</button
>

{#snippet fp(s: FlowerPart)}
    <path
        d={s.vectors.path}
        fill={s.color}
        stroke={s.strokeColor}
        stroke-width={s.strokeWidth}
    ></path>
{/snippet}

<div class="container">
    <svg viewBox="-2 -2 4 4" height="400" width="400">
        {#each f.flowerParts as part}
            {@render fp(part)}
        {/each}
    </svg>
</div>

<div class="inspect">
    {#each f.flowerParts as part}
        <svg viewBox="-2 -2 4 4" height="400" width="400">
            {@render fp(part)}
        </svg>
    {/each}
</div>

<RenderColorScheme scheme={f.colorScheme} />

<style>
    path {
        opacity: 1;
    }
    .inspect {
        display: flex;
        flex-direction: row;
        margin: 0px;
    }
</style>
