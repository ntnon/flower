<script lang="ts">
    import { Gielis } from '$lib/Gielis';
    import FlowerRender from '$lib/FlowerRender.svelte';
    import { ranEven, ranInRange } from '$lib/Functions';
    import { Flower } from '$lib/Flower';
    import {
        generateGreenScheme,
        randomBrewerScheme,
        randomColorScheme,
        type ColorScheme,
    } from '$lib/color';
    import { VectorMatrix } from '$lib/VectorMatrix';
    import RenderColorScheme from '$lib/RenderColorScheme.svelte';

    const randomGielis = () => {
        return new Gielis({
            m: ranEven(4, 8),
            a: ranInRange(0.1, 2.4),
            b: ranInRange(0.1, 0.4),
            n1: ranInRange(1.5, 5.0),
            n2: ranInRange(0.5, 4.0),
            n3: ranInRange(0.5, 1.6),
            steps: 60,
        });
    };

    function generateRandomArrayWithCommonDenominator(
        length: number,
        denominator: number,
        maxMultiplier: number,
    ): number[] {
        if (denominator === 0) {
            throw new Error('Denominator must be non-zero.');
        }

        const result: number[] = [];
        for (let i = 0; i < length; i++) {
            const randomMultiplier =
                Math.floor(Math.random() * maxMultiplier) + 1;
            result.push(randomMultiplier * denominator);
        }
        return result;
    }

    let v = {
        m: 12,
        a: 3.8519184768574606,
        b: 0.6073450989410323,
        n1: 12.504330954064185,
        n2: -1.7340472058368928,
        n3: 11.832615310104968,
        steps: 730.2634962171134,
    };

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
            max: 15,
            floor: true,
            value: 0,
        },
        repetitionDenomonator: {
            min: 2,
            max: 12,
            value: 3,
            floor: true,
        },
        maxMultiplier: {
            min: 1,
            max: 9,
            value: 0,
        },
        colorSchemeIndexOffset: {
            min: 6,
            max: 24,
            value: 0,
            floor: true,
        },
        baseGielisScale: {
            min: 0,
            max: 1,
            value: 0,
        },
    });

    const rangesToRandom = (ranges: FlowerRangeStates): FlowerRangeStates => {
        let newRanges: FlowerRangeStates = ranges;
        Object.keys(ranges).forEach(
            (r) => (ranges[r].value = updateRange(ranges[r])),
        );
        return newRanges;
    };

    const updateRange = (fvr: FlowerVarRange): number => {
        let newVal = ranInRange(fvr.min, fvr.max);
        if (fvr.locked) return fvr.value ?? fvr.min;
        if (fvr.floor) return Math.floor(newVal);
        if (fvr.even)
            return ranEven(fvr.min, fvr.max); //Not actually implemented
        else return newVal;
    };

    const flowerGenerator = (
        baseGielis: Gielis,
        corollaCount: number,
        repetitionDenomonator: number,
        maxMultiplier: number,
        colorSchemeIndexOffset: number,
        baseGielisScale: number,
        colorScheme: ColorScheme,
    ) => {
        //let corollaCount = Math.floor(ranInRange(6, 24));
        let petalCounts = generateRandomArrayWithCommonDenominator(
            corollaCount,
            repetitionDenomonator,
            maxMultiplier,
        ).sort();
        let increment = 2 / corollaCount;
        let vectorMatrices = []; //type this?

        for (let i = 0; i < corollaCount; i++) {
            let radius = i * increment;
            let repetitions = petalCounts[i];

            vectorMatrices.push(
                corollaGenerator(
                    baseGielis,
                    baseGielisScale,
                    radius,
                    radius,
                    repetitions,
                ),
            );
        }
        /*
        let colorCount = Math.floor(
            Math.random() * corollaCount + corollaCount * 1.5,
        );
        */
        let f = new Flower(
            vectorMatrices.reverse(),
            colorScheme,
            colorSchemeIndexOffset,
        );

        return f;
    };

    const corollaGenerator = (
        baseGielis: Gielis,
        baseGielisScale: number,
        distFromCenter: number,
        radius: number,
        repetitions: number,
    ) => {
        return baseGielis
            .setVariables({ m: 2, steps: 50 })
            .vectorMatrix.scaleToRadius(baseGielisScale * radius - 1)
            .createCircularPattern(repetitions, distFromCenter)
            .scaleToRadius(radius);
    };

    let colorScheme = randomBrewerScheme(20);
    let baseGielis = new Gielis();
    let flower = $derived(
        flowerGenerator(
            baseGielis,
            fvrs.corollaCount.value,
            fvrs.repetitionDenomonator.value,
            fvrs.maxMultiplier.value,
            fvrs.colorSchemeIndexOffset.value,
            fvrs.baseGielisScale.value,
            colorScheme,
        ),
    );
</script>

<button
    onclick={() => {
        fvrs = rangesToRandom(fvrs);
        colorScheme = randomColorScheme();
    }}>randomize</button
>

{#each Object.keys(fvrs) as key}
    {@const obj = fvrs[key as string]}
    {key},
    <div class="number" style="display: flex; flex-direction: row;">
        min<input
            class="number"
            max={obj.max}
            type="number"
            bind:value={obj.min}
        />
        <input
            type="range"
            min={obj.min}
            max={obj.max}
            step={obj.floor
                ? Math.floor((obj.max - obj.min) / 100)
                : (obj.max - obj.min) / 100}
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
<RenderColorScheme scheme={flower.colorScheme} />
