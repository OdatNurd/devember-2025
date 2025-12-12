/******************************************************************************/


import { Modal } from 'obsidian';
import { mount, unmount } from 'svelte';
import { type KursvaroPlugin } from '#plugin';

import type { SampleModalInstance, SampleModalProps } from '#components/SampleModal.types';

import SampleSvelteModal from '#components/SampleModal.svelte';


/******************************************************************************/


export class SampleModal extends Modal {
  component: SampleModalInstance | undefined;
  plugin: KursvaroPlugin;
  title: string;

  constructor(plugin: KursvaroPlugin, title: string) {
    super(plugin.app);
    this.plugin = plugin;
    this.title = title;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    // Mount the Svelte component and save the instance
    this.component = mount<SampleModalProps, SampleModalInstance>(SampleSvelteModal ,
      {
        target: contentEl,
        props: {
          title: this.title,
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
