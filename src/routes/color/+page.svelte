<script lang="ts">
    import { randomColorScheme } from '$lib/color';
    import RenderColorScheme from '$lib/RenderColorScheme.svelte';

    let scheme = randomColorScheme();
</script>

<button onclick={() => (scheme = randomColorScheme())}>new scheme</button>
<RenderColorScheme {scheme} />
