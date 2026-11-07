# Diploma Prosthodontics SBA website validation

- PASS: 1,000 questions and 1,000 source answer keys
- PASS: question number continuity 1–1000
- PASS: all source answer letters match
- PASS: all options complete
- PASS: all 5,000 individual option texts match source
- PASS: no duplicate stems
- PASS: block coverage and counts match source
- PASS: final Volume I PDF is byte-for-byte identical
- PASS: all 72 page images included
- PASS: all notebook page URLs resolve
- PASS: all main HTML, JS, CSS, PDF and offline resources included
- PASS: PDF size plausible assets/notes-volume-i.pdf
- PASS: PDF size plausible assets/question-bank-volume-ii.pdf
- PASS: offline precache path exists index.html
- PASS: offline precache path exists notes.html
- PASS: offline precache path exists assets/style.css
- PASS: offline precache path exists assets/app.js
- PASS: offline precache path exists assets/questions.json
- PASS: offline precache path exists assets/reader.css
- PASS: offline precache path exists assets/reader.js
- PASS: offline precache path exists assets/notes-pages/001.webp
- PASS: offline precache path exists assets/notes-pages/002.webp
- PASS: offline precache path exists assets/notes-pages/003.webp
- PASS: offline precache path exists manifest.webmanifest
- PASS: offline precache path exists assets/icon-192.png
- PASS: offline precache path exists assets/icon-512.png
- PASS: offline precache path exists index.html
- PASS: timed exam automatically ends and scores on expiration
- PASS: time-expired unanswered questions counted correctly
- PASS: results page fits 320px wide
- PASS: results page fits 375px wide
- PASS: results page fits 390px wide
- PASS: results page fits 428px wide
- PASS: results page fits 768px wide
- PASS: results page fits 1024px wide

### Limitations
Chromium DOM interactions were tested with the original HTML, CSS and JavaScript injected into a test page because this environment blocks actual HTTP navigation. Native GitHub Pages deployment, actual service-worker offline operation, and iOS Safari were not directly executed. Confirm them after publication. Clinical assertions were not independently re-adjudicated; answer keys were checked against the supplied Word source.
