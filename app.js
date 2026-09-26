/* ===================================================
   THREE.JS — safe dynamic import
=================================================== */
let THREE = null;
try {
  THREE = await import('three');
} catch (e) {
  console.warn('Three.js failed to load:', e);
  document.querySelectorAll('#hero-canvas, #journey-canvas, #final-canvas').forEach(c => {
    c.style.background = 'radial-gradient(circle at 50% 50%, rgba(74,44,26,0.6), #0f0905 70%)';
  });
}
function hasThree() { return THREE !== null; }

/* ===================================================
   1. LOADER
=================================================== */
(function loader(){
  const bar = document.getElementById('loader-bar-fill');
  const loader = document.getElementById('loader');
  if (!loader) return;
  let pct = 0;
  const id = setInterval(() => {
    pct = Math.min(100, pct + Math.random()*16 + 5);
    bar.style.width = pct + '%';
    if (pct >= 100) {
      clearInterval(id);
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
  }, 140);
  setTimeout(() => { clearInterval(id); loader.classList.add('hidden'); }, 3000);
})();
window.addEventListener('error', () => {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
});

/* ===================================================
   2. NAVBAR
=================================================== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('mobile-nav').classList.add('open');
});
document.getElementById('mobile-close').addEventListener('click', () => {
  document.getElementById('mobile-nav').classList.remove('open');
});
document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobile-nav').classList.remove('open'));
});

/* ===================================================
   3. CUSTOM CURSOR
=================================================== */
(function cursor(){
  if (window.matchMedia('(hover:none)').matches) return;
  const dot = document.getElementById('cursor');
  let x = innerWidth/2, y = innerHeight/2, rx = x, ry = y;
  window.addEventListener('mousemove', e => {
    rx = e.clientX; ry = e.clientY;
    const t = e.target.closest('a,button,.menu-item,[data-cursor]');
    dot.classList.toggle('hover', !!t);
  });
  (function loop(){
    x += (rx - x) * 0.2;
    y += (ry - y) * 0.2;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.body.style.cursor = 'none';
})();

/* ===================================================
   4. MENU DATA
=================================================== */
const MENU = [
  { id:'signature', name:'Signature Espresso', tag:'Signature · Double Shot',
    notes:'Rich · Bold · Chocolate', flavors:['Cocoa','Caramel','Molasses'],
    origin:'Brazil · Colombia', price:6.5,
    desc:'Our flagship espresso — pulled hot, dense, and full-bodied. A shot built for the daily ritual.',
    img:'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&q=80' },
  { id:'house', name:'House Latte', tag:'House Favorite',
    notes:'Smooth · Nutty · Velvet', flavors:['Steamed Milk','Almond','Brown Sugar'],
    origin:'Colombia · Guatemala', price:7.0,
    desc:'Silky steamed milk poured over a balanced double shot. The kind of cup you order again tomorrow.',
    img:'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80' },
  { id:'ethiopian', name:'Ethiopian Pour Over', tag:'Single Origin',
    notes:'Floral · Citrus · Bright', flavors:['Jasmine','Bergamot','Stone Fruit'],
    origin:'Yirgacheffe, Ethiopia', price:8.5,
    desc:'Hand-poured Yirgacheffe. Delicate, tea-like, and luminous. Best enjoyed without milk.',
    img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' },
  { id:'midnight', name:'Midnight Mocha', tag:'Dark Roast',
    notes:'Deep · Smoky · Intense', flavors:['Dark Chocolate','Espresso','Cream'],
    origin:'Sumatra · Brazil', price:9.0,
    desc:'Our darkest roast married with single-origin cocoa. Rich, warm, and unapologetically grown-up.',
    img:'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80' },
  { id:'flat', name:'Flat White', tag:'Barista Pick',
    notes:'Balanced · Silky · Clean', flavors:['Micro-foam','Cocoa','Hazelnut'],
    origin:'Colombia · Brazil', price:7.5,
    desc:'A true flat white — ristretto shots, glossy micro-foam, and a dense, sweet finish.',
    img:'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80' },
  { id:'cold', name:'Cold Brew Ritual', tag:'Seasonal',
    notes:'Smooth · Sweet · Low-Acid', flavors:['Vanilla','Cacao Nib','Orange Peel'],
    origin:'Brazil · Ethiopia', price:8.0,
    desc:'Steeped 16 hours, served over hand-cut ice. Our take on slow coffee, cold.',
    img:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80' }
];

const menuGrid = document.getElementById('menu-grid');
MENU.forEach(drink => {
  const el = document.createElement('article');
  el.className = 'menu-item';
  el.innerHTML = `
    <div class="menu-photo">
      <img src="${drink.img}" alt="${drink.name}" loading="lazy" />
    </div>
    <div class="menu-info">
      <div class="roast">${drink.tag}</div>
      <h4>${drink.name}</h4>
      <div class="notes">${drink.notes}</div>
      <div class="desc">${drink.desc}</div>
      <div class="menu-foot">
        <span class="menu-price">$${drink.price.toFixed(2)}</span>
        <button class="add-btn" data-id="${drink.id}">See Details →</button>
      </div>
    </div>
  `;
  el.addEventListener('click', e => {
    if (e.target.closest('.add-btn')) return;
    openModal(drink);
  });
  el.querySelector('.add-btn').addEventListener('click', e => {
    e.stopPropagation();
    openModal(drink);
  });
  menuGrid.appendChild(el);
});

/* ===================================================
   5. MODAL
=================================================== */
const modalOverlay = document.getElementById('modal-overlay');
const modalBox = document.getElementById('modal-box');

function openModal(drink) {
  document.getElementById('modal-roast').textContent = drink.tag;
  document.getElementById('modal-name').textContent = drink.name;
  document.getElementById('modal-desc').textContent = drink.desc;
  document.getElementById('modal-origin').textContent = drink.origin;
  document.getElementById('modal-flavors').textContent = drink.flavors.join(' · ');
  document.getElementById('modal-price').textContent = '$' + drink.price.toFixed(2);
  const img = document.getElementById('modal-img');
  img.src = drink.img;
  img.alt = drink.name;
  modalOverlay.classList.add('open');
  modalBox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modalOverlay.classList.remove('open');
  modalBox.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('modal-close').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

/* ===================================================
   6. ROAST LAB
=================================================== */
const ROASTS = [
  { id:'light', name:'Light', flavors:['Bright','Floral','Citrus'],
    coffeeHi:'#d4a574', coffeeMid:'#a8734c', coffeeLo:'#6b3d20', shine:'0.45',
    desc:'Preserves origin character — bright, floral, and delicate. Roasted just past first crack.' },
  { id:'medium', name:'Medium', flavors:['Balanced','Sweet','Nutty'],
    coffeeHi:'#c48b4f', coffeeMid:'#9e6338', coffeeLo:'#8d5430', shine:'0.35',
    desc:'The balance point. Caramelization develops sweetness while origin notes remain present.' },
  { id:'med-dark', name:'Medium-Dark', flavors:['Chocolate','Toasted','Full'],
    coffeeHi:'#b8752e', coffeeMid:'#88512a', coffeeLo:'#804928', shine:'0.25',
    desc:'Deeper body, richer sugars. Notes of dark chocolate and toasted nuts emerge.' },
  { id:'dark', name:'Dark', flavors:['Bold','Smoky','Intense'],
    coffeeHi:'#aa6419', coffeeMid:'#7a431b', coffeeLo:'#6d3816', shine:'0.15',
    desc:'Bold and smoky. Oils reach the surface, delivering intensity and a long, resonant finish.' }
];
const rl = document.getElementById('roast-levels');
let activeRoast = 0;
ROASTS.forEach((r, i) => {
  const b = document.createElement('button');
  b.className = 'roast-pill' + (i === 0 ? ' active' : '');
  b.textContent = r.name;
  b.onclick = () => { activeRoast = i; updateRoast(); };
  rl.appendChild(b);
});
function updateRoast() {
  const r = ROASTS[activeRoast];
  document.querySelectorAll('#roast-levels .roast-pill').forEach((b, i) => {
    b.classList.toggle('active', i === activeRoast);
  });
  document.getElementById('roast-name').textContent = r.name;
  document.getElementById('roast-desc').textContent = r.desc;
  const liquid = document.getElementById('coffee-liquid');
  liquid.style.setProperty('--coffee-hi', r.coffeeHi);
  liquid.style.setProperty('--coffee-mid', r.coffeeMid);
  liquid.style.setProperty('--coffee-lo', r.coffeeLo);
  liquid.style.setProperty('--coffee-shine', r.shine);
  const fl = document.getElementById('roast-flavors');
  fl.innerHTML = '';
  r.flavors.forEach(f => {
    const s = document.createElement('span');
    s.style.cssText = 'font-size:10px;letter-spacing:0.28em;text-transform:uppercase;padding:8px 14px;border:1px solid var(--line);color:var(--cream);font-weight:600';
    s.textContent = f;
    fl.appendChild(s);
  });
}
updateRoast();

/* ===================================================
   7. SIGNATURE SERIES
=================================================== */
const SIGNATURES = [
  { name:'Signature <em>Espresso</em>', eyebrow:'Signature Drink',
    notes:'Rich · Bold · Chocolate',
    flavors:['Cocoa','Caramel','Molasses'],
    desc:'Our flagship espresso — pulled hot, dense, and full-bodied. A shot built for the daily ritual.',
    cupHi:'#a8734c', cupMid:'#805134', cupLo:'#794d31' },
  { name:'House <em>Latte</em>', eyebrow:'House Favorite',
    notes:'Smooth · Velvet · Nutty',
    flavors:['Steamed Milk','Almond','Brown Sugar'],
    desc:'Silky steamed milk poured over a balanced double shot. The kind of cup you order again tomorrow.',
    cupHi:'#d4a574', cupMid:'#86461d', cupLo:'#64341a' },
  { name:'Ethiopian <em>Pour Over</em>', eyebrow:'Single Origin',
    notes:'Floral · Citrus · Bright',
    flavors:['Jasmine','Bergamot','Stone Fruit'],
    desc:'Hand-poured Yirgacheffe. Delicate, tea-like, and luminous. Best enjoyed without milk.',
    cupHi:'#996732', cupMid:'#74492f', cupLo:'#55321c' },
  { name:'Midnight <em>Mocha</em>', eyebrow:'Dark Roast',
    notes:'Deep · Smoky · Intense',
    flavors:['Dark Chocolate','Espresso','Cream'],
    desc:'Our darkest roast married with single-origin cocoa. Rich, warm, and unapologetically grown-up.',
    cupHi:'#975126', cupMid:'#835c4b', cupLo:'#6b270c' }
];
const sigList = document.getElementById('sig-list');
let activeSig = 0;
SIGNATURES.forEach((s, i) => {
  const el = document.createElement('button');
  el.className = 'sig-drink' + (i === 0 ? ' active' : '');
  el.innerHTML = `
    <span class="sig-drink-name">${s.name.replace(/<[^>]*>/g,'')}</span>
    <span class="sig-drink-meta">${s.flavors[0]}</span>
  `;
  el.onclick = () => { activeSig = i; updateSignature(); };
  sigList.appendChild(el);
});
function updateSignature() {
  const s = SIGNATURES[activeSig];
  document.querySelectorAll('.sig-drink').forEach((d, i) => d.classList.toggle('active', i === activeSig));
  document.getElementById('sig-eyebrow').textContent = s.eyebrow;
  document.getElementById('sig-title').innerHTML = s.name;
  document.getElementById('sig-desc').textContent = s.desc;
  const notesEl = document.getElementById('sig-notes');
  notesEl.innerHTML = '';
  s.flavors.forEach(f => {
    const el = document.createElement('span');
    el.className = 'sig-note';
    el.textContent = f;
    notesEl.appendChild(el);
  });
  const liquid = document.getElementById('sc-liquid');
  liquid.style.setProperty('--sc-hi', s.cupHi);
  liquid.style.setProperty('--sc-mid', s.cupMid);
  liquid.style.setProperty('--sc-lo', s.cupLo);
}
updateSignature();

/* ===================================================
   8. CONTACT + NEWSLETTER
=================================================== */
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('c-name').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const message = document.getElementById('c-message').value.trim();
  const errName = document.getElementById('err-name');
  const errEmail = document.getElementById('err-email');
  const errMsg = document.getElementById('err-message');
  const success = document.getElementById('contact-success');
  let ok = true;
  errName.style.display = errEmail.style.display = errMsg.style.display = 'none';
  success.style.display = 'none';
  if (!name) { errName.textContent = 'Please enter your name.'; errName.style.display = 'block'; ok = false; }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { errEmail.textContent = 'Please enter a valid email.'; errEmail.style.display = 'block'; ok = false; }
  if (message.length < 8) { errMsg.textContent = 'Message must be at least 8 characters.'; errMsg.style.display = 'block'; ok = false; }
  if (ok) {
    success.style.display = 'block';
    e.target.reset();
    setTimeout(() => success.style.display = 'none', 4000);
  }
});
document.getElementById('newsletter-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('newsletter-email').value.trim();
  const ok = document.getElementById('newsletter-success');
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    ok.style.display = 'block';
    e.target.reset();
    setTimeout(() => ok.style.display = 'none', 4000);
  } else {
    alert('Please enter a valid email.');
  }
});

/* ===================================================
   9. STAT COUNTERS
=================================================== */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      const el = en.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const pad = parseInt(el.dataset.pad || 0, 10);
      let cur = 0;
      const step = Math.max(1, target / 40);
      const tick = () => {
        cur += step;
        if (cur >= target) cur = target;
        const val = Math.floor(cur);
        el.textContent = (pad ? String(val).padStart(pad, '0') : val) + suffix;
        if (cur < target) requestAnimationFrame(tick);
      };
      tick();
      io.unobserve(el);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat .num').forEach(el => io.observe(el));

/* ===================================================
   10. SMOOTH SCROLL
=================================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior:'smooth' }); }
    }
  });
});

/* ===================================================
   11. HERO CUP — Small, on right, coffee clearly visible,
       auto-rotates, click changes roast
=================================================== */
(function heroScene(){
  if (!hasThree()) return;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const w = canvas.clientWidth || 380;
  const h = canvas.clientHeight || 380;
  const camera = new THREE.PerspectiveCamera(38, w/h, 0.1, 100);
  camera.position.set(0, 1.2, 4.2);
  camera.lookAt(0, -0.2, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(w, h, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  scene.add(new THREE.AmbientLight(0xa89480, 0.6));
  const key = new THREE.DirectionalLight(0xf5e6cc, 1.6);
  key.position.set(4, 6, 5); scene.add(key);
  const warm = new THREE.PointLight(0xd4a574, 1.8, 14);
  warm.position.set(-4, 1, 3); scene.add(warm);
  const rim = new THREE.PointLight(0xc99a6b, 1.4, 12);
  rim.position.set(3, -1, -2); scene.add(rim);

  /* CUP GROUP */
  const cup = new THREE.Group();
  cup.position.y = -0.15;
  scene.add(cup);

  /* Saucer */
  const saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.45, 0.07, 64),
    new THREE.MeshStandardMaterial({ color: 0xf5e6cc, roughness: 0.35, metalness: 0.06 })
  );
  saucer.position.y = -1.05;
  cup.add(saucer);

  const saucerRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.4, 0.025, 16, 80),
    new THREE.MeshStandardMaterial({ color: 0xd4a574, metalness: 0.75, roughness: 0.22 })
  );
  saucerRim.position.y = -1.02;
  saucerRim.rotation.x = Math.PI/2;
  cup.add(saucerRim);

  /* Cup body (open top so we can see coffee inside) */
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.98, 0.72, 1.6, 64, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0xf5e6cc, roughness: 0.3, metalness: 0.08,
      side: THREE.DoubleSide
    })
  );
  body.position.y = -0.15;
  cup.add(body);

  const bottom = new THREE.Mesh(
    new THREE.CircleGeometry(0.72, 48),
    new THREE.MeshStandardMaterial({ color: 0xe8d5b8, roughness: 0.5, side: THREE.DoubleSide })
  );
  bottom.position.y = -0.92;
  bottom.rotation.x = -Math.PI/2;
  cup.add(bottom);

  /* Coffee INSIDE — slightly lower, so top-down view shows it clearly */
  const coffeeMat = new THREE.MeshStandardMaterial({
    color: 0x4a2c1a, roughness: 0.18, metalness: 0.22,
    emissive: 0x1a0f08, emissiveIntensity: 0.15
  });
  const coffee = new THREE.Mesh(
    new THREE.CircleGeometry(0.93, 64),
    coffeeMat
  );
  coffee.position.y = 0.4;
  coffee.rotation.x = -Math.PI/2;
  cup.add(coffee);

  /* Crema ring */
  const cremaMat = new THREE.MeshStandardMaterial({
    color: 0xc99a6b, roughness: 0.4, metalness: 0.15,
    emissive: 0xc99a6b, emissiveIntensity: 0.25
  });
  const crema = new THREE.Mesh(
    new THREE.TorusGeometry(0.89, 0.02, 12, 80),
    cremaMat
  );
  crema.position.y = 0.405;
  crema.rotation.x = Math.PI/2;
  cup.add(crema);

  /* Rim */
  const rimTorus = new THREE.Mesh(
    new THREE.TorusGeometry(0.98, 0.035, 16, 80),
    new THREE.MeshStandardMaterial({ color: 0xfdf6e8, roughness: 0.3, metalness: 0.08 })
  );
  rimTorus.position.y = 0.65;
  rimTorus.rotation.x = Math.PI/2;
  cup.add(rimTorus);

  /* Handle */
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.44, 0.09, 20, 48, Math.PI * 1.35),
    new THREE.MeshStandardMaterial({ color: 0xf5e6cc, roughness: 0.32, metalness: 0.08 })
  );
  handle.position.set(1.2, 0, 0);
  handle.rotation.z = -Math.PI / 2 - 0.25;
  cup.add(handle);

  /* Steam */
  const steamGroup = new THREE.Group();
  cup.add(steamGroup);
  for (let i = 0; i < 16; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.09 + Math.random() * 0.07, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xf5e6cc, transparent: true, opacity: 0.16 })
    );
    s.position.set(
      (Math.random() - 0.5) * 0.6,
      0.75 + Math.random() * 1.2,
      (Math.random() - 0.5) * 0.4
    );
    s.userData.speed = 0.25 + Math.random() * 0.4;
    s.userData.wobble = Math.random() * Math.PI * 2;
    steamGroup.add(s);
  }

  /* Roast palette */
  const ROAST_PALETTE = [
    { mid:0xa8734c, lo:0x6b3d20, crema:0xd9b48f }, // Light
    { mid:0x6b3d20, lo:0x3a1f10, crema:0xb89870 }, // Medium
    { mid:0x4a2c1a, lo:0x1a0f08, crema:0x8b5a3c }, // Medium-Dark
    { mid:0x2a1810, lo:0x0a0503, crema:0x4a2c1a }  // Dark
  ];
  let roastIndex = 2;
  function applyRoast(i) {
    const p = ROAST_PALETTE[i];
    coffeeMat.color.setHex(p.mid);
    coffeeMat.emissive.setHex(p.lo);
    cremaMat.color.setHex(p.crema);
    cremaMat.emissive.setHex(p.crema);
  }
  applyRoast(roastIndex);

  canvas.style.pointerEvents = 'auto';
  canvas.style.cursor = 'pointer';
  canvas.addEventListener('click', () => {
    roastIndex = (roastIndex + 1) % ROAST_PALETTE.length;
    applyRoast(roastIndex);
  });

  /* Ambient dust */
  const dustGeo = new THREE.BufferGeometry();
  const dustCount = 60;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i*3]   = (Math.random() - 0.5) * 5;
    dustPos[i*3+1] = (Math.random() - 0.5) * 3;
    dustPos[i*3+2] = (Math.random() - 0.5) * 3;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xd4a574, size: 0.03, transparent: true, opacity: 0.5
  }));
  scene.add(dust);

  const clock = new THREE.Clock();
  (function loop(){
    const dt = clock.getDelta();
    const t = clock.elapsedTime;

    /* Continuous slow circular rotation */
    cup.rotation.y += dt * 0.4;

    /* Gentle float */
    cup.position.y = -0.15 + Math.sin(t * 0.8) * 0.06;

    /* Steam */
    steamGroup.children.forEach(s => {
      s.position.y += dt * s.userData.speed;
      s.position.x += Math.sin(t * 1.2 + s.userData.wobble) * dt * 0.15;
      if (s.position.y > 2.0) s.position.y = 0.75;
      const life = (s.position.y - 0.75) / 1.25;
      s.material.opacity = Math.max(0, 0.18 * (1 - life));
      s.scale.setScalar(0.7 + life * 1.4);
    });

    dust.rotation.y += dt * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();

  window.addEventListener('resize', () => {
    const w = canvas.clientWidth || 380;
    const h = canvas.clientHeight || 380;
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  });
})();

/* ===================================================
   12. JOURNEY — Rich warm café 3D scene
=================================================== */
(function journeyScene(){
  if (!hasThree()) return;
  const canvas = document.getElementById('journey-canvas');
  if (!canvas) return;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0f0905, 18, 50);
  const camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 200);
  camera.position.set(0, 1.0, 8);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  /* Warm café lighting */
  scene.add(new THREE.AmbientLight(0xd4a574, 0.35));
  const key = new THREE.DirectionalLight(0xffd9a8, 1.4);
  key.position.set(5, 8, 6); scene.add(key);
  const warm1 = new THREE.PointLight(0xff9d5c, 2.0, 20);
  warm1.position.set(-4, 3, -10); scene.add(warm1);
  const warm2 = new THREE.PointLight(0xd4a574, 1.8, 20);
  warm2.position.set(4, 3, -30); scene.add(warm2);
  const warm3 = new THREE.PointLight(0xffb060, 1.6, 20);
  warm3.position.set(-3, 3, -55); scene.add(warm3);
  const warm4 = new THREE.PointLight(0xffd9a8, 1.5, 20);
  warm4.position.set(3, 3, -80); scene.add(warm4);

  /* ============ COMMON ELEMENTS ============ */

  /* Wood floor */
  const floorGeo = new THREE.PlaneGeometry(60, 200);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x2a1810, roughness: 0.9, metalness: 0.05
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(0, -1.8, -50);
  scene.add(floor);

  /* Wooden beam pattern (simple stripes) */
  for (let i = 0; i < 40; i++) {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.02, 60),
      new THREE.MeshStandardMaterial({ color: 0x1a0f08, roughness: 0.95 })
    );
    beam.position.set(-30 + i * 1.5, -1.78, -50);
    scene.add(beam);
  }

  /* Back wall (dark) */
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a0f08, roughness: 0.85 });
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), wallMat);
  backWall.position.set(0, 4, -110);
  scene.add(backWall);

  /* Hanging pendant lamps (visible throughout journey) */
  function makePendantLamp(x, z, lightColor) {
    const g = new THREE.Group();
    g.position.set(x, 4.5, z);

    /* Cord */
    const cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 3.0, 6),
      new THREE.MeshStandardMaterial({ color: 0x2a1810 })
    );
    cord.position.y = -1.5;
    g.add(cord);

    /* Shade */
    const shade = new THREE.Mesh(
      new THREE.ConeGeometry(0.5, 0.6, 24, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x1a0f08, metalness: 0.85, roughness: 0.35,
        side: THREE.DoubleSide
      })
    );
    shade.position.y = -3.1;
    shade.rotation.x = Math.PI;
    g.add(shade);

    /* Glow */
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 12),
      new THREE.MeshBasicMaterial({ color: lightColor, transparent: true, opacity: 0.7 })
    );
    glow.position.y = -3.2;
    g.add(glow);

    /* Light */
    const l = new THREE.PointLight(lightColor, 2.0, 8);
    l.position.y = -3.4;
    g.add(l);

    scene.add(g);
    return g;
  }

  makePendantLamp(-3, -3, 0xffca7a);
  makePendantLamp(3, -3, 0xffca7a);
  makePendantLamp(-3, -25, 0xffb060);
  makePendantLamp(3, -25, 0xffb060);
  makePendantLamp(-3, -47, 0xd4a574);
  makePendantLamp(3, -47, 0xd4a574);
  makePendantLamp(-3, -69, 0xff9d5c);
  makePendantLamp(3, -69, 0xff9d5c);
  makePendantLamp(-3, -91, 0xffca7a);
  makePendantLamp(3, -91, 0xffca7a);

  /* ============ STAGE 0 — Coffee bar / counter with beans ============ */
  const s0 = new THREE.Group();
  scene.add(s0);

  /* Wooden counter */
  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.3, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x3a1f10, roughness: 0.75 })
  );
  counter.position.y = -0.6;
  s0.add(counter);

  /* Counter legs */
  for (let i = 0; i < 4; i++) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 1.2, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.85 })
    );
    leg.position.set(i < 2 ? -2.7 : 2.7, -1.4, i % 2 === 0 ? -0.5 : 0.5);
    s0.add(leg);
  }

  /* Small glass jars with beans */
  for (let j = 0; j < 3; j++) {
    const jar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.8, 20, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: 0xdfe6e6, transparent: true, opacity: 0.25,
        roughness: 0.05, side: THREE.DoubleSide
      })
    );
    jar.position.set(-1.8 + j*1.8, -0.05, 0);
    s0.add(jar);

    /* Beans inside */
    for (let k = 0; k < 15; k++) {
      const bean = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0x4a2c1a, roughness: 0.7 })
      );
      bean.scale.set(1, 0.72, 0.9);
      bean.position.set(
        -1.8 + j*1.8 + (Math.random()-0.5)*0.5,
        -0.35 + Math.random()*0.5,
        (Math.random()-0.5)*0.5
      );
      s0.add(bean);
    }
  }

  /* ============ STAGE 1 — Roasting area ============ */
  const s1 = new THREE.Group();
  s1.position.z = -22;
  scene.add(s1);

  /* Industrial roaster */
  const roasterBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.8, 1.6),
    new THREE.MeshStandardMaterial({ color: 0x3a1f10, metalness: 0.9, roughness: 0.3 })
  );
  roasterBase.position.y = 0;
  s1.add(roasterBase);

  const roasterDrum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.85, 2.4, 32, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0x2a1810, metalness: 0.95, roughness: 0.25,
      side: THREE.DoubleSide
    })
  );
  roasterDrum.rotation.z = Math.PI/2;
  roasterDrum.position.y = 1.3;
  s1.add(roasterDrum);

  /* Gold rings */
  const drumRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.85, 0.05, 16, 48),
    new THREE.MeshStandardMaterial({ color: 0xd4a574, metalness: 0.95, roughness: 0.2 })
  );
  drumRing.rotation.z = Math.PI/2;
  drumRing.position.y = 1.3;
  s1.add(drumRing);

  /* Fire glow below */
  const fireGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 20, 16),
    new THREE.MeshBasicMaterial({ color: 0xff9d5c, transparent: true, opacity: 0.55 })
  );
  fireGlow.position.y = 0.2;
  s1.add(fireGlow);

  const fireLight = new THREE.PointLight(0xff9d5c, 2.4, 6);
  fireLight.position.set(0, 0.3, 0);
  s1.add(fireLight);

  /* Heat particles */
  const heatGroup = new THREE.Group();
  s1.add(heatGroup);
  for (let i = 0; i < 18; i++) {
    const h = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffb060, transparent: true, opacity: 0.5 })
    );
    h.position.set((Math.random()-0.5)*2.2, 0.4 + Math.random()*1.8, (Math.random()-0.5)*1.4);
    heatGroup.add(h);
  }

  /* ============ STAGE 2 — Grinder station ============ */
  const s2 = new THREE.Group();
  s2.position.z = -44;
  scene.add(s2);

  /* Counter */
  const grindCounter = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.3, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x3a1f10, roughness: 0.75 })
  );
  grindCounter.position.y = -0.6;
  s2.add(grindCounter);

  /* Big grinder */
  const grinderBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 1.2, 24),
    new THREE.MeshStandardMaterial({ color: 0x3a1f10, metalness: 0.8, roughness: 0.3 })
  );
  grinderBody.position.y = 0.4;
  s2.add(grinderBody);

  const grinderTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.7, 0.5, 24),
    new THREE.MeshStandardMaterial({ color: 0x2a1810, metalness: 0.85, roughness: 0.28 })
  );
  grinderTop.position.y = 1.25;
  s2.add(grinderTop);

  const grinderKnob = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.06, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0xd4a574, metalness: 0.95, roughness: 0.15 })
  );
  grinderKnob.position.y = 1.55;
  grinderKnob.rotation.x = Math.PI/2;
  s2.add(grinderKnob);

  const grinderBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.55, 0.4, 24),
    new THREE.MeshStandardMaterial({ color: 0x2a1810, metalness: 0.6, roughness: 0.4 })
  );
  grinderBase.position.y = -0.35;
  s2.add(grinderBase);

  /* Grounds falling */
  const grounds = new THREE.Group();
  s2.add(grounds);
  for (let i = 0; i < 40; i++) {
    const g = new THREE.Mesh(
      new THREE.SphereGeometry(0.03 + Math.random()*0.03, 5, 5),
      new THREE.MeshStandardMaterial({ color: 0x3a1f10, roughness: 0.9 })
    );
    g.position.set((Math.random()-0.5)*0.8, Math.random()*2 - 0.8, (Math.random()-0.5)*0.8);
    grounds.add(g);
  }

  /* ============ STAGE 3 — Pour over station ============ */
  const s3 = new THREE.Group();
  s3.position.z = -66;
  scene.add(s3);

  /* Counter */
  const brewCounter = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.3, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x3a1f10, roughness: 0.75 })
  );
  brewCounter.position.y = -0.6;
  s3.add(brewCounter);

  /* Pour-over cone */
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 1.0, 28, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xf5e6cc, roughness: 0.55, side: THREE.DoubleSide })
  );
  cone.position.y = 0.5;
  s3.add(cone);

  /* Coffee inside cone */
  for (let i = 0; i < 8; i++) {
    const c = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0x3a1f10, roughness: 0.95 })
    );
    c.position.set((Math.random()-0.5)*0.6, 0.35, (Math.random()-0.5)*0.6);
    s3.add(c);
  }

  /* Glass carafe */
  const carafe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.7, 1.5, 28, 1, true),
    new THREE.MeshPhysicalMaterial({
      color: 0xdfe6e6, transparent: true, opacity: 0.22,
      roughness: 0.05, side: THREE.DoubleSide
    })
  );
  carafe.position.y = -0.35;
  s3.add(carafe);

  /* Coffee liquid */
  const brewLiquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.6, 0.7, 24),
    new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.3, metalness: 0.12 })
  );
  brewLiquid.position.y = -0.8;
  brewLiquid.scale.y = 0.15;
  s3.add(brewLiquid);

  /* Water stream */
  const stream = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 1.0, 8),
    new THREE.MeshBasicMaterial({ color: 0xd4a574, transparent: true, opacity: 0.6 })
  );
  stream.position.y = 0.1;
  s3.add(stream);

  /* Steam above */
  for (let i = 0; i < 8; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xf5e6cc, transparent: true, opacity: 0.15 })
    );
    s.position.set((Math.random()-0.5)*0.7, 1.3 + i*0.18, (Math.random()-0.5)*0.5);
    s3.add(s);
  }

  /* ============ STAGE 4 — Final cup on marble table ============ */
  const s4 = new THREE.Group();
  s4.position.z = -88;
  scene.add(s4);

  /* Marble table */
  const marbleTable = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 1.8, 0.1, 48),
    new THREE.MeshStandardMaterial({ color: 0xf5e6cc, roughness: 0.25, metalness: 0.1 })
  );
  marbleTable.position.y = -0.85;
  s4.add(marbleTable);

  const tableEdge = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.06, 12, 60),
    new THREE.MeshStandardMaterial({ color: 0xd4a574, metalness: 0.7, roughness: 0.25 })
  );
  tableEdge.position.y = -0.82;
  tableEdge.rotation.x = Math.PI/2;
  s4.add(tableEdge);

  /* Saucer */
  const finalSaucer = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 1.3, 0.06, 40),
    new THREE.MeshStandardMaterial({ color: 0xf5e6cc, roughness: 0.4 })
  );
  finalSaucer.position.y = -0.55;
  s4.add(finalSaucer);

  /* Cup */
  const finalCup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.62, 1.2, 40, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xf5e6cc, roughness: 0.42, side: THREE.DoubleSide })
  );
  finalCup.position.y = 0.15;
  s4.add(finalCup);

  const finalFloor = new THREE.Mesh(
    new THREE.CircleGeometry(0.62, 40),
    new THREE.MeshStandardMaterial({ color: 0xf5e6cc, roughness: 0.5, side: THREE.DoubleSide })
  );
  finalFloor.position.y = -0.4;
  finalFloor.rotation.x = -Math.PI/2;
  s4.add(finalFloor);

  const finalCoffee = new THREE.Mesh(
    new THREE.CircleGeometry(0.81, 44),
    new THREE.MeshStandardMaterial({ color: 0x1a0f08, roughness: 0.16, metalness: 0.2 })
  );
  finalCoffee.position.y = 0.6;
  finalCoffee.rotation.x = -Math.PI/2;
  s4.add(finalCoffee);

  const finalHandle = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.08, 14, 28, Math.PI*1.3),
    new THREE.MeshStandardMaterial({ color: 0xf5e6cc, roughness: 0.42 })
  );
  finalHandle.position.set(1.0, 0.15, 0);
  finalHandle.rotation.x = Math.PI/2;
  s4.add(finalHandle);

  /* Steam */
  const finalSteam = new THREE.Group();
  s4.add(finalSteam);
  for (let i = 0; i < 12; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xf5e6cc, transparent: true, opacity: 0.16 })
    );
    s.position.set((Math.random()-0.5)*0.4, 0.85 + i*0.2, (Math.random()-0.5)*0.3);
    finalSteam.add(s);
  }

  /* ============ Scroll progress ============ */
  let progress = 0;
  let stage = 0;
  const journeySection = document.getElementById('journey');
  function computeProgress() {
    const rect = journeySection.getBoundingClientRect();
    const total = journeySection.offsetHeight - innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    progress = total > 0 ? scrolled / total : 0;
  }
  window.addEventListener('scroll', computeProgress, { passive: true });
  computeProgress();

  const stageEls = document.querySelectorAll('.stage-content');
  const jpItems = document.querySelectorAll('.jp-item');
  function updateStage(s) {
    if (s === stage) return;
    stage = s;
    stageEls.forEach((el, i) => el.classList.toggle('active', i === s));
    jpItems.forEach((el, i) => el.classList.toggle('active', i === s));
  }

  const clock = new THREE.Clock();
  (function loop(){
    const dt = clock.getDelta();
    const t = clock.elapsedTime;
    computeProgress();

    /* Camera path — moves through the café */
    const targetZ = 8 - progress * 96;
    const targetX = Math.sin(progress * Math.PI * 2) * 0.8;
    const targetY = 1.0 + Math.sin(progress * Math.PI * 2.6) * 0.3;
    const k = Math.min(1, dt * 3);
    camera.position.x += (targetX - camera.position.x) * k;
    camera.position.y += (targetY - camera.position.y) * k;
    camera.position.z += (targetZ - camera.position.z) * k;
    camera.lookAt(
      Math.sin(progress * Math.PI * 2) * 0.3,
      0.2 + Math.sin(progress * Math.PI * 1.5) * 0.15,
      camera.position.z - 8
    );
    camera.rotation.z = Math.sin(progress * Math.PI * 3) * 0.02;

    /* Animate stage elements */
    /* Roaster drum spins */
    roasterDrum.rotation.x += dt * 0.6;
    drumRing.rotation.x += dt * 0.6;

    /* Fire glow pulses */
    fireGlow.material.opacity = 0.45 + Math.sin(t * 3) * 0.15;
    fireLight.intensity = 2.0 + Math.sin(t * 3) * 0.6;

    /* Heat particles */
    heatGroup.children.forEach((c, i) => {
      c.position.y += dt * (0.25 + (i%5)*0.08);
      if (c.position.y > 2.2) c.position.y = 0.4;
      const life = (c.position.y - 0.4) / 1.8;
      c.material.opacity = Math.max(0, 0.55 * (1 - life));
      c.scale.setScalar(0.7 + life * 1.5);
    });

    /* Grinder knob spins */
    grinderKnob.rotation.z += dt * 2.4;

    /* Grounds fall */
    grounds.children.forEach((c, i) => {
      c.position.y -= dt * (0.5 + (i%5)*0.1);
      if (c.position.y < -1.6) c.position.y = 1.4;
    });

    /* Brew liquid rises + stream */
    brewLiquid.scale.y = Math.min(1, brewLiquid.scale.y + dt * 0.15);
    stream.material.opacity = 0.55 + Math.sin(t * 4) * 0.1;

    /* Final steam */
    finalSteam.children.forEach(c => {
      c.position.y += dt * 0.4;
      if (c.position.y > 2.6) c.position.y = 0.85;
      c.scale.setScalar(0.7 + (c.position.y - 0.85) * 0.4);
      c.material.opacity = Math.max(0, 0.22 - (c.position.y - 0.85) * 0.1);
    });

    const s = Math.min(4, Math.floor(progress * 5.0001));
    updateStage(s);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();

/* ===================================================
   13. FINAL — Single big clear cup carousel
   Camera looks straight at cup so coffee is visible
=================================================== */
(function finalCarousel(){
  if (!hasThree()) return;
  const canvas = document.getElementById('final-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, innerWidth/innerHeight, 0.1, 100);
  /* Camera positioned HIGH and CLOSE, looking DOWN at cup so we see coffee */
camera.position.set(0, 2.6, 5.0);
camera.lookAt(0, -0.1, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  scene.add(new THREE.AmbientLight(0xa89480, 0.6));
  const keyLight = new THREE.DirectionalLight(0xf5e6cc, 1.7);
  keyLight.position.set(2, 6, 4); scene.add(keyLight);
  const rimLight = new THREE.PointLight(0xd4a574, 2.2, 18);
  rimLight.position.set(-4, 3, -2); scene.add(rimLight);
  const warmLight = new THREE.PointLight(0xc99a6b, 1.8, 16);
  warmLight.position.set(3, 2, 3); scene.add(warmLight);
  const topLight = new THREE.PointLight(0xffd9a8, 1.4, 12);
  topLight.position.set(0, 5, 0); scene.add(topLight);

  const CUPS = [
    { label:'Espresso', name:'Signature <em>Espresso</em>', notes:'Rich · Bold · Chocolate',
      coffeeHi:0xa8734c, coffeeMid:0x4a2c1a, coffeeLo:0x1a0f08,
      cupTop:0xf5e6cc },
    { label:'Latte', name:'House <em>Latte</em>', notes:'Smooth · Velvet · Nutty',
      coffeeHi:0xd4a574, coffeeMid:0x8b5a3c, coffeeLo:0x3a1f10,
      cupTop:0xfdf6e8 },
    { label:'Mocha', name:'Midnight <em>Mocha</em>', notes:'Deep · Smoky · Intense',
      coffeeHi:0x6b3d20, coffeeMid:0x2a1810, coffeeLo:0x0a0503,
      cupTop:0x3a1f10 },
    { label:'Cold Brew', name:'Cold <em>Brew</em>', notes:'Smooth · Sweet · Low-Acid',
      coffeeHi:0x8b5a3c, coffeeMid:0x3a1f10, coffeeLo:0x150a05,
      cupTop:0xe8d5b8 }
  ];

  let currentIndex = 0;
  const cupGroup = new THREE.Group();
  scene.add(cupGroup);

  function buildCup(data) {
    const g = new THREE.Group();

    /* Saucer */
    const saucer = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.55, 0.08, 56),
      new THREE.MeshStandardMaterial({ color: data.cupTop, roughness: 0.35, metalness: 0.05 })
    );
    saucer.position.y = -1.0; g.add(saucer);

    const saucerRim = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.03, 14, 60),
      new THREE.MeshStandardMaterial({ color:0xd4a574, metalness:0.75, roughness:0.22 })
    );
    saucerRim.position.y = -0.97; saucerRim.rotation.x = Math.PI/2; g.add(saucerRim);

    /* Body — WIDE mouth so coffee is clearly visible */
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 0.85, 1.5, 56, 1, true),
      new THREE.MeshStandardMaterial({
        color: data.cupTop, roughness: 0.3, metalness: 0.06,
        side: THREE.DoubleSide
      })
    );
    body.position.y = -0.15; g.add(body);

    const bottom = new THREE.Mesh(
      new THREE.CircleGeometry(0.85, 48),
      new THREE.MeshStandardMaterial({ color: data.cupTop, roughness: 0.5, side: THREE.DoubleSide })
    );
    bottom.position.y = -0.9; bottom.rotation.x = -Math.PI/2; g.add(bottom);

    /* Rim */
    const rimTorus = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.04, 14, 60),
      new THREE.MeshStandardMaterial({ color: data.cupTop, roughness: 0.3, metalness: 0.08 })
    );
    rimTorus.position.y = 0.6; rimTorus.rotation.x = Math.PI/2; g.add(rimTorus);

    /* Coffee surface — placed LOWER so camera looks into cup and sees it clearly */
    const coffee = new THREE.Mesh(
      new THREE.CircleGeometry(1.1, 56),
      new THREE.MeshStandardMaterial({
        color: data.coffeeMid, roughness: 0.15, metalness: 0.25,
        emissive: data.coffeeLo, emissiveIntensity: 0.12
      })
    );
    coffee.position.y = 0.42; coffee.rotation.x = -Math.PI/2; g.add(coffee);

    const crema = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.02, 12, 60),
      new THREE.MeshStandardMaterial({
        color: data.coffeeHi, roughness: 0.45, metalness: 0.1,
        emissive: data.coffeeHi, emissiveIntensity: 0.25
      })
    );
    crema.position.y = 0.428; crema.rotation.x = Math.PI/2; g.add(crema);

    /* Shine reflection */
    const shine = new THREE.Mesh(
      new THREE.CircleGeometry(0.35, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.08,
        side: THREE.DoubleSide
      })
    );
    shine.position.set(-0.3, 0.43, -0.35);
    shine.rotation.x = -Math.PI/2;
    g.add(shine);

    /* Handle */
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.09, 16, 40, Math.PI * 1.3),
      new THREE.MeshStandardMaterial({ color: data.cupTop, roughness: 0.32, metalness: 0.06 })
    );
    handle.position.set(1.35, -0.1, 0);
    handle.rotation.z = -Math.PI / 2 + 0.35;
    g.add(handle);

    /* Steam */
    const steamGroup = new THREE.Group();
    for (let i = 0; i < 14; i++) {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xf5e6cc, transparent: true, opacity: 0.16 })
      );
      s.position.set((Math.random() - 0.5) * 0.7, 0.7 + Math.random() * 1.0, (Math.random() - 0.5) * 0.6);
      s.userData.speed = 0.25 + Math.random() * 0.35;
      steamGroup.add(s);
    }
    g.add(steamGroup);
    g.userData.steamGroup = steamGroup;

    return g;
  }

  const cupMeshes = CUPS.map(c => {
    const mesh = buildCup(c);
    mesh.rotation.y = Math.PI / 2;
    mesh.visible = false;
    cupGroup.add(mesh);
    return mesh;
  });

  cupMeshes[0].visible = true;
  cupMeshes[0].rotation.y = 0;

  const RADIUS = 5.5;
  cupMeshes.forEach((m, i) => {
    m.userData.baseAngle = (i / cupMeshes.length) * Math.PI * 2;
  });

  let currentAngle = 0;
  let targetAngle = 0;
  let autoRotateTimer = 0;

  const nameEl = document.getElementById('final-cup-name');
  const notesEl = document.getElementById('final-cup-notes');
  const dotsEl = document.getElementById('final-dots');

  CUPS.forEach((c, i) => {
    const d = document.createElement('button');
    d.className = 'final-dot' + (i === 0 ? ' active' : '');
    d.innerHTML = `<span class="bar"></span><span class="lbl">${c.label}</span>`;
    d.onclick = () => goTo(i);
    dotsEl.appendChild(d);
  });

  function updateUI(index) {
    currentIndex = index;
    nameEl.style.opacity = '0';
    nameEl.style.transform = 'translateY(8px)';
    notesEl.style.opacity = '0';
    setTimeout(() => {
      nameEl.innerHTML = CUPS[index].name;
      notesEl.textContent = CUPS[index].notes;
      nameEl.style.opacity = '1';
      nameEl.style.transform = 'translateY(0)';
      notesEl.style.opacity = '1';
    }, 180);
    document.querySelectorAll('.final-dot').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  function goTo(index) {
    targetAngle = -cupMeshes[index].userData.baseAngle;
    updateUI(index);
    autoRotateTimer = 0;
  }
  function next() { goTo((currentIndex + 1) % CUPS.length); }

  canvas.style.pointerEvents = 'auto';
  canvas.style.cursor = 'pointer';

  let isDragging = false;
  let dragged = false;
  let dragStart = 0;
  let dragStartAngle = 0;
  let mouseX = 0, mouseY = 0;

  canvas.addEventListener('pointerdown', e => {
    isDragging = true;
    dragged = false;
    dragStart = e.clientX;
    dragStartAngle = targetAngle;
    canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('pointerup', () => {
    if (isDragging && !dragged) next();
    isDragging = false;
    canvas.style.cursor = 'pointer';
  });
  window.addEventListener('pointermove', e => {
    if (isDragging) {
      const dx = e.clientX - dragStart;
      if (Math.abs(dx) > 4) dragged = true;
      targetAngle = dragStartAngle + dx * 0.008;
    } else {
      mouseX = (e.clientX / innerWidth) * 2 - 1;
      mouseY = -(e.clientY / innerHeight) * 2 + 1;
    }
  });

  window.addEventListener('keydown', e => {
    const rect = document.getElementById('final-section').getBoundingClientRect();
    if (rect.top > innerHeight * 0.6 || rect.bottom < innerHeight * 0.4) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') goTo((currentIndex - 1 + CUPS.length) % CUPS.length);
  });

  const clock = new THREE.Clock();
  (function loop(){
    const dt = clock.getDelta();
    const t = clock.elapsedTime;

    currentAngle += (targetAngle - currentAngle) * Math.min(1, dt * 3);

    if (!isDragging) {
      autoRotateTimer += dt;
      if (autoRotateTimer > 6) {
        targetAngle -= dt * 0.1;
        const base = -targetAngle / ((Math.PI*2) / CUPS.length);
        const idx = ((Math.round(base) % CUPS.length) + CUPS.length) % CUPS.length;
        if (idx !== currentIndex) updateUI(idx);
      }
    }

    cupMeshes.forEach((m, i) => {
      const a = m.userData.baseAngle + currentAngle;
      m.position.x = Math.sin(a) * RADIUS;
      m.position.z = Math.cos(a) * RADIUS;
      m.rotation.y = -a;

      let norm = ((a % (Math.PI*2)) + Math.PI*3) % (Math.PI*2) - Math.PI;
      const absA = Math.abs(norm);
      m.visible = absA < Math.PI * 0.7;
      const scale = 1 - Math.min(absA, Math.PI) * 0.12;
      m.scale.setScalar(scale);
      m.position.y = -0.15 + Math.sin(t * 0.8 + i) * 0.1;

      const steam = m.userData.steamGroup;
      if (steam) {
        steam.children.forEach(s => {
          s.position.y += dt * s.userData.speed;
          if (s.position.y > 2.0) s.position.y = 0.7;
          s.material.opacity = Math.max(0, 0.16 * (1 - (s.position.y - 0.7) / 1.3));
        });
      }
    });

    /* Subtle camera sway */
camera.position.x = mouseX * 0.7;
camera.position.y = 2.6 + mouseY * 0.3;
camera.lookAt(0, -0.1, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();