/******************************************************************************/


import { Plugin, Notice, WorkspaceLeaf } from 'obsidian';

import { DEFAULT_SETTINGS, KursvaroSettingTab, type KursvaroSettings } from './settings';

import { SampleView, VIEW_TYPE_SAMPLE } from '#views/sample_view';

import { createCommand } from '#utils/command_factory';
import { commands } from '#commands/index';


/******************************************************************************/


export class KursvaroPlugin extends Plugin {
  settings: KursvaroSettings;

  async onload() {
    // Load our settings and then add a settings tab to allow the user to edit
    // them.
    await this.loadSettings();
    this.addSettingTab(new KursvaroSettingTab(this.app, this));

    // This creates an icon in the left ribbon; when it is clicked, the icon
    // displays.
    const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (_evt: MouseEvent) => {
      this.activateView();
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
    this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
      console.log('click', evt);
    });
  }

  onunload() {

  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async activateView() {
    const { workspace } = this.app;

    // Try to find all of the leaves of the particular type that we want to
    // activate.
    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_SAMPLE);

    // If we found any, then use the first one as the view to reveal.
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      // There isn't one of us in the workspace, so create a new one. It is
      // important to set the view state type because otherwise Obsidian does
      // not know what type of view this is.
      leaf = workspace.getRightLeaf(false);
      if (leaf !== null) {
        await leaf.setViewState({ type: VIEW_TYPE_SAMPLE });
      }
    }

    // Tell the workspace to reveal it.
    if (leaf !== null) {
      new Notice('Activated the view');
      workspace.revealLeaf(leaf);
    }
  }
}


/******************************************************************************/

