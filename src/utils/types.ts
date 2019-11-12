export interface Dictionary<T> {
  [key: string]: T;
}

export type VueCssClasses = string | Dictionary<boolean> | (string | Dictionary<boolean>)[];
