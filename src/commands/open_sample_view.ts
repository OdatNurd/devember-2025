/******************************************************************************/


import { Notice, WorkspaceLeaf } from 'obsidian';

import { type KursvaroPlugin } from 'src/plugin';
import { VIEW_TYPE_SAMPLE } from '#views/sample_view';


/******************************************************************************/


/* A simple command that either focuses an existing instance of the sample view
 * or creates a new one. */
export async function OpenSampleViewCommand(plugin: KursvaroPlugin) {
  const { workspace } = plugin.app;

  // Try to find all of the leaves of the particular type that we want to
  // activate.
  let leaf: WorkspaceLeaf | null = null;
  const leaves = workspace.getLeavesOfType(VIEW_TYPE_SAMPLE);

  // If we found any, then use the first one as the view to reveal.
  if (leaves.length > 0) {
    leaf = leaves[0];
  } else {
    // There isn't one of us in the workspace, so create a new one. It is
    // important to set the view state type because otherwise Obsidian does
    // not know what type of view this is.
    leaf = workspace.getRightLeaf(false);
    if (leaf !== null) {
      await leaf.setViewState({ type: VIEW_TYPE_SAMPLE });
    }
  }

  // Tell the workspace to reveal it.
  if (leaf !== null) {
    new Notice('Activated the view');
    workspace.revealLeaf(leaf);
  }
}


/******************************************************************************/
