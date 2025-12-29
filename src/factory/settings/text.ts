/******************************************************************************/


import { Setting } from 'obsidian';
import type { ControlUpdateHandler, SettingsManager, TextSetting } from '#factory/settings.types';


/******************************************************************************/


/* Add a text control to the provided setting using the given configuration
 * options.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addTextControl<T>(setting: Setting,
                                  manager: SettingsManager<T>,
                                  config: TextSetting<T>) : ControlUpdateHandler<T> {
  let updateHandler: ControlUpdateHandler<T> = async () => {};

  setting.addText(text => {
    updateHandler = async (currentSettings: T) => {
      text.setDisabled(config.disabled ? config.disabled(currentSettings) : false);
      text.setValue(String(currentSettings[config.key] ?? ''));
    };

    text
      .setPlaceholder(config.placeholder ?? '')
      .onChange(async (value: string) => {
        (manager.settings[config.key] as string) = value;
        await manager.savePluginData(config.key);
      });

    updateHandler(manager.settings);
  });

  return updateHandler;
}


/******************************************************************************/
