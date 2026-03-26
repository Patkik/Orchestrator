import sys
import json

def main():
    try:
        input_raw = sys.stdin.read()
        if not input_raw.strip():
            sys.exit(0)
            
        data = json.loads(input_raw)
        tool_name = data.get("toolName", "").lower()
        tool_result = str(data.get("result", "")).lower()
        
        output = {"continue": True}

        # Check if this was a subagent returning a report or a test terminal command
        is_subagent_call = "runsubagent" in tool_name
        
        # Look for empirical evidence that the result was lacking, rejected, or threw exceptions
        lacking_keywords = [
            "<review_verdict>rejected</review_verdict>", 
            "<status>failed</status>",
            "issues_found", 
            "syntax error", 
            "exception", 
            "bugs remain"
        ]
        
        # If subagent returned an issue or lacking result
        if is_subagent_call:
            if any(keyword in tool_result for keyword in lacking_keywords):
                output["systemMessage"] = (
                    "⚠️ [QUALITY GATE FAILED] Structural deficiencies or errors were natively detected in the subagent's output.\n\n"
                    "🛡️ ORCHESTRATOR DYNAMIC PLANNING MANDATE:\n"
                    "1. DO NOT finalize the task or respond to the user as if it is complete.\n"
                    "2. You MUST immediately invoke the `manage_todo_list` tool to APPEND explicit, highly-specific follow-up tasks to fix the identified errors.\n"
                    "3. Assign the newly created debugging tasks to the `logic-debugger` (for code/logic) or `frontend-specialist` (for UI) via `runSubagent`.\n"
                    "4. Enforce this continuous loop until the subagent reports zero issues."
                )
            elif "logic-debugger" in str(data).lower() and not any(keyword in tool_result for keyword in ["failed", "exception", "error", "rejected"]):
                output["systemMessage"] = (
                    "✅ [DEBUGGER FINISHED] The logic-debugger successfully completed its debugging cycle.\n\n"
                    "🛡️ ORCHESTRATOR POST-DEBUG TESTING PROTOCOL:\n"
                    "1. DO NOT assume the bug is fully eliminated.\n"
                    "2. You MUST immediately invoke `manage_todo_list` to append a new 'Verify fix with automated tests' task.\n"
                    "3. Run the relevant test suite (via terminal or test subagent) to mathematically prove the patch worked before continuing."
                )

        print(json.dumps(output))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"continue": True, "systemMessage": f"⚠️ QA Todo Hook warning: {str(e)}"}))
        sys.exit(0)

if __name__ == "__main__":
    main()