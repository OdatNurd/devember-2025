/******************************************************************************/


import { Setting } from 'obsidian';


/******************************************************************************/


/* The various distinct kinds of settings that the settings factory supports. */
export type SettingType = 'heading' | 'text' | 'number';

/* This "helper" type extracts from the type defines as T all keys that are of
 * the type V. */
type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/* The prototype interface for a class that knows how to get at and set the
 * settings for a specific settings type. */
export interface SettingsManager<T> {
  settings: T;
  saveSettings(): Promise<void>
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

/* Any given setting can be any of the above types. */
export type SettingConfig<T> = HeaderSettingConfig | TextSettingConfig<T> |
                               NumberSettingConfig<T>;


/******************************************************************************/


/* This factory constructs a set of Setting objects into the provided container
 * element (presumed to be the element in a PluginSettingsTab instance) based
 * on an object based configuration.
 *
 * This, in theory, makes the settings configuration less unweildy. */
export function createSettingsLayout<T>(container: HTMLElement,
                                        manager: SettingsManager<T>,
                                        settings: SettingConfig<T>[]) : void {
  // Iterate over all of the settings in the configured list.
  for (const item of settings) {
    const setting = new Setting(container)
      .setName(item.name)
      .setDisabled(item.disabled ?? false)

    // Set a description if one was provided.
    if (item.description !== undefined) {
      setting.setDesc(item.description);
    }

    // Set a css class if one was provided.
    if (item.cssClass !== undefined) {
      setting.setClass(item.cssClass);
    }

    // If this is a heading, then we're done; no more to do here.
    if (item.type === 'heading') {
      continue;
    }

    switch (item.type) {
      case 'text':
        setting.addText(text => text
          .setPlaceholder(item.placeholder ?? '')
          .setValue(String(manager.settings[item.key] ?? ''))
          .onChange(async (value: string) => {
            (manager.settings[item.key] as string) = value;
            await manager.saveSettings()
          })
        );
        break;

      case 'number':
        setting.addText(text => {
          text.inputEl.type = 'number';
          text.setPlaceholder(item.placeholder ?? '')
          .setValue(String(manager.settings[item.key] ?? '0'))
          .onChange(async (value: string) => {
            const num = Number(value);
            if (isNaN(num) === false) {
              (manager.settings[item.key] as number) = num;
              await manager.saveSettings();
            }
          })
        });
        break;
    }
  }
}


/******************************************************************************/
