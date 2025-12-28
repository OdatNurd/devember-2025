/******************************************************************************/


import { type Plugin, Setting } from 'obsidian';
import type { SettingsManager, SearchSettingConfig } from '#factory/settings.types';


/******************************************************************************/


/* Add a text control to the provided setting using the given configuration
 * options.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addSearchControl<T,P extends Plugin, V>(setting: Setting,
                                      manager: SettingsManager<T>,
                                      plugin: P,
                                      config: SearchSettingConfig<T,P,V>) {
  setting.addSearch(search => {
    search
      .setDisabled(config.disabled ?? false)
      .setPlaceholder(config.placeholder ?? '')
      .setValue(String(manager.settings[config.key] ?? ''))
      .onChange(async (value: string) => {
        (manager.settings[config.key] as string) = value;
        await manager.savePluginData(config.key);
      });

    // Create the suggestion object; this ties it to the search input element.
    const suggestions = new config.handler(plugin, search.inputEl);

    // Handle when a new suggestion is selected from the list; We need to set
    // the value of the search, so taht the user can tell that they picked it,
    // but we also need to do the work of the onChange handler to persist the
    // change; otherwise nothing will actually see the change.
    suggestions.onSelect(async (value: V, _evt: MouseEvent | KeyboardEvent) => {
      search.setValue(String(value));
      (manager.settings[config.key] as V) = value;
      await manager.savePluginData(config.key);

      // Close the popup now that something was selected.
      suggestions.close();
    })
  });
}


/******************************************************************************/
