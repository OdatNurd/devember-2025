/******************************************************************************/


import { ItemView, WorkspaceLeaf, type ViewStateResult } from 'obsidian';
import { mount, unmount } from 'svelte';
import { type KursvaroPlugin } from '#plugin';

import type { SampleComponentState, SampleComponentProps } from '#components/SampleComponent.types';

import SampleComponent from '#components/SampleComponent.svelte';


/******************************************************************************/


/* The ID value that uniquely identifies the type of view that we are. */
export const VIEW_TYPE_SAMPLE = 'sample-view';

/* This type represents the interface of the Svelte component. */
interface SampleComponentInstance {
  /* The component supports a function to set its state. */
  setComponentState: (data: SampleComponentState) => void;
}


/******************************************************************************/


/* This is a sample view that is intended to be used in a sidebar, such as in
 * the right one. It illustates how to persists data in the workspace so that if
 * there is anything about the view that needs to be kept between sessions in
 * the same workspace, that is possible. */
export class SampleView extends ItemView implements SampleComponentState {
  component: SampleComponentInstance | undefined;
  plugin: KursvaroPlugin;

  // Our saved state variables.
  count: number;

  constructor(leaf: WorkspaceLeaf, plugin: KursvaroPlugin) {
    super(leaf);
    this.plugin = plugin;

    // Initialize the values that are stored; the values here set the default
    // value for new views that are created.
    this.count = 69;
  }

  getViewType() : string {
    return VIEW_TYPE_SAMPLE;
  }

  getDisplayText() : string {
    return 'Sample View';
  }

  getIcon() : string {
    return 'dice-6';
  }

  /* Called when our view opens. This will attach a Svelte component and pass
   * that component the state that it needs in order to set itself up, as well
   * as a callback to invoke when state changes. */
  async onOpen() {
    this.contentEl.empty();

    this.component = mount<SampleComponentProps, SampleComponentInstance>(SampleComponent ,
      {
        target: this.contentEl,
        props: {
          name: this.plugin.settings.mySetting,
          initialCount: this.count,
          onNewCount: (count: number) => this.onNewCount(count)
        }
      });
  }

  /* Called when our view closes. This unmounts the component so that we don't
   * cause any memory leaks. */
  async onClose() {
    if (this.component !== undefined) {
      unmount(this.component);
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
  async setState(state: SampleComponentState, result: ViewStateResult): Promise<void> {
    // Update our internal state, and then pass it off to the component so that
    // it can update as well.
    this.count = state.count;

    if (this.component !== undefined) {
      this.component.setComponentState(state)
    }

    return super.setState(state, result);
  }

  /* Called by obsidian to get the state of our view. This only happens when the
   * state of the workspace is persisted to disk, which happens when layout
   * changes happen, or when something requests it. */
  getState(): Record<string, unknown> {
    return {
      count: this.count,
    };
  }

  /* This is a callback that we pass to the Svelte component in its props; every
   * time the count changes, it invokes us so that we can persist it. */
  onNewCount(count: number) {
    this.count = count;

    // We just request that our workspace save the layout, otherwise getState(
    // will likely not get called in time to save this change.
    this.app.workspace.requestSaveLayout();
  }
}


/******************************************************************************/
