# Volume I reader — Read Volume fix

**Issue addressed:** The earlier reader required `assets/notes-content.json`, `assets/chapter-map.json`, `assets/reader.js`, and CSS files at exactly the expected locations. An incomplete GitHub upload could leave the reader blank. It also automatically redirected the `#chapters` bookmark to `#notebook`, hiding the directory.

**Fix:** `notes.html` now contains all 105 pages of Volume I Edition 2, 14 chapter sections, keypoints, tables, topic-to-question links, and searchable content in **one HTML file**. Basic reading and chapter navigation work without JavaScript or extra assets. JavaScript adds search, page bookmarks, and backwards-compatible deep links.

## Updating an existing GitHub Pages repository
1. Export your SBA progress first as a precaution.
2. Upload `notes.html` from this ZIP to **the same folder that contains `index.html`**, replacing the old `notes.html`.
3. Upload `sw.js` to the same folder to refresh offline caching.
4. Commit. After deployment, open the published site and click **Read Volume I**. Reload once while online if an older cached version appears.
5. Test the chapter directory, Chapter 3, Keypoints, Search, and returning to the SBA dashboard.

No changes are made to `assets/questions.json`, `assets/app.js`, or user scores/progress. You do not need to re-upload the notebook PDFs or 105 page images.

If GitHub Pages is published from a `docs/` folder instead of repository root, upload there alongside your `index.html`.

### Quality checks
- 14 chapters and 105 embedded notebook source pages.
- Source-derived content kept; 32 source pages contain HTML tables.
- `notes.html` works without network fetches for notebook content, including when opened directly as an HTML file.
- JS syntax and internal anchor targets checked using Node.js and HTML inspection.
- The device's actual Safari browser and live deployed website were not directly testable here.
