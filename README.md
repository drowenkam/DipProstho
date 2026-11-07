# Diploma in Prosthodontics · Clinical SBA Bank (Volume II, Edition 2)

**Ready-to-publish static website for GitHub Pages, iPhone, iPad and desktop.** No installation, server-side app, API key, account or database is required.

## Included

- `index.html` — website landing page, with all 1,000 questions and source answer notes embedded so no external data loading is required.
- `assets/app.js` — interactive self-testing, timed mode, search, bookmarks, and scores.
- `assets/style.css` — responsive layout for iPhone and iPad.
- `assets/questions.json` — separately inspectable question database.
- `notes.html` — new mobile HTML page-by-page reader for the **final 72-page Diploma revision notebook**, with table of contents, zoom, bookmarks, offline saving and links back to the SBA bank.
- `assets/notes-pages/001.webp` through `072.webp` — page-faithful high-resolution reader images preserving cover, diagrams, and all tables.
- `assets/reader.js`, `assets/reader.css` and `assets/notes-meta.json` — reader functionality and original PDF chapter navigation.
- `assets/notes-volume-i.pdf` — **the exact user-supplied final PDF** (verified byte-for-byte).
- `assets/question-bank-volume-ii.pdf` — the matching SBA Bank PDF.
- `manifest.webmanifest`, `sw.js`, `assets/icon-*.png` — Home Screen icon and offline cache for Safari on HTTPS.
- `GITHUB_PAGES_SETUP.md` — step-by-step upload and publish instructions.

## Contents and scope

All **1,000** questions and answer keys are drawn from the supplied *Dip Pros RCSEd Part 1 — Clinical SBA Bank (Edition 2)*. There are 14 blocks (A–N), including 50 integrated cases in Block N. Question numbers and answer letters were checked to be continuous from 1 to 1000, with five options each.

The first 730 answers contain fuller justification cards; questions 731–1000 provide concise source answer notes rather than separately detailed distractor explanations. This website preserves those differences, and does not manufacture missing explanation content.

Author: **Dr. Kam O Man, Owen** — BDS (HK), MFDS RCSEd, MFDS RCPS (Glasg), MClinDent (Fixed and Removable Prosthodontics) (KCL), MImpDent (RCSEd), MGDS RCSI.

### IMPORTANT

This is **not** an official RCSEd exam product. The source materials contain inconsistent descriptions of written examination timing and structure. Timed mode is merely an illustrative study timer based on 72 seconds/question. Confirm format, medicines, current clinical guidance and regulation with official sources.

## Final revision notebook update

The uploaded **Diploma_Prosthodontics_Revision_Notebook (Final).pdf** exactly matched the Volume I PDF already present in this package. The PDF remains intact, and **notes.html** now adds a phone- and tablet-friendly page viewer for all 72 pages without changing the source document. Use the **Read Volume I** navigation link or open `notes.html` directly.

The HTML reader is a visual (page-image) presentation of the source; it is **not** reflowable or copyable text. For searchable/selectable PDF text where supported, open the original PDF. The website remembers the last page and saves page bookmarks on each device. The **Save all 72 pages for offline reading** feature caches pages in the browser where storage is available; iOS may evict cached data. The PDF saved to the device’s Files app is a more dependable offline copy.

## Local testing

You can open `index.html` directly in a computer browser. For a local development server, from this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Offline support and Home Screen installation require a HTTPS origin (GitHub Pages provides this) or localhost.

## Debugged edition · scoring and navigation

- **No changes to the question text or answer keys:** all 1,000 source answers and all 5,000 option texts match the supplied Edition 2 Word document.
- **Study progress:** "Attempted" means unique questions for which an answer was checked in practice mode or submitted in timed mode; merely visiting or selecting without checking does not count. "Latest accuracy" is latest correct answers divided by unique attempted questions. Repeated attempts on the same question update its latest result and attempt count without inflating coverage.
- **Session results:** percentage is correct divided by every question in the session (unanswered = zero marks). The separate answered-only accuracy is also shown. Timed answers are marked only when the session finishes or the timer expires.
- **Recovery:** unfinished sessions and completed results survive page reloads; using search during a longer session saves a paused copy that can be resumed. Completed scores appear in the history and remain distinct from the current latest-answer accuracy.
- **Progress transfer:** exported JSON merges answers by most recent attempt, unions bookmarks, and deduplicates imported session history.
- **Navigation:** last-page controls are disabled appropriately, but readers can return to any unit or back to the SBA bank. The 50 integrated Block N cases link to the unit named in their source revision pointer rather than to the title page.
- The original revision notebook PDF includes some **legacy question-range references** from another edition. Those printed ranges are not the indexing for this 1,000-question Edition 2 website.

See `VALIDATION_REPORT.md` and `TEST_RESULTS.txt` for exact data and interaction checks. These tests do not constitute clinical peer review. Browser-rendered workflows were exercised in Chromium; direct GitHub Pages deployment and iOS Safari testing were not available in this environment.

## Progress and privacy

Answered questions, scores and bookmarks live in **browser local storage on that device**. GitHub does not receive your answers. Use **My progress → Export progress** on one device and **Import progress** on the other to transfer progress; it does not automatically sync across devices. Private browsing or clearing website data can erase progress. Export regularly.

## Repository license

The provided question text and PDFs are revision materials supplied by the user. No third-party license or redistribution permission is asserted here. Verify that you have the necessary rights before publishing the repository publicly.
