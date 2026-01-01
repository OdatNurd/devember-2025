/******************************************************************************/


import { type BlockConfig } from '#factory/blocks.types';
import { SampleBlockRenderChild } from '#blocks/sample';
import { CalendarBlockRenderChild } from '#blocks/calendar';


/******************************************************************************/


/* Our list of code blocks. */
export const blocks : BlockConfig[] = [
  {
    language: 'sample',
    handlerClass: SampleBlockRenderChild,
  },
  {
    language: 'calendar',
    handlerClass: CalendarBlockRenderChild,
  }
]


/******************************************************************************/
