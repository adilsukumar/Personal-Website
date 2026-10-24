# Adil Sukumar — resume collection

A standalone static gallery published at https://www.resume.adilsukumar.xyz and stored alongside the main portfolio in this repository. Only the seven approved Integrated M.Tech. resumes are public.

## Design and interaction

The landing page displays all seven illustrated document covers in one viewport, with no permanent document preview. Desktop uses four columns and two rows, with a wider Full CV cover; mobile uses seven compact rows. Each cover has a large, filled Read resume call to action and opens a dedicated reader that renders every PDF page, with zoom, category switching, PDF access and desktop download action. Escape closes the reader and restores focus. Without JavaScript, the cover links open the PDFs directly. Reduced motion and keyboard focus are supported.

The reader loads the original PDF and uses Mozilla PDF.js 6.4.299, pinned through jsDelivr, to render all pages at 2–2.5 times their displayed resolution. Zoom and viewport resizing trigger fresh renders. Nearby pages render on demand to limit memory use. Page position, per-page labels, accessible text and clickable PDF link annotations are included. Switching or closing cancels obsolete work. If the library or document cannot load, a visible error links directly to the original PDF. The Open PDF action provides the browser’s native selectable-text PDF view.

PDF.js is Apache-2.0 licensed: https://github.com/mozilla/pdf.js. The pinned library and matching worker are loaded only when a reader is opened; no resume data is sent to the CDN. Usage follows the official examples: https://mozilla.github.io/pdf.js/examples/.

## Editing

- `template.html`: page and reader structure.
- `build.py`: seven categories, cover content, PDF validation and generated HTML.
- `public/viewport.css`: complete gallery and reader styling.
- `public/theme.js`: reader controls and category switching.
- `resume-manifest.json`: PDF URLs, page counts and source SHA-256 hashes.

Run `python build.py` after changing the template or category data. The default PDF source is `D:/1_VIT/Resumes/Adil_Sukumar/2026`; set `RESUME_SOURCE` to override it. The build verifies degree and page counts, copies the approved PDFs and refreshes thumbnails when needed. Python dependencies: pypdf, pypdfium2 and Pillow.

## Hosting

`vercel.json` publishes the `public` directory. This static project is deployed separately from the root Next.js portfolio. The main portfolio links to this collection.

Software and Hardware have distinct targeted resumes. Only their Integrated M.Tech. PDFs are published; editable B.Tech. and Integrated M.Tech. versions live under `Tech_Resume/software` and `Tech_Resume/hardware` in the local resume collection.
