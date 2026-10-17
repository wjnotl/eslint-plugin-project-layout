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
  files: string;
  filename: {
    regex: string;
  };
  relationships?: RelationshipConfig[];
}

export interface FilenamePatternOptions {
  patterns: FilenamePatternRuleItem[];
}

export interface FileLocationRuleItem {
  files: string;
  allowedDirectories: string[];
}

export interface FileLocationOptions {
  patterns: FileLocationRuleItem[];
}
