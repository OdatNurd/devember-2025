/******************************************************************************/


import { type StateSchema } from "#state/generic";


/******************************************************************************/


/* This interface describes the settings that our plugin exposes; these will be
 * persisted into the vault in a data.json file in .obsidian/plugins/plugin-name
 * if any of them are changed from the defaults outlined below. */
export interface KursvaroSettings {
  mySetting: string;
  myOtherSetting: string;
  myThirdSetting: number;
  myToggleSetting: boolean;
  myDropdownSetting: string;
  myOtherDropdownSetting: string;
}


/* This interface describes the data that the plugin stores in its data.json
 * file; this includes not only our settings but any other data that we want to
 * persist that should definitely be synced between vaults if the user is using
 * the sync service. */
export interface KursvaroData {
  content: string;

  /* This is the saved value for our plugin settings. */
  settings: KursvaroSettings;
}


/* This interface describes the schema for the data that is stored in the
 * data.json file, but which is reactive and shared within the core plugin to
 * share with all Svelte components so that they are all reactive against the
 * plugin data. */
export interface PluginStateSchema extends StateSchema {
  data: KursvaroData;

  // The number of times the button was clicked in the modal.
  ephemeral: {
    modalClicks: number;
  }
}


/******************************************************************************/


/* This sets the default values for all of our settings; these are used as the
 * source of settings if there is no data.json file. */
const DEFAULT_SETTINGS: KursvaroSettings = {
  mySetting: 'default',
  myOtherSetting: 'poop',
  myThirdSetting: 69,
  myToggleSetting: true,
  myDropdownSetting: 'titties',
  myOtherDropdownSetting: 'boobies',
}


/* This sets the default value for our data file, ensuring that all fields are
 * present within it.
 *
 * This is a representation of the data that exists on disk in the data.json
 * file that lives in our plugin's install folder inside the vault. */
const DEFAULT_DATA: KursvaroData = {
  content: '',
  settings: DEFAULT_SETTINGS,
}


/******************************************************************************/


/* This function accepts the raw data provided by Obsidian from it's loadData
 * handler, which loads the data.json file from the plugin root, and returns
 * back a data object which contains the data.
 *
 * This will populate any missing fields in the data, including the nested
 * settings object, with default values should any of them be missing. */
export function hydratePluginData(rawData: KursvaroData) : KursvaroData {
  const data = Object.assign({}, DEFAULT_DATA, rawData);
  data.settings = Object.assign({}, DEFAULT_SETTINGS, rawData?.settings);

  return data;
}


/******************************************************************************/
