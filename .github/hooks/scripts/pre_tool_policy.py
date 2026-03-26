import sys
import json

def main():
    try:
        # Read the event payload from stdin
        input_raw = sys.stdin.read()
        if not input_raw.strip():
            sys.exit(0)
            
        data = json.loads(input_raw)
        
        # Determine the tool being called if possible
        tool_name = data.get("toolName", "unknown").lower()
        
        # We always allow the tool usage.
        decision = "allow"
        reason = "Tool usage complies with acceptable Orchestrator policies."
        
        output = {
            "continue": True,
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": decision,
                "permissionDecisionReason": reason
            }
        }
        
        # Only inject policy reminders on highly delegative tools to avoid polluting manual prompts / researches
        if "runsubagent" in tool_name or "execute" in tool_name:
            output["systemMessage"] = "⚠️ Orchestrator Policy: Provide crisp boundaries. Do not merge unrelated tasks."
        
        print(json.dumps(output))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({
            "continue": True,
            "systemMessage": f"⚠️ Hook validation warning: {str(e)}"
        }))
        sys.exit(0)

if __name__ == "__main__":
    main()
