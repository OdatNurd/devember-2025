<script lang="ts">
  import { untrack } from 'svelte';
  import { type SampleViewProps } from '#components/SampleView.types';

  // The incoming state object that contains the data that we share with the
  // code upstream of us; they will be notified when things here change.
  let { title = 'Untitled', sharedState } : SampleViewProps = $props();

  // Grab a copy of the initial value of the shared state; this takes a ride
  // through untrack to ensure that this does not get updated when the content
  // changes; this is just setting a static value.
  let draft = $state(untrack(() => sharedState.data.content));


  function handleClick() {
    sharedState.session.count += 1;
  }

  function handleSave() {
    sharedState.data.content = draft;
  }
</script>

<div class="view-thing">
  <h2>{title}</h2>

  <hr>

  <p>You have clicked the button {sharedState.session.count} times.</p>
  <button onclick={handleClick}>Click Me</button>

  <hr>

  <textarea bind:value={draft} rows=15></textarea><br>
  <button onclick={handleSave}>Save</button>
</div>

<style>
  .view-thing {
    margin: 1rem 0;
  }
  h2 {
    color: var(--text-accent);
    margin-top: 0;
  }
</style>