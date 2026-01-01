/******************************************************************************/


import type { StateSchema } from '#state/generic';
import type { ComponentSchema, GetProps } from '#ui/svelte';


/******************************************************************************/


export interface SampleBlockSchema extends StateSchema {
  /* Fields here have their data persisted directly into the stored plugin data
   * file data.json.
   *
   * The other two fields being missing indicates that they are not needed. */
  data: {
    content: string;
  };
}

/* This type defines the properties that are expected to be passed to the
 * SampleBlock Svelte component. */
export interface SampleBlockComponent extends ComponentSchema {
  props: {
    // The source of the code block that we are rendering.
    source: string;
  };
}

/* Helper for the Svelte component script block to type its incoming props */
export type SampleBlockProps = GetProps<SampleBlockSchema, SampleBlockComponent>;


/******************************************************************************/
