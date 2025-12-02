/******************************************************************************/


import { App, Modal } from 'obsidian';
import SampleComponent from '#components/SampleComponent.svelte';

import { mount, unmount } from 'svelte';


/******************************************************************************/


export class SampleModal extends Modal {
  component: Record<string, unknown> | undefined;

  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    // Mount the Svelte component and save the instance
    this.component = mount(SampleComponent, {
      target: contentEl,
      props: {
        name: "Svelte 5 Modal"
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
