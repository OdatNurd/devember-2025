/******************************************************************************/


import { type Component, mount, unmount } from "svelte";

import { type WatchHandlers, type StateSchema, GenericSavedState, watch } from "#state/generic";


/******************************************************************************/


/* This interface defines the structure that any component definition must
 * adhere to. It allows for optional props (inputs) and exports (API functions).
 *
 * If 'props' is defined, it represents the custom props passed to the component
 * (excluding sharedState, which is injected automatically by the integration).
 *
 * If 'exports' is defined, it represents the functions/values exported by the
 * component instance.
 *
 * Both are optional, should they not be reauired.*/
export interface ComponentSchema {
  props?: Record<string, unknown>;
  exports?: Record<string, unknown>;
}


/* Helper type to extract the final Props object; this combines the user defined
 * props from the Component Schema with the system defined sharedState prop that
 * always gets injected in. */
export type GetProps<S extends StateSchema, C extends ComponentSchema> =
  (C['props'] extends Record<string, unknown> ? C['props'] : Record<string, unknown>) & { sharedState: GenericSavedState<S> };

/* Helper type to extract the final Exports object (the component instance) from
 * the component schema. */
export type GetExports<C extends ComponentSchema> =
  C['exports'] extends Record<string, unknown> ? C['exports'] : Record<string, unknown>;


/******************************************************************************/


/* This interface defines the arguments provided to the mount function. */
export interface MountOptions<S extends StateSchema,
                              C extends ComponentSchema,
                              P extends GetProps<S, C>,
                              I extends GetExports<C>> {
  component: Component<P, I>,
  target: HTMLElement;
  props?: C['props'];
  session?: S['session'];
  data?: S['data'];
  ephemeral?: S['ephemeral'];
  handlers?: WatchHandlers<S>;
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
export class SvelteIntegration<S extends StateSchema = StateSchema,
                               C extends ComponentSchema = ComponentSchema,
                               P extends GetProps<S, C> = GetProps<S, C>,
                               I extends GetExports<C> = GetExports<C>> {
  // The underlying mounted Svelte component that we're using as a visualizer.
  component: I | undefined;

  // The state object that is shared between this code and the mounted svelte
  // component.
  state: GenericSavedState<S> | undefined;

  // The function that cleans up our effects when we're done.
  cleanup: (() => void) | undefined;

  /* Construct the instance; if we get an options object, then this will also
   * automatically mount the component at construction time, which is a useful
   * shortcut for components that are not bound to views or which can be mounted
   * right away. */
  constructor(options?: MountOptions<S, C, P, I>) {
    if (options !== undefined) {
      this.mount(options);
    }
  }

  // Overload 1; mount call that specificaly takes an options object and mounts
  // using that.
  mount(options: MountOptions<S, C, P, I>) : void;

  // Overload 2; mount call that takes individual arguments and mounts that way.
  mount(component: Component<P, I>,
        target: HTMLElement,
        props?: C['props'],
        session?: S['session'],
        data?: S['data'],
        ephemeral?: S['ephemeral'],
        handlers?: WatchHandlers<S>) : void;

  /* Mount given component onto the provided element, giving it the props here
   * during the mount process.
   *
   * The internal state will be created using the session and plugin data values
   * that are provided, and will be connected to the given handlers, which will
   * be invoked whenever the state changes. */
  mount(arg1: MountOptions<S, C, P, I> | Component<P, I>,
        arg2?: HTMLElement,
        arg3?: C['props'],
        arg4?: S['session'],
        arg5?: S['data'],
        arg6?: S['ephemeral'],
        arg7?: WatchHandlers<S>) {

    // The options that we will use in order to perform the mount.
    let options: MountOptions<S, C, P, I>;

    // Based on our overloads, only the first argument is strictly required; so
    // if the second argument is undefined, then we were given options; otherwise
    // we were given full arguments, and in that case we should construct our
    // options based on them, so that we have a smoother code path below.
    if (arg2 === undefined) {
      options = arg1 as MountOptions<S, C, P, I>;
    } else {
      options = {
        component: arg1 as Component<P, I>,
        target: arg2,
        props: arg3,
        session: arg4,
        data: arg5,
        ephemeral: arg6,
        handlers: arg7,
      }
    }

    // Create a shared state object to track the session data and plugin data
    // that we will be sharing with the mounted component.
    this.state = new GenericSavedState<S>({
      session: options.session,
      data: options.data,
      ephemeral: options.ephemeral,
    });

    // Set up the watches that will get triggered when any state changes in the
    // component.
    this.cleanup = watch(this.state, {
      onSessionChange: options.handlers?.onSessionChange,
      onDataChange: options.handlers?.onDataChange,
      onEphemeralChange: options.handlers?.onEphemeralChange,
    });

    // Combine the props we were given with the explicit shared state that all
    // components get.
    const props = { ...options.props, sharedState: this.state } as P;

    // Mount the component into the passed in element.
    this.component = mount<P, I>(options.component, {
      target: options.target,
      props,
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
  updateSession(session: Partial<S['session']>): void {
    if (this.state !== undefined && this.state.session !== undefined) {
      Object.assign(this.state.session as object, session);
    }
  }

  /* Update the ephemeral information that is stored in the current integration
   * instance with the ephemeral information provided. This is safe to call if
   * the integration has not been initialized yet. */
  updateEphemeral(ephemeral: Partial<S['ephemeral']>): void {
    if (this.state !== undefined && this.state.ephemeral !== undefined) {
      Object.assign(this.state.ephemeral as object, ephemeral);
    }
  }
}


/******************************************************************************/
