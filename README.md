# ApplyPilot

ApplyPilot is a zero-dependency local website for managing full-time job applications in the USA.

## What it does

- Stores your resume-derived profile in local browser storage.
- Parses pasted resume text to prefill common application fields.
- Generates a bookmarklet that fills many job portal forms but never submits them.
- Tracks each role from saved to submitted, interviewing, offer, or rejected.
- Imports and exports tracker data as JSON backups.

## Run it locally

Open [index.html](/Users/guarav.gupta/Documents/New%20project/index.html) directly in a browser, or serve the folder locally:

```bash
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## How to use it

1. Paste your resume text into the Resume Studio and click `Parse resume text`.
2. Review and save your structured profile.
3. Drag the generated bookmarklet into your bookmarks bar.
4. Add job targets to the tracker with their application links.
5. Open a job application page and click the bookmarklet to prefill fields.
6. Review everything manually and click the real submit button yourself.
7. Come back to ApplyPilot and update the job status.

## Important limits

- Browser security prevents a normal website from automatically controlling other sites, so the autofill flow uses a bookmarklet.
- Sensitive EEO questions are intentionally left for manual review.
- Some portals may use unusual field names, so not every field can be matched automatically.
