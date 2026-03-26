# System-Wide Engineering Standards

## 1. The 100x Quality Imperative
Every piece of code generated, modified, or reviewed in this workspace must adhere to elite engineering standards:
- **Uncompromising Robustness**: Explicitly handle all edge cases, errors, and boundary conditions.
- **Strict Typing**: Enforce strong typing across all layers to catch errors at compile-time rather than runtime.
- **Performance First**: Avoid N+1 query problems, unnecessary re-renders, and inefficient loops.

## 2. Architectural Adherence & Multi-tenancy
- Always consult existing architecture patterns (such as `context/saas_architecture.md`) before implementing or modifying services.
- Data isolation is paramount. Ensure all database queries, API routes, and state managers strictly adhere to the multi-tenant security model.

## 3. Explorability & Maintainability 
- **Self-Documenting Code**: Prefer declarative, descriptive naming conventions over comments.
- **Targeted Comments**: Write comments *only* to explain the "Why" behind complex business logic or unconventional workarounds, never the "What".
- **Modularity**: Keep functions small, pure where possible, and strictly compliant with the Single Responsibility Principle.

## 4. Proactive Problem Solving Workflow
- Anticipate security vulnerabilities and scalability bottlenecks proactively in every task.
- Do not over-engineer; implement the most elegant, direct architectural solution that satisfies the requirements while minimizing future technical debt.

## 5. Cross-Environment & Cross-Stack Compatibility
- **Environment Agnosticism**: Ensure all code acts consistently across development, staging, and production environments. Never hardcode environment-specific URLs or secrets. Always use environment variables.
- **Cross-Platform Resilience**: Validate that shell scripts, file paths, and system commands work universally across operating systems (Windows, macOS, Linux).
- **Stack Harmony**: Ensure smooth communication between all parts of the tech stack (e.g., Python scripts, Laravel APIs, Frontend UI). Data structures and types must align perfectly across boundaries.
