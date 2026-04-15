const targetDate = new Date('2027-02-06T08:00:00-03:00').getTime();
const officialInstagram = 'https://www.instagram.com/apalavrareveladaoficial/';
const registrationTarget = 2000;
const registrationInitial = 1372;

function updateCountdown() {
  const now = Date.now();
  const difference = targetDate - now;

  if (difference <= 0) {
    document.getElementById('days').textContent = '0';
    document.getElementById('hours').textContent = '0';
    document.getElementById('minutes').textContent = '0';
    document.getElementById('seconds').textContent = '0';
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById('days').textContent = String(days);
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

const registrationCountEl = document.getElementById('registrationCount');
const registrationFillEl = document.getElementById('registrationFill');

function animateRegistrations() {
  if (!registrationCountEl || !registrationFillEl) return;

  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(registrationInitial * eased);
    const fillPercent = (currentValue / registrationTarget) * 100;

    registrationCountEl.textContent = String(currentValue);
    registrationFillEl.style.width = `${fillPercent}%`;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

animateRegistrations();

const root = document.documentElement;

window.addEventListener('pointermove', (event) => {
  root.style.setProperty('--pointer-x', `${event.clientX}px`);
  root.style.setProperty('--pointer-y', `${event.clientY}px`);
});

const revealTargets = document.querySelectorAll(
  '.stat-card, .info-panel, .quote-card, .timeline-item, .schedule-card, .history-item, .card, .gallery-card, .faq-item, .location-box, .map-placeholder, .volunteer-form, .pix-card'
);

revealTargets.forEach((element) => {
  element.classList.add('reveal-card');
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((element) => revealObserver.observe(element));

const heroTitle = document.querySelector('.hero-title-stack');
const heroOrbA = document.querySelector('.hero-orb-a');
const heroOrbB = document.querySelector('.hero-orb-b');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const offset = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (offset / maxScroll) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }

  if (heroTitle) {
    heroTitle.style.transform = `translateY(${offset * 0.08}px)`;
  }

  if (heroOrbA) {
    heroOrbA.style.transform = `translateY(${offset * 0.12}px)`;
  }

  if (heroOrbB) {
    heroOrbB.style.transform = `translateY(${offset * -0.06}px)`;
  }
});

if (window.matchMedia('(pointer: fine)').matches) {
  const tiltTargets = document.querySelectorAll('.hero-card');

  tiltTargets.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -3;
      const rotateY = ((x / rect.width) - 0.5) * 3;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

const volunteerForm = document.getElementById('volunteerForm');
const formMessage = document.getElementById('formMessage');

volunteerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const city = document.getElementById('city').value.trim();
  const area = document.getElementById('area').value;

  const message = `Olá! Quero me voluntariar no A Palavra Revelada 2027.\n\nNome: ${name}\nWhatsApp: ${phone}\nCidade/Igreja: ${city}\nÁrea: ${area}`;

  try {
    await navigator.clipboard.writeText(message);
  } catch (error) {
    // ignora se a área de transferência não estiver disponível
  }

  window.open(officialInstagram, '_blank');
  formMessage.textContent = 'Seu texto foi preparado e o Instagram oficial foi aberto para contato com a organização.';
  volunteerForm.reset();
});

const copyPixButton = document.getElementById('copyPix');
copyPixButton.addEventListener('click', async () => {
  const pixMessage = 'Olá! Poderiam me enviar a chave PIX oficial do A Palavra Revelada 2027?';

  try {
    await navigator.clipboard.writeText(pixMessage);
  } catch (error) {
    // ignora se a área de transferência não estiver disponível
  }

  window.open(officialInstagram, '_blank');
  copyPixButton.textContent = 'Abrindo contato...';

  setTimeout(() => {
    copyPixButton.textContent = 'Solicitar chave PIX';
  }, 1800);
});
