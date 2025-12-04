/******************************************************************************/

import { type CommandConfig, type HandlerFunction } from '#utils/command_factory';
import { type EditorCommandConfig, type EditorHandlerFunction } from '#utils/command_factory';

import { requireMarkdownView } from '#utils/command_checks';
import { OpenSimpleModalCommand } from '#commands/simple_modal';
import { DoSimpleInsert } from '#commands/simple_editor';


/******************************************************************************/


/* Instances of this interface are used to create mappings for commands. It can
 * define either a standard command or an editor command. */
export type CommandDeclaration =
  { config: CommandConfig; handler: HandlerFunction; } |
  { config: EditorCommandConfig; handler: EditorHandlerFunction; };


/******************************************************************************/


/* Our list of command definitions. */
export const commands : CommandDeclaration[] = [
  {
    config: {
      id: 'open-simple-modal-simple',
      name: 'Open simple modal (simple)',
    },
    handler: OpenSimpleModalCommand
  },
  {
    config: {
      id: 'open-simple-modal-complex',
      name: 'Open simple modal (complex)',
      check: requireMarkdownView
    },
    handler: OpenSimpleModalCommand
  },

  /****************************************************************************/

  {
    config: {
      id: 'sample-editor-command',
      name: 'Sample editor command',
      type: 'editor',
    },
    handler: DoSimpleInsert
  },
]


/******************************************************************************/
