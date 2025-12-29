/******************************************************************************/


import { type Component } from 'svelte';
import { type KursvaroPlugin } from '#plugin';

import { BaseSvelteRenderChild } from '#blocks//base';

import type { CalendarBlockSchema, CalendarBlockComponent, CalendarBlockProps } from '#components/blocks/Calendar.types';
import CalendarBlockComponentView from '#components/blocks/Calendar.svelte';


/******************************************************************************/


/* Instances of this class are registered with the application as the handler
 * for code blocks whose language is `calendar`; this allows us to generate
 * inline calendars inside of Markdown blocks. */
export class CalendarBlockRenderChild
  extends BaseSvelteRenderChild<KursvaroPlugin,
                                CalendarBlockSchema,
                                CalendarBlockComponent> {

  /* Return the Svelte component that should be mounted within this view. */
  getComponent() : Component<CalendarBlockProps> {
    return CalendarBlockComponentView;
  }

  /* Return the properties to be used when the component is mounted. */
  getComponentProps() : CalendarBlockComponent['props'] {
    // In the world of ultra hack, assume that the input is a comma separated
    // string and do conversions; if any of the numbers are not numbers, then we
    // will pass undefined and that will trigger the component to use the
    // component from today's date instead (this also works for the name).
    const [ name, yearPart, monthPart ] = this.source.split(',');
    const year = parseInt(yearPart);
    const month = parseInt(monthPart);

    return {
      year: isNaN(year) ? undefined : year,
      month: isNaN(month) ? undefined : month,
      name
    }
  }

  /* Return the default data to be shared into the shared state that our
   * integration creates; this ultimately turns into a part of the properties
   * that are given to the component. */
  getPluginData() : CalendarBlockSchema['data'] {
    return this.plugin.state.data;
  }
}


/******************************************************************************/
