/******************************************************************************/


import { Setting } from 'obsidian';
import type { ControlUpdateHandler, SettingsManager, ProgressBarSetting } from '#factory/settings.types';


/******************************************************************************/


/* Add a progress bar control to the provided setting.
 *
 * This control is read-only by definition; it visualizes a value derived from
 * the current settings via the provided value callback.
 *
 * Returns a function that can be called to force the control to update itself
 * based on the latest settings (e.g. when a dependency changes). */
export function addProgressBarControl<T>(setting: Setting,
                                         manager: SettingsManager<T>,
                                         config: ProgressBarSetting<T>)
                                         : ControlUpdateHandler<T> {

  // The function that is responsible for updating the progress bar value; it
  // needs to be assigned inside the addProgressBar so it can close over the
  // component.
  let updateHandler: ControlUpdateHandler<T> = async () => {};

  setting.addProgressBar((progressBar) => {
    // The update handler invokes the user's value function to calculate what
    // the progress bar should show.
    updateHandler = async (currentSettings: T) => {
      progressBar.setValue(await config.value(currentSettings));
    };

    // Use the handler we just defined in order to do the initial setup.
    updateHandler(manager.settings);
  });

  // Return the handler the factory needs for the dependency system.
  return updateHandler;
}


/******************************************************************************/
