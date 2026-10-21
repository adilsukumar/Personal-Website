"""Refresh the public resume library from the approved Integrated M.Tech. PDFs."""
from pathlib import Path
import hashlib
import json
import os
import shutil
from pypdf import PdfReader
from html import escape
import pypdfium2 as pdfium

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
    (public / 'previews').mkdir(parents=True, exist_ok=True)
    accents = ['#67e8f9', '#60a5fa', '#6ee7b7', '#a78bfa', '#f0abfc', '#c4b5fd']
    details = ['A broad view of my work', 'Software, AI and embedded systems', 'Financial technology and data', 'Computational biology and lab work', 'Experiments, methods and analysis', 'The complete experience and project record']
    cards, manifest = [], []
    for index, (slug, title, folder, label, description, tags, icon) in enumerate(RESUMES):
        src = SOURCE / folder / f'Adil_Sukumar_2026_{label}_intmtech.pdf'
        reader = PdfReader(src)
        text = '\n'.join(p.extract_text() or '' for p in reader.pages)
        assert 'Integrated' in text and 'M.Tech' in text, src
        count = len(reader.pages)
        assert count == (6 if slug == 'full' else 1)
        dest = public / 'resumes' / f'adil-sukumar-{slug}-intmtech.pdf'
        digest = hashlib.sha256(src.read_bytes()).hexdigest()
        changed = not dest.exists() or hashlib.sha256(dest.read_bytes()).hexdigest() != digest
        shutil.copy2(src, dest)
        thumbnail = public / 'previews' / f'{slug}.webp'
        if changed or not thumbnail.exists():
            document = pdfium.PdfDocument(str(src))
            page = document[0]
            bitmap = page.render(scale=1.52)
            picture = bitmap.to_pil().convert('RGB')
            picture.save(thumbnail, 'WEBP', quality=84, method=6)
            picture.close()
            bitmap.close()
            page.close()
            document.close()
        url = '/resumes/' + dest.name
        preview = f'/previews/{slug}.webp'
        manifest.append({'category': slug, 'title': title, 'url': url, 'preview': preview, 'pages': count, 'sha256': digest})
        active = ' is-active' if index == 0 else ''
        page_label = f"{count} {'pages' if count > 1 else 'page'}"
        cards.append(f'''<article class="tile{active}" style="--accent:{accents[index]}">
          <a class="tile-link" href="{url}" data-title="{escape(title, quote=True)}" data-preview="{preview}" data-pages="{page_label}" data-detail="{escape(details[index], quote=True)}" data-accent="{accents[index]}" aria-label="Open {escape(title, quote=True)} resume, {page_label} PDF">
            <div class="tile-top"><span class="tile-icon"><svg viewBox="0 0 32 32" aria-hidden="true">{ICONS[icon]}</svg></span><span class="page-count">{page_label} <span aria-hidden="true">/</span> PDF</span></div>
            <h2>{escape(title)}</h2><p>{escape(description)}</p>
            <span class="tile-bottom"><span>View resume</span>{ARROW}</span>
          </a><a class="download" href="{url}" download aria-label="Download {escape(title, quote=True)} resume">{DOWNLOAD}</a>
        </article>''')
    template = (ROOT / 'template.html').read_text(encoding='utf-8')
    (public / 'index.html').write_text(template.replace('{{CARDS}}', '\n'.join(cards)), encoding='utf-8', newline='\n')
    (ROOT / 'resume-manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8', newline='\n')
    print(f'Built six perspectives, six document previews and {len(manifest)} verified Integrated M.Tech. PDFs.')

if __name__ == '__main__':
    build()
