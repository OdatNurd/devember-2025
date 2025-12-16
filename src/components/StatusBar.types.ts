/******************************************************************************/


import { type GenericSavedState } from '#state/generic';


/******************************************************************************/


/* The information that the status bar component stores into the session. */
export interface StatusBarSessionData {
  activeLeafName: string;
}

/* The information that the status bar component stores into the plugin data. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StatusBarPluginData {
  // This space intentialy blank.
}

/* This type defines the properties that are expected to be passed to the
 * component. */
export interface StatusBarProps {
  // The state that is shared between instances of this component and the things
  // that are mounting them.
  sharedState: GenericSavedState<StatusBarSessionData, StatusBarPluginData>;
}

/* This type represents the interface of the Svelte component. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StatusBarInstance extends Record<string, unknown> {
  // This space intentialy blank.
}


/******************************************************************************/
