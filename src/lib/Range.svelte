<script lang="ts">
    let { arr }: { arr: number[] } = $props();
    let sliderValue = $state(arr[0]); // Initial value of the slider
</script>

<div>
    <label>Value: {sliderValue}</label>
    <!-- Display the current value -->
    <input
        type="range"
        min={arr[0]}
        max={arr[1]}
        step={(arr[1] - arr[0]) / 100}
        bind:value={sliderValue}
    />
</div>
