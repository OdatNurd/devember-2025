/******************************************************************************/


import { type SampleViewState } from '#state/SampleView';


/******************************************************************************/


/* This type defines the properties that are expected to be passed to the
 * SampleCompionent Svelte component. */
export interface SampleViewProps {
  // The title to populate into the top of the component.
  title: string;

  // The state that is shared between instances of this component and the things
  // that are mounting them.
  sharedState: SampleViewState;
}


/* This type represents the interface of the Svelte component. */
export interface SampleViewInstance {
  // This space intentionally blank.
}


/******************************************************************************/
