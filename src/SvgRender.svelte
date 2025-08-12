<script lang="ts">
    let { path } = $props();
</script>

<div class="container">
    <svg viewBox="-2 -2 4 4" height="200" width="200">
        <path
            d={path}
            fill="orange"
            opacity="1"
            stroke="black"
            stroke-width="0.05"
        ></path>
    </svg>
</div>

<style>
    .container {
        display: flex;
    }
</style>
