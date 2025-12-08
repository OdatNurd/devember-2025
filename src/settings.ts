/******************************************************************************/


import { App, PluginSettingTab } from 'obsidian';
import { createSettingsLayout } from '#utils/settings_factory';
import { type KursvaroPlugin } from './plugin';


/******************************************************************************/


/* This interface describes the settings that our plugin exposes; these will be
 * persisted into the vault in a data.json file in .obsidian/plugins/plugin-name
 * if any of them are changed from the defaults outlined below. */
export interface KursvaroSettings {
  mySetting: string;
  myOtherSetting: string;
}


/******************************************************************************/


/* This sets the default values for all of our settings; these are used as the
 * source of settings if there is no data.json file. */
export const DEFAULT_SETTINGS: KursvaroSettings = {
  mySetting: 'default',
  myOtherSetting: 'poop',
}


/******************************************************************************/


export class KursvaroSettingTab extends PluginSettingTab {
  plugin: KursvaroPlugin;

  constructor(app: App, plugin: KursvaroPlugin) {
    super(app, plugin);
  }

  getSetting(key: keyof KursvaroSettings) : string {
    return this.plugin.settings[key]
  }

  async setSetting(key: keyof KursvaroSettings, value: string) : Promise<void> {
    this.plugin.settings[key] = value;
    return this.plugin.saveSettings();
  }

  display(): void {
    createSettingsLayout(this.containerEl, [
      {
        name: 'The Heading',
        description: 'The heading subtitle',
        type: 'heading',
        config: {}
      },
      {
        name: 'Setting #1',
        description: "It's a secret",
        type: "text",
        config: {
          placeholder: 'Enter your secret',
          get: this.getSetting('mySetting'),
          set: async (value: string) => this.setSetting('mySetting', value),
        }
      },
      {
        name: 'Setting #2',
        description: "It's not a secret",
        type: "text",
        config: {
          placeholder: 'Enter the non-secret',
          get: this.getSetting('myOtherSetting'),
          set: async (value: string) => this.setSetting('myOtherSetting', value),
        }
      },
    ]);
  }
}


/******************************************************************************/
