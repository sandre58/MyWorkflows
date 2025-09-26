# Add NBGV Package Action

This action adds the Nerdbank.GitVersioning (NBGV) NuGet package to .NET projects, enabling automatic version injection during build.

## Features

- 🔍 **Auto-detection**: Automatically finds the .csproj file in the directory
- 🛡️ **Idempotent**: Skips installation if package already exists
- ⚙️ **Configurable**: Allows specifying NBGV package version
- 📝 **Logging**: Provides detailed feedback about the installation process

## Why This Action?

The `version.json` file created by [`set-nbgv-version`](../set-nbgv-version/README.md) is just configuration. For NBGV to actually inject versions during build, the **Nerdbank.GitVersioning NuGet package** must be installed in each project.

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `working-directory` | Directory containing the .csproj file | No | `.` |
| `project-name` | Project name for logging purposes | No | `project` |
| `nbgv-version` | Version of Nerdbank.GitVersioning package to install | No | `3.6.143` |

## Usage

### Basic Usage

```yaml
- name: Add NBGV package
  uses: sandre58/MyWorkflows/actions/add-nbgv-package@main
```

### With Custom Directory

```yaml
- name: Add NBGV to MyProject
  uses: sandre58/MyWorkflows/actions/add-nbgv-package@main
  with:
    working-directory: 'src/MyProject'
    project-name: 'MyProject'
```

### With Specific NBGV Version

```yaml
- name: Add specific NBGV version
  uses: sandre58/MyWorkflows/actions/add-nbgv-package@main
  with:
    working-directory: 'src/MyProject'
    project-name: 'MyProject'
    nbgv-version: '3.6.133'
```

### In Matrix Strategy

```yaml
jobs:
  setup-nbgv:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - name: MyApi
            dir: src/MyApi
          - name: MyLibrary
            dir: src/MyLibrary
    steps:
      - uses: actions/checkout@v4
      - name: Add NBGV to ${{ matrix.name }}
        uses: sandre58/MyWorkflows/actions/add-nbgv-package@main
        with:
          working-directory: ${{ matrix.dir }}
          project-name: ${{ matrix.name }}
```

## How It Works

1. **Project Detection**: Finds the `.csproj` file in the specified directory
2. **Package Check**: Verifies if Nerdbank.GitVersioning is already referenced
3. **Package Installation**: Adds the package using `dotnet add package` if not present
4. **Validation**: Confirms the package was added successfully

## What Gets Added

The action adds a PackageReference to your `.csproj` file:

```xml
<PackageReference Include="Nerdbank.GitVersioning" Version="3.6.143">
  <PrivateAssets>all</PrivateAssets>
  <IncludeAssets>runtime; build; native; contentfiles; analyzers</IncludeAssets>
</PackageReference>
```

## Integration with Version Workflow

```yaml
jobs:
  setup-versions:
    strategy:
      matrix: ${{ fromJson(needs.discover-projects.outputs.projects-matrix) }}
    steps:
      - uses: actions/checkout@v4
      
      # 1. Compute semantic version
      - name: Compute version
        id: version
        uses: sandre58/MyWorkflows/actions/compute-version@main
        with:
          project: ${{ matrix.name }}
          working-directory: ${{ matrix.dir }}
      
      # 2. Create version.json file
      - name: Set NBGV version
        uses: sandre58/MyWorkflows/actions/set-nbgv-version@main
        with:
          version: ${{ steps.version.outputs.version }}
          working-directory: ${{ matrix.dir }}
          project-name: ${{ matrix.name }}
      
      # 3. Add NBGV package (this action)
      - name: Add NBGV package
        uses: sandre58/MyWorkflows/actions/add-nbgv-package@main
        with:
          working-directory: ${{ matrix.dir }}
          project-name: ${{ matrix.name }}
```

## Error Handling

- ✅ **Missing .csproj**: Fails gracefully with clear error message
- ✅ **Already installed**: Skips installation and continues
- ✅ **Package conflicts**: Handled by dotnet CLI
- ✅ **Invalid directory**: Fails with descriptive error

## Requirements

- **.NET SDK**: Must be installed in the runner
- **Write permissions**: To modify .csproj files
- **Internet access**: To download NuGet packages

## Related Actions

- [`set-nbgv-version`](../set-nbgv-version/README.md) - Create version.json files
- [`compute-version`](../compute-version/README.md) - Calculate semantic versions
- [`find-projects`](../find-projects/README.md) - Discover .NET projects
- [`build-and-test`](../build-and-test/README.md) - Build with NBGV versions

## Version Injection Flow

1. **version.json** (created by `set-nbgv-version`) → Configuration
2. **NBGV package** (added by this action) → Engine
3. **Build process** → Automatic version injection

Without the NBGV package, the `version.json` file is ignored during build!