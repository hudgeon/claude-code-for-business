# today/ — per-person day pages

One page per person: live this week, waiting-on, coming up. Written by Claude, readable by
the whole team from SharePoint in a browser — three people seeing each other's week
without a meeting about it.

**`<name>.md` or `<name>.html` — the layout decides, not a rule.** Markdown is the default
and previews natively in SharePoint. Reach for HTML when the layout is doing the work —
colour-coded cards, a waiting-on table, progress bars — and accept the trade: SharePoint
will not preview it in the browser, so build the PDF (`tools/pdf/`) as the thing people
actually open. What is never allowed is a `.docx` master. See `CLAUDE.md`, *Working with
files*.

Two rules paid for on real machines: read the **sent** items as well as the inbox before
listing anyone as "waiting on" (the newest inbound message is not the state of a
thread), and list only what is still outstanding — this page competes with the busiest
part of the morning, and it loses if it takes work to read.
