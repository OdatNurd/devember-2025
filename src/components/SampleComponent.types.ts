/******************************************************************************/


/* This type defines the properties that are expected to be passed to the
 * SampleCompionent Svelte component. */
export interface SampleComponentProps {
  // The name to populate into the top of the component.
  name: string;

  // The component tracks a count of the number of button clicks; this specifies
  // the count to start with.
  initialCount: number;

  // A callback function which, if implemented, gets invoked every time the
  // count changes.
  onNewCount: (newCount: number) => void
}


/* This type defines the state that is persisted from this component into the
 * Obsidian view that contains it, so that it can restore back between sessions
 * (i.e. quit and restart of Obsidian). */
export interface SampleComponentState {
  /* The number of times the button was clicked. */
  count: number
}


/* This type represents the interface of the Svelte component. */
export interface SampleComponentInstance {
  /* The component supports a function to set its state. */
  setComponentState: (data: SampleComponentState) => void;
}


/******************************************************************************/
