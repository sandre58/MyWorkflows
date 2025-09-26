# Set NBGV Version Action

This action creates or updates a `version.json` file for Nerdbank.GitVersioning (NBGV) with the specified version.

## Features

- 📝 **Smart JSON handling**: Creates new or updates existing `version.json` files
- 🔧 **NBGV compatible**: Follows NBGV schema and conventions
- 🎯 **Flexible directory**: Can work in any directory within the repository
- 📊 **Logging**: Provides detailed feedback about the version setting process

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `version` | Version to set (e.g., 1.2.3) | Yes | - |
| `working-directory` | Directory where version.json should be created/updated | No | `.` |
| `project-name` | Project name for logging purposes | No | `project` |

## Usage

### Basic Usage

```yaml
- name: Set version
  uses: sandre58/MyWorkflows/actions/set-nbgv-version@main
  with:
    version: '1.2.3'
```

### With Custom Directory

```yaml
- name: Set version for MyProject
  uses: sandre58/MyWorkflows/actions/set-nbgv-version@main
  with:
    version: '2.1.0'
    working-directory: 'src/MyProject'
    project-name: 'MyProject'
```

### In Matrix Strategy

```yaml
jobs:
  set-versions:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - name: MyApi
            dir: src/MyApi
            version: 1.0.0
          - name: MyLibrary
            dir: src/MyLibrary
            version: 2.1.3
    steps:
      - uses: actions/checkout@v4
      - name: Set version for ${{ matrix.name }}
        uses: sandre58/MyWorkflows/actions/set-nbgv-version@main
        with:
          version: ${{ matrix.version }}
          working-directory: ${{ matrix.dir }}
          project-name: ${{ matrix.name }}
```

## Generated version.json Structure

The action creates a `version.json` file with the following structure:

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/Nerdbank.GitVersioning/master/src/NerdBank.GitVersioning/version.schema.json",
  "version": "1.2.3",
  "publicReleaseRefSpec": [
    "^refs/heads/main$",
    "^refs/heads/master$"
  ],
  "cloudBuild": {
    "buildNumber": {
      "enabled": true
    }
  }
}
```

## How It Works

1. **Dependency Check**: Installs `jq` if not already available
2. **File Detection**: Checks if `version.json` already exists
3. **Creation/Update**: 
   - If file doesn't exist: Creates new `version.json` with NBGV schema
   - If file exists: Updates only the version field, preserving other settings
4. **Validation**: Displays the final `version.json` content for verification

## Integration Examples

### With Semantic Versioning

```yaml
- name: Compute semantic version
  id: version
  uses: sandre58/MyWorkflows/actions/compute-version@main
  with:
    project: MyProject

- name: Set NBGV version
  uses: sandre58/MyWorkflows/actions/set-nbgv-version@main
  with:
    version: ${{ steps.version.outputs.version }}
    working-directory: src/MyProject
    project-name: MyProject
```

### Multi-Project Workflow

```yaml
jobs:
  discover-projects:
    # ... project discovery logic
    
  compute-versions:
    needs: discover-projects
    strategy:
      matrix: ${{ fromJson(needs.discover-projects.outputs.projects-matrix) }}
    steps:
      - uses: actions/checkout@v4
      - name: Compute version
        id: version
        uses: sandre58/MyWorkflows/actions/compute-version@main
        with:
          project: ${{ matrix.name }}
          working-directory: ${{ matrix.dir }}
      
      - name: Set NBGV version
        uses: sandre58/MyWorkflows/actions/set-nbgv-version@main
        with:
          version: ${{ steps.version.outputs.version }}
          working-directory: ${{ matrix.dir }}
          project-name: ${{ matrix.name }}
```

## Error Handling

- ✅ **Missing jq**: Automatically installs if not present
- ✅ **Missing directory**: Fails gracefully if working directory doesn't exist
- ✅ **Invalid JSON**: Preserves existing version.json structure when updating
- ✅ **Logging**: Provides detailed output for troubleshooting

## Requirements

- **Operating System**: Linux (uses `apt-get` for jq installation)
- **Permissions**: Write access to the target directory
- **Dependencies**: Automatically installs `jq` if needed

## NBGV Compatibility

This action creates `version.json` files that are fully compatible with:
- ✅ **Nerdbank.GitVersioning** MSBuild package
- ✅ **NBGV CLI tools** 
- ✅ **GitHub Actions** environments
- ✅ **Azure DevOps** pipelines

## Related Actions

- [`compute-version`](../compute-version/README.md) - Calculate semantic versions
- [`find-projects`](../find-projects/README.md) - Discover .NET projects
- [`build-and-test`](../build-and-test/README.md) - Build with NBGV versions