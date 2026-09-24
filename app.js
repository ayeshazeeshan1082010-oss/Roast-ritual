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
   1. SAFE LOADER
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
   6. ROAST LAB — Color-changing coffee inside CSS cup
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
   7. BREW GUIDE
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
   11. THREE.JS HERO — 3D Coffee Cup + floating beans
=================================================== */
(function heroScene(){
  if (!hasThree()) return;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, innerWidth/innerHeight, 0.1, 100);
  camera.position.set(0, 0.6, 5.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  scene.add(new THREE.AmbientLight(0xa89480, 0.55));
  const key = new THREE.DirectionalLight(0xf5e6cc, 1.5);
  key.position.set(4, 6, 5); scene.add(key);
  const warm = new THREE.PointLight(0xd4a574, 1.8, 14);
  warm.position.set(-4, 1, 3); scene.add(warm);
  const rim = new THREE.PointLight(0xc99a6b, 1.3, 12);
  rim.position.set(3, -1, -2); scene.add(rim);

  /* 3D CUP */
  const cup = new THREE.Group();
  cup.position.set(0, 0, 0);
  scene.add(cup);

  const saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(1.35, 1.4, 0.07, 64),
    new THREE.MeshStandardMaterial({ color: 0xf5e6cc, roughness: 0.35, metalness: 0.06 })
  );
  saucer.position.y = -1.05;
  cup.add(saucer);

  const saucerRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.35, 0.025, 16, 80),
    new THREE.MeshStandardMaterial({ color: 0xd4a574, metalness: 0.75, roughness: 0.22 })
  );
  saucerRim.position.y = -1.02;
  saucerRim.rotation.x = Math.PI/2;
  cup.add(saucerRim);

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.7, 1.55, 64, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0xf5e6cc, roughness: 0.3, metalness: 0.08,
      side: THREE.DoubleSide
    })
  );
  body.position.y = -0.15;
  cup.add(body);

  const bottom = new THREE.Mesh(
    new THREE.CircleGeometry(0.7, 48),
    new THREE.MeshStandardMaterial({ color: 0xe8d5b8, roughness: 0.5, side: THREE.DoubleSide })
  );
  bottom.position.y = -0.92;
  bottom.rotation.x = -Math.PI/2;
  cup.add(bottom);

  const rimTorus = new THREE.Mesh(
    new THREE.TorusGeometry(0.95, 0.035, 16, 80),
    new THREE.MeshStandardMaterial({ color: 0xfdf6e8, roughness: 0.3, metalness: 0.08 })
  );
  rimTorus.position.y = 0.625;
  rimTorus.rotation.x = Math.PI/2;
  cup.add(rimTorus);

  const coffee = new THREE.Mesh(
    new THREE.CircleGeometry(0.9, 64),
    new THREE.MeshStandardMaterial({
      color: 0x3a1f10, roughness: 0.14, metalness: 0.25,
      emissive: 0x1a0f08, emissiveIntensity: 0.15
    })
  );
  coffee.position.y = 0.58;
  coffee.rotation.x = -Math.PI/2;
  cup.add(coffee);

  const crema = new THREE.Mesh(
    new THREE.TorusGeometry(0.86, 0.02, 12, 80),
    new THREE.MeshStandardMaterial({
      color: 0xc99a6b, roughness: 0.4, metalness: 0.15,
      emissive: 0xc99a6b, emissiveIntensity: 0.2
    })
  );
  crema.position.y = 0.585;
  crema.rotation.x = Math.PI/2;
  cup.add(crema);

  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.09, 20, 48, Math.PI * 1.35),
    new THREE.MeshStandardMaterial({ color: 0xf5e6cc, roughness: 0.32, metalness: 0.08 })
  );
  handle.position.set(1.18, 0, 0);
  handle.rotation.z = -Math.PI / 2 - 0.25;
  cup.add(handle);

  const handleAccent = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.02, 12, 40, Math.PI * 1.35),
    new THREE.MeshStandardMaterial({ color: 0xd4a574, metalness: 0.85, roughness: 0.18 })
  );
  handleAccent.position.set(1.18, 0, 0.05);
  handleAccent.rotation.z = -Math.PI / 2 - 0.25;
  cup.add(handleAccent);

  /* Steam */
  const steamGroup = new THREE.Group();
  cup.add(steamGroup);
  for (let i = 0; i < 18; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.1 + Math.random() * 0.08, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xf5e6cc, transparent: true, opacity: 0.14 })
    );
    s.position.set(
      (Math.random() - 0.5) * 0.7,
      0.6 + Math.random() * 1.4,
      (Math.random() - 0.5) * 0.5
    );
    s.userData.speed = 0.25 + Math.random() * 0.4;
    s.userData.wobble = Math.random() * Math.PI * 2;
    steamGroup.add(s);
  }

  /* Floating beans */
  function makeBean(color, scale) {
    const geo = new THREE.SphereGeometry(0.5, 16, 12);
    const mat = new THREE.MeshStandardMaterial({
      color, roughness: 0.62, metalness: 0.1,
      emissive: 0x1a0f08, emissiveIntensity: 0.12
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.set(scale, scale * 0.72, scale * 0.9);
    return mesh;
  }

  const beansGroup = new THREE.Group();
  scene.add(beansGroup);

  const orbitBeans = [];
  for (let i = 0; i < 10; i++) {
    const b = makeBean(0x4a2c1a, 0.35 + Math.random() * 0.15);
    const angle = (i / 10) * Math.PI * 2;
    b.userData = {
      angle, radius: 2.4 + Math.random() * 0.4,
      yOffset: (Math.random() - 0.5) * 1.6,
      speed: 0.15 + Math.random() * 0.1,
      rotSpeed: 0.3 + Math.random() * 0.4,
      wobble: Math.random() * Math.PI * 2
    };
    b.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    beansGroup.add(b);
    orbitBeans.push(b);
  }

  const nearBeans = [];
  for (let i = 0; i < 4; i++) {
    const b = makeBean(0x3a1f10, 0.5 + Math.random() * 0.2);
    b.position.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 3,
      -1.5 - Math.random() * 2
    );
    b.userData.spin = 0.2 + Math.random() * 0.3;
    scene.add(b);
    nearBeans.push(b);
  }

  /* Dust */
  const dustGeo = new THREE.BufferGeometry();
  const dustCount = 120;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i*3]   = (Math.random() - 0.5) * 10;
    dustPos[i*3+1] = (Math.random() - 0.5) * 6;
    dustPos[i*3+2] = (Math.random() - 0.5) * 5;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xd4a574, size: 0.035, transparent: true, opacity: 0.65
  }));
  scene.add(dust);

  let mx = 0, my = 0, targetRotY = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = -(e.clientY / innerHeight) * 2 + 1;
  });

  const clock = new THREE.Clock();
  (function loop(){
    const dt = clock.getDelta();
    const t = clock.elapsedTime;

    targetRotY += dt * 0.18;
    cup.rotation.y += ((mx * 0.5 + targetRotY * 0.3) - cup.rotation.y) * Math.min(1, dt * 2.5);
    cup.rotation.x += ((my * 0.15) - cup.rotation.x) * Math.min(1, dt * 2.5);
    cup.position.y = Math.sin(t * 0.7) * 0.08;

    orbitBeans.forEach(b => {
      const d = b.userData;
      d.angle += dt * d.speed;
      b.position.x = Math.cos(d.angle) * d.radius;
      b.position.z = Math.sin(d.angle) * d.radius;
      b.position.y = d.yOffset + Math.sin(t * 0.8 + d.wobble) * 0.2;
      b.rotation.x += dt * d.rotSpeed;
      b.rotation.y += dt * d.rotSpeed * 0.7;
      b.rotation.z += dt * d.rotSpeed * 0.4;
    });

    nearBeans.forEach(b => {
      b.rotation.x += dt * b.userData.spin;
      b.rotation.y += dt * b.userData.spin * 0.6;
    });

    steamGroup.children.forEach(s => {
      s.position.y += dt * s.userData.speed;
      s.position.x += Math.sin(t * 1.2 + s.userData.wobble) * dt * 0.15;
      if (s.position.y > 2.2) s.position.y = 0.6;
      const life = (s.position.y - 0.6) / 1.6;
      s.material.opacity = Math.max(0, 0.18 * (1 - life));
      s.scale.setScalar(0.7 + life * 1.5);
    });

    dust.rotation.y += dt * 0.04;

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();

/* ===================================================
   12. THREE.JS JOURNEY — 5 stages 3D
=================================================== */
(function journeyScene(){
  if (!hasThree()) return;
  const canvas = document.getElementById('journey-canvas');
  if (!canvas) return;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0f0905, 12, 34);
  const camera = new THREE.PerspectiveCamera(42, innerWidth/innerHeight, 0.1, 200);
  camera.position.set(0, 0.4, 8);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(innerWidth, innerHeight);

  scene.add(new THREE.AmbientLight(0xa89480, 0.55));
  const d1 = new THREE.DirectionalLight(0xf5e6cc, 1.05);
  d1.position.set(4, 6, 6); scene.add(d1);
  const p1 = new THREE.PointLight(0xd4a574, 1.0, 22);
  p1.position.set(-5, 2, -20); scene.add(p1);
  const p2 = new THREE.PointLight(0xc99a6b, 0.7, 22);
  p2.position.set(5, -1, -60); scene.add(p2);

  function makeBean(color, scale) {
    const geo = new THREE.SphereGeometry(0.5, 16, 12);
    const mat = new THREE.MeshStandardMaterial({
      color, roughness: 0.65, metalness: 0.1,
      emissive: 0x1a0f08, emissiveIntensity: 0.1
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.set(scale, scale*0.72, scale*0.9);
    return mesh;
  }

  const beanGroup = new THREE.Group();
  scene.add(beanGroup);
  for (let i = 0; i < 14; i++) {
    const b = makeBean(0x4a2c1a, 0.8 + Math.random()*0.5);
    b.position.set(Math.sin(i*1.7)*1.6, Math.cos(i*2.3)*0.9, Math.sin(i*0.9)*1.2);
    b.rotation.set(Math.random()*6, Math.random()*6, Math.random()*6);
    beanGroup.add(b);
  }

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
  const jDust = new THREE.Points(jDustGeo, new THREE.PointsMaterial({
    color:0xd4a574, size:0.05, transparent:true, opacity:0.55
  }));
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

/* ===================================================
   13. THREE.JS FINAL — LUXURY CUP CAROUSEL (no arrows)
=================================================== */
(function finalCarousel(){
  if (!hasThree()) return;
  const canvas = document.getElementById('final-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, innerWidth/innerHeight, 0.1, 100);
  camera.position.set(0, 1.2, 5.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  scene.add(new THREE.AmbientLight(0xa89480, 0.55));
  const keyLight = new THREE.DirectionalLight(0xf5e6cc, 1.6);
  keyLight.position.set(3, 5, 4); scene.add(keyLight);
  const rimLight = new THREE.PointLight(0xd4a574, 1.8, 14);
  rimLight.position.set(-4, 2, -2); scene.add(rimLight);
  const warmLight = new THREE.PointLight(0xc99a6b, 1.4, 12);
  warmLight.position.set(3, 1, 3); scene.add(warmLight);
  const fillLight = new THREE.PointLight(0x4a2c1a, 1.2, 10);
  fillLight.position.set(0, -2, 2); scene.add(fillLight);

  const CUPS = [
    { label:'Espresso', name:'Signature <em>Espresso</em>', notes:'Rich · Bold · Chocolate',
      coffeeHi:'#a8734c', coffeeMid:'#4a2c1a', coffeeLo:'#1a0f08',
      cupTop:'#f5e6cc', cupBottom:'#c9a780', size:1.0 },
    { label:'Latte', name:'House <em>Latte</em>', notes:'Smooth · Velvet · Nutty',
      coffeeHi:'#d4a574', coffeeMid:'#8b5a3c', coffeeLo:'#3a1f10',
      cupTop:'#fdf6e8', cupBottom:'#e8d5b8', size:1.15 },
    { label:'Mocha', name:'Midnight <em>Mocha</em>', notes:'Deep · Smoky · Intense',
      coffeeHi:'#6b3d20', coffeeMid:'#2a1810', coffeeLo:'#0a0503',
      cupTop:'#3a1f10', cupBottom:'#1a0f08', size:1.05 },
    { label:'Cold Brew', name:'Cold <em>Brew</em>', notes:'Smooth · Sweet · Low-Acid',
      coffeeHi:'#8b5a3c', coffeeMid:'#3a1f10', coffeeLo:'#150a05',
      cupTop:'#e8d5b8', cupBottom:'#a8734c', size:1.1 }
  ];

  let currentIndex = 0;
  const cupGroup = new THREE.Group();
  scene.add(cupGroup);

  function buildCup(data) {
    const g = new THREE.Group();

    const saucer = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.2, 0.06, 48),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(data.cupTop), roughness: 0.35, metalness: 0.05 })
    );
    saucer.position.y = -0.9; g.add(saucer);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.02, 12, 60),
      new THREE.MeshStandardMaterial({ color:0xd4a574, metalness:0.7, roughness:0.25 })
    );
    rim.position.y = -0.88; rim.rotation.x = Math.PI/2; g.add(rim);

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.65, 1.25, 48),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(data.cupTop), roughness: 0.32, metalness: 0.06 })
    );
    body.position.y = -0.2; g.add(body);

    const coffee = new THREE.Mesh(
      new THREE.CircleGeometry(0.82, 48),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(data.coffeeMid), roughness: 0.18, metalness: 0.15,
        emissive: new THREE.Color(data.coffeeLo), emissiveIntensity: 0.08
      })
    );
    coffee.position.y = 0.4; coffee.rotation.x = -Math.PI/2; g.add(coffee);

    const crema = new THREE.Mesh(
      new THREE.TorusGeometry(0.78, 0.012, 10, 60),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(data.coffeeHi), roughness: 0.5, metalness: 0.1,
        emissive: new THREE.Color(data.coffeeHi), emissiveIntensity: 0.15
      })
    );
    crema.position.y = 0.405; crema.rotation.x = Math.PI/2; g.add(crema);

    const cupRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.03, 14, 60),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(data.cupTop), roughness: 0.3, metalness: 0.08 })
    );
    cupRim.position.y = 0.425; cupRim.rotation.x = Math.PI/2; g.add(cupRim);

    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.07, 16, 40, Math.PI * 1.25),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(data.cupTop), roughness: 0.32, metalness: 0.06 })
    );
    handle.position.set(1.0, -0.15, 0);
    handle.rotation.z = -Math.PI / 2 + 0.4;
    g.add(handle);

    const steamGroup = new THREE.Group();
    for (let i = 0; i < 14; i++) {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.08 + Math.random() * 0.06, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xf5e6cc, transparent: true, opacity: 0.16 })
      );
      s.position.set((Math.random() - 0.5) * 0.5, 0.5 + Math.random() * 0.9, (Math.random() - 0.5) * 0.4);
      s.userData.speed = 0.25 + Math.random() * 0.35;
      steamGroup.add(s);
    }
    g.add(steamGroup);
    g.userData.steamGroup = steamGroup;

    g.scale.setScalar(data.size);
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

  const RADIUS = 4.5;
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
    if (isDragging && !dragged) {
      next();
    }
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
      if (autoRotateTimer > 5) {
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
      m.visible = absA < Math.PI * 0.6;
      const scale = (1 - Math.min(absA, Math.PI) * 0.18) * (CUPS[i].size || 1);
      m.scale.setScalar(scale);
      m.position.y = Math.sin(t * 0.8 + i) * 0.12;

      const steam = m.userData.steamGroup;
      if (steam) {
        steam.children.forEach(s => {
          s.position.y += dt * s.userData.speed;
          if (s.position.y > 1.8) s.position.y = 0.5;
          s.material.opacity = Math.max(0, 0.18 * (1 - (s.position.y - 0.5) / 1.3));
        });
      }
    });

    camera.position.x += ((mouseX * 0.6) - camera.position.x) * Math.min(1, dt * 2);
    camera.position.y += ((1.2 + mouseY * 0.3) - camera.position.y) * Math.min(1, dt * 2);
    camera.lookAt(0, 0.1, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();