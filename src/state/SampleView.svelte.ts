/******************************************************************************/


import { untrack } from 'svelte';


/******************************************************************************/


/* This type defines the state that is persisted from this component into the
 * Obsidian view that contains it, so that it can restore back between sessions
 * (i.e. quit and restart of Obsidian). */
export class SampleViewState {
  /* The number of types the button was clicked; this is stored in the Obsidian
   * view state for the tab view, when one is open, so that it can be restored
   * when the session is reloaded (unless trhe tab is closed). */
  count = $state(0)

  /* The content that lives within the TextArea that lives inside of the view;
   * this is an example of using data that is not a setting and ensuring that
   * it persists into data.json. */
  content = $state('')

  constructor(count: number, content: string) {
    this.count = count;
    this.content = content;
  }
}


/******************************************************************************/


/* This allows code to register an interest in knowing when the view state in
 * the view changes inside of the Svelte component. */
export function watch(state: SampleViewState, callback: () => void) {
  return $effect.root(() => {
    $effect(() => {
      // This apparently ensures that these two values are effectively  our
      // dependencies, so that when they change we get called.
      state.count;
      state.content;

      // Let the listener know when state changes. */
      untrack(() => callback());
    });
  });
}


/******************************************************************************/

