import { normalizePath } from "./path";

/**
 * Escapes characters with special meaning in regular expressions.
 */
export function escapeRegex(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

/**
 * Converts a glob string (* and **) into a RegExp.
 * Correctly handles:
 * - leading `**\/` (e.g. `**\/*.ts` matches `foo.ts` and `src/foo.ts`)
 * - middle `/**\/` (e.g. `src/**\/*.ts` matches `src/foo.ts` and `src/a/b/foo.ts`)
 * - trailing `/**` (e.g. `tests/**` matches `tests`, `tests/a`, `tests/a/b`)
 * - single `*` (matches within a path segment)
 * - `?` (matches single character except `/`)
 */
export function globToRegExp(glob: string): RegExp {
  let result = "^";

  for (let i = 0; i < glob.length; i += 1) {
    // Leading **/
    if (i === 0 && glob.startsWith("**/")) {
      result += "(?:.+/)?";
      i += 2;
      continue;
    }

    // Trailing /**
    if (glob.slice(i) === "/**") {
      result += "(?:/.*)?";
      i += 2;
      continue;
    }

    // Middle /**/
    if (glob.slice(i, i + 4) === "/**/") {
      result += "(?:/|/.+/)";
      i += 3;
      continue;
    }

    const char = glob[i];

    if (char === "*") {
      if (glob[i + 1] === "*") {
        result += ".*";
        i += 1;
      } else {
        result += "[^/]*";
      }
    } else if (char === "?") {
      result += "[^/]";
    } else {
      result += escapeRegex(char);
    }
  }

  result += "$";

  return new RegExp(result);
}

/**
 * Checks whether a given filepath matches a glob pattern.
 * If the glob contains no slash, it matches against the filename basename only.
 */
export function matchesGlob(glob: string, filepath: string): boolean {
  const normalizedGlob = normalizePath(glob);
  const normalizedPath = normalizePath(filepath);

  if (globToRegExp(normalizedGlob).test(normalizedPath)) {
    return true;
  }

  // A pattern without a slash is treated as a filename pattern.
  if (!normalizedGlob.includes("/")) {
    const basename = normalizedPath.split("/").pop() ?? "";
    return globToRegExp(normalizedGlob).test(basename);
  }

  return false;
}

/**
 * Checks whether a given filepath matches any of the specified glob patterns.
 */
export function matchesAnyGlob(
  globs: string | string[] | undefined,
  filepath: string
): boolean {
  if (!globs) return false;
  if (Array.isArray(globs)) {
    return globs.some((glob) => matchesGlob(glob, filepath));
  }
  return matchesGlob(globs, filepath);
}

/**
 * Checks whether a directory path matches a directory pattern (supports both globs and regex starting with ^).
 */
export function matchesDirectoryPattern(
  pattern: string,
  directory: string
): boolean {
  if (pattern.startsWith("^")) {
    try {
      return new RegExp(pattern).test(directory);
    } catch {
      return false;
    }
  }
  return matchesGlob(pattern, directory);
}

/**
 * Checks whether a directory path matches any directory pattern.
 */
export function matchesAnyDirectoryPattern(
  patterns: string | string[] | undefined,
  directory: string
): boolean {
  if (!patterns) return false;
  if (Array.isArray(patterns)) {
    return patterns.some((p) => matchesDirectoryPattern(p, directory));
  }
  return matchesDirectoryPattern(patterns, directory);
}
