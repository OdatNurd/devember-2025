/******************************************************************************/


import { ItemView, WorkspaceLeaf, type ViewStateResult } from 'obsidian';
import { mount, unmount } from 'svelte';
import { type KursvaroPlugin } from '#plugin';

import type { SampleViewInstance, SampleViewProps } from '#components/SampleView.types';
import { SampleViewState, watch } from '#state/SampleView';

import SampleSvelteView from '#components/SampleView.svelte';


/******************************************************************************/


/* The ID value that uniquely identifies the type of view that we are. */
export const VIEW_TYPE_SAMPLE = 'sample-view';


/******************************************************************************/


/* This is a sample view that is intended to be used in a sidebar, such as in
 * the right one. It illustates how to persists data in the workspace so that if
 * there is anything about the view that needs to be kept between sessions in
 * the same workspace, that is possible. */
export class SampleView extends ItemView {
  component: SampleViewInstance | undefined;
  plugin: KursvaroPlugin;
  cleanup: (() => void) | undefined;

  // The data that we share between us and the component.
  viewState: SampleViewState | undefined;

  // Our saved state variables.
  count: number;

  constructor(leaf: WorkspaceLeaf, plugin: KursvaroPlugin) {
    super(leaf);
    this.plugin = plugin;

    // Initialize the values that are stored; the values here set the default
    // value for new views that are created.
    this.count = 0;
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

    // Create the state that will be shared between us and the component. The
    // click count will be stored in the view information and restored from
    // the workspace layout; the content comes from the plugin data in data.json
    // and gets stored back there as well.
    this.viewState = new SampleViewState(this.count, this.plugin.data.content);

    // Set up a watcher that fires whenever the component updates the state of
    // things.
    //
    // TODO: This is currently blasting the data.json file every time the
    //       count button is clicked, which is suboptimal for our purposes but
    //       good enough for now.
    this.cleanup = watch(this.viewState, () => {
      // Ensure that getState will be called so that things will persist.
      this.app.workspace.requestSaveLayout();

      console.log(`got a call to watch!`, this.viewState);

      if (this.viewState !== undefined) {
        console.log('updating saved plugin data');
        this.plugin.data.content = this.viewState.content;
        this.plugin.savePluginData();
      }
    });

    // We can mount the component now.
    this.component = mount<SampleViewProps, SampleViewInstance>(SampleSvelteView ,
      {
        target: this.contentEl,
        props: {
          title: this.plugin.settings.mySetting,
          sharedState: this.viewState,
        }
      });
  }

  /* Called when our view closes. This unmounts the component so that we don't
   * cause any memory leaks. */
  async onClose() {
    if (this.cleanup !== undefined) {
      this.cleanup();
    }
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
  async setState(state: SampleViewState, result: ViewStateResult): Promise<void> {
    console.log(`got a call to setState!`, state);

    this.count = state?.count ?? 0;

    // Update the live state if the view is already open; this will cause the
    // view to update automagically.
    if (this.viewState) {
      this.viewState.count = this.count;
    }

    return super.setState(state, result);
  }

  /* Called by obsidian to get the state of our view. This only happens when the
   * state of the workspace is persisted to disk, which happens when layout
   * changes happen, or when something requests it. */
  getState(): Record<string, unknown> {
      console.log(`got a call to getState!`, this.viewState);
    return {
      count: this.viewState?.count ?? 0,
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
