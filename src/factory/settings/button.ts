/******************************************************************************/


import { Setting } from 'obsidian';
import type { SettingsManager, ButtonSettingConfig } from '#factory/settings.types';


/******************************************************************************/


/* Add a standard button control to the provided setting using the given
 * configuration options.
 *
 * Such a button can have either text OR an icon (if an icon is provided, it
 * supercedes the text) and can be one several visual styles. Such buttons also
 * have an obvious button border on them.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addButtonControl<T>(setting: Setting,
                                    manager: SettingsManager<T>,
                                    config: ButtonSettingConfig<T>) {
  setting.addButton(button => {
    console.log(config);
    button
      .setDisabled(config.disabled ?? false)
      .setButtonText(config.text)
      .setTooltip(config.tooltip ?? '')
      .onClick(() => config.click(manager.settings));

    // Apply an icon if there is one; this will supercede the text.
    if (config.icon !== undefined) {
      button.setIcon(config.icon);
    }

    if (config.style === 'warning') {
      button.setWarning();
    } else if (config.style === 'cta') {
      button.setCta();
    }
  });
}


/******************************************************************************/
