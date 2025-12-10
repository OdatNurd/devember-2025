/******************************************************************************/

import { type CommandConfig  } from '#utils/command_factory';

import { requireMarkdownView, requireExistingSampleView } from '#utils/command_checks';
import { not } from '#utils/command_combiners';

import { OpenSimpleModalCommand } from '#commands/simple_modal';
import { DoSimpleInsert } from '#commands/simple_editor';
import { OpenSampleViewCommand } from '#commands/open_sample_view';


/******************************************************************************/


/* Our list of command definitions. */
export const commands : CommandConfig[] = [
  /* Standard commands; these just open a modal dialog. The difference in them
   * is in the check that determines if it is OK to do so. The same handler is
   * used in both places. */
  {
    id: 'open-simple-modal-simple',
    name: 'Open simple modal (simple)',
    handler: OpenSimpleModalCommand,
  },
  {
    id: 'open-simple-modal-complex',
    name: 'Open simple modal (complex)',
    check: requireMarkdownView,
    handler: OpenSimpleModalCommand,
  },


  /****************************************************************************/


  /* Editor commands; this is a simple one that inserts text, possibly replacing
   * what is already present. */
  {
    id: 'sample-editor-command',
    name: 'Sample editor command',
    type: 'editor',
    handler: DoSimpleInsert,
  },


  /****************************************************************************/


  /* This is actually the same command presented twice; once for when there is
   * an existing view, and one for when there is not. The handler will create a
   * view if there is not one and focus one if there is (after possibly doing a
   * create) so the same handler works both ways. */
  {
    id: 'open-sample-view-command',
    name: 'Open Sample View',
    check: not(requireExistingSampleView),
    handler: OpenSampleViewCommand,
  },
  {
    id: 'focus-sample-view-command',
    name: 'Focus Sample View',
    check: requireExistingSampleView,
    handler: OpenSampleViewCommand,
  },
]


/******************************************************************************/
