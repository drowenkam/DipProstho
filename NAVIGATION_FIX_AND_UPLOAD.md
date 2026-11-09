# Navigation repair — Diploma in Prosthodontics GitHub Pages

## Resolved navigation problems

1. Volume I reader, chapter study maps and keypoints: a **sticky navigation bar** offers **SBA dashboard**, **Chapters**, **Reader** and **PDFs** at all scroll depths (including iPhone and iPad).
2. After opening Volume I from an SBA answer, **Resume SBA Q…** returns to `index.html`, which restores the existing saved session without erasing scores.
3. The SBA bank now has a persistent **Dashboard / Current SBA / Chapters / PDFs** switcher. Dashboard view does not discard the current question session.
4. PDF links open the new `pdf.html` hub rather than a missing PDF file. Opening a PDF occurs **in a new tab**, so the website remains available. The updated 120-page Volume I remains in the HTML reader (the full Volume I PDF is not bundled to keep upload size small).
5. Moving between linked chapter/keypoint pages stays in the same HTML reader instead of reloading the large notebook pack.
6. Service worker cache version updated to make the new navigation appear after deployment.

## Updating an existing GitHub Pages repository

1. Export progress on the SBA website (My progress → Export), as a precaution.
2. Extract `Dip_Pros_Navigation_Fix_UPDATE_ONLY.zip` on your computer.
3. Upload the replacement **root files**: `index.html`, `notes.html`, `pdf.html`, `sw.js`.
4. Open `assets/` in GitHub and upload: `app.js`, `reader.js`, `style.css`, `reader.css`.
5. Commit the changes. **Do not place the ZIP itself in the repository.** Existing question data and the packed page bundle remain untouched.
6. After GitHub Pages publishes, refresh the site, and open Volume I. The return bar should remain visible while scrolling.

## Browser and PDF limitations

A raw PDF opened directly in Safari's native document viewer cannot display the website's own navigation. The PDF Library works around this by opening PDFs in a separate tab; close that tab to return. The 120-page Volume I HTML version always shows the return links.

## Progress policy

Existing progress storage keys, answer checking, marks, question IDs, notebook-page bookmarks, and source question content are unchanged.
