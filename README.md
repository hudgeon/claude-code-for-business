# Claude on Windows + Microsoft 365

A setup runbook **that Claude executes itself**, and the shared-vault starter kit it
installs. For small teams of non-technical people — a CEO, an operations manager, a
communications lead — on Windows and Microsoft 365, who want an assistant that reads
their own mail and files, drafts everything in their own voice, and **sends nothing,
ever**.

Nobody opens a terminal. A person installs two things by hand, opens a folder in the
Claude Desktop app, and says one sentence. Claude does the rest — including installing
Node into the user's own profile — and **no administrator rights are needed anywhere**
(verified on three machines).

## Built from real installs, not theory

This kit v1.3 is rewritten from three real deployments — one machine first, two more
four days later — plus a week of real daily use, with an expert in the room logging
**every** human intervention and every improvisation. Each of those became either a fix
or a warning in the runbook. Corrections are never deleted: the wrong instruction stays
in the file, struck through with ❌ and the reason, because deleted lessons get
re-derived from scratch six weeks later.

A sample of what broke, and what the runbook now does about it:

| What happened | What the runbook does now |
|---|---|
| The very first command failed **silently** — Git Bash rewrites a lone `/c` so `cmd.exe` runs nothing and prints plausible output | Every command is written for the shell Claude actually runs in, and the trap leads the file |
| **Five separate lookups** said the machine was broken when it was fine — registry, cloud listing, a copied path, the folder picker, the tool list | "Enumerate, never predict" is the first rule in the runbook, ahead of every step |
| The email tools were **silently absent** after the restart on two machines — no error, no prompt, and restarting again makes it worse | A dedicated step writes the per-machine approval the app never asks for, with a tested helper script |
| A convenience symlink made the folder picker show a "wrong" path — both later users named it the low point of their week | The step is deleted. It manufactured a failure signal on working machines and bought nothing |
| A calendar permission was asked for one level too broad and satisfied **none** of the calendar tools — four days, two IT round-trips | The IT request page names the exact scopes, including that trap |
| Across twenty sessions, the assistant **never once wrote the email draft** that the whole safety model exists to hand over | The install now ends by writing one real draft, not just verifying that sending is impossible |
| The jobs chosen at setup were not the jobs that stuck | The kit asks people what they want handed over, and lets them bring their own first job |

## The safety model

- **Claude cannot send email.** `Mail.Send` is never consented on the app registration,
  so sending is absent at the permission layer — not blocked by a rule software has to
  remember to obey. The install demonstrates the absence to the person.
- **Delegated access only.** Claude signs in as the user, in the user's browser, and
  sees only what that person already sees. No app-only permissions, no client secret,
  nothing to rotate.
- **Recoverability-based autonomy.** The rulebook the kit ships hands over everyday
  document work (edits and deletes are versioned and recycle-binned) and keeps bulk
  changes, anything unrecoverable, and anything member-facing, financial, legal or HR
  with the human — rules that survived a week of real work, unlike the cautious
  append-only version they replaced.

## Requirements

- Windows 10/11. (Mac variants are flagged `[Mac]` in the runbook but Windows is the
  tested path.)
- Microsoft 365, with an admin who can register an Entra app —
  [docs/entra-app-registration.md](docs/entra-app-registration.md), ~20 minutes, once.
- Claude Desktop on a paid plan, **with the seat assigned to the person** — an upgrade
  prompt at sign-in means the seat, not the app, and it can stall a whole session.
- Git for Windows on each machine (the Code tab won't start a local session without
  it — which is also why Claude can't install it for you).

## Quick start

1. **Days before, not the morning of:** IT registers the app
   ([docs/entra-app-registration.md](docs/entra-app-registration.md)) and hands back
   the client ID and tenant ID; seats are confirmed assigned. On the real installs,
   "waiting on access" was where people said they would have given up.
2. Download this repo and put the `vault/` folder on the machine (anywhere — the
   install moves it into a synced SharePoint library and the session follows it).
3. Fill the two IDs at the top of `vault/SETUP-NEW-MACHINE.md`.
4. Replace the worked-example `vault/About/` files with your own organisation
   ([vault/About/README.md](vault/About/README.md)).
5. Open Claude Desktop → **Code** → **Local** → select the `vault` folder, and say:

   > **Read SETUP-NEW-MACHINE.md and walk me through it.**

Claude prepares the machine (~20 minutes, the person mostly watching), the person signs
in once in their browser, and the session ends with their mail read, their voice
captured, a real draft in their Drafts folder, and one real job of their choosing done.

## What's in the box

```
vault/                       ← the download; whatever goes on a machine is a copy of this
├── SETUP-NEW-MACHINE.md     ← the runbook, written to Claude, not to you
├── CLAUDE.md                ← the rulebook. Thin on purpose; grows by appended incidents
├── About/                   ← worked example (fictional org) — replace before installing
├── tools/pdf/               ← markdown or HTML → branded PDF, no installs, Edge headless
├── voice/  today/           ← filled on install day from each person's own mail and week
└── install-logs/            ← one file per machine; the template is in the runbook
docs/
├── entra-app-registration.md  ← the one page your IT admin needs
└── harvest-lessons.md         ← the feedback loop that built this kit — run it after a week
```

The organisation in `About/` — Northwind Producers Association — is fictional, in the
tradition of Microsoft's Northwind Traders, as are the people in it.

## Contributing

Ran an install? A week later, run
[docs/harvest-lessons.md](docs/harvest-lessons.md) — it has Claude mine its own install
log and session history, interview the person about what no log can hold, and produce a
de-identified report. Open it as an issue, or as a PR that folds the finding into the
runbook with the ❌ convention. Verbatim error text is the most valuable thing you can
send.

## License

[MIT](LICENSE).
