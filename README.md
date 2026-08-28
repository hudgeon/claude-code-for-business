# Claude Code for Business

**Written for the owner of a small business** — a handful of people, Microsoft 365,
and either a third-party IT company or nobody at all looking after the technology.
This kit gives each person on your team a Claude assistant that works inside their
real job — their own email, their own files, their own way of writing — and gives the
team a shared memory.

## Why you'd do this

What it looked like in the businesses this kit was built in:

- **Email drafting, in each person's own voice.** Claude reads the thread and puts a
  ready-to-edit reply in their Outlook **Drafts** folder. The person reads it, fixes
  it, sends it — and Claude learns their voice from what they changed.
- 🔴 **Claude cannot send email. At all.** That ability is removed at the Microsoft
  permission level before anyone starts. Not a setting someone can flip in a chat —
  a permission your administrator takes away. The setup proves it in front of each
  person.
- **A daily page** of what's live, what's overdue, and who they're waiting on — built
  from their own mail and calendar.
- **The unglamorous wins**: cleaning up the customer database, cross-checking a
  spreadsheet against 25 emailed forms, turning notes into branded PDFs. The work
  that stuck was rarely the work anyone predicted.
- **A shared folder of team knowledge** (we call it the vault) that every person's
  Claude reads and writes — so what the team knows stops living in one person's head.

## How it works — one sentence, literally

This kit is a folder you download. Inside it is a set-up file **written to Claude,
not to you**. You open the folder in the Claude app and say:

> **Read SETUP-NEW-MACHINE.md and walk me through it.**

Claude sets *itself* up: finds your synced company files, connects to Microsoft 365,
learns how the person writes, and finishes by completing one real piece of their
work. Nobody opens a terminal, and no administrator password is needed on any
machine. The person approves a few prompts and signs in once in their browser.

## What you need

- Windows PCs. (macOS and Linux are on the way — see [Platforms](#platforms).)
- Microsoft 365 Business.
- A paid **Claude Team plan**, with a seat assigned to each person.
- About 15 minutes from **whoever administers your Microsoft 365** — for most small
  businesses that's a third-party IT company. **If that's you, you can do those
  steps yourself**: the instructions link Microsoft's own documentation at every
  step, and none of it goes beyond clicking through the admin portal.

## The steps

1. **Send one page to your IT company:**
   [docs/microsoft-365-admin-setup.md](docs/microsoft-365-admin-setup.md). Part 2 of
   that page is written for them — five portal tasks with the reason for each, and
   the one that matters most: after enabling drafting, they **revoke Claude's
   permission to send email**. Ask them to reply confirming the four facts the page
   lists. *(No IT company? Do Part 2 yourself — every task links the Microsoft
   how-to.)*
2. **Do your own five minutes** — Part 1 of the same page: turn the Microsoft 365
   connector on in your Claude workspace and enable its write tools.
3. **Pick the first person. Probably you.** On their PC, follow Anthropic's
   [desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart): install
   the Claude app, sign in, click the **Code** tab, and install
   [Git for Windows](https://git-scm.com/downloads/win) when it asks. **Stop when
   the Code tab opens — the kit takes it from there.** (An upgrade prompt at the
   Code tab means that person's seat isn't assigned yet.)
4. **Download this kit** (the green **Code** button above → **Download ZIP**) and
   put the `vault` folder anywhere on the machine. Spend 20 minutes replacing the
   fictional example company in `vault/About/` with short notes about your own
   business — [vault/About/README.md](vault/About/README.md) shows what goes where.
   Claude coaches far better when it knows who it's working for.
5. **Say the sentence.** Code tab → **Local** → **Select folder** → the `vault`
   folder → *"Read SETUP-NEW-MACHINE.md and walk me through it."* Claude drives from
   here; the setup ends with the connection tested, a real draft in their Drafts
   folder, proof that sending fails, and one real job done.
6. **Let the first person work with it for a day or two. Then the next person, one
   at a time.** 🔴 Never set people up as a group — configuration in a group is
   frustration multiplied by the number of people watching. The first time your team
   meets about Claude, every machine should already work, and the meeting should be
   about getting real work done.

## Platforms

| Platform | Status | Runbook |
|---|---|---|
| **Windows + Microsoft 365** | ✅ The tested path — every correction earned on a real machine | [`vault/setup/windows.md`](vault/setup/windows.md) |
| **macOS + Microsoft 365** | 🚧 Planned — structure in place, unverified notes collected | [`vault/setup/mac.md`](vault/setup/mac.md) |
| **Linux** | 🚧 Planned — open feasibility questions listed | [`vault/setup/linux.md`](vault/setup/linux.md) |

The install sentence is the same on every platform — `vault/SETUP-NEW-MACHINE.md`
detects the OS and routes Claude to the right instructions. Ran it on a Mac or Linux
box? Your logged pioneer run is exactly how those stubs become real —
see [Contributing](#contributing).

## Why the instructions are so careful

This kit is rewritten from real deployments, with an expert in the room logging
**every** human intervention and every improvisation. Each became a fix or a warning.
Corrections are never deleted: the wrong instruction stays in the file, struck
through with ❌ and the reason, because deleted lessons get re-derived from scratch
six weeks later.

The working habits that emerged were reviewed against Anthropic's published best
practices and folded into
[`vault/working-with-claude.md`](vault/working-with-claude.md) — the file Claude
coaches your team from: the 20-second delegation rule, evidence-not-assurances,
plan-first-on-big-jobs, the two-corrections stop rule, and the automation ladder.

A sample of what broke on real machines, and what the kit does about it:

| What happened | What the kit does now |
|---|---|
| The very first command failed **silently** — the shell rewrote it so it ran nothing and printed plausible output | Every command is written for the shell Claude actually runs in, and the trap leads the runbook |
| **Five separate lookups** said the machine was broken when it was fine | "Enumerate, never predict" is the first rule in the runbook, ahead of every step |
| The email tools were **silently absent** after a restart — no error, no prompt, and restarting again makes it worse | Microsoft 365 now connects through the app's own Connectors screen, where that failure class does not exist; the config-file path and its tested repair live in the appendix |
| A convenience shortcut made the folder picker show a "wrong" path — users named it the low point of their week | The step is deleted. It manufactured a failure signal on working machines and bought nothing |
| A calendar permission asked for one level too broad satisfied **none** of the calendar tools — days lost to IT round-trips | The IT page pre-answers the scope questions for both connector paths, that trap included |
| The assistant **never once wrote the email draft** the whole safety model exists to hand over — and nobody noticed for days | The install ends by writing one real draft, not just proving that sending is impossible |
| A whole group session disappeared into connector triage | Step 6: one person at a time, never a group |

## The safety model, in detail

- **Claude cannot send email.** The Microsoft 365 connector's write permissions are
  consented, then `Mail.Send` is revoked on its enterprise app in Entra — drafting
  works, sending is absent at the permission layer. The Claude app adds its own
  backstop: send-type tools can never be blanket-approved. The install tests the
  absence and stops the line if a send ever succeeds.
- **Delegated access only.** Claude signs in as the user, in the user's browser, and
  sees only what that person already sees. No passwords touched, nothing stored in
  files — the connection lives in the app's own Connectors screen.
- **Recoverability-based autonomy.** The rulebook hands over everyday document work
  (edits and deletes are versioned and recycle-binned) and keeps bulk changes,
  anything unrecoverable, and anything customer-facing, financial, legal or HR with
  the human.

## What's in the box

```
vault/                        ← the download; whatever goes on a machine is a copy of this
├── SETUP-NEW-MACHINE.md      ← detects the OS, routes Claude to the platform runbook
├── setup/
│   ├── windows.md            ← the tested runbook, written to Claude, not to you
│   ├── mac.md  linux.md      ← stubs holding the slots, honest about status
├── CLAUDE.md                 ← the rulebook. Thin on purpose; grows by appended incidents
├── working-with-claude.md    ← the habits and the automation ladder Claude coaches from
├── About/                    ← worked example (fictional org) — replace with your business
├── tools/pdf/                ← markdown or HTML → branded PDF, no installs needed
├── voice/  today/            ← filled on install day from each person's own mail and week
└── install-logs/             ← one file per machine; template at the bottom of the runbook
docs/
├── microsoft-365-admin-setup.md ← who does what: org admin, IT provider (forwardable), user
└── harvest-lessons.md           ← the feedback loop that built this kit — run it after a week
```

The organisation in `About/` — Northwind Producers Association — is fictional, in the
tradition of Microsoft's Northwind Traders, as are the people in it.

## Contributing

Ran an install? A week later, run
[docs/harvest-lessons.md](docs/harvest-lessons.md) — it has Claude mine its own
install log and session history, interview the person about what no log can hold,
and produce a de-identified report. Open it as an issue, or as a PR that folds the
finding into the runbook with the ❌ convention. Verbatim error text is the most
valuable thing you can send. **Pioneer runs on macOS or Linux are the most wanted
contribution** — the stubs in `vault/setup/` say exactly what is unknown.

## About

Maintained by [Doug Hudgeon](https://github.com/hudgeon), co-author of *Machine
Learning for Business* (Manning) — this repo carries that book's premise into the
agent era: the shortest path from AI to a small team's real work. [MIT](LICENSE).
