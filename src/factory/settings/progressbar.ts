/******************************************************************************/


import { Setting } from 'obsidian';
import type { SettingsManager, ProgressBarSettingConfig } from '#factory/settings.types';


/******************************************************************************/


/* Add a progress bar control to the provided setting using the given
 * configuration options.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addProgressBarControl<T>(setting: Setting,
                                         manager: SettingsManager<T>,
                                         config: ProgressBarSettingConfig<T>) {
  setting.addProgressBar(async (text) => {
    text.setDisabled(config.disabled ?? false)
      .setValue(await config.value(manager.settings))
  });
}


/******************************************************************************/
