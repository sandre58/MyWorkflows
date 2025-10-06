# MyWorkflows

Centralized GitHub Actions workflows and composite actions for .NET projects, providing automated versioning, building, testing, packaging, and releasing.

## 🚀 Features

- **Semantic Versioning**: Automatic version calculation based on conventional commits
- **Monorepo Support**: Handle multiple projects in a single repository
- **Smart Changelog Generation**: Project-specific changelogs with git-chglog
- **Flexible Tagging**: Support for both simple (`v1.0.0`) and project-prefixed (`MyProject/v1.0.0`) tags
- **NuGet Publishing**: Automated package publishing to NuGet.org or private feeds
- **GitHub Releases**: Automatic release creation with artifacts and changelogs
- **Project Type Detection**: Automatically distinguish between libraries and applications

## 📦 Available Actions

### Version Management
- **[compute-version](./actions/compute-version/)** - Calculate semantic version from conventional commits
- **[set-project-version](./actions/set-project-version/)** - Set version for a single .NET project
- **[parse-tag](./actions/parse-tag/)** - Parse Git tags and extract project/version information
- **[calculate-tag-range](./actions/calculate-tag-range/)** - Calculate tag ranges for changelog generation
- **[create-tag](./actions/create-tag/)** - Create and push Git tags with custom patterns

### Project Discovery & Analysis
- **[find-projects](./actions/find-projects/)** - Discover .NET projects in a repository
- **[detect-project-type](./actions/detect-project-type/)** - Determine if a project is a library or application

### Build & Test
- **[build-and-test](./actions/build-and-test/)** - Build and test .NET projects with configurable options
- **[add-nbgv-package](./actions/add-nbgv-package/)** - Add Nerdbank.GitVersioning package to projects
- **[set-nbgv-version](./actions/set-nbgv-version/)** - Set version using Nerdbank.GitVersioning

### Packaging & Publishing
- **[nuget-pack](./actions/nuget-pack/)** - Create NuGet packages from .NET projects
- **[nuget-push](./actions/nuget-push/)** - Publish NuGet packages to feeds
- **[publish](./actions/publish/)** - Publish .NET applications with custom configuration

### Release Management
- **[generate-changelog](./actions/generate-changelog/)** - Generate changelog using git-chglog
- **[create-release](./actions/create-release/)** - Create GitHub releases with artifacts

## 🔄 Workflows

### Release Workflow

The main release workflow (`release.yml`) provides a complete CI/CD pipeline for .NET projects:

#### What it does:
1. **Discovers projects** - Automatically finds .NET projects based on tags
2. **Detects project type** - Determines if it's a library (NuGet) or application
3. **Builds and tests** - Compiles projects and runs tests
4. **Creates packages** - For libraries: generates `.nupkg` and `.snupkg` files
5. **Publishes applications** - For apps: creates deployable artifacts and zips them
6. **Generates changelog** - Creates project-specific changelog with git-chglog
7. **Publishes to NuGet** - Pushes packages to NuGet.org or private feeds
8. **Creates GitHub Release** - Publishes release with artifacts and changelog

#### Supported Tag Formats
- `v1.0.0` - Simple version tag (entire solution)
- `ProjectName/v1.0.0` - Project-specific tag (monorepo)
- Prerelease versions: `v1.0.0-alpha.1`, `v1.0.0-beta.2`, `v1.0.0-rc.1`

## 📖 Usage

### Quick Start

#### 1. Use the Release Workflow (Recommended)

Create `.github/workflows/release.yml` in your repository:

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'           # Simple tags: v1.0.0
      - '**/v*'        # Project tags: MyProject/v1.0.0

jobs:
  release:
    uses: sandre58/MyWorkflows/.github/workflows/release.yml@main
    secrets:
      RELEASE_API_KEY: ${{ secrets.NUGET_API_KEY }}
      PRERELEASE_API_KEY: ${{ secrets.NUGET_API_KEY }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### 2. Push a Tag to Trigger Release

```bash
# For single project
git tag v1.0.0
git push origin v1.0.0

# For monorepo with multiple projects
git tag MyLibrary/v1.0.0
git push origin MyLibrary/v1.0.0
```

### Advanced Configuration

#### Workflow Parameters

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| `tag` | Tag to use for the release | `github.ref_name` | No |
| `changelog-enabled` | Whether to enable changelog generation | `true` | No |
| `src-path` | Path to search for project files | `src` | No |
| `changelog-file` | Changelog filename | `CHANGELOG.md` | No |
| `dotnet-versions` | .NET versions to install | `10.0.x`<br>`9.0.x`<br>`8.0.x` | No |
| `prerelease-keywords` | Prerelease identifiers | `alpha\|beta\|rc\|preview\|pre` | No |

#### Custom Configuration Example

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    uses: sandre58/MyWorkflows/.github/workflows/release.yml@main
    with:
      src-path: 'source'
      changelog-enabled: true
      changelog-file: 'HISTORY.md'
      dotnet-versions: |
        8.0.x
        9.0.x
      prerelease-keywords: 'alpha|beta|rc|preview|nightly'
    secrets:
      RELEASE_API_KEY: ${{ secrets.NUGET_API_KEY }}
      PRERELEASE_API_KEY: ${{ secrets.NUGET_PREVIEW_KEY }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Using Individual Actions

Each action can be used independently in your workflows:

#### Compute Semantic Version

```yaml
- name: Compute version
  id: version
  uses: sandre58/MyWorkflows/actions/compute-version@main
  with:
    working-directory: 'src/MyProject'
    tag-pattern: 'MyProject/v*'

- name: Build with version
  run: dotnet build -p:Version=${{ steps.version.outputs.version }}
```

#### Parse Git Tag

```yaml
- name: Parse tag
  id: parse
  uses: sandre58/MyWorkflows/actions/parse-tag@main
  with:
    tag: ${{ github.ref_name }}

- name: Use parsed values
  run: |
    echo "Project: ${{ steps.parse.outputs.project-name }}"
    echo "Version: ${{ steps.parse.outputs.version }}"
    echo "Prerelease: ${{ steps.parse.outputs.is-prerelease }}"
```

#### Generate Changelog

```yaml
- name: Calculate tag range
  id: range
  uses: sandre58/MyWorkflows/actions/calculate-tag-range@main
  with:
    current-tag: ${{ github.ref_name }}

- name: Generate changelog
  uses: sandre58/MyWorkflows/actions/generate-changelog@main
  with:
    tag: ${{ github.ref_name }}
    tag-range: ${{ steps.range.outputs.tag-range }}
    output-file: 'CHANGELOG.md'
```

#### Find and Build Projects

```yaml
- name: Find projects
  id: find
  uses: sandre58/MyWorkflows/actions/find-projects@main
  with:
    project-paths: |
      src
      libs

- name: Build projects
  uses: sandre58/MyWorkflows/actions/build-and-test@main
  with:
    project-path: ${{ matrix.project }}
  strategy:
    matrix:
      project: ${{ fromJson(steps.find.outputs.projects) }}
```

## ⚙️ Repository Setup

### Prerequisites

1. **Configure GitHub Secrets** in your repository settings:
   - `NUGET_API_KEY` (or `RELEASE_API_KEY`) - NuGet API key for publishing stable releases
   - `PRERELEASE_API_KEY` - NuGet API key for publishing prereleases (can be the same as above)
   - `GITHUB_TOKEN` - Automatically provided by GitHub Actions

2. **Enable Git History** in your workflow:
   ```yaml
   - uses: actions/checkout@v4
     with:
       fetch-depth: 0  # Required for version calculation and changelog
   ```

3. **Use Conventional Commits** for automatic versioning:
   - `feat:` - New feature (minor version bump)
   - `fix:` - Bug fix (patch version bump)
   - `BREAKING CHANGE:` - Breaking change (major version bump)

### Getting Your NuGet API Key

1. Go to [nuget.org](https://www.nuget.org)
2. Sign in and go to **API Keys**
3. Create a new key with **Push** permissions
4. Copy the key and add it to your GitHub repository secrets

## 📋 Examples

### Example 1: Simple Single Project

Repository structure:
```
MyProject/
├── src/
│   └── MyProject.csproj
└── .github/
    └── workflows/
        └── release.yml
```

Tag and release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

Result:
- ✅ Builds `MyProject.csproj`
- ✅ Creates `MyProject.1.0.0.nupkg`
- ✅ Changelog at root: `CHANGELOG.md`
- ✅ Publishes to NuGet.org
- ✅ Creates GitHub Release with package

### Example 2: Monorepo with Multiple Projects

Repository structure:
```
MyRepository/
├── src/
│   ├── Core/
│   │   ├── Core.csproj
│   │   └── CHANGELOG.md
│   ├── Extensions/
│   │   ├── Extensions.csproj
│   │   └── CHANGELOG.md
│   └── Tools/
│       ├── Tools.csproj
│       └── CHANGELOG.md
└── .github/
    └── workflows/
        └── release.yml
```

Tag and release individual projects:
```bash
# Release Core
git tag Core/v1.0.0
git push origin Core/v1.0.0

# Release Extensions
git tag Extensions/v2.0.0
git push origin Extensions/v2.0.0

# Release Tools
git tag Tools/v1.5.0
git push origin Tools/v1.5.0
```

Result for each:
- ✅ Builds only the tagged project
- ✅ Changelog in project folder (e.g., `src/Core/CHANGELOG.md`)
- ✅ Only includes commits affecting that project
- ✅ Separate NuGet packages for each
- ✅ Independent versioning

### Example 3: Application (Not a Library)

For projects that are applications (not NuGet packages):

Repository structure:
```
MyApp/
├── src/
│   └── MyApp.csproj  # <OutputType>Exe</OutputType>
└── .github/
    └── workflows/
        └── release.yml
```

Tag and release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

Result:
- ✅ Publishes the application
- ✅ Creates a ZIP file of published output
- ✅ GitHub Release with ZIP artifact
- ❌ No NuGet package (it's an app, not a library)

## 🎯 Conventional Commits Guide

Use conventional commits for automatic semantic versioning:

| Commit Message | Version Bump | Example |
|----------------|--------------|---------|
| `fix: correct typo` | Patch (1.0.0 → 1.0.1) | Bug fixes |
| `feat: add new feature` | Minor (1.0.0 → 1.1.0) | New features |
| `feat!: redesign API` | Major (1.0.0 → 2.0.0) | Breaking changes |
| `BREAKING CHANGE:` in body | Major (1.0.0 → 2.0.0) | Breaking changes |
| `docs: update readme` | Patch (1.0.0 → 1.0.1) | Documentation |
| `chore: update deps` | Patch (1.0.0 → 1.0.1) | Maintenance |

## 📚 Documentation

Each action has comprehensive documentation with examples:
- [📖 View all action README files](./actions/)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**sandre58**

---

Made with ❤️ for the .NET community
