/******************************************************************************/


import { type KursvaroPlugin } from '#plugin';
import { type KursvaroSettings } from '#types';
import { type SettingRow } from '#factory/settings.types';

import { SampleSearchStringClass, SampleSearchNumberClass } from '#ui/search';


/******************************************************************************/


/* When invoked, this will return the settings layout needed for the settings
 * factory integration in the user interface to create the settings page. */
export const getSettingsLayout = (): SettingRow<KursvaroSettings, KursvaroPlugin>[] => [
  // General Settings
  {
    name: 'Text Test',
    description: 'The title text in the sample panel',
    items: [
      {
        type: 'extrabutton',
        icon: 'printer',
        tooltip: 'This button prints to the console',
        click: (plugin, settings) => {
          plugin.doAThing('extra');
          console.log(settings);
        },
      },
      {
        type: 'text',
        placeholder: 'Sample view panel title',
        key: 'textValue',
      },
    ]
  },
  {
    name: 'Textarea Test',
    description: 'A small test of a TextArea and a regular button',
    items: [
      {
        type: 'button',
        style: 'cta',
        text: 'Call to Action Btn',
        tooltip: 'This button prints to the console',
        click: (plugin, settings) => {
          plugin.doAThing('normal call to action');
          console.log(settings);
        },
      },
      {
        type: 'textarea',
        placeholder: 'Long form content',
        key: 'textAreaValue',
        lines: 3,
        resize: 'none',
      },
    ]
  },
  {
    name: 'Integer Test',
    description: 'Testing the number input accepting only integers',
    items: [
      {
        type: 'integer',
        placeholder: 'Enter an integer value',
        key: 'integerValue',
      },
    ]
  },
  {
    name: 'Float Test',
    description: 'Testing the number input accepting any valid number',
    items: [
      {
        type: 'float',
        placeholder: 'Enter a floating point value',
        key: 'floatValue',
      },
    ]
  },

  { heading: 'More Complex Settings' },

  {
    name: 'Search Test',
    description: 'Tests of the Search components',
    items: [
      {
        type: 'search',
        key: 'stringSearchValue',
        placeholder: 'Select a string thing',
        handler: SampleSearchStringClass,
      },
      {
        type: 'search',
        key: 'numberSearchValue',
        placeholder: 'Select a number thing',
        handler: SampleSearchNumberClass,
      },
    ]
  },
  {
    name: 'Date Format Test',
    description: 'Date format selector with format helpers',
    items: [
      {
        type: 'dateformat',
        key: 'dateFormatValue',
        defaultFormat: 'YYYY-MM-DD',
        includeHelp: true,
      }
    ]
  },
  {
    name: 'Color Picker Test',
    description: 'Colors for use in the calendar component',
    items: [
      {
        type: 'colorpicker',
        key: 'colorValueOne',
      },
      {
        type: 'colorpicker',
        key: 'colorValueTwo',
      },
      {
        type: 'colorpicker',
        key: 'colorValueThree',
      },
    ]
  },

  { heading: 'Dynamic Settings' },

  {
    name: 'Slider Test',
    description: 'A slider; changing this will adjust the progress bar',
    items: [
      {
        type: 'slider',
        key: 'sliderValue',
        min: 0,
        max: 100,
        step: 1
      },
    ]
  },
  {
    name: 'ProgressBar Test',
    description: 'Displays progress; adjust the slider to see this change',
    items: [
      {
        type: 'progressbar',
        value: async (settings) => settings.sliderValue,
        dependencies: ['sliderValue'],
      },
    ]
  },
  {
    name: 'Toggle Test',
    description: 'The toggle dynamically alters the dropdowns below',
    items: [
      {
        type: 'toggle',
        tooltip: ['First dropdown enabled', 'First dropdown disabled'],
        key: 'toggleValue',
      },
    ]
  },
  {
    name: 'Static Dropdown Test',
    description: 'Dropdown with static content; controlled via the toggle above',
    items: [
      {
        type: 'dropdown',
        key: 'staticOptionValue',
        disabled: settings => !settings.toggleValue,
        dependencies: ['toggleValue'],
        options: {
          'option1': 'Option 1',
          'option2': 'Option 2',
        },
      },
    ]
  },
  {
    name: 'Dynamic Dropdown Test',
    description: 'Dropdown with dynamic content; controlled via the toggle above',
    items: [
      {
        type: 'dropdown',
        key: 'dynamicOptionValue',
        dependencies: ['toggleValue'],
        loader: async (plugin, settings) : Promise<Record<string, string>> => {
          // Simulate that it took a bit of time to get the values
          await new Promise(resolve => setTimeout(resolve, 500));
          return await plugin.getDynamicDropdownContents(settings);
        },
      }
    ]
  },

];


/******************************************************************************/
