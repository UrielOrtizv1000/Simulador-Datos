# Security Policy

This project is a static study tool: plain HTML, CSS and JavaScript with no
backend, no account and no telemetry. The page and the question bank are served
as files from wherever you host them, and the attempt lives only in memory while
the tab is open — there is no `localStorage`, no cookie and no request beyond the
one for the web fonts.

## Reporting a vulnerability

Open a private report through **Security → Advisories → Report a vulnerability**
in this repository. Please do not use public issues for anything security
related.

Expect an initial reply within a week. This is a personal project, so fixes land
on `main` as they are ready rather than on a scheduled release train.

## Scope

Relevant: cross-site scripting through question content or the answer rendering
code, a GitHub Actions workflow that a fork could abuse, and the third-party
assets the page loads (currently the Silkscreen and Plus Jakarta Sans families
from Google Fonts). Not relevant: the wording or the accuracy of the questions
themselves — open an issue instead — or the fact that the whole bank is readable
in `js/preguntas.js`, which is how a study tool is supposed to work.
