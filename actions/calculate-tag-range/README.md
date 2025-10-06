# Calculate Tag Range

Calculate the tag range for changelog generation, finding the previous tag before the current tag.

## Description

This action automatically determines the tag range for changelog generation by finding the previous tag before the current one. It intelligently extracts a pattern from the current tag to find matching previous tags (e.g., for `MyProject/v1.2.3`, it looks for `MyProject/v*` tags).

## Inputs

### `current-tag`

**Description:** Current tag to calculate range for

**Required:** Yes

**Example:**
```yaml
current-tag: 'v1.2.3'
```

## Outputs

### `tag-range`

**Description:** Calculated tag range for use with git log or changelog tools

**Format:** `previous-tag..current-tag` or just `current-tag` if no previous tag exists

**Example:** `v1.0.0..v1.2.3` or `v1.2.3`

### `previous-tag`

**Description:** Previous tag found (empty if none)

**Example:** `v1.0.0` or empty string

### `pattern`

**Description:** Tag pattern used for filtering (auto-calculated from current tag)

**Example:** `MyProject/v*` or `v*`

## Usage

### Basic usage

```yaml
- name: Calculate tag range
  id: tag-range
  uses: sandre58/MyWorkflows/actions/calculate-tag-range@main
  with:
    current-tag: 'v1.2.3'

- name: Generate changelog
  run: |
    echo "Tag range: ${{ steps.tag-range.outputs.tag-range }}"
    echo "Previous tag: ${{ steps.tag-range.outputs.previous-tag }}"
```

### With project-specific tags

```yaml
- name: Calculate range for MyProject
  id: tag-range
  uses: sandre58/MyWorkflows/actions/calculate-tag-range@main
  with:
    current-tag: 'MyProject/v1.2.3'

# Pattern will be auto-calculated as: MyProject/v*
# Finds: MyProject/v1.0.0..MyProject/v1.2.3
```

### In release workflow

```yaml
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Calculate tag range
        id: tag-range
        uses: sandre58/MyWorkflows/actions/calculate-tag-range@main
        with:
          current-tag: ${{ github.ref_name }}

      - name: Generate changelog
        uses: sandre58/MyWorkflows/actions/generate-changelog@main
        with:
          tag: ${{ github.ref_name }}
          tag-range: ${{ steps.tag-range.outputs.tag-range }}
```

### First release (no previous tag)

```yaml
- name: Calculate tag range
  id: tag-range
  uses: sandre58/MyWorkflows/actions/calculate-tag-range@main
  with:
    current-tag: 'v1.0.0'

# Output:
# tag-range: v1.0.0 (all history)
# previous-tag: (empty)
```

## Pattern Auto-Calculation

The action automatically calculates a pattern from the current tag:

| Current Tag          | Auto-Calculated Pattern | Finds                   |
|----------------------|-------------------------|-------------------------|
| `v1.2.3`             | `v*`                    | All `v*` tags           |
| `MyProject/v1.2.3`   | `MyProject/v*`          | All `MyProject/v*` tags |
| `app-v1.0.0-beta.1`  | `app-v*`                | All `app-v*` tags       |
| `v2.0.0-rc.1`        | `v*`                    | All `v*` tags           |

## How It Works

1. Extracts pattern from current tag by replacing version numbers with `*`
2. Lists all tags matching the pattern, sorted by version (descending)
3. Finds the current tag in the list
4. Returns the next tag in the list as previous tag
5. Constructs range as `previous-tag..current-tag`

## Features

- Automatic pattern extraction from current tag
- Version-aware tag sorting
- Handles project-prefixed tags
- Handles prerelease versions (alpha, beta, rc, etc.)
- Works with first release (no previous tag)
- Returns both range and individual tags

## Requirements

- Git repository with fetch-depth: 0 (full history)
- Bash shell
- Valid Git tags

## Author

sandre58
