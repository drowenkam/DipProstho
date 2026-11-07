# Publish to GitHub Pages and use on iPhone / iPad

1. Sign in at **github.com** and create a new repository, for example `dip-pros-sba`.
2. Extract the ZIP on your Mac/PC. Open the **Prosthodontics_SBA_GitHub_Pages** folder.
3. In your empty repository, choose **Add file → Upload files**. Upload **everything INSIDE** the folder, including `index.html`, `assets/`, `sw.js`, `manifest.webmanifest`, and `.nojekyll` if possible. The **index.html must be at the repository root**.
4. Commit the upload to the `main` branch.
5. Open repository **Settings → Pages**. Under Build and deployment choose **Deploy from a branch**, choose **main** and **/(root)**, and Save.
6. Visit the Pages address shown in Settings → Pages: typically `https://YOUR-USERNAME.github.io/dip-pros-sba/` for a project repository.
7. In Safari on iPhone or iPad, open that URL. Tap the **Share** icon → **Add to Home Screen**.
8. Open the Home Screen shortcut and choose **Read Volume I** to read the final 72-page notebook in HTML, or choose **Practice** for the 1,000-question bank. Once initial offline files have cached, questions can work without internet.

### Updating an existing GitHub Pages repository

Extract the new ZIP and replace the repository's existing website files with the **contents** of the ZIP, keeping the same root-level folder structure. In particular, update `index.html`, `assets/app.js`, `assets/style.css`, `assets/reader.js`, `notes.html` and `sw.js`. Do not upload the ZIP itself and expect Pages to extract it. All notebook page images must remain under `assets/notes-pages/`.

The storage key for answered questions has been preserved, so updating website files should not reset your browser's saved progress. **Export a progress backup before updating**. After the GitHub Pages deployment completes, refresh Safari; old offline caches can delay updates until the new service worker activates.

## Important details

- Make sure GitHub is serving `index.html` from the root, not from a nested top-level folder.
- Avoid renaming the `assets` folder, `sw.js`, or the manifests. Internal URLs are relative, so the project works under a repository subpath.
- On iOS, **Add to Home Screen** is best done in Safari. Offline support needs an initial successful online load.
- The **final revision notebook is included** as `assets/notes-volume-i.pdf`, and a mobile HTML reader is available at `notes.html`. The reader loads page images from `assets/notes-pages/`; **upload the entire assets folder**, not only the HTML files. The HTML reader has an optional **Save all 72 pages for offline reading** control (browser storage may be evicted on iOS). PDF books are linked from `assets/`. First opening them online may help make them available offline, but offline PDF caching is not guaranteed on iOS.
- Scores are stored locally per device, **not** in GitHub. For iPhone–iPad progress transfer: **My progress → Export** on one device, transfer the JSON file via AirDrop/Files/iCloud Drive, then **Import** on the other. The import combines bookmarks and latest answers.
- If you upload a new version later, Safari may retain the older cached site. Close and reopen; if necessary clear website data for that site.
- GitHub Pages repository visibility and availability depend on your account and plan.
- Public repositories expose the questions/PDFs to viewers. Confirm you have redistribution rights before making the site public.
