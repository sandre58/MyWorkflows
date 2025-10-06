# Create GitHub Release

Create a GitHub release with artifacts.

## Description

This action creates a GitHub release using the `softprops/action-gh-release` action, allowing you to publish release notes and attach artifacts for distribution.

## Inputs

### `tag`

**Description:** Git tag for the release

**Required:** Yes

**Example:**
```yaml
tag: 'v1.2.3'
```

### `project-name`

**Description:** Name of the project

**Required:** Yes

**Example:**
```yaml
project-name: 'MyProject'
```

### `version`

**Description:** Version number

**Required:** Yes

**Example:**
```yaml
version: '1.2.3'
```

### `is-prerelease`

**Description:** Whether this is a prerelease

**Required:** No

**Default:** `false`

**Example:**
```yaml
is-prerelease: 'true'
```

### `draft`

**Description:** Whether this is a draft release

**Required:** No

**Default:** `false`

**Example:**
```yaml
draft: 'true'
```

### `artifacts-path`

**Description:** Path to release artifacts (supports glob patterns)

**Required:** No

**Default:** `packages`

**Example:**
```yaml
artifacts-path: 'packages/*.nupkg'
```

### `release-body`

**Description:** Release description/body (Markdown supported)

**Required:** No

**Default:** `Automated release`

**Example:**
```yaml
release-body: |
  ## What's New
  - Feature 1
  - Feature 2
```

### `github-token`

**Description:** GitHub token for creating release

**Required:** Yes

**Example:**
```yaml
github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Outputs

This action does not produce outputs.

## Usage

### Basic usage

```yaml
- name: Create Release
  uses: sandre58/MyWorkflows/actions/create-release@main
  with:
    tag: 'v1.2.3'
    project-name: 'MyProject'
    version: '1.2.3'
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

### With changelog as body

```yaml
- name: Generate Changelog
  id: changelog
  uses: sandre58/MyWorkflows/actions/generate-changelog@main
  with:
    tag: 'v1.2.3'

- name: Create Release
  uses: sandre58/MyWorkflows/actions/create-release@main
  with:
    tag: 'v1.2.3'
    project-name: 'MyProject'
    version: '1.2.3'
    release-body: ${{ steps.changelog.outputs.changelog }}
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Prerelease

```yaml
- name: Create Prerelease
  uses: sandre58/MyWorkflows/actions/create-release@main
  with:
    tag: 'v1.0.0-beta.1'
    project-name: 'MyProject'
    version: '1.0.0-beta.1'
    is-prerelease: 'true'
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

### With custom artifacts

```yaml
- name: Create Release with Artifacts
  uses: sandre58/MyWorkflows/actions/create-release@main
  with:
    tag: 'v1.2.3'
    project-name: 'MyProject'
    version: '1.2.3'
    artifacts-path: |
      packages/*.nupkg
      apps/*.zip
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Draft release

```yaml
- name: Create Draft Release
  uses: sandre58/MyWorkflows/actions/create-release@main
  with:
    tag: 'v1.2.3'
    project-name: 'MyProject'
    version: '1.2.3'
    draft: 'true'
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Features

- Creates GitHub releases programmatically
- Supports prerelease and draft modes
- Attaches multiple artifacts using glob patterns
- Markdown support for release notes
- Automatic release naming based on project and version

## Requirements

- Valid GitHub token with write permissions
- Git tag must exist in repository

## Author

sandre58
