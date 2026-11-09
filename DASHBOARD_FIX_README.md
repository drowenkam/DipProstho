# SBA Dashboard — Self-contained startup fix

## Why the front page froze
The dashboard originally displayed “Preparing the SBA revision bank…” until `assets/app.js` had loaded and used the matching `index.html` chapter map. Earlier GitHub updates replaced only the notes and service-worker files, so the deployed dashboard can contain mismatched revisions or old cached resources.

## Recommended GitHub update
1. **Export your existing SBA progress first**, if the current page still allows it.
2. Extract `Dip_Pros_SBA_Dashboard_Fix_UPDATE_ONLY.zip`.
3. Upload `index.html`, `repair.html`, and `sw.js` to the root of your GitHub Pages repository, replacing the old `index.html` and `sw.js`. Do not upload the ZIP itself.
4. Wait until GitHub Pages finishes publishing, then revisit the website while online.
5. If the dashboard still shows the old loading message, visit `https://YOURNAME.github.io/YOURREPOSITORY/repair.html` and select **Refresh website files**. This removes stale offline caches but **never clears localStorage**, including existing answers or session history.

The updated `index.html` embeds the entire current 1,500-question dataset, its chapter map, CSS and JavaScript. The separate `notes.html` reader retains its accessible chapter text and restored tables. Multi-level session selection and the stored scoring engine remain unchanged.

Validation: JSON structure/answers checked, Node syntax/static startup run, cache implementation, ZIP content and URL paths. Live GitHub deployment and native Safari cannot be verified without your deployed site address.
