# Compact GitHub Pages upload — Diploma in Prosthodontics

This package preserves all **1,500 interactive SBAs** and includes the full **Volume I, Edition 2 notebook (105 pages)** as a mobile HTML image reader. It is optimized to upload through GitHub's web interface.

## Why it is smaller

The 105 individual notebook page images have been combined into **one optimized file** (`assets/notebook-pages.pack`) and an index (`assets/notebook-pages-index.json`). This keeps the page layout and illustrations while avoiding a 105-file upload. Page images are optimized to 1,000 pixels wide; use the separate full-resolution PDF when you need printable/scalable text.

The full-resolution Edition 2 PDF is deliberately **not inside this website ZIP**. It remains available as a separate download. The questions-only and answers-only PDFs are included.

## To update an existing GitHub Pages site

1. Export your saved SBA progress in the website before editing your repository.
2. Download **Update Only** ZIP and unzip it on your computer.
3. In your GitHub repository, go to the **Code** tab and upload matching files from the extracted folder, keeping their paths (e.g. `assets/reader.js` must remain in `assets/`).
4. Replace the root `notes.html` and `sw.js`, then files in `assets` (including `app.js` and the two new notebook pack files).
5. Do **not** upload the ZIP itself. GitHub Pages does not extract uploaded ZIP files.
6. Commit your changes, open your GitHub Pages website and hard refresh the browser. Use the reader's **Save all pages for offline reading** when online.
7. The old `assets/notes-pages` folder can be removed from the repository after the compact website works; old 72-page PDF can also be deleted. These are no longer used.

## For a new repository

Use **Complete Compact Website** ZIP. Extract it and upload the *contents* to your repository's root. There should be an `index.html`, a `notes.html`, and an `assets` folder, not a single ZIP. In GitHub Settings → Pages set Build and deployment to **Deploy from a branch**, Branch: `main`, Folder: `/(root)`.

**Important:** If GitHub's browser uploader complains when uploading a folder, upload the root-level files first and then enter the `assets` folder and upload its contents. This package contains only a small number of web assets; the largest is `notebook-pages.pack`. No Git LFS is needed.

## Limits

- iOS Safari and storage policies can evict the offline cache. Save the separate PDF in Apple Files for guaranteed offline access.
- The reader page images are intentionally compressed for browser viewing. The separate 105-page PDF preserves the original resolution and selectable text.
- Your previous SBA progress is kept by the app, except where an earlier question revision changed the question's options. Export progress before updates.
- Review all clinical content against current guidelines; the bank has outstanding editorial items and has not been examiner-calibrated.
