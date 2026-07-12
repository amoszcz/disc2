<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles:
  - II. Independently Valuable Slices -> II. Feature-Slice Delivery
  - III. Evidence Before Merge -> III. Feature-Proving Tests
  - IV. Minimal Surface Area -> IV. Minimal Dependencies, Real Integrations
  - V. Artifact Consistency -> V. Small, Loosely Coupled Design
- Added sections:
  - None
- Removed sections:
  - None
- Templates requiring updates:
  - .specify/templates/plan-template.md updated
  - .specify/templates/spec-template.md updated
  - .specify/templates/tasks-template.md updated
- Follow-up TODOs:
  - None
-->
# disc2 Constitution

## Core Principles

### I. Spec Before Code
Every non-trivial change MUST begin with a written spec, and implementation MUST
trace back to an approved spec, plan, and task list when those artifacts apply.
Work that bypasses the spec flow is allowed only for clearly scoped maintenance
changes such as typo fixes, dependency metadata updates, or non-behavioral
refactors. Rationale: this repository is organized around Spec Kit, so written
intent is the primary control against accidental scope and unstated assumptions.

### II. Feature-Slice Delivery
Each feature spec MUST be decomposed into user stories that are independently
testable, independently demonstrable, and ordered by value. A plan or task list
MUST avoid coupling a lower-priority story to a higher-priority story unless the
dependency is explicitly justified. Rationale: delivery must preserve an MVP path
and allow partial completion without producing dead work.

### III. Feature-Proving Tests
Every feature and every materially changed behavior MUST ship with automated
tests unless automation is impossible or wasteful for a documented reason.
Testing MUST prefer feature-level evidence such as integration, contract, or
acceptance-style coverage over implementation-coupled unit tests. Plans MUST
state how each user story will be proven, and tasks MUST include the test work
needed to demonstrate behavior through public seams. Rationale: the project
values evidence of user-visible behavior over tests that only mirror internals.

### IV. Minimal Dependencies, Real Integrations
Plans and implementation MUST prefer the smallest change that satisfies the spec
with the fewest new external libraries. Existing platform capabilities and the
standard library SHOULD be preferred when they can meet the requirement cleanly.
When a dependency or third-party integration is introduced, the code MUST keep a
small integration seam and tests MUST exercise the real library behavior that
matters to the feature rather than replacing it entirely with mocks. Rationale:
dependency sprawl and fake integrations create hidden maintenance cost and weak
confidence.

### V. Small, Loosely Coupled Design
Implementation MUST keep modules, functions, and feature seams small enough to
reason about locally. Coupling between stories, components, or adapters MUST be
minimized through clear interfaces and single-purpose responsibilities. New
abstraction layers MUST solve an immediate problem in the current feature, not a
speculative future one. Rationale: small clean code and loose coupling keep
change cost low and make feature-level testing practical.

## Delivery Constraints

- The authoritative workflow artifacts live under `.specify/`.
- Templates MUST remain generic enough for future features, but they MUST still
  encode the constitution's mandatory gates, testing expectations, and
  traceability requirements.
- Repository guidance in `AGENTS.md` and active plan files MUST not conflict with
  this constitution; when conflict exists, the constitution governs process and
  the lower-level artifact must be updated.
- Placeholder text may exist in templates, but published project memory files
  such as `.specify/memory/constitution.md` MUST NOT retain unresolved bracketed
  placeholders.
- Feature plans and tasks MUST prefer testing through public interfaces,
  end-to-end flows inside the repository boundary, or real adapter seams before
  adding implementation-detail assertions.

## Workflow & Quality Gates

- Constitution Check in `plan.md` MUST confirm spec-first execution, independent
  user-story slicing, feature-level validation evidence, dependency restraint,
  loose-coupling decisions, and artifact consistency impacts.
- `spec.md` MUST include user stories, acceptance scenarios, edge cases,
  functional requirements, measurable success criteria, assumptions, and explicit
  out-of-scope boundaries when relevant to prevent scope bleed. Each user story
  MUST describe how the feature will be tested at the behavior level.
- `tasks.md` MUST organize work by user story, preserve independent delivery,
  include automated test tasks for every behavior-changing story by default,
  favor integration or contract coverage where practical, and mark cross-cutting
  work separately from story-specific implementation.
- Any exception to these gates MUST be documented where the exception is taken,
  not inferred later from commit history or discussion.

## Governance

This constitution supersedes conflicting process guidance in repository templates
and memory files. Amendments MUST include the semantic version bump rationale, an
update to the Sync Impact Report at the top of this file, and same-change
updates to any affected templates or workflow guidance. Compliance review MUST be
performed during planning and again before implementation completion. Versioning
policy is semantic: MAJOR for incompatible governance changes or removed
principles, MINOR for new principles or materially stronger obligations, PATCH
for clarifications that do not change expected behavior.

**Version**: 1.1.0 | **Ratified**: 2026-07-08 | **Last Amended**: 2026-07-12
