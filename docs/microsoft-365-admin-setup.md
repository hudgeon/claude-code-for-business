# Microsoft 365 access for Claude — who does what

Three different people touch this page, and mixing their jobs up is how deployments
stall. A small organisation typically holds the first role itself and its **third-party
IT provider** holds the second — so Part 2 is written to be **forwarded verbatim** to a
Microsoft administrator who has never heard of this project.

| Step | What | Who | Where |
|---|---|---|---|
| 1 | Add the Microsoft 365 connector to the Claude workspace, enable write tools | **Claude org admin** — someone at your company | claude.ai organization settings |
| 2 | Tenant consent, the `Mail.Send` revocation, user assignment | **Microsoft Entra administrator** — usually your IT provider | Microsoft Entra admin centre |
| 3 | Click Connect and sign in | **Each user** — during their install, driven by the runbook | The Claude app |

Do steps 1 and 2 **days before any install, not the morning of.** On the real
deployments, people were asked where they would have given up working alone; the answer
was "waiting on access approvals," every time.

## The design in one paragraph

Claude connects through **Anthropic's official Microsoft 365 connector**. Access is
**delegated**: each person signs in as themselves, in their own browser, and their
Claude sees only what they can already see. The connector never sees or stores
passwords (OAuth 2.0 on-behalf-of). The safety headline: **drafting email is enabled;
sending is not** — enforced in Entra, not by a rule software has to remember to obey.

---

## Part 1 — the Claude org admin (your company, ~5 minutes)

1. In claude.ai: **Organization settings → Connectors → + Add → Microsoft 365 → Add to
   your team.**
2. **Enable write tools** in the connector's settings — drafting email is a write
   capability, so the kit needs this on. (Coordinate with Part 2: write tools also need
   your Microsoft administrator's consent, and users connect only after both halves are
   done.)
3. **Forward Part 2 of this page to whoever administers your Microsoft 365** — with the
   ticket open until they have replied in writing.

Anthropic's own instructions for this whole flow:
[Set up the Microsoft 365 connector](https://support.claude.com/en/articles/12542951-set-up-the-microsoft-365-connector).

## Part 2 — the brief for the Microsoft administrator (forward from here down)

> You administer a Microsoft 365 tenant. Your customer is connecting **Claude**
> (Anthropic's AI assistant) to it via Anthropic's official Microsoft 365 connector —
> delegated OAuth on-behalf-of; each user signs in as themselves; no passwords are seen
> or stored; no application-level mailbox access. Vendor references:
> [setup guide](https://support.claude.com/en/articles/12542951-set-up-the-microsoft-365-connector)
> · [security guide](https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide).
> Five tasks, portal-only, with the Microsoft documentation for each.

**1. Grant tenant-wide admin consent — read set.** Sign in as a role that can consent
(Privileged Role, Cloud Application, or Application Administrator). Easiest route: in
the customer's Claude app, click Connect on the Microsoft 365 connector, authenticate,
and tick **"consent on behalf of your organization"**; Anthropic's setup guide also
documents a Graph Explorer route. The read set is `User.Read` plus read-only Mail,
Calendar, Chat, Files and Sites scopes.
📄 [Grant tenant-wide admin consent to an application](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/grant-admin-consent)

**2. Consent the write set** when the customer enables write tools: `Mail.Send`,
`Mail.ReadWrite`, `Calendars.ReadWrite`, `Files.ReadWrite.All`,
`MailboxSettings.ReadWrite`. Send and draft travel together at consent time — they
cannot be consented separately. That is what task 3 is for.

**3. 🔴 Revoke `Mail.Send` — the one task that matters most.** The customer's policy is
that Claude drafts email and a human sends it, enforced at the permission layer. In the
[Microsoft Entra admin centre](https://entra.microsoft.com): **Entra ID → Enterprise
apps → All applications →** the Microsoft 365 connector's app → **Security →
Permissions → Admin consent** tab → the **…** control on the `Mail.Send` row →
**Revoke permission.** Drafting (`Mail.ReadWrite`) keeps working.
📄 [Review and revoke permissions granted to enterprise applications](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/manage-application-permissions)

**4. Recommended: require assignment, and assign the named users.** On the same
enterprise application: **Properties → Assignment required → Yes**, then **Users and
groups → Add user/group.** Two benefits: only the named people can connect, and — per
Microsoft — an app that requires assignment does not accept user self-consent, which
keeps the task-3 revocation authoritative.
📄 [Restrict a Microsoft Entra app to a set of users](https://learn.microsoft.com/en-us/entra/identity-platform/howto-restrict-your-app-to-a-set-of-users)
· [Manage users and groups assignment](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal)

**5. Check Conditional Access.** MFA and device-compliance policies work normally. 🔴
But the connector's requests originate from **Anthropic's IP range (160.79.104.0/21)**,
so any policy restricting sign-ins to the customer's network or VPN blocks the
connector for every user. Say so now rather than letting it surface on install day.

**Then reply to your customer, in writing, confirming four facts:** consent granted
(read and write sets) · `Mail.Send` revoked · who is assigned, by name · whether any
Conditional Access policy applies. On a real deployment, access that was "reported
done" with no written record produced a multi-day stall that was nobody's fault and
everybody's problem.

**Two things worth knowing for later.** If users see *"approval required — an admin has
been notified"*, that is the admin consent workflow routing a request to you — approve
it or complete task 1 (📄 [Configure the admin consent workflow](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-admin-consent-workflow)
· [Review admin consent requests](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/review-admin-consent-requests)).
And any future scope change silently invalidates every user's connection — they must
each disconnect and reconnect, so agree changes with the customer, who will have one
person verify before the rest reconnect.

The customer's install ends with an empirical check that sending genuinely fails; if a
send ever succeeds, task 3 was missed and you will hear from them.

## Part 3 — each user (during the install; nothing to do beforehand)

In the Claude app: **Settings → Connectors → Microsoft 365 → Connect**, then sign in as
themselves in the browser. The install runbook drives this at its step A7, verifies the
connection with real calls, and tests that sending is absent. One defence-in-depth fact:
even where send tools exist, the Claude app never allows them to be blanket-approved —
each send would need an explicit per-request click. That is a backstop, not the control;
the task-3 revocation is the control.

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
