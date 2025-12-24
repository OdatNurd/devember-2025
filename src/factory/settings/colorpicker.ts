/******************************************************************************/


import { Setting } from 'obsidian';
import type { SettingsManager, ColorPickerSettingConfig } from '#factory/settings.types';


/******************************************************************************/


/* Add a color picker control to the provided setting using the given
 * configuration options.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addColorPickerControl<T>(setting: Setting,
                                         manager: SettingsManager<T>,
                                         config: ColorPickerSettingConfig<T>) {
  setting.addColorPicker(text => text
    .setDisabled(config.disabled ?? false)
    .setValue(String(manager.settings[config.key] ?? ''))
    .onChange(async (value: string) => {
      (manager.settings[config.key] as string) = value;
      await manager.savePluginData()
    })
  );
}


/******************************************************************************/
