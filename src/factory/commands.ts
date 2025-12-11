/******************************************************************************/


import { type Command, Editor, MarkdownView, Plugin } from 'obsidian';


/******************************************************************************/


/* These types are the definition of handler functions for commands. The first
 * is for standard commands, while the second is for commands that are specific
 * to the editor. */
export type StandardHandlerFunction = (plugin: Plugin) => void;
export type EditorHandlerFunction = (plugin: Plugin, editor: Editor, view: MarkdownView) => void;

/* These types are the definitiuon of check functions, which are invoked to
 * determine if a command should be executed, and in some cases to actually
 * excecute them after checking that it is still OK to do so.
 *
 * As above there are two variations since they need to get the same arguments
 * as the handler they will eventually invoke. */
export type StandardCheckFunction = (plugin: Plugin) => boolean;
export type EditorCheckFunction = (plugin: Plugin, editor: Editor, view: MarkdownView) => boolean;


/* The base definition shared by all commands; each command must have something
 * that uniquely identifies them. */
interface BaseCommandConfig {
  /* Globally unique identifier for the command. */
  id: string;

  /* Human readable name for the command in the UI (anywhere commands are) */
  name: string;
}

/* These are the types for a handler function for a normal command, a check
 * function to be used in cases where we want to be able to enable or disable
 * the command based on editor state, and a configuration that is used to create
 * the command mapping. */
export interface StandardCommandConfig extends BaseCommandConfig {
  /* The type of the command; this specifies a normal command (invoke-able
   * anywhere) and is the default fallback if the type is not present. */
  type?: 'standard';

  /* Optional check function; if this is set, then it will be invoked whenever
   * the command is about to be displayed in the command palette or when the
   * command is about to execute, to determine whether or not the the command
   * should be available.
   *
   * The command will not be executed if this returns false or undefined. */
  check?: StandardCheckFunction;

  /* The actual function to invoke for this command. */
  handler: StandardHandlerFunction;
}


/* As above, but these are related to Editor commands instead of regular
 * commands; they're treated the same way but they use a different signature
 * because they take different arguments. */
export interface EditorCommandConfig extends BaseCommandConfig {
  /* The specific type that differentiates this from standard commands. */
  type: 'editor';

  /* Optional check function; if this is set, then it will be invoked whenever
   * the command is about to be displayed in the command palette or when the
   * command is about to execute, to determine whether or not the the command
   * should be available.
   *
   * The command will not be executed if this returns false or undefined. */
  check?: EditorCheckFunction;

  /* The actual function to invoke for this command. */
  handler: EditorHandlerFunction;
}

/* A command configuration can be either of the possible command types. */
export type CommandConfig = StandardCommandConfig | EditorCommandConfig;


/******************************************************************************/

/* The actual factory implementation; create a command either for the command
 * palette or as an editor command, depending on the passed in configuration
 * object.
 *
 * This wraps all of the work required to create the command object that is
 * given back to the API. */
export function createCommand(plugin: Plugin, config: CommandConfig) : Command {
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
    return {
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
    }
  }

  // When we get here, this is a standard command and not an editor command.
  const { id, name, check: isEnabled = (() => true), handler } = config;
  return {
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
  }
}


/******************************************************************************/
