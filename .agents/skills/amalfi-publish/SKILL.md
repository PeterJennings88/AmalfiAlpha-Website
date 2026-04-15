---
name: amalfi-publish
description: Publish the approved Amalfi Alpha website from this repository to the linked Vercel production project. Use when the user asks to publish, deploy, ship, push live, or update the public Amalfi Alpha site after approving the local version.
---

# Amalfi Publish

## Overview

Publish the current state of this repository to the linked Vercel production project only after the user explicitly approves the local version. Use the scripted flow so deployment stays consistent across Codex sessions.

## Workflow

1. Confirm the user explicitly wants the currently approved local version published. If approval is missing, ask for it before running anything live.
2. Read `references/project-context.md` if you need the project name, Vercel IDs, domain target, or current deployment notes.
3. Run `scripts/publish.sh --check` to verify the Vercel link, CLI access, and account login without deploying.
4. Run `scripts/publish.sh` to create the production deployment.
5. Report the deployment URL back to the user. If `amalfialpha.com` is not attached in Vercel yet, say that plainly and share the returned `vercel.app` URL.

## Guardrails

- Treat this as a production action. Never publish without explicit approval in the current conversation.
- Do not sneak in unrelated code edits during the publish step.
- Stop and explain the issue if the Vercel CLI is not logged in or the directory is no longer linked to the expected project.
- Keep local preview and local editing separate from production publishing. If the user wants a preview first, do that before using this skill.

## Commands

- Check readiness: `scripts/publish.sh --check`
- Publish to production: `scripts/publish.sh`

## Notes

- `scripts/publish.sh` resolves the repo root automatically, so it can be run from the skill folder or from the project root.
- The script uses `npx` with a pinned Vercel CLI version so it does not depend on a global `vercel` install.
