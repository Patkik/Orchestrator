# Orchestrator

Plug-and-play installer scripts are included to integrate this repository into another codebase while preserving repository files.

## Installer outputs

- `scripts/install.py`
- `scripts/install.ps1`
- `scripts/install.sh`

## Arguments

The installer supports the required arguments:

- `--target`: target repository path (default: current directory `.`).
- `--path`: install path inside target repository (default: `vendor/orchestrator`).
- `--mode`: `copy` or `submodule` (default: `submodule`).
- `--branch`: branch used for submodule mode.
- `--force`: overwrite destination path if it exists.
- `--repo-url`: optional repository URL used in submodule mode.
- `--editable`: optional editable install (`pip install -e`) with warning-only behavior on failure.

## Behavior

### `copy` mode

- Copies this repository into `target/path`.
- Excludes `.git` and `.venv` during copy.

### `submodule` mode

- Preserves this repository as a git submodule in the target codebase.
- When `--repo-url` is omitted, installer attempts to resolve from current repository `remote.origin.url`.
- If no repo URL is available for submodule mode, installer exits with an `InstallError` asking for `--repo-url`.

## Usage

### Python (cross-platform)

```bash
python scripts/install.py
```

### PowerShell

```powershell
./scripts/install.ps1 --target C:\path\to\target --mode submodule --repo-url https://github.com/example/orchestrator.git --branch main
```

### Bash

```bash
./scripts/install.sh --target /path/to/target --mode copy --force --editable
```

## Success output

On success, installer prints clear output:

- `Installation successful`
- selected mode
- target path
- installed path
- import example line: `from orchestrator import StateDatabase`
- optional editable-install warning (if `--editable` was requested and pip install fails)
