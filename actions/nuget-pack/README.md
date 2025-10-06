# Pack .NET Package

Pack a .NET project into NuGet packages (.nupkg and .snupkg).

## Description

This action builds and packs a .NET project into NuGet packages using `dotnet pack`. It supports custom versioning, build configuration, and additional MSBuild properties.

## Inputs

### `project-path`

**Description:** Path to the project file (`.csproj`)

**Required:** No (if not specified, packs all projects in solution)

**Example:**
```yaml
project-path: 'src/MyLibrary/MyLibrary.csproj'
```

### `version`

**Description:** Package version

**Required:** No

**Example:**
```yaml
version: '1.2.3'
```

### `configuration`

**Description:** Build configuration

**Required:** No

**Default:** `Release`

**Possible values:** `Release`, `Debug`, or custom configurations

**Example:**
```yaml
configuration: 'Release'
```

### `output-dir`

**Description:** Output directory for packages

**Required:** No

**Default:** `packages`

**Example:**
```yaml
output-dir: 'dist/packages'
```

### `additional-properties`

**Description:** Additional MSBuild properties (space-separated, format: `Key=Value`)

**Required:** No

**Example:**
```yaml
additional-properties: 'Authors="John Doe" Copyright="2024 MyCompany"'
```

### `pack-args`

**Description:** Additional arguments for `dotnet pack` command

**Required:** No

**Example:**
```yaml
pack-args: '--include-symbols --include-source'
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

### `packages-path`

**Description:** Glob pattern to generated packages

**Example:** `packages/*.nupkg`

### `output-directory`

**Description:** Output directory containing packages

**Example:** `packages`

## Usage

### Basic usage

```yaml
- name: Pack NuGet package
  uses: sandre58/MyWorkflows/actions/nuget-pack@main
  with:
    project-path: 'src/MyLibrary/MyLibrary.csproj'
    version: '1.2.3'
```

### With symbols and source

```yaml
- name: Pack with symbols
  uses: sandre58/MyWorkflows/actions/nuget-pack@main
  with:
    project-path: 'src/MyLibrary/MyLibrary.csproj'
    version: '1.2.3'
    pack-args: '--include-symbols --include-source'
```

### Custom output directory

```yaml
- name: Pack to custom directory
  uses: sandre58/MyWorkflows/actions/nuget-pack@main
  with:
    project-path: 'src/MyLibrary/MyLibrary.csproj'
    version: '2.0.0'
    output-dir: 'artifacts/nuget'
```

### With additional properties

```yaml
- name: Pack with metadata
  uses: sandre58/MyWorkflows/actions/nuget-pack@main
  with:
    project-path: 'src/MyLibrary/MyLibrary.csproj'
    version: '1.2.3'
    additional-properties: 'Authors="John Doe" PackageLicenseExpression=MIT RepositoryUrl=https://github.com/user/repo'
```

### Multiple projects with matrix

```yaml
strategy:
  matrix:
    project:
      - name: 'MyLibrary.Core'
        path: 'src/Core/MyLibrary.Core.csproj'
      - name: 'MyLibrary.Extensions'
        path: 'src/Extensions/MyLibrary.Extensions.csproj'

steps:
  - name: Pack ${{ matrix.project.name }}
    uses: sandre58/MyWorkflows/actions/nuget-pack@main
    with:
      project-path: ${{ matrix.project.path }}
      version: '1.0.0'
```

### Complete workflow with upload

```yaml
- name: Pack packages
  id: pack
  uses: sandre58/MyWorkflows/actions/nuget-pack@main
  with:
    project-path: 'src/MyLibrary/MyLibrary.csproj'
    version: '1.2.3'
    output-dir: 'packages'

- name: Upload packages
  uses: actions/upload-artifact@v4
  with:
    name: nuget-packages
    path: ${{ steps.pack.outputs.output-directory }}
```

## Common Pack Arguments

### Include symbols

- `--include-symbols` - Generate symbol packages (.snupkg)
- `--include-source` - Include source code in symbol packages

### No build

- `--no-build` - Skip building, use existing build output
- `--no-restore` - Skip NuGet restore

### Verbosity

- `--verbosity minimal|normal|detailed|diagnostic`

## Package Metadata

You can set package metadata using `additional-properties`:

- `Authors` - Package authors
- `Copyright` - Copyright statement
- `PackageLicenseExpression` - SPDX license identifier (e.g., MIT, Apache-2.0)
- `PackageProjectUrl` - Project URL
- `RepositoryUrl` - Repository URL
- `PackageTags` - Semicolon-separated tags
- `Description` - Package description
- `PackageIcon` - Path to icon file
- `PackageReadmeFile` - Path to readme file

## Features

- Installs multiple .NET SDK versions
- Automatic version injection
- Configurable output directory
- Support for symbol packages
- Custom MSBuild properties
- Build and pack in single step

## Requirements

- .NET project with valid `.csproj` file
- Windows or Linux runner

## Output Files

The action generates:
- `*.nupkg` - Main NuGet package
- `*.snupkg` - Symbol package (if `--include-symbols` is specified)

## Author

sandre58
