/******************************************************************************/


import { type Command } from 'obsidian';
import { type KursvaroPlugin } from 'src/plugin';
import { SampleModal } from '#modals/sample';


/******************************************************************************/


export function SimpleOpenModalCommand(plugin: KursvaroPlugin): Command {
  return {
    id: 'open-sample-modal-simple',
    name: 'Open sample modal (simple)',
    callback: () => {
      console.log('this is the GREATEST command');
      new SampleModal(plugin.app, plugin).open();
    },
  }
}


/******************************************************************************/
