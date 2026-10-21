# Resume site

Live: **https://www.resume.adilsukumar.xyz**. The shorter `resume.adilsukumar.xyz` redirects here.

This folder contains the complete static source for the six-tile resume site, alongside the personal portfolio in the same repository. It is deployed as a separate Vercel project. Only Integrated M.Tech. PDFs are included: General, Technology, Banking & Fintech, Bioinformatics, Research and Full CV.

## Theme shared with the portfolio

- Geist and Geist Mono: the same self-hosted variable font files served by the portfolio; SIL Open Font Licenses are retained under `public/fonts/`.
- Black background (`#000000`), cyan (`#67e8f9`) and violet (`#a78bfa`) accents.
- Rounded glass navigation, subtle starfield and ambient glow, grid-textured cards, pointer spotlights, large arrow cursor and cyan scrollbar.
- Single-column mobile tiles, visible keyboard focus and reduced-motion support. Every PDF remains accessible without JavaScript.

## Edit

- `public/index.html`: published page. Edit directly for a small content change, or update the template/card descriptions in `build.py` and regenerate it.
- `public/style.css`: layout and shared visual theme.
- `public/theme.js`: progressive card spotlight enhancement.
- `public/resumes/`: six public PDFs, using stable filenames.
- `vercel.json`: static hosting and PDF headers.
- `resume-manifest.json`: expected page counts and approved PDF hashes.

## Update the resumes

Replace the corresponding PDFs in `public/resumes/`, keeping the filenames. Alternatively, install `requirements.txt` and run `python build.py` to refresh the six approved PDFs from the local resume directory. Its default source is `D:\1_VIT\Resumes\Adil_Sukumar\2026`; override it with the `RESUME_SOURCE` environment variable on another computer. The builder verifies the degree wording and page counts before copying PDFs.

## Preview and deploy

From this folder:

```sh
python -m http.server 8766 --bind 127.0.0.1 --directory public
```

Open http://127.0.0.1:8766. No Node dependencies or build step are required for this site.

In Vercel, use the **Personal-Website** repository, root directory **resume-site**, Framework Preset **Other**, no build or install command, and output directory **public**. This deployment is separate from the Next.js portfolio at the repository root. For a manual deployment from this folder, run `npx vercel --prod` while signed into the project owner’s Vercel account.

No credentials, Vercel login files, Word documents or B.Tech. resumes belong in this folder.
