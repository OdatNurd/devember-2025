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

  /* Treats the source from the code block as a series of "key=value" type lines
   * and parses them out, using recognized keys to set props and ignoring all
   * other keys in the source block. */
  parseSource() : CalendarBlockComponent['props'] {
    const props : CalendarBlockComponent['props'] = {}

    // Iterate over all of the lines in the source
    for (const line of this.source.split('\n')) {
      // Lines with no '=' can't be part of a key, so skip them.
      if (line.includes('=') === false) {
        continue;
      }

      // Using '=' as the split, gather the key and value portion; we need to
      // capture potentially many values, in case it has an embedded '='
      const [keyPart, ...valueParts] = line.split('=');
      const key = keyPart.trim();
      const value = (valueParts.join('=')).trimStart();

      // A helper because I am a stupid old man that cares about making software
      // do redundant work for no reason other than it looks nicer in the code.
      const stringToNumber = (value: string) => {
        const result = parseInt(value);
        return isNaN(result) ? undefined : result;
      }

      // Handle the key appropriately.
      switch (key) {
        case 'courseName':
          props.name = value;
          break;

        case 'year':
          props.year = stringToNumber(value);
          break;

        case 'month':
          props.month = stringToNumber(value);
          break;

        case 'markedDays':
          props.markedDays = value.split(',')
                               .map(v => stringToNumber(v))
                               .filter(v => v !== undefined);
          break;

        default:
          console.log(`unknown calendar key '${key.trim()}'`);
          break;
      }
    }

    return props;
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
