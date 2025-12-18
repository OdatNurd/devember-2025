/******************************************************************************/


import { type GenericSavedState } from '#state/generic';


/******************************************************************************/


/* The sample plugin view uses all of the possible states. */
export interface SampleViewSchema {
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
 * SampleCompionent Svelte component. */
export interface SampleViewProps {
  // The title to populate into the top of the component.
  title: string;

  // The state that is shared between instances of this component and the things
  // that are mounting them.
  sharedState: GenericSavedState<SampleViewSchema>;
}


/* This type represents the interface of the Svelte component. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SampleViewInstance extends Record<string, unknown> {
  // This space intentionally blank.
}


/******************************************************************************/
