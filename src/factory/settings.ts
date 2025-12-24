/******************************************************************************/


import { SettingGroup } from 'obsidian';
import type { SettingsManager, SettingConfig } from '#factory/settings.types';

import {
  addTextControl, addTextAreaControl, addNumberControl, addToggleControl,
  addDropdownControl, addSliderControl, addProgressBarControl,
} from '#factory/settings/index';


/******************************************************************************/


/* This factory constructs a set of Setting objects into the provided container
 * element (presumed to be the element in a PluginSettingsTab instance) based
 * on an object based configuration.
 *
 * This, in theory, makes the settings configuration less unweildy. */
export function createSettingsLayout<T>(container: HTMLElement,
                                        manager: SettingsManager<T>,
                                        settings: SettingConfig<T>[]) : void {
  let settingGroup = null;

  // Iterate over all of the settings in the configured list in order to
  // construct the settings layout. All settings will go into a SettingGroup
  // object. An entry in the settings that represents a heading will start a
  // brand new group and all following settings will inject into that group
  // until a heading group is defined.
  //
  // If the first item isn't group, we will add one.
  for (const item of settings) {
    // When an entry is a heading, create an explicit SettingGroup for it and
    // then we're done.
    if (item.type === 'heading') {
      settingGroup = new SettingGroup(container).setHeading(item.name);

      if (item.cssClass !== undefined) {
        settingGroup.addClass(item.cssClass ?? '')
      }
      continue;
    }

    // We are about to process a non-heading setting. If there is not a
    // SettingGroup yet, make one now so that all settings are contained in a
    // group.
    if (settingGroup === null) {
      settingGroup = new SettingGroup(container)
    }

    // This entry represents a setting; so create a setting for it and then add
    // in the required controls.
    settingGroup.addSetting(setting => {
      // Set the setting name and description.
      setting
        .setName(item.name)
        .setDesc(item.description ?? '')

      // Include the CSS; this strictly requires a non-empty string so we can't
      // coalesce in a default.
      if (item.cssClass !== undefined) {
        setting.setClass(item.cssClass)
      }

      // Based on the type of the setting, insert the appropriate control.
      switch (item.type) {
        // Simple text field.
        case 'text':
          addTextControl(setting, manager, item);
          break;

        // Simple textarea field.
        case 'textarea':
          addTextAreaControl(setting, manager, item);
          break;

        // Simple text field, but treated as a number.
        case 'integer':
        case 'float':
          addNumberControl(setting, manager, item);
          break;

        // Toggle Field; a boolean with an on/off in it.
        case 'toggle':
          addToggleControl(setting, manager, item);
          break;

        // Dropdown field; this handles both a static and a dynamic control.
        case 'dropdown':
          addDropdownControl(setting, manager, item);
          break;

        // Slider control.
        case 'slider':
          addSliderControl(setting, manager, item);
          break;

        // Progress bar control.
        case 'progressbar':
          addProgressBarControl(setting, manager, item);
          break;
      }
    });
  }
}


/******************************************************************************/
