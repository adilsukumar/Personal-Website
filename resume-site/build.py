"""Refresh the public resume library from the approved Integrated M.Tech. PDFs."""
from pathlib import Path
import hashlib
import json
import os
import shutil
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent
SOURCE = Path(os.environ.get('RESUME_SOURCE', r'D:\1_VIT\Resumes\Adil_Sukumar\2026'))
RESUMES = [
    ('general', 'General', 'General_Resume', 'General', 'A broad view of my work across technology, research and leadership.', 'Software · Hardware · Research', 'briefcase'),
    ('tech', 'Technology', 'Tech_Resume', 'Tech', 'Software engineering, applied AI, embedded systems and product development.', 'Engineering · AI · DevOps', 'code'),
    ('banking', 'Banking & Fintech', 'Bank_Resume', 'Bank', 'Financial technology, data analytics, trading research and risk controls.', 'Fintech · Data · Analytics', 'chart'),
    ('bio', 'Bioinformatics', 'Biology_Resume', 'Bio', 'Computational biology, genomic analysis, biosensing and laboratory work.', 'Genomics · Biosensing · Wet lab', 'dna'),
    ('research', 'Research', 'Research_Resume', 'Research', 'Research experience and projects spanning machine learning and the life sciences.', 'ML · Experiments · Analysis', 'scope'),
    ('full', 'Full CV', 'Full_Resume', 'Full', 'The complete picture: experience, projects, skills, credentials and achievements.', 'Complete experience & project record', 'document'),
]
ICONS = {
    'briefcase': '<rect x="4" y="8" width="24" height="19" rx="3"/><path d="M11 8V5h10v3M4 16c7 4 17 4 24 0M14 17h4v5h-4z"/>',
    'code': '<path d="m11 8-8 8 8 8m10-16 8 8-8 8m-3-20-4 24"/>',
    'chart': '<path d="M5 4v23h24M10 20l6-7 5 3 8-10M23 6h6v6"/>',
    'dna': '<path d="M8 2c0 14 16 14 16 28M24 2C24 16 8 16 8 30M9 6h14M12 12h8M12 20h8M9 26h14"/>',
    'scope': '<path d="m17 3 6 4-8 12-6-4zM12 19l-3 4M22 15a9 9 0 0 1-6 15M4 30h24M4 24h13M18 2l6 4"/>',
    'document': '<path d="M20 3H7v26h19V9zM20 3v7h6M11 15h11M11 20h11M11 25h7"/>',
}
ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'
DOWNLOAD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5"/></svg>'

def build():
    public = ROOT / 'public'
    (public / 'resumes').mkdir(parents=True, exist_ok=True)
    cards, manifest = [], []
    for slug, title, folder, label, description, tags, icon in RESUMES:
        src = SOURCE / folder / f'Adil_Sukumar_2026_{label}_intmtech.pdf'
        reader = PdfReader(src)
        text = '\n'.join(p.extract_text() or '' for p in reader.pages)
        assert 'Integrated' in text and 'M.Tech' in text, src
        count = len(reader.pages)
        assert count == (6 if slug == 'full' else 1)
        dest = public / 'resumes' / f'adil-sukumar-{slug}-intmtech.pdf'
        shutil.copy2(src, dest)
        url = '/resumes/' + dest.name
        manifest.append({'category': slug, 'title': title, 'url': url, 'pages': count, 'sha256': hashlib.sha256(src.read_bytes()).hexdigest()})
        cards.append(f'''<article class="card card-{slug}">
          <a class="card-main" href="{url}" aria-label="View {title} resume, {count} {'pages' if count > 1 else 'page'} PDF">
            <div class="card-top"><span class="icon"><svg viewBox="0 0 32 32" aria-hidden="true">{ICONS[icon]}</svg></span><span class="format">PDF <span aria-hidden="true">/</span> {count} {'pages' if count > 1 else 'page'}</span></div>
            <h2>{title}</h2><p>{description}</p><span class="tags">{tags}</span>
            <span class="view">View resume {ARROW}</span>
          </a>
          <a class="download" href="{url}" download aria-label="Download {title} resume">{DOWNLOAD}</a>
        </article>''')
    html = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Resumes | Adil Sukumar</title><meta name="description" content="Explore Adil Sukumar’s resumes for technology, fintech, bioinformatics and research, or view the complete CV.">
<meta name="theme-color" content="#000000"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="canonical" href="https://www.resume.adilsukumar.xyz/">
<meta property="og:title" content="Resumes | Adil Sukumar"><meta property="og:description" content="Technology, fintech, bioinformatics, research and the complete CV."><meta property="og:type" content="website">
<link rel="preload" href="/fonts/geist-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/style.css"><script src="/theme.js" defer></script></head><body>
<a class="skip" href="#resumes">Skip to resumes</a>
<div class="atmosphere" aria-hidden="true"><div class="glow glow-cyan"></div><div class="glow glow-violet"></div><div class="stars"></div></div>
<header><a class="identity" href="https://www.adilsukumar.xyz">ADIL SUKUMAR</a><nav aria-label="Main navigation"><a href="https://www.adilsukumar.xyz">Portfolio</a><a href="#resumes" aria-current="page">Resumes</a></nav><a class="contact" href="mailto:adilsukumar24@gmail.com">Contact</a></header>
<div class="shell"><main><section class="intro" aria-labelledby="page-title"><div class="eyebrow"><span></span> THE RESUME COLLECTION</div><h1 id="page-title">My <span>resumes.</span></h1><p>Hardware. Software. AI. Biology.<br>Choose the focus that fits your opportunity.</p><div class="degree"><span class="degree-dot" aria-hidden="true"></span><span>Integrated M.Tech. <span aria-hidden="true">·</span> AI &amp; Bioinformatics</span></div></section>
<section id="resumes" class="grid" aria-label="Choose a resume">''' + '\n'.join(cards) + '''</section>
</main><footer><span>© 2026 Adil Sukumar <span class="footer-dot">·</span> Chennai, India</span><div><a href="https://www.linkedin.com/in/adilsukumar/">LinkedIn</a><a href="https://github.com/adilsukumar">GitHub</a><a href="https://github.com/adilsukumar/Personal-Website/tree/main/resume-site">Page source</a></div></footer></div>
</body></html>'''
    (public / 'index.html').write_text(html, encoding='utf-8')
    (ROOT / 'resume-manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print(f'Built six tiles and verified {len(manifest)} Integrated M.Tech. PDFs.')

if __name__ == '__main__':
    build()
