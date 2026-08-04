# Prompt Ladder Deliverable

This document shows how a vague request becomes a production-ready prompt by layering audience, constraints, accessibility, format, and verification.

## 1. Baseline Prompt

**Prompt**

Help me build a user profile settings form in React.

**Output excerpt**

Generates a basic `useState` component with inline `onChange` handlers, no schema validation, standard HTML inputs, and several paragraphs explaining basic React state.

**Notes**

- What changed in prompt: Initial baseline.
- What improved in output: N/A; this is the starting point.
- What still failed: Generic boilerplate code, zero validation, zero accessibility, and preachy basic explanations.
- What to try next: Define the target audience and role to eliminate basic React tutorials.

## 2. Version 1: Defined Audience and Role

**Prompt**

Act as a Senior Frontend Engineer writing code for an experienced React developer. Help me build a user profile settings form in React.

**Output excerpt**

Removes basic explanations like "React hooks are used for managing state" and jumps straight into the component code.

**Notes**

- What changed in prompt: Added role and audience.
- What improved in output: Stopped explaining basic React concepts; tone became concise and technical.
- What still failed: The code itself is still simplistic `useState` logic without validation or accessibility.
- What to try next: Add explicit technical constraints on libraries and state management.

## 3. Version 2: Constraints

**Prompt**

Act as a Senior Frontend Engineer writing code for an experienced React developer. Help me build a user profile settings form in React using react-hook-form and zod validation. Do not use standard uncontrolled HTML inputs.

**Output excerpt**

Switches to `react-hook-form` and creates a Zod schema for name and email validation.

**Notes**

- What changed in prompt: Enforced library constraints and banned uncontrolled inputs.
- What improved in output: Code quality upgraded to production-standard schema validation.
- What still failed: The output became overly verbose; extra wrapper styles and clutter crept in.
- What to try next: Add quality criteria around accessibility.

## 4. Version 3: Quality Criteria

**Prompt**

Act as a Senior Frontend Engineer writing code for an experienced React developer. Help me build a user profile settings form in React using react-hook-form and zod validation. Do not use standard uncontrolled HTML inputs. Ensure full WCAG 2.1 AA accessibility compliance with explicit aria-invalid and aria-describedby bindings.

**Output excerpt**

Adds `<label htmlFor="...">`, `aria-invalid={errors.name ? "true" : "false"}`, and connects error spans with matching id attributes.

**Notes**

- What changed in prompt: Added quality criteria.
- What improved in output: Screen reader accessibility was fixed; active error states are now properly announced.
- What still failed: The output format was messy, mixing TypeScript code, markdown explanations, and setup steps.
- What to try next: Specify a strict output structure.

## 5. Version 4: Specified Output Format

**Prompt**

Act as a Senior Frontend Engineer writing code for an experienced React developer. Help me build a user profile settings form in React using react-hook-form and zod validation. Do not use standard uncontrolled HTML inputs. Ensure full WCAG 2.1 AA accessibility compliance with explicit aria-invalid and aria-describedby bindings. Format the output strictly as a single self-contained TypeScript file (.tsx) followed by a brief markdown summary table of implemented fields.

**Output excerpt**

Delivers one clean `.tsx` code block followed by a 4-row markdown table summarizing field rules.

**Notes**

- What changed in prompt: Specified exact format.
- What improved in output: No conversational fluff; response is copy-pasteable into an IDE.
- What still failed: Lack of automated test suite to verify component behavior.
- What to try next: Add verification requirements.

## 6. Version 5: Verification Requirements

**Prompt**

Act as a Senior Frontend Engineer writing code for an experienced React developer. Help me build a user profile settings form in React using react-hook-form and zod validation. Do not use standard uncontrolled HTML inputs. Ensure full WCAG 2.1 AA accessibility compliance with explicit aria-invalid and aria-describedby bindings. Format the output strictly as a single self-contained TypeScript file (.tsx) followed by a brief markdown summary table of implemented fields. Finally, write a corresponding unit test file using Vitest and React Testing Library that verifies form validation errors and submission behavior.

**Output excerpt**

Includes both the complete component file and a separate `.test.tsx` file mocking user input, triggering validation errors, and testing submit handlers.

**Notes**

- What changed in prompt: Added testing and verification requirements.
- What improved in output: The output became a complete, production-ready feature with validation, accessibility, and automated verification.
- What still failed: Nothing; this meets all quality standards.
- What to try next: Clean the prompt into a reusable template for other developers.

## Final Reusable Prompt

```text
Act as a Senior Frontend Engineer. Generate a production-ready React form component based on the following specifications:

1. ROLE & AUDIENCE:
Target audience is an experienced frontend developer. Omit elementary explanations.

2. CONSTRAINTS & STACK:
- Framework: React with TypeScript (.tsx)
- State & Validation: react-hook-form paired with Zod schema validation
- Prohibited: Uncontrolled native inputs or manual useState forms

3. QUALITY & ACCESSIBILITY:
- Enforce WCAG 2.1 AA compliance
- Bind every input to an explicit <label>
- Use aria-invalid and aria-describedby for accessible error handling

4. DELIVERABLE FORMAT:
- Single self-contained component file (.tsx)
- Brief markdown summary table of validated fields
- Corresponding unit test file using Vitest and React Testing Library covering validation error triggers and submit handlers
```