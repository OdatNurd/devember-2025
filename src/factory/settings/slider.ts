/******************************************************************************/


import { Setting } from 'obsidian';
import type { SettingsManager, SliderSettingConfig } from '#factory/settings.types';


/******************************************************************************/


/* Add a s;oder control to the provided setting using the given configuration
 * options.
 *
 * The items common to all settings (name, description, cssClass) will have been
 * added to the setting prior to it being passed here, so this only needs to do
 * the work to handle the specific setting field. */
export function addSliderControl<T>(setting: Setting,
                                    manager: SettingsManager<T>,
                                    config: SliderSettingConfig<T>) {
  // All options are optional, but the API wants specific values for placeholder
  // resons. If not specified, 0, 100, 'any' is the underlying default (a
  // fractional percentage).
  const min = config.min ?? null;
  const max = config.max ?? null;
  const step = config.step ?? 'any';

  setting.addSlider(slider => slider
    .setDisabled(config.disabled ?? false)
    .setLimits(min, max, step)
    .setDynamicTooltip()
    .setValue(Number(manager.settings[config.key] ?? min))
    .onChange(async (value: number) => {
      (manager.settings[config.key] as number) = value;
      await manager.savePluginData(config.key);
    })
  );
}


/******************************************************************************/
