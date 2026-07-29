# Test Project

Test project for CLAUDE.md optimizer QA — synthetic content, safe to modify/revert.

## ⚠️ ALWAYS-ON RULES

1. **Test rule one — this must run before every deploy.** Never skip the pre-deploy checklist, even for hotfixes; always run the full test suite first.
2. **Never commit secrets to git.** API keys and passwords must never appear in tracked files, and any accidental commit must be scrubbed from history immediately.
3. **Database migrations require a backup first — don't skip this step** even on staging, because staging occasionally mirrors production data and a bad migration there has caused real incidents before.
4. **Long-running jobs should not be killed manually — never send SIGKILL directly**; use the graceful shutdown endpoint instead so in-flight work can drain cleanly.
5. **All new endpoints must have tests — don't merge untested code**, no matter how small the change looks, because small changes are exactly what slip through review unnoticed.
6. **Feature flags default to off — never flip a flag in production without a rollback plan** written down and shared with the on-call rotation first.
7. **Logging must not include PII — never log raw email addresses or phone numbers**, hash or redact them before they reach any log sink.
8. **Cache invalidation on write — don't rely on TTL alone for critical data paths**, because a stale read on a critical path has caused billing discrepancies in the past.
9. **Rate limiting is mandatory on public endpoints — never expose an unauthenticated endpoint without a rate limit** attached at the gateway layer.
10. **Error messages shown to users must not leak stack traces — never return raw exception text to the client**, always map to a generic, safe message instead.

## Critical Rules

### Deployment Pipeline

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Database Access Patterns

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### API Design Conventions

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Testing Strategy

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Background Job Processing

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Frontend State Management

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Third-Party Integrations

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Monitoring and Alerting

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Configuration Management

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Incident Response Process

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Caching Layer

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Authentication and Sessions

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Search Indexing

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Email and Notifications

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### File Storage Conventions

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Rate Limiting Policy

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Internal Tooling

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.

### Data Retention Policy

This part of the system has historically been a source of confusion for new contributors, so this section spells out the expected behavior in detail, including several edge cases that are easy to miss on a first read. Earlier drafts of this document tried to compress this into a single sentence, and that turned out to be a mistake, because the nuance genuinely matters when someone is debugging a live issue at 2am.

The original design favored simplicity over configurability, and that tradeoff has mostly held up well in production, though it does mean a few code paths look more verbose than they strictly need to be. Anyone tempted to introduce a generic abstraction here should first look at how many call sites would actually benefit, because historically the answer has been very few.

When in doubt, prefer the conservative option here rather than the clever one — this area of the codebase has had more than its share of subtle regressions from well-intentioned but under-tested optimizations. A clever one-line fix that shaves a few milliseconds is rarely worth the risk relative to a boring, obviously-correct implementation.

There is a longer historical note buried in the git log explaining exactly why this convention was chosen; the short version is that the earlier approach caused a production incident and was deliberately replaced. Reintroducing the old pattern, even in a slightly different form, tends to reintroduce the same class of bug.

None of this is meant to be exhaustive documentation of the underlying library — for that, refer to the vendor docs — but rather a description of the specific conventions this project layers on top of it. The intent is to save a future reader the time of reverse-engineering these conventions from the code alone.

A future refactor may simplify this further, but until that happens, the guidance below reflects the current, load-bearing behavior that other parts of the system depend on implicitly. Changing it without updating every dependent call site has caused breakage before.


### Extra Padding Notes

This final section exists purely to push the document comfortably over the 40KB warning threshold for testing purposes, and is safe to trim or remove entirely during optimization. 
### Extra Padding Notes

This final section exists purely to push the document comfortably over the 40KB warning threshold for testing purposes, and is safe to trim or remove entirely during optimization. 
### Extra Padding Notes

This final section exists purely to push the document comfortably over the 40KB warning threshold for testing purposes, and is safe to trim or remove entirely during optimization. 
### Extra Padding Notes

This final section exists purely to push the document comfortably over the 40KB warning threshold for testing purposes, and is safe to trim or remove entirely during optimization. 
### Extra Padding Notes

This final section exists purely to push the document comfortably over the 40KB warning threshold for testing purposes, and is safe to trim or remove entirely during optimization. 
### Extra Padding Notes

This final section exists purely to push the document comfortably over the 40KB warning threshold for testing purposes, and is safe to trim or remove entirely during optimization. 
### Extra Padding Notes

This final section exists purely to push the document comfortably over the 40KB warning threshold for testing purposes, and is safe to trim or remove entirely during optimization. 
### Extra Padding Notes

This final section exists purely to push the document comfortably over the 40KB warning threshold for testing purposes, and is safe to trim or remove entirely during optimization. 
### Extra Padding Notes

This final section exists purely to push the document comfortably over the 40KB warning threshold for testing purposes, and is safe to trim or remove entirely during optimization. 
### Extra Padding Notes

This final section exists purely to push the document comfortably over the 40KB warning threshold for testing purposes, and is safe to trim or remove entirely during optimization. 
### Extra Padding Notes

This final section exists purely to push the document comfortably over the 40KB warning threshold for testing purposes, and is safe to trim or remove entirely during optimization. 
### Extra Padding Notes

This final section exists purely to push the document comfortably over the 40KB warning threshold for testing purposes, and is safe to trim or remove entirely during optimization.