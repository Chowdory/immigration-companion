# StudyPath, Immigration Companion

A self-contained rebuild of the Base44 "Immigration Companion" template
(https://base44.com/templates/apps/view/immigration-companion). Seven pages, dark
dashboard UI, no build step and no backend: every page is plain HTML, CSS and
vanilla JavaScript, and all data lives in the browser's `localStorage`.

## Pages

| File | What it does |
| --- | --- |
| `index.html` | Dashboard: greeting, four overview stats, current permit status, program details, action-required alert, journey timeline, recent activity, upcoming deadlines |
| `applications.html` | Application tracker with search, status and type filters, create/edit/delete |
| `documents.html` | Document library with type filters, verification state, expiry warnings, upload/edit/delete |
| `calendar.html` | Month calendar plus reminders, add/edit/delete, mark done |
| `requirements.html` | Quick start guides, requirement tables, interactive document checklist, processing times, working fee calculator |
| `ai-advisor.html` | Chat advisor with a local knowledge base, quick questions and topic cards |
| `settings.html` | Profile, notification switches, privacy and data export/delete, preferences, account actions |

## Run it

No tooling required. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Deploying: any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
Upload the folder contents as they are, paths are all relative.

## What is real and what is demo

- Real: all CRUD flows (applications, documents, reminders, checklist, profile,
  settings), filtering, the fee calculator, the calendar, data export, and the
  persistence layer (`localStorage` key `studypath.v1`).
- Demo: the seed content (applications, documents, reminders, activity feed) is
  sample data written for this rebuild. Names and contact details are placeholders.
- Demo: the AI Advisor answers from a local keyword knowledge base. It does not call
  an LLM, so replies are fixed guidance text, not personalised model output.
- Demo: uploaded document files are not stored. Only name, type, size and dates are
  kept, which avoids blowing the 5 MB `localStorage` budget.
- Not included: real authentication, a server database, email or push
  notifications. Those need the Base44 platform (or another backend).

## Replacing the demo identity

Open `assets/js/store.js` and edit the `profile` block inside `seed()`, or simply
change the values on the Settings page, which persist per browser.

Switching back to fresh demo data: Settings, Account, "Reset demo data".

## Structure

```
index.html  applications.html  documents.html  calendar.html
requirements.html  ai-advisor.html  settings.html
assets/css/styles.css
assets/js/store.js        data model, seed content, persistence, formatting helpers
assets/js/layout.js       sidebar shell, icon set, modal and toast helpers
assets/js/pages/*.js      one script per page
```

## Content note

Immigration figures (fees, processing times, permit rules) are illustrative
averages for a demo interface. Verify anything you act on with IRCC.
