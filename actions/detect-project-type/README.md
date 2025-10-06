# Detect Project Type

Analyze a .NET project file to determine if it should be packed as a NuGet package or published as an application.

## Description

This action examines a `.csproj` file (and `Directory.Build.props` files in the hierarchy) to determine whether the project is a library (for NuGet packaging) or an application (for publishing). It inspects properties like `OutputType`, `IsPackable`, and SDK type to make this determination.

## Inputs

### `project-path`

**Description:** Path to the `.csproj` file to analyze

**Required:** Yes

**Example:**
```yaml
project-path: 'src/MyProject/MyProject.csproj'
```

## Outputs

### `project-type`

**Description:** Type of project

**Possible values:**
- `library` - NuGet package (should use `dotnet pack`)
- `application` - Executable application (should use `dotnet publish`)

### `output-type`

**Description:** OutputType from the project file

**Possible values:** `Exe`, `WinExe`, `Library`, etc.

### `target-framework`

**Description:** Target framework of the project (first one if multiple)

**Example:** `net8.0`, `net6.0-windows`, `netstandard2.0`

## Usage

### Basic usage

```yaml
- name: Detect project type
  id: detect
  uses: sandre58/MyWorkflows/actions/detect-project-type@main
  with:
    project-path: 'src/MyProject/MyProject.csproj'

- name: Display project info
  run: |
    echo "Project type: ${{ steps.detect.outputs.project-type }}"
    echo "Output type: ${{ steps.detect.outputs.output-type }}"
    echo "Target framework: ${{ steps.detect.outputs.target-framework }}"
```

### Conditional packaging/publishing

```yaml
- name: Detect project type
  id: detect
  uses: sandre58/MyWorkflows/actions/detect-project-type@main
  with:
    project-path: ${{ matrix.project-path }}

- name: Pack NuGet package
  if: steps.detect.outputs.project-type == 'library'
  run: dotnet pack ${{ matrix.project-path }}

- name: Publish application
  if: steps.detect.outputs.project-type == 'application'
  run: dotnet publish ${{ matrix.project-path }}
```

### With matrix strategy

```yaml
jobs:
  process:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - name: MyLibrary
            path: src/MyLibrary/MyLibrary.csproj
          - name: MyApp
            path: src/MyApp/MyApp.csproj
    steps:
      - uses: actions/checkout@v4
      
      - name: Detect type
        id: type
        uses: sandre58/MyWorkflows/actions/detect-project-type@main
        with:
          project-path: ${{ matrix.path }}
      
      - name: Process based on type
        run: |
          if [ "${{ steps.type.outputs.project-type }}" == "library" ]; then
            echo "Packing ${{ matrix.name }} as NuGet package"
          else
            echo "Publishing ${{ matrix.name }} as application"
          fi
```

## Detection Logic

The action determines project type based on the following rules (in order of precedence):

1. **SDK Type**
   - `Microsoft.NET.Sdk.Web` → `application`
   - `Microsoft.NET.Sdk.Worker` → `application`

2. **OutputType property**
   - `Exe` or `WinExe` → `application`
   - `Library` → `library`

3. **IsPackable property**
   - `false` → `application`
   - `true` → `library`

4. **Default**
   - If none of the above match → `library`

## Property Resolution

The action searches for MSBuild properties in this order:

1. `Directory.Build.props` files (from project directory up to root)
2. The `.csproj` file itself

This respects the MSBuild property hierarchy, ensuring accurate detection even when properties are defined in parent directories.

## Features

- Respects MSBuild property inheritance (`Directory.Build.props`)
- Detects web applications and worker services
- Handles `TargetFrameworks` (multiple frameworks)
- Provides detailed logging for debugging
- Normalizes paths (removes leading `./`)

## Use Cases

- Automated CI/CD pipelines that need to pack libraries and publish applications
- Monorepo setups with mixed project types
- Dynamic workflow generation based on project characteristics
- Conditional job execution based on project type

## Requirements

- `.csproj` file must exist at the specified path
- Bash shell (automatically available on GitHub runners)

## Author

sandre58
