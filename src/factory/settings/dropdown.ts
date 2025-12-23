/******************************************************************************/


import { Setting } from 'obsidian';
import type {
  SettingsManager, StaticDropdownSettingConfig, DynamicDropdownSettingsConfig
} from '#factory/settings.types';


/******************************************************************************/


/* Add a dropdown control to the provided setting using the given configuration
 * options.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field.
 *
 * This handles the case of both a static dropdown (the options are provided
 * directly in the configuration object) and a dynamic dropdown (the options are
 * gathered via an async callback to allow them to be generated on the fly. */
export function addDropdownControl<T>(setting: Setting,
                                      manager: SettingsManager<T>,
                                      config: StaticDropdownSettingConfig<T> |
                                              DynamicDropdownSettingsConfig<T>) {
  setting.addDropdown(async (dropdown) => {
    dropdown
      .setValue(String(manager.settings[config.key] ?? ''))
      .onChange(async (value: string) => {
        (manager.settings[config.key] as string) = value;
        await manager.savePluginData()
      })
      .setDisabled(config.disabled ?? false);

    // Pull the value that this dropdown is supposed to have, and the
    // select element that wraps it.
    const value = (manager.settings[config.key] as string) ?? '';
    const select = dropdown.selectEl;

    // If there are static options, we can apply them, set the value,
    // and leave.
    if ("options" in config) {
      dropdown.addOptions(config.options);
      dropdown.setValue(value);
      return;
    }

    // The control might be disabled by config choice, but it needs to
    // also be disabled while we fiddle with it and wait, so store the
    // current state and then disable it.
    const wasDisabled = select.disabled;
    select.disabled = true;

    try {
      // We need a temporary option to tell the user that the options
      // are loading.
      // Add a temporaru option to tell the user that the options are
      // loading, and then invoke the loader; this can take arbitrary
      // time.
      dropdown.addOption('unknown', 'Loading...');
      const options = await config.loader();

      // Empty the select and then add in our options and put its state
      // back.
      select.empty();
      dropdown.addOptions(options);
      select.disabled = wasDisabled;
    } catch (error) {
      // Say in the console why it failed, then insert a fake entry so
      // that the user will see it in the UI too.
      console.error(`unable to load dropdown options: ${error}`);
      select.empty();
      dropdown.addOption(value, 'Error loading options');
    }

    // Set the value now so that it visualized correctly.
    dropdown.setValue(value)
  });
}


/******************************************************************************/
