/******************************************************************************/


import { untrack } from 'svelte';


/******************************************************************************/


/* This interface defines the structure that any state definition must adhere to.
 * It allows for optional session, data (plugin), and ephemeral state.
 *
 * Users of the system should define their own interface that extends this one,
 * specifying concrete types for the fields they use. */
export interface StateSchema {
  session?: unknown;
  data?: unknown;
  ephemeral?: unknown;
}


/******************************************************************************/


/* This class represents the ability for any generic Svelte component to perist
 * any data it likes into either the Obsidian Session storage or the Plugin
 * storage for the current plugin.
 *
 * It uses a single generic S to define the schema of the state, reducing
 * boilerplate. */
export class GenericSavedState<S extends StateSchema = StateSchema> {
  /* This stores the state for data that is intended for persisting into the
   * Obsidian session storage. */
  session = $state() as S['session'];

  /* This stores the state for data that is intended for persisting into the
   * Obsidian data.json data file associated with the plugin. */
  data = $state() as S['data'];

  /* This stores the state for data that is intended to be shared between the
   * component and the view, but is not persisted anywhere. */
  ephemeral = $state() as S['ephemeral'];

  /* Construct an instance. We cast the config values to the specific types
   * defined in S. If S defines 'session' as required, then 'config.session'
   * effectively populates it, avoiding the need for checks later. */
  constructor(config: { session?: S['session'], data?: S['data'], ephemeral?: S['ephemeral'] }) {
    // These are all cast explicitly to the type; this makes them only be
    // undefined when they're not actually used, which works better.
    this.session = config.session as S['session'];
    this.data = config.data as S['data'];
    this.ephemeral = config.ephemeral as S['ephemeral'];
  }
}


/* This interface is used to association the handlers for knowing when data has
 * changed so that the Obsidian plugin code can see when data changes from
 * within a mounted Svelte component.
 *
 * In the interface, all handlers are optional because it's not enforced that
 * you need to watch for changes in everything at the same time in any given
 * Svelte component. */
export interface WatchHandlers<S extends StateSchema> {
  onSessionChange?: (session: S['session']) => void;
  onDataChange?: (data: S['data']) => void;
  onEphemeralChange?: (ephemeral: S['ephemeral']) => void;
};


/******************************************************************************/


/* This allows code to register an interest in knowing when the view state in
 * the view changes inside of the Svelte component. */
export function watch<S extends StateSchema>(state: GenericSavedState<S>, handlers: WatchHandlers<S>) {
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

    // Handle state changes within the ephemeral data; this behaves exactly
    // as the above.
    if (state.ephemeral !== undefined && handlers.onEphemeralChange !== undefined) {
      let ephemeralInitialized = false;
      $effect(() => {
        // Access the data value to trigger an update.
        void JSON.stringify(state.ephemeral);

        // Let the listener know when state changes.
        untrack(() => {
          if (ephemeralInitialized === false) {
              ephemeralInitialized = true;
              return;
          }
          if (state.ephemeral !== undefined && handlers.onEphemeralChange !== undefined) {
            handlers.onEphemeralChange(state.ephemeral);
          }
        });
      });
    }
  });
}


/******************************************************************************/
