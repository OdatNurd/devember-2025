/******************************************************************************/

import { MarkdownRenderChild, Plugin } from 'obsidian';

import { type Component } from "svelte";
import { type StateSchema } from "#state/generic";
import { SvelteIntegration, type ComponentSchema, type GetProps, type GetExports } from '#ui/svelte';


/******************************************************************************/


/* Instances of this class are registered with the application as the handler to
 * use for a code block whose language is 'boobs'. In doing so, whenever the
 * app needs to render such a block, it will create an instance of us to do
 * the rendering work needed.
 *
 * The contract is that we should add something to the container element that we
 * are given. Any changes to the DOM in that element will be realized in real
 * time, as far as I am aware. */
export abstract class BaseSvelteRenderChild<P extends Plugin,
                                            S extends StateSchema = StateSchema,
                                            C extends ComponentSchema = ComponentSchema,
                                            Props extends GetProps<S, C> = GetProps<S, C>,
                                            Exports extends GetExports<C> = GetExports<C>> extends MarkdownRenderChild {
  plugin: P;
  language: string;
  source: string;
  integration: SvelteIntegration<S, C, Props, Exports>;

  /* When we are constructed, we get the language that we are being asked to
   * support, the element that we should be updating, and the source of the code
   * block which is used to determine what the element should look like. */
  constructor(plugin: P, containerEl: HTMLElement, language: string, source: string) {
    super(containerEl);
    this.plugin = plugin;
    this.language = language;
    this.source = source;

    this.integration = new SvelteIntegration();
  }

  /* Return the Svelte component that should be mounted within this view. */
  abstract getComponent() : Component<Props, Exports>;

  /* Return the properties to be used when the component is mounted. */
  getComponentProps(): C['props'] {
    return {} as C['props'];
  }

  /* Return the default data to be shared into the shared state that our
   * integration creates; this ultimately turns into a part of the properties
   * that are given to the component. */
  getPluginData() : S['data'] { return undefined as unknown as S['data']; }

  /* The life cycle hook for our processing; this gets invoked when we are
   * attached to the appropriate element, and is our opportunity to update the
   * DOM in the container element we were given as we see fit given the source
   * data we got in the constructor. */
  async onload() {
    this.integration.mount({
      component: this.getComponent(),
      target: this.containerEl,
      props: this.getComponentProps(),
      data: this.getPluginData(),
    });
  }

  onunload() {
    this.integration.unmount();
  }
}


/******************************************************************************/
