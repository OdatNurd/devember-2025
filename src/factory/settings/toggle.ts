/******************************************************************************/


import { Setting } from 'obsidian';
import type { SettingsManager, ToggleSetting } from '#factory/settings.types';


/******************************************************************************/


/* Add a toggle control to the provided setting using the given configuration
 * options.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addToggleControl<T>(setting: Setting,
                                    manager: SettingsManager<T>,
                                    config: ToggleSetting<T>) {
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
  const initialValue = Boolean(manager.settings[config.key] ?? false);

  setting.addToggle(toggle => toggle
    .setDisabled(config.disabled ? config.disabled(manager.settings) : false)
    .setTooltip(getTooltip(initialValue))
    .setValue(initialValue)
    .onChange(async (value: boolean) => {
      (manager.settings[config.key] as boolean) = value;
      toggle.setTooltip(getTooltip(value));
      await manager.savePluginData(config.key);
    })
  );
}


/******************************************************************************/
