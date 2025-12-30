/******************************************************************************/


import { debounce, Plugin, WorkspaceLeaf, MarkdownView } from 'obsidian';

import  { type KursvaroData, type KursvaroSettings, hydratePluginData, type PluginStateSchema } from '#types';
import { GenericSavedState, watch } from "#state/generic";

import { SvelteIntegration } from '#ui/svelte';
import { KursvaroSettingTab } from '#ui/settings';
import { SampleView, VIEW_TYPE_SAMPLE } from '#ui/views/sample';

import type { SettingsChangeListener, SettingsManager } from '#factory/settings.types';

import { registerCommand } from '#factory/commands';
import { commands } from '#commands/index';
import { OpenSampleViewCommand } from '#commands/standard/open_view';

import { setupBlockHandler } from '#factory/blocks';
import { blocks } from '#blocks/index';

import type { StatusBarComponent, StatusBarSchema } from '#components/StatusBar.types';
import StatusBarComponentView from '#components/StatusBar.svelte';


/******************************************************************************/


export class KursvaroPlugin extends Plugin
                            implements SettingsManager<KursvaroSettings> {
  data: KursvaroData;
  settings: KursvaroSettings;
  state: GenericSavedState<PluginStateSchema>;
  stateCleanup: (() => void) | undefined;
  statusBarIntegration: SvelteIntegration<StatusBarSchema, StatusBarComponent>;
  private settingsListeners: ((key: keyof KursvaroSettings) => void)[] = [];

  // Invoking this will schedule a call to the function that will actualy  save
  // the plugin data to disk, but debounce it so that any calls that arrive
  // within the set time will just reset the timer. This is used because the
  // settings page will hammer the living hell out of the save sytem otherwise
  // currently (for example typing in a text field is a call per character which
  // is a little bit much).
  private requestPluginDataSave = debounce(async () => await this.saveData(this.data),
                                           250, true);

  async onload() {
    // Before we do anything else, load in our plugin's data file; this sets up
    // both our cached version of the data as well as the settings information.
    this.data = await this.loadPluginData();
    this.settings = this.data.settings;

    // Now create the master state tracking object for the plugin data; this is
    // used to ensure that anything that touches the plugin data will see when
    // everything else touches the plugin data too.
    //
    // We also set up a watch on the plugin data changing that causes us to
    // write it back to disk, so that anything that touches this version of
    // the data will cause a save to occur.
    this.state = new GenericSavedState<PluginStateSchema>({
      data: this.data,
      ephemeral: { modalClicks: 0 }
    });
    this.stateCleanup = watch(this.state, {
      onDataChange: (data: PluginStateSchema['data']) => {
        console.log('saving plugin data due to a change');
        this.data = data;
        this.savePluginData();
      },
      onEphemeralChange: (_ephemeral: PluginStateSchema['ephemeral']) => {
        console.log('the ephemeral data changed!');
      }
    });

    // Create the settings tab to advertise to Obsidian that we have settings.
    this.addSettingTab(new KursvaroSettingTab(this));

    // This creates an icon in the left ribbon; when it is clicked, the sample
    // view opens in the sidebar, or focuses if it is already there.
    const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (_evt: MouseEvent) => {
      OpenSampleViewCommand(this);
    });
    ribbonIconEl.addClass('my-plugin-ribbon-class');

    // This adds a status bar item to the bottom of the app. Does not work on
    // mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.empty();

    // Create our Svelte integration for the new component and mount it
    this.statusBarIntegration = new SvelteIntegration({
      component: StatusBarComponentView,
      target: statusBarItemEl,
      session: { activeLeafName: 'None?' },
    });

    // Register all of our code block handlers
    for (const block of blocks) {
      setupBlockHandler(this, block);
    }

    // Register an event that will notice when the active leaf node changes, and
    // the new active leaf is a markdown view, and display the name of the view
    // into the console. This does not currently catch renames however.
    //
    // Note that the call to registerEvent has to wrap the event so that it will
    // get cleaned up, otherwise it exists forever.
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', (leaf: WorkspaceLeaf) => {
        let name = 'None';
        if (leaf !== null && leaf.view instanceof MarkdownView) {
          name = leaf.getDisplayText();
        }

        console.log(`Leaf change notification: ${name}`);
        this.statusBarIntegration.updateSession({ activeLeafName: name})
      })
    );

    // Add in all of our commands.
    for (const cmd of commands) {
      registerCommand(this, cmd);
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
    // If there is a state cleanup, we added a watch, so remove it now.
    if (this.stateCleanup !== undefined) {
      this.stateCleanup();
    }

    // Unmount the status bar component
    this.statusBarIntegration.unmount();
  }

  /* This handles the loading of our simple plugin data, which is persisted for
   * us by Obsidian directly into a file that it allows us to easily save and
   * load (data.json in the plugin folder inside of .obsidian).
   *
   * This holds state that we want to ensure gets synced, including our settings
   * information. */
  async loadPluginData() : Promise<KursvaroData> {
    // Load the raw data from disk.
    const rawData = await this.loadData();

    // Get a copy of the loaded data in which all of the data fields and the
    // nested settings objects are fully filled out, with any of the missing
    // fields having their defaults in place.
    return hydratePluginData(rawData);
  }

  /* Persist all of our plugin data, including savings, back to disk. */
  async savePluginData(key?: keyof KursvaroSettings) {
    this.requestPluginDataSave();

    if (key !== undefined) {
      this.settingsListeners.forEach(handler => handler(key))
    }
  }

  /* Allow callers to register an interest in knowing when a setting has its
   * value changed, at the point at which savePluginData() is called.
   *
   * The listeners registered here will happen after the data is saved out to
   * disk.
   *
   * This returns a function which will remove the callback provided from the
   * list of listeners. */
  onSettingsChange(callback: SettingsChangeListener<KursvaroSettings>) {
    this.settingsListeners.push(callback);

    // Return a cleanup function that will remove this listener when it's
    // invoked.
    return () => {
      this.settingsListeners = this.settingsListeners.filter(listener => listener !== callback);
    };
  }

  /* This gets invoked whenever it is detected that the data.json file has
   * been changed on disk by some outside task, such as the sync mechanism. */
  async onExternalSettingsChange() {
    console.log('data.json has changed on disk; reloading');

    // Load in new data and update our handles to it.
    const newData = await this.loadPluginData();
    this.data = newData;
    this.settings = this.data.settings;

    // Ensure that the state tracking variable is also updated with the data,
    // which will ensure that any mounted components see the update.
    // const data = Object.assign({}, DEFAULT_DATA, rawData);
    Object.assign(this.state.data, this.data);
  }

  /* This sample method exists solely to verify that the configured buttons in
   * the settings can invoke methods on the plugin if they need to; here it is
   * not useful. */
  doAThing(buttonType: string) {
    console.log(`the plugin code is handling a ${buttonType} button press`);
  }

  /* This sample method exists solely to illustrate how the method for dynamic
   * dropdown population can invoke methods in the plugin to get at the data it
   * needs. For that reason it is also using the passed settings, which is just
   * a reference to the settings we already have (but they exist on that
   * method in case a plugin method is not actualy needed). */
  async getDynamicDropdownContents(currentSettings: KursvaroSettings): Promise<Record<string, string>>
  {
    if (currentSettings.myToggleSetting) {
       return {
        'boobies': "It is spelled 'Boobies' (Toggle ON)",
        'bewbies': "It is spelled 'Bewbies' (Toggle ON)",
      };
    } else {
       return {
        'boobies': "It is spelled 'Boobies' (Toggle OFF)",
        'bewbies': "It is spelled 'Bewbies' (Toggle OFF)",
      };
    }
  }
}


/******************************************************************************/
