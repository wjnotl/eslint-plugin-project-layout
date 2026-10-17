# `project-layout/file-location`

Ensure files are stored strictly within allowed directories.

## Motivation

In clean architecture and modular codebases, certain types of files belong in specific folders. For instance:
- Test files (`*.test.ts`, `*.spec.ts`) should only live under `tests/**` or `src/**/__tests__`.
- API route handlers should only be placed under `src/routes/**` or `app/api/**`.
- Database migrations should only exist inside `src/db/migrations/**`.

This rule prevents stray files or accidental misplaced modules by enforcing directory constraints based on file patterns.

## Rule Options

```jsonc
{
  "project-layout/file-location": [
    "error",
    {
      "patterns": [
        {
          // Glob matching target files
          "files": "**/*.test.ts",

          // Array of allowed directory glob patterns
          "allowedDirectories": [
            "tests/**",
            "src/**/__tests__"
          ]
        }
      ]
    }
  ]
}
```

### Options Reference

- `basePath` (`string`, optional): Base directory path to strip from files before evaluation. Useful in monorepos or ESLint `overrides` so allowed directories can be defined relative to a subpackage. Can be set globally or per pattern.
- `patterns` (`Array`, required): A list of location rules.
  - `basePath` (`string`, optional): Pattern-specific base path override.
  - `files` (`string`, required): Glob pattern indicating which files this constraint applies to.
  - `allowedDirectories` (`string[]`, required): List of glob patterns matching directories where the matched files are permitted to reside. At least one allowed directory pattern must match the file's parent directory path.

## Examples

### 1. Restrict Unit Tests to Designated Directories

```json
{
  "patterns": [
    {
      "files": "**/*.test.{ts,tsx}",
      "allowedDirectories": [
        "tests/**",
        "src/**/__tests__"
      ]
    }
  ]
}
```

#### Correct:
- `tests/unit/auth.test.ts`
- `src/components/__tests__/Button.test.ts`

#### Incorrect:
- `src/components/Button.test.ts` (Not inside an allowed directory)

### 2. Restrict Migration Scripts

```json
{
  "patterns": [
    {
      "files": "**/*.migration.ts",
      "allowedDirectories": [
        "src/database/migrations"
      ]
    }
  ]
}
```

#### Correct:
- `src/database/migrations/001-init.migration.ts`

#### Incorrect:
- `src/modules/users/001-init.migration.ts`

