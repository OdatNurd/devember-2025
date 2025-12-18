/******************************************************************************/


import { type GetProps } from '#ui/svelte';


/******************************************************************************/


/* The information that the status bar component stores. */
export interface StatusBarSchema {
  /* Fields here have their data persisted within the Obsidian workspace as long
   * as the view is open; then it is discarded. *
   *
   * The other two fields being missing indicates that they are not needed. */
  session: {
    activeLeafName: string;
  }
}

/* This component schema contains no properties or exports; note that even so
 * the sharedData prop will be injected by the system. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StatusBarComponent {
  // This space intentionally blank
}

/* Helper for the Svelte component script block to type its incoming props */
export type StatusBarProps = GetProps<StatusBarSchema, StatusBarComponent>;


/******************************************************************************/
