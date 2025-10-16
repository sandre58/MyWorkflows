# GitVersion Action

This action calculates semantic version information using GitVersion.

## Description

This action installs GitVersion and calculates version information based on your git history and GitVersion configuration. It's designed to be reusable across multiple jobs and workflows.

## Prerequisites

- A `GitVersion.yml` configuration file at the root of your repository
- Git repository with proper commit history

## Usage

```yaml
steps:
  - uses: actions/checkout@v4
    with:
      fetch-depth: 0  # Important: GitVersion needs full git history

  - name: Get Version
    id: version
    uses: sandre58/MyWorkflows/actions/gitversion@main

  - name: Use Version
    run: |
      echo "SemVer: ${{ steps.version.outputs.semver }}"
      echo "Full SemVer: ${{ steps.version.outputs.fullsemver }}"
```

## Outputs

| Output | Description | Example |
|--------|-------------|---------|
| `semver` | Semantic version | `1.2.3` |
| `fullsemver` | Full semantic version with metadata | `1.2.3-beta.1+commitId` |
| `major` | Major version number | `1` |
| `minor` | Minor version number | `2` |
| `patch` | Patch version number | `3` |
| `prereleasetag` | Pre-release tag | `beta` |
| `assemblysemver` | Assembly semantic version | `1.2.3.0` |
| `informationalversion` | Informational version | `1.2.3-beta.1+Branch.feature.Sha.abc123` |

## GitVersion Configuration

Create a `GitVersion.yml` file at the root of your repository:

```yaml
mode: Mainline
branches:
  main:
    regex: ^main$
    increment: Minor
  feature:
    regex: ^feature/.*
    increment: Minor
  hotfix:
    regex: ^hotfix/.*
    increment: Patch
  release:
    regex: ^release/.*
    increment: None
```

## Notes

- This action requires a full git checkout (`fetch-depth: 0`)
- GitVersion analyzes git history to determine version increments
- The action automatically installs GitVersion 5.x
- All GitVersion outputs are displayed in the action logs for debugging