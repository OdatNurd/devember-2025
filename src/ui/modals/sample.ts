/******************************************************************************/


import { App, Modal } from 'obsidian';
import { mount, unmount } from 'svelte';
import { type KursvaroPlugin } from '#plugin';

import type { SampleModalInstance, SampleModalProps } from '#components/SampleModal.types';

import SampleSvelteModal from '#components/SampleModal.svelte';


/******************************************************************************/


export class SampleModal extends Modal {
  component: SampleModalInstance | undefined;
  plugin: KursvaroPlugin;

  constructor(app: App, plugin: KursvaroPlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    // Mount the Svelte component and save the instance
    this.component = mount<SampleModalProps, SampleModalInstance>(SampleSvelteModal ,
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
