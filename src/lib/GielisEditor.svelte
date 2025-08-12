<script lang="ts">
    import { on } from 'svelte/events';
    import { ranEven, ranInRange } from './Functions';
    import { onMount } from 'svelte';
    import { GielisControl } from './GielisControl.svelte.ts';

    import FlowerRender from './FlowerRender.svelte';
    import { Flower } from './Flower.ts';
    import { Gielis } from './Gielis.ts';
    import { randomColorScheme } from './color.ts';

    //    let { vars = $bindable() } = $props();
    let ranges = $state({
        m: [6, 30],
        a: [0.9, 1.1],
        b: [0.8, 1.2],
        n1: [0, 1.5],
        n2: [-1.5, 0.5],
        n3: [-12, 15],
        steps: [400, 1000],
    });

    interface b {
        min: number;
        max: number;
        locked: boolean;
        value: number;
    }

    interface c {
        m: b;
        a: b;
        b: b;
        n1: b;
        n2: b;
        n3: b;
        steps: b;
    }

    //decent ranges for for Pistil (background leaves)

    let ranges1: c = $state({
        m: { min: 6, max: 30, locked: false, value: 0 },
        a: { min: 1, max: 10, locked: false, value: 0 },
        b: { min: 0.4, max: 1.3, locked: false, value: 0 },
        n1: { min: 0.64, max: 17, locked: false, value: 0 },
        n2: { min: -2, max: 4.0, locked: false, value: 0 },
        n3: { min: 1, max: 20, locked: false, value: 0 },
        steps: { min: 100, max: 1000, locked: false, value: 0 },
    });

    const randomValues = (i: c) => {
        i.m.value = i.m.locked ? i.m.value : ranEven(i.m.min, i.m.max);
        i.a.value = i.a.locked ? i.a.value : ranInRange(i.a.min, i.a.max);
        i.b.value = i.b.locked ? i.b.value : ranInRange(i.b.min, i.b.max);
        i.n1.value = i.n1.locked ? i.n1.value : ranInRange(i.n1.min, i.n1.max);
        i.n2.value = i.n2.locked ? i.n2.value : ranInRange(i.n2.min, i.n2.max);
        i.n3.value = i.n3.locked ? i.n3.value : ranInRange(i.n3.min, i.n3.max);
        i.steps.value = i.steps.locked
            ? i.steps.value
            : ranInRange(i.steps.min, i.steps.max);
    };

    randomValues(ranges1);

    let colorScheme = randomColorScheme();

    let values = $derived({
        m: ranges1.m.value,
        a: ranges1.a.value,
        b: ranges1.b.value,
        n1: ranges1.n1.value,
        n2: ranges1.n2.value,
        n3: ranges1.n3.value,
        steps: ranges1.steps.value,
    });

    let flower: Flower = $derived(
        new Flower(
            [
                new Gielis(values).vectorMatrix.scaleToRadius(2).rotate(-20),
                new Gielis(values).vectorMatrix.rotate(90),
                ...new Gielis(values).vectorMatrix
                    .offset(0.2, 0.2)
                    .rotate(20)
                    .createCircularPattern(0.8, 0.4),
            ],
            colorScheme,
        ),
    );

    let fq = new Flower([new Gielis().vectorMatrix]);
</script>

<label>Ranges:</label>
<input type="text" value={JSON.stringify(ranges).replaceAll('"', '')} /><br />
<label>Values:</label>
<input type="text" value={JSON.stringify(values).replaceAll('"', '')} />
<br />
<button
    onclick={() => {
        randomValues(ranges1);
    }}>Random values</button
>
{values.m}

{#each Object.keys(ranges1) as key}
    {@const obj = ranges1[key as keyof typeof ranges]}
    <div class="number" style="display: flex; flex-direction: row;">
        {key}, min<input
            class="number"
            max={obj.max}
            type="number"
            bind:value={obj.min}
        />

        <input
            type="range"
            min={obj.min}
            max={obj.max}
            step={key === 'm' ? 2 : (obj.max - obj.min) / 100}
            bind:value={obj.value}
        />

        <input
            class="number"
            type="number"
            min={obj.min}
            bind:value={obj.max}
        />max
        <br />
        locked: <input type="checkbox" bind:checked={obj.locked} />
        <br />
        value: {obj.value}
    </div>
{/each}

<FlowerRender {flower} />
<FlowerRender flower={fq} />


