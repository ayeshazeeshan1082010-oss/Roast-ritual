import * as THREE from 'three';

/* ===================================================
   1. LOADER
=================================================== */
(function loader(){
  const bar = document.getElementById('loader-bar-fill');
  const loader = document.getElementById('loader');
  let pct = 0;
  const id = setInterval(() => {
    pct = Math.min(100, pct + Math.random()*16 + 5);
    bar.style.width = pct + '%';
    if (pct >= 100) {
      clearInterval(id);
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
  }, 140);
})();

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
   4. MENU DATA — Coffee mugs with distinct colors
=================================================== */
const MENU = [
  { id:'signature', name:'Signature Espresso', tag:'Signature · Double Shot',
    notes:'Rich · Bold · Chocolate',
    flavors:['Cocoa','Caramel','Molasses'],
    origin:'Brazil · Colombia', price:6.5,
    desc:'Our flagship espresso — pulled hot, dense, and full-bodied. A shot built for the daily ritual.',
    mugTop:'#f5e6cc', mugBottom:'#a8734c', mugGlow:'#6b3d20' },

  { id:'house', name:'House Latte', tag:'House Favorite',
    notes:'Smooth · Nutty · Velvet',
    flavors:['Steamed Milk','Almond','Brown Sugar'],
    origin:'Colombia · Guatemala', price:7.0,
    desc:'Silky steamed milk poured over a balanced double shot. The kind of cup you order again tomorrow.',
    mugTop:'#e8d5b8', mugBottom:'#8b5a3c', mugGlow:'#4a2c1a' },

  { id:'ethiopian', name:'Ethiopian Pour Over', tag:'Single Origin',
    notes:'Floral · Citrus · Bright',
    flavors:['Jasmine','Bergamot','Stone Fruit'],
    origin:'Yirgacheffe, Ethiopia', price:8.5,
    desc:'Hand-poured Yirgacheffe. Delicate, tea-like, and luminous. Best enjoyed without milk.',
    mugTop:'#f0e0c4', mugBottom:'#c99a6b', mugGlow:'#7a4a2c' },

  { id:'midnight', name:'Midnight Mocha', tag:'Dark Roast',
    notes:'Deep · Smoky · Intense',
    flavors:['Dark Chocolate','Espresso','Cream'],
    origin:'Sumatra · Brazil', price:9.0,
    desc:'Our darkest roast married with single-origin cocoa. Rich, warm, and unapologetically grown-up.',
    mugTop:'#3a1f10', mugBottom:'#1a0f08', mugGlow:'#0a0503' },

  { id:'flat', name:'Flat White', tag:'Barista Pick',
    notes:'Balanced · Silky · Clean',
    flavors:['Micro-foam','Cocoa','Hazelnut'],
    origin:'Colombia · Brazil', price:7.5,
    desc:'A true flat white — ristretto shots, glossy micro-foam, and a dense, sweet finish.',
    mugTop:'#f5e6cc', mugBottom:'#c99a6b', mugGlow:'#5a3620' },

  { id:'cold', name:'Cold Brew Ritual', tag:'Seasonal',
    notes:'Smooth · Sweet · Low-Acid',
    flavors:['Vanilla','Cacao Nib','Orange Peel'],
    origin:'Brazil · Ethiopia', price:8.0,
    desc:'Steeped 16 hours, served over hand-cut ice. Our take on slow coffee, cold.',
    mugTop:'#c99a6b', mugBottom:'#4a2c1a', mugGlow:'#2a1810' }
];

/* ===================================================
   5. RENDER MENU (with beautiful mugs)
=================================================== */
const menuGrid = document.getElementById('menu-grid');
MENU.forEach(drink => {
  const el = document.createElement('article');
  el.className = 'menu-item';
  el.style.setProperty('--mug-bg-top', drink.mugTop);
  el.style.setProperty('--mug-bg-bottom', drink.mugBottom);
  el.style.setProperty('--mug-glow', drink.mugGlow);
  el.innerHTML = `
    <div class="mug-art">
      <div class="mug">
        <div class="mug-steam"><span></span><span></span><span></span></div>
        <div class="mug-body"></div>
        <div class="mug-handle"></div>
        <div class="mug-saucer"></div>
      </div>
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
   6. DRINK DETAIL MODAL
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

  const art = document.getElementById('modal-art');
  art.style.setProperty('--mug-bg-top', drink.mugTop);
  art.style.setProperty('--mug-bg-bottom', drink.mugBottom);
  art.style.setProperty('--mug-glow', drink.mugGlow);

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
   7. ROAST LAB
=================================================== */
const ROASTS = [
  { id:'light', name:'Light', flavors:['Bright','Floral','Citrus'],
    hi:'#c99a6b', lo:'#8b5a3c',
    labColor:'rgba(201,154,107,0.35)',
    desc:'Preserves origin character — bright, floral, and delicate. Roasted just past first crack.' },
  { id:'medium', name:'Medium', flavors:['Balanced','Sweet','Nutty'],
    hi:'#a8734c', lo:'#5a3620',
    labColor:'rgba(168,115,76,0.35)',
    desc:'The balance point. Caramelization develops sweetness while origin notes remain present.' },
  { id:'med-dark', name:'Medium-Dark', flavors:['Chocolate','Toasted','Full'],
    hi:'#7a4a2c', lo:'#3a1f10',
    labColor:'rgba(122,74,44,0.4)',
    desc:'Deeper body, richer sugars. Notes of dark chocolate and toasted nuts emerge.' },
  { id:'dark', name:'Dark', flavors:['Bold','Smoky','Intense'],
    hi:'#4a2c1a', lo:'#1a0f08',
    labColor:'rgba(74,44,26,0.55)',
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
  document.querySelectorAll('#roast-levels .roast-pill').forEach((b, i) => b.classList.toggle('active', i === activeRoast));
  document.getElementById('roast-name').textContent = r.name;
  document.getElementById('roast-desc').textContent = r.desc;
  document.getElementById('roast-bean').style.setProperty('--bean-hi', r.hi);
  document.getElementById('roast-bean').style.setProperty('--bean-lo', r.lo);
  document.getElementById('roast-visual').style.setProperty('--lab-color', r.labColor);
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
   8. BREW GUIDE
=================================================== */
const BREWS = [
  { id:'espresso', name:'Espresso', desc:'Pressure-extracted concentrate.',
    grind:'Fine', ratio:'1:2', time:'25–30s', profile:'Intense · Syrupy · Concentrated' },
  { id:'pourover', name:'Pour Over', desc:'Slow, controlled extraction.',
    grind:'Medium-Fine', ratio:'1:16', time:'2:30–3:00', profile:'Clean · Bright · Nuanced' },
  { id:'french', name:'French Press', desc:'Full-immersion, rich body.',
    grind:'Coarse', ratio:'1:14', time:'4:00', profile:'Rich · Oily · Full-bodied' },
  { id:'cold', name:'Cold Brew', desc:'Cold, slow extraction.',
    grind:'Coarse', ratio:'1:8', time:'12–16h', profile:'Smooth · Sweet · Low-acid' }
];
const bg = document.getElementById('brew-grid');
let activeBrew = 0;
BREWS.forEach((b, i) => {
  const el = document.createElement('button');
  el.className = 'brew-card' + (i === 0 ? ' active' : '');
  el.innerHTML = `
    <div class="num">0${i+1}</div>
    <h5>${b.name}</h5>
    <div class="desc">${b.desc}</div>
  `;
  el.onclick = () => { activeBrew = i; updateBrew(); };
  bg.appendChild(el);
});
function updateBrew() {
  document.querySelectorAll('#brew-grid .brew-card').forEach((c, i) => c.classList.toggle('active', i === activeBrew));
  const b = BREWS[activeBrew];
  document.getElementById('brew-detail').innerHTML = `
    <div class="item"><div class="k">Grind</div><div class="v">${b.grind}</div></div>
    <div class="item"><div class="k">Ratio</div><div class="v">${b.ratio}</div></div>
    <div class="item"><div class="k">Time</div><div class="v">${b.time}</div></div>
    <div class="item"><div class="k">Profile</div><div class="v" style="font-size:16px">${b.profile}</div></div>
  `;
}
updateBrew();

/* ===================================================
   9. CONTACT + NEWSLETTER
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
   10. STAT COUNTERS
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
   11. SMOOTH SCROLL
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
   12. THREE.JS — BROWN COFFEE ONLY
=================================================== */

function makeBean(color = 0x4a2c1a, scale = 1) {
  const geo = new THREE.SphereGeometry(0.5, 16, 12);
  const mat = new THREE.MeshStandardMaterial({
    color, roughness: 0.65, metalness: 0.1,
    emissive: 0x1a0f08, emissiveIntensity: 0.1
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.scale.set(scale, scale*0.72, scale*0.9);
  return mesh;
}

/* HERO */
(function heroScene(){
  const canvas = document.getElementById('hero-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, innerWidth/innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 0);

  scene.add(new THREE.AmbientLight(0xa89480, 0.55));
  const key = new THREE.DirectionalLight(0xf5e6cc, 1.2);
  key.position.set(4, 5, 5); scene.add(key);
  const warm = new THREE.PointLight(0xd4a574, 1.3, 12);
  warm.position.set(-4, -1, 2); scene.add(warm);
  const coffee = new THREE.PointLight(0xc99a6b, 1.0, 10);
  coffee.position.set(2, 3, 3); scene.add(coffee);

  const group = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const b = makeBean(0x4a2c1a, 0.9 + Math.random()*0.5);
    b.position.set(Math.sin(i*0.9)*1.4, Math.cos(i*1.3)*0.8, Math.sin(i*1.7)*1.0);
    b.rotation.set(Math.random()*6, Math.random()*6, Math.random()*6);
    group.add(b);
  }
  scene.add(group);

  const dustGeo = new THREE.BufferGeometry();
  const dustCount = 90;
  const dustPos = new Float32Array(dustCount*3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i*3]   = (Math.random()-0.5)*8;
    dustPos[i*3+1] = (Math.random()-0.5)*5;
    dustPos[i*3+2] = (Math.random()-0.5)*4;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color:0xd4a574, size:0.035, transparent:true, opacity:0.7 }));
  scene.add(dust);

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = -(e.clientY / innerHeight) * 2 + 1;
  });

  const clock = new THREE.Clock();
  (function loop(){
    const dt = clock.getDelta();
    group.rotation.y += dt * 0.12;
    group.position.x += (mx*0.4 - group.position.x) * Math.min(1, dt*3);
    group.position.y += (my*0.25 - group.position.y) * Math.min(1, dt*3);
    group.children.forEach((c,i) => {
      c.rotation.x += dt * (0.2 + i*0.04);
      c.rotation.z += dt * 0.15;
    });
    dust.rotation.y += dt * 0.05;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();

/* JOURNEY */
(function journeyScene(){
  const canvas = document.getElementById('journey-canvas');
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0f0905, 12, 34);
  const camera = new THREE.PerspectiveCamera(42, innerWidth/innerHeight, 0.1, 200);
  camera.position.set(0, 0.4, 8);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(innerWidth, innerHeight);

  scene.add(new THREE.AmbientLight(0xa89480, 0.55));
  const d1 = new THREE.DirectionalLight(0xf5e6cc, 1.0);
  d1.position.set(4, 6, 6); scene.add(d1);
  const p1 = new THREE.PointLight(0xd4a574, 1.0, 22);
  p1.position.set(-5, 2, -20); scene.add(p1);
  const p2 = new THREE.PointLight(0xc99a6b, 0.7, 22);
  p2.position.set(5, -1, -60); scene.add(p2);

  /* STAGE 1 — beans */
  const beanGroup = new THREE.Group();
  scene.add(beanGroup);
  for (let i = 0; i < 14; i++) {
    const b = makeBean(0x4a2c1a, 0.8 + Math.random()*0.5);
    b.position.set(Math.sin(i*1.7)*1.6, Math.cos(i*2.3)*0.9, Math.sin(i*0.9)*1.2);
    b.rotation.set(Math.random()*6, Math.random()*6, Math.random()*6);
    beanGroup.add(b);
  }

  /* STAGE 2 — roaster */
  const roastGroup = new THREE.Group();
  roastGroup.position.z = -22;
  scene.add(roastGroup);
  const drum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 2.4, 28, 1, true),
    new THREE.MeshStandardMaterial({ color:0x3a1f10, metalness:0.85, roughness:0.3, side: THREE.DoubleSide })
  );
  drum.rotation.z = Math.PI/2;
  roastGroup.add(drum);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.9, 0.045, 12, 40),
    new THREE.MeshStandardMaterial({ color:0xd4a574, metalness:0.9, roughness:0.2 })
  );
  ring.rotation.z = Math.PI/2;
  roastGroup.add(ring);
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 16, 12),
    new THREE.MeshBasicMaterial({ color:0xd4a574, transparent:true, opacity:0.35 })
  );
  glow.position.y = -1.4;
  roastGroup.add(glow);
  const roastLight = new THREE.PointLight(0xd4a574, 1.6, 4);
  roastLight.position.set(0, -1.2, 0);
  roastGroup.add(roastLight);
  for (let i = 0; i < 8; i++) {
    const b = makeBean(0x3a1f10, 0.35);
    b.position.set((Math.random()-0.5)*0.7, (Math.random()-0.5)*0.7, (Math.random()-0.5)*0.7);
    roastGroup.add(b);
  }
  const heatGroup = new THREE.Group();
  roastGroup.add(heatGroup);
  for (let i = 0; i < 12; i++) {
    const h = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 6, 6),
      new THREE.MeshBasicMaterial({ color:0xd4a574, transparent:true, opacity:0.35 })
    );
    h.position.set((Math.random()-0.5)*1.6, -1.2 + Math.random()*2, (Math.random()-0.5)*1.4);
    heatGroup.add(h);
  }

  /* STAGE 3 — grinder */
  const grindGroup = new THREE.Group();
  grindGroup.position.z = -44;
  scene.add(grindGroup);
  const grinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.9, 20),
    new THREE.MeshStandardMaterial({ color:0x3a1f10, metalness:0.7, roughness:0.35 })
  );
  grinder.position.y = 0.9;
  grindGroup.add(grinder);
  const grinderRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.05, 12, 24),
    new THREE.MeshStandardMaterial({ color:0xd4a574, metalness:0.95, roughness:0.15 })
  );
  grinderRing.position.y = 1.55;
  grinderRing.rotation.x = Math.PI/2;
  grindGroup.add(grinderRing);
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.4, 12),
    new THREE.MeshStandardMaterial({ color:0xd4a574, metalness:0.95, roughness:0.15 })
  );
  handle.position.y = 1.65;
  grindGroup.add(handle);
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.42, 0.4, 20),
    new THREE.MeshStandardMaterial({ color:0x2a1810, metalness:0.6, roughness:0.4 })
  );
  base.position.y = 0.35;
  grindGroup.add(base);
  const grounds = new THREE.Group();
  grindGroup.add(grounds);
  for (let i = 0; i < 40; i++) {
    const g = new THREE.Mesh(
      new THREE.SphereGeometry(0.03 + Math.random()*0.03, 5, 5),
      new THREE.MeshStandardMaterial({ color:0x3a1f10, roughness:0.9 })
    );
    g.position.set((Math.random()-0.5)*0.6, Math.random()*2 - 1, (Math.random()-0.5)*0.6);
    grounds.add(g);
  }

  /* STAGE 4 — brew */
  const brewGroup = new THREE.Group();
  brewGroup.position.z = -66;
  scene.add(brewGroup);
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 0.9, 24, 1, true),
    new THREE.MeshStandardMaterial({ color:0xf5e6cc, roughness:0.55, side: THREE.DoubleSide })
  );
  cone.position.y = 0.9;
  brewGroup.add(cone);
  for (let i = 0; i < 6; i++) {
    const g = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 6, 6),
      new THREE.MeshStandardMaterial({ color:0x3a1f10, roughness:0.95 })
    );
    g.position.set((Math.random()-0.5)*0.5, 0.7, (Math.random()-0.5)*0.5);
    brewGroup.add(g);
  }
  const carafe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.65, 1.4, 26, 1, true),
    new THREE.MeshPhysicalMaterial({ color:0xdfe6e6, transparent:true, opacity:0.22, roughness:0.05, side: THREE.DoubleSide })
  );
  carafe.position.y = -0.3;
  brewGroup.add(carafe);
  const liquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.55, 0.6, 22),
    new THREE.MeshStandardMaterial({ color:0x2a1810, roughness:0.35, metalness:0.1 })
  );
  liquid.position.y = -0.75;
  liquid.scale.y = 0.1;
  brewGroup.add(liquid);
  const stream = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8),
    new THREE.MeshBasicMaterial({ color:0xd4a574, transparent:true, opacity:0.55 })
  );
  stream.position.y = 0.45;
  brewGroup.add(stream);
  const brewLight = new THREE.PointLight(0xd4a574, 1.2, 5);
  brewLight.position.set(0, 1.5, 1);
  brewGroup.add(brewLight);
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.09 + i*0.02, 8, 8),
      new THREE.MeshBasicMaterial({ color:0xf5e6cc, transparent:true, opacity:0.08 })
    );
    s.position.set((Math.random()-0.5)*0.5, 1.3 + i*0.15, (Math.random()-0.5)*0.4);
    brewGroup.add(s);
  }

  /* STAGE 5 — cup */
  const cupGroup = new THREE.Group();
  cupGroup.position.z = -88;
  scene.add(cupGroup);
  const saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.25, 0.06, 36),
    new THREE.MeshStandardMaterial({ color:0xf5e6cc, roughness:0.4 })
  );
  saucer.position.y = -0.7;
  cupGroup.add(saucer);
  const cupBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.62, 1.15, 36, 1, true),
    new THREE.MeshStandardMaterial({ color:0xf5e6cc, roughness:0.42, side: THREE.DoubleSide })
  );
  cupBody.position.y = -0.05;
  cupGroup.add(cupBody);
  const cupFloor = new THREE.Mesh(
    new THREE.CircleGeometry(0.62, 36),
    new THREE.MeshStandardMaterial({ color:0xf5e6cc, roughness:0.5, side: THREE.DoubleSide })
  );
  cupFloor.position.y = -0.58;
  cupFloor.rotation.x = -Math.PI/2;
  cupGroup.add(cupFloor);
  const coffeeSurface = new THREE.Mesh(
    new THREE.CircleGeometry(0.8, 40),
    new THREE.MeshStandardMaterial({ color:0x1a0f08, roughness:0.18, metalness:0.15 })
  );
  coffeeSurface.position.y = 0.35;
  coffeeSurface.rotation.x = -Math.PI/2;
  cupGroup.add(coffeeSurface);
  const cupHandle = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.07, 12, 26, Math.PI*1.3),
    new THREE.MeshStandardMaterial({ color:0xf5e6cc, roughness:0.42 })
  );
  cupHandle.position.set(1, -0.05, 0);
  cupHandle.rotation.x = Math.PI/2;
  cupGroup.add(cupHandle);
  const cupLight = new THREE.PointLight(0xd4a574, 1.4, 6);
  cupLight.position.set(1.4, 1.6, 1.6);
  cupGroup.add(cupLight);
  const steamGroup = new THREE.Group();
  cupGroup.add(steamGroup);
  for (let i = 0; i < 9; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      new THREE.MeshBasicMaterial({ color:0xf5e6cc, transparent:true, opacity:0.15 })
    );
    s.position.set((Math.random()-0.5)*0.4, 0.6 + i*0.22, (Math.random()-0.5)*0.3);
    steamGroup.add(s);
  }

  const jDustGeo = new THREE.BufferGeometry();
  const jDustCount = 140;
  const jDustPos = new Float32Array(jDustCount*3);
  for (let i = 0; i < jDustCount; i++) {
    jDustPos[i*3]   = (Math.random()-0.5)*14;
    jDustPos[i*3+1] = (Math.random()-0.5)*8;
    jDustPos[i*3+2] = -Math.random()*100;
  }
  jDustGeo.setAttribute('position', new THREE.BufferAttribute(jDustPos, 3));
  const jDust = new THREE.Points(jDustGeo, new THREE.PointsMaterial({ color:0xd4a574, size:0.05, transparent:true, opacity:0.55 }));
  scene.add(jDust);

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
    computeProgress();
    const targetZ = 8 - progress * 94;
    const targetX = Math.sin(progress * Math.PI * 2) * 0.7;
    const targetY = 0.4 + Math.sin(progress * Math.PI * 2.6) * 0.35;
    const k = Math.min(1, dt * 3.2);
    camera.position.x += (targetX - camera.position.x) * k;
    camera.position.y += (targetY - camera.position.y) * k;
    camera.position.z += (targetZ - camera.position.z) * k;
    camera.lookAt(
      Math.sin(progress * Math.PI * 2) * 0.4,
      Math.sin(progress * Math.PI * 1.5) * 0.2,
      camera.position.z - 8
    );
    camera.rotation.z = Math.sin(progress * Math.PI * 3) * 0.04;

    beanGroup.rotation.y += dt * 0.1;
    beanGroup.children.forEach((c,i) => {
      c.rotation.x += dt * (0.2 + i*0.04);
      c.rotation.y += dt * 0.15;
    });
    ring.rotation.z += dt * 0.8;
    heatGroup.children.forEach((c,i) => {
      c.position.y += dt * (0.2 + i*0.05);
      if (c.position.y > 1.6) c.position.y = -1.2;
      c.material.opacity = Math.max(0, 0.35 - (c.position.y + 1.2) * 0.08);
    });
    grinder.rotation.y += dt * 2.2;
    grinderRing.rotation.z += dt * 2.2;
    grounds.children.forEach((c,i) => {
      c.position.y -= dt * (0.5 + (i%5)*0.1);
      if (c.position.y < -1.6) c.position.y = 1.4;
    });
    liquid.scale.y = Math.min(1, liquid.scale.y + dt * 0.15);
    stream.material.opacity = 0.5 + Math.sin(performance.now()*0.004)*0.1;
    steamGroup.children.forEach(c => {
      c.position.y += dt * 0.4;
      if (c.position.y > 2.4) c.position.y = 0.6;
      c.scale.setScalar(0.7 + (c.position.y - 0.6) * 0.4);
      c.material.opacity = Math.max(0, 0.22 - (c.position.y - 0.6) * 0.1);
    });
    jDust.rotation.y += dt * 0.01;
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

/* FINAL CUP SCENE */
(function finalScene(){
  const canvas = document.getElementById('final-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, innerWidth/innerHeight, 0.1, 100);
  camera.position.set(0, 0.4, 4.5);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setSize(innerWidth, innerHeight);

  scene.add(new THREE.AmbientLight(0xa89480, 0.55));
  const l1 = new THREE.DirectionalLight(0xf5e6cc, 1.0);
  l1.position.set(3, 4, 4); scene.add(l1);
  const l2 = new THREE.PointLight(0xd4a574, 1.2, 10);
  l2.position.set(-3, 1, 2); scene.add(l2);

  const g = new THREE.Group();
  scene.add(g);
  const saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(1.35, 1.4, 0.06, 36),
    new THREE.MeshStandardMaterial({ color:0xf5e6cc, roughness:0.4 })
  );
  saucer.position.y = -0.85; g.add(saucer);
  const cup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.68, 1.3, 36, 1, true),
    new THREE.MeshStandardMaterial({ color:0xf5e6cc, roughness:0.42, side: THREE.DoubleSide })
  );
  cup.position.y = -0.15; g.add(cup);
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(0.68, 36),
    new THREE.MeshStandardMaterial({ color:0xf5e6cc, roughness:0.5, side: THREE.DoubleSide })
  );
  floor.position.y = -0.75; floor.rotation.x = -Math.PI/2; g.add(floor);
  const coffee = new THREE.Mesh(
    new THREE.CircleGeometry(0.88, 40),
    new THREE.MeshStandardMaterial({ color:0x1a0f08, roughness:0.18, metalness:0.15 })
  );
  coffee.position.y = 0.36; coffee.rotation.x = -Math.PI/2; g.add(coffee);
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.08, 12, 26, Math.PI*1.3),
    new THREE.MeshStandardMaterial({ color:0xf5e6cc, roughness:0.42 })
  );
  handle.position.set(1.1, -0.15, 0); handle.rotation.x = Math.PI/2; g.add(handle);
  const steam = new THREE.Group(); g.add(steam);
  for (let i = 0; i < 10; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 8, 8),
      new THREE.MeshBasicMaterial({ color:0xf5e6cc, transparent:true, opacity:0.16 })
    );
    s.position.set((Math.random()-0.5)*0.4, 0.7 + i*0.2, (Math.random()-0.5)*0.3);
    steam.add(s);
  }

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = -(e.clientY / innerHeight) * 2 + 1;
  });

  const clock = new THREE.Clock();
  (function loop(){
    const dt = clock.getDelta();
    g.rotation.y += dt * 0.15;
    g.position.x += (mx*0.4 - g.position.x) * Math.min(1, dt*3);
    g.position.y += (my*0.25 - g.position.y) * Math.min(1, dt*3);
    steam.children.forEach(c => {
      c.position.y += dt * 0.35;
      if (c.position.y > 2.2) c.position.y = 0.6;
      c.material.opacity = Math.max(0, 0.16 - (c.position.y - 0.6)*0.09);
    });
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();