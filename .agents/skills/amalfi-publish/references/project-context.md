# Amalfi Publish Context

- Project root: `/Users/peterjennings/amalfialpha-website`
- Site type: static HTML, CSS, and JavaScript site
- Primary files: `index.html`, `about.html`, `investing.html`, `styles.css`, `script.js`
- Linked Vercel project name: `amalfialpha-website`
- Linked Vercel project ID: `prj_5ExfZvGeHXgFh2Va7fEoAzDBu5tz`
- Linked Vercel team ID: `team_GZxZZqB78tpc5D4onUvbOFEZ`
- Expected public domain target: `amalfialpha.com`

## Safety Rules

- Publish only after the user explicitly says the current local version is approved.
- Use `scripts/publish.sh --check` before the first publish in a new session, or whenever the local environment may have changed.
- Report the deployment URL after publishing.

## Current Deployment Notes

- As of April 15, 2026, the linked Vercel project was reachable on default `vercel.app` aliases.
- At that time, the Vercel project inspection did not show `amalfialpha.com` attached yet.
- If the custom domain is still missing, tell the user that the deployment succeeded but the public custom domain still needs to be connected in Vercel.
