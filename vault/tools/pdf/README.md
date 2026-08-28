# Making PDFs from vault documents

**You are Claude, and this is your tool.** When someone asks for a PDF — a board paper, a
member letter, an event runsheet, a designed weekly page, anything that leaves the building
as a document — this is how it gets made. Nobody here runs these commands; they ask you.

## The one rule that matters

**The source file in the vault is the master. The PDF is an output.** Never edit a PDF,
never make a `.docx` or PDF the working copy, and never fix a layout problem in a markdown
document by touching the CSS in `make-pdf.mjs` — fix the markdown. When the document
changes, rebuild.

## How to build

From the vault root:

```
node tools/pdf/make-pdf.mjs path/to/document.md
```

- The PDF lands **next to the source file**, same name — easy to find in SharePoint, easy
  to attach.
- **While a document is still being reviewed, always pass `--draft`** — it stamps a DRAFT
  watermark across every page. Drop the flag only when the owner says it is final.
- `--out some/other/path.pdf` overrides the destination if asked.

## Two kinds of input, and picking the wrong one throws work away

| Input | What happens | Use it for |
|---|---|---|
| `.md` | Frontmatter stripped, `[[wikilinks]]` flattened, converted with `marked`, wrapped in the branded template | Board papers, letters, runsheets — anything that is prose |
| `.html` (a complete page) | **Printed as it stands.** Its own CSS is kept; the branded template is not applied | Designed pages — cards, progress bars, colour coding |
| `.html` (a fragment, no `<html>`) | Wrapped in the branded template like markdown | Hand-built tables and blocks |

🔴 **Do not route a designed page through markdown.** It throws away the cards, the
progress bars and the colour coding, which is most of what such a page is for. That is
exactly why this tool was extended on 28 Aug 2026 — before it, a designed page had to be
turned into a PDF by driving a browser by hand.

Images referenced from either input are embedded, so the file survives being printed from
the temp folder. Intermediate files go to the OS temp folder, never into the vault.

## Rules that follow from the vault's own

- **A PDF never sends itself.** Attach it to a draft; a person sends. Same boundary as
  email, no exceptions.
- Rebuilding overwrites the previous PDF of the same name. That is correct — the PDF is an
  output, not a record. SharePoint version history has the old one.
- Content rules still apply: nothing from the excluded categories (HR, legal, complaints,
  board-in-confidence) goes into a document about to be attached and sent.

## First run on a machine

The install (step A9) warms this up. If it was skipped: the first build needs network once,
for `npx` to fetch the pinned `marked` — after that it runs from the local cache. Edge needs
nothing. **HTML input needs neither** — no `npx`, no network, ever.

❌ *If you are reading an older note that says to call the runtime by its full path because
PATH is not live until the restart: that advice was the bug, and it failed on all three
machines with `'"node"' is not recognized as an internal or external command`. `npx`
re-invokes a **bare** `node`, so calling the parent by full path does not help the child.
**The script now prepends its own runtime directory to PATH for that one call**, so a
full-path invocation works before the restart. Do not reinstate the old advice.*

**[Mac]** No Edge at that path — the script falls back to Chrome, or set
`VAULT_BROWSER_PATH` to the browser executable.

## Branding — two things to fill in

1. **Logo:** drop the organisation's logo in this folder as `logo.png` and it appears
   top-right on page one of a branded build. Until then, PDFs build without it.
2. **Accent colour:** the `ACCENT` constant at the top of `make-pdf.mjs` is a placeholder
   navy. Get the real hex from whoever owns the brand and change the constant once.

Neither applies to a complete HTML page — that page carries its own design.

## Known limits — say them, don't work around them

- **No page numbers.** Edge's command-line printing doesn't support them. If someone
  genuinely needs numbered pages (long board packs), escalate — that is a tooling change,
  not something to improvise per document.
- One source file → one PDF. No merging into a pack yet — same escalation if it comes up.
