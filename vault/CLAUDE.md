# How to work here

You are working inside a shared vault. It syncs to every machine on the team through
SharePoint, so everything you write here is read by the whole team.

**Read `About/<the organisation>.md` before doing anything substantive.** Then read the
About file for whoever you are working with. **Read `working-with-claude.md` once per
session and coach from it** — it carries the working habits and the automation ladder,
one habit at a time, never as a lecture.

## The autonomy boundary

The test is **recoverability, not permission**. Documents here are versioned and deleted
files sit in a recycle bin for 93 days, so the useful question is *"is this recoverable,
and would anyone be surprised?"* — not *"may I edit this?"*

**Do end-to-end, no asking:** read and search mail, files and calendar; file and label
email; create drafts of anything; write, edit and delete inside this vault and the shared
document libraries.

**Always the human's, no exceptions:**

- 🔴 **Sending any external email.** You create drafts. A person sends. Every time.
- 🔴 **Bulk changes**, and anything that skips the recycle bin. Propose, then do it in
  small reviewable batches with a count you can verify at each stop.
- 🔴 **Anything member-facing, financial, legal, board or HR.**
- 🔴 **Portal or system actions with legal or financial effect.** You guide; the human clicks.

❌ *This file originally said append-only, never delete, ask every time. That was written
when the assistant could only reach a handful of notes, and the moment a real document
library came into scope it made ordinary work impossible. Replaced 21 Aug 2026 with the
recoverability test above. Do not reinstate — the cautious version does not survive contact
with real work, and shipping it costs a day.*

**Where a permission rests on a stated condition, it does not carry to a system that
lacks it.** Task lists have no recycle bin — delete a list and nothing offers it back. So
creating and reading tasks is yours; **every task delete asks**, including one created a
minute earlier.

**Connected systems of record — the CRM, the accounting package, the website.** Reading
and analysing is yours. **Every write is proposed in chat first**, and bulk writes stop
even when approved in principle. This is written down because the limits used to be
technical and are now behavioural: nothing in the tool prevents a bad bulk update to live
member data except this rule. Some object types happen to be read-only in the current
grant — that is the vendor's scope model, not a control, and it can change on any
reconnect.

## What never goes in this vault

- **Credentials — never, under any circumstance.** Tokens, passwords, connection strings,
  API keys. If a task ever produces one, stop, say so, and ask — a proper credential store
  gets set up for it rather than a file here.
- **HR, complaints, disputes, legal advice, board-in-confidence material.** Not because
  the vault is insecure — because the most widely-read files in the organisation are the
  wrong home for them.
- Ordinary member and sponsor business detail **is fine**. It is the organisation's own
  library, in its own tenant, read by staff who already see the same detail in their
  mailboxes.

## Working with files

- **A file here is a live document, not a snapshot.** Two or more machines sync this
  folder. **Re-read a rules file before acting on it, not just at the start of a session**,
  and **check a line count before and after any write.** Three near-misses landed in one
  hour: a prepared edit built against a version four minutes old would have deleted 145
  lines of another session's work; a rules file changed underneath a running session
  mid-task; and a third session wrote that a rule was "awaiting approval" two minutes after
  it had landed. **The sync service gives no warning, produces no conflicted copy, and an
  overwrite that destroys someone else's work looks exactly like success.**
- **One owner per file.** If a file is not yours, propose the change in chat instead of
  editing it.
- **Append dated entries at the bottom. Never rewrite the middle of a file.**
- **Per-person files for anything that churns** — then no two people ever write the same
  path.
- 🔴 **If you see a filename containing "conflicted copy" or a machine name, STOP and tell
  the user.** OneDrive has kept two versions and nobody has noticed.
- **Markdown (`.md`) for everything the assistant owns.** Word and PDF are *outputs* —
  build them at the end, from a source file. Never make a `.docx` the master copy.
- **Before writing any Excel or Word file:** snapshot it, make sure it is closed properly,
  write to the closed file, then verify every pre-existing row survived. Co-authoring
  against the cloud copy silently reverts writes made underneath it. **The same family of
  failure eats email drafts:** a draft assembled server-side vanished because Outlook had it
  open and wrote its own copy over the top on close. Any file a running program holds open
  is exposed the same way.

## PDFs

- **Built with `tools/pdf/`** — read `tools/pdf/README.md` before the first one. Never edit
  a PDF; fix the source and rebuild.
- **It takes HTML as well as markdown, and for a designed page HTML is the right input.**
  ❌ *The original rule read as "markdown or nothing", which was never true — routing a
  designed page through markdown throws away the cards, progress bars and colour coding that
  are most of what the page is for. Corrected 28 Aug 2026.*

## Writing rules and voice

- **Ask for a person's writing rules before drafting anything for them, not after.** Rules
  that arrive after a draft exists mean rework, and one email nearly went out wrong that way.
  If the answer does not come at setup, ask again at the first real draft, where answering
  costs nothing.
- **Match the writing to the person you are working for — see `voice/<name>.md`.** Each
  voice file states explicitly which of the other people's rules it does **not** inherit.
  Rule bleed is the failure mode of a shared notes folder.
- **Every draft carries that person's full signature**, internal and external alike. Never
  unsigned, never a placeholder. See `voice/signatures/<name>.md`.
- **Show, don't describe, any change to how someone's correspondence looks.** A shortened
  signature was agreed to in the abstract and rejected on sight of the rendered draft. The
  rule lasted ten minutes.
- **Stash every draft to `voice/drafts/` the moment you create it, and keep exactly one
  live draft per email.** A superseded draft that was never sent led to an apology being
  drafted for a reversal the recipient had never seen.
- **Send email bodies as full HTML with real paragraph tags, in a single call.** Plain text
  arrives as one run-on paragraph. Note that HTML collapses two spaces after a full stop
  down to one — if that is one of their rules, check the rendered draft.

## Reading mail

- **Filter before you retrieve, not after.** Exclude personal, medical, financial, HR,
  recruitment, legal, dispute, complaint, board and in-confidence material by sender and
  category *before* anything is retrieved.
- **Never assert a negative from a preview or a subject line.** Previews truncate exactly
  where answers sit. Open the message.
- **Read the sent items alongside the inbox.** The newest inbound message is not the state
  of a thread — someone who replied at 07:12 is not waiting on anyone.

## The dated-rule convention

Every rule added here carries **the date, who asked for it, and why**. When a rule is
superseded, strike it through with ❌ and add "do not reinstate" — never delete it. Deleted
rules get re-derived from scratch six weeks later.

## Rules added since setup

<!-- Append below. Format: **YYYY-MM-DD (who)** — the rule. Why it exists. -->

- **2026-08-24 (setup)** — This file starts deliberately thin. It becomes valuable through
  the habit of appending real incidents, not through being long on day one.
