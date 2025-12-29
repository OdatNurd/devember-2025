/******************************************************************************/


import { type BlockConfig } from '#factory/blocks.types';
import { BoobsBlockRenderChild } from '#blocks/boobs';
import { CalendarBlockRenderChild } from '#blocks/calendar';


/******************************************************************************/


/* Our list of code blocks. */
export const blocks : BlockConfig[] = [
  {
    language: 'boobs',
    handlerClass: BoobsBlockRenderChild,
  },
  {
    language: 'calendar',
    handlerClass: CalendarBlockRenderChild,
  }
]


/******************************************************************************/
