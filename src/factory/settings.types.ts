/******************************************************************************/


import type { AbstractInputSuggest, Plugin } from 'obsidian';


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
export interface BaseSettingConfig<T = unknown> {
  type: SettingType;
  disabled?: boolean;

  // Optional list of settings this setting depends on; if any of them changes,
  // the setup for this setting (if configured) will be executed again.
  dependencies?: Array<keyof T>;
};

/* The specific configuration for a text field. */
export interface TextSettingConfig<T> extends BaseSettingConfig<T> {
  type: 'text';
  key: KeysMatching<T, string>;
  placeholder?: string;
}

/* The specific configuration for a multi-line text field. */
export interface TextAreaSettingConfig<T> extends BaseSettingConfig<T> {
  type: 'textarea';
  key: KeysMatching<T, string>;
  placeholder?: string;
}

/* The specific configuration for a numeric field (integer only). */
export interface IntegerSettingConfig<T> extends BaseSettingConfig<T> {
  type: 'integer';
  key: KeysMatching<T, number>;
  placeholder?: string;
}

/* The specific configuration for a numeric field (floating point). */
export interface FloatSettingConfig<T> extends BaseSettingConfig<T> {
  type: 'float';
  key: KeysMatching<T, number>;
  placeholder?: string;
}

/* The specific configuration for a toggle button; this is distinctly boolean;
 * this contains the key in the settings object that represents the value. */
export interface ToggleSettingConfig<T> extends BaseSettingConfig<T> {
  type: 'toggle';
  key: KeysMatching<T, boolean>;

  // Tooltip is either a single string for all cases, or a different tip for
  // both true and false, to help with what the toggle is for.
  tooltip?: [trueValue: string, falseValue: string] | string;
}

/* The specific configuration for a dropdown field (static option list). */
export interface StaticDropdownSettingConfig<T> extends BaseSettingConfig<T> {
  type: 'dropdown';
  key: KeysMatching<T, string>;
  options: Record<string, string>
}

/* The specific configuration for a dropdown field (dynamic option list). */
export interface DynamicDropdownSettingsConfig<T,P extends Plugin> extends BaseSettingConfig<T> {
  type: 'dropdown',
  key: KeysMatching<T, string>;
  loader: (plugin: P, settings: T) => Promise<Record<string,string>>;
}

/* The specific configuration for a slider; this is a number value that is
 * constrained to a range and which jumps in a specific step increment. */
export interface SliderSettingConfig<T> extends BaseSettingConfig<T> {
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
export interface ProgressBarSettingConfig<T> extends BaseSettingConfig<T> {
  type: 'progressbar';
  value: (settings: T) => Promise<number>;
}

/* The specific configuration for a color picker.
 *
 * This is currently set to assume that the colors come and go as "#RRGGBB"
 * style color values; later enhancements could make this support other color
 * systems that the picker works with as needed. */
export interface ColorPickerSettingConfig<T> extends BaseSettingConfig<T> {
  type: 'colorpicker';
  key: KeysMatching<T, string>;
}

/* The specific configuration for a standard button. */
export interface ButtonSettingConfig<T,P extends Plugin> extends BaseSettingConfig<T> {
  type: 'button',
  text: string;
  style?: 'normal' | 'warning' | 'cta';
  tooltip?: string;
  icon?: string;
  click: (plugin: P, settings: T) => Promise<void> | void;
}

/* The specific configuration for an extra button (no text, just icon). */
export interface ExtraButtonSettingConfig<T,P extends Plugin> extends BaseSettingConfig<T> {
  type: 'extrabutton',
  tooltip?: string;
  icon?: string;
  click: (plugin: P, settings: T) => Promise<void> | void;
}

/* The specific configuration for a MomentJS date format box. The includeHelp
 * config, if set to true, causes the description to be expanded to also include
 * help on the format strings and what the format looks like. */
export interface DateFormatSettingConfig<T> extends BaseSettingConfig<T> {
  type: 'dateformat';
  key: KeysMatching<T, string>;
  defaultFormat: string;
  includeHelp?: boolean;
}

/* The specific configuration for a Search widget. */
export interface SearchSettingConfig<T,P extends Plugin> extends BaseSettingConfig<T> {
  type: 'search';
  key: KeysMatching<T, string>;
  placeholder?: string;

  // The constructor for a class that extends AbstractInputSuggest; this will be
  // created and given the current plugin (from which it can gather the app it
  // needs) and the element to attach to.
  handler: new (plugin: P, containerEl: HTMLElement) => AbstractInputSuggest<string>;
}

/* Any given setting can be any of the above types. */
export type SettingConfig<T,P extends Plugin> =
  TextSettingConfig<T> | TextAreaSettingConfig<T> | IntegerSettingConfig<T> |
  FloatSettingConfig<T> | ToggleSettingConfig<T> | StaticDropdownSettingConfig<T> |
  DynamicDropdownSettingsConfig<T,P> | SliderSettingConfig<T> | ProgressBarSettingConfig<T> |
  ColorPickerSettingConfig<T> | ButtonSettingConfig<T,P> | ExtraButtonSettingConfig<T,P> |
  DateFormatSettingConfig<T> | SearchSettingConfig<T,P>;


/* A configuration entry that starts a new visual section/group. Any settings
 * following this entry will belong to this group until the next header is
 * encountered in the config. A default nameless header is created for the first
 * setting if there are instances of this in the config. */
export interface SettingRowHeaderConfig {
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
export interface SettingRowItemConfig<T,P extends Plugin> {
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
export type SettingRowConfig<T,P extends Plugin> = SettingRowHeaderConfig | SettingRowItemConfig<T,P>;


/******************************************************************************/
