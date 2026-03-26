"""Backward-compatible shim for `references.orchestrator_reference`."""

if __name__ == "__main__":
	import runpy

	runpy.run_module("references.orchestrator_reference", run_name="__main__")
else:
	from references.orchestrator_reference import *  # noqa: F401,F403
