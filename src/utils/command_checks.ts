/******************************************************************************/


import { MarkdownView, Plugin } from 'obsidian';


/******************************************************************************/


/* This check returns true when the currently active view is a markdown view. */
export function requireMarkdownView(plugin: Plugin) : boolean {
  return plugin.app.workspace.getActiveViewOfType(MarkdownView) !== null;
}


/******************************************************************************/


/* This check returns true when there is a currently active file. */
export function requireActiveFile(plugin: Plugin) : boolean {
  return plugin.app.workspace.getActiveFile() !== null;
}


/******************************************************************************/
