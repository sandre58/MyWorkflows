# Create Tag

Create and optionally push a Git tag with a customizable pattern.

## Description

This action creates an annotated Git tag based on a configurable pattern and optionally pushes it to the remote repository. It supports dry-run mode for testing tag creation without actually pushing.

## Inputs

### `project`

**Description:** Project name

**Required:** Yes

**Example:**
```yaml
project: 'MyProject'
```

### `version`

**Description:** Project version

**Required:** Yes

**Example:**
```yaml
version: '1.2.3'
```

### `tag-pattern`

**Description:** Pattern for tag name

**Required:** Yes

**Placeholders:**
- `{project}` - Replaced with project name
- `{version}` - Replaced with version

**Common patterns:**
- `v{version}` → `v1.2.3`
- `{project}/v{version}` → `MyProject/v1.2.3`
- `{project}-v{version}` → `MyProject-v1.2.3`

**Example:**
```yaml
tag-pattern: '{project}/v{version}'
```

### `dry-run`

**Description:** If true, do not push tag, just print what would be done

**Required:** No

**Default:** `false`

**Example:**
```yaml
dry-run: 'true'
```

### `working-directory`

**Description:** Working directory for the repository

**Required:** No

**Default:** `.`

**Example:**
```yaml
working-directory: './src'
```

## Outputs

### `tag-name`

**Description:** The name of the created tag

**Example:** `MyProject/v1.2.3`

## Usage

### Basic usage

```yaml
- name: Create tag
  uses: sandre58/MyWorkflows/actions/create-tag@main
  with:
    project: 'MyProject'
    version: '1.2.3'
    tag-pattern: 'v{version}'
```

### Project-prefixed tags

```yaml
- name: Create project tag
  id: create-tag
  uses: sandre58/MyWorkflows/actions/create-tag@main
  with:
    project: 'MyLibrary'
    version: '2.0.0'
    tag-pattern: '{project}/v{version}'

- name: Use tag name
  run: echo "Created tag: ${{ steps.create-tag.outputs.tag-name }}"
```

### Dry-run mode

```yaml
- name: Test tag creation
  uses: sandre58/MyWorkflows/actions/create-tag@main
  with:
    project: 'MyProject'
    version: '1.0.0-beta.1'
    tag-pattern: '{project}/v{version}'
    dry-run: 'true'
```

### In versioning workflow

```yaml
jobs:
  create-tags:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Compute version
        id: version
        uses: sandre58/MyWorkflows/actions/compute-version@main
        with:
          working-directory: 'src/MyProject'

      - name: Create and push tag
        if: steps.version.outputs.changed == 'true'
        uses: sandre58/MyWorkflows/actions/create-tag@main
        with:
          project: 'MyProject'
          version: ${{ steps.version.outputs.version }}
          tag-pattern: '{project}/v{version}'
```

### Multiple projects with matrix

```yaml
strategy:
  matrix:
    project: [ProjectA, ProjectB, ProjectC]

steps:
  - name: Create tag for ${{ matrix.project }}
    uses: sandre58/MyWorkflows/actions/create-tag@main
    with:
      project: ${{ matrix.project }}
      version: ${{ steps.version.outputs.version }}
      tag-pattern: '{project}/v{version}'
```

## Tag Pattern Examples

| Pattern                  | Project      | Version   | Result               |
|--------------------------|--------------|-----------|----------------------|
| `v{version}`             | Any          | `1.2.3`   | `v1.2.3`             |
| `{project}/v{version}`   | `MyProject`  | `1.2.3`   | `MyProject/v1.2.3`   |
| `{project}-v{version}`   | `MyLib`      | `2.0.0`   | `MyLib-v2.0.0`       |
| `release/{version}`      | Any          | `1.0.0`   | `release/1.0.0`      |
| `{project}/{version}`    | `App`        | `3.1.0`   | `App/3.1.0`          |

## Tag Annotation

The action creates annotated tags with the following message format:

```
Release {project} v{version}

This release was automatically created by GitHub Actions.

Project: {project}
Version: {version}
```

## Features

- Customizable tag naming patterns
- Automatic placeholder replacement
- Annotated tags with metadata
- Dry-run mode for testing
- Configurable working directory
- Returns created tag name for downstream steps

## Requirements

- Git repository with write access
- Bash shell
- Proper Git configuration (user.name and user.email are set by the action)

## Important Notes

- Tags are pushed to remote by default (unless dry-run is enabled)
- Creating a tag with the same name will fail
- The action configures git user as "github-actions" for the tag creation

## Author

sandre58
