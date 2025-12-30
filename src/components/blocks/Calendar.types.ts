/******************************************************************************/


import type { StateSchema } from '#state/generic';
import type { ComponentSchema, GetProps } from '#ui/svelte';


/******************************************************************************/


/* The stored data for the calendar block is empty; it does not need any session
 * data, any ephemeral data, or any plugin data. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CalendarBlockSchema extends StateSchema {

}

/* This type defines the properties that are expected to be passed to the
 * CalendarBlock Svelte component. */
export interface CalendarBlockComponent extends ComponentSchema {
  props: {
    // The year and month that the calendar is portraying.
    year?: number;
    month?: number;

    // The name of this calendar
    name?: string;

    // If provided, all days in the calendar page that match a day in this array
    // will have a marker dot applied to them.
    markedDays?: number[];
  };
}

/* Helper for the Svelte component script block to type its incoming props */
export type CalendarBlockProps = GetProps<CalendarBlockSchema, CalendarBlockComponent>;


/******************************************************************************/
