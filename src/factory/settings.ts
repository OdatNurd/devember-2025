/******************************************************************************/


import { Setting, SettingGroup } from 'obsidian';


/******************************************************************************/


/* The various distinct kinds of settings that the settings factory supports. */
export type SettingType = 'heading' | 'text' | 'number' | 'toggle';

/* This "helper" type extracts from the type defines as T all keys that are of
 * the type V. */
type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/* The prototype interface for a class that knows how to get at and set the
 * settings for a specific settings type. */
export interface SettingsManager<T> {
  settings: T;
  savePluginData(): Promise<void>
}

/* This interface specifies the fields that are common to all configurtion
 * settings regardles of their type. */
export interface BaseSettingConfig {
  type: SettingType;
  name: string;
  description?: string;
  cssClass?: string;
  disabled?: boolean;
};

/* The specific configuration for a header; this has no extra configuration and
 * the defaults tell us eerything we need. */
export interface HeaderSettingConfig extends BaseSettingConfig {
  type: 'heading';
}

/* The specific configuration for a text value; this contains extra info on the
 * key in the settings object that represents the value, and what the
 * placeholder would be. */
export interface TextSettingConfig<T> extends BaseSettingConfig {
  type: 'text';
  key: KeysMatching<T, string>;
  placeholder?: string;
}

/* The specific configuration for a numericv value; this contains extra info the
 * key in the settings object that represents the value, and what the
 * placeholder would be. */
export interface NumberSettingConfig<T> extends BaseSettingConfig {
  type: 'number';
  key: KeysMatching<T, number>;
  placeholder?: string;
}

export interface ToggleSettingConfig<T> extends BaseSettingConfig {
  type: 'toggle';
  key: KeysMatching<T, boolean>;
}

/* Any given setting can be any of the above types. */
export type SettingConfig<T> = HeaderSettingConfig | TextSettingConfig<T> |
                               NumberSettingConfig<T> | ToggleSettingConfig<T>;


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
      setting.setName(item.name)
        .setDisabled(item.disabled ?? false);

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
            .setValue(Boolean(manager.settings[item.key] ?? false))
            .onChange(async (value: boolean) => {
              (manager.settings[item.key] as boolean) = value;
              await manager.savePluginData()
            })
          )
        );
        break;
    }
  }
}


/******************************************************************************/
