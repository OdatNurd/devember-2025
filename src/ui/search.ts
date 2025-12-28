/******************************************************************************/


import { AbstractInputSuggest, setIcon } from 'obsidian';
import type { KursvaroPlugin } from '#plugin';
import type { SearchSuggest } from '#factory/settings.types';


/******************************************************************************/


/* A generic search base class that bridges the Obsidian API (Typed Items)
 * with the Settings Factory Contract (Opaque Items). The I is the type of the
 * object that is used internally for the list, while the V is the type of the
 * value that should be saved to settings. */
export abstract class BaseSearch<I,V> extends AbstractInputSuggest<I>
                                                  implements SearchSuggest<V> {
  plugin: KursvaroPlugin;
  private _onSearchSelectCallback?: (item: unknown, evt: MouseEvent | KeyboardEvent) => void;

  constructor(plugin: KursvaroPlugin, textInputEl: HTMLInputElement | HTMLDivElement) {
    super(plugin.app, textInputEl);
    this.plugin = plugin;
  }

  /* Register to be told when the selection of the item in the list changes. */
  onSearchSelect(callback: (item: unknown, evt: MouseEvent | KeyboardEvent) => void): void {
    this._onSearchSelectCallback = callback;
  }

  /* Implement this to define what gets saved to the settings. */
  getSettingValue(item: unknown): V {
    // This cast is safe because 'item' originated from this class instance.
    return this.getSuggestionValue(item as I);
  }

  /* Implement this to define what gets saved to the settings. */
  getItemText(item: unknown): string {
    return String(this.getSettingValue(item));
  }

  /* Default strict behavior: Do not save text input unless it is selected
   * from the list. Override this in subclasses to allow free-text entry. */
  parseInput(_text: string): V | null {
    return null;
  }


  /* Define what gets saved to the settings from a typed item. */
  abstract getSuggestionValue(item: I): V;


  /* Intercept the selection to notify the Factory about the change. */
  selectSuggestion(value: I, evt: MouseEvent | KeyboardEvent): void {
    if (this._onSearchSelectCallback) {
      this._onSearchSelectCallback(value, evt);
    }

    super.selectSuggestion(value, evt);
  }

  /* Default rendering: just shows the text. Override to show icons/html. */
  renderSuggestion(item: I, element: HTMLElement): void {
    element.setText(this.getItemText(item));
  }
}


/******************************************************************************/


/* This demo uses a simple string search; here the hardcoded list of items is
 * just strings, which are searched and used directly. */
export class SampleSearchStringClass extends BaseSearch<string, string> {
  items = ["Folder One", "Folder Two", "Folder Three",
           "File One", "File Two", "File Three"];

  protected getSuggestions(query: string) : string[] | Promise<string[]> {
    const lower = query.toLowerCase();
    return this.items.filter(i => i.toLowerCase().includes(lower));
  }

  getSuggestionValue(item: string) : string {
    return item;
  }

  // Override: Allow free-text entry for this string setting.
  parseInput(text: string): string | null {
    return text;
  }
}


/******************************************************************************/


/* This demo uses a complex object, where the ID is the number that is actually
 * inserted into the setting, but the label and icon are used to construct a
 * suggest item that is more complex than just a simple value. */
type CustomItem = { id: number, label: string, icon: string };
export class SampleSearchNumberClass extends BaseSearch<CustomItem, number> {
  items: CustomItem[] = [
    { icon: 'smile', label: 'Nice', id: 69  },
    { icon: 'leaf',  label: 'High', id: 420 },
    { icon: 'skull', label: 'Evil', id: 666 },
  ];

  protected getSuggestions(query: string): CustomItem[] {
    const lower = query.toLowerCase();

    // Here our suggestion query needs to filter by the label that the user can
    // see in the box.
    return this.items.filter(i => i.label.toLowerCase().includes(lower));
  }

  renderSuggestion(item: CustomItem, element: HTMLElement): void {
    setIcon(element.createSpan({ cls: 'suggestion-icon' }), item.icon);
    element.createSpan({ text: ` ${item.label}` });
  }

  /* When asked for the setting value, use the ID of the selected item, which
   * happens to be the correct type because that's how demo's work. */
  getSuggestionValue(item: CustomItem): number {
    return item.id;
  }

  /* Since this example uses a more complex data type, we need to specify what
   * gets sent to the text box in the search control as a result of an item
   * being chosen. Here that is the ID value (converted to string) because what
   * is displayed and what is saved to the setting should probably be the same,
   * or else when the settings opens next time, you will see a number that has
   * no correlation with reality, and be confused.*/
  getItemText(item: CustomItem): string {
    return String(item.id);
  }
}


/******************************************************************************/
