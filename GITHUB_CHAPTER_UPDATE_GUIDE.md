# GitHub Pages update: Volume I chapter-linked reader

**Recommendation:** If your current GitHub website already works, use the **Update Only** ZIP. No need to upload the full Volume I PDF or 105 individual page images.

1. Open the existing SBA website on your iPhone/iPad and use **Export Progress** to back it up before changes.
2. Download and unzip `Dip_Pros_Chapter_Linked_GitHub_Update_Only.zip` on a Mac/PC. Upload **extracted files**, not the ZIP.
3. In the GitHub repository root, upload `notes.html`, `index.html`, and `sw.js` by choosing **Add file → Upload files** (replace files with the same names).
4. Enter the repository's `assets` folder. Upload `reader.js`, `reader.css`, `app.js`, `notes-meta.json`, `chapter-map.json`, `notebook-pages-index.json`, and `notebook-pages.pack`. Keep them in `assets/`.
5. Commit on the same branch used by GitHub Pages. Give publication a moment, then reload your live website. If Safari still shows an old version, refresh without clearing all website data, which can delete progress. Previously saved scores and question IDs are unchanged. The service worker version invalidates older cached site files; an online revisit may be required to re-cache the notebook.
6. Open `notes.html`. The **Chapter study directory** now lists 14 chapters. Expand Chapter 3 (Dental materials science), tap **Read these notes** for PMMA curing, or tap **Practise linked SBAs** for selected questions. Each chapter also offers **All chapter SBAs**, covering all 1,500 bank questions across the 14 chapter blocks.
7. If you want offline study, while connected to Wi-Fi use **Save all pages for offline reading**. Browser caches can be evicted by iOS; for reliable offline reference save the standalone `Dip_Pros_Volume_I_Chapter_Linked_Edition.pdf` separately to Apple Files.

For a **new** repository use `Dip_Pros_Chapter_Linked_GitHub_Complete.zip` instead and upload its extracted contents to the repository root.

### Size / safety

There are only about two dozen website files; the largest is `assets/notebook-pages.pack` (under 8 MB), beneath GitHub's 25 MB browser-upload single-file limit. The standalone PDF is deliberately separate to avoid uploading two copies of the same 120 pages. The complete package does include the existing lightweight questions and answers PDF documents.

### Troubleshooting

- Missing page images: verify both `assets/notebook-pages.pack` and `assets/notebook-pages-index.json` were replaced together.
- Topic opens the wrong question: verify `index.html`, `assets/app.js` and `assets/chapter-map.json` were updated in the same commit.
- Old layout: check `sw.js` and refresh Safari. If necessary, restart the tab and reconnect while the page is online; do not clear storage before exporting progress.
- On a locked-down browser, Javascript may be disabled; use the PDF chapter maps in the standalone download instead.
