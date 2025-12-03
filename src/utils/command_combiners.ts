/******************************************************************************/


import { Plugin } from 'obsidian';
import { type CheckFunction } from '#utils/command_factory';


/******************************************************************************/


/* This factory combiner will return a check function that returns true only
 * when every check function it is given returns true. */
export function and(...checks: CheckFunction[]) : CheckFunction {
  return (plugin: Plugin) => checks.every(check => check(plugin)) === true;
}


/******************************************************************************/


/* This factory combiner will return a check function that returns true if any
 * of the provided check functions it is given returns true. */
export function or(...checks: CheckFunction[]) : CheckFunction {
  return (plugin: Plugin) => checks.some(check => check(plugin)) === true;
}


/******************************************************************************/


/* This factory combiner takes only a single check function and returns true
 * only when the check function itself returns false, thereby inverting the
 * state of that check. */
export function not(check: CheckFunction) : CheckFunction {
  return (plugin: Plugin) => check(plugin) === false;
}


/******************************************************************************/