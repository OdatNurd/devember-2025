/******************************************************************************/


import { DropdownComponent, Setting } from 'obsidian';
import type {
  SettingsManager, StaticDropdownSettingConfig, DynamicDropdownSettingsConfig
} from '#factory/settings.types';


/******************************************************************************/


/* Given a dropdown component and a configuration option, configure the dropdown
 * to have the required options, which come from a static list within the actual
 * config object itself. */
function staticDropdownSetup<T>(dropdown: DropdownComponent,
                                config: StaticDropdownSettingConfig<T>,
                                _select: HTMLSelectElement, _value: string) {
  // A one line function to set the internet on fire. With arguments it does not
  // even use, even! Let the rage bait begin!
  dropdown.addOptions(config.options);
}


/******************************************************************************/


/* Given a dropdown component and a configuration option, configure the dropdown
 * to have the required options, which come from an async callback that will
 * return the actual config.
 *
 * Since this is async, while the callback is runnign this will disable the
 * control and include a single fake option in it that tells the user that it is
 * loading.
 *
 * Additionally on failure the control will get a different entry indicating the
 * load failed, and will remain disabled so the user can't interact with it. */
async function dynamicDropdownSetup<T>(dropdown: DropdownComponent,
                                       config: DynamicDropdownSettingsConfig<T>,
                                       select: HTMLSelectElement, value: string) {
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
}


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
      .onChange(async (value: string) => {
        (manager.settings[config.key] as string) = value;
        await manager.savePluginData()
      })
      .setDisabled(config.disabled ?? false);

    // Pull the value that this dropdown is supposed to have, and the
    // select element that wraps it.
    const select = dropdown.selectEl;
    const value = (manager.settings[config.key] as string) ?? '';

    // Handle the type of dropdown; the determination is whether or not there
    // are any statically defined options in the config.
    if ("options" in config) {
      staticDropdownSetup(dropdown, config, select, value);
    } else {
      await dynamicDropdownSetup(dropdown, config, select, value);
    }

    // The above adds the options, so this can now set the value; without this
    // you don't get to see what the current value is.
    dropdown.setValue(value)
  });
}


/******************************************************************************/
