export type CaseType = "camel" | "kebab" | "pascal" | "snake";

export interface ReplaceRule {
  from: string;
  to: string;
}

export interface DirectoryVariableConfig {
  /** Directory level counting backwards from the file. 1 = parent, 2 = grandparent, etc. (Required, min: 1). Cannot be 0. */
  level: number;
  /** Optional find-and-replace rules on directory name using regex. */
  replace?: ReplaceRule | ReplaceRule[];
  /** Optional casing. If omitted, exact casing is preserved (e.g. "aUtH" stays "aUtH"). */
  case?: CaseType;
}

export interface FilenamePatternRuleItem {
  /** Optional base path to strip from the file path before evaluation */
  basePath?: string;
  /** Target file glob(s) */
  files: string | string[];
  /** Optional files or globs to ignore for this pattern */
  ignoredFiles?: string | string[];
  /** Explicit directory variables map (e.g. "module": { level: 1 }) */
  dirs?: Record<string, DirectoryVariableConfig>;
  /** Regular expression the filename must match. Can reference any {variable} defined in `dirs`. */
  filenameRegex: string;
}

export interface FilenamePatternOptions {
  /** Optional global base path for all patterns in this config block */
  basePath?: string;
  /** Optional global files or globs to ignore across all patterns in this rule */
  ignoredFiles?: string | string[];
  /** List of naming rules evaluated in order (first-matching pattern wins) */
  patterns: FilenamePatternRuleItem[];
}

export interface FileLocationRuleItem {
  /** Optional base path to strip from the file path before evaluation */
  basePath?: string;
  /** Target file glob(s) */
  files: string | string[];
  /** Optional files or globs to ignore for this location check */
  ignoredFiles?: string | string[];
  /** Permitted directory glob(s) or regex(es) */
  allowedDirs?: string | string[];
  /** Forbidden directory glob(s) or regex(es) */
  disallowedDirs?: string | string[];
}

export interface FileLocationOptions {
  /** Optional global base path for all patterns in this config block */
  basePath?: string;
  /** Optional global files or globs to ignore across all patterns in this rule */
  ignoredFiles?: string | string[];
  /** List of location rules evaluated in order (first-matching pattern wins) */
  patterns: FileLocationRuleItem[];
}
