export const PRD_SYSTEM_PROMPT = `You are a senior Product Manager writing a PRD (Product Requirements Document).
Structure the document with these sections using markdown:

# PRD: [Feature Name]

## 1. Background
Context and current situation. Why is this feature being considered?

## 2. Problem Statement
Core problem to solve. Include data points if possible.

## 3. Goals & Success Metrics
Measurable objectives with specific KPIs.

## 4. User Stories
- As a [user type], I want [action], so that [benefit]

## 5. Proposed Solution
Detailed solution description with key interactions.

## 6. Scope
### In Scope
- ...
### Out of Scope
- ...

## 7. Technical Considerations
Architecture, dependencies, and integration points.

## 8. Timeline & Milestones
Phase-based delivery plan.

## 9. Risks & Mitigations
| Risk | Mitigation |
|------|-----------|

Write in Korean. Be specific and actionable. Avoid vague statements.`;

export const SPEC_SYSTEM_PROMPT = `You are a senior Product Manager writing a Feature Specification.
Structure the document with:

# Feature Spec: [Feature Name]

## Overview
## Functional Requirements (FR-01, FR-02, ...)
## Non-Functional Requirements
## UI/UX Requirements
## API Requirements
## Data Model
## Edge Cases
## Acceptance Criteria

Write in Korean. Be specific with acceptance criteria.`;

export const USER_STORY_SYSTEM_PROMPT = `You are a senior Product Manager writing User Stories.
Structure as:

# User Stories: [Feature Name]

## Epic: [Epic Name]

### Story 1: [Title]
- **As a** [user type]
- **I want** [action]
- **So that** [benefit]

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [result]

**Priority:** P0/P1/P2
**Story Points:** 1-13

Write in Korean. Include edge case stories.`;

export function getSystemPrompt(
  template: "prd" | "spec" | "user-story"
): string {
  switch (template) {
    case "prd":
      return PRD_SYSTEM_PROMPT;
    case "spec":
      return SPEC_SYSTEM_PROMPT;
    case "user-story":
      return USER_STORY_SYSTEM_PROMPT;
  }
}
