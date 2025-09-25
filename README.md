# MyWorkflows
Centralized GitHub Actions workflows and composite actions shared across all my repositories.

## Available Actions

### Core Actions
- **[build-and-test](./actions/build-and-test/)** - Build and test with code coverage support
- **[pack](./actions/pack/)** - Create NuGet packages
- **[publish](./actions/publish/)** - Publish packages to configurable sources
- **[create-release](./actions/create-release/)** - Create GitHub releases
- **[parse-tag](./actions/parse-tag/)** - Parse Git tags with multiple format support
- **[generate-changelog](./actions/generate-changelog/)** - Generate changelog automatically using git-chglog
- **[calculate-tag-range](./actions/calculate-tag-range/)** - Calculate tag ranges for changelog generation

## Workflows

### Release Workflow
The main release workflow (`release.yml`) orchestrates all actions to:
- Parse Git tags
- Build and test the project
- Create NuGet packages
- Generate changelog with proper tag ranges
- Publish packages
- Commit changelog to repository
- Create GitHub release

#### Supported Tag Formats
- `v1.0.0` - Standard version
- `ProjectName/v1.0.0` - Multi-project repositories
- Prerelease support: `alpha`, `beta`, `rc`, `preview`, `pre`

## Usage

### Using the release.yml workflow in another repository

You can call this workflow via `workflow_call` from any repository:

```yaml
name: Trigger Release
on:
  push:
    tags:
      - '*' # Triggers on any tag

jobs:
  call-release:
    uses: owner/MyWorkflows/.github/workflows/release.yml@main
    with:
      changelog-enabled: true
      src-path: 'src'
      dotnet-versions: |
        10.0.x
        9.0.x
        8.0.x
      changelog-file: 'CHANGELOG.md'
      # Optional: force the tag used for the release
      tag: 'v1.2.3' # If empty, the workflow will automatically use github.ref_name
    secrets:
      RELEASE_API_KEY: ${{ secrets.RELEASE_API_KEY }}
      PRERELEASE_API_KEY: ${{ secrets.PRERELEASE_API_KEY }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### Parameters

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| `tag` | Tag to use for the release | `github.ref_name` | No |
| `changelog-enabled` | Whether to enable changelog generation | `true` | No |
| `src-path` | Path to search for project files | `src` | No |
| `changelog-file` | Path to the changelog file | `CHANGELOG.md` | No |
| `dotnet-versions` | Versions of .NET to install | `10.0.x\n9.0.x\n8.0.x` | No |
| `prerelease-keywords` | Keywords that indicate a prerelease | `alpha\|beta\|rc\|preview\|pre` | No |

#### Key Features
- **Smart changelog placement**: Generated in project folder for multi-project repos, root for single projects
- **Automatic tag range calculation**: Only includes changes between current and previous tag of the same project
- **Changelog commit**: Automatically commits the generated changelog to the repository
- **Multi-project support**: Works with both mono-repo and multi-project setups
- **Flexible tag handling**: Use custom tag or let it auto-detect from Git context

### Using individual actions

You can also use individual actions directly:

```yaml
# Generate changelog
- uses: owner/MyWorkflows/actions/generate-changelog@main
  with:
    tag: v1.0.0
    output-file: CHANGELOG.md
    title: "My Project"

# Calculate tag range for changelog
- uses: owner/MyWorkflows/actions/calculate-tag-range@main
  with:
    current-tag: MyProject/v1.2.0
  # Returns: MyProject/v1.1.0..MyProject/v1.2.0

# Parse tag information
- uses: owner/MyWorkflows/actions/parse-tag@main
  with:
    tag: MyProject/v1.2.0-beta
    prerelease-keywords: alpha|beta|rc
```

## Repository Setup

To use these workflows in your repository:

1. **Add required secrets** to your repository:
   - `RELEASE_API_KEY`: NuGet API key for stable releases
   - `PRERELEASE_API_KEY`: NuGet API key for prereleases  
   - `GITHUB_TOKEN`: Automatically provided by GitHub

2. **Create a workflow file** (e.g., `.github/workflows/release.yml`) in your target repository

3. **Push a tag** to trigger the release workflow:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## Examples

### Single Project Repository
```bash
# Tag format: v1.0.0
git tag v1.0.0
# → Changelog at: CHANGELOG.md (root)
# → Builds entire solution
```

### Multi-Project Repository
```bash
# Tag format: ProjectName/v1.0.0  
git tag MyLibrary/v1.2.0
# → Finds: src/MyLibrary/MyLibrary.csproj
# → Changelog at: src/MyLibrary/CHANGELOG.md
# → Only includes changes for MyLibrary tags
```

## License

This project is licensed under the MIT License.
