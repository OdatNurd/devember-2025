/******************************************************************************/


import type { MarkdownPostProcessorContext  } from 'obsidian';
import { type KursvaroPlugin } from '#plugin';
import type { BlockConfig } from '#factory/blocks.types';


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
