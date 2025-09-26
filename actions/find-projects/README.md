# Find .NET Projects Action

This action discovers .NET project files (`.csproj`) in a specified directory and creates a matrix strategy for parallel processing in GitHub Actions workflows.

## Features

- 🔍 **Auto-discovery**: Automatically finds all `.csproj` files in the specified path
- 📊 **Matrix strategy**: Creates a JSON matrix for parallel job execution
- 📝 **Detailed output**: Provides both simple list and structured data
- 🎯 **Flexible**: Configurable search path

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `src-path` | Path to search for project files | No | `src` |

## Outputs

| Name | Description | Type |
|------|-------------|------|
| `projects` | Comma-separated list of project names | String |
| `projects-matrix` | JSON matrix for parallel processing | JSON |

## Usage

### Basic Usage

```yaml
- name: Find .NET projects
  id: find-projects
  uses: sandre58/MyWorkflows/actions/find-projects@main
  with:
    src-path: 'src'

- name: Show discovered projects
  run: |
    echo "Found projects: ${{ steps.find-projects.outputs.projects }}"
    echo "Matrix: ${{ steps.find-projects.outputs.projects-matrix }}"
```

### Using with Matrix Strategy

```yaml
jobs:
  discover:
    runs-on: ubuntu-latest
    outputs:
      projects-matrix: ${{ steps.find-projects.outputs.projects-matrix }}
    steps:
      - uses: actions/checkout@v4
      - name: Find projects
        id: find-projects
        uses: sandre58/MyWorkflows/actions/find-projects@main
        with:
          src-path: 'src'

  build-projects:
    needs: discover
    runs-on: ubuntu-latest
    strategy:
      matrix: ${{ fromJson(needs.discover.outputs.projects-matrix) }}
    steps:
      - uses: actions/checkout@v4
      - name: Build ${{ matrix.name }}
        run: dotnet build ${{ matrix.path }}
```

### Custom Search Path

```yaml
- name: Find projects in custom directory
  uses: sandre58/MyWorkflows/actions/find-projects@main
  with:
    src-path: 'projects/dotnet'
```

## Output Format

### Projects List
```
MyProject1,MyProject2,MyProject3
```

### Projects Matrix
```json
{
  "include": [
    {
      "name": "MyProject1",
      "path": "src/MyProject1/MyProject1.csproj",
      "dir": "src/MyProject1"
    },
    {
      "name": "MyProject2", 
      "path": "src/MyProject2/MyProject2.csproj",
      "dir": "src/MyProject2"
    }
  ]
}
```

## Examples

### Multi-Project Repository Structure
```
repo/
├── src/
│   ├── MyApi/
│   │   └── MyApi.csproj
│   ├── MyLibrary/
│   │   └── MyLibrary.csproj
│   └── MyConsole/
│       └── MyConsole.csproj
└── tests/
    ├── MyApi.Tests/
    │   └── MyApi.Tests.csproj
    └── MyLibrary.Tests/
        └── MyLibrary.Tests.csproj
```

This action will find all `.csproj` files and create a matrix that can be used to process each project in parallel.

## Integration with Other Actions

This action is designed to work seamlessly with other actions in the MyWorkflows collection:

- [`build-and-test`](../build-and-test/README.md) - Build and test discovered projects
- [`compute-version`](../compute-version/README.md) - Compute semantic versions for each project
- [`pack`](../pack/README.md) - Package projects into NuGet packages

## Error Handling

- If no `.csproj` files are found, the action will output empty values and exit successfully
- The action logs all discovered projects for debugging purposes
- Matrix output is always valid JSON, even when empty

## Requirements

- The repository must be checked out before using this action
- The specified search path must exist in the repository