/******************************************************************************/


/* This "helper" type extracts from the type defines as T all keys that are of
 * the type V. */
type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/* The various distinct kinds of settings that the settings factory supports. */
export type SettingType = 'text' | 'textarea' | 'integer' | 'float' |
                          'toggle' | 'dropdown' | 'slider' | 'progressbar' |
                          'colorpicker' | 'button' | 'extrabutton' |
                          'dateformat' | 'search';

/* The settings handler that adds settings to the page can optionally return a
 * function of this type to indicate that the specific setting instance can
 * respond to dependency changes by updating its state (value, options, etc). */
export type ControlUpdateHandler<T> = (settings: T) => void | Promise<void>;

/* A callback function invoked whenever a setting value has changed and has been
 * persisted to disk. */
export type SettingsChangeListener<T> = (key: keyof T) => void;

/* The prototype interface for a class that knows how to get at and set the
 * settings for a specific settings type. */
export interface SettingsManager<T> {
  settings: T;
  savePluginData(key?: keyof T): Promise<void>;
  onSettingsChange(callback: SettingsChangeListener<T>): void;
}

/* This interface specifies the fields that are common to all configuration
 * settings regardless of their type. */
export interface BaseSetting<T = unknown> {
  type: SettingType;
  disabled?: (settings: T) => boolean;

  // Optional list of settings this setting depends on; if any of them changes,
  // the setup for this setting (if configured) will be executed again.
  dependencies?: Array<keyof T>;
};

/* The specific configuration for a text field. */
export interface TextSetting<T> extends BaseSetting<T> {
  type: 'text';
  key: KeysMatching<T, string>;
  placeholder?: string;
}

/* The specific configuration for a multi-line text field. */
export interface TextAreaSetting<T> extends BaseSetting<T> {
  type: 'textarea';
  key: KeysMatching<T, string>;
  placeholder?: string;
  // Optional, but if not given, default to 'none'.
  resize?: 'none' | 'both' | 'vertical' | 'horizontal';
  lines?: number;
}

/* The specific configuration for a numeric field (integer only). */
export interface IntegerSetting<T> extends BaseSetting<T> {
  type: 'integer';
  key: KeysMatching<T, number>;
  placeholder?: string;
}

/* The specific configuration for a numeric field (floating point). */
export interface FloatSetting<T> extends BaseSetting<T> {
  type: 'float';
  key: KeysMatching<T, number>;
  placeholder?: string;
}

/* The specific configuration for a toggle button; this is distinctly boolean;
 * this contains the key in the settings object that represents the value. */
export interface ToggleSetting<T> extends BaseSetting<T> {
  type: 'toggle';
  key: KeysMatching<T, boolean>;

  // Tooltip is either a single string for all cases, or a different tip for
  // both true and false, to help with what the toggle is for.
  tooltip?: [trueValue: string, falseValue: string] | string;
}

/* The specific configuration for a dropdown field (static option list). */
export interface StaticDropdownSetting<T> extends BaseSetting<T> {
  type: 'dropdown';
  key: KeysMatching<T, string>;
  options: Record<string, string>
}

/* The specific configuration for a dropdown field (dynamic option list). */
export interface DynamicDropdownSettings<T,P> extends BaseSetting<T> {
  type: 'dropdown',
  key: KeysMatching<T, string>;
  loader: (plugin: P, settings: T) => Promise<Record<string,string>>;
}

/* The specific configuration for a slider; this is a number value that is
 * constrained to a range and which jumps in a specific step increment. */
export interface SliderSetting<T> extends BaseSetting<T> {
  type: 'slider',
  key: KeysMatching<T, number>;
  min?: number;
  max?: number;
  step?: number;
}

/* The specific configuration for a progress bar.
 *
 * This does not tie to an actual setting but rather is used for feedback of a
 * percentage. Hence this does not have a key and instead you must provide a
 * handler that will produce the appropriate value. */
export interface ProgressBarSetting<T> extends BaseSetting<T> {
  type: 'progressbar';
  value: (settings: T) => Promise<number>;
}

/* The specific configuration for a color picker.
 *
 * This is currently set to assume that the colors come and go as "#RRGGBB"
 * style color values; later enhancements could make this support other color
 * systems that the picker works with as needed. */
export interface ColorPickerSetting<T> extends BaseSetting<T> {
  type: 'colorpicker';
  key: KeysMatching<T, string>;
}

/* The specific configuration for a standard button. */
export interface ButtonSetting<T,P> extends BaseSetting<T> {
  type: 'button',
  text: string;
  style?: 'normal' | 'warning' | 'cta';
  tooltip?: string;
  icon?: string;
  click: (plugin: P, settings: T) => Promise<void> | void;
}

/* The specific configuration for an extra button (no text, just icon). */
export interface ExtraButtonSetting<T,P> extends BaseSetting<T> {
  type: 'extrabutton',
  tooltip?: string;
  icon?: string;
  click: (plugin: P, settings: T) => Promise<void> | void;
}

/* The specific configuration for a MomentJS date format box. The includeHelp
 * config, if set to true, causes the description to be expanded to also include
 * help on the format strings and what the format looks like. */
export interface DateFormatSetting<T> extends BaseSetting<T> {
  type: 'dateformat';
  key: KeysMatching<T, string>;
  defaultFormat: string;
  includeHelp?: boolean;
}

/* A specialized interface for Search Handlers.
 *
 * This contract decouples the Settings Factory (which deals with opaque items)
 * from the Implementation (which deals with typed items).
 *
 * We accept 'unknown' items because the factory doesn't care what they are,
 * only that they can be converted to the value V. */
export interface SearchSuggest<V> {
    // Converts an opaque item from the search list into a saveable value.
    getSettingValue(item: unknown): V;

    // Optional: Extract display text from the opaque item.
    getItemText?(item: unknown): string;

    // Optional: Validates and parses raw text input into a saveable value.
    // If NOT implemented, or returns null, text input changes are IGNORED (not saved).
    // This allows enforcing "Selection Only" behavior.
    parseInput?(text: string): V | null;

    // Registers a callback for when an item is selected.
    onSearchSelect(callback: (item: unknown, evt: MouseEvent | KeyboardEvent) => void): void;

    // Closes the search results.
    close(): void;
}

/* The specific configuration for a Search widget. The search requires the
 * constructor for a class that can produce values of the appropriate type while
 * still allowing for arbitrary data to be used by the underlying class that
 * drives the search.
 *
 * This is kind of ugly looking, but the notion is that it ensures that whatever
 * the key type is that you assign to the key, the class that is used to drive
 * the search must be set to result in values of that type, or the compiler
 * will yak, which keeps things straight.
 *
 * In use, if the key `myKey` was a string, then the type of the handler will
 * be SearchSuggest<any, string>; the any here indicating that for the
 * purposes of the config, anything is good, but it needs to be something
 * concrete at the implementation side.
 *
 * There may be a better way to do this than this specific incantation from hell
 * but I'm kind of tired of fighting it at this point. */
export type SearchSetting<T,P> = {
  [K in keyof T]: BaseSetting<T> & {
    type: 'search';
    key: K;
    placeholder?: string;
    handler: new (plugin: P, containerEl: HTMLElement) => SearchSuggest<T[K]>;
  }
}[keyof T];

/* Any given setting can be any of the above types. */
export type SettingConfig<T,P> =
  TextSetting<T> | TextAreaSetting<T> | IntegerSetting<T> | FloatSetting<T> |
  ToggleSetting<T> | StaticDropdownSetting<T> | DynamicDropdownSettings<T,P> |
  SliderSetting<T> | ProgressBarSetting<T> | ColorPickerSetting<T> |
  ButtonSetting<T,P> | ExtraButtonSetting<T,P> | DateFormatSetting<T> |
  SearchSetting<T,P>;

/* A configuration entry that starts a new visual section/group. Any settings
 * following this entry will belong to this group until the next header is
 * encountered in the config. A default nameless header is created for the first
 * setting if there are instances of this in the config. */
export interface SettingRowHeader {
  heading: string;
  cssClass?: string;

  // These items appear in setting rows; specifically forbid them to exist in
  // objects of this shape.
  name?: never;
  description?: never;
  items?: never;
}

/* A configuration entry row in the setting page that contains an actual
 * setting. This indicates the name and description of the setting, and an
 * optional CSS class to apply to the group.
 *
 * A list of setting components will be inserted into the row in the order they
 * appear in the items list. */
export interface SettingRowItem<T,P> {
  // The information on the setting this row represents.
  name: string;
  description?: string;
  cssClass?: string;

  // The controls that exist in this row
  items: SettingConfig<T,P>[];

  // A settings item can never be a header, so forbid it explicitly.
  heading?: never;
}

/* A row in the setting page is either a heading row or a setting with one or
 * more components in it. */
export type SettingRow<T,P> = SettingRowHeader | SettingRowItem<T,P>;


/******************************************************************************/
