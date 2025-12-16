<script lang="ts">
  import type { StatusBarProps } from '#components/StatusBar.types';

  let {
    sharedState
  }: StatusBarProps = $props();
</script>

<div class="statusbar-thing">
  <span>Focused: {sharedState.session.activeLeafName}</span>
</div>

<style>
  .statusbar-thing {
    font-weight: bold;
    color: var(--text-accent);
  }
</style>