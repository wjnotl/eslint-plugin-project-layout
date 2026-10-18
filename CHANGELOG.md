# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-18

### Added

- `filename-pattern`: Added `dirs` map to explicitly define directory variables with `level` (min: 1), regex `replace` (`{ from, to }`), and optional `case` (`"camel" | "kebab" | "pascal" | "snake"`).
- `filename-pattern`: Added direct `filenameRegex` property supporting `{variable}` interpolation.
- `filename-pattern`: Added global and pattern-level `ignoredFiles` support.
- `file-location`: Added `allowedDirs` and `disallowedDirs` (shorter, concise property names).
- `file-location`: Added regex directory pattern matching support (patterns starting with `^`).
- `file-location`: Added global and pattern-level `ignoredFiles` support.
- Support for `string | string[]` across `files`, `allowedDirs`, and `disallowedDirs`.

### Removed

- `filename-pattern`: Removed legacy `relationships` configuration and `filename: { regex }` object syntax in favor of `filenameRegex` and `dirs`.
- `file-location`: Removed `allowedDirectories` and `disallowedDirectories` in favor of `allowedDirs` and `disallowedDirs`.
- Removed `recommended-legacy` configuration preset.
- Dropped Node.js 18 support from CI and engine requirements (minimum `node: ">=20.0.0"`).

## [1.0.0] - 2026-10-17

### Added

- Complete rewrite in TypeScript with zero runtime dependencies.
- `project-layout/filename-pattern` rule for validating filename regular expressions and relative directory level relationships (`level`, `comparison`, `value`, `removeSuffix`).
- `project-layout/file-location` rule for restricting files to designated directory glob patterns.
- ESLint Flat Config (`eslint.config.js`) support and legacy config backwards compatibility.
- Comprehensive unit tests with Vitest and ESLint `RuleTester`.
- Full TypeScript declarations and type definitions exported.
