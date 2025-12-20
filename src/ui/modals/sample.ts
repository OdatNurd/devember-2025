/******************************************************************************/


import { type Component } from "svelte";
import { type KursvaroPlugin } from '#plugin';

import { BaseSvelteModal } from '#ui/modals/base';

import type { SampleModalSchema, SampleModalComponent, SampleModalProps } from '#components/SampleModal.types';

import SampleSvelteModal from '#components/SampleModal.svelte';


/******************************************************************************/


export class SampleModal
  extends BaseSvelteModal<KursvaroPlugin,
                         SampleModalSchema,
                         SampleModalComponent> {
  constructor(plugin: KursvaroPlugin, title: string) {
    super(plugin, title);
  }

  /* Return the Svelte component that should be mounted within this view. */
  getComponent() : Component<SampleModalProps, SampleModalComponent['exports']> {
    return SampleSvelteModal
  };

  /* Return the default ephemeral state. */
  getDefaultEphemeralState(): SampleModalSchema['ephemeral'] {
      return this.plugin.state.ephemeral;
  }
}


/******************************************************************************/
