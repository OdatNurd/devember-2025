/******************************************************************************/


import { Editor, MarkdownView } from 'obsidian';
import { type KursvaroPlugin } from '#plugin';


/******************************************************************************/


/* A simple command that injects some text into the buffer */
export function DoSimpleInsert(_plugin: KursvaroPlugin, editor: Editor, _view: MarkdownView) {
  console.log(editor.getSelection());
  editor.replaceSelection('Sample Editor Command (bewbs)');
}


/******************************************************************************/
