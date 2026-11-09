# Technical validation — 9 November 2026

- **Source:** Edition 2 Volume I Notebook, 105 pages.
- **HTML pages extracted:** 105 / 105.
- **Chapter links:** 14 chapters with 56 mapped topic groups; question-number links validated against all 1,500 IDs.
- **Clinical decision tables:** 32 recovered as native HTML tables.
- **Selected source keypoints:** 127 text extracts from identified principles, summaries and clinical discriminators.
- **Question dataset:** 1,500 IDs, five options and one answer key per question, checked for completeness. No question wording or keys changed in this release.
- **Practice level logic:** 13 tests passed for one, two and three levels; score denominator, unanswered handling, progress settings and by-level result display.
- **Chapter reader:** 12 JavaScript execution tests passed for deep links, HTML content, the chapter selector, direct question links, keypoints and navigation.
- **Syntax:** `node --check` passed for app, reader and service worker scripts.
- **Browser testing limitation:** Chromium-based interactive testing was attempted, but navigation was blocked by this environment (`ERR_BLOCKED_BY_ADMINISTRATOR`). The checks above are JavaScript execution tests in a mocked DOM, not live browser tests. Live iOS Safari and deployed GitHub Pages navigation/offline behaviour remain unverified.
- **Source-text limitation:** The original PDF's searchable layer has OCR-style spacing in some older tables. The HTML preserves extracted content with conservative spacing repairs; complex original tables may appear in simplified reading order. Compare with the source PDF for high-stakes numeric study and consult current clinical guidance.
