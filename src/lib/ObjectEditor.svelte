<script lang="ts">
    import ObjectEditor from './ObjectEditor.svelte';
    let { object }: { object: any } = $props();
</script>

{#each Object.keys(object) as key}
    <div>
        <label>{key}:</label>
        <input type="text" bind:value={object[key]} />
    </div>
{/each}
