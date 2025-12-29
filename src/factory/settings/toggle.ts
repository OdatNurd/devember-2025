/******************************************************************************/


import { Setting } from 'obsidian';
import type { ControlUpdateHandler, SettingsManager, ToggleSetting } from '#factory/settings.types';


/******************************************************************************/


/* Add a toggle control to the provided setting using the given configuration
 * options.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addToggleControl<T>(setting: Setting,
                                    manager: SettingsManager<T>,
                                    config: ToggleSetting<T>) : ControlUpdateHandler<T> {
  let updateHandler: ControlUpdateHandler<T> = async () => {};

  const getTooltip = (value: boolean): string => {
    // No tooltip was defined.
    if (config.tooltip === undefined) {
      return '';
    }

    // If the tooltip entry is a string, the tooltip always remains the same.
    if (typeof config.tooltip === "string") {
      return config.tooltip;
    }

    // The toolip entry is a boolean, so which value we use depends on the
    // CURRENT value of the setting.
    return config.tooltip[value === true ? 0 : 1];
  }

  setting.addToggle(toggle => {
    updateHandler = async (currentSettings: T) => {
      const value = Boolean(currentSettings[config.key] ?? false);
      toggle.setDisabled(config.disabled ? config.disabled(currentSettings) : false);
      toggle.setTooltip(getTooltip(value));
      toggle.setValue(value);
    };

    toggle
      .onChange(async (value: boolean) => {
        (manager.settings[config.key] as boolean) = value;
        toggle.setTooltip(getTooltip(value));
        await manager.savePluginData(config.key);
      });

    updateHandler(manager.settings);
  });

  return updateHandler;
}


/******************************************************************************/
