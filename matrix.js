(() => {
  const canvas = document.getElementById('matrixCanvas'); //Finds the canvas element in the HTML
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()[]{}<>/\\|;:+=-_*~';
  const textColor = '#8cff6e'; // makes the green text color 
  const fadeAlpha = 0.09; // how quickly the trails fade
  const fontScale = 0.0105; // relative to screen size
  const minFont = 12;

  let fontSize, cols, drops;
  let running = true;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    fontSize = Math.max(minFont, Math.floor(Math.min(w, h) * fontScale));
    ctx.font = `${fontSize}px monospace`;
    cols = Math.floor(w / fontSize) + 1;
    drops = new Array(cols).fill(0);
  }

  function draw() {
    if (!running) return;
    ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, x, y);
      if (y > window.innerHeight && Math.random() > 0.98) drops[i] = 0;
      else drops[i]++;
    }
    requestAnimationFrame(draw);
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(draw);
  });

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();
