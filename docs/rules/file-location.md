# `project-layout/file-location`

Ensure files are stored strictly within allowed (or outside disallowed) directories.

## Motivation

In clean architecture and modular codebases, certain types of files belong in specific folders. For instance:

- Test files (`*.test.ts`, `*.spec.ts`) should only live under `tests/**` or `src/**/__tests__`.
- API route handlers and services should only be placed under `src/modules/**`.
- Database schemas and migrations should only exist inside designated database folders.
- Mock files and fixture data must never end up in production bundles.

This rule enforces directory constraints based on file patterns.

## Rule Options

```jsonc
{
  "project-layout/file-location": [
    "error",
    {
      "patterns": [
        {
          // Glob matching target files (string or array)
          "files": ["**/*.test.ts", "**/*.spec.ts"],

          // Optional files to ignore from location check
          "ignoredFiles": ["**/setup.test.ts"],

          // Array of allowed directory glob/regex patterns
          "allowedDirs": ["tests/**", "src/**/__tests__"],

          // Optional array of disallowed directory patterns
          "disallowedDirs": ["src/production/**"],
        },
      ],
    },
  ],
}
```

### Options Reference

- `basePath` (`string`, optional): Base directory path to strip from files before evaluation (monorepo support). Can be defined globally or per pattern.
- `ignoredFiles` (`string | string[]`, optional): Glob pattern(s) for files to ignore. Can be defined globally or per pattern.
- `patterns` (`Array`, required): A list of location rules.
  - `files` (`string | string[]`, required): Glob pattern(s) indicating which files this constraint applies to.
  - `allowedDirs` (`string | string[]`, optional): Allowed directory globs (e.g. `tests/**`) or regexes (starting with `^`).
  - `disallowedDirs` (`string | string[]`, optional): Disallowed directory globs or regexes. Matching files must NOT live in these directories.

---

## Examples

### 1. Restrict Unit Tests to Designated Directories

```json
{
  "patterns": [
    {
      "files": ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
      "ignoredFiles": ["**/setup.test.ts"],
      "allowedDirs": ["tests/**", "src/**/__tests__"]
    }
  ]
}
```

#### Correct:

- `tests/unit/auth.test.ts`
- `src/components/__tests__/Button.test.ts`
- `src/setup.test.ts` (Ignored)

#### Incorrect:

- `src/components/Button.test.ts` (Not inside an allowed directory)

---

### 2. Forbid Mocks from Production Bundles (`disallowedDirs`)

```json
{
  "patterns": [
    {
      "files": ["**/*.mock.ts", "**/fixtures/**"],
      "disallowedDirs": ["src/core/**", "src/public/**"]
    }
  ]
}
```

#### Correct:

- `tests/mocks/user.mock.ts`

#### Incorrect:

- `src/core/auth.mock.ts` (Inside a disallowed directory)
