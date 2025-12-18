/******************************************************************************/


import { type GenericSavedState } from '#state/generic';


/******************************************************************************/


export interface BoobsBlockPluginData {
  content: string;
}

/* This type defines the properties that are expected to be passed to the
 * BoobsBlock Svelte component. */
export interface BoobsBlockProps {
  // The source of the code block that we are rendering.
  source: string;

  // The state that is shared between instances of this component and the things
  // that are mounting them.
  sharedState: GenericSavedState<undefined, BoobsBlockPluginData>;
}

/* This type represents the interface of the Svelte component. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BoobsBlockInstance extends Record<string, unknown> {
  // This space intentialy blank.
}


/******************************************************************************/
