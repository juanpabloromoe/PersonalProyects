# Personal Projects

Public projects, served with GitHub Pages from the `docs/` folder.

| Project | Folder | What it is |
|---|---|---|
| CV Workbench | `docs/cv-workbench/` | Browser-only CV tailoring for internship applications: guided import from a CV or LinkedIn PDF, five country formats (US, Germany/DACH, Europe, Spain, Mexico), EN/ES/DE interface, copy-paste AI tailoring, cover letters and an application tracker. Nothing is sent to a server; data lives in the visitor's localStorage. |

## Turn on GitHub Pages

Settings → Pages → Build and deployment → Source: *Deploy from a branch*, Branch: `main`, folder `/docs` → Save.
The site then lives at `https://juanpabloromoe.github.io/PersonalProyects/` and CV Workbench at `.../PersonalProyects/cv-workbench/`.

## Run locally

```
cd docs && python3 -m http.server 8000
```
Then open http://localhost:8000.
