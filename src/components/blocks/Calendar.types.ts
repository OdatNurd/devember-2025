/******************************************************************************/


import type { KursvaroData } from '#types';
import type { StateSchema } from '#state/generic';
import type { ComponentSchema, GetProps } from '#ui/svelte';


/******************************************************************************/


/* The stored data for the calendar block is empty; it does not need any session
 * data, any ephemeral data, or any plugin data. */
export interface CalendarBlockSchema extends StateSchema {
  data: KursvaroData
}

/* Defines the hierarchical structure for marking days. The top level has a year
 * as a key, with a value that is a similar structure to what's seen here. That
 * structure has months as a key, which associates to a list of days. */
export type MarkedDaysTree = Record<number, Record<number, number[]>>;

/* Represents a distinct set of marked days with a specific type (color). */
export interface MarkedDayGroup {
    type: string;
    dates: MarkedDaysTree;
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

    // If provided, this object provides a mapping of what year/month/day
    // combinations should be marked on the calendar. This is a tree; see the
    // comments on the type for details.
    markedDays?: MarkedDayGroup[];

    // When true, the calendar will have navigation controls to allow you to
    // alter the date it's showing.
    allowNav?: boolean
  };
}

/* Helper for the Svelte component script block to type its incoming props */
export type CalendarBlockProps = GetProps<CalendarBlockSchema, CalendarBlockComponent>;


/******************************************************************************/
