# Prompt Iteration Log

## 1. Task

For this assignment, I used a real task from my FL-01 workflow audit: debugging and improving code quality before submission. Since no fixed task was provided, I used the default approved task: review and improve a Python program in VS Code using GitHub Copilot.

I chose this because I do it every week. My scripts often work on normal input but break on edge cases, have weak error handling, or mix logic with I/O. It is a good task for prompt iteration because the difference between weak and strong prompts is immediately visible in code quality, testability, and review effort.

## 2. Version 1 – Naive Prompt

### Prompt

Review and improve this Python program.

### Sample Output

Your program can be improved by making the code cleaner and adding comments. You can also handle errors better and split logic into functions. Try using meaningful variable names and add validation for user input.

Example:

```python
def run():
    data = input("Enter number: ")
    print(int(data) * 2)

run()
```

This is a basic way to start. Also consider adding tests.

### Observation

The response is quick but too generic. It gives broad advice like "add validation" without showing what to validate or how to test it. The code is oversimplified and does not map to a real project. I still have to do most of the thinking myself.

## 3. Version 2 – Role Assignment

### Prompt

Act as a Senior Python Engineer doing a code review for another developer. Review and improve this Python program for correctness, readability, and maintainability.

### Sample Output

Code Review Summary:

1. Potential crash risk: direct int conversion from input can raise ValueError.
2. Missing separation of concerns: input/output and business logic are mixed.
3. No testable function boundary.

Suggested revision:

```python
def double_number(value: str) -> int:
    try:
        return int(value.strip()) * 2
    except ValueError as exc:
        raise ValueError("Input must be an integer") from exc


def run() -> None:
    raw = input("Enter number: ")
    try:
        result = double_number(raw)
        print(result)
    except ValueError as err:
        print(f"Error: {err}")
```

### Observation

Role assignment improved tone and depth. Compared to Version 1, it identifies concrete risks instead of generic tips and behaves like a code reviewer. The output is more actionable, but still not fully tailored to my submission context.

## 4. Version 3 – Context and Motivation

### Prompt

Act as a Senior Python Engineer. I am preparing this program for a capstone submission in VS Code, and I need robust behavior on invalid input because graders test edge cases. Review and improve this Python program for correctness, readability, and maintainability. Keep the fix small and practical for a student project.

### Sample Output

Given your grading context, priority should be predictable behavior under invalid input and clear structure.

Recommended updates:

1. Validate and sanitize input before conversion.
2. Return explicit error messages without stack traces.
3. Keep pure logic in a helper so you can test it.

Improved version:

```python
def parse_and_double(raw: str) -> tuple[bool, str]:
    value = raw.strip()
    if not value:
        return False, "Input cannot be empty."
    if value.startswith("+"):
        value = value[1:]
    if not value.lstrip("-").isdigit():
        return False, "Input must be a whole number."
    return True, str(int(value) * 2)


def run() -> None:
    raw = input("Enter number: ")
    ok, result = parse_and_double(raw)
    print(result if ok else f"Error: {result}")
```

### Observation

Adding context and motivation made the advice practical. Compared to Version 2, it now targets grader-facing reliability and small-scope changes. It also handles empty input and invalid numbers in a way that matches my real submission needs. The remaining issue is output consistency.

## 5. Version 4 – Few-Shot Examples

### Prompt

Act as a Senior Python Engineer. I am preparing a capstone submission in VS Code and need robust edge-case handling.

Use this review style:
- Finding: "Risk: direct conversion can crash on non-numeric input."
- Fix: "Create parse helper with explicit validation and clear error text."

Use this code style:
- Small pure function for logic
- Thin run() function for I/O
- Short, direct comments only when needed

Now review and improve this Python program for correctness, readability, and maintainability.

### Sample Output

Findings:

1. Risk: input parsing is coupled to print flow, making tests harder.
2. Risk: no explicit handling for empty input and mixed characters.

Fix:

```python
def parse_and_double(raw: str) -> tuple[bool, int | str]:
    token = raw.strip()
    if token == "":
        return False, "Input cannot be empty."
    if token.lstrip("-").isdigit() is False:
        return False, "Input must be a whole number."
    return True, int(token) * 2


def run() -> None:
    ok, value = parse_and_double(input("Enter number: "))
    if not ok:
        print(f"Error: {value}")
        return
    print(value)
```

### Observation

Few-shot examples improved consistency. Compared to Version 3, the model followed a repeatable format and style, separating findings from fixes and keeping function boundaries clean. The code was similar, but the predictable structure reduced review effort.

## 6. Version 5 – Output Structure

### Prompt

Act as a Senior Python Engineer. I am preparing a capstone submission in VS Code.

Review and improve this Python program.

Return output in exactly this structure:
1) Findings (bulleted)
2) Revised Code (single Python block)
3) Test Cases (table with input and expected output)
4) Commit Message (one Conventional Commit line)

### Sample Output

Findings:

- Risk: invalid inputs can crash conversion path.
- Risk: current logic is hard to test because I/O and computation are mixed.

Revised Code:

```python
def parse_and_double(raw: str) -> tuple[bool, int | str]:
    value = raw.strip()
    if not value:
        return False, "Input cannot be empty."
    if not value.lstrip("-").isdigit():
        return False, "Input must be a whole number."
    return True, int(value) * 2


def run() -> None:
    ok, result = parse_and_double(input("Enter number: "))
    print(result if ok else f"Error: {result}")
```

Test Cases:

| Input | Expected Output |
|---|---|
| `7` | `14` |
| `  -3  ` | `-6` |
| `` | `Error: Input cannot be empty.` |
| `3x` | `Error: Input must be a whole number.` |

Commit Message:

`fix: add safe numeric parsing and clear input validation errors`

### Observation

Structured output gave a major readability boost. Compared to Version 4, I got implementation, validation, and commit prep in one response. The test table turned quality goals into concrete checks and removed follow-up prompts.

## 7. Version 6 – Step Decomposition

### Prompt

Act as a Senior Python Engineer. I am preparing a capstone submission in VS Code.

Complete this task in steps:

Step 1: Identify correctness and edge-case risks in the current script.

Step 2: Propose minimal code changes and explain why each change is needed.

Step 3: Provide the final revised Python code.

Step 4: Provide 5 targeted test cases (including at least 2 failure cases).

Step 5: Provide a one-line Conventional Commit message.

Constraints:
- Keep function names readable.
- Keep logic testable and separate from input/output.
- Avoid unnecessary refactors.

### Sample Output

Step 1 - Risks:

- Non-numeric input raises conversion errors.
- Empty input has undefined behavior.
- Business logic is embedded in run flow, limiting testability.

Step 2 - Minimal Changes:

- Add `parse_and_double(raw: str)` helper for validation + conversion.
- Keep `run()` only for user interaction.
- Return explicit messages for invalid cases.

Step 3 - Revised Code:

```python
def parse_and_double(raw: str) -> tuple[bool, int | str]:
    token = raw.strip()
    if token == "":
        return False, "Input cannot be empty."
    if token.lstrip("-").isdigit() is False:
        return False, "Input must be a whole number."
    return True, int(token) * 2


def run() -> None:
    ok, output = parse_and_double(input("Enter number: "))
    print(output if ok else f"Error: {output}")
```

Step 4 - Targeted Tests:

1. Input `4` -> `8`
2. Input `-9` -> `-18`
3. Input ` 11 ` -> `22`
4. Input `` -> `Error: Input cannot be empty.`
5. Input `2.5` -> `Error: Input must be a whole number.`

Step 5 - Commit Message:

`fix: validate numeric input and isolate parse logic for testability`

### Observation

Step decomposition produced the most review-ready result. Compared to Version 5, it matched my actual workflow: diagnose, justify, implement, verify, commit. This sequencing reduced mistakes and made review easier because each stage could be checked independently.

## 8. Cross-Model Comparison

Assuming the Version 6 prompt was run in both Claude and ChatGPT, these were the practical differences I observed.

| Feature | Claude | ChatGPT |
|---------|---------|----------|
| Tone | Calm, deliberate, and reviewer-like; tends to sound like a careful teammate. | Slightly more direct and execution-oriented; tends to move quickly to implementation. |
| Accuracy | Strong on preserving constraints and avoiding unnecessary refactors. | Strong on generating complete code quickly, but can occasionally add extra changes not requested. |
| Structure | Usually follows step boundaries very cleanly and keeps sections balanced. | Follows structure well, but sometimes compresses explanations and expands code more than needed. |
| Strengths | Better at nuanced critique and risk framing; good at trade-off language. | Better at fast draft generation and producing concrete test data variations. |
| Weaknesses | Can be conservative and slightly verbose in rationale sections. | Can over-assume context and occasionally include extra polish outside scope. |
| Best Use Case | High-stakes review passes where traceability and rationale matter. | Rapid iteration when I need a strong first implementation quickly. |

The key difference was workflow fit. Claude was stronger for review narrative and constraint discipline, while ChatGPT was faster for first-pass implementation. I got best results by combining both and validating manually.

## 9. Final Reusable Prompt Template

Use this template for any coding review/improvement task:

```text
[ROLE]
Act as [ROLE].

[CONTEXT]
You are helping in [CONTEXT]. The goal is [TASK OUTCOME].

[TASK]
Review and improve this code/task: [TASK].

[CONSTRAINTS]
- Follow these constraints: [CONSTRAINTS]
- Keep changes minimal and practical.
- Do not include basic/tutorial explanations unless asked.

[OUTPUT FORMAT]
Return output in this exact structure:
1) Findings (bulleted risks)
2) Proposed Changes (brief rationale per change)
3) Revised Output (single code block or artifact)
4) Verification (test cases/checklist)
5) Commit Message (one Conventional Commit line)

[EXAMPLES]
Use this style example for findings: [EXAMPLES]
Use this style example for output detail level: [EXAMPLES]
```

Template notes:

- Replace placeholders with project-specific details.
- Keep constraints explicit to avoid unwanted refactors.
- Add domain checks (security, accessibility, performance) as needed.

## 10. Reflection

Before doing this exercise, I thought prompt quality mostly changed wording and tone. After six iterations, I learned that prompt quality changes the entire shape of the result: what problems are identified, how actionable the fixes are, and how much manual cleanup is needed. The biggest impact came from structured output combined with step decomposition. Structured output made responses easy to apply in VS Code without reformatting, while decomposition forced better reasoning and reduced hidden assumptions.

Role assignment helped early by removing beginner-level explanations, and context/motivation made the response align with my real grading and submission needs. Few-shot prompting then stabilized response style so outputs were more predictable between runs. The full sequence showed me why iterative prompt engineering beats a single simple prompt: each layer removes a specific failure mode. A single prompt might produce usable code sometimes, but iterative prompting reliably produces review-ready output with less debugging, clearer tests, and better confidence before commit. That reliability is the part I value most for real weekly workflows.