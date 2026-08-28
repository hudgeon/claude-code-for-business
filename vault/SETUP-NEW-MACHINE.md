# Setting up Claude on a new Windows machine

**Setup version 1.3 — 2026-08-28.** Write this number in the install log for this machine.

This version is rewritten from three lessons-learned reports covering the first three
machines (one on 21 Aug, two on 25 Aug) plus the week of real use that followed. Where a
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

## Before the day — two things, and neither is yours

Both of these decided how the first three installs went. Do them days ahead, not on the
morning.

### 1. The IT request. This is where a person working alone gives up.

Asked where she would have stopped doing this alone, the CEO did not pick a command or a
dialog. She picked **"at the access requests"** — the point where progress depends on
someone else approving something. Her one change to the whole process: *"sort the IT
access upfront."*

Send this to whoever administers the tenant, in one message, before the day:

- **Assign this person to the app registration.** Missing this is `AADSTS50105` at
  sign-in and nothing else works.
- **Graph permissions: `Mail.ReadWrite` and `Files.ReadWrite`.** Admin-consented.
- 🔴 **Never `Mail.Send`. Not to be helpful, not to test something.** See A7 — once
  consented, narrowing the config afterwards does not take it back.
- **If calendar is wanted: ask for `Calendars.ReadWrite`. Not `Calendars.ReadWrite.Shared`.**
  This cost four days and two rounds with the IT provider on machine 1. The connector's
  own `lowerScopesFor()` in `dist/auth.js` maps `X.ReadWrite.All` down to `X.ReadWrite`,
  `X.Read.All` and `X.Read`, but maps `X.ReadWrite.Shared` down to `X.Read.Shared` and
  nothing else — so the granted permission satisfied none of the calendar tools.
  Microsoft's documentation says otherwise. The connector disagrees and the connector
  wins. Upgrading does not help: that function is byte-for-byte identical 32 releases
  later. **The corrected ask is for less access than the first one, not more.**
- **Confirm device-code sign-in is permitted for this app.** It is the only interactive
  flow the connector offers.

### 1b. Confirm they have a paid seat, assigned to them, before the day.

**A Code-tab upgrade prompt at sign-in means that person's seat is not assigned — the
account, not the app.** Nothing in the runbook fixes it and the session stalls there.

🔴 **Do not assume the person who administers the subscription can fix it on the day.** On
machine 1 the stall outlived the session: the person holding the top role still could not
complete the upgrade, because there is no self-elevation path by design, and the vendor's
own documentation disagrees with itself about which role can do what. Settle it days
ahead, and have someone confirm in writing that the seat is assigned to this person.

### 2. Ask them what they actually want handed over.

Asked what she expected to be asked and never was, the CEO answered: **"what you actually
wanted help with."** The procedure asks about permissions, folders and file formats. It
never asks what the person wants.

And the corollary from machine 3: **the jobs chosen at setup are not the jobs that stick.**
Three template-shaped tasks were picked as ideal starters — high-frequency, nothing
sensitive. Five days later all three were still done by hand, while what actually stuck
was an unplanned data clean-up nobody had scheduled. So ask, write the answer down, and
on the day **let them bring their own first job** (B7).

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

## Fill these in before starting

```
MS365_CLIENT_ID    = ..........................
MS365_TENANT_ID    = ..........................
```

Both come from the app registration your IT admin runs from
`docs/entra-app-registration.md` in the kit this vault shipped with. They are
identifiers, not secrets — there is no password or client secret anywhere in this
process. **If they are blank, stop and say so before doing anything else** — Part A can
run without them, but nothing in Part B can, and finding out at sign-in wastes the
person's patience at the worst moment.

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
well without it and only the connector cares. The `npx` check is the test, A1b is the fix.

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
carry on without it: the connector cannot start without Node, and the failure would
otherwise surface at sign-in, long after the cause.

If PowerShell reports 5.1, keep two things to yourself: `&&` does not work there (run
things one at a time), and some of its write commands add a byte-order mark that corrupts
JSON. The person never needs to hear any of this.

**Two things are not on these machines and nobody mentions them:** Python and
LibreOffice. If a job needs Python, use the JavaScript runtime instead. If you generate a
Word document, you cannot render it locally to check it by eye — say so rather than
implying you looked.

## A1b — Install Node yourself, if `npx` was missing

Skip entirely if `npx --version` already printed a version.

Node is needed by the email connector in A7, not by Claude. **Install it without admin
rights and without any prompt for them**, by unpacking the official build into their own
profile. Tell them only: *"I'm installing one small component the email connection needs
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
their week, and one named it as where she would have given up. And after all that, **no
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

## A7 — Write the connection config

Write this as `.mcp.json` **in the vault root**, filling in the two IDs from the top. Use
your file-writing tool, **not a shell heredoc** — heredocs on this shell fail silently on
long content with mixed quoting, and create nothing.

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

(The `/c` inside this JSON is fine — it goes straight to the OS, not through Git Bash.)

✅ **Confirmed on machines 2 and 3: this file genuinely syncs**, and the
`--allowed-scopes` narrowing carries through untouched with no send permission anywhere.
The promise is **"zero configuration, one approval"** — not "zero clicks". Nobody edits a
config file, copies an identifier or reads a connector guide. That part held twice.

🔴 **`--preset` decides which tools exist, and it is not a permission.** Three separate
sessions logged "no calendar access" and blamed a permission when the real cause was that
calendar was not in the preset, in this file. The same thing then happened again with
tasks. **If a tool family is missing, check the preset here BEFORE blaming a permission
or raising a ticket.** To add a family, read the server's own vocabulary rather than
guessing at it:

```
cmd.exe //c "npx -y @softeria/ms-365-mcp-server@0.114.0 --help"
```

Add the family to `--preset` and its scope to `--allowed-scopes` together — a family with
no matching scope registers no tools, and the server says so if you ask it:

```
Warning: allowed scopes disabled 87 tools.
Missing scopes: Calendars.Read, Calendars.ReadWrite, ...
```

🔴 **The subtlety that makes or breaks the safety story.** `--allowed-scopes` only hides
tools — it is **not** the control. Entra issues tokens carrying *every* scope ever
consented for the app, no matter what is requested later. So "Claude cannot send" holds
only because **`Mail.Send` was never consented in the first place.** If anyone ever adds
it, narrowing the flags afterwards will not take it back; the consent has to be removed in
Entra under **Enterprise applications → the app → Permissions**.

## A8 — Approve the connection on this machine 🔴 the step that broke machines 2 and 3

**This is the worst failure in the whole record, and it is invisible.** On both machines
set up on the same day, the tools were silently absent after the restart. No error. No
prompt. No log line naming the server. The connector's own log file was zero bytes and
days old — the app had never even tried to start it. Run by hand, the server was perfectly
healthy.

The cause is a **per-machine approval that lives in the user's own profile and does not
sync**, in `%USERPROFILE%\.claude.json`:

```
enabledMcpjsonServers    []      <- empty means NEVER ANSWERED, not declined
disabledMcpjsonServers   []
```

Until that list contains `ms365`, the app does not read `.mcp.json` at all.

**Three properties make it the worst step in the runbook:** there is no error to search
for; **restarting does not fix it**, so the obvious remedy burns exactly the confidence
the restart step has just spent; and ❌ *v1.1 said to expect a prompt asking to approve
the server — **that prompt never appeared on either machine.** Do not rely on it. If it
does appear, they approve it and this step is a no-op.*

So write it yourself, now, before the restart. Two things make this delicate: the file
lives outside the vault and outside the boundary the rulebook draws, so **it is genuinely
their approval to give — ask in chat first**; and **the running app writes to this file
continuously** (it was observed moving sixty bytes in two minutes with nobody touching
it), so a rewrite would lose whatever it wrote meanwhile.

**Snapshot, targeted edit, verify — never rewrite the file.** Write this helper with your
file-writing tool (not a heredoc) to the temp folder, then run it with the Node from A1b:

```js
// approve-mcp.mjs — add one server to enabledMcpjsonServers for one project.
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
const [cfgPath, projectPath, server] = process.argv.slice(2);
copyFileSync(cfgPath, cfgPath + ".before-setup");
const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
const before = Object.keys(cfg).length;
cfg.projects ??= {};
const key = Object.keys(cfg.projects).find((k) => k.toLowerCase() === projectPath.toLowerCase()) ?? projectPath;
cfg.projects[key] ??= {};
const list = new Set(cfg.projects[key].enabledMcpjsonServers ?? []);
list.add(server);
cfg.projects[key].enabledMcpjsonServers = [...list];
cfg.projects[key].disabledMcpjsonServers ??= [];
writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
console.log(`top-level keys ${before} -> ${Object.keys(cfg).length}`);
console.log(`project key: ${key}`);
console.log(`enabled: ${JSON.stringify(cfg.projects[key].enabledMcpjsonServers)}`);
```

Top-level key count must be unchanged — or +1 if the file had no `projects` key at all —
and `enabled` must contain `ms365`. The `.before-setup`
copy stays until B1 has proved the tools are there.

⚠️ **The one part still unverified: writing the entry BEFORE the folder has ever been
opened.** On machines 2 and 3 the entry already existed (a session had opened the vault),
and the fix was applied to it. If the app records the folder under a different spelling
than the one you wrote, B1 will show no tools — the entry will exist by then, so set that
one, quit and reopen once, and **log it**, because that is what tells the next install
whether the pre-emptive write is reliable.

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

🔴 **Say the "possibly twice" line, even though A8 is meant to make the second one
unnecessary.** A second restart that was announced costs nothing. An unannounced one that
also does not fix anything is what burned two people's confidence.

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

Two commands decide everything, and they separate the two failures that look identical:

```
cmd.exe //c "npx --version"
```

...then look at your own tool list for the `ms365` tools.

| Runtime version | Email tools | Diagnosis | What to do |
|---|---|---|---|
| not found | absent | The app was never properly restarted | Quit from the system tray, reopen, new session on the vault |
| works | absent | **The A8 approval is missing** | Fix the entry in `%USERPROFILE%\.claude.json`, then reopen once. **Do not just restart again — it will not help** |
| works | present | Correct | Proceed |

⚠️ **Settings → Connectors may or may not list a server that came from a project file. Do
not treat its absence there as failure.** The tool list is the evidence.

If you need to separate "cannot start" from "was never asked to start", run the server by
hand — a healthy server answers instantly:

```
cmd.exe //c "npx -y @softeria/ms-365-mcp-server@0.114.0 --version"
```

🔴 **Do not hand-write the config into the session or launch the server yourself to get
past this.** Working around it hides the finding. On machine 2 the restraint was the right
call — the absence *was* the day's most valuable output.

## B2 — Sign in to Microsoft 365

⚠️ **Expected noise:** before sign-in, the token check returns
`{"success":false,"message":"Login failed: No valid token found"}`. That is the correct
answer, not a fault.

🔴 **Do not generate the code until they tell you they are at a browser.** Codes last
about fifteen minutes; one expired unused on machine 1 and a second had to be issued.

Call the server's **`login`** tool. It returns a web address and a short code. Relay them
exactly, in one line:

> *"Go to **microsoft.com/devicelogin** on your phone or browser and enter the code
> **XXX-XXX-XXX**, then sign in as yourself."*

**They do the browser half — never ask them to read the code back, and never touch a
password.** When they say done, call **`verify-login`**.

**Be honest that this recurs.** ❌ *v1.1 said sign-in happens "once on each computer, then
not again". It is not true: machine 3 signed in three times in five days, and named it as
**"the main thing that puts me off"**.* Any permission change invalidates the cached token
and it comes back as:

```
Silent token acquisition failed
```

The fix is to disconnect and reconnect the connector, then sign in again — and a fresh
interactive sign-in may be escalated to admin consent, which sends it back to IT. **This is
the strongest argument for getting every permission granted before the day.**

✅ **Device-code sign-in was permitted in this tenant** — confirmed on three machines. The
one contingency held in reserve, `AADSTS50105`, never fired.

| Error | What it means | Who fixes it |
|---|---|---|
| `AADSTS50105` | Not assigned to the app | IT: assign this person |
| `AADSTS65001` | Graph permissions never admin-consented | IT: grant admin consent |
| `AADSTS53003` | Conditional Access is blocking this sign-in | IT: scope the policy, or this design cannot be used here |
| `AADSTS7000218` | Public client flows off | IT: set it back to Yes |

None are recoverable by you or by them, and none are worth improvising around. **Part A is
still done and still useful** — say so, so the session does not feel wasted.

## B3 — Three checks, then the demonstration

**1. Read.** List the subjects of their five most recent emails, so they can see it is
genuinely their mail.

**2. Draft.** Create a draft addressed **to themselves**, subject `Claude setup test`, one
line of body. Ask them to glance at Outlook: it is sitting in Drafts.

**3. Files.** Read one file from their OneDrive; write a small test file; ask them, then
delete the test file.

**Then the demonstration.** ❌ *v1.1 said to attempt a send and watch it fail. **You cannot
stage that attempt — there is no send tool anywhere in the surface.** Not blocked: absent.
Corrected 21 Aug.* Showing the absence turned out to be the better demonstration anyway:

> *"Claude writes emails; you send them. Every time. That's not a promise — the capability
> to send doesn't exist."*

Machine 1's answer when asked whether that ever chafed: **"No, that's the right line."** Not
a compromise tolerated. The correct arrangement, permanently.

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
- **There are two mail surfaces here and they are not equivalent.** One accepts arbitrary
  markup including images. The other sanitises to a bare tag allowlist and rejects `<img>`
  and `style=` outright. If a draft comes out with no font and no branding, **the good
  surface had not finished connecting that session** — nothing about the mailbox, tenant,
  permission or signature settings has changed. Machine 1 was told the branding "could not
  be done" when it had worked two days earlier. She was right and the assistant was wrong.
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
inbox: it told one person someone was waiting on her when she had already replied at 07:12
that morning, because the card was built from the inbound message as though it were the last
word in the thread. And **list only what is still outstanding** — this page competes with the
morning, and the person who has to request it, wait for it and read it at the busiest point
of the day stops asking. That is exactly why one of the three abandoned it.

## B7 — One real job, and one real draft

**Not a demo. One actual piece of work, this week, finished properly — and theirs to
choose.** Machine 3 brought her own job five minutes after the checks passed: cross-checking
twenty-five returned forms against a spreadsheet. It ran clean both ways and produced a
written procedure. It was a better first job than the scripted one, because it was hers.

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
- Sweep the vault for anything that looks like a password, token or key. (The two IDs in
  `.mcp.json` are identifiers, not secrets — they belong there.)
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
| `{"success":false,"message":"Login failed: No valid token found"}` | B2, before sign-in | The correct answer before signing in |
| The old conversation still in the sidebar | After the restart | Normal. Start a new session anyway |
| `ms365` missing from Settings → Connectors | Any time | Not evidence. A project-file server may not appear there |

---

## Appendix — what is organisation-specific

Everything else is portable as written. Swap: the two IDs at the top; the `About/`
folder, which ships as a worked example for a fictional organisation (see
`About/README.md` — replace every file before the first install); and in
`tools/pdf/make-pdf.mjs` the `ACCENT` colour and `logo.png` (the tool itself is
portable).

## Appendix — what is now settled, and what is still unverified

✅ **Settled on real machines, stop re-testing:** no admin rights needed anywhere in Part A
(three machines); the Node unpack and PATH edit (twice, ~3 min, no prompts); the
execution-policy change; `.mcp.json` genuinely syncs and the scope narrowing carries; device
code is permitted in this tenant; the PDF pipeline end-to-end on a managed laptop, with no
proxy trouble and no policy block on headless printing.

⚠️ **Still unverified, and the log decides them:** writing the A8 approval *before* the vault
folder has ever been opened; the reply-into-a-thread signature workaround, which nobody has
checked by eye; and whether the whole procedure runs with **no expert in the room** — it
never has. The preparation phase ran with zero assists on the two later machines, which is
the closest we have come.

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
  Did the A8 approval already exist, or did you write it?   and did the
    pre-emptive write survive the restart?         (A8 — still unverified)
  Did the MCP-approval PROMPT ever appear?         (it has not, on any machine)
  Tools present after the first restart?           yes / no — and what fixed it
  Device code allowed?                             yes / blocked — paste the error
  How many times did they sign in?

WHAT A STRANGER WOULD HAVE HIT
  Every time a human stepped in — what they did, and why Claude couldn't
  Every time Claude improvised past this file — each one is a missing step
  Every question they asked — each one is a gap in the narration
  Any moment they looked lost, even briefly
  Any lookup that reported broken-when-fine (add it to the table at the top)

WHAT BROKE
  Step · what was expected · what happened · exact error text

VERIFICATION
  B3 checks: pass / fail each
  Was a REAL draft written and seen by them before they left?   (B7)
  Were writing rules and the signature captured BEFORE the first draft?
  A9 PDF: built / failed (paste the error) / skipped

IN THEIR WORDS
  Most confusing moment:
  Anything they expected to be asked but weren't:

CHANGES MADE TO THIS FILE AS A RESULT
```
