/******************************************************************************/


import { type GenericSavedState } from '#state/generic';


/******************************************************************************/


/* The information that the status bar component stores. */
export interface StatusBarSchema {
  /* Fields here have their data persisted within the Obsidian workspace as long
   * as the view is open; then it is discarded. *
   *
   * The other two fields being missing indicates that they are not needed. */
  session: {
    activeLeafName: string;
  }
}

/* This type defines the properties that are expected to be passed to the
 * component. */
export interface StatusBarProps {
  // The state that is shared between instances of this component and the things
  // that are mounting them.
  sharedState: GenericSavedState<StatusBarSchema>;
}

/* This type represents the interface of the Svelte component. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StatusBarInstance extends Record<string, unknown> {
  // This space intentialy blank.
}


/******************************************************************************/
