/******************************************************************************/


import { App, PluginSettingTab } from 'obsidian';
import { createSettingsLayout } from '#utils/settings_factory';

import type { SettingsManager, SettingConfig } from '#utils/settings_factory';
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
  layout: SettingConfig<KursvaroSettings>[] = [
    {
      type: 'heading',
      name: 'The Heading',
      cssClass: 'titties',
      description: 'The heading subtitle',
    },
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
  ];

  constructor(app: App, plugin: KursvaroPlugin) {
    super(app, plugin);
  }

  display(): void {
    this.containerEl.empty();
    createSettingsLayout(this.containerEl, this.plugin, this.layout);
  }
}


/******************************************************************************/
