/******************************************************************************/


import { type Command, Editor, Plugin, MarkdownView } from 'obsidian';


/******************************************************************************/


/* These are the types for a handler function for a normal command, a check
 * function to be used in cases where we want to be able to enable or disable
 * the command based on editor state, and a configuration that is used to create
 * the command mapping. */
export type CheckFunction = (plugin: Plugin) => boolean;
export type HandlerFunction = (plugin: Plugin) => void;
export interface CommandConfig {
  /* Globally unique identifier for the command. */
  id: string;

  /* Human readable name for the command in the command palette. */
  name: string;

  /* The type of the command; this specifies a normal command (invoke-able via
   * the command palette) and is the default fallback if the type is not
   * present. */
  type?: 'standard';

  /* Optional check function; if this is set, then it will be invoked whenever
   * the command is about to be displayed in the command palette or when the
   * command is about to execute, to determine whether or not the the command
   * should be available.
   *
   * The command will not be executed if this returns false or undefined. */
  check?: CheckFunction;
}


/* As above, but these are related to Editor commands instead of regular
 * commands; they're treated the same way but they use a different signature
 * because they take different arguments. */
export type EditorCheckFunction = (plugin: Plugin, editor: Editor, view: MarkdownView) => boolean;
export type EditorHandlerFunction = (plugin: Plugin, editor: Editor, view: MarkdownView) => void;
export interface EditorCommandConfig {
  id: string;
  name: string;
  type: 'editor';
  check?: EditorCheckFunction;
}

/* These are wildcard types that can be either of the two known types. */
export type AnyHandlerFunction = HandlerFunction | EditorHandlerFunction;
export type AnyCommandConfig = CommandConfig | EditorCommandConfig;


/******************************************************************************/

/* Overload 1: Creating a standard commands. */
export function createCommand(plugin: Plugin, config: CommandConfig, handler: HandlerFunction) : Command;

/* Overload 2: Creating a editor command. */
export function createCommand(plugin: Plugin, config: EditorCommandConfig, handler: EditorHandlerFunction) : Command;

/* Overload 3: Creating either a standard or an editor command based on config. */
export function createCommand(plugin: Plugin, config: AnyCommandConfig, handler: AnyHandlerFunction) : Command;

/* The actual factory implementation; create a command either for the command
 * palette or as an editor command, depending on the passed in configuration
 * object.
 *
 * This wraps all of the work required to create the command object that is
 * given back to the API. */
export function createCommand(plugin: Plugin, config: AnyCommandConfig, rawHandler: AnyHandlerFunction) : Command {
  // Is this an editor command?
  if (config.type === 'editor') {
    // Get a check handler; if one was not given, use one that always succeeds.
    const isEnabled = config.check ?? (() => true);
    const handler = rawHandler as EditorHandlerFunction;

    return {
      id: config.id,
      name: config.name,

      // checking === true
      //   Being invoked to see if we should be visible in the command palette
      // checking === false
      //   Being invoked to run the command, but we should still check first.
      editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) => {
        // Per the API, always check to see if we should execute before we do
        // anything.
        if (isEnabled(plugin, editor, view) === false) {
          return false;
        }

        // When checking is false, we were invoked to actually run the command.
        if (checking === false) {
          handler(plugin, editor, view);
        }

        // Whether we did anything or not, we COULD.
        return true;
      }
    }
  } else {
    // This command is a standard command; this works the same as above but
    // with different types and object structure.
    const isEnabled = config.check ?? (() => true);
    const handler = rawHandler as HandlerFunction;

    return {
      id: config.id,
      name: config.name,
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
}


/******************************************************************************/
