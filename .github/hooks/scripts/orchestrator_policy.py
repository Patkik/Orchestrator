import sys
import json

def main():
    try:
        # Read the event payload from stdin
        input_raw = sys.stdin.read()
        if not input_raw.strip():
            sys.exit(0)
            
        data = json.loads(input_raw)
        agent_name = data.get("agentName", "unknown").lower()
        
        # When a subagent starts, ensure policies are context-aware.
        # We inject a deterministic system message based on the agent type
        # or handle a manual/undefined prompt flexibly.
        
        if "coder" in agent_name:
            system_msg = (
                "🎯 [POLICY] Coder Agent:\n"
                "1. Write clear, testable code and adhere to requested scope.\n"
                "2. Run tests to confirm functionality if appropriate.\n"
                "3. Provide final response in a structured/deterministic format."
            )
        elif "research" in agent_name or "explore" in agent_name:
            system_msg = (
                "🎯 [POLICY] Researcher Agent:\n"
                "1. Gather accurate information thoroughly.\n"
                "2. Provide concise, factual summaries logically."
            )
        elif "orchestrator" in agent_name or "manager" in agent_name:
            system_msg = (
                "🎯 [POLICY] Orchestrator:\n"
                "1. Delegate efficiently to specialized subagents.\n"
                "2. Track state correctly and do not execute code manually."
            )
        else:
            # Fallback for manual prompt or other agents
            system_msg = (
                "🎯 [POLICY] General Agent Guidelines:\n"
                "1. Follow the user's instructions carefully.\n"
                "2. Do exactly what is requested without feature creep."
            )

        output = {
            "continue": True,
            "systemMessage": system_msg
        }
        
        print(json.dumps(output))
        sys.exit(0)
    except Exception as e:
        # Fail gracefully to avoid blocking the workflow completely
        print(json.dumps({
            "continue": True,
            "systemMessage": f"⚠️ Hook validation warning: {str(e)}"
        }))
        sys.exit(0)

if __name__ == "__main__":
    main()
