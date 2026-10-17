# Contributing to `eslint-plugin-project-layout`

Thank you for considering contributing! We welcome bug reports, documentation updates, and feature contributions.

## Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/wjnotl/eslint-plugin-project-layout.git
   cd eslint-plugin-project-layout
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

5. **Type check**:
   ```bash
   npm run typecheck
   ```

## Development Guidelines

- **TypeScript**: All source code is written in pure TypeScript located in the `src/` directory.
- **Pure & Zero Dependency**: We prioritize lightweight, fast execution without unnecessary runtime dependencies.
- **Testing**: When adding a new rule or modifying existing rules, write comprehensive tests under `tests/` covering both valid and invalid scenarios using Vitest and ESLint's `RuleTester`.
- **Documentation**: If your change modifies or adds rule options, update the corresponding documentation file in `docs/rules/`.

## Submitting a Pull Request

1. Create a feature branch: `git checkout -b feature/my-cool-feature`.
2. Commit your changes with clear, descriptive commit messages.
3. Push to your branch and open a Pull Request.
4. Ensure all CI tests pass.

