/******************************************************************************/


import { untrack } from 'svelte';


/******************************************************************************/


/* This class represents the ability for any generic Svelte component to perist
 * any data it likes into either the Obsidian Session storage or the Plugin
 * storage for the current plugin.
 *
 * This is designed such that a view can use either or both mechanisms as
 * desired. */
export class GenericSavedState<S = undefined, D = undefined> {
  /* This stores the state for data that is intended for persisting into the
   * Obsidian session storage. */
  session = $state() as S;

  /* This stores the state for data that is intended for persisting into the
   * Obsidian data.json data file associated with the plugin. */
  data = $state() as D;

  /* Construct an instance; session and data are both optional, although one
   * assumes that you would use at least one, otherwise why are you creating
   * this instance. */
  constructor(config: { session?: S, data?: D}) {
    // These are both cast explicitly to the type; this makes them only be
    // undefined when they're not actually used, which works better.
    this.session = config.session as S;
    this.data = config.data as D;
  }
}


/* This interface is used to association the handlers for knowing when session
 * and plugin data have changed so that the Obsidian plugin code can see when
 * data changes from within a mounted Svelte component.
 *
 * In the interface, both handlers are optional because it's not enforced that
 * you need to watch for changes in both at the same time in any given Svelte
 * component. */
export interface WatchHandlers<S, D> {
  onSessionChange?: (session: S) => void;
  onDataChange?: (data: D) => void;
};


/******************************************************************************/



/* This allows code to register an interest in knowing when the view state in
 * the view changes inside of the Svelte component. */
export function watch<S, D>(state: GenericSavedState<S, D>, handlers: WatchHandlers<S, D>) {
  return $effect.root(() => {
    // Handle state changes within the session data.
    //
    // This effect only needs to be created if there is actually session data
    // to be tracked and there was a handler provided; otherwise there is no
    // reason to do so.
    if (state.session !== undefined && handlers.onSessionChange !== undefined) {
      // This effect triggers when any field inside of the session state changes.
      // We want to skip the first one because the effect seems to run as soon as
      // it is created.
      let sessionInitialized = false;
      $effect(() => {
        console.log('running effect for stored session data');
        // Access the session value to trigger an update.
        void JSON.stringify(state.session);
        untrack(() => {
          if (sessionInitialized === false) {
              sessionInitialized = true;
              return;
          }
          if (handlers.onSessionChange !== undefined && state.session !== undefined) {
            handlers.onSessionChange(state.session);
          }
        });
      });
    }

    // Handle state changes within the plugin tracked data; this behaves exactly
    // as the above.
    if (state.data !== undefined && handlers.onDataChange !== undefined) {
      let dataInitialized = false;
      $effect(() => {
        console.log('running effect for stored plugin data');
        // Access the data value to trigger an update.
        void JSON.stringify(state.data);

        // Let the listener know when state changes.
        untrack(() => {
          if (dataInitialized === false) {
              dataInitialized = true;
              return;
          }
          if (state.data !== undefined && handlers.onDataChange !== undefined) {
            handlers.onDataChange(state.data);
          }
        });
      });
    }
  });
}


/******************************************************************************/

