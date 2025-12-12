<script lang="ts">
  import type { SampleViewProps, SampleViewState } from '#components/SampleView.types';

  let {
    name = 'Unnamed',
    initialCount = 0,
    onNewCount = () => {}
  }: SampleViewProps = $props();

  // svelte-ignore state_referenced_locally
  let count = $state(initialCount);

  function handleClick() {
    count += 1;
    onNewCount(count);
  }

  // Set all of our internal state based on the incoming data.
  export function setComponentState(data: SampleViewState) {
    if (typeof data?.count === 'number') {
      count = data.count;
    }
  }
</script>

<div class="my-component">
  <h2>{name}! (also beer)</h2>
  <p>You have clicked the button {count} times.</p>
  <button onclick={handleClick}>Click Me</button>
</div>

<style>
  .my-component {
    border: 1px solid var(--text-accent);
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
  }
  h2 {
    color: var(--text-accent);
    margin-top: 0;
  }
</style>