# Configs

## Lint config

A shared config for oxlint

## Format config

A shared config for oxfmt

## Development

### Prerequisites

- Node.js (from `engines.node` field in `package.json`)
- Bun (from `packageManager` field in `package.json`)

Run `bun install` to build the package and install the pre-commit hook. The repo's
configs and hook use `dist`, so run `bun run build` after changing source files
before running lint, format, or dependency checks. In CI, postinstall is skipped;
build explicitly before running checks.
