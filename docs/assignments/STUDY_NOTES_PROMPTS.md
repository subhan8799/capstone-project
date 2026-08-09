# Study Notes Prompt Templates

This file contains exact prompts for each step of the source-grounded study notes workflow.

## General guidance
- Use the source pack as structured input.
- Keep every claim grounded in sources.
- Keep outputs concise and easy to transform into study notes.
- Do not invent facts.
- Mark unsupported information explicitly as needing verification.

## Step 1 — GATHER

Prompt template:

```text
You are building a source-grounded study note pipeline.
Collect the following sources into a structured source pack.
Input:
- Topic: {{topic}}
- Sources: a list of 3 to 5 reliable references.

For each source, return:
- title
- author or organization
- publication date or year
- URL
- source type (article, paper, report, video, other)
- short summary of the source in one sentence
- reliability note (why this source is credible)

Output a JSON array of source objects.
```

## Step 2 — SYNTHESIZE

Prompt template:

```text
You are synthesizing evidence from a structured source pack.
Input:
- Topic: {{topic}}
- Source pack: {{sourcePack}}

Extract:
- key concepts
- central findings
- any disagreements between sources
- evidence statements with source attribution
- definitions of important terms

Return:
- a list of evidence items, each with a claim, supporting source(s), and page/section detail if available.
- one short synthesis paragraph summarizing the state of knowledge.
```

## Step 3 — DRAFT

Prompt template:

```text
You are converting evidence-grounded synthesis into study notes.
Input:
- Topic: {{topic}}
- Synthesized evidence: {{synthesis}}

Produce:
- a first draft of study notes with headings and bullet points
- explicit source citations for each major statement
- a short "Key takeaway" section
```

## Step 4 — REVIEW

Prompt template:

```text
You are reviewing a draft of study notes against the original sources.
Input:
- Draft notes: {{draft}}
- Source pack: {{sourcePack}}

Check for:
- unsupported claims
- incorrect or misquoted facts
- missing context
- citation errors
- overly broad generalizations

Return:
- a review report with itemized issues
- a corrected draft with fixes and verified citations
```

## Step 5 — FORMAT

Prompt template:

```text
You are formatting corrected study notes into a polished final version.
Input:
- Corrected draft: {{correctedDraft}}

Produce:
- final study notes in clean markdown
- consistent headings and bullet formatting
- a brief reference section listing the original sources
```

## Prompt configuration notes
- For each step, replace placeholders like `{{topic}}`, `{{sourcePack}}`, and `{{draft}}` with actual text or JSON.
- Keep outputs machine-readable when possible.
- Save the exact prompt used for each run in the run template file.
- If using an LLM or no-code tool, preserve the prompt text exactly for the assignment record.
