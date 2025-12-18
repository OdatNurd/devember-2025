/******************************************************************************/

import { MarkdownRenderChild } from 'obsidian';
import { type KursvaroPlugin } from '#plugin';

import { SvelteIntegration } from '#ui/svelte';

import type { BoobsBlockSessionData, BoobsBlockPluginData,
              BoobsBlockProps, BoobsBlockInstance } from '#components/blocks/Boobs.types';
import BoobsBlockComponent from '#components/blocks/Boobs.svelte';


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
  integration: SvelteIntegration<BoobsBlockSessionData, BoobsBlockPluginData, BoobsBlockProps, BoobsBlockInstance>;

  /* When we are constructed, we get the language that we are being asked to
   * support, the element that we should be updating, and the source of the code
   * block which is used to determine what the element should look like. */
  constructor(plugin: KursvaroPlugin, containerEl: HTMLElement, language: string, source: string) {
    console.log(`creating instance of a ${language} block handler`);
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
    console.log(`triggering an onload for a ${this.language} block`);
    this.integration.mount({
      component: BoobsBlockComponent,
      target: this.containerEl,
      props: { source: this.source },
      data: { content: this.plugin.data.content },
    });
  }


  onunload() {
    this.integration.unmount();
  }
}


/******************************************************************************/
