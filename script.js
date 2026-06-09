(function(){
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.menu-toggle');
  if(toggle && nav){
    toggle.addEventListener('click',()=> nav.classList.toggle('open'));
  }

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',()=> nav && nav.classList.remove('open'));
  });

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  document.querySelectorAll('[data-duplicate-track]').forEach(track=>{
    if(track.dataset.ready === 'true') return;
    track.dataset.ready = 'true';
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  document.querySelectorAll('[data-typewriter]').forEach(el=>{
    const words = (el.getAttribute('data-typewriter') || '').split('|').filter(Boolean);
    if(!words.length) return;
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const tick = ()=>{
      const current = words[wordIndex];
      el.textContent = current.slice(0,charIndex);
      if(!deleting && charIndex < current.length){
        charIndex++;
        setTimeout(tick,42);
      }else if(!deleting){
        deleting = true;
        setTimeout(tick,1150);
      }else if(charIndex > 0){
        charIndex--;
        setTimeout(tick,22);
      }else{
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick,240);
      }
    };
    tick();
  });

  document.querySelectorAll('canvas[data-particles]').forEach(canvas=>{
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    const resize = ()=>{
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      particles = Array.from({length: Math.max(34, Math.floor(width / 28))},()=>({
        x: Math.random()*width,
        y: Math.random()*height,
        vx: (Math.random()-.5)*.35,
        vy: (Math.random()-.5)*.35,
        r: Math.random()*1.9 + .7
      }));
    };
    const draw = ()=>{
      ctx.clearRect(0,0,width,height);
      particles.forEach((p,i)=>{
        p.x += p.vx;
        p.y += p.vy;
        if(p.x < 0 || p.x > width) p.vx *= -1;
        if(p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = 'rgba(122,231,255,.75)';
        ctx.fill();
        for(let j=i+1;j<particles.length;j++){
          const q = particles[j];
          const dist = Math.hypot(p.x-q.x,p.y-q.y);
          if(dist < 120){
            ctx.beginPath();
            ctx.moveTo(p.x,p.y);
            ctx.lineTo(q.x,q.y);
            ctx.strokeStyle = `rgba(164,120,232,${(1-dist/120)*.24})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize',resize,{passive:true});
    draw();
  });

  document.querySelectorAll('.faq-q').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const item = btn.closest('.faq-item');
      if(!item) return;
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
      if(!isOpen) item.classList.add('open');
    });
  });

  document.querySelectorAll('form[data-lead-form]').forEach(form=>{
    form.addEventListener('submit',(event)=>{
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      try{ sessionStorage.setItem('gryddLead', JSON.stringify(data)); }catch(e){}
      window.location.href = 'thankyou.html';
    });
  });
})();
