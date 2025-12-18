/******************************************************************************/


import { type ViewStateResult, ItemView, Plugin, WorkspaceLeaf } from 'obsidian';
import { type Component } from "svelte";

import { GenericSavedState } from "#state/generic";
import { SvelteIntegration } from '#ui/svelte';


/******************************************************************************/


/* This class represents an augmented version of the ItemView Obsidian class,
 * with built in functionality to be able to use a Svelte component to visialize
 * the interface. In addition, the view will have the properties needed to
 * populate both view session data and plugin data directly into the properties
 * of the Svelte component, and be told whenever those properties change, so as
 * to make the UI reactive without a lot of boilerplate code. */
export abstract class BaseSvelteItemView<P extends Plugin,
                                         S = undefined, D = undefined, E = undefined,
                                         CP extends { sharedState: GenericSavedState<S, D, E> } = { sharedState: GenericSavedState<S, D, E> },
                                         CI extends Record<string, unknown> = Record<string, unknown>> extends ItemView {
  plugin: P;
  integration: SvelteIntegration<S, D, E, CP, CI>;
  loadedSessionState: Partial<S> | undefined;

  constructor(leaf: WorkspaceLeaf, plugin: P) {
    super(leaf);
    this.plugin = plugin;

    // Create the integration object that will orchestrate our persistence layer
    // and our reactivity layer.
    this.integration = new SvelteIntegration<S, D, E, CP, CI>();
  }

  /* Return the Svelte component that should be mounted within this view. */
  abstract getComponent() : Component<CP, CI>;

  /* Return the default data to be shared into the shared state that our
   * integration creates; this ultimately turns into a part of the properties
   * that are given to the component. */
  getPluginData() : D { return undefined as unknown as D; }

  /* Return the default data to be used to set up the mounted view. This is used
   * as the initial session data object when a view is first created. */
  getDefaultSessionState(): S { return undefined as unknown as S; }

  /* Return the default data to be used for the ephemeral state. */
  getDefaultEphemeralState(): E { return undefined as unknown as E; }

  /* This is triggered whenever any shared plugin data is altered; there is no
   * default implementation here since all handling is subject to code control;
   * at a minimum this should update at least one field in the data and then
   * trigger a plugin data save. */
  onDataChange(_data: D) : void { }

  /* This is triggered whenever any shared session state is altered; the default
   * implementation requests that the application save its layout, which will
   * cause the requisite methods for fetching what needs to be persisted to be
   * triggered. */
  onSessionChange(_session: S) {
    this.app.workspace.requestSaveLayout();
  }

  /* This is triggered whenever any shared ephemeral state is altered. */
  onEphemeralChange(_ephemeral: E): void { }

  /* Return the properties to be used when the component is mounted. */
  getComponentProps(): CP {
    return {} as CP;
  }

  /* Called when our view opens. This will attach a Svelte component and pass
   * that component the state that it needs in order to set itself up, as well
   * as a callback to invoke when state changes. */
  async onOpen() {
    // Empty the current content element so that we start from a clean start and
    // then mount the component in, invoking other methods as needed to gather
    // the data needed.
    this.contentEl.empty();
    const initialSessionData = {
      ...(this.getDefaultSessionState() ?? {}),
      ...(this.loadedSessionState ?? {})
    } as S;
    this.integration.mount(this.getComponent(), this.contentEl,
      this.getComponentProps(),
      initialSessionData,
      this.getPluginData(),
      this.getDefaultEphemeralState(),
      {
        onSessionChange: (session) => this.onSessionChange(session),
        onDataChange: (data: D) => this.onDataChange(data),
        onEphemeralChange: (ephemeral: E) => this.onEphemeralChange(ephemeral),
      });
  }

  /* Called when our view closes. This unmounts the component so that we don't
   * cause any memory leaks. */
  async onClose() {
    if (this.integration !== undefined) {
      this.integration.unmount();
    }
    this.contentEl.empty();
  }


  /* Called by Obsidian to tell us what state we saved in a previous call to
   * getState() so that we can set ourselves up. This is invoked when the
   * workspace loads, so that we can put shared state back.
   *
   * This only covers the kind of state that is transient to a view; once a
   * view closes, its saved data is discarded, so this should not be used for
   * user data. */
  async setState(state: S, result: ViewStateResult): Promise<void> {
    // Store the state that we were given, then update the session information
    // in the integration.
    this.loadedSessionState = state;
    this.integration.updateSession(state);

    // Let the super do what it do
    return super.setState(state, result);
  }

  /* Called by Obsidian to get the state of our view. This only happens when the
   * state of the workspace is persisted to disk, which happens when layout
   * changes happen, or when something requests it. */
  getState(): Record<string, unknown> {
    // If our integration is set up, then use the session state as the state to
    // return.
    if (this.integration.state !== undefined) {
        return this.integration.state.session as Record<string, unknown>;
    }

    // When there is no integration, use what srtState gave us last time, if
    // anything; this is the placeholder that will be used to hold the value in
    // case setState() gets called before onOpen. This does not seem likely or
    // possible based on testing, but various places on the internet seem to
    // think it is, so maybe it is a version thing or something.
    return (this.loadedSessionState as Record<string, unknown>) ?? {};
  }
}


/******************************************************************************/
