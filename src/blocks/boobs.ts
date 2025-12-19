/******************************************************************************/

import { MarkdownRenderChild } from 'obsidian';
import { type KursvaroPlugin } from '#plugin';

import { SvelteIntegration } from '#ui/svelte';

import type { BoobsBlockSchema, BoobsBlockComponent } from '#components/blocks/Boobs.types';
import BoobsBlockComponentView from '#components/blocks/Boobs.svelte';


/******************************************************************************/


/* Instances of this class are registered with the application as the handler to
 * use for a code block whose language is 'boobs'. In doing so, whenever the
 * app needs to render such a block, it will create an instance of us to do
 * the rendering work needed.
 *
 * The contract is that we should add something to the container element that we
 * are given. Any changes to the DOM in that element will be realized in real
 * time, as far as I am aware. */
export class BoobsBlockRenderChild extends MarkdownRenderChild {
  plugin: KursvaroPlugin;
  language: string;
  source: string;
  integration: SvelteIntegration<BoobsBlockSchema, BoobsBlockComponent>;

  /* When we are constructed, we get the language that we are being asked to
   * support, the element that we should be updating, and the source of the code
   * block which is used to determine what the element should look like. */
  constructor(plugin: KursvaroPlugin, containerEl: HTMLElement, language: string, source: string) {
    super(containerEl);
    this.plugin = plugin;
    this.language = language;
    this.source = source;

    this.integration = new SvelteIntegration();
  }

  /* The life cycle hook for our processing; this gets invoked when we are
   * attached to the appropriate element, and is our opportunity to update the
   * DOM in the container element we were given as we see fit given the source
   * data we got in the constructor. */
  async onload() {
    this.integration.mount({
      component: BoobsBlockComponentView,
      target: this.containerEl,
      props: { source: this.source },
      // TODO: Not sure why, but this is not being enforced like it should be?
      //       If it is missing, nothing seems to complain.
      data: this.plugin.state.data,
    });
  }


  onunload() {
    this.integration.unmount();
  }
}


/******************************************************************************/
