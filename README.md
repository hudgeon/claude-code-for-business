# Claude Code for Business

Runbooks **that Claude executes itself**, and the shared-vault starter kit it installs.
For small teams of non-technical people — a CEO, an operations manager, a
communications lead — who want an assistant that reads their own mail and files, drafts
everything in their own voice, and **sends nothing, ever**.

Nobody opens a terminal. A person installs two things by hand, opens a folder in the
Claude app, and says one sentence. Claude does the rest — and **no administrator rights
are needed anywhere**.

## Platforms

| Platform | Status | Runbook |
|---|---|---|
| **Windows + Microsoft 365** | ✅ The tested path — every correction earned on a real machine | [`vault/setup/windows.md`](vault/setup/windows.md) |
| **macOS + Microsoft 365** | 🚧 Planned — structure in place, unverified notes collected | [`vault/setup/mac.md`](vault/setup/mac.md) |
| **Linux** | 🚧 Planned — open feasibility questions listed | [`vault/setup/linux.md`](vault/setup/linux.md) |

The install sentence is the same on every platform — `vault/SETUP-NEW-MACHINE.md` is a
dispatcher that detects the OS and routes Claude to the right runbook. Ran it on a Mac
or Linux box? Your logged pioneer run is exactly how those stubs become runbooks — see
[Contributing](#contributing).

## The rollout order — the lesson that outranks every step

**One person first — set up, working, and verified — before anyone else starts. And
never run setup as a group.** On the real deployments, a whole group session
disappeared into connector triage, three people watching one screen being debugged.

1. First install: one person, one-on-one, days ahead. Not merely installed —
   **verified**: connector reading their mail, a real draft in their Drafts folder,
   their voice captured, one real job finished, evidence seen for each.
2. A day or two of real use to shake out the gremlins. The first machine surfaces
   every environment-level problem — fix them once, with one person.
3. The remaining machines one at a time, never interleaved.
4. Any later permission change: one person tests it end to end before the group.
5. **The team's first group session happens when every machine works — and it is for
   getting real work done, not configuration.**

## Built from real installs, not theory

This kit is rewritten from real deployments, with an expert in the room logging
**every** human intervention and every improvisation. Each became a fix or a warning in
the runbook. Corrections are never deleted: the wrong instruction stays in the file,
struck through with ❌ and the reason, because deleted lessons get re-derived from
scratch six weeks later. The runbook's header and the install logs carry the detailed
provenance.

The working habits that emerged were then reviewed against Anthropic's published best
practices and folded into [`vault/working-with-claude.md`](vault/working-with-claude.md)
— the file Claude coaches the team from: the 20-second delegation rule, evidence-not-
assurances, plan-first-on-big-jobs, the two-corrections stop rule, the effort dial, and
the automation ladder.

A sample of what broke on real machines, and what the kit does about it:

| What happened | What the kit does now |
|---|---|
| The very first command failed **silently** — the shell rewrote it so it ran nothing and printed plausible output | Every command is written for the shell Claude actually runs in, and the trap leads the runbook |
| **Five separate lookups** said the machine was broken when it was fine | "Enumerate, never predict" is the first rule in the runbook, ahead of every step |
| The email tools were **silently absent** after the restart — no error, no prompt, and restarting again makes it worse | Microsoft 365 now connects through the app's own Connectors screen, where that failure class does not exist; the config-file path and its tested repair live in the appendix |
| A convenience symlink made the folder picker show a "wrong" path — two users named it the low point of their week | The step is deleted. It manufactured a failure signal on working machines and bought nothing |
| A calendar permission asked for one level too broad satisfied **none** of the calendar tools — four days, two IT round-trips | The IT page pre-answers the scope questions for both connector paths, that trap included |
| The assistant **never once wrote the email draft** the whole safety model exists to hand over — and nobody noticed for days | The install ends by writing one real draft, not just proving that sending is impossible |
| A whole group session disappeared into connector triage | The rollout order above |

## The safety model

- **Claude cannot send email.** The Microsoft 365 connector's write set is consented,
  then `Mail.Send` is revoked on its enterprise app in Entra — drafting works, sending
  is absent at the permission layer, not blocked by a rule software has to remember to
  obey. The app adds a second layer on its own: send-class tools can never be
  blanket-approved. The install tests the absence empirically and stops the line if a
  send ever succeeds.
- **Delegated access only.** Claude signs in as the user, in the user's browser, and
  sees only what that person already sees. No passwords touched, no client secret,
  nothing stored in files — the connection lives in the app's own Connectors screen.
- **Recoverability-based autonomy.** The rulebook hands over everyday document work
  (edits and deletes are versioned and recycle-binned) and keeps bulk changes,
  anything unrecoverable, and anything member-facing, financial, legal or HR with the
  human.

## Requirements (Windows path)

- Windows 10/11.
- Microsoft 365, with two admins' help once: a Claude org admin to enable the
  Microsoft 365 connector, and an Entra Global Administrator for the tenant consent —
  [docs/entra-app-registration.md](docs/entra-app-registration.md), ~15 minutes.
- The Claude Desktop app on a paid plan, **with the seat assigned to the person** — an
  upgrade prompt at the Code tab means the seat, not the app, and it can stall a whole
  session.
- Git for Windows on each machine — the Code tab asks for it and won't start a local
  session without it, which is also why Claude can't install it for you.

## Quick start

1. **Days before, not the morning of:** the admin work from
   [docs/entra-app-registration.md](docs/entra-app-registration.md) — connector
   enabled, tenant consent granted, write tools on, `Mail.Send` revoked, and a written
   confirmation naming who is enabled. No IDs, no config files.
2. **Get Claude running on the machine:** follow Anthropic's
   [desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart) — download
   the app, sign in, click the **Code** tab, and install
   [Git for Windows](https://git-scm.com/downloads/win) when it asks (restart the app
   after). **Stop once the Code tab opens — the kit takes it from there.** If the Code
   tab shows an upgrade prompt instead, the person's paid seat isn't assigned; fix
   that before going further.
3. Download this repo and put the `vault/` folder on the machine (anywhere — the
   install moves it into a synced SharePoint library and the session follows it).
   Replace the worked-example `vault/About/` files with your own organisation
   ([vault/About/README.md](vault/About/README.md)).
4. In the Code tab: **Local** → **Select folder** → pick the `vault` folder, and say:

   > **Read SETUP-NEW-MACHINE.md and walk me through it.**

5. Follow the rollout order above: verify person one end to end before person two
   begins.

## What's in the box

```
vault/                        ← the download; whatever goes on a machine is a copy of this
├── SETUP-NEW-MACHINE.md      ← dispatcher: detects the OS, routes to the platform runbook
├── setup/
│   ├── windows.md            ← the tested runbook, written to Claude, not to you
│   ├── mac.md  linux.md      ← stubs holding the slots, honest about status
├── CLAUDE.md                 ← the rulebook. Thin on purpose; grows by appended incidents
├── working-with-claude.md    ← the habits and the automation ladder Claude coaches from
├── About/                    ← worked example (fictional org) — replace before installing
├── tools/pdf/                ← markdown or HTML → branded PDF, no installs, Edge headless
├── voice/  today/            ← filled on install day from each person's own mail and week
└── install-logs/             ← one file per machine; template at the bottom of the runbook
docs/
├── entra-app-registration.md ← the one page your IT admin needs
└── harvest-lessons.md        ← the feedback loop that built this kit — run it after a week
```

The organisation in `About/` — Northwind Producers Association — is fictional, in the
tradition of Microsoft's Northwind Traders, as are the people in it.

## Contributing

Ran an install? A week later, run
[docs/harvest-lessons.md](docs/harvest-lessons.md) — it has Claude mine its own install
log and session history, interview the person about what no log can hold, and produce a
de-identified report. Open it as an issue, or as a PR that folds the finding into the
runbook with the ❌ convention. Verbatim error text is the most valuable thing you can
send. **Pioneer runs on macOS or Linux are the most wanted contribution** — the stubs
in `vault/setup/` say exactly what is unknown.

## About

Maintained by [Doug Hudgeon](https://github.com/hudgeon), co-author of *Machine
Learning for Business* (Manning) — this repo carries that book's premise into the
agent era: the shortest path from AI to a small team's real work. [MIT](LICENSE).
