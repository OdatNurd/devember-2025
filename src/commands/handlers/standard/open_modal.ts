/******************************************************************************/


import { type KursvaroPlugin } from '#plugin';

import { SampleModal } from '#ui/modals/sample';


/******************************************************************************/


/* A simple command that opens a modal with a svelte component in it. */
export function OpenSimpleModalCommand(plugin: KursvaroPlugin) {
  new SampleModal(plugin, 'Simple Modal').open();
}


/******************************************************************************/
