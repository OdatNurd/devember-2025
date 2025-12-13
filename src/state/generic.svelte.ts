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
    $effect(() => {
      // Access the session value to trigger an update.
      void JSON.stringify(state.session);

      // Let the listener know when state changes.
      untrack(() => handlers.onSessionChange(state.session));
    });

    // As above, but this one is related to the plugin data and not the session
    // data.
    $effect(() => {
      // Access the session value to trigger an update.
      void JSON.stringify(state.data);

      // Let the listener know when state changes.
      untrack(() => handlers.onDataChange(state.data));
    });
  });
}


/******************************************************************************/

