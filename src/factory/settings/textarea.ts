/******************************************************************************/


import { Setting } from 'obsidian';
import type { SettingsManager, TextAreaSettingConfig } from '#factory/settings.types';


/******************************************************************************/


/* Add a text control to the provided setting using the given configuration
 * options.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addTextAreaControl<T>(setting: Setting,
                                  manager: SettingsManager<T>,
                                  config: TextAreaSettingConfig<T>) {
  setting.addTextArea(text => {
    // Enforce vertical resizing only for the text input because there is
    // something hinky about the way that Obsidian lets you resize it, like it
    // is resizing based on the center of a larger bounding box, and it does not
    // behave like one might expect it to.
    text.inputEl.style.resize = 'vertical';

    text
    .setDisabled(config.disabled ?? false)
    .setPlaceholder(config.placeholder ?? '')
    .setValue(String(manager.settings[config.key] ?? ''))
    .onChange(async (value: string) => {
      (manager.settings[config.key] as string) = value;
      await manager.savePluginData(config.key);
    })
  });
}


/******************************************************************************/
