<script lang="ts">
    import type { ColorScheme } from '$lib/color';
    let { scheme }: { scheme: ColorScheme } = $props();
</script>

{#snippet colorRender(c: String)}
    <div style="background-color: {c}; width: 70px; height: 70px;">
        {c}
    </div>
{/snippet}

{#snippet schemeRender(s: String[])}
    <div
        style="display: flex; margin: 20px; border: 5px solid #000; width: min-content;"
    >
        {#each s as color}
            {@render colorRender(color)}
        {/each}
    </div>
{/snippet}

<div style="background-color: #f0f0f0; padding: 20px; width: min-content;">
    {scheme.name}
    {@render schemeRender(scheme.colors)}
</div>
