<script lang="ts">
  import type { SampleBlockProps } from '#components/blocks/Sample.types';

  let {
    source = '',
    sharedState,
  }: SampleBlockProps = $props();

</script>

<div class="code-block-thing">
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