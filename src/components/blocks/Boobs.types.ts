/******************************************************************************/


import { type GetProps } from '#ui/svelte';


/******************************************************************************/


export interface BoobsBlockSchema {
  /* Fields here have their data persisted directly into the stored plugin data
   * file data.json.
   *
   * The other two fields being missing indicates that they are not needed. */
  data: {
    content: string;
  };
}

/* This type defines the properties that are expected to be passed to the
 * BoobsBlock Svelte component. */
export interface BoobsBlockComponent {
  props: {
    // The source of the code block that we are rendering.
    source: string;
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  exports: { };
}

/* Helper for the Svelte component script block to type its incoming props */
export type BoobsBlockProps = GetProps<BoobsBlockSchema, BoobsBlockComponent>;


/******************************************************************************/
