/******************************************************************************/


import { App, Modal } from 'obsidian';
import { mount, unmount } from 'svelte';
import { type KursvaroPlugin } from '#plugin';

import type { SampleComponentInstance, SampleComponentProps } from '#components/SampleComponent.types';

import SampleComponent from '#components/SampleComponent.svelte';


/******************************************************************************/


export class SampleModal extends Modal {
  component: SampleComponentInstance | undefined;
  plugin: KursvaroPlugin;

  constructor(app: App, plugin: KursvaroPlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    // Mount the Svelte component and save the instance
    this.component = mount<SampleComponentProps, SampleComponentInstance>(SampleComponent ,
      {
        target: contentEl,
        props: {
          name: `${this.plugin.settings.mySetting} Modal`,
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
