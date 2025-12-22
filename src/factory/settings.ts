/******************************************************************************/


import { Setting, SettingGroup } from 'obsidian';
import type { SettingsManager, SettingConfig } from '#factory/settings.types';


/******************************************************************************/


/* This factory constructs a set of Setting objects into the provided container
 * element (presumed to be the element in a PluginSettingsTab instance) based
 * on an object based configuration.
 *
 * This, in theory, makes the settings configuration less unweildy. */
export function createSettingsLayout<T>(container: HTMLElement,
                                        manager: SettingsManager<T>,
                                        settings: SettingConfig<T>[]) : void {
  let settingGroup = null;

  // Iterate over all of the settings in the configured list in order to
  // construct the settings layout. All settings will go into a SettingGroup
  // object. An entry in the settings that represents a heading will start a
  // brand new group and all following settings will inject into that group
  // until a heading group is defined.
  //
  // If the first item isn't group, we will add one.
  for (const item of settings) {
    // This simple helper will add to any setting the optional portions that are
    // common to all settings, returning the setting back for chaining purposes.
    const setup = (setting: Setting) : Setting => {
      setting.setName(item.name);

      if (item.description !== undefined) {
        setting.setDesc(item.description);
      }
      if (item.cssClass !== undefined) {
        setting.setClass(item.cssClass)
      }

      return setting;
    }

    // When an entry is a heading, create an explicit SettingGroup for it and
    // then we're done.
    if (item.type === 'heading') {
      settingGroup = new SettingGroup(container)
        .setHeading(item.name);
      if (item.cssClass !== undefined) {
        settingGroup.addClass(item.cssClass ?? '')
      }
      continue;
    }

    // We are about to process a non-heading setting. If there is not a
    // SettingGroup yet, make one now so that all settings are contained in a
    // group.
    if (settingGroup === null) {
      settingGroup = new SettingGroup(container)
    }

    // Based on the type of the setting, insert the setting as appropriate.
    switch (item.type) {
      // Simple text field.
      case 'text':
        settingGroup.addSetting(setting => setup(setting)
          .addText(text => text
            .setDisabled(item.disabled ?? false)
            .setPlaceholder(item.placeholder ?? '')
            .setValue(String(manager.settings[item.key] ?? ''))
            .onChange(async (value: string) => {
              (manager.settings[item.key] as string) = value;
              await manager.savePluginData()
            })
          )
        );
        break;

      // Simple text field, but treated as a number.
      case 'number':
        settingGroup.addSetting(setting => setup(setting)
          .addText(text => {
            text.inputEl.type = 'number';
            text.setPlaceholder(item.placeholder ?? '')
            .setDisabled(item.disabled ?? false)
            .setValue(String(manager.settings[item.key] ?? '0'))
            .onChange(async (value: string) => {
              const num = Number(value);
              if (isNaN(num) === false) {
                (manager.settings[item.key] as number) = num;
                await manager.savePluginData();
              }
            })
          })
        );
        break;

      // Toggle Field; a boolean with an on/off in it.
      case 'toggle':
        settingGroup.addSetting(setting => setup(setting)
          .addToggle(toggle => toggle
            .setDisabled(item.disabled ?? false)
            .setValue(Boolean(manager.settings[item.key] ?? false))
            .onChange(async (value: boolean) => {
              (manager.settings[item.key] as boolean) = value;
              await manager.savePluginData()
            })
          )
        );
        break;

      // Dropdown field; this handles both cases
      case 'dropdown':
        settingGroup.addSetting(setting => setup(setting)
          .addDropdown(async (dropdown) => {
            dropdown
              .setValue(String(manager.settings[item.key] ?? ''))
              .onChange(async (value: string) => {
                (manager.settings[item.key] as string) = value;
                await manager.savePluginData()
              })
              .setDisabled(item.disabled ?? false);

            // Pull the value that this dropdown is supposed to have, and the
            // select element that wraps it.
            const value = (manager.settings[item.key] as string) ?? '';
            const select = dropdown.selectEl;

            // If there are static options, we can apply them, set the value,
            // and leave.
            if ("options" in item) {
              dropdown.addOptions(item.options);
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
              const options = await item.loader();

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
          })
        );
        break;
    }
  }
}


/******************************************************************************/
