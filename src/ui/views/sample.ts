/******************************************************************************/


import { WorkspaceLeaf } from 'obsidian';
import { type Component } from 'svelte';
import { type KursvaroPlugin } from '#plugin';

import { BaseSvelteItemView } from '#ui/views/base';

import type { SampleViewInstance, SampleViewProps, SampleViewSessionData, SampleViewPluginData, SampleViewEphemeralData } from '#components/SampleView.types';

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
                             SampleViewSessionData, SampleViewPluginData, SampleViewEphemeralData,
                             SampleViewProps, SampleViewInstance> {
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
  getComponent() : Component<SampleViewProps, SampleViewInstance> {
    return SampleSvelteView
  };

  /* Return the properties to be used when the component is mounted. */
  getComponentProps(): SampleViewProps {
    return {
      title: this.plugin.settings.mySetting,
    } as SampleViewProps;
    // TODO: This is janky; the sharedState property is injected elsewhere, so
    //       this needs a better annotation of some sort to resolve the problem
    //       without a cast.
  }

  /* Return the default data to be shared into the shared state that our
   * integration creates; this ultimately turns into a part of the properties
   * that are given to the component. */
  getPluginData() : SampleViewPluginData {
    return {
      content: this.plugin.data.content
    }
  }

  /* Return the default data to be used to set up the mounted view. This is used
   * as the initial session data object when a view is first created. */
  getDefaultSessionState() : SampleViewSessionData {
    return {
      count: 69,
    }
  }

  /* Return the default ephemeral state. */
  getDefaultEphemeralState(): SampleViewEphemeralData {
      return {
        toggle: false,
      }
  }

  /* This is triggered whenever any shared plugin data is altered; there is no
   * default implementation here since all handling is subject to code control;
   * at a minimum this should update at least one field in the data and then
   * trigger a plugin data save. */
  onDataChange(data: SampleViewPluginData) {
    this.plugin.data.content = data.content;
    this.plugin.savePluginData();
  }

  /* This is triggered whenever ephemeral data changes. */
  onEphemeralChange(ephemeral: SampleViewEphemeralData): void {
      console.log(`Ephemeral toggle changed to: ${ephemeral.toggle}`);
  }
}


/******************************************************************************/
