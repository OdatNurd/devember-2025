/******************************************************************************/


import { App, PluginSettingTab } from 'obsidian';
import { createSettingsLayout } from '#utils/settings_factory';

import type { SettingsManager } from '#utils/settings_factory';
import type { KursvaroPlugin } from './plugin';


/******************************************************************************/


/* This interface describes the settings that our plugin exposes; these will be
 * persisted into the vault in a data.json file in .obsidian/plugins/plugin-name
 * if any of them are changed from the defaults outlined below. */
export interface KursvaroSettings {
  mySetting: string;
  myOtherSetting: string;
  myThirdSetting: number;
}


/******************************************************************************/


/* This sets the default values for all of our settings; these are used as the
 * source of settings if there is no data.json file. */
export const DEFAULT_SETTINGS: KursvaroSettings = {
  mySetting: 'default',
  myOtherSetting: 'poop',
  myThirdSetting: 69,
}


/******************************************************************************/


export class KursvaroSettingTab extends PluginSettingTab {
  plugin: KursvaroPlugin & SettingsManager<KursvaroSettings>;

  constructor(app: App, plugin: KursvaroPlugin) {
    super(app, plugin);
  }

  display(): void {
    // Clear everything from the container; otherwise it may still contain the
    // settings we defined last time.
    this.containerEl.empty();

    // The main settings group.
    createSettingsLayout(this.containerEl, this.plugin, [
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
    ]);

    // A secondary item group.
    createSettingsLayout(this.containerEl, this.plugin, [
      {
        type: 'heading',
        name: 'Otther Settings',
        description: 'Other things that can be configured',
        cssClass: 'config-header-spacing',
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
