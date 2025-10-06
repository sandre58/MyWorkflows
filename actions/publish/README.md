# Publish .NET App

Publish a .NET application with specified configuration and target framework.

## Description

This action publishes a .NET application using `dotnet publish` with customizable configuration, target framework, and publish arguments. It's typically used for creating deployable application packages.

## Inputs

### `project-path`

**Description:** Path to the project file (`.csproj`)

**Required:** Yes

**Example:**
```yaml
project-path: 'src/MyApp/MyApp.csproj'
```

### `output-path`

**Description:** Output directory for published files

**Required:** No

**Default:** `apps`

**Example:**
```yaml
output-path: 'publish/MyApp'
```

### `version`

**Description:** Version to use for the publish

**Required:** No

**Example:**
```yaml
version: '1.2.3'
```

### `configuration`

**Description:** Publish configuration

**Required:** No

**Default:** `Release`

**Possible values:** `Release`, `Debug`, or custom configurations

**Example:**
```yaml
configuration: 'Release'
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

### `framework`

**Description:** Target framework for publish

**Required:** No

**Common values:** `net8.0`, `net9.0`, `net6.0`, `net48`

**Example:**
```yaml
framework: 'net8.0'
```

### `publish-args`

**Description:** Additional arguments for `dotnet publish` command

**Required:** No

**Default:** `--self-contained true --runtime win-x64 -p:PublishSingleFile=true`

**Example:**
```yaml
publish-args: '--self-contained false --runtime linux-x64'
```

## Outputs

### `output-directory`

**Description:** Output directory containing published app files

**Example:** `apps` or custom path specified in `output-path`

## Usage

### Basic usage

```yaml
- name: Publish application
  uses: sandre58/MyWorkflows/actions/publish@main
  with:
    project-path: 'src/MyApp/MyApp.csproj'
    version: '1.2.3'
```

### Windows self-contained single file

```yaml
- name: Publish Windows app
  uses: sandre58/MyWorkflows/actions/publish@main
  with:
    project-path: 'src/MyApp/MyApp.csproj'
    framework: 'net8.0'
    publish-args: '--self-contained true --runtime win-x64 -p:PublishSingleFile=true'
```

### Linux framework-dependent

```yaml
- name: Publish Linux app
  uses: sandre58/MyWorkflows/actions/publish@main
  with:
    project-path: 'src/MyApp/MyApp.csproj'
    framework: 'net8.0'
    publish-args: '--self-contained false --runtime linux-x64'
```

### Cross-platform publish

```yaml
strategy:
  matrix:
    runtime: [win-x64, linux-x64, osx-x64]

steps:
  - name: Publish for ${{ matrix.runtime }}
    uses: sandre58/MyWorkflows/actions/publish@main
    with:
      project-path: 'src/MyApp/MyApp.csproj'
      output-path: 'publish/${{ matrix.runtime }}'
      publish-args: '--self-contained true --runtime ${{ matrix.runtime }}'
```

### With custom output directory

```yaml
- name: Publish to custom directory
  uses: sandre58/MyWorkflows/actions/publish@main
  with:
    project-path: 'src/MyApp/MyApp.csproj'
    output-path: 'dist/MyApp'
    version: '2.0.0'
```

### Debug configuration

```yaml
- name: Publish debug build
  uses: sandre58/MyWorkflows/actions/publish@main
  with:
    project-path: 'src/MyApp/MyApp.csproj'
    configuration: 'Debug'
    publish-args: '--self-contained false'
```

## Common Publish Arguments

### Self-contained vs Framework-dependent

- **Self-contained:** `--self-contained true` (includes .NET runtime)
- **Framework-dependent:** `--self-contained false` (requires .NET runtime on target)

### Runtimes

- Windows: `--runtime win-x64`, `--runtime win-x86`, `--runtime win-arm64`
- Linux: `--runtime linux-x64`, `--runtime linux-arm64`
- macOS: `--runtime osx-x64`, `--runtime osx-arm64`

### Single File

- `--p:PublishSingleFile=true` - Package everything into a single executable

### Trimming

- `--p:PublishTrimmed=true` - Reduce app size by removing unused code

### ReadyToRun

- `--p:PublishReadyToRun=true` - Improve startup time with ahead-of-time compilation

## Features

- Installs multiple .NET SDK versions
- Configurable target framework
- Customizable publish arguments
- Version injection into assembly properties
- Cross-platform support
- Output directory customization

## Requirements

- .NET project with valid `.csproj` file
- Windows or Linux runner

## Author

sandre58
