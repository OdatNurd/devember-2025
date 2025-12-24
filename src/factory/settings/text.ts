/******************************************************************************/


import { Setting } from 'obsidian';
import type { SettingsManager, TextSettingConfig } from '#factory/settings.types';


/******************************************************************************/


/* Add a text control to the provided setting using the given configuration
 * options.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addTextControl<T>(setting: Setting,
                                  manager: SettingsManager<T>,
                                  config: TextSettingConfig<T>) {
  setting.addText(text => text
    .setDisabled(config.disabled ?? false)
    .setPlaceholder(config.placeholder ?? '')
    .setValue(String(manager.settings[config.key] ?? ''))
    .onChange(async (value: string) => {
      (manager.settings[config.key] as string) = value;
      await manager.savePluginData(config.key);
    })
  );
}


/******************************************************************************/
