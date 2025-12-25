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
        name: "Setting #1",
        description: "It's a secret",
        items: [
          {
            type: 'extrabutton',
            icon: 'gear',
            tooltip: 'Are you feeling lucky?',
            click: (settings) => console.log(settings),
          },
          {
            type: 'text',
            placeholder: 'The secret goes here',
            key: 'mySetting',
          },
        ]
      },
      {
        name: 'Setting #2',
        description: "It's not a secret",
        items: [
          {
            type: 'button',
            style: 'cta',
            text: 'Call to Action Btn',
            tooltip: 'The normal button',
            click: (settings) => console.log(settings),
          },
          {
            type: 'textarea',
            placeholder: 'The non-secret goes here',
            key: 'myOtherSetting',
          },
        ]
      },
      {
        name: 'Setting #3',
        description: "It's totally a toggle",
        items: [
          {
            type: 'toggle',
            tooltip: ['when on, the setting is on', 'when off, the setting is off'],
            key: 'myToggleSetting',
          },
        ]
      },
      {
        name: 'Setting #8',
        description: 'A slider',
        items: [
          {
            type: 'slider',
            key: 'mySliderValue',
            min: -10,
            max: 110,
            step: 1
          },
        ]
      },
      {
        name: 'Overall Progress',
        description: 'The description of the overall progress',
        items: [
          {
            type: 'progressbar',
            value: async (settings) => settings.mySliderValue,
            dependencies: ['mySliderValue'],
          },
        ]
      },

      // Other Settings; a separate group
      { heading: 'Other Settings' },

      {
        name: 'Setting #4',
        description: "It's a number",
        items: [
          {
            type: 'integer',
            placeholder: "I recommend 69; it's nice",
            key: 'myThirdSetting',
          },
        ]
      },
      {
        name: 'Setting #5',
        description: "It's a number",
        items: [
          {
            type: 'float',
            placeholder: "I recommend 4.20",
            key: 'myFloatSetting',
          },
        ]
      },
      {
        name: 'Setting #6',
        description: "Tee and/or Hee",
        items: [
          {
            type: 'dropdown',
            key: 'myDropdownSetting',
            options: {
              'titties': "I prefer titties",
              'boobies': "Clearly boobies are better",
            },
          },
        ]
      },
      {
        name: 'Setting #7',
        description: "Spelling Bee",
        items: [
          {
            type: 'dropdown',
            key: 'myOtherDropdownSetting',
            dependencies: ['myToggleSetting'],
            loader: async (settings) : Promise<Record<string, string>> => {
              await new Promise(resolve => setTimeout(resolve, 2000));
              if (settings.myToggleSetting) {
                 return {
                  'boobies': "It is spelled 'Boobies' (Toggle ON)",
                  'bewbies': "It is spelled 'Bewbies' (Toggle ON)",
                };
              } else {
                 return {
                  'boobies': "It is spelled 'Boobies' (Toggle OFF)",
                  'bewbies': "It is spelled 'Bewbies' (Toggle OFF)",
                };
              }
            },
          }
        ]
      },
      {
        name: 'Setting #9',
        description: "Choose any color; it will not be used for a damn thing",
        items: [
          {
            type: 'colorpicker',
            key: 'myColorValue',
          }
        ]
      },
    ]);
  }
}


/******************************************************************************/
