# analyze-renovate-log

Analyze Renovate json logs.

[![Latest version](https://deno.land/badge/analyze_renovate_log/version)](https://deno.land/x/analyze_renovate_log) [![CI](https://github.com/korosuke613/analyze-renovate-log/actions/workflows/ci.yaml/badge.svg)](https://github.com/korosuke613/analyze-renovate-log/actions/workflows/ci.yaml) [![codecov](https://codecov.io/github/korosuke613/analyze-renovate-log/branch/main/graph/badge.svg?token=IXJaSwmlYO)](https://codecov.io/github/korosuke613/analyze-renovate-log)

> **Warning**
> This project is still under development. Expect breaking changes.

## Install

```console
deno install -f --allow-read --allow-write https://deno.land/x/analyze_renovate_log/cli.ts
```

## Usage

```console
❯ analyze_renovate_log -h

  Usage: analyze-renovate-log

  Description:

    Analyze Renovate logs.

  Options:

    -h, --help                      - Show this help.
    -f, --file         <file-path>  - Input log json file.
    -o, --output-file               - Output file.
```

## Feature

- The following logs are retrieved and provided in JSON format.
  - Dependency extraction complete
  - packageFiles with updates
- Extract renovate message logs
  - log level: FATAL, ERROR, WARN, INFO

## Howto
Sample repo: https://github.com/korosuke613/renovate-playground

### 0. Preparation
Prepare a GitHub PAT with `write:repo`.

### 1. Cloning target repository
```console
git clone --depth=1 https://github.com/korosuke613/renovate-playground
cd renovate-playground
```

### 2. Generates Renovate logs in JSON format

- Enable debug logging.
- `$GH_TOKEN` is "0. Preparation" generates token.

```
LOG_LEVEL=debug \
LOG_FORMAT=json \
RENOVATE_CONFIG_FILE=renovate.json \
renovate --token $GH_TOKEN --dry-run --schedule= korosuke613/renovate-playground > renovate-json-default-branch.log
```

### 3. Analyze renovate json log

```console
❯ analyze_renovate_log -f ./renovate-json-default-branch.log
Renovate Message: [WARN] cli config dryRun property has been changed to full
Renovate Message: [INFO] Repository started
Renovate Message: [INFO] Full resolved config and hostRules including presets
Specific Log: Dependency extraction complete
Renovate Message: [INFO] Dependency extraction complete
Specific Log: packageFiles with updates
Manager: asdf
PackageFile: .tool-versions
Dep: goreleaser
Dep: golang
Dep: golangci-lint
Manager: gomod
PackageFile: go.mod
Dep: go
Dep: go.uber.org/zap
Manager: regex
PackageFile: .tool-versions
Dep: tool-versions/golang-version
PackageFile: .tool-versions
Dep: golangci/golangci-lint
Renovate Message: [INFO] DRY-RUN: Would commit files to branch renovate/golang-1.x
Renovate Message: [INFO] DRY-RUN: Would commit files to branch renovate/gomod
Renovate Message: [INFO] DRY-RUN: Would ensure Dependency Dashboard
Renovate Message: [INFO] DRY-RUN: Would save repository cache.
Renovate Message: [INFO] Repository finished
{
  "Dependency extraction complete": [
    {
      "baseBranch": "main",
      "stats": {
        "managers": {
          "asdf": {
            "fileCount": 1,
            "depCount": 3
          },
          "gomod": {
            "fileCount": 1,
            "depCount": 2
          },
          "regex": {
            "fileCount": 2,
            "depCount": 2
          }
        },
        "total": {
          "fileCount": 4,
          "depCount": 7
        }
      }
    }
  ],
  "packageFiles with updates": [
    {
      "baseBranch": "main",
      "updates": {
        "asdf": {
          ".tool-versions": {
            "goreleaser": {
              "depName": "goreleaser",
              "skipReason": "unsupported-datasource",
              "depIndex": 0,
              "updates": []
            },
            "golang": {
              "currentValue": "1.18.1",
              "depName": "golang",
              "datasource": "github-tags",
              "packageName": "golang/go",
              "versioning": "semver",
              "extractVersion": "^go(?<version>\\S+)",
              "depIndex": 1,
              "updates": [
                {
                  "bucket": "non-major",
                  "newVersion": "1.19.4",
                  "newValue": "1.19.4",
                  "releaseTimestamp": "2022-12-06T19:30:53.000Z",
                  "newMajor": 1,
                  "newMinor": 19,
                  "updateType": "minor",
                  "branchName": "renovate/golang-1.x"
                }
              ],
              "warnings": [],
              "sourceUrl": "https://github.com/golang/go",
              "currentVersion": "1.18.1",
              "isSingleVersion": true,
              "fixedVersion": "1.18.1"
            },
            "golangci-lint": {
              "depName": "golangci-lint",
              "skipReason": "unsupported-datasource",
              "depIndex": 2,
              "updates": []
            }
          }
        },
        "gomod": {
          "go.mod": {
            "go": {
              "managerData": {
                "lineNumber": 2
              },
              "depName": "go",
              "depType": "golang",
              "currentValue": "1.18",
              "datasource": "golang-version",
              "versioning": "npm",
              "rangeStrategy": "replace",
              "depIndex": 0,
              "updates": [
                {
                  "bucket": "non-major",
                  "newVersion": "1.19.4",
                  "newValue": "1.19",
                  "releaseTimestamp": "2022-12-06T00:00:00.000Z",
                  "newMajor": 1,
                  "newMinor": 19,
                  "updateType": "minor",
                  "isRange": true,
                  "branchName": "renovate/golang-version"
                }
              ],
              "warnings": [],
              "sourceUrl": "https://github.com/golang/go",
              "homepage": "https://go.dev/",
              "currentVersion": "1.18.9",
              "isSingleVersion": false
            },
            "go.uber.org/zap": {
              "managerData": {
                "lineNumber": 4
              },
              "depName": "go.uber.org/zap",
              "depType": "require",
              "currentValue": "v1.20.0",
              "datasource": "go",
              "depIndex": 1,
              "updates": [
                {
                  "bucket": "non-major",
                  "newVersion": "v1.24.0",
                  "newValue": "v1.24.0",
                  "releaseTimestamp": "2022-11-30T18:30:33.000Z",
                  "newMajor": 1,
                  "newMinor": 24,
                  "updateType": "minor",
                  "branchName": "renovate/gomod"
                }
              ],
              "warnings": [],
              "versioning": "semver",
              "sourceUrl": "https://github.com/uber-go/zap",
              "currentVersion": "v1.20.0",
              "isSingleVersion": true,
              "fixedVersion": "v1.20.0"
            }
          }
        },
        "regex": {
          ".tool-versions": {
            "tool-versions/golang-version": {
              "depName": "tool-versions/golang-version",
              "currentValue": "1.18.1",
              "datasource": "golang-version",
              "replaceString": "golang 1.18.1",
              "depIndex": 0,
              "updates": [
                {
                  "bucket": "non-major",
                  "newVersion": "1.19.4",
                  "newValue": "1.19.4",
                  "releaseTimestamp": "2022-12-06T00:00:00.000Z",
                  "newMajor": 1,
                  "newMinor": 19,
                  "updateType": "minor",
                  "branchName": "renovate/golang-version"
                }
              ],
              "warnings": [],
              "versioning": "semver",
              "sourceUrl": "https://github.com/golang/go",
              "homepage": "https://go.dev/",
              "currentVersion": "1.18.1",
              "isSingleVersion": true,
              "fixedVersion": "1.18.1"
            },
            "golangci/golangci-lint": {
              "depName": "golangci/golangci-lint",
              "currentValue": "1.49.0",
              "datasource": "github-releases",
              "extractVersion": "^v(?<version>.*)$",
              "replaceString": "golangci-lint 1.49.0",
              "depIndex": 0,
              "updates": [
                {
                  "bucket": "non-major",
                  "newVersion": "1.50.1",
                  "newValue": "1.50.1",
                  "releaseTimestamp": "2022-10-22T11:11:45.000Z",
                  "newMajor": 1,
                  "newMinor": 50,
                  "updateType": "minor",
                  "branchName": "renovate/golangci-lint"
                }
              ],
              "warnings": [],
              "versioning": "semver",
              "sourceUrl": "https://github.com/golangci/golangci-lint",
              "currentVersion": "1.49.0",
              "isSingleVersion": true,
              "fixedVersion": "1.49.0"
            }
          }
        }
      }
    }
  ]
}
```

## Release
1. Open [Tagging and Release action page](https://github.com/korosuke613/analyze-renovate-log/actions/workflows/release.yaml).
2. Click `Run workflow`.
3. Input version.
4. Click `Run workflow`.
