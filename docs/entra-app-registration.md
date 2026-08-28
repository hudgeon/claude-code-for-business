# Registering Claude in Microsoft Entra ID

**For:** the IT administrator of the Microsoft 365 tenant.
**Time:** about 20 minutes, once, for the whole organisation.

You register a single-tenant application in your own directory. You own it, you consent
to it, and you can revoke it. No credential is created and nothing is shared with anyone
— the two IDs it produces are public identifiers, not secrets.

**Do this days before the install, not on the morning.** On the real deployments this
kit was built from, the people being set up were asked where they would have given up
doing it alone; the answer was not any technical step — it was *waiting on access
approvals*. Everything on this page can be finished before anyone sits down.

## The design in one paragraph

Access is **delegated**, not application-level. Claude signs in **as the user**, and can
only ever see what that person can already see — their own mailbox, their own files.
There is no app-level mailbox permission, so the app cannot reach anybody else's mail.
Each person signs in on their own machine; the token lives in that machine's credential
store. Revoke a user's assignment and their access ends.

## What is deliberately NOT requested

| Not requested | Why it matters |
| --- | --- |
| **`Mail.Send`** | **Claude cannot send email.** It reads and writes drafts; a person presses Send. Withholding the scope makes sending impossible at the permission layer, not blocked by a rule software has to remember to obey. **This is the single most important line on this page.** Entra issues tokens carrying *every* scope ever consented on the app, no matter what a client later requests — so if `Mail.Send` is ever consented "to test something", no client-side setting takes it back. |
| Any `.Shared` mail scope | No shared or delegated mailboxes — only the signed-in user's own. |
| `Sites.*` / SharePoint Graph access | Shared files are reached through the normal OneDrive sync client, as a folder on the PC. This is also why the shared vault keeps working when the connector is down. |
| Any **application** (app-only) permission | The app holds no standing access of its own. |

## Step 1 — Register the application

1. Sign in to the [Microsoft Entra admin centre](https://entra.microsoft.com) as at
   least an **Application Developer**.
2. **Entra ID → App registrations → New registration.**
3. Name: `Claude — Microsoft 365`. Supported account types: **this organizational
   directory only** (single tenant). Leave Redirect URI blank for now. **Register.**
4. From **Overview**, copy the **Application (client) ID** and **Directory (tenant)
   ID**. Both go back to whoever runs the install (step 5).

## Step 2 — Authentication

1. **Authentication → Add a platform → Mobile and desktop applications.** Under custom
   redirect URIs enter exactly `http://localhost` — no port. **Configure.**
2. Still on Authentication: **Advanced settings → Allow public client flows → Yes.**
   🔴 This one is load-bearing. The kit signs in with the device-code flow, and with
   this set to No every sign-in fails with `AADSTS7000218`.
3. **Save.**

## Step 3 — API permissions

All **delegated**, Microsoft Graph:

| Permission | Allows | Admin consent |
| --- | --- | --- |
| `Mail.ReadWrite` | Read mail; create and edit **drafts**; move and flag. **Does not permit sending.** | Yes |
| `Files.ReadWrite` | Read and write the user's own OneDrive. | Yes |
| `User.Read` | The user's own basic profile. Present by default. | No |
| `offline_access` | Token refresh, so sign-in isn't hourly. | No |

1. **API permissions → Add a permission → Microsoft Graph → Delegated.** Tick
   `Mail.ReadWrite`, `Files.ReadWrite`, `offline_access`.
2. **Do not add `Mail.Send`.**
3. **Grant admin consent** for the tenant, so users are never shown a consent prompt
   they'd have to judge themselves.

The page should now show exactly those four delegated permissions, all **Granted**.

### If calendar access is wanted (optional)

Add delegated **`Calendars.ReadWrite`** — 🔴 **not `Calendars.ReadWrite.Shared`**. On a
real deployment the `.Shared` variant cost four days and two support round-trips: the
connector this kit uses derives its required scopes such that `.Shared` satisfies *none*
of its calendar tools, whatever Microsoft's permission documentation implies. The
correct ask is the plainer, narrower permission. Note that adding any permission later
invalidates cached sign-ins — users see `Silent token acquisition failed` and must
disconnect, reconnect and sign in again — which is one more reason to settle the scope
list now.

## Step 4 — Restrict who can use it, and confirm it in writing

1. **Entra ID → Enterprise applications → the app → Properties → Assignment
   required? → Yes. Save.**
2. **Users and groups → Add user/group** — assign only the intended people.
3. **Reply confirming the assignment, naming the people.** On a real deployment,
   assignment was *reported* done with no confirming record, and an unassigned user is
   the likeliest sign-in failure (`AADSTS50105`) on install day.

## Step 5 — Hand back two values

To whoever is running the install: the **client ID**, the **tenant ID**, confirmation
that **admin consent** is granted, confirmation of **who is assigned**, and anything
from the check below. Plain email is fine — neither ID is a secret, and no client
secret or certificate exists in this design.

## The one check — Conditional Access

Sign-in happens in the user's own browser, so MFA, named locations and session
lifetimes all apply exactly as they do for Outlook. Nothing needs relaxing.

🔴 **This kit signs in with the device-code flow — it is the only interactive flow the
connector offers.** Microsoft (reasonably) recommends blocking device code where
possible, so many hardened tenants do. If a Conditional Access policy blocks it for
these users, sign-in fails with `AADSTS53003` and **this kit cannot connect** — the
options are a narrow, documented, user-scoped exclusion, or not using the kit. Please
say now whether such a policy is in force, rather than discovering it on the day.
(Policies match on the resource, not the client app, so any exception has to be scoped
to **users** — a public client can't be selected in the policy app picker.)

Also worth confirming: any policy requiring an **approved client app / app protection
policy**, or **compliant / hybrid-joined devices**, for these users — the first blocks
this design; the second is fine if the laptops are actually enrolled and compliant.
