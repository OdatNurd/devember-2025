/******************************************************************************/


import { PluginSettingTab } from 'obsidian';
import type { KursvaroPlugin } from '#plugin';

import { type KursvaroSettings } from '#types';
import { type SettingsManager } from '#factory/settings.types';
import { createSettingsLayout } from '#factory/settings';

import { getSettingsLayout } from '#settings';


/******************************************************************************/


/* An instance of this class is used to construct the settings tab. This uses
 * our factory pattern to configure the settings largely via a JSON-like
 * structure. */
export class KursvaroSettingTab extends PluginSettingTab {
  plugin: KursvaroPlugin & SettingsManager<KursvaroSettings>;
  cleanupListeners?: () => void;

  constructor(plugin: KursvaroPlugin) {
    super(plugin.app, plugin);
  }

  display(): void {
    // Clear everything from the container; otherwise it may still contain the
    // settings we defined last time.
    this.containerEl.empty();

    // If we have been run before, clean up the listeners we had; this should
    // never actually be needed but this is here just in case somehow display()
    // gets called more than once while the settings page is open.
    this.cleanupListeners?.();

    // The main settings group.
    this.cleanupListeners = createSettingsLayout(this.containerEl, this.plugin,
                                                 this.plugin, getSettingsLayout());
  }

  hide() : void {
    this.cleanupListeners?.();
  }
}


/******************************************************************************/
