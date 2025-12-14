/******************************************************************************/


import { ItemView, WorkspaceLeaf, type ViewStateResult } from 'obsidian';
import { mount, unmount } from 'svelte';
import { type KursvaroPlugin } from '#plugin';

import { GenericViewState, watch } from '#state/generic';

import type { SampleViewInstance, SampleViewProps, SampleViewSessionData, SampleViewPluginData } from '#components/SampleView.types';

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
  viewState: GenericViewState<SampleViewSessionData, SampleViewPluginData>;

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
    console.log('plugin data at start: ', this.plugin.data);
    this.viewState = new GenericViewState<SampleViewSessionData, SampleViewPluginData>(
     { count: this.count },
     { content: this.plugin.data.content },
    );
    console.log('viewState at start: ', this.viewState);

    // Set up a watcher that fires whenever the component updates the state of
    // things.
    this.cleanup = watch(this.viewState, {
      // When session data changes, ask Obsidian to save the layout; this causes
      // it to call our getData(), which will pluck the data that it needs
      // directly from the session data.
      onSessionChange: (session: SampleViewSessionData) => {
        console.log('session data has changed:', JSON.stringify(session));
        this.app.workspace.requestSaveLayout();
      },

      // When plugin related data updates, cache the change in the actual plugin
      // data and then persist it to disk.
      onDataChange: (data: SampleViewPluginData) => {
        console.log('plugin data has changed', JSON.stringify(data));
        this.plugin.data.content = data.content;
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
  async setState(state: SampleViewSessionData, result: ViewStateResult): Promise<void> {
    console.log(`got a call to setState!`, state);

    this.count = state?.count ?? 0;

    // Update the live state if the view is already open; this will cause the
    // view to update automagically.
    if (this.viewState) {
      console.log('updating session count');
      this.viewState.session.count = this.count;
    }

    return super.setState(state, result);
  }

  /* Called by obsidian to get the state of our view. This only happens when the
   * state of the workspace is persisted to disk, which happens when layout
   * changes happen, or when something requests it. */
  getState(): Record<string, unknown> {
    console.log(`got a call to getState!`, JSON.stringify(this.viewState.session));
    return {
      count: this.viewState?.session?.count ?? 0,
    };
  }
}


/******************************************************************************/
