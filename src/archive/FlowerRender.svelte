<script lang="ts">
    import { Flower, Petal } from './Flower';
    const { flower }: { flower: Flower } = $props();
</script>

{#snippet petal(p: Petal)}
    <div
        class="petal"
        style="
        width: {p.width}px; 
        height: {p.length}px; 
        background-color: {p.color}; 
        position: absolute; 
        transform: rotate({p.angle}deg) translate(0, -{p.distFromCenter}px);
        transform-origin: center;
    "
    ></div>
{/snippet}

{#snippet pistil(flower: Flower)}
    <div
        class="pistil"
        style="
        background-color: {flower.pistilColor};
        width: {flower.pistilSize}px;
        height: {flower.pistilSize}px;
    "
    ></div>
{/snippet}

<div
    class="flower-area"
    style="
    transform: translateX({flower.x}px) translateY({flower.y}px) rotate({flower.rotation}deg);
;
   ;
"
>
    {@render pistil(flower)}
    {#each flower.petals as p}
        {@render petal(p)}
    {/each}
</div>
{flower.x == 0 || flower.y == 0 ? 'relative' : 'absolute'}

<style>
    .flower-area {
        position: absolute;
        display: flex;
        width: min-content;
        height: min-content;
        background-color: orange;
        justify-content: center;
        align-items: center;
    }

    .pistil {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        z-index: 5;
    }

    .petal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        background-color: red;
        border-radius: 50%;
        transition: transform 0.3s ease;
    }
</style>
