import type { RelationshipComparison, RelationshipConfig } from "../types";

/**
 * Extracts the value to compare against a target directory.
 * - 'filename': the full filename (e.g. Button.component.tsx)
 * - 'filename-stem': the filename stripped of any matching suffix in removeSuffix
 */
export function getComparisonValue(
  filename: string,
  relationship: RelationshipConfig
): string | null {
  if (relationship.value === "filename") {
    return filename;
  }

  if (relationship.value === "filename-stem") {
    let stem = filename;
    const suffixes = [...(relationship.removeSuffix ?? [])].sort(
      (a, b) => b.length - a.length
    );

    for (const suffix of suffixes) {
      if (stem.endsWith(suffix)) {
        stem = stem.slice(0, -suffix.length);
        break;
      }
    }

    return stem;
  }

  return null;
}

/**
 * Evaluates if a filename value matches the target directory value based on comparison mode.
 */
export function relationshipMatches(
  filenameValue: string,
  targetValue: string,
  comparison: RelationshipComparison
): boolean {
  if (comparison === "equals") {
    return filenameValue === targetValue;
  }

  if (comparison === "matches") {
    try {
      return new RegExp(targetValue).test(filenameValue);
    } catch {
      return false;
    }
  }

  return false;
}

