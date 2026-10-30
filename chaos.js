// Chaos simulation — Lorenz attractor
(function() {
  const canvas = document.getElementById('chaos');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, dpr;
  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Lorenz parameters
  const sigma = 10, rho = 28, beta = 8/3;
  const dt = 0.005;

  // Three particles with near-identical initial conditions — showcases
  // sensitive dependence on initial conditions (the butterfly effect).
  // The lead trajectory renders in the accent teal; the two shadows fade to grey.
  const particles = [
    { x: 0.1,    y: 0, z: 0, trail: [], base: '15, 118, 110',  alpha: 0.78, weight: 0.85 },
    { x: 0.1001, y: 0, z: 0, trail: [], base: '64, 64, 64',    alpha: 0.38, weight: 0.55 },
    { x: 0.1002, y: 0, z: 0, trail: [], base: '140, 140, 140', alpha: 0.32, weight: 0.5  }
  ];

  const MAX_TRAIL = 1800;

  function step(p) {
    const dx = sigma * (p.y - p.x);
    const dy = p.x * (rho - p.z) - p.y;
    const dz = p.x * p.y - beta * p.z;
    p.x += dx * dt;
    p.y += dy * dt;
    p.z += dz * dt;
    p.trail.push([p.x, p.z]);
    if (p.trail.length > MAX_TRAIL) p.trail.shift();
  }

  // Chunked rendering — split each trail into N segments with graduated
  // opacity so older points fade. Much cheaper than per-segment alpha.
  const CHUNKS = 10;

  function draw() {
    ctx.clearRect(0, 0, w, h);

    const scale = Math.min(w, h) / 72;
    const cx = w / 2;
    const cy = h / 2 + 25 * scale; // z≈25 is roughly the attractor's vertical centre

    particles.forEach(p => {
      const len = p.trail.length;
      if (len < 2) return;

      for (let c = 0; c < CHUNKS; c++) {
        const start = Math.floor(len * c / CHUNKS);
        const end = Math.min(Math.floor(len * (c + 1) / CHUNKS) + 1, len);
        if (end - start < 2) continue;

        const age = (c + 1) / CHUNKS; // 0 = oldest, 1 = newest
        ctx.strokeStyle = 'rgba(' + p.base + ',' + (age * p.alpha).toFixed(3) + ')';
        ctx.lineWidth = p.weight * (0.35 + age * 0.65);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        const [x0, z0] = p.trail[start];
        ctx.moveTo(cx + x0 * scale, cy - z0 * scale);
        for (let i = start + 1; i < end; i++) {
          const [x, z] = p.trail[i];
          ctx.lineTo(cx + x * scale, cy - z * scale);
        }
        ctx.stroke();
      }
    });
  }

  function animate() {
    // Several integration steps per frame so the system evolves at a
    // contemplative pace rather than inching forward one point at a time.
    for (let i = 0; i < 6; i++) particles.forEach(step);
    draw();
    requestAnimationFrame(animate);
  }

  // Respect motion preferences — render a static snapshot if animations
  // are reduced, so the figure is still present but not moving.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 3000; i++) particles.forEach(step);
    draw();
  } else {
    animate();
  }
})();
