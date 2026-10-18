# `project-layout/filename-pattern`

Validate file naming conventions and enforce structural relationships between filenames and their parent directories using explicit directory variables.

## Motivation

In large codebases, maintaining naming consistency and directory structure is critical. Common issues include:

- A component file named `button.tsx` instead of `Button.tsx`.
- Component folders where the file name does not match the folder name (e.g. `src/components/Modal/Dialog.tsx`).
- Inconsistent file naming across domains, features, or architectural layers.
- Module barrel files (`index-auth.ts`) needing to strictly reflect their module directory.

This rule enforces regex naming conventions for targeted files, with dynamic extraction and formatting of directory names via `dirs`.

## Rule Options

```jsonc
{
  "project-layout/filename-pattern": [
    "error",
    {
      "patterns": [
        {
          // Glob pattern (or array of globs) matching files to validate
          "files": "src/components/**/*.tsx",

          // Explicit directory variables mapping
          "dirs": {
            "component": {
              "level": 1, // 1 = immediate parent, 2 = grandparent, etc. (Required, min: 1)
              "case": "pascal", // Optional: "camel" | "kebab" | "pascal" | "snake"
            },
          },

          // Required filename regex referencing declared variables
          "filenameRegex": "^{component}\\.tsx$",
        },
      ],
    },
  ],
}
```

### Options Reference

- `basePath` (`string`, optional): Base directory path to strip from files before evaluation (monorepo support). Can be defined globally or per pattern.
- `ignoredFiles` (`string | string[]`, optional): Glob pattern(s) for files to ignore. Can be defined globally or per pattern.
- `patterns` (`Array`, required): A list of pattern rules to evaluate against project files.
  - `files` (`string | string[]`, required): Glob pattern(s) identifying which files this pattern applies to.
  - `filenameRegex` (`string`, required): Regular expression that the filename (basename) must match. Can reference `{variable}` tokens defined in `dirs`.
  - `dirs` (`Record<string, DirectoryVariableConfig>`, optional): Explicit directory variables map.
    - `level` (`number`, required): Directory level counting backwards from the file. `1` is the immediate parent directory, `2` is the grandparent directory, etc. Must be $\ge 1$.
    - `replace` (`{ from: string, to: string } | Array<{ from: string, to: string }>`, optional): Regex find-and-replace rules applied to the directory name. `from` is evaluated as a regular expression.
    - `case` (`"camel" | "kebab" | "pascal" | "snake"`, optional): Casing transform. If omitted, the exact original casing of the directory is preserved (`"aUtH"` stays `"aUtH"`).

---

## Examples

### 1. PascalCase React Components Matching Parent Folder

```json
{
  "patterns": [
    {
      "files": "src/components/**/*.tsx",
      "dirs": {
        "component": { "level": 1 }
      },
      "filenameRegex": "^{component}\\.tsx$"
    }
  ]
}
```

#### Correct:

- `src/components/Button/Button.tsx`
- `src/components/Modal/Modal.tsx`

#### Incorrect:

- `src/components/Button/button.tsx` (Fails exact casing)
- `src/components/Header/Button.tsx` (Fails directory variable: `Button` != `Header`)

---

### 2. Module Routes, Services, and `index-{module}.ts` with Regex Replace

```json
{
  "patterns": [
    {
      "files": "src/modules/*/*.ts",
      "dirs": {
        "module": {
          "level": 1,
          "replace": { "from": "-module$", "to": "" }
        }
      },
      "filenameRegex": "^({module}\\.(routes|service)|index-{module})\\.ts$"
    }
  ]
}
```

#### Correct:

- `src/modules/auth-module/auth.routes.ts`
- `src/modules/auth-module/auth.service.ts`
- `src/modules/auth-module/index-auth.ts`

#### Incorrect:

- `src/modules/auth-module/index-other.ts` (Rejected: `other` != `auth`)
- `src/modules/auth-module/test.routes.ts` (Rejected: `test` != `auth`)

---

### 3. Multiple Directories (Level 2 + Level 1)

```json
{
  "patterns": [
    {
      "files": "src/features/*/*/*.tsx",
      "dirs": {
        "feature": { "level": 2, "replace": { "from": "-feature$", "to": "" } },
        "component": { "level": 1, "case": "pascal" }
      },
      "filenameRegex": "^{feature}-{component}\\.tsx$"
    }
  ]
}
```

#### Correct:

- `src/features/billing-feature/button/billing-Button.tsx`
