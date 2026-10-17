# eslint-plugin-project-layout

[![npm version](https://img.shields.io/npm/v/eslint-plugin-project-layout.svg)](https://www.npmjs.com/package/eslint-plugin-project-layout)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js CI](https://github.com/wjnotl/eslint-plugin-project-layout/actions/workflows/ci.yml/badge.svg)](https://github.com/wjnotl/eslint-plugin-project-layout/actions)

An ESLint plugin to enforce directory layouts, file locations, and filename conventions across your codebase.

Written entirely in **TypeScript**, fully compatible with **ESLint 9 Flat Config** and **ESLint 8 Legacy Config**.

---

## Features

- 🎯 **Enforce Filename Patterns**: Restrict filenames to specific regex formats based on glob patterns.
- 🔗 **Filename-Directory Relationships**: Ensure filenames correlate with their enclosing directories (e.g., `Button.tsx` inside a `Button/` directory).
- 📂 **Restrict File Locations**: Restrict sensitive or architectural files (like tests, migrations, api routes) to designated directories.
- ⚡ **Zero Bloat & Blazing Fast**: Pure TypeScript, minimal footprint, and zero external runtime dependencies.
- 🧩 **First-Class Flat Config Support**: Designed for ESLint 9+ flat config while preserving legacy `.eslintrc` compatibility.

---

## Installation

```bash
# npm
npm install --save-dev eslint-plugin-project-layout

# pnpm
pnpm add -D eslint-plugin-project-layout

# yarn
yarn add -D eslint-plugin-project-layout

# bun
bun add -d eslint-plugin-project-layout
```

---

## Usage

### ESLint Flat Config (`eslint.config.js` or `eslint.config.mjs`) — Recommended (ESLint v9+)

```javascript
import projectLayout from "eslint-plugin-project-layout";

export default [
  {
    plugins: {
      "project-layout": projectLayout,
    },
    rules: {
      // 1. Enforce filename patterns and folder relationships
      "project-layout/filename-pattern": [
        "error",
        {
          patterns: [
            {
              files: "src/components/**/*.tsx",
              filename: {
                regex: "^[A-Z][a-zA-Z0-9]+\\.tsx$",
              },
              relationships: [
                {
                  target: "directory",
                  level: 1, // immediate parent folder
                  comparison: "equals",
                  value: "filename-stem",
                  removeSuffix: [".tsx"],
                },
              ],
            },
          ],
        },
      ],

      // 2. Ensure files live only in allowed directories
      "project-layout/file-location": [
        "error",
        {
          patterns: [
            {
              files: "**/*.test.ts",
              allowedDirectories: ["tests/**", "src/**/__tests__"],
            },
          ],
        },
      ],
    },
  },
];
```

### ESLint Legacy Config (`.eslintrc.js` or `.eslintrc.json`) (ESLint v8)

```javascript
module.exports = {
  plugins: ["project-layout"],
  rules: {
    "project-layout/filename-pattern": [
      "error",
      {
        patterns: [
          {
            files: "src/components/**/*.tsx",
            filename: {
              regex: "^[A-Z][a-zA-Z0-9]+\\.tsx$",
            },
          },
        ],
      },
    ],
  },
};
```

---

## Rules

| Rule                                                                | Description                                                                 |   Recommended   |
| :------------------------------------------------------------------ | :-------------------------------------------------------------------------- | :-------------: |
| [`project-layout/filename-pattern`](docs/rules/filename-pattern.md) | Enforce filename regex patterns and optional parent directory relationships | ⚠️ Configurable |
| [`project-layout/file-location`](docs/rules/file-location.md)       | Ensure matching files only reside within approved directories               | ⚠️ Configurable |

---

## Configuration Recipes

### 1. React Component Folders

Ensure that each component lives in its own directory named identically to the component:

- `src/components/Button/Button.tsx` ✅
- `src/components/Button/Modal.tsx` ❌

```json
{
  "rules": {
    "project-layout/filename-pattern": [
      "error",
      {
        "patterns": [
          {
            "files": "src/components/**/*.tsx",
            "filename": { "regex": "^[A-Z][a-zA-Z0-9]+\\.tsx$" },
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
    ]
  }
}
```

### 2. Strict Test File Locations

Disallow stray unit tests in feature folders:

```json
{
  "rules": {
    "project-layout/file-location": [
      "error",
      {
        "patterns": [
          {
            "files": "**/*.test.{ts,tsx}",
            "allowedDirectories": ["tests/**", "src/**/__tests__"]
          }
        ]
      }
    ]
  }
}
```

---

## TypeScript Support

This plugin includes full TypeScript type definitions out of the box. You can import types directly into your config or tooling:

```typescript
import type {
  FilenamePatternOptions,
  FileLocationOptions,
  RelationshipConfig,
} from "eslint-plugin-project-layout";
```

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

[MIT](LICENSE) © 2026
