/******************************************************************************/


import { App, Modal } from 'obsidian';
import { mount, unmount } from 'svelte';
import { type KursvaroPlugin } from '#plugin';

import SampleComponent from '#components/SampleComponent.svelte';


/******************************************************************************/


export class SampleModal extends Modal {
  component: Record<string, unknown> | undefined;
  plugin: KursvaroPlugin;

  constructor(app: App, plugin: KursvaroPlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    // Mount the Svelte component and save the instance
    this.component = mount(SampleComponent, {
      target: contentEl,
      props: {
        name: this.plugin.settings.mySetting,
        initialCount: 0,
        onNewCount: () => {}
      }
    });
  }

  onClose() {
    const { contentEl } = this;

    // Unmount the component to prevent memory leaks
    if (this.component) {
      unmount(this.component);
    }

    contentEl.empty();
  }
}


/******************************************************************************/
