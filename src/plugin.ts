/******************************************************************************/


import { Plugin, Notice } from 'obsidian';

import { DEFAULT_SETTINGS, KursvaroSettingTab, type KursvaroSettings } from './settings';

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
      new Notice('This is a notice!');
    });
    ribbonIconEl.addClass('my-plugin-ribbon-class');

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText('Status Bar Text');

    // Add in all of our commands.
    for (const cmd of commands) {
      this.addCommand(createCommand(this, cmd.config, cmd.handler));
    }

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
}


/******************************************************************************/

