<script lang="ts">
  import type { SampleModalProps } from '#components/SampleModal.types';

  let {
    title = 'Unnamed',
    sharedState,
  }: SampleModalProps = $props();


  function handleClick() {
    sharedState.ephemeral.modalClicks += 1;
  }
</script>

<div class="modal-thing">
  <h2>{title}!</h2>
  <p>You have clicked the button {sharedState.ephemeral.modalClicks} times.</p>
  <button onclick={handleClick}>Click Me</button>
</div>

<style>
  .modal-thing {
    margin: 1rem 0;
  }
  h2 {
    color: var(--text-accent);
    margin-top: 0;
  }
</style>