<script lang="ts">
  import type { BoobsBlockProps } from '#components/blocks/Boobs.types';

  let {
    source = '',
    sharedState,
  }: BoobsBlockProps = $props();

</script>

<div class="code-block-thing">
  ( • )( • )ԅ(‾⌣‾ԅ)
  <hr>
  {source}
  <hr>
  {sharedState.data.content}
</div>

<style>
  .code-block-thing {
    border: 1px solid var(--text-accent);
    padding: 1rem;
    border-radius: 4px;
    white-space: pre-wrap;
  }
  .code-block-thing hr {
    margin-top: 8px;
    margin-bottom: 8px;
    border: 1px solid var(--text-accent);
  }
</style>