/******************************************************************************/


import { Modal } from 'obsidian';
import { type KursvaroPlugin } from '#plugin';

import { SvelteIntegration } from '#ui/svelte';

import type { SampleModalSchema, SampleModalComponent, SampleModalProps, SampleModalExports } from '#components/SampleModal.types';

import SampleSvelteModal from '#components/SampleModal.svelte';


/******************************************************************************/


export class SampleModal extends Modal {
  plugin: KursvaroPlugin;
  integration: SvelteIntegration<SampleModalSchema, SampleModalComponent, SampleModalProps, SampleModalExports>;
  title: string;

  constructor(plugin: KursvaroPlugin, title: string) {
    super(plugin.app);
    this.plugin = plugin;
    this.title = title;

    // Create the integration object that will orchestrate our persistence layer
    // and our reactivity layer.
    this.integration = new SvelteIntegration<SampleModalSchema, SampleModalComponent, SampleModalProps, SampleModalExports>();
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    this.integration.mount({
      component: SampleSvelteModal,
      target: this.contentEl,
      props: { title: this.title },
      ephemeral: this.plugin.state.ephemeral,
    });
  }

  onClose() {
    if (this.integration !== undefined) {
      this.integration.unmount();
    }
    this.contentEl.empty();
  }
}


/******************************************************************************/
