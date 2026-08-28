# install-logs/ — one file per machine, never shared

`machine-<n>-<role>.md`, using the template at the bottom of your platform's runbook
in `setup/` (`setup/windows.md` today).

Per-machine files, not a shared log, because on a real install a prepared edit to a
shared file — built against a version four minutes old — would have deleted 145 lines of
a parallel session's log. No warning, no conflicted copy, and the overwrite looks
exactly like success.

Write Part A before the mid-install restart and Part B before the person leaves. On two
of the three machines this kit was built from, Part B was never written at all — the log
got filled in while the install was interesting and stopped the moment real work
started.
