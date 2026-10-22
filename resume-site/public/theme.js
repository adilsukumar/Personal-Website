(() => {
  const links = [...document.querySelectorAll('.cover-link')];
  const reader = document.getElementById('reader');
  if (!reader || typeof reader.showModal !== 'function') return;
  const scroller = document.getElementById('reader-canvas');
  const pages = document.getElementById('reader-pages');
  const zoom = document.getElementById('reader-zoom');
  const position = document.getElementById('reader-position');
  const PDF_VERSION = '6.4.299';
  const PDF_CDN = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDF_VERSION}`;
  let libraryPromise, loadingTask, pdf, selected = 0, loadId = 0, renderId = 0;
  let observer, queue = [], running = 0, pageWidth = 0, resizeTimer;
  const renders = new Set();
  const buttons = links.map((link, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = link.dataset.title;
    button.addEventListener('click', () => select(index));
    document.getElementById('reader-switcher').append(button);
    return button;
  });
  function stopRendering() {
    renderId++; observer?.disconnect(); queue = [];
    renders.forEach(task => task.cancel()); renders.clear();
  }
  function status(message, failed = false) {
    pages.replaceChildren();
    const text = document.createElement('p'); text.className = 'reader-status';
    text.setAttribute('role', failed ? 'alert' : 'status'); text.textContent = message;
    if (failed) {
      const anchor = document.createElement('a'); anchor.href = links[selected].href;
      anchor.textContent = ' Open the PDF directly.'; text.append(anchor);
    }
    pages.append(text);
  }
  async function library() {
    if (!libraryPromise) libraryPromise = import(`${PDF_CDN}/build/pdf.min.mjs`).then(module => {
      module.GlobalWorkerOptions.workerSrc = `${PDF_CDN}/build/pdf.worker.min.mjs`;
      return module;
    }).catch(error => { libraryPromise = null; throw error; });
    return libraryPromise;
  }
  async function select(index) {
    selected = index;
    const ticket = ++loadId;
    stopRendering(); pdf = null; pageWidth = 0;
    if (loadingTask) { loadingTask.destroy().catch(() => {}); loadingTask = null; }
    const link = links[index];
    reader.style.setProperty('--accent', link.dataset.accent);
    document.getElementById('reader-title').textContent = link.dataset.title;
    document.getElementById('reader-pdf').href = link.href;
    document.getElementById('reader-download').href = link.href;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    scroller.scrollTop = 0; scroller.scrollLeft = 0;
    position.textContent = 'Loading PDF…'; status('Loading the complete PDF…');
    try {
      const module = await library();
      if (ticket !== loadId || !reader.open) return;
      loadingTask = module.getDocument({url: link.href, isEvalSupported: false});
      const document = await loadingTask.promise;
      if (ticket !== loadId || !reader.open) return;
      pdf = document;
      await buildPages();
    } catch (error) {
      if (ticket !== loadId || !reader.open) return;
      position.textContent = 'PDF could not load';
      status('The reader could not load this PDF.', true);
    }
  }
  function width() {
    if (scroller.classList.contains('is-zoomed')) return innerWidth <= 760 ? 700 : 1300;
    const style = getComputedStyle(scroller);
    return Math.max(200, Math.min(1000, scroller.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)));
  }
  async function buildPages() {
    if (!pdf || !reader.open) return;
    stopRendering();
    const generation = renderId, document = pdf;
    pageWidth = width();
    const first = await document.getPage(1);
    if (generation !== renderId || document !== pdf) return;
    const base = first.getViewport({scale: 1});
    pages.replaceChildren();
    const figures = [];
    for (let number = 1; number <= document.numPages; number++) {
      const figure = window.document.createElement('figure');
      figure.className = 'pdf-page is-loading'; figure.style.width = `${pageWidth}px`;
      figure.dataset.page = String(number);
      const sheet = window.document.createElement('div'); sheet.className = 'pdf-sheet';
      sheet.style.aspectRatio = `${base.width} / ${base.height}`;
      const caption = window.document.createElement('figcaption');
      caption.textContent = `Page ${number} of ${document.numPages}`;
      figure.append(sheet, caption); pages.append(figure); figures.push(figure);
    }
    position.textContent = `Page 1 of ${document.numPages}`;
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        queue.push({figure:entry.target, document, generation, targetWidth:pageWidth});
      }
      drain();
    }, {root:scroller, rootMargin:'650px 200px'});
    figures.forEach(figure => observer.observe(figure));
  }
  function drain() {
    while (running < 2 && queue.length) {
      const job = queue.shift();
      if (job.generation !== renderId) continue;
      running++;
      renderPage(job).finally(() => { running--; drain(); });
    }
  }
  async function renderPage({figure, document, generation, targetWidth}) {
    let task;
    try {
      const page = await document.getPage(Number(figure.dataset.page));
      if (generation !== renderId) return;
      const base = page.getViewport({scale:1});
      const viewport = page.getViewport({scale:targetWidth/base.width});
      const density = Math.min(2.5, Math.max(2, window.devicePixelRatio || 1));
      const paint = window.document.createElement('canvas');
      paint.width = Math.ceil(viewport.width*density); paint.height = Math.ceil(viewport.height*density);
      paint.setAttribute('aria-hidden','true');
      const sheet = figure.querySelector('.pdf-sheet');
      sheet.style.aspectRatio = `${viewport.width} / ${viewport.height}`;
      task = page.render({canvas:paint, canvasContext:paint.getContext('2d'), viewport,
        transform:[density,0,0,density,0,0]});
      renders.add(task); await task.promise; renders.delete(task);
      if (generation !== renderId) return;
      sheet.append(paint); figure.classList.remove('is-loading');
      const [annotations, content] = await Promise.all([page.getAnnotations(),page.getTextContent()]);
      if (generation !== renderId) return;
      const text = window.document.createElement('p'); text.className = 'page-text';
      text.textContent = content.items.map(item => item.str || '').join(' '); sheet.append(text);
      const layer = window.document.createElement('div'); layer.className = 'pdf-link-layer';
      for (const annotation of annotations) {
        if (!annotation.url || !annotation.rect) continue;
        let url; try { url = new URL(annotation.url); } catch { continue; }
        if (!['https:','http:','mailto:','tel:'].includes(url.protocol)) continue;
        const [a,b,c,d,e,f] = viewport.transform;
        const [x1,y1,x2,y2] = annotation.rect;
        const rect = [a*x1+c*y1+e,b*x1+d*y1+f,a*x2+c*y2+e,b*x2+d*y2+f];
        const anchor = window.document.createElement('a'); anchor.href=url.href;
        anchor.target='_blank'; anchor.rel='noopener noreferrer';
        anchor.setAttribute('aria-label',annotation.title || `Open ${url.hostname || url.href}`);
        anchor.style.left=`${Math.min(rect[0],rect[2])/viewport.width*100}%`;
        anchor.style.top=`${Math.min(rect[1],rect[3])/viewport.height*100}%`;
        anchor.style.width=`${Math.abs(rect[2]-rect[0])/viewport.width*100}%`;
        anchor.style.height=`${Math.abs(rect[3]-rect[1])/viewport.height*100}%`;
        layer.append(anchor);
      }
      sheet.append(layer);
    } catch (error) {
      if (generation !== renderId || error.name === 'RenderingCancelledException') return;
      console.warn('PDF page rendering failed:', error.message);
      figure.classList.remove('is-loading');
      const text = window.document.createElement('p'); text.className='reader-status';
      text.textContent='This page could not render. Use Open PDF above to read it.';
      figure.querySelector('.pdf-sheet').append(text);
    } finally { if(task) renders.delete(task); }
  }
  links.forEach((link,index) => link.addEventListener('click',event => {
    if(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); reader.showModal();
    scroller.classList.remove('is-zoomed'); zoom.setAttribute('aria-pressed','false');
    zoom.textContent='Zoom in +'; zoom.setAttribute('aria-label','Zoom in on PDF'); select(index);
  }));
  zoom.addEventListener('click',() => {
    const enlarged=scroller.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed',String(enlarged)); zoom.textContent=enlarged?'Fit width −':'Zoom in +';
    zoom.setAttribute('aria-label',enlarged?'Fit PDF to width':'Zoom in on PDF');
    buildPages();
  });
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(() => {
      if(pdf && reader.open && Math.abs(width()-pageWidth)>2) buildPages();
    },150);
  }).observe(scroller);
  let scrollPending=false;
  scroller.addEventListener('scroll',() => {
    if(scrollPending || !pdf) return; scrollPending=true;
    requestAnimationFrame(() => {
      scrollPending=false; if(!pdf) return;
      const line=scroller.getBoundingClientRect().top+scroller.clientHeight*.35;
      let number=1;
      for(const figure of pages.querySelectorAll('.pdf-page')) {
        if(figure.getBoundingClientRect().top<=line) number=Number(figure.dataset.page);
      }
      position.textContent=`Page ${number} of ${pdf.numPages}`;
    });
  },{passive:true});
  document.getElementById('reader-close').addEventListener('click',() => reader.close());
  reader.addEventListener('close',() => {
    loadId++; stopRendering(); pdf=null;
    if(loadingTask) { loadingTask.destroy().catch(()=>{}); loadingTask=null; }
    pages.replaceChildren();
  });
  reader.addEventListener('click',event => {
    if(event.target!==reader) return;
    const box=reader.getBoundingClientRect();
    if(event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom) reader.close();
  });
  reader.addEventListener('keydown',event => {
    if(event.key!=='ArrowLeft' && event.key!=='ArrowRight') return;
    if(event.target===scroller) return;
    event.preventDefault(); select((selected+(event.key==='ArrowRight'?1:-1)+links.length)%links.length);
  });
})();
