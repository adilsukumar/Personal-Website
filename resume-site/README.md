# Adil Sukumar — resume collection

A standalone static gallery published at https://www.resume.adilsukumar.xyz and stored alongside the main portfolio in this repository. Only the six approved Integrated M.Tech. resumes are public.

## Design and interaction

The landing page displays all six illustrated document covers in one viewport, with no permanent document preview. Desktop uses three columns and two rows; mobile uses two columns and three rows. Each cover opens a dedicated reader with a large first-page preview, zoom, category switching, PDF access and desktop download action. Escape closes the reader and restores focus. Without JavaScript, the cover links open the PDFs directly. Reduced motion and keyboard focus are supported.

The reader clearly identifies its first-page preview. Open PDF provides every page, selectable text and working links.

## Editing

- `template.html`: page and reader structure.
- `build.py`: six categories, cover content, PDF validation and generated HTML.
- `public/viewport.css`: complete gallery and reader styling.
- `public/theme.js`: reader controls and category switching.
- `resume-manifest.json`: PDF URLs, page counts and source SHA-256 hashes.

Run `python build.py` after changing the template or category data. The default PDF source is `D:/1_VIT/Resumes/Adil_Sukumar/2026`; set `RESUME_SOURCE` to override it. The build verifies degree and page counts, copies the approved PDFs and refreshes thumbnails when needed. Python dependencies: pypdf, pypdfium2 and Pillow.

## Hosting

`vercel.json` publishes the `public` directory. This static project is deployed separately from the root Next.js portfolio. The main portfolio links to this collection.
