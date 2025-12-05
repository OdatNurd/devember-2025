/******************************************************************************/


import { ItemView, WorkspaceLeaf } from 'obsidian';
import SampleComponent from '#components/SampleComponent.svelte';

import { type KursvaroPlugin } from '../plugin';
import { mount, unmount } from 'svelte';


/******************************************************************************/


/* The ID value that uniquely identifies the type of view that we are. */
export const VIEW_TYPE_SAMPLE = 'sample-view';


/******************************************************************************/


export class SampleView extends ItemView {
  component: Record<string, unknown> | undefined;
  plugin: KursvaroPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: KursvaroPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() : string {
    return VIEW_TYPE_SAMPLE;
  }

  getDisplayText() : string {
    return 'Sample View';
  }

  getIcon() : string {
    return 'dice';
  }

  async onOpen() {
    const container = this.contentEl;
    container.empty();

    // Mount the Svelte component and save the instance
    this.component = mount(SampleComponent, {
      target: container,
      props: {
        name: this.plugin.settings.mySetting
      }
    });
  }

  async onClose() {
    const container = this.contentEl;

    // Unmount the component to prevent memory leaks
    if (this.component) {
      unmount(this.component);
    }

    container.empty();
  }
}


/******************************************************************************/
