# Build and Test .NET Project

Build and test a .NET project with specified configuration.

## Description

This action builds a .NET project and optionally runs tests with customizable configuration. It supports multiple .NET versions, custom test loggers, and runsettings files.

## Inputs

### `project-path`

**Description:** Path to the project file (`.csproj`)

**Required:** No (if not specified, builds the entire solution)

**Example:**
```yaml
project-path: 'src/MyProject/MyProject.csproj'
```

### `version`

**Description:** Version to use for the build

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

### `run-tests`

**Description:** Whether to run tests after build

**Required:** No

**Default:** `true`

**Example:**
```yaml
run-tests: 'false'
```

### `test-loggers`

**Description:** Test loggers to use (space-separated)

**Required:** No

**Default:** `GitHubActions trx`

**Example:**
```yaml
test-loggers: 'GitHubActions trx console'
```

### `runsettings-file`

**Description:** Path to `.runsettings` file for test configuration

**Required:** No

**Default:** `.runsettings`

**Example:**
```yaml
runsettings-file: 'tests/test.runsettings'
```

## Outputs

This action does not produce outputs.

## Usage

### Basic usage

```yaml
- name: Build and test
  uses: sandre58/MyWorkflows/actions/build-and-test@main
  with:
    project-path: 'src/MyProject/MyProject.csproj'
    version: '1.2.3'
```

### Build without tests

```yaml
- name: Build only
  uses: sandre58/MyWorkflows/actions/build-and-test@main
  with:
    project-path: 'src/MyProject/MyProject.csproj'
    run-tests: 'false'
```

### Custom .NET versions

```yaml
- name: Build with specific .NET versions
  uses: sandre58/MyWorkflows/actions/build-and-test@main
  with:
    project-path: 'src/MyProject/MyProject.csproj'
    dotnet-versions: |
      6.0.x
      8.0.x
```

### With custom runsettings

```yaml
- name: Build and test with coverage
  uses: sandre58/MyWorkflows/actions/build-and-test@main
  with:
    project-path: 'src/MyProject/MyProject.csproj'
    runsettings-file: 'tests/coverage.runsettings'
    test-loggers: 'GitHubActions trx'
```

### Debug configuration

```yaml
- name: Build in debug mode
  uses: sandre58/MyWorkflows/actions/build-and-test@main
  with:
    project-path: 'src/MyProject/MyProject.csproj'
    configuration: 'Debug'
```

## Features

- Installs multiple .NET SDK versions
- Restores NuGet packages
- Builds with custom configuration
- Runs tests with customizable loggers
- Supports runsettings files for advanced test configuration
- Automatic test result publishing to GitHub Actions

## Test Loggers

The action supports multiple test loggers:

- `GitHubActions` - Integrates test results with GitHub Actions UI
- `trx` - Generates TRX test result files
- `console` - Outputs results to console
- Custom loggers

## Requirements

- .NET project with valid `.csproj` file
- Windows or Linux runner

## Author

sandre58
