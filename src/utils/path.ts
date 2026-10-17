/**
 * Normalizes Windows backslashes into forward slashes and collapses multiple slashes.
 */
export function normalizePath(filepath: string): string {
  return filepath.replace(/\\/g, "/").replace(/\/+/g, "/");
}

/**
 * Extracts the relative filepath from the ESLint rule context.
 * Optionally resolves relative to an additional `basePath` (e.g. for monorepos or subpackages).
 * Compatible with ESLint 8 and 9 (both flat and legacy configs).
 */
export function getRelativePath(
  context: {
    filename?: string;
    getFilename?: () => string;
    cwd?: string;
    getCwd?: () => string;
  },
  basePath?: string
): string {
  const rawFilename =
    context.filename ??
    (typeof context.getFilename === "function" ? context.getFilename() : "");
  let filepath = normalizePath(rawFilename);

  const rawCwd =
    context.cwd ??
    (typeof context.getCwd === "function" ? context.getCwd() : "");
  let cwd = rawCwd ? normalizePath(rawCwd).replace(/\/$/, "") : "";

  if (basePath) {
    const normalizedBase = normalizePath(basePath).replace(/^\/+|\/+$/g, "");
    if (cwd) {
      cwd = `${cwd}/${normalizedBase}`;
    } else {
      cwd = normalizedBase;
    }
  }

  if (cwd && filepath.startsWith(`${cwd}/`)) {
    filepath = filepath.slice(cwd.length + 1);
  } else if (basePath) {
    // If filepath was already relative to root or didn't contain full cwd prefix
    const normalizedBase = normalizePath(basePath).replace(/^\/+|\/+$/g, "");
    if (filepath === normalizedBase) {
      filepath = "";
    } else if (filepath.startsWith(`${normalizedBase}/`)) {
      filepath = filepath.slice(normalizedBase.length + 1);
    }
  }

  return filepath.replace(/^\.\//, "");
}

/**
 * Gets the filename portion of a normalized filepath.
 */
export function getFilename(filepath: string): string {
  return filepath.split("/").pop() ?? "";
}

/**
 * Gets the directory portion of a normalized filepath.
 */
export function getDirectory(filepath: string): string {
  const segments = filepath.split("/");
  segments.pop();
  return segments.join("/");
}

/**
 * Gets the directory at a specific level counting backwards from the file's parent directory.
 * Level 1 is the immediate parent directory.
 * Level 2 is the grandparent directory, etc.
 */
export function getDirectoryAtLevel(filepath: string, level: number): string | null {
  const dir = getDirectory(filepath);
  const segments = dir.split("/");

  if (!Number.isInteger(level) || level < 1 || level > segments.length) {
    return null;
  }

  return segments[segments.length - level];
}
