---
name: skill-creator
description: >
  Use this skill when the user asks you to create a new skill, write a SKILL.md
  file, or add a skill to the project — even if they only give a short description
  of what the skill should do. This skill provides the full format specification,
  best practices, and a worked example so you can generate a well-structured
  SKILL.md from scratch.
---

# Skill Creator

This skill gives you everything you need to author a new **Agent Skill** for this project. An Agent Skill is a self-contained folder with a `SKILL.md` file that teaches AI agents a specialized workflow, convention, or domain process.

## Skill folder structure

```
skills/
└── <skill-name>/
    ├── SKILL.md          ← Required. Contains metadata + full instructions.
    ├── scripts/          ← Optional. Executable scripts the skill may reference.
    ├── references/       ← Optional. Extra docs / deep-dive references.
    └── assets/           ← Optional. Templates, images, sample data.
```

Create the folder at `skills/<skill-name>/` and write `SKILL.md` inside it.

---

## SKILL.md format

A `SKILL.md` has two parts: a YAML **frontmatter** block at the top, then a **Markdown body** with the full instructions.

### Frontmatter (required fields)

```yaml
---
name: <kebab-case-identifier>
description: >
  Use this skill when <user intent / trigger condition>.
  Even if they don't explicitly mention <domain term>.
  <One or two extra sentences covering edge-case triggers.>
---
```

**`name`** — short, kebab-case, unique within the project.

**`description`** — this is what the AI reads at startup to decide whether to activate the skill. Rules for writing it:
- Use **imperative** phrasing: *"Use this skill when…"*, not *"This skill does…"*
- Focus on **user intent**, not internal mechanics.
- Be **slightly pushy** — list edge cases where it still applies even if the user doesn't say the keyword.
- Keep it under **1 024 characters** (hard limit).

Optional frontmatter fields:
- `allowed-tools: Bash(cmd:*) Read` — restrict which tools the skill may use.

### Markdown body (required)

Structure the body with these sections (adapt as needed):

```markdown
# <Skill Display Name>

One-sentence purpose statement.

## When to use this skill
Bullet list of trigger scenarios.

## Step-by-step procedure
Numbered list. Each step is a concrete action.

## Worked example
Before / After or Input / Output with code blocks.

## Gotchas
Bullet list of non-obvious edge cases, traps, and exceptions.
```

---

## Best practices

| Principle | Do | Don't |
|---|---|---|
| **Add what AI lacks** | Jump straight to domain-specific detail | Explain general concepts AI already knows |
| **Defaults, not menus** | "Use pdfplumber. Fall back to pdf2image for scans." | "You can use pypdf, pdfplumber, or pdf2image…" |
| **Procedures > declarations** | Step-by-step numbered workflow | Static declarative description |
| **Moderate detail** | Enough to prevent mistakes | Exhaustive prose that bloats context |
| **Validation loop** | Include a "verify / check" step | Let AI run blind with no self-check |
| **Honest gotchas** | Surface real edge cases from domain expertise | Leave traps undocumented |

---

## Step-by-step procedure (how to create a new skill)

1. **Understand the domain** — Ask yourself: what does the user want the AI to reliably do? What are the non-obvious rules or conventions?
2. **Pick a name** — Use `kebab-case`. It should be a noun or noun-phrase describing the capability (e.g. `dependency-prioritizer`, `dto-generator`).
3. **Create the folder** — `skills/<skill-name>/` (relative to the project root).
4. **Write the description** — Craft the `description` field first. It must cover enough trigger phrases to activate reliably without being so broad it activates everywhere.
5. **Write the body** — Follow the section template above. Start with *When to use*, then the *Step-by-step procedure*, then a *Worked example*, then *Gotchas*.
6. **Include a worked example** — Use real code or real data from this project, not contrived toy examples.
7. **List gotchas** — At least 2–3 non-obvious rules, edge cases, or project-specific conventions.
8. **Review** — Re-read the description and ask: would this trigger on relevant prompts? Would it NOT trigger on unrelated prompts?

---

## Worked example

**User says:** *"Hãy tạo skill `dto-generator` — mục đích là giúp AI sinh ra DTO class NestJS đúng pattern của project."*

**You produce:**

```
skills/dto-generator/SKILL.md
```

```yaml
---
name: dto-generator
description: >
  Use this skill when the user asks to create, scaffold, or generate a DTO
  (Data Transfer Object) class in NestJS — even if they just say "tạo DTO"
  or describe the fields they need. Apply the project's standard DTO patterns
  including Swagger decorators, class-transformer, and validation.
---
```

```markdown
# DTO Generator

Generate NestJS DTO classes that follow this project's conventions.

## When to use this skill
- User asks to create a request or response DTO.
- User describes a set of fields and asks for a class.

## Step-by-step procedure
1. Identify whether it is a request DTO or response DTO.
2. ...

## Gotchas
- Response DTOs must use `@Expose()` from class-transformer.
- ...
```

---

## Gotchas

- **The `description` field triggers activation** — if it is vague or too short the skill will be ignored. Write it last, after you fully understand the domain.
- **Do not explain general TypeScript or NestJS basics** — the AI already knows them. Only document project-specific conventions and non-obvious rules.
- **Worked examples must use real project paths** — e.g. `@/common/database/dtos/database.dto`, not `path/to/dto`.
- **One skill = one coherent domain** — don't bundle unrelated concerns into a single skill. If two topics feel unrelated, make two skills.
- **The `skills/` folder lives at the project root** — do not place skill folders inside `backend/`, `frontend/`, or any sub-package.
