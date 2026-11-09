# GitHub Pages update instructions

## Already have the site? Use the Update Only ZIP.

1. **Export your SBA progress** from the existing website to your device.
2. Unzip the update file locally. **Do not upload the ZIP itself.**
3. In the GitHub repository root, replace `notes.html`, `pdf.html`, and `sw.js`.
4. Inside `assets/`, upload/replace `app.js`, `reader.js`, `reader.css`, `style.css`, `chapter-map.json` and `notes-content.json`.
5. Keep the existing `index.html` and `assets/questions.json`. The question dataset has not been changed.
6. Commit on the publishing branch. Allow GitHub Pages to redeploy, then reload the site.
7. The website no longer needs `assets/notebook-pages.pack` or `assets/notebook-pages-index.json`; once the new HTML notes are working, these old files **can be deleted** to reduce repository size. Do not delete `assets/chapter-map.json`.

## Uploading the Complete ZIP to a new repository

Extract it and upload its **contents** to the repository root, so `index.html`, `notes.html`, `sw.js`, `pdf.html`, and the `assets/` directory appear at the same level. Go to **Settings → Pages → Deploy from a branch → main → /(root)**. These are static files: no build step and no third-party JavaScript library needed.

## How to test the live website

- Open `notes.html`: you should see 14 chapters. Open Chapter 3 and read the **PMMA processing** notes as web text, not an image.
- Switch to **Keypoints** and **Search notes**, then use **← SBA dashboard** to return.
- Start a 10-question practice session: select Foundation only, then Intermediate + Advanced, then all three; the available totals should change to 270, 1,230 and 1,500 respectively (before filters).
- Complete a partly answered session: unanswered items must count as zero, and the results should include a per-level breakdown.
- Refresh the site; checked answers and saved progress should remain. On iPhone and iPad, Safari storage is separate per device.

## Notes

All files in the compact packages are below GitHub's 25 MiB web-upload file limit. For existing repositories, upload replacement files to **matching paths** rather than placing all files in the root. Offline support becomes available after the service worker has installed successfully while online. Refresh after deployment to let the new cache take effect. Browser storage may be evicted by iOS.
