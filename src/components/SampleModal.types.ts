/******************************************************************************/


import type { StateSchema } from '#state/generic';
import type { ComponentSchema, GetProps } from '#ui/svelte';


/******************************************************************************/


/* The sample modal only cares about ephemeral data; the click count is lost
 * when the plugin unloads or Obsidian quits. */
export interface SampleModalSchema extends StateSchema {
  ephemeral: {
    modalClicks: number;
  }
}

/* This type defines the properties that are expected to be passed to the
 * SampleCompionent Svelte component and the exports that it provides., */
export interface SampleModalComponent extends ComponentSchema {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  props: { };

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  exports: { };
}


/* Helpers for the Svelte component script block to type its incoming props */
export type SampleModalProps = GetProps<SampleModalSchema, SampleModalComponent>;


/******************************************************************************/
