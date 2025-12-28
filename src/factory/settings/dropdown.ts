/******************************************************************************/


import { type Plugin, DropdownComponent, Setting } from 'obsidian';
import type {
  ControlUpdateHandler, SettingsManager, StaticDropdownSetting, DynamicDropdownSettings
} from '#factory/settings.types';


/******************************************************************************/


/* Given a dropdown component and a configuration option, configure the dropdown
 * to have the required options, which come from a static list within the actual
 * config object itself, and then ensure that the dropdown is displaying the
 * value provided.
 *
 * The options will be cleared first to ensure that if this gets called again
 * (we are told we depend on some other setting) that the items won't double up
 * the options list, since Obsidian appends the new items you give it. */
function staticDropdownSetup<T>(dropdown: DropdownComponent,
                                config: StaticDropdownSetting<T>,
                                select: HTMLSelectElement, value: string) {
  select.empty();
  dropdown.addOptions(config.options);
  dropdown.setValue(value);
}


/******************************************************************************/


/* Given a dropdown component and a configuration option, configure the dropdown
 * to have the required options, which come from an async callback that will
 * return the actual config based on the provided settings.
 *
 * Since this is async, while the callback is running this will disable the
 * control and include a single fake option in it that tells the user that it is
 * loading.
 *
 * Additionally on failure the control will get a different entry indicating the
 * load failed, and will remain disabled so the user can't interact with it. */
async function dynamicDropdownSetup<T,P extends Plugin>(
                                       dropdown: DropdownComponent,
                                       config: DynamicDropdownSettings<T,P>,
                                       select: HTMLSelectElement,
                                       plugin: P,
                                       settings: T) {
  // The control might be disabled by config choice, but it needs to
  // also be disabled while we fiddle with it and wait, so store the
  // current state and then disable it.
  const wasDisabled = select.disabled;
  select.disabled = true;

  try {
    // We need a temporary option to tell the user that the options are loading.
    select.empty();
    dropdown.addOption('unknown', 'Loading...');
    dropdown.setValue('unknown');

    // Invoke the loader, passing the current settings so the options can be
    // determined based on the state of other fields.
    const options = await config.loader(plugin, settings);

    // Empty the select and then add in our options and put its state back.
    select.empty();
    dropdown.addOptions(options);
    select.disabled = wasDisabled;

    // Determine the value to set. We try to grab the value from settings, but
    // if the newly loaded options don't contain that value (e.g. the
    // dependencies changed what is valid), we default to the first available
    // option so that the display looks correct.
    let value = (settings[config.key] as string) ?? '';
    if ((value in options) === false) {
      const firstKey = Object.keys(options)[0];
      value = firstKey !== undefined ? firstKey : '';
    }
    dropdown.setValue(value);
  } catch (error) {
    // Say in the console why it failed, then insert a fake entry so
    // that the user will see it in the UI too.
    console.error(`unable to load dropdown options: ${error}`);
    select.empty();
    dropdown.addOption((settings[config.key] as string) ?? '', 'Error loading options');
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
 * gathered via an async callback to allow them to be generated on the fly.
 *
 * Returns a function that can be called to force the control to update itself
 * based on the latest settings (e.g. when a dependency changes). */
export function addDropdownControl<T,P extends Plugin>(
                                        setting: Setting,
                                        manager: SettingsManager<T>,
                                        plugin: P,
                                        config: StaticDropdownSetting<T> |
                                                DynamicDropdownSettings<T,P>
                                                ) : ControlUpdateHandler<T> {
  // The function that is responsible for filling out the options in the select
  // that underlies us whenever the data changes; it needs to be assigned inside
  // the addDropdown so it can close over the component, but it needs to have a
  // default value or Typescript will lose its shit on the return value.
  let updateHandler: ControlUpdateHandler<T> = async () => {};

  setting.addDropdown(async (dropdown) => {
    dropdown
      .onChange(async (value: string) => {
        (manager.settings[config.key] as string) = value;
        await manager.savePluginData(config.key);
      })
      .setDisabled(config.disabled ?? false);

    // Pull the select element that wraps the dropdown.
    const select = dropdown.selectEl;

    // The update handler which knows how to populate the select options; this
    // has two cases, one for static lists and one for dynamic. For dynamic the
    // current settings are provided by the dependency system when they invoke
    // us, so that any relevant values can be gathered from it.
    //
    // This is defined inside of here and not at the global level so that it can
    // close over the added dropdown element used for the setting.
    updateHandler = async (currentSettings: T) => {
      if ("options" in config) {
        const value = (currentSettings[config.key] as string) ?? '';
        staticDropdownSetup(dropdown, config, select, value);
      } else {
        await dynamicDropdownSetup(dropdown, config, select, plugin, currentSettings);
      }
    };

    // Use the handler we just defined in order to do the initial setup.
    await updateHandler(manager.settings);
  });

  // Return the handler the factory needs for the dependency system.
  return updateHandler;
}


/******************************************************************************/
