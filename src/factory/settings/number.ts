/******************************************************************************/


import { Setting } from 'obsidian';
import type { SettingsManager, IntegerSetting, FloatSetting } from '#factory/settings.types';


/******************************************************************************/


/* Add a number control to the provided setting using the given configuration
 * options; this is just a text control but with some additional flavour to
 * ensure that it is treated as a number.
 *
 * This handles both integer and float types. For integers, it installs extra
 * event handling to prevent the user from entering or pasting decimal points.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addNumberControl<T>(setting: Setting,
                                    manager: SettingsManager<T>,
                                    config: IntegerSetting<T> | FloatSetting<T>) {
  setting.addText(text => {
    const input = text.inputEl;

    input.type = 'number';
    text.setPlaceholder(config.placeholder ?? '')
    .setDisabled(config.disabled ? config.disabled(manager.settings) : false)
    .setValue(String(manager.settings[config.key] ?? '0'))
    .onChange(async (value: string) => {
      const num = Number(value);
      if (isNaN(num) === false) {
        (manager.settings[config.key] as number) = num;
        await manager.savePluginData(config.key);
      }
    });

    // If this is not an integer, then we can skip the rest of this; the code
    // above handles floating point by default.
    if (config.type === 'float') {
      return;
    }

    // Attach an event handler that blocks entering a period into the input, so
    // that the input can only be an integer.
    input.addEventListener('keypress', (evt: KeyboardEvent) => {
      // We block anything that is not a digit (0-9) or a sign (+/-) in order to
      // keep to purely integral values.
      if (/[^0-9+-]/.test(evt.key)) {
        evt.preventDefault();
      }
    });

    // Block a paste operation that would make a float too. I'm not sure if it
    // is HTML, Electron, or Obsidian, but pasting a non-number into a number
    // field strips all non-numbers. So here we do the same to strip away all
    // non-digits.
    input.addEventListener('paste', (evt: ClipboardEvent) => {
      // Prevent the default paste behavior so we can handle it manually.
      evt.preventDefault();

      // Get the text from the clipboard.
      const data = evt.clipboardData?.getData('text');
      if (data === undefined) {
        return;
      }

      // Strip out anything that is not a digit or a sign.
      const cleaned = data.replace(/[^0-9+-]/g, '');

      // If there is nothing left, we don't need to do anything.
      if (cleaned === '') {
        return;
      }

      // Insert the cleaned text; this is deprecated, but we'll worry about that
      // later.
      document.execCommand('insertText', false, cleaned);
    });

  });
}


/******************************************************************************/
