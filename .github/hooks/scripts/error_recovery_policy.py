import sys
import json
import time

def main():
    try:
        input_raw = sys.stdin.read()
        if not input_raw.strip():
            sys.exit(0)
            
        data = json.loads(input_raw)
        
        # Determine the tool being called and its result
        tool_name = data.get("toolName", "unknown").lower()
        tool_result = data.get("result", {})
        error_message = data.get("error", "")
        
        output = {
            "continue": True
        }

        # Dump payload string for inspection
        payload_str = str(data)

        # Intercept specific network & stream termination failures from the agent/server
        if "Stream terminated" in payload_str or "Server error" in payload_str or "Sorry, your request failed" in payload_str:
            output["systemMessage"] = (
                "⚠️ [CRITICAL INTERCEPT] A 'Stream Terminated' or 'Generation Failure' occurred while executing "
                f"tool/subagent '{tool_name}'. \n\n"
                "🛡️ STRICT RECOVERY PROTOCOL INITIATED:\n"
                "1. DO NOT COMPLETE OR ABORT THE TASK. This is a transient API failure, NOT a logic failure.\n"
                "2. Apply Exponential Backoff. (Hook has paused execution for 2 seconds).\n"
                "3. AUTONOMOUSLY RETRY the exact same subagent call or terminal command.\n"
                "4. If invoking a generic prompt, try chunking it smaller to reduce API token load and prevent second termination.\n"
                "5. Only report failure to the user if 3 consecutive retries fail."
            )
            
            # Synchronous back-off to let API cool down
            time.sleep(2)

        print(json.dumps(output))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({
            "continue": True,
            "systemMessage": f"⚠️ Error handler hook warning: {str(e)}"
        }))
        sys.exit(0)

if __name__ == "__main__":
    main()