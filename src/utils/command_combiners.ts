/******************************************************************************/


/* A generic type for arguments; this allows the function to adapt to whatever
 * arguments it happens to be provided, allowing it to be used by any command
 * type.
 *
 * This also allows sharing of check functions between different command types,
 * so long as they are careful about their arguments. */
type GenericCheckFunction<Args extends unknown[]> = (...args: Args) => boolean;


/******************************************************************************/


/* This factory combiner will return a check function that returns true only
 * when every check function it is given returns true. */
export function and<Args extends unknown[]>(...checks: GenericCheckFunction<Args>[]) : GenericCheckFunction<Args> {
  return (...args: Args) => checks.every(check => check(...args)) === true;
}


/******************************************************************************/


/* This factory combiner will return a check function that returns true if any
 * of the provided check functions it is given returns true. */
export function or<Args extends unknown[]>(...checks: GenericCheckFunction<Args>[]) : GenericCheckFunction<Args> {
  return (...args: Args) => checks.some(check => check(...args)) === true;
}


/******************************************************************************/


/* This factory combiner takes only a single check function and returns true
 * only when the check function itself returns false, thereby inverting the
 * state of that check. */
export function not<Args extends unknown[]>(check: GenericCheckFunction<Args>) : GenericCheckFunction<Args> {
  return (...args: Args) => check(...args) === false;
}


/******************************************************************************/