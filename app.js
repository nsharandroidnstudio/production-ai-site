// AI קל site: problem filter, mobile menu, copy buttons, header shadow, gentle reveal.
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const chips = document.querySelectorAll('.chip');
  const cards = [...document.querySelectorAll('.card')];
  const count = document.getElementById('count');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    const cat = chip.dataset.cat;
    const before = new Map(cards.filter((c) => !c.hidden).map((c) => [c, c.getBoundingClientRect()]));
    let n = 0;
    cards.forEach((card) => { const show = cat === 'all' || card.dataset.cat === cat; card.hidden = !show; if (show) n++; });
    if (count) count.textContent = n === 1 ? 'פתרון אחד' : n + ' פתרונות';
    if (reduce || !cards[0].animate) return;
    // FLIP: cards that stayed glide to their new place, new ones pop in
    cards.filter((c) => !c.hidden).forEach((card, i) => {
      card.classList.add('in');
      const was = before.get(card); const now = card.getBoundingClientRect();
      if (was) {
        card.animate([{ transform: `translate(${was.left - now.left}px, ${was.top - now.top}px)` }, { transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' });
      } else {
        card.animate([{ opacity: 0, transform: 'scale(.92) translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: i * 50, easing: 'cubic-bezier(.2,.9,.3,1.2)', fill: 'backwards' });
      }
    });
  }));

  // hero chat: question, typing, answer, on a loop
  const bq = document.getElementById('bq'), ba = document.getElementById('ba'), bat = document.getElementById('bat');
  const convo = [
    ['כל חמישי, רשימת קניות?', 'משימה מתוזמנת'],
    ['החומר למבחן מפוזר?', 'מחברת עם פודקאסט'],
    ['קבלות בכל המחשב?', 'Cowork מסדר לבד'],
    ['אלף פרטים לבר מצווה?', 'פרויקט שזוכר הכל'],
  ];
  if (bq && ba && !reduce) {
    let k = 0;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    (async function loop() {
      await wait(1600);
      for (;;) {
        k = (k + 1) % convo.length;
        bq.classList.add('hide'); ba.classList.add('hide');
        await wait(450);
        bq.textContent = convo[k][0]; bat.textContent = convo[k][1];
        bq.classList.remove('hide');
        await wait(700);
        ba.classList.add('typing'); ba.classList.remove('hide');
        await wait(1100);
        ba.classList.remove('typing');
        await wait(2600);
      }
    })();
  }

  // hero parallax
  const art = document.querySelector('.hero-art');
  if (art && !reduce && window.matchMedia('(pointer: fine)').matches) {
    document.querySelector('.hero').addEventListener('pointermove', (e) => {
      const r = art.getBoundingClientRect();
      art.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      art.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
  }

  const menu = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (menu && nav) {
    menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));
  }

  document.querySelectorAll('.copy').forEach((btn) => btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    const done = () => { btn.textContent = 'הועתק'; setTimeout(() => (btn.textContent = 'העתקה'), 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done).catch(() => select(btn)); else select(btn);
  }));
  function select(btn) {
    const code = btn.parentElement.querySelector('code');
    const r = document.createRange(); r.selectNodeContents(code);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  const top = document.querySelector('.top');
  const onScroll = () => top && top.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (!reduce && 'IntersectionObserver' in window) {
    const els = [...document.querySelectorAll('[data-rise]')].filter((el) => el.getBoundingClientRect().top > window.innerHeight);
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => { el.classList.add('rise'); io.observe(el); });
  }
})();
