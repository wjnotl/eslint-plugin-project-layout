# `project-layout/filename-pattern`

Validate file naming conventions and enforce structural relationships between filenames and their parent directories.

## Motivation

In large codebases, maintaining naming consistency and directory structure is critical. Common issues include:
- A component file named `button.tsx` instead of `Button.tsx`.
- Component folders where the file name does not match the folder name (e.g. `src/components/Modal/Dialog.tsx`).
- Inconsistent file naming across domains, features, or architectural layers.

This rule enforces regex naming conventions for targeted files, with optional verification of directory-filename relationships.

## Rule Options

```jsonc
{
  "project-layout/filename-pattern": [
    "error",
    {
      "patterns": [
        {
          // Glob pattern matching files to validate
          "files": "src/components/**/*.tsx",

          // Required filename regex
          "filename": {
            "regex": "^[A-Z][a-zA-Z0-9]+\\.tsx$"
          },

          // Optional directory relationship checks
          "relationships": [
            {
              "target": "directory",
              // 1 = immediate parent directory, 2 = grandparent directory
              "level": 1,
              // "equals" (exact match) or "matches" (target regex)
              "comparison": "equals",
              // "filename" (full name) or "filename-stem" (name minus removeSuffix)
              "value": "filename-stem",
              // Suffixes to strip when computing the stem
              "removeSuffix": [".tsx", ".component.tsx"]
            }
          ]
        }
      ]
    }
  ]
}
```

### Options Reference

- `patterns` (`Array`, required): A list of pattern rules to evaluate against project files.
  - `files` (`string`, required): Glob pattern identifying which files this pattern applies to.
  - `filename.regex` (`string`, required): Regular expression that the filename (basename) must match.
  - `relationships` (`Array`, optional): Rules asserting a relationship between the filename and its surrounding directory hierarchy:
    - `target` (`"directory"`, required): The target structural element.
    - `level` (`number`, required): Level of directory counting backwards from the file. `1` is the immediate parent directory, `2` is the grandparent directory, etc.
    - `comparison` (`"equals" | "matches"`, required):
      - `"equals"`: Filename value must be strictly identical to the directory name.
      - `"matches"`: Filename value must match the directory name treated as a regular expression.
    - `value` (`"filename" | "filename-stem"`, required):
      - `"filename"`: Compares the complete filename (e.g. `Button.component.tsx`).
      - `"filename-stem"`: Compares the filename after stripping specified suffixes.
    - `removeSuffix` (`string[]`, optional): Array of suffixes to strip when `value` is `"filename-stem"`. Suffixes are evaluated longest-first.

## Examples

### 1. PascalCase React Components Matching Parent Folder

Enforce that component files inside `src/components/<ComponentName>/` must be named `<ComponentName>.tsx`:

```json
{
  "patterns": [
    {
      "files": "src/components/**/*.tsx",
      "filename": {
        "regex": "^[A-Z][a-zA-Z0-9]+\\.tsx$"
      },
      "relationships": [
        {
          "target": "directory",
          "level": 1,
          "comparison": "equals",
          "value": "filename-stem",
          "removeSuffix": [".tsx"]
        }
      ]
    }
  ]
}
```

#### Correct:
- `src/components/Button/Button.tsx`
- `src/components/Modal/Modal.tsx`

#### Incorrect:
- `src/components/button.tsx` (Fails regex)
- `src/components/Header/Button.tsx` (Fails relationship: `Button` != `Header`)

### 2. Kebab-case Utilities

Enforce that utility files must be kebab-case:

```json
{
  "patterns": [
    {
      "files": "src/utils/**/*.ts",
      "filename": {
        "regex": "^[a-z0-9-]+(\\.[a-z0-9-]+)*\\.ts$"
      }
    }
  ]
}
```

#### Correct:
- `src/utils/format-date.ts`
- `src/utils/string-helpers.ts`

#### Incorrect:
- `src/utils/formatDate.ts`
- `src/utils/StringHelpers.ts`
