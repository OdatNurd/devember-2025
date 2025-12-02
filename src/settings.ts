/******************************************************************************/


import { App, PluginSettingTab, Setting } from 'obsidian';

import { type KursvaroPlugin } from './plugin';


/******************************************************************************/


/* This interface describes the settings that our plugin exposes; these will be
 * persisted into the vault in a data.json file in .obsidian/plugins/plugin-name
 * if any of them are changed from the defaults outlined below. */
export interface KursvaroSettings {
  mySetting: string;
}


/******************************************************************************/


/* This sets the default values for all of our settings; these are used as the
 * source of settings if there is no data.json file. */
export const DEFAULT_SETTINGS: KursvaroSettings = {
  mySetting: 'default'
}


/******************************************************************************/


export class KursvaroSettingTab extends PluginSettingTab {
  plugin: KursvaroPlugin;

  constructor(app: App, plugin: KursvaroPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Setting #1')
      .setDesc('It\'s a secret')
      .addText(text => text
        .setPlaceholder('Enter your secret')
        .setValue(this.plugin.settings.mySetting)
        .onChange(async (value) => {
          this.plugin.settings.mySetting = value;
          await this.plugin.saveSettings();
        }));
  }
}


/******************************************************************************/
