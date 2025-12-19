/******************************************************************************/


import { WorkspaceLeaf } from 'obsidian';
import { type Component } from 'svelte';
import { type KursvaroPlugin } from '#plugin';

import { BaseSvelteItemView } from '#ui/views/base';

import type { SampleViewSchema, SampleViewComponent, SampleViewProps } from '#components/SampleView.types';

import SampleSvelteView from '#components/SampleView.svelte';


/******************************************************************************/


/* The ID value that uniquely identifies the type of view that we are. */
export const VIEW_TYPE_SAMPLE = 'sample-view';


/******************************************************************************/


/* This is a sample view that is intended to be used in a sidebar, such as in
 * the right one. It illustates how to persists data in the workspace so that if
 * there is anything about the view that needs to be kept between sessions in
 * the same workspace, that is possible. */
export class SampleView
  extends BaseSvelteItemView<KursvaroPlugin,
                             SampleViewSchema,
                             SampleViewComponent>
{
  constructor(leaf: WorkspaceLeaf, plugin: KursvaroPlugin) {
    super(leaf, plugin);
  }

  getViewType() : string {
    return VIEW_TYPE_SAMPLE;
  }

  getDisplayText() : string {
    return 'Sample View';
  }

  getIcon() : string {
    return 'dice-6';
  }

  /* Return the Svelte component that should be mounted within this view. */
  getComponent() : Component<SampleViewProps, SampleViewComponent['exports']> {
    return SampleSvelteView
  };

  /* Return the properties to be used when the component is mounted. */
  getComponentProps(): SampleViewComponent['props'] {
    return {
      title: this.plugin.settings.mySetting,
    };
  }

  /* Return the default data to be shared into the shared state that our
   * integration creates; this ultimately turns into a part of the properties
   * that are given to the component. */
  getPluginData() : SampleViewSchema['data'] {
    return this.plugin.state.data;
  }

  /* Return the default data to be used to set up the mounted view. This is used
   * as the initial session data object when a view is first created. */
  getDefaultSessionState() : SampleViewSchema['session'] {
    return {
      count: 69,
    }
  }

  /* Return the default ephemeral state. */
  getDefaultEphemeralState(): SampleViewSchema['ephemeral'] {
      return {
        toggle: false,
      }
  }

  /* When ephemeral data changes, we invoke the component function. */
  onEphemeralChange(ephemeral: SampleViewSchema['ephemeral']): void {
      console.log(`Ephemeral toggle changed to: ${ephemeral.toggle}`);

      // Invoke the exported function on the Svelte component instance. We use
      // ?. because the component might technically be unmounted when we get
      // invoked.
      this.integration.component?.testMessage();
  }
}


/******************************************************************************/
