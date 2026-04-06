---
name: prisma-relation
description: >
  Use this skill when the user asks whether a Prisma relation needs an explicit
  name, how to fix "ambiguous relation" or "missing opposite relation field"
  errors (P1012), or how to properly wire bidirectional @relation() decorators
  in schema.prisma. Also activate when the user is adding a new relation between
  two models, reviewing existing relations for correctness, or getting Prisma
  validate/format errors related to relation naming.
---

# Prisma Relation Naming

A decision framework for when to name a Prisma relation and how to do it correctly.

## When to use this skill

- User asks: "Do I need `@relation("...")`?"
- Prisma throws `P1012`: "Ambiguous relation detected" or "missing an opposite relation field"
- A new relation is being added between two models that already share a relation
- Reviewing a schema to remove unnecessary named relations
- Self-referential model relations

---

## Core Rule

| Condition | Decision |
|---|---|
| **Only one** link between Model A and Model B | ❌ No name needed — Prisma resolves it automatically |
| **Two or more** links between Model A and Model B | ✅ Must name — each link must have a unique name on **both** sides |
| Model references **itself** (self-relation) | ✅ Must name |

---

## Step-by-step procedure

1. **Count links between the two models.**
   For each field on Model A that points to Model B, count it. Do the same from B → A.
   If the total unique connections is 2 or more, you must use named relations.

2. **If naming is required**, choose a name that:
   - Uses **PascalCase**
   - Describes the **semantic role** of the relationship — not just the field name
   - Is **unique** within the schema
   - Good pattern: `"SubjectVerb"` or `"SubjectRole"` — e.g., `"AuthorPosts"`, `"ModeratorReviews"`, `"SessionRevokedBy"`

3. **Apply the name on BOTH sides** — the array side and the FK (scalar) side must use the exact same string.

4. **If naming is NOT required**, remove `@relation("...")` entirely. Keep only `@relation(fields: [...], references: [...])` on the FK side.
   - Unnecessary names create maintenance burden and can cause desync errors when schema evolves.

5. **Validate** with `npx prisma format` before running `npx prisma generate`.

---

## Worked examples

### ✅ Case 1 — Single link (NO name needed)

**Scenario:** `User` has many `posts`. One direction, one field.

```prisma
model User {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  posts Post[]
  // No @relation name — Prisma resolves automatically
}

model Post {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  authorId String @db.ObjectId
  author   User   @relation(fields: [authorId], references: [id])
  // No @relation name needed
}
```

---

### 🚨 Case 2 — Two links between same models (MUST name)

**Scenario:** `User` can send and receive `Message`s — two distinct links.

```prisma
model User {
  id               String    @id @default(auto()) @map("_id") @db.ObjectId
  sentMessages     Message[] @relation("MessageSender")
  receivedMessages Message[] @relation("MessageReceiver")
}

model Message {
  id         String @id @default(auto()) @map("_id") @db.ObjectId
  senderId   String @db.ObjectId
  sender     User   @relation("MessageSender",   fields: [senderId],   references: [id])
  receiverId String @db.ObjectId
  receiver   User   @relation("MessageReceiver", fields: [receiverId], references: [id])
}
```

---

### 🚨 Case 3 — Two roles, one model: owner and revoker (MUST name)

**Scenario:** `Session` belongs to a `User` AND can be revoked by another `User`.

```prisma
model User {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  sessions        Session[] @relation("SessionOwner")
  revokedSessions Session[] @relation("SessionRevoker")
}

model Session {
  id          String  @id @default(auto()) @map("_id") @db.ObjectId
  userId      String  @db.ObjectId
  user        User    @relation("SessionOwner",   fields: [userId],      references: [id])
  revokedById String? @db.ObjectId
  revokedBy   User?   @relation("SessionRevoker", fields: [revokedById], references: [id])
}
```

---

### 🚨 Case 4 — Self-relation (MUST name)

**Scenario:** `Category` has a parent `Category`.

```prisma
model Category {
  id       String     @id @default(auto()) @map("_id") @db.ObjectId
  parentId String?    @db.ObjectId
  parent   Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children Category[] @relation("CategoryTree")
}
```

---

## Naming convention

Use `PascalCase`. Prefer **role/action-descriptive** names over generic ones.

| ❌ Avoid | ✅ Prefer |
|---|---|
| `"UserSession1"` | `"SessionOwner"` |
| `"Relation1"` | `"MessageSender"` |
| `"UserCareRecords"` (redundant if single link) | *(no name needed)* |
| `"UserSentMessage"` and `"UserSentMessage2"` | `"MessageSender"` / `"MessageReceiver"` |

---

## Gotchas

- **Names must match exactly on both sides** — a single character difference causes `P1012`. Run `npx prisma format` to catch it immediately.
- **Removing a name on one side without removing it on the other** causes "missing opposite relation field" errors.
- **Do not add names "for clarity" on single-link relations** — it adds noise and creates a maintenance trap when schema evolves.
- **Every named relation needs both sides declared** — if you add the name to the array side in Model A, you must also add it to the FK side in Model B.
- **For MongoDB with Prisma**, every String foreign-key field must be annotated with `@db.ObjectId` — this is separate from relation naming but a common co-occurring mistake.
- **Self-relations in MongoDB** require `@relation(fields: [...], references: [...])` on one side and the array on the other, both with the same name.
- **`npx prisma format` auto-removes whitespace and reorders** — always review the diff before committing after running it.
