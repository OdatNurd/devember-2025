/******************************************************************************/


import { type Command, Plugin } from 'obsidian';


/******************************************************************************/

/* A function that checks to see if a command should be available right now in
 * the command palette or not. This should return true or false accordingly
 * based on the check it implements. */
export type CheckFunction = (plugin: Plugin) => boolean;

/* A function that actually carries out a command execution. */
export type HandlerFunction = (plugin: Plugin) => void;

/* A configuration object that defines a specific command. */
export interface CommandConfig {
  /* Globally unique identifier for the command. */
  id: string;

  /* Human readable name for the command in the command palette. */
  name: string;

  /* Optional check function; if this is set, then it will be invoked whenever
   * the command is about to be displayed in the command palette or when the
   * command is about to execute, to determine whether or not the the command
   * should be available.
   *
   * The command will not be executed if this returns false or undefined. */
  check?: CheckFunction;
}


/******************************************************************************/


/* This is a simple factory to create a command for the command palette based on
 * a simple configuration and a handler function.
 *
 * This wraps all of the work required to create the command object that is
 * given back to the API. */
export function createCommand(plugin: Plugin, config: CommandConfig, handler: HandlerFunction) : Command {
  // Get a check handler; if one was not given, use one that always succeeds.
  const isEnabled = config.check ?? (() => true);

  return {
    id: config.id,
    name: config.name,

    // checking === true
    //   Being invoked to see if we should be visible in the command palette
    // checking === false
    //   Being invoked to run the command, but we should still check first.
    checkCallback: (checking: boolean) => {
      // Per the API, always check to see if we should execute before we do
      // anything.
      if (isEnabled(plugin) === false) {
        return false;
      }

      // When checking is false, we were invoked to actually run the command.
      if (checking === false) {
        handler(plugin);
      }

      // Whether we did anything or not, we COULD.
      return true;
    }
  }
}


/******************************************************************************/
