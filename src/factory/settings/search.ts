/******************************************************************************/


import { type Plugin, Setting } from 'obsidian';
import type { ControlUpdateHandler, SettingsManager, SearchSetting } from '#factory/settings.types';


/******************************************************************************/


/* Add a text control to the provided setting using the given configuration
 * options.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addSearchControl<T,P extends Plugin>(
                                      setting: Setting,
                                      manager: SettingsManager<T>,
                                      plugin: P,
                                      config: SearchSetting<T,P>) : ControlUpdateHandler<T> {
  let updateHandler: ControlUpdateHandler<T> = async () => {};

  setting.addSearch(search => {
    updateHandler = async (currentSettings: T) => {
      search.setDisabled(config.disabled ? config.disabled(currentSettings) : false);
      search.setValue(String(currentSettings[config.key] ?? ''));
    };

    // Create the suggestion object; this ties it to the search input element.
    const suggestions = new config.handler(plugin, search.inputEl);

    search
      .setPlaceholder(config.placeholder ?? '')
      .onChange(async (value: string) => {
        let isValid = false;
        let parsed: unknown = null;

        // Only save manually typed input if the handler supports parsing it.
        // This prevents invalid types (e.g. "text" in a number field) from
        // being saved, and allows for enforcement that only searchable values
        // can be used as the setting value.
        if (suggestions.parseInput !== undefined) {
          parsed = suggestions.parseInput(value);
          if (parsed !== null && parsed !== undefined) {
            isValid = true;
          }
        }

        if (isValid === true) {
          search.inputEl.style.textDecoration = 'none';

          (manager.settings[config.key] as unknown) = parsed;
          await manager.savePluginData(config.key);
        } else {
          // Empty values are not invalid.
          if (value === '') {
            search.inputEl.style.textDecoration = 'none';
          } else {
            search.inputEl.style.textDecoration = 'underline wavy var(--text-error)';
          }
        }
      });

    // Handle when a new suggestion is selected from the list.
    // The item is 'unknown' because we don't know the internal structure of
    // the search class, but we know getSettingValue can handle it.
    suggestions.onSearchSelect(async (item: unknown, _evt: MouseEvent | KeyboardEvent) => {
      // Selection is always valid, so clear any previous error styles
      search.inputEl.style.textDecoration = 'none';

      const valueToSave = suggestions.getSettingValue(item);
      manager.settings[config.key] = valueToSave as T[keyof T];

      await manager.savePluginData(config.key);

      // When updating the UI, try to use the helper if it exists; if not,
      // then just convert whatever we were given to a string and use that.
      const textToDisplay = suggestions.getItemText ? suggestions.getItemText(item) : String(valueToSave);

      search.setValue(textToDisplay);

      // Close the popup now that something was selected.
      suggestions.close();
    })

    updateHandler(manager.settings);
  });

  return updateHandler;
}


/******************************************************************************/
