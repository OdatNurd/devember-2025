/******************************************************************************/

import { type CommandConfig  } from '#factory/commands';

import { not } from '#commands/combiners';
import { requireMarkdownView, requireExistingSampleView } from '#commands/checks';

import { OpenSimpleModalCommand } from '#commands/standard/open_modal';
import { OpenSampleViewCommand } from '#commands/standard/open_view';
import { DoSimpleInsert } from '#commands/editor/simple';


/******************************************************************************/


/* Our list of command definitions. */
export const commands : CommandConfig[] = [
  /* Standard commands; these just open a modal dialog. The difference in them
   * is in the check that determines if it is OK to do so. The same handler is
   * used in both places. */
  {
    id: 'open-simple-modal-simple',
    name: 'Open simple modal (anywhere)',
    handler: OpenSimpleModalCommand,
  },
  {
    id: 'open-simple-modal-complex',
    name: 'Open simple modal (only markdown)',
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
