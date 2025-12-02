<script lang="ts">
  let { name }: { name: string } = $props();
  let count = $state(0);

  function handleClick() {
    count += 1;
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