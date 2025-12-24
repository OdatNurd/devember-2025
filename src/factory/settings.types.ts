/******************************************************************************/


/* The various distinct kinds of settings that the settings factory supports. */
export type SettingType = 'heading' | 'text' | 'textarea' | 'integer' | 'float' |
                          'toggle' | 'dropdown' | 'slider' | 'progressbar' |
                          'colorpicker';

/* This "helper" type extracts from the type defines as T all keys that are of
 * the type V. */
type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/* The prototype interface for a class that knows how to get at and set the
 * settings for a specific settings type. */
export interface SettingsManager<T> {
  settings: T;
  savePluginData(): Promise<void>
}

/* This interface specifies the fields that are common to all configurtion
 * settings regardles of their type. */
export interface BaseSettingConfig {
  type: SettingType;
  name: string;
  description?: string;
  cssClass?: string;
  disabled?: boolean;
};

/* The specific configuration for a header; this has no extra configuration and
 * the defaults tell us eerything we need. */
export interface HeaderSettingConfig extends BaseSettingConfig {
  type: 'heading';
}

/* The specific configuration for a text value; this contains extra info on the
 * key in the settings object that represents the value, and what the
 * placeholder would be. */
export interface TextSettingConfig<T> extends BaseSettingConfig {
  type: 'text';
  key: KeysMatching<T, string>;
  placeholder?: string;
}

/* The specific configuration for a textarea value; this contains extra info on
 * the key in the settings object that represents the value, and what the
 * placeholder would be. */
export interface TextAreaSettingConfig<T> extends BaseSettingConfig {
  type: 'textarea';
  key: KeysMatching<T, string>;
  placeholder?: string;
}

/* The specific configuration for a numeric integer value; this contains extra
 * info the key in the settings object that represents the value, and what the
 * placeholder would be. */
export interface IntegerSettingConfig<T> extends BaseSettingConfig {
  type: 'integer';
  key: KeysMatching<T, number>;
  placeholder?: string;
}

/* The specific configuration for a numeric float value; this contains extra
 * info the key in the settings object that represents the value, and what the
 * placeholder would be. */
export interface FloatSettingConfig<T> extends BaseSettingConfig {
  type: 'float';
  key: KeysMatching<T, number>;
  placeholder?: string;
}

/* When declaring the tooltip for a toggle button, the tooltip can be either a
 * two element array of strings to specify the value to use when the toggle is
 * true and when the toggle is false, or it can be a string that represents the
 * tooltip to use regardless of the current state. */
type ToggleTooltipType = [trueValue: string, falseValue: string] | string;

/* The specific configuration for a toggle button; this is distinctly boolean;
 * this contains the key in the settings object that represents the value. */
export interface ToggleSettingConfig<T> extends BaseSettingConfig {
  type: 'toggle';
  key: KeysMatching<T, boolean>;

  // This tooltip is the "catch-all"; if present, it's used for any tooltip
  // that might be missing.
  tooltip?: ToggleTooltipType;
}

/* The specific configuration for a dropdown list; this particular config sets
 * the settings key and requires that you give it the options to provide in the
 * list. */
export interface StaticDropdownSettingConfig<T> extends BaseSettingConfig {
  type: 'dropdown';
  key: KeysMatching<T, string>;
  options: Record<string, string>
}

/* As above but in this iteration we need to invoke a function in order to
 * gather the options that we want to populate; this is used for lists that do
 * not depend on static data. */
export interface DynamicDropdownSettingsConfig<T> extends BaseSettingConfig {
  type: 'dropdown',
  key: KeysMatching<T, string>;
  loader: () => Promise<Record<string,string>>;
}

/* The specific configuration for a slider; this is a number value that is
 * constrained to aa range; this contains the key in the settings object that
 * represents the value. */
export interface SliderSettingConfig<T> extends BaseSettingConfig {
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
export interface ProgressBarSettingConfig<T> extends BaseSettingConfig {
  type: 'progressbar';
  value: (settings: T) => Promise<number>;
}

/* The specific configuration for a color picker.
 *
 * This is currently set to assume that the colors come and go as "#RRGGBB"
 * style color values; later enhancements could make this support other color
 * systems that the picker works with as needed. */
export interface ColorPickerSettingConfig<T> extends BaseSettingConfig {
  type: 'colorpicker';
  key: KeysMatching<T, string>;
}

/* Any given setting can be any of the above types. */
export type SettingConfig<T> = HeaderSettingConfig |
                               TextSettingConfig<T> | TextAreaSettingConfig<T> |
                               IntegerSettingConfig<T> | FloatSettingConfig<T> |
                               ToggleSettingConfig<T> |
                               StaticDropdownSettingConfig<T> |
                               DynamicDropdownSettingsConfig<T> |
                               SliderSettingConfig<T> |
                               ProgressBarSettingConfig<T> |
                               ColorPickerSettingConfig<T>;


/******************************************************************************/
