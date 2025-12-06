<script lang="ts">
  interface PropLayout {
    name: string;
    initialCount: number;
    onNewCount: (newCount: number) => void
  }

  let { name, initialCount, onNewCount }: PropLayout = $props();
  let count = $state(initialCount);

  // Ensure that we have a callback; if we were not given one, then we don't
  // broadcast updates.
  onNewCount = onNewCount ??= () => {}

  function handleClick() {
    count += 1;
    onNewCount(count);
  }

  // Set all of our internal state based on the incoming data.
  export function setComponentState(data: { count: number }) {
    if (data && typeof data.count === 'number') {
      count = data.count;
    }
  }
</script>

<div class="my-component">
  <h2>{name}!</h2>
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