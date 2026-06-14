---
source_id: seb-claude-tools
version: 1.0.0
---

# Code Review Dimensions — Research Reference

Compiled 2026-04-09 from CodeRabbit, SonarQube, Snyk, OWASP, Vercel, arXiv research.
Used to build the `/deep-review` skill chain.

---

## Dimension Taxonomy

```
SECURITY: input validation, authentication, authorization/IDOR,
          session management, cryptography, error disclosure, supply chain

CORRECTNESS: logic errors, null handling, race conditions,
             type safety, framework contract violations

RESOURCE MANAGEMENT: connection lifecycle, file handles,
                     event listener cleanup, memory

ABSTRACTION INTEGRITY: business logic placement, leaky abstractions,
                       wrong abstraction level, framework misuse

PERFORMANCE: N+1, over-fetching, sequential awaits, bundle size

ADVERSARIAL (what's absent): missing error paths, missing auth checks,
             missing rate limits, missing rollbacks, missing audit logs
```

## Key Insight: LLM Blind Spots

- LLMs fail to self-correct 64.5% of the time on their own output
- LLMs evaluate presence, not absence — they miss what's NOT there
- ~50% SAST detection rate across all tools; ~22% of real vulnerabilities undetected
- Tools miss: cross-service drift, business logic violations, framework safety bypasses

## Sources

- Graphite: top AI code review platforms 2025
- OWASP: Secure Code Review Cheat Sheet
- Vercel: Common mistakes with Next.js App Router
- arXiv: Can Adversarial Code Comments Fool AI Reviewers (2602.16741)
- SonarQube: Security-Related Rules docs
- Augment Code: When to Use Manual Code Review Over Automation
