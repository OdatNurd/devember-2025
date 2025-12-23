/******************************************************************************/


import { Setting } from 'obsidian';
import type { SettingsManager, ToggleSettingConfig } from '#factory/settings.types';


/******************************************************************************/


/* Add a toggle control to the provided setting using the given configuration
 * options.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addToggleControl<T>(setting: Setting,
                                  manager: SettingsManager<T>,
                                  config: ToggleSettingConfig<T>) {
  setting.addToggle(toggle => toggle
    .setDisabled(config.disabled ?? false)
    .setValue(Boolean(manager.settings[config.key] ?? false))
    .onChange(async (value: boolean) => {
      (manager.settings[config.key] as boolean) = value;
      await manager.savePluginData()
    })
  );
}


/******************************************************************************/
