# Publish .NET Package

Publish NuGet packages to a specified source (NuGet.org, GitHub Packages, private feeds, etc.).

## Description

This action publishes NuGet packages to a NuGet feed using `dotnet nuget push`. It supports multiple packages, skip-duplicate mode, and custom arguments.

## Inputs

### `packages-path`

**Description:** Path to packages to publish (glob pattern)

**Required:** Yes

**Example:**
```yaml
packages-path: 'packages/*.nupkg'
```

### `source-url`

**Description:** NuGet source URL for publishing

**Required:** Yes

**Common sources:**
- NuGet.org: `https://api.nuget.org/v3/index.json`
- GitHub Packages: `https://nuget.pkg.github.com/<OWNER>/index.json`

**Example:**
```yaml
source-url: 'https://api.nuget.org/v3/index.json'
```

### `api-key`

**Description:** API key or token for publishing

**Required:** Yes

**Example:**
```yaml
api-key: ${{ secrets.NUGET_API_KEY }}
```

### `skip-duplicate`

**Description:** Whether to skip duplicate packages

**Required:** No

**Default:** `true`

**Example:**
```yaml
skip-duplicate: 'false'
```

### `additional-args`

**Description:** Additional arguments for `dotnet nuget push` command

**Required:** No

**Example:**
```yaml
additional-args: '--timeout 300'
```

## Outputs

This action does not produce outputs.

## Usage

### Publish to NuGet.org

```yaml
- name: Publish to NuGet
  uses: sandre58/MyWorkflows/actions/nuget-push@main
  with:
    packages-path: 'packages/*.nupkg'
    source-url: 'https://api.nuget.org/v3/index.json'
    api-key: ${{ secrets.NUGET_API_KEY }}
```

### Publish to GitHub Packages

```yaml
- name: Publish to GitHub Packages
  uses: sandre58/MyWorkflows/actions/nuget-push@main
  with:
    packages-path: 'packages/*.nupkg'
    source-url: 'https://nuget.pkg.github.com/${{ github.repository_owner }}/index.json'
    api-key: ${{ secrets.GITHUB_TOKEN }}
```

### Publish with symbols

```yaml
- name: Publish packages
  uses: sandre58/MyWorkflows/actions/nuget-push@main
  with:
    packages-path: 'packages/*.nupkg'
    source-url: 'https://api.nuget.org/v3/index.json'
    api-key: ${{ secrets.NUGET_API_KEY }}

- name: Publish symbols
  uses: sandre58/MyWorkflows/actions/nuget-push@main
  with:
    packages-path: 'packages/*.snupkg'
    source-url: 'https://api.nuget.org/v3/index.json'
    api-key: ${{ secrets.NUGET_API_KEY }}
```

### Allow duplicate packages

```yaml
- name: Publish (allow duplicates)
  uses: sandre58/MyWorkflows/actions/nuget-push@main
  with:
    packages-path: 'packages/*.nupkg'
    source-url: 'https://api.nuget.org/v3/index.json'
    api-key: ${{ secrets.NUGET_API_KEY }}
    skip-duplicate: 'false'
```

### With custom timeout

```yaml
- name: Publish with timeout
  uses: sandre58/MyWorkflows/actions/nuget-push@main
  with:
    packages-path: 'packages/*.nupkg'
    source-url: 'https://api.nuget.org/v3/index.json'
    api-key: ${{ secrets.NUGET_API_KEY }}
    additional-args: '--timeout 600'
```

### Complete workflow

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Download packages
        uses: actions/download-artifact@v4
        with:
          name: nuget-packages
          path: packages

      - name: Publish to NuGet
        uses: sandre58/MyWorkflows/actions/nuget-push@main
        with:
          packages-path: 'packages/*.nupkg'
          source-url: 'https://api.nuget.org/v3/index.json'
          api-key: ${{ secrets.NUGET_API_KEY }}
```

## Common Sources

### NuGet.org

```yaml
source-url: 'https://api.nuget.org/v3/index.json'
api-key: ${{ secrets.NUGET_API_KEY }}
```

### GitHub Packages

```yaml
source-url: 'https://nuget.pkg.github.com/<OWNER>/index.json'
api-key: ${{ secrets.GITHUB_TOKEN }}
```

### Azure Artifacts

```yaml
source-url: 'https://pkgs.dev.azure.com/<ORGANIZATION>/_packaging/<FEED>/nuget/v3/index.json'
api-key: ${{ secrets.AZURE_DEVOPS_TOKEN }}
```

### MyGet

```yaml
source-url: 'https://www.myget.org/F/<FEED>/api/v3/index.json'
api-key: ${{ secrets.MYGET_API_KEY }}
```

## Additional Arguments

Common additional arguments:

- `--timeout <seconds>` - Timeout for push operation
- `--no-symbols` - Don't push symbol packages
- `--disable-buffering` - Disable buffering for HTTP requests
- `--force-english-output` - Force output in English

## Skip Duplicate Behavior

When `skip-duplicate` is `true`:
- If package version already exists, push is skipped
- No error is raised
- Useful for CI/CD workflows that may re-run

When `skip-duplicate` is `false`:
- Push fails if package version already exists
- Error is raised
- Use for strict versioning workflows

## Features

- Supports glob patterns for multiple packages
- Skip duplicate packages mode
- Configurable timeout
- Works with any NuGet v3 feed
- Custom arguments support

## Requirements

- .NET SDK installed (or use a .NET runner)
- Valid API key for target source
- NuGet packages to publish

## Important Notes

- API keys should always be stored as secrets
- Symbol packages (.snupkg) should be pushed separately
- Some feeds (like NuGet.org) have validation requirements
- First-time package push may require email confirmation

## Author

sandre58
