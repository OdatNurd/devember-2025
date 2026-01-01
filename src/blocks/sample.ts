/******************************************************************************/


import { type Component } from 'svelte';
import { type KursvaroPlugin } from '#plugin';

import { BaseSvelteRenderChild } from '#blocks/base';

import type { SampleBlockSchema, SampleBlockComponent, SampleBlockProps } from '#components/blocks/Sample.types';
import SampleBlockComponentView from '#components/blocks/Sample.svelte';


/******************************************************************************/


/* Instances of this class are registered with the application as the handler to
 * use for a code block whose language is 'sample'. In doing so, whenever the
 * app needs to render such a block, it will create an instance of us to do
 * the rendering work needed.
 *
 * The contract is that we should add something to the container element that we
 * are given. Any changes to the DOM in that element will be realized in real
 * time, as far as I am aware. */
export class SampleBlockRenderChild
  extends BaseSvelteRenderChild<KursvaroPlugin,
                                SampleBlockSchema,
                                SampleBlockComponent> {

  /* Return the Svelte component that should be mounted within this view. */
  getComponent() : Component<SampleBlockProps> {
    return SampleBlockComponentView;
  }

  /* Return the properties to be used when the component is mounted. */
  getComponentProps() : SampleBlockComponent['props'] {
    return {
      source: this.source
    }
  }

  /* Return the default data to be shared into the shared state that our
   * integration creates; this ultimately turns into a part of the properties
   * that are given to the component. */
  getPluginData() : SampleBlockSchema['data'] {
    return this.plugin.state.data;
  }
}


/******************************************************************************/
