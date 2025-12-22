/******************************************************************************/


import { Editor, MarkdownView, Plugin } from 'obsidian';
import type { CommandConfig } from '#factory/commands.types';


/******************************************************************************/


/* The actual factory implementation; register a command either for the command
 * palette or as an editor command, depending on the passed in configuration
 * object.
 *
 * This wraps all of the work required to create the command object that is
 * given back to the API and then invoke the registration function for it. */
export function registerCommand(plugin: Plugin, config: CommandConfig) : void {
  // In the calls to the check callback below, the value of checking determines
  // why the callback is happening:
  //   checking === true
  //     Being invoked to see if we should be COULD execute the command; this
  //     does things like determine if the command should be visible in the
  //     command palette or not.
  //
  //   checking === false
  //     Being invoked to run the command, but we should still check first just
  //     in case between when the command was selected and now, the state of
  //     things has changed.
  //
  // Based on this, per the API, you should always checks to see if the the
  // command should execute, and leave if it should not. However, when checking
  // is set to false, that indicates that the intention was to execute the
  // command.
  //
  // The return value should be false or undefined if the command could not
  // run, or true if it COULD.
  if (config.type === 'editor') {
    const { id, name, check: isEnabled = (() => true), handler } = config;
    plugin.addCommand({
      id, name,
      editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) => {
        if (isEnabled(plugin, editor, view) === false) {
          return false;
        }

        if (checking === false) {
          handler(plugin, editor, view);
        }

        return true;
      }
    });
    return;
  }

  // When we get here, this is a standard command and not an editor command.
  const { id, name, check: isEnabled = (() => true), handler } = config;
  plugin.addCommand({
    id, name,
    checkCallback: (checking: boolean) => {
      if (isEnabled(plugin) === false) {
        return false;
      }

      if (checking === false) {
        handler(plugin);
      }

      return true;
    }
  });
}


/******************************************************************************/
