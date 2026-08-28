# Linux setup — stub. Feasibility questions first.

**Status: not started, and further away than macOS.** Three questions decide whether
this kit's design works on Linux at all — answer them before writing any runbook:

1. **The synced library.** The kit's keystone is the shared vault as a SharePoint
   library synced to a local folder. **There is no official OneDrive sync client for
   Linux.** Third-party options (rclone mount, onedriver) exist but change the
   conflict-and-sync behaviour the whole rulebook is written around — the silent-
   overwrite protections assume the official client's semantics.
2. **The app surface.** The kit assumes the Claude Desktop app's Code tab — including
   for connecting Microsoft 365, which happens in the app's own Connectors screen.
   Verify current Linux availability before promising the same experience; the CLI is
   the likely surface, which changes both the "nobody opens a terminal" promise and
   the connector story fundamentally.
3. **The audience.** A Linux-running user is probably not the non-technical person this
   kit is written for. It may be righter to point them at Claude Code's own docs than
   to adapt this kit.

If all three resolve, the platform-neutral parts (Part B of `setup/windows.md`, the
rulebook, the PDF tool with `VAULT_BROWSER_PATH` pointed at a Chromium) are the
starting material. Log any pioneer attempt per `docs/harvest-lessons.md` and replace
this stub with what actually happened.
