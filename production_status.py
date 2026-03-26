"""Backward-compatible shim for `tools.production_status`."""

from tools.production_status import main


if __name__ == "__main__":
    raise SystemExit(main())
