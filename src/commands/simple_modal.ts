/******************************************************************************/


import { type KursvaroPlugin } from '#plugin';

import { SampleModal } from '#modals/sample';


/******************************************************************************/


/* A simple command that opens a modal with a svelte component in it. */
export function OpenSimpleModalCommand(plugin: KursvaroPlugin) {
  new SampleModal(plugin.app, plugin).open();
}


/******************************************************************************/
