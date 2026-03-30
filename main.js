/* ==========================================
   NIBIN O — Antigravity Portfolio Scripts v2
   Enhanced Creative Animations
   ========================================== */

// ============ PARTICLE SYSTEM (Enhanced) ============
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000 };
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const count = Math.min(150, Math.floor((this.canvas.width * this.canvas.height) / 10000));
    this.particles = [];
    for (let i = 0; i < count; i++) {
      const isRed = Math.random() > 0.85;
      const size = Math.random() * 2 + 0.2;
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.35 + 0.05,
        baseOpacity: 0,
        isRed,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.003,
        life: Math.random() * 100
      });
      this.particles[i].baseOpacity = this.particles[i].opacity;
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => { this.resize(); this.createParticles(); });
    window.addEventListener('mousemove', (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;
      p.life += 0.5;
      p.opacity = p.baseOpacity + Math.sin(p.pulse) * 0.08;

      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        p.x += (dx / dist) * force * 2;
        p.y += (dy / dist) * force * 2;
      }

      if (p.x < -20) p.x = this.canvas.width + 20;
      if (p.x > this.canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.canvas.height + 20;
      if (p.y > this.canvas.height + 20) p.y = -20;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.isRed
        ? `rgba(255, 26, 26, ${p.opacity})`
        : `rgba(255, 255, 255, ${p.opacity})`;
      this.ctx.fill();

      if (p.size > 1) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        this.ctx.fillStyle = p.isRed
          ? `rgba(255, 26, 26, ${p.opacity * 0.06})`
          : `rgba(255, 255, 255, ${p.opacity * 0.03})`;
        this.ctx.fill();
      }
    });

    // Connection lines
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i], b = this.particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const alpha = (1 - dist / 90) * 0.05;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = (a.isRed || b.isRed) ? `rgba(255, 26, 26, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
          this.ctx.lineWidth = 0.4;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ============ CUSTOM CURSOR ============
class CustomCursor {
  constructor() {
    this.cursor = document.getElementById('cursor');
    this.glow = document.getElementById('cursor-glow');
    if (!this.cursor || !this.glow) return;
    this.pos = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.glowPos = { x: 0, y: 0 };
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
    });

    const interactives = document.querySelectorAll('a, button, input, textarea, [data-magnetic], .skill-tag, .work-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.add('hovering');
        this.glow.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('hovering');
        this.glow.classList.remove('hovering');
      });
    });

    document.addEventListener('click', (e) => {
      const container = document.getElementById('ripple-container');
      if (!container) return;
      for (let i = 0; i < 2; i++) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        ripple.style.animationDelay = (i * 0.15) + 's';
        container.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1100);
      }
    });
  }

  animate() {
    this.pos.x += (this.target.x - this.pos.x) * 0.18;
    this.pos.y += (this.target.y - this.pos.y) * 0.18;
    this.glowPos.x += (this.target.x - this.glowPos.x) * 0.06;
    this.glowPos.y += (this.target.y - this.glowPos.y) * 0.06;

    this.cursor.style.left = this.pos.x + 'px';
    this.cursor.style.top = this.pos.y + 'px';
    this.glow.style.left = this.glowPos.x + 'px';
    this.glow.style.top = this.glowPos.y + 'px';

    requestAnimationFrame(() => this.animate());
  }
}

// ============ MAGNETIC EFFECT ============
class MagneticEffect {
  constructor() {
    this.elements = document.querySelectorAll('[data-magnetic]');
    this.elements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { el.style.transition = ''; }, 600);
      });
    });
  }
}

// ============ 3D TILT ============
class TiltEffect {
  constructor() {
    this.panels = document.querySelectorAll('[data-tilt]');
    this.panels.forEach(panel => {
      panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        panel.style.transform = `perspective(1000px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) scale3d(1.005, 1.005, 1.005)`;
      });
      panel.addEventListener('mouseleave', () => {
        panel.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }
}

// ============ TEXT SCRAMBLE ============
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!@#$%^&*()_+{}|:<>?';
    this.frame = 0;
    this.queue = [];
    this.resolve = null;
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return new Promise(resolve => this.resolve = resolve);
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:rgba(255,26,26,0.5)">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      if (this.resolve) this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
}

// ============ GSAP ANIMATIONS ============
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Loader → Hero entrance
  const loader = document.getElementById('loader');
  const tl = gsap.timeline({
    onComplete: () => {
      loader.classList.add('hidden');
      animateHero();
    }
  });
  tl.to({}, { duration: 2.2 });

  function animateHero() {
    const heroTL = gsap.timeline();

    // Title reveal
    heroTL.to('.title-line span', {
      y: 0,
      duration: 1.4,
      stagger: 0.15,
      ease: 'power4.out',
      onComplete: () => {
        document.querySelectorAll('.title-line span').forEach(s => s.classList.add('revealed'));
      }
    })
    // Label
    .to('.hero-label', {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
    }, '-=1')
    // Role tags
    .to('.hero-role', {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
    }, '-=0.5')
    // Subtitle
    .to('.hero-subtitle', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    }, '-=0.4')
    // Actions
    .to('.hero-actions', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    }, '-=0.5')
    // Profile photo
    .from('.photo-frame', {
      scale: 0.7, opacity: 0, duration: 1.2, ease: 'back.out(1.4)'
    }, '-=1.2')
    // Photo rings
    .from('.photo-ring', {
      scale: 0, opacity: 0, duration: 1, stagger: 0.15, ease: 'power2.out'
    }, '-=0.8')
    // Badge
    .from('.photo-badge', {
      y: 20, opacity: 0, duration: 0.6, ease: 'power2.out'
    }, '-=0.3')
    // Scroll indicator
    .to('.scroll-indicator', {
      opacity: 1, duration: 0.6, ease: 'power2.out'
    }, '-=0.3');

    // Scramble text effect on title
    setTimeout(() => {
      const titleEl = document.querySelector('.title-line span');
      if (titleEl) {
        const scrambler = new TextScramble(titleEl);
        scrambler.setText('NIBIN O');
      }
    }, 2500);
  }

  // Nav scroll
  ScrollTrigger.create({
    start: 80,
    onUpdate: (self) => {
      document.getElementById('nav').classList.toggle('scrolled', self.progress > 0);
    }
  });

  // Section Headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header.children, {
      scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' },
      y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out'
    });
  });

  // About panel
  gsap.from('.about-panel', {
    scrollTrigger: { trigger: '.about-panel', start: 'top 82%', toggleActions: 'play none none none' },
    y: 80, opacity: 0, duration: 1.2, ease: 'power3.out'
  });

  // About photo
  gsap.from('.about-photo-wrap', {
    scrollTrigger: { trigger: '.about-photo-wrap', start: 'top 85%', toggleActions: 'play none none none' },
    scale: 0.8, opacity: 0, duration: 1, ease: 'back.out(1.3)'
  });

  // Experience & Education cards
  gsap.utils.toArray('.experience-card, .education-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
      x: -40, opacity: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out'
    });
  });

  // Stats counter
  gsap.utils.toArray('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(el, {
          innerText: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function() { el.textContent = Math.round(parseFloat(el.textContent)); }
        });
      },
      once: true
    });
  });

  // Skill tags
  gsap.from('.skill-tag', {
    scrollTrigger: { trigger: '.skills-list', start: 'top 85%', toggleActions: 'play none none none' },
    y: 20, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out'
  });

  // Work cards
  gsap.utils.toArray('.work-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
      y: 70, opacity: 0, rotateX: 10,
      duration: 0.9, delay: i * 0.08, ease: 'power3.out'
    });
  });

  // Contact panel
  gsap.from('.contact-panel', {
    scrollTrigger: { trigger: '.contact-panel', start: 'top 80%', toggleActions: 'play none none none' },
    y: 80, opacity: 0, duration: 1.2, ease: 'power3.out'
  });

  // Marquee parallax
  gsap.to('.marquee-content', {
    scrollTrigger: { trigger: '.marquee-section', start: 'top bottom', end: 'bottom top', scrub: 1 },
    x: -100, ease: 'none'
  });

  // Parallax orbs
  gsap.utils.toArray('.orb').forEach(orb => {
    gsap.to(orb, {
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      y: -180, ease: 'none'
    });
  });

  // Parallax nebulae
  gsap.to('.nebula-1', {
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 },
    y: -250, ease: 'none'
  });
  gsap.to('.nebula-2', {
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 },
    y: -120, ease: 'none'
  });

  // Photo parallax
  gsap.to('.photo-frame', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    y: -60, rotation: 5, ease: 'none'
  });
}

// ============ NAVIGATION ============
function initNavigation() {
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  // Google Forms Integration
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"] span');
      const submitBtn = form.querySelector('button[type="submit"]');

      // Get form values
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) return;

      // Disable button and show sending state
      submitBtn.disabled = true;
      if (btn) btn.textContent = 'Sending...';

      // Google Forms endpoint and entry IDs
      const GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScdvlXoMwPbXD7fgrZ6uv_OhlVmTyX72sJDrfu_LJH_uopv9w/formResponse';

      const formData = new URLSearchParams();
      formData.append('entry.1946507425', name);
      formData.append('entry.2037046155', email);
      formData.append('entry.197112722', message);

      try {
        await fetch(GOOGLE_FORM_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });

        // Success (no-cors won't return readable response, but data is sent)
        if (btn) btn.textContent = 'Message Sent! ✦';
        form.reset();
        setTimeout(() => {
          if (btn) btn.textContent = 'Send Message';
          submitBtn.disabled = false;
        }, 4000);
      } catch (err) {
        // Error fallback
        if (btn) btn.textContent = 'Error — Try Again';
        submitBtn.disabled = false;
        setTimeout(() => {
          if (btn) btn.textContent = 'Send Message';
        }, 3000);
      }
    });
  }
}

// ============ LIGHTBOX ============
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCat = document.getElementById('lightbox-cat');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  const cards = document.querySelectorAll('.work-card');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const card = cards[index];
    const imgSrc = card.getAttribute('data-img');
    const title = card.querySelector('.card-title').textContent;
    const cat = card.querySelector('.card-cat').textContent;

    lightboxImg.src = imgSrc;
    lightboxTitle.textContent = title;
    lightboxCat.textContent = cat;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + cards.length) % cards.length;
    const card = cards[currentIndex];
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = card.getAttribute('data-img');
      lightboxTitle.textContent = card.querySelector('.card-title').textContent;
      lightboxCat.textContent = card.querySelector('.card-cat').textContent;
      lightboxImg.style.opacity = '1';
    }, 200);
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(i);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem(document.getElementById('particle-canvas'));
  new CustomCursor();
  new MagneticEffect();
  new TiltEffect();
  initGSAP();
  initNavigation();
  initLightbox();
});
