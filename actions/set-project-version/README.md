# Set Project Version

Set version for a single .NET project using semantic versioning based on conventional commits.

## Description

This action computes a semantic version for a .NET project based on its git history and conventional commits. It uses tag patterns to identify project-specific tags and determine version changes.

## Inputs

### `project-path`

**Description:** Path to the `.csproj` file

**Required:** Yes

**Example:**
```yaml
project-path: 'src/MyProject/MyProject.csproj'
```

### `project-name`

**Description:** Name of the project

**Required:** Yes

**Example:**
```yaml
project-name: 'MyProject'
```

### `project-dir`

**Description:** Directory containing the project

**Required:** Yes

**Example:**
```yaml
project-dir: 'src/MyProject'
```

### `tag-pattern`

**Description:** Pattern for tag names

**Required:** No

**Default:** `{project}/v{version}`

**Placeholders:**
- `{project}` - Replaced with project name
- `{version}` - Replaced with version number

**Common patterns:**
- `{project}/v{version}` → `MyProject/v1.2.3`
- `v{version}` → `v1.2.3`

**Example:**
```yaml
tag-pattern: '{project}/v{version}'
```

### `dotnet-versions`

**Description:** Versions of .NET to install (newline separated)

**Required:** No

**Default:**
```yaml
10.0.x
9.0.x
8.0.x
```

**Example:**
```yaml
dotnet-versions: |
  8.0.x
  9.0.x
```

## Outputs

### `version`

**Description:** Computed version for the project

**Example:** `1.2.3` or `1.0.0-beta.1`

### `changed`

**Description:** Whether the version has changed since the last tag (`true` or `false`)

**Example:** `true`

## Usage

### Basic usage

```yaml
- name: Set project version
  id: version
  uses: sandre58/MyWorkflows/actions/set-project-version@main
  with:
    project-path: 'src/MyProject/MyProject.csproj'
    project-name: 'MyProject'
    project-dir: 'src/MyProject'

- name: Use version
  run: |
    echo "Version: ${{ steps.version.outputs.version }}"
    echo "Changed: ${{ steps.version.outputs.changed }}"
```

### Simple version tags

```yaml
- name: Set version with simple tags
  id: version
  uses: sandre58/MyWorkflows/actions/set-project-version@main
  with:
    project-path: 'MyApp.csproj'
    project-name: 'MyApp'
    project-dir: '.'
    tag-pattern: 'v{version}'
```

### Conditional build on version change

```yaml
- name: Compute version
  id: version
  uses: sandre58/MyWorkflows/actions/set-project-version@main
  with:
    project-path: 'src/MyProject/MyProject.csproj'
    project-name: 'MyProject'
    project-dir: 'src/MyProject'

- name: Build and pack
  if: steps.version.outputs.changed == 'true'
  run: dotnet pack src/MyProject/MyProject.csproj -p:Version=${{ steps.version.outputs.version }}
```

### In monorepo with matrix

```yaml
strategy:
  matrix:
    project:
      - name: 'Core'
        path: 'src/Core/Core.csproj'
        dir: 'src/Core'
      - name: 'Extensions'
        path: 'src/Extensions/Extensions.csproj'
        dir: 'src/Extensions'

steps:
  - name: Set version for ${{ matrix.project.name }}
    id: version
    uses: sandre58/MyWorkflows/actions/set-project-version@main
    with:
      project-path: ${{ matrix.project.path }}
      project-name: ${{ matrix.project.name }}
      project-dir: ${{ matrix.project.dir }}
```

### Complete versioning workflow

```yaml
jobs:
  version:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Compute version
        id: version
        uses: sandre58/MyWorkflows/actions/set-project-version@main
        with:
          project-path: 'src/MyProject/MyProject.csproj'
          project-name: 'MyProject'
          project-dir: 'src/MyProject'

      - name: Update project file
        if: steps.version.outputs.changed == 'true'
        run: |
          dotnet build src/MyProject/MyProject.csproj \
            -p:Version=${{ steps.version.outputs.version }}

      - name: Create tag
        if: steps.version.outputs.changed == 'true'
        uses: sandre58/MyWorkflows/actions/create-tag@main
        with:
          project: 'MyProject'
          version: ${{ steps.version.outputs.version }}
          tag-pattern: '{project}/v{version}'
```

## How It Works

1. Calculates tag pattern by replacing `{project}` with project name
2. Uses `compute-version` action to analyze git history for that pattern
3. Determines next semantic version based on conventional commits
4. Returns version and change status

## Version Calculation

The action uses conventional commits to determine version bumps:

- `feat:` → Minor version bump (1.0.0 → 1.1.0)
- `fix:` → Patch version bump (1.0.0 → 1.0.1)
- `BREAKING CHANGE:` → Major version bump (1.0.0 → 2.0.0)
- Other commits → Patch version bump

## Features

- Semantic versioning based on conventional commits
- Project-specific tag patterns
- Version change detection
- Monorepo support
- Customizable .NET SDK versions
- Automatic tag pattern calculation

## Requirements

- Git repository with fetch-depth: 0 (full history)
- Conventional commit messages
- Bash shell

## See Also

- [compute-version](../compute-version/README.md) - Underlying version computation action
- [create-tag](../create-tag/README.md) - Create Git tags for versions

## Author

sandre58
