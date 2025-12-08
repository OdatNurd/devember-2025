/******************************************************************************/


import { Setting } from 'obsidian';


/******************************************************************************/


/* The various distinct kinds of settings that the settings factory supports. */
export type SettingType = 'heading' | 'text';

/* This interface specifies the fields that are common to all configurtion
 * settings regardles of their type. */
export interface CommonSettingConfig {
  /* Common to all settings. */
  name: string;
  type: SettingType;
  description?: string;
  cssClass?: string;
  disabled?: boolean;
};

/* The specific configuration for a header; this has no extra configuration and
 * the defaults tell us eerything we need. */
export interface HeaderSettingConfig extends CommonSettingConfig {
  type: 'heading';
  config: unknown;
}

/* The specific configuration for a text value; this contains extra info on how
 * to get and set the value of the setting. */
export interface TextSettingConfig extends CommonSettingConfig {
  type: 'text';
  config: {
    placeholder?: string;
    get: string;
    set: (value: string) => Promise<void>;
  }
}

/* Any given setting can be any of the above types. */
export type SettingConfig = HeaderSettingConfig | TextSettingConfig;


/******************************************************************************/


/* This factory constructs a set of Setting objects into the provided container
 * element (presumed to be the element in a PluginSettingsTab instance) based
 * on an object based configuration.
 *
 * This, in theory, makes the settings configuration less unweildy. */
export function createSettingsLayout(container: HTMLElement, settings: SettingConfig[]) : void {
  // Make sure that the container is empty first
  container.empty();

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

    const { type, config } = item;

    // Text field?
    if (type === 'text') {
      setting.addText(text => text
        .setPlaceholder(config.placeholder ?? '')
        .setValue(config.get)
        .onChange(config.set)
      );
    }
  }
}


/******************************************************************************/
