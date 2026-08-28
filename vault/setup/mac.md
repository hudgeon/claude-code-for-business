# macOS setup — stub. No verified runbook yet.

**Status: not yet written.** Nobody has run this kit end to end on a Mac. Say that to
the person before doing anything.

## What already exists

The Windows runbook (`setup/windows.md`) carries **[Mac]** variants inline at the steps
that differ, written during its drafting but **never executed on a real machine**:

- Library discovery: no registry — look under `~/Library/CloudStorage/` (A3).
- Pinning: one genuine right-click — the folder → **Download Now** (A4).
- Microsoft 365: **now platform-neutral.** The primary path connects through the
  app's own Settings → Connectors screen (A7), identical on a Mac. Only the appendix's
  self-hosted fallback differs: a Mac cannot run its `cmd /c` wrapper — a user-scope
  `ms365` entry in `~/.claude.json` with `"command": "npx"` overrides the shared file.
- The PDF tool works unchanged — it falls back from Edge to Chrome, `$TEMP` is
  `$TMPDIR` (A9; the tool itself is verified on macOS).
- Everything in Part B — sign-in, the checks, writing rules, the sent-mail pass, the
  today file, one real job — is platform-neutral as written.

## What is genuinely unknown

- Whether the Code tab's Git requirement is satisfied out of the box (macOS ships a
  `git` shim that prompts to install Xcode command-line tools — that prompt mid-install
  is exactly the kind of ambush the Windows runbook exists to prevent).
- Whether Node needs installing at all, and the no-admin unpack path on macOS.
- The per-machine MCP approval (`enabledMcpjsonServers`) — only relevant on the
  appendix's self-hosted path; the primary connector path has no such step on any
  platform.

## If the person wants to proceed anyway

Run `setup/windows.md` as the spine, taking every **[Mac]** branch, translating shell
commands as you go — and **log every deviation in `install-logs/` exactly as the
runbook's template asks.** A pioneer run that is fully logged becomes this file's first
real content. Fold what you learn back here, replacing this stub section by section,
with the ❌ convention for anything the [Mac] flags got wrong.
