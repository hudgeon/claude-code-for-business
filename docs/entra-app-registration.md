# Microsoft 365 access for Claude — the IT admin page

**For:** the IT administrator of the Microsoft 365 tenant.
**Time:** about 15 minutes, once, for the whole organisation.

**Do this days before any install, not on the morning.** On the real deployments this
kit was built from, the people being set up were asked where they would have given up
doing it alone; the answer was not any technical step — it was *waiting on access
approvals*. Everything on this page can be finished before anyone sits down.

## The design in one paragraph

Claude connects to Microsoft 365 through **Anthropic's official Microsoft 365
connector** — users click Connect inside the Claude app and sign in as themselves in
their browser. Access is **delegated**: each person's Claude sees only what that person
can already see. The connector never sees or stores passwords (OAuth on-behalf-of).
Your job is three consents and one deliberate revocation.

## Step 1 — Enable the connector for the organisation

A Claude **org admin** (Team/Enterprise plan): **Organization settings → Connectors →
+ Add → Microsoft 365 → Add to your team.**

## Step 2 — Tenant consent (read)

A **Microsoft Entra Global Administrator** grants a one-time consent: in the Claude
app, **Settings → Connectors → Microsoft 365 → Connect**, authenticate, and tick
**"consent on behalf of your organization."** Until this is done, every ordinary user
who clicks Connect sees *"approval required — your admin has been notified"* and is
stuck. (On a real deployment this stall consumed most of a group session.)

The read set is `User.Read` plus read-only Mail, Calendar, Chat, Files and Sites
permissions.

## Step 3 — Enable write tools, then take back sending

Drafting email is the core of this kit, and drafting is a **write** capability. Write
tools need: Entra admin re-consent to the write set (`Mail.Send`, `Mail.ReadWrite`,
`Calendars.ReadWrite`, `Files.ReadWrite.All`, `MailboxSettings.ReadWrite`), the Claude
org admin enabling write tools in connector settings, and **every user disconnecting
and reconnecting**.

🔴 **`Mail.Send` is in that set, and send cannot be excluded at consent time — drafts
and send travel together. So consent to the write set, then revoke `Mail.Send` on the
connector's enterprise application in Entra** (Enterprise applications → the Microsoft
365 connector app → Permissions → revoke `Mail.Send`). Drafting keeps working; sending
is absent at the permission layer — not blocked by a rule software has to remember to
obey. **This is the single most important step on this page.**

Two further facts that make this robust:

- The Claude app never allows send-class tools (`outlook_send_email`,
  `outlook_send_draft`, `outlook_forward_mail`) to be blanket-approved — even where
  they exist, each use needs an explicit per-request approval. That is
  defence-in-depth, not the control. The revocation is the control.
- The install ends with an empirical check that sending genuinely fails
  (runbook B3). If it succeeds, the revocation was missed — the installer will be in
  touch.

## Step 4 — Restrict who can use it, and confirm in writing

Optionally scope the connector's enterprise app to named users or a pilot group via
**assignment required**. Either way, **reply confirming who is enabled, naming the
people** — on a real deployment, access was *reported* granted with no confirming
record, and the resulting stall was nobody's fault and everybody's problem.

## Conditional Access — one check, one genuine gotcha

MFA and group policies work as normal; device compliance is evaluated at connection
time. 🔴 **But connector traffic originates from Anthropic's IP range
(160.79.104.0/21), so any policy that limits sign-ins to your network or VPN blocks
the connector for every member.** Say now whether such a policy is in force, rather
than discovering it on the day.

## After any later permission change

Changing scopes invalidates existing connections — users see the connector silently
stop working. The fix is disconnect → reconnect → fully restart the Claude app. **Have
one person verify the change end to end before the rest of the team reconnects** — a
scope change pushed to everyone at once logged all three users out simultaneously on a
real deployment.

---

## Alternative: self-hosted app registration (advanced)

If you cannot or will not enable the org connector, the kit has an older, fully
self-hosted path: your own single-tenant Entra app registration driving a local MCP
server, where the no-send guarantee is achieved by **never consenting `Mail.Send` in
the first place**. It is more moving parts on every machine (Node, per-machine
approvals, device-code sign-in) and is now the fallback, not the default. If you go
this way:

- Register a single-tenant app; **Allow public client flows = Yes** (device-code
  sign-in fails with `AADSTS7000218` without it); redirect URI `http://localhost`.
- Delegated permissions, admin-consented: `Mail.ReadWrite`, `Files.ReadWrite`,
  `offline_access` (+ default `User.Read`). **Never `Mail.Send` — not to be helpful,
  not to test something.** Entra issues tokens carrying every consented scope
  regardless of what a client requests, so a consent cannot be clawed back by client
  configuration.
- Calendar, if wanted: **`Calendars.ReadWrite`, not `Calendars.ReadWrite.Shared`** —
  on a real deployment the `.Shared` variant satisfied none of the local server's
  calendar tools and cost four days and two support round-trips.
- Assignment required = Yes; assign the named people; confirm in writing.
- Device-code flow must be permitted for this app (`AADSTS53003` means Conditional
  Access blocks it, and this path cannot work there).
- Hand back the client ID and tenant ID — identifiers, not secrets.

The machine-side procedure for this path lives in the runbook's appendix.
