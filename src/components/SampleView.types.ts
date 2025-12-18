/******************************************************************************/


import { type GenericSavedState } from '#state/generic';


/******************************************************************************/


export interface SampleViewSessionData {
  count: number;
}

export interface SampleViewPluginData {
  content: string;
}

export interface SampleViewEphemeralData {
  toggle: boolean;
}

/* This type defines the properties that are expected to be passed to the
 * SampleCompionent Svelte component. */
export interface SampleViewProps {
  // The title to populate into the top of the component.
  title: string;

  // The state that is shared between instances of this component and the things
  // that are mounting them.
  sharedState: GenericSavedState<SampleViewSessionData, SampleViewPluginData, SampleViewEphemeralData>;
}


/* This type represents the interface of the Svelte component. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SampleViewInstance extends Record<string, unknown> {
  // This space intentionally blank.
}


/******************************************************************************/
