/******************************************************************************/


import type { MarkdownPostProcessorContext, MarkdownRenderChild  } from 'obsidian';
import { type KursvaroPlugin } from '#plugin';


/******************************************************************************/


/* This type represents the constructor that allows for the creation of a code
 * block handler; it should follow this signature and be able to return an
 * instance of a class that derives from the Obsidian MarkdownRenderChild class
 * responsible for rendering code blocks. */
export type BlockClassConstructor = new (plugin: KursvaroPlugin, containerEl: HTMLElement, language: string, source: string) => MarkdownRenderChild;


/* A simple type that maps code blocks to the handlers that represent them. */
export interface BlockConfig {
  /* The code block languages handled by this handler. */
  language: string;

  /* The class that is responsible for handling elements of this type. */
  handlerClass: BlockClassConstructor;
}


/******************************************************************************/

/* The actual factory implementation; create a command either for the command
 * palette or as an editor command, depending on the passed in configuration
 * object.
 *
 * This wraps all of the work required to create the command object that is
 * given back to the API. */
export function setupBlockHandler(plugin: KursvaroPlugin, config: BlockConfig) : void {
  plugin.registerMarkdownCodeBlockProcessor(config.language,
    async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
      ctx.addChild(new config.handlerClass(plugin, el, config.language, source));
    });
}


/******************************************************************************/
