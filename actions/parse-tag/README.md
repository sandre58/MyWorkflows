# Parse Git Tag

Parse a Git tag and extract project name, version, and prerelease information.

## Description

This action parses Git tags in two formats:
- `project-name/vX.Y.Z` - Tag with project name prefix
- `vX.Y.Z` - Simple version tag

It extracts the version number, project name (if present), and detects whether the version is a prerelease based on configurable keywords.

## Inputs

### `tag`

**Description:** Git tag to parse

**Required:** Yes

**Supported formats:**
- `MyProject/v1.2.3`
- `v1.2.3`
- `MyProject/v1.0.0-beta.1`
- `v2.0.0-rc.1`

**Example:**
```yaml
tag: 'MyProject/v1.2.3'
```

### `prerelease-keywords`

**Description:** Keywords that indicate a prerelease version (pipe-separated)

**Required:** No

**Default:** `alpha|beta|rc|preview|pre`

**Example:**
```yaml
prerelease-keywords: 'alpha|beta|rc|preview|nightly'
```

## Outputs

### `version`

**Description:** Extracted version from tag (without 'v' prefix)

**Example:** `1.2.3` or `1.0.0-beta.1`

### `project-name`

**Description:** Extracted project name from tag (empty for `vX.Y.Z` format)

**Example:** `MyProject` or empty string

### `is-prerelease`

**Description:** Whether the version is a prerelease (`true` or `false`)

**Example:** `true` for `v1.0.0-beta.1`, `false` for `v1.2.3`

## Usage

### Basic usage with project prefix

```yaml
- name: Parse tag
  id: parse-tag
  uses: sandre58/MyWorkflows/actions/parse-tag@main
  with:
    tag: 'MyProject/v1.2.3'

- name: Use parsed values
  run: |
    echo "Project: ${{ steps.parse-tag.outputs.project-name }}"
    echo "Version: ${{ steps.parse-tag.outputs.version }}"
    echo "Is Prerelease: ${{ steps.parse-tag.outputs.is-prerelease }}"
```

### Simple version tag

```yaml
- name: Parse tag
  id: parse-tag
  uses: sandre58/MyWorkflows/actions/parse-tag@main
  with:
    tag: 'v2.0.0'

- name: Use version
  run: |
    echo "Version: ${{ steps.parse-tag.outputs.version }}"
    # project-name will be empty
```

### Prerelease detection

```yaml
- name: Parse prerelease tag
  id: parse-tag
  uses: sandre58/MyWorkflows/actions/parse-tag@main
  with:
    tag: 'v1.0.0-beta.1'

- name: Conditional step for prerelease
  if: steps.parse-tag.outputs.is-prerelease == 'true'
  run: echo "This is a prerelease version"
```

### Custom prerelease keywords

```yaml
- name: Parse tag with custom keywords
  id: parse-tag
  uses: sandre58/MyWorkflows/actions/parse-tag@main
  with:
    tag: 'v1.0.0-nightly.20240101'
    prerelease-keywords: 'alpha|beta|rc|nightly|snapshot'
```

### In release workflow

```yaml
on:
  push:
    tags:
      - '**/v*'
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Parse tag
        id: parse-tag
        uses: sandre58/MyWorkflows/actions/parse-tag@main
        with:
          tag: ${{ github.ref_name }}

      - name: Build and release
        run: |
          echo "Building ${{ steps.parse-tag.outputs.project-name }} v${{ steps.parse-tag.outputs.version }}"
```

## Tag Format Examples

| Tag                        | project-name | version       | is-prerelease |
|----------------------------|--------------|---------------|---------------|
| `MyProject/v1.2.3`         | `MyProject`  | `1.2.3`       | `false`       |
| `v2.0.0`                   | ` `          | `2.0.0`       | `false`       |
| `MyLib/v1.0.0-beta.1`      | `MyLib`      | `1.0.0-beta.1`| `true`        |
| `v3.0.0-rc.2`              | ` `          | `3.0.0-rc.2`  | `true`        |
| `MyApp/v0.1.0-alpha`       | `MyApp`      | `0.1.0-alpha` | `true`        |

## Features

- Supports two tag formats (with/without project name)
- Automatic prerelease detection
- Customizable prerelease keywords
- Clear error messages for invalid tag formats
- Regex-based parsing for reliability

## Requirements

- Git tag must follow supported format
- Bash shell

## Author

sandre58
