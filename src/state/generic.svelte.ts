/******************************************************************************/


import { untrack } from 'svelte';


/******************************************************************************/


export class GenericViewState<S, D> {
  session = $state() as S;
  data = $state() as D;

  constructor(session: S, data: D) {
    this.session = session;
    this.data = data;
  }
}


/******************************************************************************/


interface WatchHandlers<S, D> {
  onSessionChange: (session: S) => void;
  onDataChange: (data: D) => void;
};


/******************************************************************************/



/* This allows code to register an interest in knowing when the view state in
 * the view changes inside of the Svelte component. */
export function watch<S, D>(state: GenericViewState<S, D>, handlers: WatchHandlers<S, D>) {
  return $effect.root(() => {
    // This effect triggers when any field inside of the session state changes.
    // We want to skip the first one because the effect seems to run as soon as
    // it is created.
    let sessionInitialized = false;
    $effect(() => {
      console.log('running effect for stored session data');
      // Access the session value to trigger an update.
      void JSON.stringify(state.session);

      // Let the listener know when state changes.
      untrack(() => {
        if (sessionInitialized === false) {
            sessionInitialized = true;
            return;
        }
        handlers.onSessionChange(state.session);
      });
    });

    // As above, but this one is related to the plugin data and not the session
    // data.
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
        handlers.onDataChange(state.data);
      });
    });
  });
}


/******************************************************************************/

