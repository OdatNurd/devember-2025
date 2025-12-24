/******************************************************************************/


import { PluginSettingTab } from 'obsidian';
import type { KursvaroPlugin } from '#plugin';

import { type KursvaroSettings } from '#types';
import { type SettingsManager } from '#factory/settings.types';
import { createSettingsLayout } from '#factory/settings';


/******************************************************************************/


/* An instance of this class is used to construct the settings tab. This uses
 * our factory pattern to configure the settings largely via a JSON-like
 * structure. */
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
        placeholder: 'The secret goes here',
        key: 'mySetting',
      },
      {
        type: 'textarea',
        name: 'Setting #2',
        description: "It's not a secret",
        placeholder: 'The non-secret goes here',
        key: 'myOtherSetting',
      },
      {
        type: 'toggle',
        name: 'Setting #3',
        description: "It's totally a toggle",
        tooltip: ['when on, the setting is on', 'when off, the setting is off'],
        key: 'myToggleSetting',
      },
      {
        type: 'slider',
        name: 'Setting #8',
        description: 'A slider',
        key: 'mySliderValue',
        min: -10,
        max: 110,
        step: 1
      },
      {
        type: 'progressbar',
        name: 'Overall Progress',
        description: 'The description of the overall progress',
        value: async (settings) => settings.mySliderValue,
      },

      // Other Settings; a separate group
      {
        type: 'heading',
        name: 'Other Settings',
        description: 'Other things that can be configured',
      },
      {
        type: 'integer',
        name: 'Setting #4',
        description: "It's a number",
        placeholder: "I recommend 69; it's nice",
        key: 'myThirdSetting',
      },
      {
        type: 'float',
        name: 'Setting #5',
        description: "It's a number",
        placeholder: "I recommend 4.20",
        key: 'myFloatSetting',
      },
      {
        type: 'dropdown',
        name: 'Setting #6',
        description: "Tee and/or Hee",
        key: 'myDropdownSetting',
        options: {
          'titties': "I prefer titties",
          'boobies': "Clearly boobies are better",
        },
      },
      {
        type: 'dropdown',
        name: 'Setting #7',
        description: "Spelling Bee",
        key: 'myOtherDropdownSetting',
        loader: async () : Promise<Record<string, string>> => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return {
            'boobies': "It is spelled 'Boobies'",
            'bewbies': "It is spelled 'Bewbies'",
          }
        },
      },
    ]);
  }
}


/******************************************************************************/
