import sys
import json

def main():
    try:
        input_raw = sys.stdin.read()
        if not input_raw.strip():
            sys.exit(0)
            
        data = json.loads(input_raw)
        agent_name = data.get("agentName", "unknown").lower()
        
        output = {
            "continue": True
        }

        # Intercept and strictly enforce behavior when the context-manager is invoked
        if "context" in agent_name or "manager" in agent_name:
            output["systemMessage"] = (
                "🧠 [CRITICAL HOOK INJECTION: CONTEXT-MANAGER POLICY]\n"
                "Remember your core behavioral directives:\n"
                "1. AGGRESSIVE COMPRESSION: Never echo or store raw stack traces or massive file dumps. Distill them into bulleted root causes.\n"
                "2. TOKEN ECONOMY: Actively recommend pruning deprecated or completed session memory to prevent context-window overflow.\n"
                "3. STATE PERSISTENCE: Write vital, global rules directly to '/memories/'. Keep transient task progress in '/memories/session/'.\n"
                "4. DETERMINISTIC HANDOFF: Always wrap your final payload in `<context_state>` XML tags so the Orchestrator can ingest it flawlessly."
            )

        print(json.dumps(output))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({
            "continue": True,
            "systemMessage": f"⚠️ Context-Manager hook warning: {str(e)}"
        }))
        sys.exit(0)

if __name__ == "__main__":
    main()