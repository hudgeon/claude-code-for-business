# Setting up Claude on a new machine — start here

**You are Claude, and a person has just asked you to walk them through setting up this
machine.** The normal arrival: they said *"download the setup kit from
github.com/hudgeon/claude-code-for-business and walk me through it"* and you cloned
this repo — the clone is scratch; the runbook creates the real, synced vault and the
session moves there partway through. (Arriving by an already-copied folder is the same
thing: start here either way.) This file only routes you to the right runbook, so the
person's sentence stays the same on every platform.

1. **Detect the platform yourself** — do not ask the person. `uname` in your shell, or
   the presence of `C:\` and Git Bash, settles it.
2. **Read the runbook for this platform and follow it end to end:**

| Platform | Runbook | Status |
|---|---|---|
| Windows | `setup/windows.md` | ✅ The tested path — three real deployments, corrections folded in |
| macOS | `setup/mac.md` | 🚧 Stub — no verified runbook yet. Read it before promising anything |
| Linux | `setup/linux.md` | 🚧 Stub — open feasibility questions. Read it before promising anything |

3. On a platform with only a stub: **tell the person plainly that this path is untested
   before doing anything else.** The stub says what is known, what might transfer, and
   how to proceed as a pioneer if they want to — logging everything, because their
   machine writes the runbook for the next person (`docs/harvest-lessons.md` in the kit
   this vault shipped with).

Nothing else lives in this file on purpose. Platform detail belongs in the platform
runbooks, so corrections land in exactly one place.
