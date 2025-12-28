/******************************************************************************/


import { type Plugin, Setting } from 'obsidian';
import type { SettingsManager, ExtraButtonSetting } from '#factory/settings.types';


/******************************************************************************/


/* Add an extra button control to the provided setting using the given
 * configuration options.
 *
 * Such a button can only ever have an icon and can never have text. It also
 * cannot be given other styles. The distinguishing factor between an extra
 * button and a regular button with an icon is that extra buttons don't display
 * a button frame except on hover
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addExtraButtonControl<T,P extends Plugin>(
                                           setting: Setting,
                                           manager: SettingsManager<T>,
                                           plugin: P,
                                           config: ExtraButtonSetting<T,P>) {
  setting.addExtraButton(button => button
    .setDisabled(config.disabled ?? false)
    .setTooltip(config.tooltip ?? '')
    .setIcon(config.icon ?? 'gear')
    .onClick(() => config.click(plugin, manager.settings))
  );
}


/******************************************************************************/
