---
name: learning-docs
version: 2.1
description: 
   -Transforms user-selected knowledge into clear, reusable Markdown documentation.
   - skill is activated only through an explicit user request.
triggers:
   - documenta esto
   - guarda este aprendizaje
   - crea una nota
   - registra esta solución
   - documenta este error
   - resume este aprendizaje
   - guarda esta conversación
---

# Goal

Transform user-selected knowledge into concise, reusable Markdown documentation.

This skill is not intended to document entire projects or conversations unless explicitly requested.

Its only responsibility is converting a specific piece of information into a well-structured knowledge note.

---

# Scope

Only document the information explicitly selected by the user.

Never document additional topics.

Never infer lessons outside the selected content.

Never summarize an entire conversation or project unless explicitly requested.

---

# Workflow

When the skill is triggered:

1. Ensure the `lesson2learn` folder exists in the project root.
   - Create it if necessary.
   - Otherwise reuse it.

2. Determine exactly what the user wants to document.
   - If the target is ambiguous, ask the user before continuing.

3. Extract only the relevant information.

4. Remove unnecessary context while preserving all useful technical knowledge.

5. Classify the note into the most appropriate category.

6. Generate:
   - a concise descriptive title
   - a filesystem-safe filename
   - the creation timestamp

7. Create the Markdown document.

8. Save it inside `lesson2learn`.

9. Return the generated Markdown.

---

# Documentation Rules

Keep only:

- reusable knowledge
- explanations
- procedures
- decisions
- commands
- examples
- warnings
- references

Remove:

- repeated information
- unnecessary conversation
- temporary reasoning
- failed attempts without learning value
- unrelated context

Never invent information.

If essential information is missing, ask the user before generating the document.

---

# Storage

Folder

lesson2learn/

Filename format

YYYY-MM-DD_HH-MM-SS-short-title.md

Filename rules

- generated automatically
- lowercase
- replace spaces with "-"
- remove accents
- remove punctuation
- remove special characters
- maximum 60 characters
- based only on the documented topic

Example

2025-07-09_18-42-31-docker-bind-mounts.md

---

# Output Rules

Return only the Markdown document.

Do not include explanations before or after it.

Generate only sections that contain useful information.

Never generate empty headings.

Maintain consistency between the Frontmatter metadata and the document content.

---

# Markdown Template

---
title:
category:
created:
tags:
source:
status: completed
---

# Title

## Context

## Main Content

## Steps

## Commands

## Examples

## Common Mistakes

## Best Practices

## References

---

# Categories

Select exactly one.

- Learning
- Mistake
- Procedure
- Decision
- Architecture
- Command
- Idea
- Reference

---

# Configuration

Activation:
  Manual Only

Automatic Detection:
  Disabled

Output:
  Markdown

Style:
  Technical

Verbosity:
  Medium

Summarization:
  Enabled

Classification:
  Automatic

Ask Before Saving:
  False

---

# Examples

Example

User:

Documenta este error.

Result

A Markdown document describing only the selected error.

---

Example

User:

Guarda este aprendizaje sobre Docker volumes.

Result

A Markdown document describing only Docker volumes.

---

Example

User:

Resume esta conversación.

Result

The conversation is summarized only because the user explicitly requested it.

---

# Dependencies

None.