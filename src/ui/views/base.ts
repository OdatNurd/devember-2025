/******************************************************************************/


import { ItemView, Plugin, WorkspaceLeaf } from 'obsidian';
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
export abstract class BaseSvelteItemView<P extends Plugin, S, D,
                                         CP extends { sharedState: GenericSavedState<S, D> },
                                         CI extends Record<string, unknown>> extends ItemView {
  plugin: P;
  integration: SvelteIntegration<S, D, CP, CI>;

  constructor(leaf: WorkspaceLeaf, plugin: P) {
    super(leaf);
    this.plugin = plugin;

    // Create the integration object that will orchestrate our persistence layer
    // and our reactivity layer.
    this.integration = new SvelteIntegration<S,D,CP,CI>();
  }

  /* Return the Svelte component that should be mounted within this view. */
  abstract getComponent() : Component<CP, CI>;

  /* Return the default data to be shared into the shared state that our
   * integration creates; this ultimately turns into a part of the properties
   * that are given to the component. */
  abstract getPluginData() : D;

  /* Return the properties to be used when the component is mounted. */
  getComponentProps(): CP {
    return {} as CP;
  }

  getInitialSession(): S {
    return {} as S;
  }

  /* This is triggered whenever any shared session state is altered; the default
   * implementation requests that the application save its layout, which will
   * cause the requisite methods for fetching what needs to be persisted to be
   * triggered. */
  onSessionChange(_session: S) {
    this.app.workspace.requestSaveLayout();
  }

  /* This is triggered whenever any shared plugin data is altered; there is no
   * default implementation here since all handling is subject to code control;
   * at a minimum this should update at least one field in the data and then
   * trigger a plugin data save. */
  abstract onDataChange(data: D) : void;

  /* Called when our view opens. This will attach a Svelte component and pass
   * that component the state that it needs in order to set itself up, as well
   * as a callback to invoke when state changes. */
  async onOpen() {
    // Empty the current content element so that we start from a clean start and
    // then mount the component in, invoking other methods as needed to gather
    // the data needed.
    this.contentEl.empty();
    this.integration.mount(this.getComponent(), this.contentEl,
      this.getComponentProps(), this.getInitialSession(), this.getPluginData(), {
      onSessionChange: (session) => this.onSessionChange(session),
      onDataChange: (data: D) => this.onDataChange(data),
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
}


/******************************************************************************/
