# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-17

### Added
- Complete rewrite in TypeScript with zero runtime dependencies.
- `project-layout/filename-pattern` rule for validating filename regular expressions and relative directory level relationships (`level`, `comparison`, `value`, `removeSuffix`).
- `project-layout/file-location` rule for restricting files to designated directory glob patterns.
- ESLint Flat Config (`eslint.config.js`) support and legacy config backwards compatibility.
- Comprehensive unit tests with Vitest and ESLint `RuleTester`.
- Full TypeScript declarations and type definitions exported.

