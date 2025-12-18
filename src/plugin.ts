/******************************************************************************/


import { type MarkdownPostProcessorContext, Plugin, WorkspaceLeaf, MarkdownView } from 'obsidian';

import  { type KursvaroData, type KursvaroSettings, hydratePluginData } from '#types';

import { SvelteIntegration } from '#ui/svelte';
import { KursvaroSettingTab } from '#ui/settings';
import { SampleView, VIEW_TYPE_SAMPLE } from '#ui/views/sample';

import { createCommand } from '#factory/commands';
import { commands } from '#commands/index';
import { OpenSampleViewCommand } from '#commands/standard/open_view';

import type { StatusBarInstance, StatusBarProps, StatusBarSessionData, StatusBarPluginData } from '#components/StatusBar.types';
import StatusBarComponent from '#components/StatusBar.svelte';

import { BoobsBlockRenderChild } from '#blocks/boobs';


/******************************************************************************/


export class KursvaroPlugin extends Plugin {
  data: KursvaroData;
  settings: KursvaroSettings;

  statusBarIntegration: SvelteIntegration<StatusBarSessionData, StatusBarPluginData, StatusBarProps, StatusBarInstance>;

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

    // This adds a status bar item to the bottom of the app. Does not work on
    // mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.empty();

    // Create our Svelte integration for the new component and mount it
    this.statusBarIntegration = new SvelteIntegration({
      component: StatusBarComponent,
      target: statusBarItemEl,
      session: { activeLeafName: 'None?' },
    });

    // Register a handler for Markdown code blocks with a custom language of
    // 'boobs'; when such a block is seen, the callback given here will be
    // invoked, which gets the source of the code block, the element to attach
    // it to, and the context of the markdown processor. We can use this to
    // generate a code block for that type of language directly.
    this.registerMarkdownCodeBlockProcessor('boobs',
      async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        ctx.addChild(new BoobsBlockRenderChild(this, el, 'boobs', source));
      });

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
      this.addCommand(createCommand(this, cmd));
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

    // Get a copy of the loaded data in which all of the data fields and the
    // nested settings objects are fully filled out, with any of the missing
    // fields having their defaults in place.
    //
    // This also aliases the inner settings to make it clearer in order code
    // when regular data or when settings are being accessed.
    this.data = hydratePluginData(rawData);
    this.settings = this.data.settings;
  }

  /* Persist all of our plugin data, including savings, back to disk. */
  async savePluginData() {
    await this.saveData(this.data);
  }
}


/******************************************************************************/

