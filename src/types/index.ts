export type RelationshipTarget = "directory";
export type RelationshipComparison = "equals" | "matches";
export type RelationshipValue = "filename" | "filename-stem";

export interface RelationshipConfig {
  target: RelationshipTarget;
  level: number;
  comparison: RelationshipComparison;
  value: RelationshipValue;
  removeSuffix?: string[];
}

export interface FilenamePatternRuleItem {
  /** Optional base path to strip from the file path before evaluation */
  basePath?: string;
  files: string;
  filename: {
    regex: string;
  };
  relationships?: RelationshipConfig[];
}

export interface FilenamePatternOptions {
  /** Optional global base path for all patterns in this config block */
  basePath?: string;
  patterns: FilenamePatternRuleItem[];
}

export interface FileLocationRuleItem {
  /** Optional base path to strip from the file path before evaluation */
  basePath?: string;
  files: string;
  allowedDirectories: string[];
}

export interface FileLocationOptions {
  /** Optional global base path for all patterns in this config block */
  basePath?: string;
  patterns: FileLocationRuleItem[];
}
