# Volume I — Critical Source/Text and Table Reconstruction: 10 QA Checks

**Scope:** Reader HTML and packaging. Original notebook first 55 PDF pages provide 52 substantive pages (pp. 4–55); 53 additional Edition 2 pages retain their own editable HTML material. This is a source-fidelity/technical review, **not** a new independent clinical guideline appraisal.

| QA pass | Focus | Result and evidence |
|---|---|---|
| 1 | Source selection | Replaced corrupted OCR on all 52 substantive clean-source pages (original pp. 4–55), not automatic word guessing. |
| 2 | Page coverage | All 105 Edition 2 source sections retained; 14 study chapters and introductory panel retained. |
| 3 | Source tables | Checked 58 original table regions; complex transcriptions retain a faithful original visual source crop embedded in HTML, with no PDF click needed. |
| 4 | Full table reconstruction | 70 readable HTML tables; reconstructed multi-page anatomy, oral-lesion, luting-cement and emergency tables, and four source numeric tables per appendix page. |
| 5 | Cell labels | Mobile table cells are rendered as labelled cards; original source views remain available as a cross-check. |
| 6 | Spelling / word spacing | Clean source text layer used for original prose; corrected 13 identifiable legacy keypoint tokenisation errors, including OVD/RVD, TMD, DOACs and drug names. |
| 7 | Navigation / deep linking | 105 unique page anchors, no duplicate IDs or broken internal anchors; SBA question links remain in original format. |
| 8 | Responsive browser | Chromium checks at widths 360, 390, 768 and 1280 px: no JavaScript exceptions or page-level horizontal overflow; six chapters opened per viewport. |
| 9 | Live application logic | Search input, keypoint visibility and chapter navigation checked; the original 1,500-SBA dashboard starts in Chromium. |
| 10 | Release integrity | Verified exactly 1,500 unique question IDs, all with five options and keys A–E; dashboard and scoring code byte-for-byte unchanged; both ZIPs and JS syntax verified. |

**Known limitation:** Some wide or visually intricate legacy source tables remain a horizontally scrollable, high-resolution **original-source image inline in the webpage**, rather than fully retyped cells. This is deliberate, to avoid incorrect transcription. Some supplemental Edition 2 content was not re-authored. Neither the historical clinical doses nor examination statements were independently validated; source-based emergency/prescribing tables are explicitly marked as historical and must be checked against current professional guidance. Native Safari on a physical iPhone/iPad and live GitHub deployment remain untested.

**GitHub install:** Extract the UPDATE ZIP. Upload `notes.html` and `sw.js` into your repository root (beside `index.html`) and commit. Uploading the ZIP itself does not deploy GitHub Pages. Refresh the deployed page online; if a stale reader remains, use `repair.html` to clear only cached web resources. The repair utility does not delete localStorage progress.
