from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

EXCLUDED_COPY_NAMES = {".git", ".venv"}


@dataclass(frozen=True)
class InstallConfig:
    target: Path
    path: Path
    mode: str
    branch: str | None
    force: bool
    repo_url: str | None
    editable: bool


class InstallError(RuntimeError):
    pass


def parse_args(argv: list[str] | None = None) -> InstallConfig:
    parser = argparse.ArgumentParser(
        description="Install Orchestrator into another codebase as a submodule or file copy.",
    )
    parser.add_argument(
        "--target",
        default=".",
        help="Path to target repository root (default: current directory)",
    )
    parser.add_argument(
        "--path",
        default="vendor/orchestrator",
        help="Install path inside target repository (default: vendor/orchestrator)",
    )
    parser.add_argument(
        "--mode",
        choices=["submodule", "copy"],
        default="submodule",
        help="Install mode: submodule or copy (default: submodule)",
    )
    parser.add_argument("--branch", default=None, help="Branch for submodule mode")
    parser.add_argument("--force", action="store_true", help="Overwrite destination if it exists")
    parser.add_argument(
        "--repo-url",
        default=None,
        help="Repository URL for submodule mode (default: auto-detect from current repo origin)",
    )
    parser.add_argument(
        "--editable",
        action="store_true",
        help="Attempt optional editable pip install after installation",
    )

    args = parser.parse_args(argv)
    return InstallConfig(
        target=Path(args.target).expanduser().resolve(),
        path=Path(args.path),
        mode=args.mode,
        branch=args.branch,
        force=bool(args.force),
        repo_url=args.repo_url,
        editable=bool(args.editable),
    )


def resolve_repo_url_from_origin(source_root: Path) -> str | None:
    try:
        result = run_command(
            ["git", "-C", str(source_root), "config", "--get", "remote.origin.url"],
            capture_output=True,
        )
    except (subprocess.CalledProcessError, OSError):
        return None

    repo_url = (result.stdout or "").strip()
    return repo_url or None


def run_command(
    command: list[str],
    *,
    cwd: Path | None = None,
    capture_output: bool = True,
) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=str(cwd) if cwd else None,
        check=True,
        text=True,
        capture_output=capture_output,
    )


def _ensure_target_exists(target: Path) -> None:
    if not target.exists() or not target.is_dir():
        raise InstallError(f"Target path does not exist or is not a directory: {target}")


def _ensure_relative_destination(path: Path) -> Path:
    if path.is_absolute():
        raise InstallError("--path must be relative to --target")
    return path


def _prepare_destination(destination: Path, force: bool) -> None:
    if destination.exists() and not force:
        raise InstallError(
            f"Destination already exists: {destination}. Re-run with --force to overwrite."
        )
    if destination.exists() and force:
        if destination.is_file() or destination.is_symlink():
            destination.unlink()
        else:
            shutil.rmtree(destination)


def _copy_ignore(_: str, names: list[str]) -> set[str]:
    return {name for name in names if name in EXCLUDED_COPY_NAMES}


def install_copy_mode(source_root: Path, destination: Path, force: bool) -> None:
    _prepare_destination(destination, force)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source_root, destination, ignore=_copy_ignore)


def install_submodule_mode(
    target: Path,
    relative_path: Path,
    repo_url: str,
    branch: str | None,
    force: bool,
) -> None:
    command = ["git", "-C", str(target), "submodule", "add"]
    if force:
        command.append("--force")
    if branch:
        command.extend(["-b", branch])
    command.extend([repo_url, str(relative_path).replace("\\", "/")])
    run_command(command, capture_output=True)


def attempt_editable_install(destination: Path) -> str | None:
    try:
        run_command([sys.executable, "-m", "pip", "install", "-e", str(destination)])
        return None
    except (subprocess.CalledProcessError, OSError) as exc:
        return (
            "WARNING: Editable install failed. Continue manually with "
            f"`{sys.executable} -m pip install -e {destination}`. Details: {exc}"
        )


def execute_install(config: InstallConfig, *, source_root: Path) -> tuple[Path, str | None]:
    _ensure_target_exists(config.target)
    relative_path = _ensure_relative_destination(config.path)
    destination = config.target / relative_path

    if config.mode == "copy":
        install_copy_mode(source_root=source_root, destination=destination, force=config.force)
    else:
        repo_url = config.repo_url or resolve_repo_url_from_origin(source_root)
        if repo_url is None:
            raise InstallError(
                "Unable to determine repository URL from current repository origin. "
                "Please provide --repo-url for submodule mode."
            )
        if destination.exists() and config.force:
            _prepare_destination(destination, True)
        elif destination.exists() and not config.force:
            raise InstallError(
                f"Destination already exists: {destination}. Re-run with --force to overwrite."
            )
        install_submodule_mode(
            target=config.target,
            relative_path=relative_path,
            repo_url=repo_url,
            branch=config.branch,
            force=config.force,
        )

    warning = attempt_editable_install(destination) if config.editable else None
    return destination, warning


def main(argv: list[str] | None = None) -> int:
    try:
        config = parse_args(argv)
        source_root = Path(__file__).resolve().parents[1]
        destination, warning = execute_install(config, source_root=source_root)
    except InstallError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    except subprocess.CalledProcessError as exc:
        stderr_output = (exc.stderr or "").strip()
        print(
            f"ERROR: Command failed with exit code {exc.returncode}. {stderr_output}",
            file=sys.stderr,
        )
        return exc.returncode or 1

    print("Installation successful")
    print(f"mode={config.mode}")
    print(f"target={config.target}")
    print(f"installed_path={destination}")
    print("import_example=from orchestrator import StateDatabase")
    if warning:
        print(warning)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
