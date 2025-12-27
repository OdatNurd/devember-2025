/******************************************************************************/


import { AbstractInputSuggest } from 'obsidian';
import type { KursvaroPlugin } from '#plugin';


/******************************************************************************/


/* This is a sample class (probably to be moved to some other locale in the
 * near future) which will be created and associated with a Search component
 * in the settings configuration. */
export class SampleSearchClass extends AbstractInputSuggest<string> {
  plugin: KursvaroPlugin;

  constructor(plugin: KursvaroPlugin, textInputEl: HTMLInputElement | HTMLDivElement) {
    super(plugin.app, textInputEl);
    this.plugin = plugin;
  }

  /* This is invoked whenever the text in the search element is changed; this
   * allows us to find and return all elements whose values match the query
   * string, so that the user can select one. */
  protected getSuggestions(query: string): string[] | Promise<string[]> {
    const options = ["Folder One", "Folder Two", "Folder Three",
                     "File One", "File Two", "File Three"];

    // Use a lowercase filter to filter our hacky item list by the filter.
    const searchQuery = query.toLowerCase();
    const result = options.filter(entry => entry.toLowerCase().includes(searchQuery));

    // console.log(`the query I got was: '${query}'; returning: `, result);
    return result;
  }

  /* This is invoked by the underlying code to populate entries into the search
   * element. There is no default for this, presumably because this is a
   * parameterized type. */
  renderSuggestion(value: string, element: HTMLElement): void {
    element.setText(value);
  }
}


/******************************************************************************/

