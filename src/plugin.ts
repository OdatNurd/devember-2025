/******************************************************************************/


import { Plugin } from 'obsidian';

import type { KursvaroData, KursvaroSettings } from './model';
import { DEFAULT_DATA, DEFAULT_SETTINGS } from './model';

import { KursvaroSettingTab } from './settings';
import { OpenSampleViewCommand } from '#commands/open_sample_view';

import { SampleView, VIEW_TYPE_SAMPLE } from '#views/sample_view';
import { createCommand } from '#utils/command_factory';
import { commands } from '#commands/index';


/******************************************************************************/


export class KursvaroPlugin extends Plugin {
  data: KursvaroData;
  settings: KursvaroSettings;

  async onload() {
    // Before we do anything else, load in our plugin's data file; this sets up
    // both our cached version of the data as well as the settings information.
    await this.loadPluginData();

    // Create the settings tab to advertise to Obsidian that we have settings.
    this.addSettingTab(new KursvaroSettingTab(this));

    // This creates an icon in the left ribbon; when it is clicked, the sample
    // view opens in the sidebar, or focuses if it is already there.
    const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (_evt: MouseEvent) => {
      OpenSampleViewCommand(this);
    });
    ribbonIconEl.addClass('my-plugin-ribbon-class');

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText('Status Bar Text');

    // Add in all of our commands.
    for (const cmd of commands) {
      this.addCommand(createCommand(this, cmd.config, cmd.handler));
    }

    // Register our view; there could be more than one of these, in theory.
    this.registerView(VIEW_TYPE_SAMPLE, leaf => new SampleView(leaf, this));

    // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
    // Using this function will automatically remove the event listener when this plugin is disabled.
    // this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
    //   console.log('click', evt);
    // });
  }

  onunload() {

  }

  /* This handles the loading of our simple plugin data, which is persisted for
   * us by Obsidian directly into a file that it allows us to easily save and
   * load (data.json in the plugin folder inside of .obsidian).
   *
   * This holds state that we want to ensure gets synced, including our settings
   * information. */
  async loadPluginData() {
    // Load the raw data from disk.
    const rawData = await this.loadData();

    // Merge in the defaults with the actual loaded data, and do the same for
    // the settings. This ensures that the fields are always present and ready
    // to go.
    this.data = Object.assign({}, DEFAULT_DATA, rawData);
    this.data.settings = Object.assign({}, DEFAULT_SETTINGS, rawData?.settings);

    // Alias the inner settings to make external code less frumpy.
    this.settings = this.data.settings;
  }

  /* Persist all of our plugin data, including savings, back to disk. */
  async savePluginData() {
    await this.saveData(this.data);
  }
}


/******************************************************************************/

