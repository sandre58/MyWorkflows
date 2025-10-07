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

### `install-wasm-workload`

**Description:** Install WebAssembly workload for Blazor WebAssembly development

**Required:** No

**Default:** `false`

**Example:**
```yaml
install-wasm-workload: 'true'
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

## Workload Examples

### Blazor WebAssembly Application

```yaml
- name: Publish Blazor WASM app
  uses: sandre58/MyWorkflows/actions/publish@main
  with:
    project-path: 'src/BlazorWasm/BlazorWasm.csproj'
    install-web-workload: 'true'
    install-wasm-workload: 'true'
    output-path: 'wwwroot'
    publish-args: '--configuration Release'
```

### .NET MAUI Android Application

```yaml
- name: Publish MAUI Android app
  uses: sandre58/MyWorkflows/actions/publish@main
  with:
    project-path: 'src/MauiApp/MauiApp.csproj'
    install-maui-workload: 'true'
    install-android-workload: 'true'
    framework: 'net8.0-android'
    publish-args: '--configuration Release -f net8.0-android'
```

### .NET MAUI iOS Application (macOS runner required)

```yaml
runs-on: macos-latest
steps:
  - name: Publish MAUI iOS app
    uses: sandre58/MyWorkflows/actions/publish@main
    with:
      project-path: 'src/MauiApp/MauiApp.csproj'
      install-maui-workload: 'true'
      install-ios-workload: 'true'
      framework: 'net8.0-ios'
      publish-args: '--configuration Release -f net8.0-ios'
```

### Windows Desktop Application

```yaml
- name: Publish Windows desktop app
  uses: sandre58/MyWorkflows/actions/publish@main
  with:
    project-path: 'src/WinApp/WinApp.csproj'
    install-windows-workload: 'true'
    framework: 'net8.0-windows'
    publish-args: '--self-contained true --runtime win-x64'
```

### Multi-Platform MAUI Application

```yaml
strategy:
  matrix:
    include:
      - platform: android
        framework: net8.0-android
        workload-android: true
        workload-ios: false
        runner: ubuntu-latest
      - platform: ios
        framework: net8.0-ios
        workload-android: false
        workload-ios: true
        runner: macos-latest

runs-on: ${{ matrix.runner }}
steps:
  - name: Publish MAUI ${{ matrix.platform }} app
    uses: sandre58/MyWorkflows/actions/publish@main
    with:
      project-path: 'src/MauiApp/MauiApp.csproj'
      install-maui-workload: 'true'
      install-android-workload: ${{ matrix.workload-android }}
      install-ios-workload: ${{ matrix.workload-ios }}
      framework: ${{ matrix.framework }}
      output-path: 'publish/${{ matrix.platform }}'
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
- **Workload Support**: Optional installation of specialized workloads:
  - ASP.NET Core (Aspire) for web development
  - .NET MAUI for cross-platform apps
  - iOS development workload
  - Android development workload
  - MacCatalyst for macOS apps
  - Windows desktop development
  - WebAssembly (WASM) for Blazor WebAssembly apps
- Configurable target framework
- Customizable publish arguments
- Version injection into assembly properties
- Cross-platform support
- Output directory customization

## Workloads Reference

| Workload | ID | Description | Platform Requirements |
|----------|----|--------------|--------------------|
| ASP.NET Core | `aspire` | Web development with Aspire | Any |
| .NET MAUI | `maui` | Cross-platform UI framework | Any |
| iOS | `ios` | iOS application development | macOS only |
| Android | `android` | Android application development | Any |
| MacCatalyst | `maccatalyst` | macOS application development | macOS only |
| Windows | `maui-windows` | Windows desktop development | Windows only |
| WebAssembly | `wasm-tools` | Blazor WebAssembly development | Any |

## Requirements

- .NET project with valid `.csproj` file
- Windows, Linux, or macOS runner
- **Platform-specific workloads**:
  - iOS workloads require macOS runner
  - Windows workload works best on Windows runner
  - Android, MAUI, and WASM workloads work on any platform
  - Web workloads work on any platform

## Important Notes

- **Workload Installation Time**: Installing workloads can add 2-5 minutes to publish time
- **Runner Selection**: Choose appropriate runner for target platforms
- **MAUI Publishing**: Different target frameworks require different workloads
- **Blazor WASM**: Published as static files, not executables

## Author

sandre58
