/******************************************************************************/


import { parseYaml } from 'obsidian';
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

  /* Treats the source from the code block as YAML frontmatter and parses it
   * in order to gather the properties for the calendar; any and all paramters
   * could be undefined. */
  parseSource() : CalendarBlockComponent['props'] {
    try {
      const data = parseYaml(this.source);
      return {
            name: data?.courseName,
            year: data?.year,
            month: data?.month,
            markedDays: data?.markedDays,
            allowNav: data?.allowNav,
        };
    } catch (error) {
      console.log(`invalid calendar block: ${error}`);
      return {}
    }
  }

  /* Return the properties to be used when the component is mounted. */
  getComponentProps() : CalendarBlockComponent['props'] {
    return this.parseSource();
  }

  /* Return the default data to be shared into the shared state that our
   * integration creates; this ultimately turns into a part of the properties
   * that are given to the component. */
  getPluginData() : CalendarBlockSchema['data'] {
    return this.plugin.state.data;
  }
}


/******************************************************************************/
