import json
import re

def detect_continuation_intent(user_message: str) -> bool:
    """
    Socratic continuous evaluation:
    Detects if the user or the system implies the overarching job is not yet complete.
    """
    keywords = [
        r"\bproceed\b", r"\bcontinue\b", r"\bnext step\b", 
        r"\bnot finished\b", r"\bmoving on\b", r"\bnow we can\b"
    ]
    for pattern in keywords:
        if re.search(pattern, user_message, re.IGNORECASE):
            return True
    return False

def socratic_continuation_hook(event):
    """
    Hook to enforce the Socrates of Vibecoding loop.
    If the task is not finished, it invokes the context-manager to summarize what was done,
    and then hands control back to the orchestrator to continue the grand design.
    """
    # Assuming event contains the latest user message or state
    message = event.get('message', '')
    
    if detect_continuation_intent(message):
        print("Socratic Reflection Triggered: The journey is not yet complete.")
        
        # 1. Trigger context-manager to record decisions and results
        context_payload = {
            "action": "record_state",
            "phase": "mid_execution_reflection",
            "directive": "Summarize starting decisions (1) and results achieved so far (2)."
        }
        
        # 2. Hand over to orchestrator to map the next steps based on the original prompt
        orchestration_payload = {
            "action": "plan_next_steps",
            "context": "Use the context-manager's reflection to determine the next immediate action to fulfill the original grand prompt.",
            "philosophy": "Embody the Socrates of vibecoding: question what is missing, ensure 9999999999999% perfection, and execute."
        }
        
        return {
            "status": "intercepted",
            "invoke_subagents": [
                {"name": "context-manager", "payload": context_payload},
                {"name": "orchestrator", "payload": orchestration_payload}
            ]
        }
    
    return {"status": "pass"}
