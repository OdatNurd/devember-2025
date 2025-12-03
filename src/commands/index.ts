/******************************************************************************/

import { type CommandConfig, type HandlerFunction } from '#utils/command_factory';

import { requireMarkdownView } from '#utils/command_checks';
import { OpenSimpleModalCommand } from '#commands/simple_modal';


/******************************************************************************/


/* Instances of this interface are used to create mappings for commands. */
export interface CommandDeclaration {
  /* The configuration object that defines the command properties. */
  config: CommandConfig

  /* The handler for the command that is the concrete implemenation of its
   * functionality. */
  handler: HandlerFunction
}


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
]


/******************************************************************************/
