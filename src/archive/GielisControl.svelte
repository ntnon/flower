<script lang="ts">
    import SvgRender from '../SvgRender.svelte';
    import GielisRender from '../SvgRender.svelte';
    import type { GielisVariables } from '../lib/Gielis';

    let { gielisVariables }: { gielisVariables: GielisVariables } = $props();

    const updatePath = () => {
        return;
    };
</script>

<div class="controls">
    <h3>Gielis Equation Parameters</h3>

    <div>
        <label>m:</label><input
            type="number"
            onchange={() => updatePath()}
            bind:value={gielisVariables.m}
            min="1"
        />
    </div>
    <div>
        <label>a:</label><input
            type="number"
            onchange={() => updatePath()}
            bind:value={gielisVariables.a}
            step="0.1"
            min="0.1"
        />
    </div>
    <div>
        <label>b:</label><input
            type="number"
            onchange={() => updatePath()}
            bind:value={gielisVariables.b}
            step="0.1"
            min="0.1"
        />
    </div>
    <div>
        <label>n1:</label><input
            type="number"
            onchange={() => updatePath()}
            bind:value={gielisVariables.n1}
            step="0.1"
        />
    </div>
    <div>
        <label>n2:</label><input
            type="number"
            onchange={() => updatePath()}
            bind:value={gielisVariables.n2}
            step="0.1"
        />
    </div>
    <div>
        <label>n3:</label><input
            type="number"
            onchange={() => updatePath()}
            bind:value={gielisVariables.n3}
            step="0.1"
        />
    </div>
    <div>
        <label>Steps:</label><input
            type="number"
            onchange={() => updatePath()}
            bind:value={gielisVariables.steps}
            min="10"
        />
    </div>
    <div>
        <label>randomize</label><button onclick={() => updatePath()}
            >Randomize (does nothing)</button
        >
    </div>
</div>

<style>
    .controls {
        margin-bottom: 1rem;
    }

    label {
        margin-right: 0.5rem;
    }

    input {
        margin: 0.25rem 0;
    }
</style>
