/******************************************************************************/


import { PluginSettingTab } from 'obsidian';
import type { KursvaroPlugin } from '#plugin';

import { type KursvaroSettings } from '#types';
import { type SettingsManager, createSettingsLayout } from '#factory/settings';


/******************************************************************************/


export class KursvaroSettingTab extends PluginSettingTab {
  plugin: KursvaroPlugin & SettingsManager<KursvaroSettings>;

  constructor(plugin: KursvaroPlugin) {
    super(plugin.app, plugin);
  }

  display(): void {
    // Clear everything from the container; otherwise it may still contain the
    // settings we defined last time.
    this.containerEl.empty();

    // The main settings group.
    createSettingsLayout(this.containerEl, this.plugin, [
      // General Settings
      {
        type: 'text',
        name: 'Setting #1',
        description: "It's a secret",
        key: 'mySetting',
      },
      {
        type: 'text',
        name: 'Setting #2',
        description: "It's not a secret",
        key: 'myOtherSetting'
      },

      // Other Settings; a separate group
      {
        type: 'heading',
        name: 'Other Settings',
        description: 'Other things that can be configured',
      },
      {
        type: 'number',
        name: 'Setting #3',
        description: "It's a number",
        key: 'myThirdSetting'
      },
    ]);

  }
}


/******************************************************************************/
