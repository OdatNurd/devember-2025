/******************************************************************************/


import type { StateSchema } from '#state/generic';
import type { ComponentSchema, GetProps } from '#ui/svelte';


/******************************************************************************/


/* The sample plugin view uses all of the possible states. */
export interface SampleViewSchema extends StateSchema {
  /* Fields here have their data persisted within the Obsidian workspace as long
   * as the view is open; then it is discarded. */
  session: {
    count: number;
  };

  /* Fields here have their data persisted directly into the stored plugin data
   * file data.json. */
  data: {
    content: string;
  };

  /* Fields here are reactive and shared as long as the view is open, and then
   * their value is lost. */
  ephemeral: {
    toggle: boolean;
  };
}

/* This type defines the properties that are expected to be passed to the
 * SampleCompionent Svelte component and the exports that it provides., */
export interface SampleViewComponent extends ComponentSchema {
  props: {
    // The title to populate into the top of the component.
    title: string;
  };

  exports: {
    // Displays a simple message that proves that the exports work every time
    // the toggle in the component changes values.
    testMessage: () => void;
  };
}

/* Helper for the Svelte component script block to type its incoming props */
export type SampleViewProps = GetProps<SampleViewSchema, SampleViewComponent>;


/******************************************************************************/
