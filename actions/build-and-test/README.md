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

**Example:**
```yaml
runsettings-file: 'tests/test.runsettings'
```

### `build-args`

**Description:** Additional arguments for `dotnet build` command

**Required:** No

**Example:**
```yaml
build-args: '--verbosity normal --no-restore'
```

### `test-args`

**Description:** Additional arguments for `dotnet test` command

**Required:** No

**Example:**
```yaml
test-args: '--collect:"XPlat Code Coverage"'
```

## Workload Installation Inputs

### `install-web-workload`

**Description:** Install ASP.NET Core workload for web development

**Required:** No

**Default:** `false`

**Example:**
```yaml
install-web-workload: 'true'
```

### `install-maui-workload`

**Description:** Install .NET MAUI workload for cross-platform mobile and desktop development

**Required:** No

**Default:** `false`

**Example:**
```yaml
install-maui-workload: 'true'
```

### `install-ios-workload`

**Description:** Install iOS workload for iOS development

**Required:** No

**Default:** `false`

**Example:**
```yaml
install-ios-workload: 'true'
```

### `install-android-workload`

**Description:** Install Android workload for Android development

**Required:** No

**Default:** `false`

**Example:**
```yaml
install-android-workload: 'true'
```

### `install-maccatalyst-workload`

**Description:** Install MacCatalyst workload for macOS development

**Required:** No

**Default:** `false`

**Example:**
```yaml
install-maccatalyst-workload: 'true'
```

### `install-windows-workload`

**Description:** Install Windows workload for Windows desktop development

**Required:** No

**Default:** `false`

**Example:**
```yaml
install-windows-workload: 'true'
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

## Workload Examples

### ASP.NET Core Web Application

```yaml
- name: Build and test web app
  uses: sandre58/MyWorkflows/actions/build-and-test@main
  with:
    project-path: 'src/WebApp/WebApp.csproj'
    install-web-workload: 'true'
    version: '1.0.0'
```

### .NET MAUI Cross-Platform App

```yaml
- name: Build and test MAUI app
  uses: sandre58/MyWorkflows/actions/build-and-test@main
  with:
    project-path: 'src/MauiApp/MauiApp.csproj'
    install-maui-workload: 'true'
    install-android-workload: 'true'
    install-ios-workload: 'true'
    version: '1.0.0'
```

### Android Application

```yaml
- name: Build Android app
  uses: sandre58/MyWorkflows/actions/build-and-test@main
  with:
    project-path: 'src/AndroidApp/AndroidApp.csproj'
    install-android-workload: 'true'
    run-tests: 'false'  # Often no unit tests for mobile apps
```

### iOS Application (requires macOS runner)

```yaml
runs-on: macos-latest
steps:
  - name: Build iOS app
    uses: sandre58/MyWorkflows/actions/build-and-test@main
    with:
      project-path: 'src/iOSApp/iOSApp.csproj'
      install-ios-workload: 'true'
      install-maccatalyst-workload: 'true'
      run-tests: 'false'
```

### Multi-Platform MAUI with All Workloads

```yaml
- name: Build full MAUI app
  uses: sandre58/MyWorkflows/actions/build-and-test@main
  with:
    project-path: 'src/MauiApp/MauiApp.csproj'
    install-maui-workload: 'true'
    install-android-workload: 'true'
    install-ios-workload: 'true'
    install-maccatalyst-workload: 'true'
    install-windows-workload: 'true'
    version: '1.0.0'
    build-args: '-f net8.0-android'
```

### Blazor Server + MAUI Hybrid

```yaml
strategy:
  matrix:
    project:
      - name: 'BlazorServer'
        path: 'src/BlazorServer/BlazorServer.csproj'
        web: true
        maui: false
      - name: 'MauiHybrid'
        path: 'src/MauiHybrid/MauiHybrid.csproj'
        web: false
        maui: true

steps:
  - name: Build ${{ matrix.project.name }}
    uses: sandre58/MyWorkflows/actions/build-and-test@main
    with:
      project-path: ${{ matrix.project.path }}
      install-web-workload: ${{ matrix.project.web }}
      install-maui-workload: ${{ matrix.project.maui }}
      install-android-workload: ${{ matrix.project.maui }}
```

## Features

- Installs multiple .NET SDK versions
- **Workload Support**: Optional installation of specialized workloads:
  - ASP.NET Core (Aspire) for web development
  - .NET MAUI for cross-platform apps
  - iOS development workload
  - Android development workload
  - MacCatalyst for macOS apps
  - Windows desktop development
- Restores NuGet packages
- Builds with custom configuration
- Runs tests with customizable loggers
- Supports runsettings files for advanced test configuration
- Automatic test result publishing to GitHub Actions
- Additional build and test arguments support

## Workloads Reference

| Workload | ID | Description | Platform Requirements |
|----------|----|--------------|--------------------|
| ASP.NET Core | `aspire` | Web development with Aspire | Any |
| .NET MAUI | `maui` | Cross-platform UI framework | Any |
| iOS | `ios` | iOS application development | macOS only |
| Android | `android` | Android application development | Any |
| MacCatalyst | `maccatalyst` | macOS application development | macOS only |
| Windows | `maui-windows` | Windows desktop development | Windows only |

## Test Loggers

The action supports multiple test loggers:

- `GitHubActions` - Integrates test results with GitHub Actions UI
- `trx` - Generates TRX test result files
- `console` - Outputs results to console
- Custom loggers

## Requirements

- .NET project with valid `.csproj` file
- Windows, Linux, or macOS runner
- **Platform-specific workloads**:
  - iOS/MacCatalyst workloads require macOS runner
  - Windows workload works best on Windows runner
  - Android and MAUI workloads work on any platform
  - Web workloads work on any platform

## Important Notes

- **Workload Installation Time**: Installing workloads can add 2-5 minutes to build time
- **Runner Selection**: Choose appropriate runner for target platforms:
  - `ubuntu-latest` - For Android, Web, MAUI (cross-platform)
  - `windows-latest` - For Windows desktop, Android, Web, MAUI
  - `macos-latest` - For iOS, MacCatalyst, Android, Web, MAUI
- **Caching**: Consider using actions/cache for workloads in repeated builds
- **Multiple Targets**: For MAUI apps targeting multiple platforms, install all relevant workloads

## Author

sandre58
