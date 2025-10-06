# Compute Version

Compute next version for a project using semantic versioning based on commit messages.

## Description

This action analyzes git commit messages using conventional commits format and calculates the next semantic version for your project. It considers commit types (feat, fix, BREAKING CHANGE) to determine whether to bump major, minor, or patch version.

## Inputs

### `tag-pattern`

**Description:** Pattern for tag name

**Required:** No

**Default:** `v{version}`

**Example:**
```yaml
tag-pattern: 'v{version}'          # Results in: v1.2.3
tag-pattern: 'MyProject/v{version}' # Results in: MyProject/v1.2.3
```

### `working-directory`

**Description:** Working directory for the repository (path to the project folder)

**Required:** No

**Default:** `.`

**Example:**
```yaml
working-directory: 'src/MyProject'
```

## Outputs

### `version`

**Description:** Computed semantic version (e.g., `1.2.3`)

### `changed`

**Description:** Whether the version has changed since the last tag (`true` or `false`)

## Usage

### Basic usage

```yaml
- name: Compute version
  id: version
  uses: sandre58/MyWorkflows/actions/compute-version@main
  with:
    tag-pattern: 'v{version}'
    working-directory: '.'

- name: Display version
  run: |
    echo "Version: ${{ steps.version.outputs.version }}"
    echo "Changed: ${{ steps.version.outputs.changed }}"
```

### For monorepo projects

```yaml
- name: Compute version for ProjectA
  id: version-a
  uses: sandre58/MyWorkflows/actions/compute-version@main
  with:
    tag-pattern: 'ProjectA/v{version}'
    working-directory: 'src/ProjectA'

- name: Compute version for ProjectB
  id: version-b
  uses: sandre58/MyWorkflows/actions/compute-version@main
  with:
    tag-pattern: 'ProjectB/v{version}'
    working-directory: 'src/ProjectB'
```

### With matrix strategy

```yaml
jobs:
  compute:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        project: ['ProjectA', 'ProjectB', 'ProjectC']
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Compute version
        id: version
        uses: sandre58/MyWorkflows/actions/compute-version@main
        with:
          tag-pattern: '${{ matrix.project }}/v{version}'
          working-directory: 'src/${{ matrix.project }}'
```

## How it works

1. Analyzes git history from the last tag matching the pattern
2. Parses commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
3. Determines version bump:
   - `BREAKING CHANGE` → Major version bump (1.0.0 → 2.0.0)
   - `feat:` → Minor version bump (1.0.0 → 1.1.0)
   - `fix:` → Patch version bump (1.0.0 → 1.0.1)
4. Returns the computed version and whether it changed

## Conventional Commits Examples

```bash
# Patch version bump
fix: correct calculation error

# Minor version bump
feat: add user authentication

# Major version bump
feat: redesign API

BREAKING CHANGE: the API endpoints have changed
```

## Features

- Semantic versioning (SemVer) compliant
- Supports monorepo with project-specific tags
- Detects if version changed since last tag
- Generates project summary in GitHub Actions UI
- Based on conventional commits standard

## Requirements

- Git repository with fetch-depth: 0
- Node.js 20 (automatically installed by the action)
- Conventional commit format in commit messages

## Author

sandre58
