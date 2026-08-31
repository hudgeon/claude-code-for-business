# Harvesting lessons after an install

This kit got good by folding real install logs and a week of real use back into the
runbook — every ❌-struck correction in the platform runbooks under `vault/setup/` was
paid for on a real
machine. The loop only works if it keeps running, so: about a week after an install,
have each person run the prompt below on their own machine, then open a GitHub issue on
this repo with the report (or a PR against the runbook, if the fix is obvious).

Three design notes, all learned the hard way:

- **The person will not remember what broke or how it was fixed. Claude's own record
  will.** So the prompt makes Claude mine the install log and session history *first*,
  and interview the person only about what no log can hold — where they felt lost, what
  they quietly stopped using, where they'd have given up alone.
- **The report is de-identified by construction**, with a second dedicated redaction
  pass, and the person reviews the flagged judgment calls before anything leaves their
  machine. Error text stays verbatim (it is the most valuable content); names, paths,
  identifiers and anything quoted from real correspondence do not.
- **The best findings are not in any log.** The most valuable report received so far came
  from reading the kit's own files against each other and against how that machine was
  really configured. It found a rule contradicting another rule thirteen lines away, a
  safety claim that quietly stopped being true once a machine ran two connectors at once,
  and a diagnosis table with no row for a failure that had been escalated to IT three
  times. No install log would have surfaced any of those, and no person could have been
  asked about them — so step 2b below asks for that pass explicitly.

## Send this to each person

> Hi — I need about five minutes to improve the setup guide we used on your laptop.
> Open Claude, go to the Code tab, open the vault folder, and paste everything below
> the line. It will ask a handful of quick questions — mostly multiple choice — then
> write something up. Send me back what it writes.
>
> ────────────────────────────────
>
> Before you ask me anything, work out what you already know.
>
> 1. READ your own record: the setup runbook in this folder and the install log for
> this machine, any corrections made to the runbook during or after the install, the
> rulebook (CLAUDE.md) and every rule appended since, and your own session history with
> me since setup.
>
> 2. WRITE DOWN FOR YOURSELF — do not ask me any of it — everything the record already
> tells you: each step that failed and the exact error, each point where a person
> stepped in and did something you couldn't, each time you improvised past the written
> instructions, each rule added to the rulebook and the incident behind it, and what
> I've asked you to do repeatedly versus asked once and never again. I will not
> remember any of this. You have it written down. If the install log for this machine
> is missing or thin, say so plainly in your report rather than filling the gap with
> guesses.
>
> 2b. NOW READ THE KIT AGAINST ITSELF, and against this machine as it is actually set up
> today. Still ask me nothing. Where do two instructions disagree — and which one does a
> reader hit first? Where does a claim hold only for a configuration this machine no
> longer has, or never had? Where was a correction applied in one place and left wrong in
> another? Where did you hit the same wall more than once with no row in any
> troubleshooting table for it? Quote both sides with the file and the line, and say
> which version is right and why. This is not in any log and I cannot be asked about it,
> and it has produced the most valuable findings this kit has had.
>
> 3. THEN ASK ME only what your record cannot tell you — how it felt, what confused
> me, what I've quietly stopped using, what I'd have done without help in the room.
>
> Rules for the questions:
> - Ten at most. One at a time. One line each.
> - Multiple choice wherever possible. Build the options from your own record and let
>   me pick a letter — don't make me compose an answer.
> - Always include "something else" and "don't remember" as options. "Don't remember"
>   is a real answer and I'll use it.
> - Never ask me to recall an error message, a step, a setting or how something got
>   fixed. You know those. I don't.
> - Plain language only: no technical terms, no step numbers, no file paths.
> - Where you're checking a fact you already hold, put your version in the question
>   and let me confirm or correct it.
> - Ask what only I can answer: the moment I felt lost, anything I expected to be
>   asked and wasn't, what I've stopped using and why, whether "you draft, I send" has
>   ever been awkward, and where I'd have given up if I'd been doing this alone from
>   written instructions with nobody in the room.
>
> 4. THEN WRITE THE REPORT in the chat so I can copy it, under these headings: what
> broke (with the exact errors, from your record); every point a human had to step in
> and why you couldn't do it; every time you improvised past the instructions; what a
> stranger doing this alone would have hit; what has changed since setup, including
> rules added and the incident behind each; what I use it for now and what I
> abandoned; and my answers, in my words.
>
> REDACTION — this may be shared publicly, so the report must contain no names of
> people or organisations (use roles: "the CEO", "our IT provider", "a member
> organisation"), no email addresses, phone numbers, ticket numbers or account IDs, no
> links to our sites or document libraries, no file paths with a username or our
> organisation's name in them (write C:\Vault instead), nothing quoted from our
> emails, documents or calendar, no financial figures, and no comment on any named
> person's ability.
>
> Keep the technical error messages — they're the most valuable thing in the report.
> Just strip usernames and paths out of them.
>
> When the report is done, read it back once looking only for breaches of those rules,
> fix them, and list at the end anything you weren't sure about so I can decide before
> sending.

## What to do with the reports

Fold what they prove back into the runbook **in place**, with the ❌ convention: strike
the wrong instruction, state what replaced it and why, never delete it. A deleted
correction gets re-derived from scratch six weeks later. 🔴 **Then apply that correction
everywhere the old rule is stated — the most general statement of it first**, and grep the
kit for the old wording before calling it done; a fix that lands in one section and not the
other leaves the wrong version where the next reader meets it first. Then bump the version
at the top and note the change. PRs that follow that shape are very welcome here.
