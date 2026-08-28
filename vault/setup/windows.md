# Setting up Claude on a new Windows machine

**Setup version 1.5 — 2026-08-28.** Write this number in the install log for this
machine. (1.5 over 1.4: **Microsoft 365 now connects through the app's own Connectors
screen — the official connector — instead of a hand-written config file.** The
deployments this kit came from moved to it during their first week, and the config-file
path's three worst failure modes — the per-machine silent approval, device-code codes
expiring, Node as a connector dependency — do not exist on it. The self-hosted path
survives in the appendix. 1.4 restructured the kit for platforms; no procedure changed.)

This version is rewritten from three lessons-learned reports covering the first three
machines (one first, two more four days later) plus the week of real use that followed. Where a
step changed, the old instruction is struck through with ❌ and the reason is stated —
never delete a correction, or it gets re-derived from scratch.

**Everything below has now run on real machines.** v1.1 had eleven unverified claims;
nine are settled and recorded at the bottom. What remains unverified is marked inline.

---

## 🔴 Read this first — the rule that outranks every step below

**Five separate lookups told us the machine was broken when it was fine.** Not one bug
with five faces. Five different checks, each confidently wrong, across three machines:

| The lookup | What it said | The truth |
|---|---|---|
| Registry sync-root check | Vault not synced | It was there, added by the shortcut route, which registers no sync root |
| The library listing through Graph | Folder holds one item, then zero children | A shortcut is invisible to that interface. The files are on disk |
| A path copied from another machine's log | No such folder | Right folder, different folder name — the name differs per machine inside one tenant |
| The folder picker after the restart | Opened a different path than the one typed | Same folder. Proven by matching file id and checksum |
| Your own tool list | No tools, so the config failed to sync | Config synced perfectly. A per-machine approval was missing |

**Enumerate, never predict. Never treat a lookup as evidence about the thing itself.**
When a check says something is missing, go and look at the thing.

**Corollary, learned three separate ways in one week:** a tool list read before a
permission change does not describe what exists after it. Re-enumerate after any grant.

A stranger working alone meets one of these and stops. So does the person sitting next to
you, unless you say out loud what you are doing and why.

---

## 🔴 Shell reality — the failure that cost the first machine its opening hour

Git for Windows is a hard requirement for the Code tab, so **Git Bash is always present
and your Bash tool runs there.**

**`cmd.exe /c '…'` IS BROKEN IN GIT BASH AND FAILS SILENTLY.** The shell rewrites a lone
`/c` into the drive path `C:/` before cmd ever sees it, so cmd opens interactively, runs
nothing, prints a banner and exits cleanly. **Success and failure look identical.** Every
command of that shape in v1.1 was broken the same way, starting with the very first one.
This is the most dangerous class of failure in the whole record.

- Write **`cmd.exe //c '…'`** — the doubled slash survives the translation.
- Better: **use PowerShell instead**, and keep the `-Command` string in SINGLE quotes.
  In Git Bash, double quotes let *bash* expand `$_` and `$Variables` before PowerShell
  sees them, and the command mangles silently.
- **Never put a Windows path literal inside a script invoked from this shell.** The
  separators are stripped and the literal matches nothing. On machine 3 this was caught
  only because the script had its own guard and aborted before writing.

Two more mechanical traps, both real:

- **Multi-line text containing apostrophes breaks the shell.** It happened on three
  separate days. Write the file directly instead of pushing it through a heredoc.
- **Tool inputs are rejected for unescaped Windows path separators.** Use forward
  slashes in tool arguments; the OS accepts them everywhere that matters.

One quirk worth knowing: the desktop app inherits Windows user and system environment
variables but **does not read PowerShell profiles**.

---

## Before the day — and before the team

These decided how the first three installs went. Do them days ahead, not on the
morning.

### 1. The admin work. This is where a person working alone gives up.

Asked where they would have stopped doing this alone, the CEO did not pick a command or a
dialog. They picked **"at the access requests"** — the point where progress depends on
someone else approving something. Their one change to the whole process: *"sort the IT
access upfront."*

Everything the admins must do is one page — **`docs/microsoft-365-admin-setup.md` in the
kit this vault shipped with.** Send it days ahead. The short version:

- **Claude org admin:** add the Microsoft 365 connector to the workspace
  (Organization settings → Connectors).
- **Entra Global Administrator:** the one-time tenant consent — until it is granted,
  every user who clicks Connect sees *"approval required — your admin has been
  notified"* and is stuck. A real deployment lost most of a group session to exactly
  this screen.
- **Write tools enabled, then `Mail.Send` revoked on the connector's enterprise app.**
  Drafting is a write capability and the write set includes sending — they cannot be
  separated at consent time, so the sequence is consent-then-revoke. 🔴 This revocation
  is the whole safety model. B3 tests it empirically.
- **Conditional Access check:** connector traffic comes from Anthropic's IP range, so
  a sign-ins-only-from-our-network policy blocks it for everyone. Ask now.
- **Written confirmation of who is enabled, naming the people.** "Reported done" with
  no record produced a stall that was nobody's fault and everybody's problem.

❌ *v1.4 asked IT for a custom single-tenant app registration with device-code sign-in
here (`Mail.ReadWrite` + `Files.ReadWrite`, never `Mail.Send`, and the
`Calendars.ReadWrite`-not-`.Shared` trap that cost four days). That path still works and
lives in the appendix — but it is the fallback now, not the ask. Do not reinstate it as
the default: its per-machine failure modes are the worst in this file's history.*

### 1b. Confirm they have a paid seat, assigned to them, before the day.

**A Code-tab upgrade prompt at sign-in means that person's seat is not assigned — the
account, not the app.** Nothing in the runbook fixes it and the session stalls there.

🔴 **Do not assume the person who administers the subscription can fix it on the day.** On
machine 1 the stall outlived the session: the person holding the top role still could not
complete the upgrade, because there is no self-elevation path by design, and the vendor's
own documentation disagrees with itself about which role can do what. Settle it days
ahead, and have someone confirm in writing that the seat is assigned to this person.

### 2. Ask them what they actually want handed over.

Asked what they expected to be asked and never was, the CEO answered: **"what you actually
wanted help with."** The procedure asks about permissions, folders and file formats. It
never asks what the person wants.

And the corollary from machine 3: **the jobs chosen at setup are not the jobs that stick.**
Three template-shaped tasks were picked as ideal starters — high-frequency, nothing
sensitive. Five days later all three were still done by hand, while what actually stuck
was an unplanned data clean-up nobody had scheduled. So ask, write the answer down, and
on the day **let them bring their own first job** (B7).

### 3. One person first — set up, working, and VERIFIED — then the rest, then the team

**Never run setup as a group session.** On the real deployments, a whole group meeting
disappeared into connector triage, three people watching one screen being debugged. The
rollout order that works:

1. **First install: one person, one-on-one, days before anything else.** Not merely
   installed — **working and verified**: the connector reads their mail, a real draft
   sits in their Drafts folder, their writing rules and signature are captured, one
   real job of theirs is finished, and they have seen the evidence for each of those,
   not been told about them. The first machine surfaces every environment-level
   problem — app assignment, seats, sign-in policy, missing consents. Fix them once,
   with one person, instead of three times in a room.
2. **Then a day or two of real use before the next machine.** The gremlins that matter
   (dropped tokens, the approval dance after a scope change) show up in use, not at
   install. Machine 1's shaken-out config is what makes machines 2..n fast — that only
   pays if machine 1 is actually right.
3. **Then the remaining machines, one at a time, never interleaved.** One person's
   session gets finished and verified before the next begins.
4. **Any later permission or scope change: one person tests it end to end before it
   rolls to the group.** A change pushed to everyone at once logged all three users out
   at the same moment, on the same morning.
5. **The team's first group session about Claude happens only when every machine
   works — and it is for getting real work done, not configuration.** Config in a
   group is frustration multiplied by the number of people watching.

---

## How to run this session — read this part twice

**You are setting up a senior non-technical person.** The measure is not whether the
install works. It is whether they would describe it afterwards as easy.

- **Open by saying what will happen**, in three short sentences: you'll connect Claude to
  their email and files (about 20 minutes, mostly you working), they sign in once in a
  browser, then Claude shows them something useful about their own week.
- **Tell them the full list of what they will be asked to do, up front**, so nothing
  ambushes them. It is short: approve one or two prompts, sign in once, glance at Outlook
  once, and pick one real job. Everything else is you.
- **One step at a time.** One plain sentence about what you are doing, then do it. Never
  paste terminal output at them; translate it. Say "I'm connecting Claude to your email",
  not "registering the MCP server".
- **Never ask them to find, navigate, copy, paste or type anything you can do yourself.**
  Every question must be answerable with yes, no, or a pick from a short list you supply.
- **Say out loud when a check looks like a failure and isn't.** See the appendix of
  expected noise. Three of the four things that shook people's confidence were normal
  output nobody had told them to expect.
- **If something fails, stop and say so plainly.** Do not improvise a workaround, do not
  try a different command that "should also work", and do not skip ahead. Write what
  happened in the log. A failure here is information the next install needs.
- 🔴 **Log every single time a human helps.** On all three runs so far there was an
  expert in the room. A stranger has nobody. A run that "went fine" because someone
  leaned over and fixed something is a run that failed for our purposes.

**How long it takes:** about 20 minutes of preparation with the person mostly watching,
then sign-in and checks. Machine 2's person described it, unprompted, as *"quick, and
mostly watching rather than doing."* That is the target.

---

## Before starting — confirm the admin work is done

**The primary path needs no IDs, no config files and no fill-in blanks** — Microsoft
365 connects through the app's own Connectors screen. What it does need is the admin
work from `docs/microsoft-365-admin-setup.md` finished: connector added to the workspace,
tenant consent granted, write tools on, `Mail.Send` revoked. **If you cannot confirm
that (a written confirmation naming this person is the standard), say so before doing
anything else** — Part A can run regardless, but B2 will stall at an "approval
required" screen, and finding out at sign-in wastes the person's patience at the worst
moment.

❌ *v1.4 had a two-ID fill-in block here for the self-hosted app registration. It moved
to the appendix with the rest of that path.*

❌ *v1.1 also had a `SHAREPOINT_LIBRARY` blank here, and the step that needed it assumed
it was already known. On machine 1 it was left empty and recovered only by finding the
tenant address in a browser bookmark. Without that bookmark there was no way forward. The
field is gone: A3 now enumerates instead of asking you to know. Do not reinstate.*

**Settled on three machines, so stop worrying about it: no administrator rights are
needed anywhere in Part A.** The runtime install, the execution-policy change and the
pin all completed with no elevation and no prompt, three times.

---

# Part A — preparing the machine (you do all of this)

## A1 — Confirm where you are

If you are reading this, both hand prerequisites are already met — the desktop app is
installed on a paid plan, and Git for Windows is present. Each proved itself by letting
this session start at all.

**Node is the one thing that has not proved itself**, because the session runs perfectly
well without it and only the document-to-PDF tool cares (A9 — and the self-hosted
connector in the appendix, if that path is ever used). The `npx` check is the test, A1b
is the fix.

Note the machine facts for the log, quietly. **Note the doubled slash — see the shell
rule above.**

```
cmd.exe //c "git --version"
```
```
cmd.exe //c "npx --version"
```
```
powershell.exe -NoProfile -Command '$PSVersionTable.PSVersion'
```

**Check the output is real.** If a command prints a shell banner, a copyright line, or
nothing at all, it did not run — that is the `/c` failure, not a missing tool.

**If `npx --version` fails, that is expected on a fresh machine — go to A1b.** Do not
carry on without it: the PDF tool cannot run without Node, and the failure would
otherwise surface weeks later, at the first *"turn this into a PDF"*, long after the
cause.

If PowerShell reports 5.1, keep two things to yourself: `&&` does not work there (run
things one at a time), and some of its write commands add a byte-order mark that corrupts
JSON. The person never needs to hear any of this.

**Two things are not on these machines and nobody mentions them:** Python and
LibreOffice. If a job needs Python, use the JavaScript runtime instead. If you generate a
Word document, you cannot render it locally to check it by eye — say so rather than
implying you looked.

## A1b — Install Node yourself, if `npx` was missing

Skip entirely if `npx --version` already printed a version.

Node is needed by the document-to-PDF tool, not by Claude and not by the Microsoft 365
connector. **Install it without admin rights and without any prompt for them**, by
unpacking the official build into their own profile. Tell them only: *"I'm installing one small component the email connection needs
— a couple of minutes."*

✅ **Verified twice, about three minutes each, no prompts, no elevation.**

**1. Find the current LTS.** Fetch this and read it yourself — take the newest entry whose
`lts` field is not `false`, and use that version string (it looks like `v24.19.0`) below:

```
curl -fsSL https://nodejs.org/dist/index.json
```

**2. Download it** (substitute the version in both places):

```
curl -fsSL -o "$HOME/node-lts.zip" "https://nodejs.org/dist/VERSION/node-VERSION-win-x64.zip"
```

**3. Unpack it into their profile and give it a stable name** (substitute the version once):

```
powershell.exe -NoProfile -Command 'Expand-Archive -Path "$env:USERPROFILE\node-lts.zip" -DestinationPath "$env:LOCALAPPDATA\Programs" -Force; Remove-Item "$env:LOCALAPPDATA\Programs\nodejs" -Recurse -Force -ErrorAction SilentlyContinue; Rename-Item "$env:LOCALAPPDATA\Programs\node-VERSION-win-x64" "nodejs"'
```

**4. Put it on their PATH** — user scope, so no admin and no User Account Control prompt:

```
powershell.exe -NoProfile -Command '$n="$env:LOCALAPPDATA\Programs\nodejs"; $p=[Environment]::GetEnvironmentVariable("Path","User"); if ($p -notlike "*$n*") { [Environment]::SetEnvironmentVariable("Path","$p;$n","User") }; Write-Output "PATH now includes $n"'
```

**5. Prove it works**, by full path — the PATH change has not reached this session and
will not until the app restarts:

```
cmd.exe //c "%LOCALAPPDATA%\Programs\nodejs\npx.cmd --version"
```

That must print a version. Then tidy up:

```
rm -f "$HOME/node-lts.zip"
```

⚠️ **If they happen to be a local administrator**, `winget install -e --id
OpenJS.NodeJS.LTS` is quicker. Do not lead with it: the Node package has no user-scope
option, so on a standard account it raises a box asking for an **administrator's
password** — which they do not have, and which is never something to type on their behalf.

## A2 — PowerShell execution policy

Tell them: *"I'm changing one Windows setting so scripts can run — it's the standard
setting, and it only affects your account."* Then:

```
powershell.exe -NoProfile -Command 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; Get-ExecutionPolicy -Scope CurrentUser'
```

Must print `RemoteSigned`. ✅ No elevation, three machines. Nothing in this file runs a
`.ps1`, so this is insurance for later automation — but on another deployment its absence
read as random permission bugs for roughly two months before anyone found the cause.

## A3 — Find the synced library yourself, by enumerating

Do **not** ask them to go looking in File Explorer, and do **not** copy a path out of
another machine's log. 🔴 **The OneDrive folder name differs per machine inside one
tenant, and the subfolder layout differs too.** A path that worked on the last machine is
the third of the five wrong lookups.

**There are two ways a shared library arrives on a machine, and they hide in different
places. Both are real. Neither is universal.**

| Route | Where it shows | Machines seen |
|---|---|---|
| **Sync** button on the library | Registers a sync root in the registry | Machine 2 — found first try |
| **Add shortcut to OneDrive** | Registers nothing. Appears only as a folder on disk | Machine 1 — the registry check found nothing and the library was there all along |

So run both checks, and believe the disk over either one.

```
powershell.exe -NoProfile -Command 'Get-ChildItem "HKCU:\Software\SyncEngines\Providers\OneDrive" -ErrorAction SilentlyContinue | ForEach-Object { Get-ItemProperty $_.PSPath } | Select-Object MountPoint, UrlNamespace | Format-List'
```

```
powershell.exe -NoProfile -Command 'Get-ChildItem $env:USERPROFILE -Directory | Where-Object { $_.Name -notmatch "^(Desktop|Documents|Downloads|Music|Pictures|Videos|Links|Favorites|Contacts|Searches|Saved Games|OneDrive)$" } | Select-Object FullName'
```

- **Something obviously the right library** → confirm in one sentence: *"Your files are
  synced at `<short name>` — I'll use that. OK?"*
- **Several** → offer a short list, they pick.
- **Nothing on disk either** → the library is genuinely not on this machine. This is the
  one File Explorer moment: ask them to open the library in their browser and use **Add
  shortcut to OneDrive** (not Sync — see below), then wait for it to appear.

🔴 **Prefer the shortcut route, and say so in the instruction.** Machine 1 invented it
because the person did not want a whole document library copied onto their laptop, and it
is the right default: it gives shared read and write on one folder with no permission and
no bulk download. ❌ *v1.1 knew only about the Sync button and argued the person out of
their own position by claiming syncing was effectively free. It was not — a third of
their files had already been pulled to disk, and a broad content search would have pulled
down thousands more. Corrected 21 Aug; do not reinstate.*

**Record the exact path in the log, and note which route produced it.**

❌ **A4 in v1.1 created a junction at `C:\Vault` so every machine reached the vault at the
same short address. That step is DELETED. Do not reinstate.** Three reasons, all
measured: the Windows folder picker resolves a directory link to its target, so the folder
you pick and the folder shown are different strings — which **manufactures a failure
signal on a perfectly working machine, one step after the person has been asked to trust
the process**. Both people on machines 2 and 3 named exactly this as the low point of
their week, and one named it as where they would have given up. And after all that, **no
session was ever proven to run on the short address, on any of the three machines.** It
cost confidence and bought nothing. Use the real synced path. Keep the tree two levels
deep with short kebab-case names, which is what the path budget actually needed.

## A4 — Pin the vault so it is really on the machine

OneDrive keeps files as placeholders that download on first open — fine for one file, bad
for searching across many, broken offline. Pin it yourself:

```
cmd.exe //c "attrib +p \"THE PATH FROM A3\""
```
```
cmd.exe //c "attrib +p \"THE PATH FROM A3\\*\" /s /d"
```

(Two commands on purpose: the first pins the folder object, the second recurses.)

If the vault folder does not exist yet (first machine in an organisation), do this at the
end of A6 instead.

⚠️ **Expected noise, on every machine:** `Not resetting hidden file - …desktop.ini`, and
an "online only" cloud icon still showing next to files immediately afterwards. **Both
are harmless.** Say so before they see it.

## A5 — Two Explorer fixes

**File extensions on.** Hidden extensions are how a note saved from Notepad becomes
`notes.md.txt` and silently disappears from every search. Warn them first — *"your desktop
will blink for a second"* — then:

```
powershell.exe -NoProfile -Command 'Set-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name HideFileExt -Value 0'
```
```
cmd.exe //c "taskkill /f /im explorer.exe & start explorer.exe"
```

**Check what opens `.md` files:**

```
powershell.exe -NoProfile -Command '(Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.md\UserChoice" -ErrorAction SilentlyContinue).ProgId'
```

⚠️ **Expected noise:** this returns things like `AppXkv2jqn1pq8ajm0p5dhgqde7aafykkrrn`,
which is neither empty nor obviously safe. **The rule that works: act only if the value
contains `Word`.** Anything else, move on.

If it does contain `Word`: Word will open markdown and mangle it on save, and Windows
deliberately blocks changing defaults from the command line — so this is a guided
three-click for them: right-click any `.md` file → **Open with** → **Choose another app**
→ **Notepad** → tick **Always**.

## A6 — Create the vault, or confirm it

**First machine in an organisation:** create the structure inside the synced library and
**move** the supplied files in — `CLAUDE.md`, `About\`, `tools\`.

🔴 **Move, never copy.** Machine 1 copied, and three diverging copies of the rulebook
existed for an hour before anyone noticed.

```
vault\
├── CLAUDE.md
├── About\
├── tools\pdf\
├── voice\drafts\
├── today\
└── install-logs\
```

**Later machine:** the vault synced down by itself — confirm `CLAUDE.md` is there and has
content, and move on.

🔴 **Any filename containing "conflicted copy" or a computer name → stop and say so.**

## A7 — Connect Microsoft 365 — in the app, not in a config file

**Settings → Connectors is the whole mechanism now.** No file is written, nothing is
installed, and there is nothing to sync — the connection is per person, made in the
app's own UI, against Anthropic's official Microsoft 365 connector that IT enabled
before the day.

Do it now, before the restart, so the restart can absorb it:

1. Have them click their name (bottom-left) → **Settings → Connectors**.
2. Find **Microsoft 365** → **Connect**. Their browser opens; they pick their work
   account and sign in as themselves. **They do the browser half — never touch a
   password.**
3. Expected on a healthy tenant: sign-in completes and the connector shows Connected.
4. **"Approval required — your admin has been notified" means the tenant consent from
   the pre-day list was not done.** Stop, say exactly that, and escalate on the
   existing ticket — it is not their error and not yours, and no amount of retrying
   moves it. Part A is still done and still useful; say so.

🔴 **Three field lessons about this screen, all paid for:**

- **The Connectors screen's Connected/Connect state can lag reality in both
  directions.** It showed "Connect" while tools worked, and "Connected" while they
  didn't. The tool list in a fresh session is the evidence; the screen is decoration.
- **A full quit is part of connecting.** After Connect (and after any reconnect), quit
  the app completely — system tray, or Task Manager killing every Claude process —
  then a NEW session. Half-quit apps kept stale tokens alive for days.
- **After ANY later permission change on the tenant, every user must disconnect,
  reconnect and fully restart.** A scope change logged all three users out at the same
  moment on a real deployment. That is why one person tests a change end to end before
  the group reconnects (pre-day rule 3).

❌ *v1.4's A7 wrote a `.mcp.json` config file for a self-hosted local server here, and
A8 then hand-edited a per-machine approval into `%USERPROFILE%\.claude.json` — the
worst silent failure in this file's history ("empty means never answered, not
declined"). Both steps are GONE on this path: the official connector has no config
file, no per-machine approval file, and no Node dependency. The self-hosted procedure
survives in the appendix for tenants that cannot run the org connector. Do not
reinstate it as the default.*

## A8 — retired

A8 existed to repair the config-file path's silent per-machine approval. The primary
path has no such step. **Numbering is kept so older install logs still make sense.**
Self-hosting? The appendix carries the old A7+A8 in full, helper script included.

## A9 — Warm the document-to-PDF tool

`tools\pdf\` turns a vault markdown **or HTML** file into a branded PDF. Nothing gets
installed: it runs on the Node from A1/A1b and the Edge already on every Windows machine.
Warm it now so the first real *"turn this into a PDF"* just works — the first run is the
only one needing the network, to fetch the pinned markdown converter into the local cache.

```
printf '# PDF check\n\nBuilt during setup. Safe to delete.\n' > "$TEMP/pdf-check.md"
```
```
"$LOCALAPPDATA/Programs/nodejs/node.exe" "THE VAULT PATH/tools/pdf/make-pdf.mjs" "$TEMP/pdf-check.md"
```

(Plain `node` is fine if A1 found it already on the machine.) That must end with
`built …pdf-check.pdf`. Then `rm -f "$TEMP/pdf-check.md" "$TEMP/pdf-check.pdf"`.

❌ *v1.1's advice here was itself the bug, and it failed on all three machines:*

```
make-pdf: markdown conversion failed - is Node/npx working, and has npx fetched
marked once with network?
'"node"' is not recognized as an internal or external command
```

*It said to call the runtime by full path because PATH is not live until the restart.
That cannot work: the tool shells out to `npx`, and `npx` re-invokes a **bare** `node`.
Calling the parent by full path does not put it on the child's PATH. **The tool now
prepends its own runtime directory to PATH for that one call**, so the full-path
invocation above works before the restart. The error message named markdown and the
network, and was neither — it sent people to debug two things that were fine.*

If it still fails, write the exact error in the log and move on. Nothing else today
depends on it.

---

# ⏸️ Restart — two actions dressed as one. Set it up well.

One restart does three jobs: a running session cannot load a connection added underneath
it, the app only re-reads environment variables at startup (so this is where the Node PATH
takes effect), and this is where you move into the vault for good.

🔴 **"Restart the app" is two actions, and only the first has an obvious prompt.** Quit and
reopen; **then start a NEW session on the vault folder.** The moment the app reopens, the
old conversation is the most visible thing on the screen, and resuming it looks like it
worked. It was worded clearly on machine 3, with warnings, and the resume happened anyway.
**Frame the new session as the goal and the quit as its precondition.**

**First, write the Part A half of the install log NOW.** The session on the other side has
no memory of this; the log is how it knows where you got to.

Then tell them plainly what is about to happen:

> *"I've set up the email connection, but the app has to be restarted to pick it up. Close
> Claude completely — from the system tray, not just the window — and open it again. Then
> go to the **Code** tab and start a **new** session: **Local**, **Select folder**, and
> pick the vault. You'll still see this conversation in the sidebar; leave it there. We
> start fresh on purpose, and everything so far is written down. I may need you to close it
> once more straight after — that's normal, not a fault."*

🔴 **Say the "possibly twice" line.** A second restart that was announced costs nothing.
An unannounced one that also does not fix anything is what burned two people's
confidence. (They signed in at A7, so the restart should be the last hurdle — but
"should" has been wrong in this file before.)

**On the other side, read this file again from the vault, read the install log to see how
far Part A got, then resume at B1.**

❌ **Do not use "do I remember the previous conversation?" as a test of whether you are a
new session. It is invalid in this app** — a genuinely new session retained the full prior
conversation. Conversation context carries across sessions, so memory proves nothing about
session identity. *Machine 2 proposed exactly this self-test in its log; had it shipped, it
would have sent readers chasing the wrong cause. Do not reinstate.*

---

# Part B — signing in and proving it works

## B1 — Prove the connection loaded, before anything else

**Your own tool list is the only evidence that counts.** In this fresh session, check for
the Microsoft 365 tools (they are named like `outlook_…`, `onedrive_…`).

| Tool list | Diagnosis | What to do |
|---|---|---|
| M365 tools present | Correct | Proceed to B2 |
| Absent | The app kept a stale state through a soft restart | Full quit — Task Manager, every Claude process — reopen, NEW session on the vault |
| Still absent | The A7 connection didn't take | Settings → Connectors: Disconnect if shown, Connect again (browser sign-in), full quit, new session |
| Still absent after that | Tenant-side: consent or enablement missing | Stop and escalate on the ticket. Log the exact screen text. Not their error, not yours |

⚠️ **Do not trust the Connectors screen's Connected/Connect label in either direction** —
on the real deployments it lagged reality both ways. The tool list is the evidence; the
screen is decoration.

🔴 **Do not work around an absence** — no hand-written config, no alternative route.
Working around it hides the finding. On machine 2 the restraint was the right call — the
absence *was* the day's most valuable output.

## B2 — Confirm the sign-in holds

They already signed in at A7, in their browser, as themselves — there is no separate
sign-in step here. What B2 does is confirm the session actually carries it: make one real
call (list the subjects of their three most recent emails) and watch it succeed.

**If it fails here with the tools present**, the cached connection is stale:

| Symptom | What it means | The fix |
|---|---|---|
| "Approval required / admin has been notified" in the browser at A7 | Tenant consent never granted | IT, on the existing ticket. Nothing on this machine fixes it |
| Calls fail though tools exist; or `Silent token acquisition failed` | The connection predates a permission change | Settings → Connectors → Disconnect → Connect → sign in → full quit → new session |
| Sign-in completes but calls still fail | This person may not be in the connector's assigned group | IT: confirm assignment, in writing |

**Be honest that reconnects recur.** ❌ *v1.1 said sign-in happens "once on each computer,
then not again". It is not true: machine 3 signed in three times in five days, and named
it as **"the main thing that puts me off"**.* Every tenant-side permission change forces a
disconnect-reconnect for every user — **which is the strongest argument for getting every
permission granted before the day**, and for one person testing any later change before
the group reconnects.

None of the tenant-side failures are recoverable by you or by them, and none are worth
improvising around. **Part A is still done and still useful** — say so, so the session
does not feel wasted.

## B3 — Three checks, then the demonstration

**1. Read.** List the subjects of their five most recent emails, so they can see it is
genuinely their mail.

**2. Draft.** Create a draft addressed **to themselves**, subject `Claude setup test`, one
line of body. Ask them to glance at Outlook: it is sitting in Drafts.

**3. Files.** Read one file from their OneDrive; write a small test file; ask them, then
delete the test file.

**4. 🔴 Sending must be absent — test it, don't assume it.** Look for a send tool
(`outlook_send_email`, `outlook_send_draft`, `outlook_forward_mail`). The expected state,
because IT revoked `Mail.Send` on the connector's app:

- **No send tool, or the send attempt is refused for missing permission → correct.** Log
  which of the two it was — nobody has recorded yet whether the revocation removes the
  tool or fails the call, and the next install wants to know.
- **A send succeeds → stop immediately and report it.** The `Mail.Send` revocation from
  the pre-day list was missed. The draft was addressed to themselves, so the only
  recipient is them — but this machine is not fit for real work until IT fixes the
  consent. Not a rule to add; a permission to remove.

One layer of defence sits behind the revocation: the app never lets send-class tools be
blanket-approved, so even a mis-consented tenant asks a human before each send. **That is
defence-in-depth, not the control — the revocation is the control.**

Then the demonstration, which is the single most reassuring fact in the whole setup:

> *"Claude writes emails; you send them. Every time. That's not a promise — the ability
> to send was taken away at the permission level, and we just proved it."*

Machine 1's answer when asked whether that ever chafed: **"No, that's the right line."** Not
a compromise tolerated. The correct arrangement, permanently.

❌ *v1.1 said to attempt a send and watch it fail; v1.3 corrected that to showing the
absence, because on the self-hosted path no send tool existed at all. On the official
connector the send tools CAN exist if IT skips the revocation — which is why this is an
empirical check again, with a stop-the-line outcome. History matters here: read both
corrections before "simplifying" this step.*

## B4 — Writing rules and signature, BEFORE the first draft

🔴 **Do this before you draft anything.** On machine 1 all three writing rules arrived
*after* drafts existed, which meant rework and one email that nearly went out wrong. Asked
at the right moment on a later machine, they arrived in seven words and there was no rework.

❌ **Never offer "rules first, or install first" as a choice.** Machine 3 was offered it,
picked install — *which is the wrong order and was the question's fault, not theirs.*

**Asking early is necessary and not sufficient.** On another machine the question was asked
correctly, at the right moment, with a colleague's rules offered as calibration, and simply
not answered, because that person's attention was on finishing the install. **So attach a
second, cheaper moment to the first real draft**, where answering costs nothing: *"before I
write this — anything you want me to always do, or never do?"*

Rules seen so far, for calibration: never use em dashes (stated absolutely), be concise and
considerate of the reader's time, two spaces after a full stop, a specific font and size,
and every email carries the full signature, internal and external alike.

⚠️ **A rule about how their correspondence looks must be shown to them rendered, not
described.** A proposal to shorten the signature for internal colleagues was agreed to in
the abstract and rejected on sight of the actual draft, because it read as though the mail
had not come from the office. The rule lasted about ten minutes.

**The signature. Get this right or every draft they touch has to be finished by hand.**

- 🔴 **The mail interface has no concept of a signature, and the client-side one is NOT
  added to a server-side draft.** ❌ *A vault note claimed it was added automatically on
  send. It is not — Outlook inserts it when a **human** clicks New or Reply. Drafts
  assembled through the connector arrive exactly as written, so they had been going out
  unbranded while the record said they wouldn't. Corrected 22 Aug.*
- **Lift the text signature out of one of their own sent emails**, early, into
  `voice/signatures/<name>.md`, and put it on every draft. Never unsigned, never a
  placeholder.
- **Images are the hard part.** One real signature was five inline images totalling ~515 KB
  including a 357 KB animated GIF, with no text in it at all — nothing readable by a
  machine, a screen reader, or anyone blocking images. Retrieving and re-attaching that
  costs roughly 476,000 characters each way and does not fit in a call.
- **More than one mail route can exist in a session and they are not equivalent.** The
  connector accepts rich HTML; fallback routes (a half-connected session improvising
  through other tools) sanitise to a bare tag allowlist and reject `<img>`
  and `style=` outright. If a draft comes out with no font and no branding, **the good
  surface had not finished connecting that session** — nothing about the mailbox, tenant,
  permission or signature settings has changed. Machine 1 was told the branding "could not
  be done" when it had worked two days earlier. They were right and the assistant was wrong.
- **The workaround that exists but is unproven:** build the draft as a reply into an
  existing thread, so the images come along server-side at no cost. **Nobody has checked
  the result by eye. Do not describe it as working until someone looks.**

**Stash every draft to `voice/drafts/` as you create it, and keep exactly one live draft
per email.** A superseded draft that was never sent led to an apology being drafted for a
reversal the recipient had never seen.

**Bodies: send full HTML with real paragraph tags, in a single call.** Plain text has its
newlines flattened, and a carefully structured message arrives as one run-on paragraph. And
⚠️ **HTML collapses two spaces after a full stop down to one** — the source looks right and
the sent email is wrong. If that is one of their rules, check the rendered draft.

## B5 — The sent-mail pass

Two things from one pass. **Ask first**, in plain words: *"May I read about a month of your
sent mail now? I'll skip anything personal — and you can check that I did."*

1. **What repeats enough to hand over** — the recurring work, roughly how often, what shape.
   Say what their own mail supports, and what it shows that any improvement plan missed.
2. **A first draft of `voice/<name>.md`** — a paragraph on how they write, then about five
   real sent emails as examples. Sent mail is where the voice is; the inbox is everyone
   else's.

**Count before promising anything, and state exactly what you read.** Headers over roughly
a month if volume allows; bodies only for the top clusters and only from the last week or
so. ⚠️ **Sent mail may only go back about three weeks**, so a "past month" sweep silently
stops short — say so rather than implying a month.

⚠️ **Never assert a negative from a preview or a subject line.** Body previews truncate
exactly where answers sit. Open the message.

**Filter before you retrieve, not after.** Restrict to work folders and exclude by sender
and category *before* anything is retrieved — never open, summarise or quote: personal or
family anything, medical, financial, anything from a personal address, HR, recruitment,
salary, leave, legal, disputes, complaints (member complaints included), board and
in-confidence material.

Then invite them to test it: *"Think of something personal you know is in your mailbox —
check it isn't in anything I produced."* **Let them verify rather than asking them to
trust.** In the voice file, keep the writing and lose the specifics.

## B6 — Their first `today` file

Write `today/<name>.md` from what B5 found: live this week, waiting on someone, coming up.
Then the payoff: have them open it **from SharePoint in their browser — on their phone if
they like.** It renders as a clean page, nothing installed. That is the whole knowledge-base
mechanism in one tap.

⚠️ **Two corrections this page has already earned.** Read the **sent** items alongside the
inbox: it told one person someone was waiting on them when they had already replied early
that morning, because the card was built from the inbound message as though it were the last
word in the thread. And **list only what is still outstanding** — this page competes with the
morning, and the person who has to request it, wait for it and read it at the busiest point
of the day stops asking. That is exactly why one of the three abandoned it.

## B7 — One real job, and one real draft

**Not a demo. One actual piece of work, this week, finished properly — and theirs to
choose.** Machine 3 brought their own job five minutes after the checks passed: cross-checking
twenty-five returned forms against a spreadsheet. It ran clean both ways and produced a
written procedure. It was a better first job than the scripted one, because it was theirs.

🔴 **Before they leave, actually write them one real email draft.** Across four days and
twenty sessions on machine 2, **not one draft was ever written** — the drafts folder was
empty and no draft tool had ever been called. Not from any objection: *"I've wanted one and
never got round to asking."*

**The most carefully designed boundary in the whole setup had never been exercised.** All
the verification effort went into proving the send half was absent; nobody checked whether
the draft half was reaching the person at all. It was not. **Exercise it on the day.**

Then book the habit: they should use Claude at least twice more before the next session.

🔴 **No skills and no scheduled automations today, however well it goes.** Both later
machines built one anyway on day one. Both have barely been touched since — which is a point
for the rule, not against it.

---

## Before you finish — with them

- Say plainly that the checks passed — or exactly which didn't.
- Sweep the vault for anything that looks like a password, token or key. On the primary
  path nothing credential-shaped should exist in the vault at all — the connection lives
  in the app, not in files.
- Show them how to start tomorrow, and let them do it once themselves: Claude → **Code** →
  **Local** → **Select folder** → the vault. It is in recent folders from then on.
- Point out that they never need the terminal pane, and that the **Chat** tab is a different
  thing entirely — it cannot see their files or their mail.
- Ask about ChatGPT / Copilot / Gemini use. If they use one, the memory import at
  **claude.ai/import-memory** is worth doing on its own merits — but 🔴 **what it imports
  lands in the Chat tab, not here.** Tell them that plainly rather than letting them assume
  it carried over. Ask them to paste the same text to you as well, and fold the useful parts
  into `voice/` and `About/`. Where it disagrees with their sent mail, **the sent mail wins.**
- Ask the two closing questions and write the answers **verbatim**: *"What was the most
  confusing moment?"* and *"Was there anything you expected me to ask that I didn't?"*

## Before you close the session — after they've gone

🔴 **Write the Part B log now, before you do anything else.** On two of the three machines
Part B was never written at all — the log got filled in while the install was interesting
and stopped the moment real work started. Everything those reports could say about sign-in,
the checks and the closing questions had to be reconstructed from session history.

- **Fix this file where it was wrong**, in place, so the next machine runs the corrected
  version. Never leave a known-wrong instruction standing because "we know about it now" —
  the next reader does not.
- If your organisation keeps other setup notes that outrank this file, land corrections
  there too. On machine 2 a fix that landed only in the lower-ranked file would have been
  silently overridden by the one above it.
- 🔴 **Write your log to `install-logs/machine-<n>-<role>.md`, never into a shared file.**
  On machine 3 a prepared edit to the shared runbook — built against a version four minutes
  old — would have deleted 145 lines of a parallel session's log without warning. Two
  machines, one file, no conflict warning, and the overwrite looks exactly like success.

---

## Appendix — expected noise, so it does not read as failure

Say each of these out loud *before* they appear. Three of the four things that shook
people's confidence were normal output nobody had warned them about.

| You will see | When | It means |
|---|---|---|
| `Not resetting hidden file - …desktop.ini` | A4, every machine | Nothing. Harmless |
| "Online only" cloud icon still showing | Right after A4 pins the folder | Nothing. Harmless |
| `AppXkv2jqn1pq8ajm0p5dhgqde7aafykkrrn` | A5 file-association check | Fine. Act only if the value contains `Word` |
| The old conversation still in the sidebar | After the restart | Normal. Start a new session anyway |
| Connectors screen says "Connect" though tools work (or "Connected" though they don't) | Any time | The screen lags reality in both directions. The tool list in a fresh session is the evidence |
| "Approval required — your admin has been notified" | A7 first connect | Not noise — the tenant consent is missing. Stop and escalate; retrying does nothing |

---

## Appendix — what is organisation-specific

Everything else is portable as written. Swap: the `About/` folder, which ships as a
worked example for a fictional organisation (see `About/README.md` — replace every file
before the first install); and in `tools/pdf/make-pdf.mjs` the `ACCENT` colour and
`logo.png` (the tool itself is portable). The primary path has no per-organisation IDs
in this file — the connector is configured tenant-side.

## Appendix — what is now settled, and what is still unverified

✅ **Settled on real machines, stop re-testing:** no admin rights needed anywhere in Part A
(three machines); the Node unpack and PATH edit (twice, ~3 min, no prompts); the
execution-policy change; the official connector carrying live sessions day to day on all
three machines (it is what the deployments actually run); the PDF pipeline end-to-end on a
managed laptop, with no proxy trouble and no policy block on headless printing.

⚠️ **Still unverified, and the log decides them:**

- **A fresh machine has never been installed via A7's connector path by this runbook** —
  the deployments migrated onto the official connector during their first week, after
  installing the self-hosted way. The first clean run of v1.5 is the real test; log hard.
- **Whether revoking `Mail.Send` removes the send tools or fails the call** — B3 logs
  which.
- The reply-into-a-thread signature workaround — still never checked by eye.
- Whether the whole procedure runs with **no expert in the room** — it never has. The
  preparation phase ran with zero assists on the two later machines; that is the closest
  we have come.

---

## Appendix — the self-hosted connector (fallback path)

**Use this only when the official connector is not an option** — no Claude org admin, a
tenant that will not consent Anthropic's app, or a deliberate decision to hold the whole
chain in your own app registration. This is the path v1.1–v1.4 documented and the first
three deployments installed with, before migrating to the official connector. Its safety
property is stronger in one way — `Mail.Send` is simply **never consented**, so there is
nothing to revoke — and its operational cost is real: Node becomes a connector
dependency, sign-in is device-code, and the per-machine approval below is the worst
silent failure this file has ever documented.

**IT side:** the "Alternative: self-hosted app registration" section of
`docs/microsoft-365-admin-setup.md` — single-tenant app, public client flows ON, delegated
`Mail.ReadWrite` + `Files.ReadWrite` + `offline_access`, never `Mail.Send`, calendar =
`Calendars.ReadWrite` never `.Shared` (the `.Shared` variant satisfied none of this
server's calendar tools — four days, two support round-trips).

**Machine side, replacing A7:** write this as `.mcp.json` in the vault root — with your
file-writing tool, never a heredoc — filling in the two IDs from the registration:

```json
{
  "mcpServers": {
    "ms365": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@softeria/ms-365-mcp-server@0.114.0",
               "--org-mode", "--preset", "mail,files",
               "--allowed-scopes", "Mail.ReadWrite Files.ReadWrite"],
      "env": {
        "MS365_MCP_CLIENT_ID": "THE_CLIENT_ID",
        "MS365_MCP_TENANT_ID": "THE_TENANT_ID"
      }
    }
  }
}
```

(The `/c` inside the JSON is fine — it goes to the OS, not through Git Bash.) The file
syncs, so later machines inherit it. `--allowed-scopes` only hides tools — **the absent
consent is the control**, exactly as with the revocation on the primary path.

**Machine side, replacing A8 — the per-machine approval. 🔴 This broke two of three
machines, silently.** The app does not read `.mcp.json` until a per-machine approval
exists in `%USERPROFILE%\.claude.json`:

```
enabledMcpjsonServers    []      <- empty means NEVER ANSWERED, not declined
```

No error, no prompt (the prompt the docs promise never appeared on any machine), and
**restarting makes it worse** by burning the confidence the restart just spent. Ask the
person's permission (the file is theirs, outside the vault), then snapshot → one
targeted edit adding `"ms365"` to that list → verify by key count. The running app
writes this file continuously — never rewrite it wholesale. v1.3's tested helper script
for this lives in git history at this file's `A8` section, tag `v1.3`–`v1.4`.

**Sign-in, replacing B2:** the server's `login` tool returns a URL and a short code —
relay both, they enter the code at microsoft.com/devicelogin and sign in as themselves.
🔴 Codes last ~15 minutes; never generate one until they say they are at a browser.
Errors: `AADSTS50105` not assigned to the app · `AADSTS65001` consent missing ·
`AADSTS53003` Conditional Access blocks device code (this path cannot work there) ·
`AADSTS7000218` public client flows off. Expected noise before sign-in:
`{"success":false,"message":"Login failed: No valid token found"}` — the correct answer,
not a fault.

**B3 on this path:** there is no send tool at all — absence is the demonstration, and a
send that somehow succeeds means `Mail.Send` was consented and must be removed in Entra.

---

## Install log

**One file per machine: `install-logs/machine-<n>-<role>.md`.** Verbatim beats tidy — a real
error string is worth more than a description of it. If a field does not apply write "n/a";
if you did not check, write "not checked". Never leave one blank, and never guess.

```
MACHINE
  Date / role / first machine or later
  Setup version (from the top of this file)
  Windows · PowerShell · Git · Node/npx versions · desktop app version
  Total time, and where most of it went

THE QUESTIONS THAT DECIDE THE NEXT INSTALL
  Admin rights needed anywhere?                    no / prompt / denied
  Which route put the library on this machine?     Sync / Add-shortcut  (A3)
  A7 connect: clean, or "approval required"?       paste the exact screen text
  Tools present after the first restart?           yes / no — and what fixed it
  Did the Connectors screen's state match reality? (it has lied both ways)
  B3 send check: tool absent, or call refused?     (nobody has logged which yet)
  How many sign-ins / reconnects, and why each?

WHAT A STRANGER WOULD HAVE HIT
  Every time a human stepped in — what they did, and why Claude couldn't
  Every time Claude improvised past this file — each one is a missing step
  Every question they asked — each one is a gap in the narration
  Any moment they looked lost, even briefly
  Any lookup that reported broken-when-fine (add it to the table at the top)

WHAT BROKE
  Step · what was expected · what happened · exact error text

VERIFICATION
  B3 checks 1-4: pass / fail each — including the send-absence check
  Was a REAL draft written and seen by them before they left?   (B7)
  Were writing rules and the signature captured BEFORE the first draft?
  A9 PDF: built / failed (paste the error) / skipped

IN THEIR WORDS
  Most confusing moment:
  Anything they expected to be asked but weren't:

CHANGES MADE TO THIS FILE AS A RESULT
```
