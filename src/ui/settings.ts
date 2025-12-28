/******************************************************************************/


import { PluginSettingTab } from 'obsidian';
import type { KursvaroPlugin } from '#plugin';

import { type KursvaroSettings } from '#types';
import { type SettingsManager } from '#factory/settings.types';
import { createSettingsLayout } from '#factory/settings';

import { SampleSearchStringClass, SampleSearchNumberClass } from '#ui/search';


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
    createSettingsLayout(this.containerEl, this.plugin, this.plugin, [
      // General Settings
      {
        name: "Setting #1",
        description: "It's a secret",
        items: [
          {
            type: 'extrabutton',
            icon: 'gear',
            tooltip: 'Are you feeling lucky?',
            click: (plugin, settings) => {
              plugin.doAThing('extra');
              console.log(settings);
            },
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
            click: (plugin, settings) => {
              plugin.doAThing('normal call to action');
              console.log(settings);
            },
          },
          {
            type: 'textarea',
            placeholder: 'The non-secret goes here',
            key: 'myOtherSetting',
            lines: 3,
            resize: 'none',
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
      {
        name: 'Setting #11',
        description: "Some kind of search something or other",
        items: [
          {
            type: 'search',
            key: 'myStringSearchValue',
            placeholder: 'Select a string thing',
            handler: SampleSearchStringClass,
          },
          {
            type: 'search',
            key: 'myNumberSearchValue',
            placeholder: 'Select a number thing',
            handler: SampleSearchNumberClass,
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
            loader: async (plugin, settings) : Promise<Record<string, string>> => {
              await new Promise(resolve => setTimeout(resolve, 2000));
              return await plugin.getDynamicDropdownContents(settings);
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
      {
        name: 'Setting #10',
        description: "Choose a date format that will not be honoured",
        items: [
          {
            type: 'dateformat',
            key: 'myDateFormat',
            defaultFormat: 'YYYY-MM-DD',
            includeHelp: true,
          }
        ]
      },
    ]);
  }
}


/******************************************************************************/
