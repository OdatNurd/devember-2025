/******************************************************************************/


import { parseYaml } from 'obsidian';
import { type Component } from 'svelte';
import { type KursvaroPlugin } from '#plugin';

import { BaseSvelteRenderChild } from '#blocks//base';

import type { CalendarBlockSchema, CalendarBlockComponent, CalendarBlockProps, MarkedDaysTree } from '#components/blocks/Calendar.types';
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

  /* Given an input value of unknown structure, validate that it conforms to the
   * structure that is intended for the markedDays property.
   *
   * The return value is a new version of the data from the input, with all of
   * the invalid entries removed and all others conforming to the appropriate
   * types.
   *
   * The return is undefined if the input is wholly invalid. */
  validateMarkedDays(input: unknown) : MarkedDaysTree | undefined {
    // If the value is not present, is an array, or is not an object, then this
    // is not the correct kind of thing.
    if (input === null || Array.isArray(input) === true || typeof input !== 'object') {
      return undefined;
    }

    const result: MarkedDaysTree = {};

    // We have an object, iterate over the keys and values, validating them.
    for (const [yearKey, months] of Object.entries(input as Record<string, unknown>)) {
      // If the year key was not a number, or the value is not an object, then
      // we  should skip this entry because this key is not valid.
      const year = Number(yearKey);
      if (isNaN(year) || months === null || Array.isArray(months) === true || typeof months !== 'object') {
        continue;
      }

      const validMonths: Record<number, number[]> = {};

      // Iterate over the keys and values, ensuring that we have the right
      // structure, skipping any that are not valid.
      for (const [monthKey, days] of Object.entries(months as Record<string, unknown>)) {
        // If the month key isn't a valid number, or the value isn't an array,
        // skip this entry.
        const month = Number(monthKey);
        if (isNaN(month) || Array.isArray(days) === false) {
          continue;
        }

        // Pull out all of the entries that are numbers; the rest we will ignore.
        validMonths[month] = days.filter(item => typeof item === 'number');
      }

      // If we ended up with some valid days for this month, then we can add
      // it to the result.
      // Only add the year if we found valid month data.
      if (Object.keys(validMonths).length > 0) {
        result[year] = validMonths;
      }
    }

    return result;
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
            markedDays: this.validateMarkedDays(data?.markedDays),
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
