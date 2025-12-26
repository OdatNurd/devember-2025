/******************************************************************************/


import { Setting } from 'obsidian';
import type { SettingsManager, DateFormatSettingConfig } from '#factory/settings.types';


/******************************************************************************/


/* Add a MomentJS Date Format chooser control to the provided setting using the
 * given configuration options.
 *
 * This control seems predicated on requiring the plugin code to keep track of
 * what the default format is and use that when the user doesn't pick one. For
 * our use here, any time the setting would be the default setting, the control
 * will persist the default directly into the settings for sanity reasons.
 *
 * This can show or hide help (default is hide); the help shows the preview and
 * also includes a link to the documentation for the format string that moment
 * uses (which looks very developer centric, but better than nothing). */
export function addDateFormatControl<T>(setting: Setting,
                                        manager: SettingsManager<T>,
                                        config: DateFormatSettingConfig<T>) {
  const dateDesc = document.createDocumentFragment();
  dateDesc.createEl('br');
  dateDesc.appendText('Preview: ');
  const dateSampleEl = dateDesc.createEl('b', 'u-pop');
  dateDesc.appendText(' ');
  dateDesc.createEl('a', {
      text: '\u{1F6C8}',
      attr: {
        href: 'https://momentjs.com/docs/#/displaying/format/',
        target: '_blank',
        title: 'Format Help'
      }
  });


  // The initial value; if the setting does not have a value, assume that the
  // value is the default value. When we set it in, if the value is the default
  // we put the empty string in the control, since the control treats an empty
  // like the default. This makes for a better experience for the user.
  const value = String(manager.settings[config.key] ?? config.defaultFormat);

  setting.addMomentFormat(momentFormat => {
    momentFormat
      .setDisabled(config.disabled ?? false)
      .setValue(value !== config.defaultFormat ? value : '')
      .setSampleEl(dateSampleEl)
      .setDefaultFormat(config.defaultFormat)
      .onChange(async (value: string) => {
        // Store the value using the default if the value is the empty string
        // for reasons explained above.
        (manager.settings[config.key] as string) = value || config.defaultFormat;

        // Get the control to update its sample based on the current value that
        // the control has, then we can save.
        momentFormat.updateSample();
        await manager.savePluginData(config.key);
      });

    // If we were asked to include help, then we need to append the description
    // element we created to the actual description element.
    if (config.includeHelp === true) {
      setting.descEl.appendChild(dateDesc);
    }
  });
}


/******************************************************************************/
