/******************************************************************************/


import { SettingGroup } from 'obsidian';
import type { ControlUpdateHandler, SettingsManager, SettingConfig } from '#factory/settings.types';

import {
  addTextControl, addTextAreaControl, addNumberControl, addToggleControl,
  addDropdownControl, addSliderControl, addProgressBarControl,
  addColorPickerControl,
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
  // This map correlates settings keys with the handler functions that should be
  // invoked whenever that setting changes, so that things can dynamically
  // update.
  const dependencyMap = new Map<keyof T, ControlUpdateHandler<T>[]>();

  // The setting group that the next added setting will be added to. When adding
  // settings this is forced to have a value; settings of type 'heading' will
  // also cause the group to change.
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

    // Capture the update handler for the added control (if there is one); this
    // is used to update the dependencyMap.
    let updateHandler: ControlUpdateHandler<T> | undefined;

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

      // In order to be able to know exactly what setting was actually changed,
      // create a simple proxy around the manager that we were given; this way
      // we can intercept changes to specific settings and trigger the update
      // handlers for them.
      //
      // This is inside of the loop so that it can close over the current config
      // item to know what setting is being updated; a more robust version might
      // be to adjust the API for savePluginData() so that it knows what setting
      // is the one that triggered the update.
      const managerProxy = {
        ...manager,
        settings: manager.settings,

        savePluginData: async () => {
          await manager.savePluginData();

          // Get any dependencies on this particular setting; if there are any,
          // then trigger the update handlers.
          if (('key' in item) === false) {
            return;
          }

          // If there are any settings that depend on us changing, then invoke
          // their handlers now with the new settings.
          const dependents = dependencyMap.get(item.key);
          if (dependents !== undefined) {
            dependents.forEach(handler => handler(manager.settings));
          }
        }
      }

      // Based on the type of the setting, insert the appropriate control.
      switch (item.type) {
        // Simple text field.
        case 'text':
          addTextControl(setting, managerProxy, item);
          break;

        // Simple textarea field.
        case 'textarea':
          addTextAreaControl(setting, managerProxy, item);
          break;

        // Simple text field, but treated as a number.
        case 'integer':
        case 'float':
          addNumberControl(setting, managerProxy, item);
          break;

        // Toggle Field; a boolean with an on/off in it.
        case 'toggle':
          addToggleControl(setting, managerProxy, item);
          break;

        // Dropdown field; this handles both a static and a dynamic control.
        case 'dropdown':
          updateHandler = addDropdownControl(setting, managerProxy, item);
          break;

        // Slider control.
        case 'slider':
          addSliderControl(setting, managerProxy, item);
          break;

        // Progress bar control.
        case 'progressbar':
          updateHandler = addProgressBarControl(setting, managerProxy, item);
          break;

        // Color picker control.
        case 'colorpicker':
          addColorPickerControl(setting, managerProxy, item);
          break;
      }
    });

    // If this setting type is one that can dynamically update itself and it
    // also has dependencies, then update our dependency map to know that when
    // any of those settings change, this settings update handler should be
    // triggered.
    if (updateHandler !== undefined && item.dependencies !== undefined) {
      for (const settingName of item.dependencies) {
        const handlers = dependencyMap.get(settingName) ?? [];
        handlers.push(updateHandler);
        dependencyMap.set(settingName, handlers);
      }
    }
  }
}


/******************************************************************************/
