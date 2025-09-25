# Generate Changelog Action

Cette action génère automatiquement un changelog à partir de l'historique Git en utilisant [git-chglog](https://github.com/git-chglog/git-chglog).

## Fonctionnalités

- ✅ Installation automatique de git-chglog
- ✅ Configuration par défaut si aucune config n'existe
- ✅ Templates personnalisables
- ✅ Support multi-OS (Linux, macOS, Windows)
- ✅ Format conventionnel des commits
- ✅ Génération complète ou par tag

## Utilisation

### Basique
```yaml
- uses: ./actions/generate-changelog
  with:
    tag: v1.0.0
```

### Complète
```yaml
- uses: ./actions/generate-changelog
  with:
    tag: v1.0.0
    output-file: RELEASES.md
    config-file: .chglog/config.yml
    template-dir: .chglog
    repository-url: https://github.com/owner/repo
    next-tag: v1.1.0
```

## Paramètres

| Paramètre | Description | Requis | Défaut |
|-----------|-------------|--------|--------|
| `tag` | Tag Git pour générer le changelog | Non | (tous les tags) |
| `output-file` | Fichier de sortie | Non | `CHANGELOG.md` |
| `config-file` | Fichier de configuration git-chglog | Non | `.chglog/config.yml` |
| `template-dir` | Dossier des templates | Non | `.chglog` |
| `repository-url` | URL du dépôt pour les liens | Non | (auto-détecté) |
| `next-tag` | Tag suivant pour unreleased | Non | - |
| `format` | Format de sortie | Non | `markdown` |
| `git-chglog-version` | Version de git-chglog | Non | `latest` |

## Outputs

| Output | Description |
|--------|-------------|
| `changelog-content` | Contenu du changelog généré |
| `changelog-file` | Chemin vers le fichier changelog |

## Format des commits

L'action utilise le format conventionnel des commits :

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types supportés par défaut
- `feat`: Nouvelles fonctionnalités
- `fix`: Corrections de bugs
- `perf`: Améliorations de performance  
- `refactor`: Refactoring de code

### Exemple de commits
```
feat(auth): add OAuth2 authentication
fix(api): resolve null pointer exception
perf(db): optimize query performance
refactor(ui): simplify component structure
```

## Configuration personnalisée

### Fichier de config (.chglog/config.yml)
```yaml
style: github
template: CHANGELOG.tpl.md
info:
  title: CHANGELOG
  repository_url: https://github.com/owner/repo
options:
  commits:
    filters:
      Type:
        - feat
        - fix
        - perf
        - refactor
        - docs
  commit_groups:
    title_maps:
      feat: "🚀 Features"
      fix: "🐛 Bug Fixes"
      perf: "⚡ Performance"
      refactor: "♻️ Refactoring"
      docs: "📚 Documentation"
```

### Template personnalisé (.chglog/CHANGELOG.tpl.md)
```markdown
{{ range .Versions }}
## [{{ .Tag.Name }}] - {{ datetime "2006-01-02" .Tag.Date }}
{{ range .CommitGroups -}}
### {{ .Title }}
{{ range .Commits -}}
- {{ if .Scope }}**{{ .Scope }}:** {{ end }}{{ .Subject }} ([{{ .Hash.Short }}]({{ $.Info.RepositoryURL }}/commit/{{ .Hash.Long }}))
{{ end }}
{{ end -}}
{{ end -}}
```

## Structure des fichiers

```
.chglog/
├── config.yml          # Configuration git-chglog
└── CHANGELOG.tpl.md     # Template Markdown
```

## Exemples de changelog généré

```markdown
## [Unreleased]

### Features
- **auth:** add OAuth2 authentication
- **api:** add new endpoints for user management

### Bug Fixes
- **db:** fix connection timeout issues
- **ui:** resolve responsive layout problems

## [v1.0.0] - 2023-12-01

### Features
- **core:** initial release with basic functionality

### Performance Improvements
- **db:** optimize database queries
```