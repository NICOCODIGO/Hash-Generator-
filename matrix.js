(() => {
  const canvas = document.getElementById('matrixCanvas'); //Finds the canvas element in the HTML
  if (!canvas) return;

  // ====== baseline settings, just like  the "root::" variables in css  =======
  const ctx = canvas.getContext('2d');
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()[]{}<>/\\|;:+=-_*~'; // characters used in the rain effect
  const textColor = '#8cff6e'; // makes the green text color 
  const fadeAlpha = 0.09; // how quickly the trails fade
  const fontScale = 0.0105; // relative to screen size
  const minFont = 12; // minimum font size in pixels

  let fontSize, cols, drops;  // font size, number of columns, and the y position of each drop
  let running = true;

  function resize() { // the purpose of all this is to make sure the animation fits the screen and looks good on all devices
    const dpr = window.devicePixelRatio || 1; // checks for device pixel ratio for the user computer, makes it look sharp and less blury
    const w = window.innerWidth; 
    const h = window.innerHeight;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    canvas.style.width = w + 'px'; //windows width
    canvas.style.height = h + 'px'; //windows height

    ctx.scale(dpr, dpr); // scales the context rain text to the device pixel ratio
    fontSize = Math.max(minFont, Math.floor(Math.min(w, h) * fontScale));
    ctx.font = `${fontSize}px monospace`;
    cols = Math.floor(w / fontSize) + 1; 
    drops = new Array(cols).fill(0);
  }



  function draw() { // this is where the magic happens 
    if (!running) return;
    
    ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height); // this makes the text fade out over time, creating the trail effect, if this lines is deleted, the tetx that appears in the backgroudn will just stack on each other 

    ctx.fillStyle = textColor; // sets the fill color to the green defined at the top
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) { // loops over each column
      const x = i * fontSize;
      const y = drops[i] * fontSize; // y position of the drop, how far down the it falls down on the screen 
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
