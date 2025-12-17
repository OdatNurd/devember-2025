/******************************************************************************/


import { type Component, mount, unmount } from "svelte";

import { type WatchHandlers, GenericSavedState, watch } from "#state/generic";


/******************************************************************************/


/* This interface defines the arguments that are provided to mount function in
 * the SvelteIntegration class; this allows either bundling the arguments into
 * an object, OR calling it with direct objects. */
export interface MountOptions<S, D,
                              P extends { sharedState: GenericSavedState<S, D> },
                              C extends Record<string, unknown>> {
  component: Component<P, C>,
  target: HTMLElement;
  props: Omit<P, 'sharedState'>;
  session: S;
  data: D;
  handlers: WatchHandlers<S, D>;
}


/******************************************************************************/


/* This class is a wrapper around the core code needed to mount a Svelte
 * component into a content element somewhere within the Obsidian UI structure
 * and tie a set of data fields for both the session data and the persisted
 * plugin data needed by the used component.
 *
 * This easily allows for mounting the component and being told whenever the
 * data in the component changes, so that code within the plugin can act upon it
 * as needed. This communication also goes two ways; changes to data in the
 * plugin code will cause updates in the mounted Svelte component. */
export class SvelteIntegration<S, D,
                               P extends { sharedState: GenericSavedState<S, D> },
                               C extends Record<string, unknown>> {
  // The underlying mounted Svelte component that we're using as a visualizer.
  component: C | undefined;

  // The state object that is shared between this code and the mounted svelte
  // component.
  state: GenericSavedState<S, D> | undefined;

  // The function that cleans up our effects when we're done.
  cleanup: (() => void) | undefined;

  /* Construct the instance; if we get an options object, then this will also
   * automatically mount the component at construction time, which is a useful
   * shortcut for components that are not bound to views or which can be mounted
   * right away. */
  constructor(options?: MountOptions<S, D, P, C>) {
    if (options !== undefined) {
      this.mount(
        options.component,
        options.target,
        options.props,
        options.session,
        options.data,
        options.handlers,
      )
    }
  }

  /* Mount given component onto the provided element, giving it the props here
   * during the mount process.
   *
   * The internal state will be created using the session and plugin data values
   * that are provided, and will be connected to the given handlers, which will
   * be invoked whenever the state changes. */
  mount(component: Component<P, C>,
        target: HTMLElement,
        props: Omit<P, 'sharedState'>,
        session: S,
        data: D,
        handlers: WatchHandlers<S, D>) {

    // Create a shared state object to track the session data and plugin data
    // that we will be sharing with the mounted component.
    // TODO: The arguments here are optional, so they should be optional for us
    //       as well? This may or may not have ramifications.
    this.state = new GenericSavedState<S, D>({ session, data });

    // Set up the watches that will get triggered when any state changes in the
    // component.
    this.cleanup = watch(this.state, {
      onSessionChange: handlers.onSessionChange,
      onDataChange: handlers.onDataChange,
    });

    // Mount the component into the passed in element.
    this.component = mount<P, C>(component, {
      target,
      props: { ...props, sharedState: this.state } as P,
    });
  }

  /* Reverse the mount that occurs when calling the mount method; this will
   * clean up any handlers that were provided, and the unmount the component
   * from the DOM before discarding the local shared state. */
  unmount() {
    if (this.cleanup !== undefined) {
      this.cleanup();
    }
    if (this.component !== undefined) {
      unmount(this.component);
    }

    this.state = undefined;
  }

  /* Update the session information that is stored in the current integration
   * instance with the session information provided. This is safe to call if
   * the integration has not been initialized yet. */
  updateSession(session: Partial<S>): void {
    if (this.state !== undefined) {
      Object.assign(this.state.session as object, session);
    }
  }
}


/******************************************************************************/
