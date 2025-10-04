{{ if .Unreleased.CommitGroups -}}
## [Unreleased]
{{ range .Unreleased.CommitGroups -}}
### {{ .Title }}
{{ range .Commits -}}
- {{ if .Scope }}**{{ .Scope }}:** {{ end }}{{ .Subject }}
{{ end }}
{{ end }}
{{ end }}
{{ range .Versions }}
 
{{ range .CommitGroups -}}
### {{ .Title }}
{{ range .Commits -}}
- {{ if .Scope }}**{{ .Scope }}:** {{ end }}{{ .Subject }} *(commit by **{{ with .Author }}{{ .Name }}**{{ end }}{{ if .Hash }} in [{{ .Hash.Short }}]({{ $.Info.RepositoryURL }}/commit/{{ .Hash.Long }}){{ end }})*
{{ end }}
{{ end }}

{{ if .RevertCommits -}}
### 🔄 Reverts
{{ range .RevertCommits -}}
- {{ .Revert.Header }}
{{ end }}
{{ end }}

{{ if .MergeCommits -}}
### 🔀 Merges
{{ range .MergeCommits -}}
- {{ .Header }}
{{ end }}
{{ end }}

{{ if .NoteGroups -}}
{{ range .NoteGroups -}}
// breaking changes or notes
### ⚠️ {{ .Title }}
{{ range .Notes }}
- {{ .Body }}
{{ end }}
{{ end }}
{{ end }}

---

{{ "" }}  <!-- force a line break -->

📖 [Full Changelog]({{ $.Info.RepositoryURL }}/blob/main/__CHANGELOG_PATH__)
{{ end }}