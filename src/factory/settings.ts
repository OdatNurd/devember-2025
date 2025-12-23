/******************************************************************************/


import { Setting, SettingGroup } from 'obsidian';
import type { SettingsManager, SettingConfig } from '#factory/settings.types';

import {
  addTextControl, addNumberControl, addToggleControl, addDropdownControl,
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
    // This simple helper will add to any setting the optional portions that are
    // common to all settings, returning the setting back for chaining purposes.
    const setup = (setting: Setting) : Setting => {
      setting.setName(item.name);

      if (item.description !== undefined) {
        setting.setDesc(item.description);
      }
      if (item.cssClass !== undefined) {
        setting.setClass(item.cssClass)
      }

      return setting;
    }

    // When an entry is a heading, create an explicit SettingGroup for it and
    // then we're done.
    if (item.type === 'heading') {
      settingGroup = new SettingGroup(container)
        .setHeading(item.name);
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

    // Based on the type of the setting, insert the setting as appropriate.
    switch (item.type) {
      // Simple text field.
      case 'text':
        settingGroup.addSetting(s => {
          setup(s);
          addTextControl(s, manager, item);
        });
        break;

      // Simple text field, but treated as a number.
      case 'number':
        settingGroup.addSetting(s => {
          setup(s);
          addNumberControl(s, manager, item);
        });
        break;

      // Toggle Field; a boolean with an on/off in it.
      case 'toggle':
        settingGroup.addSetting(s => {
          setup(s);
          addToggleControl(s, manager, item);
        });
        break;

      // Dropdown field; this handles both cases
      case 'dropdown':
        settingGroup.addSetting(s => {
          setup(s);
          addDropdownControl(s, manager, item);
        });
        break;
    }
  }
}


/******************************************************************************/
