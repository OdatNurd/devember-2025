/******************************************************************************/


import { Modal, Plugin  } from 'obsidian';
import { type Component } from "svelte";

import { type StateSchema } from "#state/generic";
import { SvelteIntegration, type ComponentSchema, type GetProps, type GetExports } from '#ui/svelte';


/******************************************************************************/


/* This class represents an augmented version of the Modal Obsidian class, with
 * built in functionality to be able to use a Svelte component to visialize the
 * interface. In addition, the view will have the properties needed to populate
 * populate both ephemeral data and plugin data directly into the properties
 * of the Svelte component, and be told whenever those properties change, so as
 * to make the UI reactive without a lot of boilerplate code.
 *
 * Technically the schema used here also allows session data, but since a Modal
 * is not persistent enough to save in the session, that portion of the schema
 * is ignored here. */
export abstract class BaseSvelteModal<P extends Plugin,
                                      S extends StateSchema = StateSchema,
                                      C extends ComponentSchema = ComponentSchema,
                                      Props extends GetProps<S, C> = GetProps<S, C>,
                                      Exports extends GetExports<C> = GetExports<C>> extends Modal {
  plugin: P;
  title: string;
  integration: SvelteIntegration<S, C, Props, Exports>;

  constructor(plugin: P, title: string) {
    super(plugin.app);
    this.plugin = plugin;
    this.title = title;

    // Create the integration object that will orchestrate our persistence layer
    // and our reactivity layer.
    this.integration = new SvelteIntegration<S, C, Props, Exports>();
  }

  /* Return the Svelte component that should be mounted within this modal. */
  abstract getComponent() : Component<Props, Exports>;

  /* Return the default data to be shared into the shared state that our
   * integration creates; this ultimately turns into a part of the properties
   * that are given to the component. */
  getPluginData() : S['data'] { return undefined as unknown as S['data']; }

  /* Return the default data to be used for the ephemeral state. */
  getDefaultEphemeralState(): S['ephemeral'] { return undefined as unknown as S['ephemeral']; }

  /* This is triggered whenever any shared plugin data is altered; there is no
   * default implementation here since all handling is subject to code control;
   * at a minimum this should update at least one field in the data and then
   * trigger a plugin data save. */
  onDataChange(_data: S['data']) : void { }

  /* This is triggered whenever any shared ephemeral state is altered. */
  onEphemeralChange(_ephemeral: S['ephemeral']): void { }

  /* Return the properties to be used when the component is mounted. */
  getComponentProps(): C['props'] {
    return {} as C['props'];
  }

  /* Called when our view opens. This will attach a Svelte component and pass
   * that component the state that it needs in order to set itself up, as well
   * as a callback to invoke when state changes. */
  async onOpen() {
    // Empty the current content element so that we start from a clean start and
    // then mount the component in, invoking other methods as needed to gather
    // the data needed.
    this.contentEl.empty();

    this.setTitle(this.title);
    this.integration.mount(this.getComponent(), this.contentEl,
      this.getComponentProps(),
      {  },
      this.getPluginData(),
      this.getDefaultEphemeralState(),
      {
        onDataChange: (data) => this.onDataChange(data),
        onEphemeralChange: (ephemeral) => this.onEphemeralChange(ephemeral),
      });
  }

  /* Called when our view closes. This unmounts the component so that we don't
   * cause any memory leaks. */
  async onClose() {
    if (this.integration !== undefined) {
      this.integration.unmount();
    }
    this.contentEl.empty();
  }
}


/******************************************************************************/

