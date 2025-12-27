/******************************************************************************/


import { type Plugin, SettingGroup } from 'obsidian';
import type { ControlUpdateHandler, SettingsManager, SettingRowConfig } from '#factory/settings.types';

import {
  addTextControl, addTextAreaControl, addNumberControl, addToggleControl,
  addDropdownControl, addSliderControl, addProgressBarControl,
  addColorPickerControl, addButtonControl, addExtraButtonControl,
  addDateFormatControl, addSearchControl,
} from '#factory/settings/index';


/******************************************************************************/


/* This factory constructs a set of Setting objects into the provided container
 * element (presumed to be the element in a PluginSettingsTab instance) based
 * on an object based configuration.
 *
 * This, in theory, makes the settings configuration less unweildy. */
export function createSettingsLayout<T,P extends Plugin>(container: HTMLElement,
                                        manager: SettingsManager<T>,
                                        plugin: P,
                                        settings: SettingRowConfig<T,P>[]) : void {
  // This map correlates settings keys with the handler functions that should be
  // invoked whenever that setting changes, so that things can dynamically
  // update.
  const dependencyMap = new Map<keyof T, ControlUpdateHandler<T>[]>();

  // The setting group that the next added setting will be added to. When adding
  // settings this is forced to have a value; settings of type 'heading' will
  // also cause the group to change.
  let settingGroup = null;

  // Tell our manager to let us know every time a setting changes so that we can
  // trace the dependency tree and update any settings that depend on that
  // setting.
  manager.onSettingsChange(changedKey => {
    const dependents = dependencyMap.get(changedKey);
    if (dependents !== undefined) {
      dependents.forEach(handler => handler(manager.settings));
    }
  });

  // Iterate over all of the settings in the configured list in order to
  // construct the settings layout. All settings will go into a SettingGroup
  // object. An entry in the settings that represents a heading will start a
  // brand new group and all following settings will inject into that group
  // until a heading group is defined.
  //
  // If the first item isn't group, we will add one.
  for (const row of settings) {
    // If this row doesn't have any items, then it must be setting a heading,
    // since that is the only other possible option.
    //
    // Note that you might want to have this check to see if `heading` exists
    // but then the type discriminator takes a shit on you. So, don't.
    if (row.items === undefined) {
      settingGroup = new SettingGroup(container).setHeading(row.heading);

      if (row.cssClass !== undefined) {
        settingGroup.addClass(row.cssClass ?? '')
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
        .setName(row.name)
        .setDesc(row.description ?? '')

      // Include the CSS; this strictly requires a non-empty string so we can't
      // coalesce in a default.
      if (row.cssClass !== undefined) {
        setting.setClass(row.cssClass)
      }

      for (const item of row.items) {
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
            updateHandler = addDropdownControl(setting, manager, plugin, item);
            break;

          // Slider control.
          case 'slider':
            addSliderControl(setting, manager, item);
            break;

          // Progress bar control.
          case 'progressbar':
            updateHandler = addProgressBarControl(setting, manager, item);
            break;

          // Color picker control.
          case 'colorpicker':
            addColorPickerControl(setting, manager, item);
            break;

          // Regular button control.
          case 'button':
            addButtonControl(setting, manager, plugin, item);
            break;

          // Extra button control (button with just an icon)
          case 'extrabutton':
            addExtraButtonControl(setting, manager, plugin, item);
            break;

          // Date format (with or without help)
          case 'dateformat':
            addDateFormatControl(setting, manager, item);
            break;

          // Search Field
          case 'search':
            addSearchControl(setting, manager, plugin, item);
            break;
        }

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
    });
  }
}


/******************************************************************************/
