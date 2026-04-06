---
name: dependency-prioritizer
description: >
  Use this skill when the user asks to sort, organize, reorder, or clean up
  import statements in TypeScript or JavaScript files — even if they don't
  explicitly say "import order" or "dependency grouping". Apply it whenever
  you touch imports in any .ts or .js file in this project: group all
  third-party (npm/external) imports first, then all internal/local imports
  (paths starting with `@/` or relative paths), with exactly one blank line
  separating the two groups. Within each group, keep alphabetical order by
  package/path name.
---

# Dependency Prioritizer

Sorting imports helps developers instantly tell **external dependencies** (third-party npm packages) apart from **internal domain logic** (local modules). This makes the dependency graph scannable at a glance and reduces cognitive overhead when reading unfamiliar files.

## When to use this skill

- Any time you create or modify imports in a `.ts` or `.js` file.
- Any time the user requests "clean up imports", "sort imports", "organize imports", or similar.
- When reviewing code, proactively reorder imports if they are not already following this convention.

## Import order convention

```
[Third-party packages]
<blank line>
[Internal imports]
```

### Group 1 — Third-party packages

All packages installed via npm (i.e. resolved from `node_modules`). These are imports whose path does **not** start with `@/`, `./`, or `../`.

Common examples: `@nestjs/*`, `class-transformer`, `class-validator`, `@faker-js/faker`, `reflect-metadata`, etc.

### Group 2 — Internal imports

All project-local modules. These are imports whose path starts with `@/` (TypeScript path alias) **or** a relative path (`./` / `../`).

Within this group, sort alphabetically by the full import path.

## Sorting rules (within each group)

Sort entries **alphabetically** by the module specifier (the string inside quotes), case-insensitive. Ignore the leading `@` when comparing scoped packages.

## Blank lines

- Exactly **one** blank line between the two groups.
- No blank lines within a group.
- Leave one blank line after the last import before the first non-import line (e.g. the first `const`, `@Decorator`, or `export`).

## Step-by-step procedure

1. **Identify all import statements** at the top of the file.
2. **Classify** each import:
   - Path does NOT start with `@/`, `./`, `../` → third-party
   - Path starts with `@/`, `./`, or `../` → internal
3. **Sort each group** alphabetically by module specifier.
4. **Write out** the groups in order: third-party → blank line → internal.
5. **Verify** no import was dropped, added, or renamed.

## Worked example

**Before**

```typescript
import { faker } from '@faker-js/faker';

import { DatabaseDto } from '@/common/database/dtos/database.dto';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { DeviceResponseDto } from '@/modules/device/dtos/response/device.response.dto';

import { SessionModel } from '@/modules/session/models/session.model';
```

**After**

```typescript
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { faker } from '@faker-js/faker';

import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { DeviceResponseDto } from '@/modules/device/dtos/response/device.response.dto';
import { SessionModel } from '@/modules/session/models/session.model';
```

> **Explanation**:
> - `@nestjs/swagger`, `class-transformer`, `@faker-js/faker` → third-party, sorted alphabetically (`nestjs` < `class` would normally put `class` first — but sort ignores the `@` prefix so: `faker-js` → f, `nestjs` → n, `class-transformer` → c → final order: `class-transformer`, `faker-js`, `nestjs`).
> - `@/common/…`, `@/modules/device/…`, `@/modules/session/…` → internal, sorted by full path.

## Gotchas

- **`@/` vs `@scope/`**: An import like `@/common/foo` is **internal** (project alias). An import like `@nestjs/common` is **third-party** (scoped npm package). The distinguishing character is the slash immediately after `@` with no package name before it.
- **Do not split named imports**: If a single `import { A, B, C }` statement spans multiple lines, treat it as one import entry — do not break it apart.
- **Side-effect imports** (`import 'reflect-metadata'`): Treat as third-party if the path has no `@/` or relative prefix. Keep them at the very top of the third-party group.
- **Re-exports**: `export { … } from '…'` statements follow the same grouping rules when they appear at the top of a barrel/index file.
- **Don't change anything else**: Only reorder the import block. Do not modify imported symbol names, aliases, or the rest of the file.
