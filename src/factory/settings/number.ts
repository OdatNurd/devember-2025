/******************************************************************************/


import { Setting } from 'obsidian';
import type { SettingsManager, NumberSettingConfig } from '#factory/settings.types';


/******************************************************************************/


/* Add a number control to the provided setting using the given configuration
 * options; this is just a text control but with some additional flavour to
 * ensure that it is treated as a number.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addNumberControl<T>(setting: Setting,
                                    manager: SettingsManager<T>,
                                    config: NumberSettingConfig<T>) {
  setting.addText(text => {
    text.inputEl.type = 'number';
    text.setPlaceholder(config.placeholder ?? '')
    .setDisabled(config.disabled ?? false)
    .setValue(String(manager.settings[config.key] ?? '0'))
    .onChange(async (value: string) => {
      const num = Number(value);
      if (isNaN(num) === false) {
        (manager.settings[config.key] as number) = num;
        await manager.savePluginData();
      }
    })
  });
}


/******************************************************************************/
