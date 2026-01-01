<script lang="ts">
  import { untrack } from 'svelte';
  import { type SampleViewProps } from '#components/views/SampleView.types';

  // The incoming state object that contains the data that we share with the
  // code upstream of us; they will be notified when things here change.
  let { sharedState } : SampleViewProps = $props();

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

  // This function is exported, allowing the plugin code to call it. In a
  // roundabout way, it gets invoked when the toggle state changes, which shows
  // that the plugin gets the value update and that the plugin can trigger the
  // export.
  export function testMessage() {
    console.log("SampleView: The ephemeral toggle was switched!");
  }
</script>

<div class="view-thing">
  <h2>{sharedState.data.settings.textValue || 'Untitled'}</h2>

  <hr>

  <p>You have clicked the button {sharedState.session.count} times.</p>
  <button onclick={handleClick}>Click Me</button>

  <hr>

  <p>
    <label>
      <input type="checkbox" bind:checked={sharedState.ephemeral.toggle} />
      Ephemeral Toggle
    </label>
  </p>

  <hr>

  <textarea bind:value={draft} rows="5"></textarea><br>

  <button
    class="mod-cta"
    onclick={handleSave}
    disabled={draft === sharedState.data.content}
  >
    Save
  </button>
</div>

<style>
  .view-thing {
    margin: 1rem 0;
  }

  h2 {
    color: var(--text-accent);
    margin-top: 0;
  }

  textarea {
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
  }
</style>
