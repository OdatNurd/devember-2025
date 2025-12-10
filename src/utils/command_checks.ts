/******************************************************************************/


import { MarkdownView, Plugin } from 'obsidian';

import { VIEW_TYPE_SAMPLE } from '#views/sample_view';


/******************************************************************************/


/* This check returns true when the currently active view is a markdown view. */
export function requireMarkdownView(plugin: Plugin) : boolean {
  return plugin.app.workspace.getActiveViewOfType(MarkdownView) !== null;
}


/******************************************************************************/


/* This check returns true when there is at least one sample view that is
 * currently open in the workspace. */
export function requireExistingSampleView(plugin: Plugin) : boolean {
  const leaves = plugin.app.workspace.getLeavesOfType(VIEW_TYPE_SAMPLE);
  return leaves.length !== 0;
}


/******************************************************************************/


/* This check returns true when there is a currently active file. */
export function requireActiveFile(plugin: Plugin) : boolean {
  return plugin.app.workspace.getActiveFile() !== null;
}


/******************************************************************************/
