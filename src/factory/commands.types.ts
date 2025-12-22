/******************************************************************************/


import { Editor, MarkdownView, Plugin } from 'obsidian';


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
