<script lang="ts">
  import type { BoobsBlockProps } from '#components/blocks/Boobs.types';

  let {
    source = '',
    sharedState,
  }: BoobsBlockProps = $props();

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
    margin: 1rem 0;
  }
</style>