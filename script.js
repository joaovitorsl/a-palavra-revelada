const content = window.SITE_CONTENT || {};
const eventContent = content.evento || {};
const locationContent = content.local || {};
const scheduleContent = Array.isArray(content.programacao) ? content.programacao : [];
const speakersContent = Array.isArray(content.palestrantes) ? content.palestrantes : [];
const faqContent = Array.isArray(content.faq) ? content.faq : [];

const officialInstagram = eventContent.instagram || 'https://www.instagram.com/apalavrareveladaoficial/';
const targetDate = new Date(eventContent.dataContagem || '2027-02-05T08:00:00-03:00').getTime();
const registrationTarget = Number(eventContent.vagasTotais || 2000);
const registrationInitial = Number(eventContent.vagasPreenchidas || 1372);

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value !== undefined) {
    element.textContent = String(value);
  }
}

function setHref(id, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element.href = value;
  }
}

function applySiteContent() {
  if (content.seo?.title) {
    document.title = content.seo.title;
  }

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && content.seo?.description) {
    metaDescription.setAttribute('content', content.seo.description);
  }

  setText('heroPill', eventContent.selo);
  setText('heroLine1', eventContent.tituloLinha1);
  setText('heroLine2', eventContent.tituloLinha2);
  setText('heroLine3', eventContent.tituloLinha3);
  setText('heroLead', eventContent.chamada);
  setText('heroPeriod', eventContent.periodo);
  setText('heroCity', eventContent.cidade);
  setText('themeTitle', eventContent.temaTitulo);
  setText('themeText', eventContent.temaTexto);
  setText('registrationMeta', `de ${registrationTarget} vagas`);

  setHref('ctaInscricao', eventContent.inscricao);
  setHref('miniInstagram', eventContent.instagram);
  setHref('miniYoutube', eventContent.youtube);
  setHref('supportLink', eventContent.instagram);
  setHref('caravanLink', eventContent.instagram);

  setText('locationTitle', locationContent.titulo);
  setText('locationText', locationContent.texto);
  setText('locationName', locationContent.nome);
  setText('locationAddress', locationContent.endereco);
  setText('mapOverlayTitle', locationContent.mapaTexto1);
  setText('mapOverlayText', locationContent.mapaTexto2);
  setHref('locationLink', locationContent.mapaLink);

  const mapFrame = document.getElementById('mapFrame');
  if (mapFrame && locationContent.mapaEmbed) {
    mapFrame.src = locationContent.mapaEmbed;
  }

  renderSchedule();
  renderSpeakers();
  renderFaq();
}

function renderSchedule() {
  const container = document.getElementById('scheduleCarousel');
  if (!container || !scheduleContent.length) return;

  container.innerHTML = scheduleContent
    .map((day) => {
      const turns = Array.isArray(day.turnos)
        ? day.turnos
            .map(
              (turn) => `
                <div class="schedule-turn">
                  <strong>${turn.nome}</strong>
                  <span>${turn.descricao}</span>
                </div>
              `
            )
            .join('')
        : '';

      return `
        <article class="schedule-day-card ${day.destaque ? 'schedule-day-card-highlight' : ''}">
          <div class="schedule-day-top">
            <span class="lineup-date">${day.data}</span>
            <h3>${day.titulo}</h3>
          </div>
          <div class="schedule-turns">${turns}</div>
        </article>
      `;
    })
    .join('');
}

function renderSpeakers() {
  const container = document.getElementById('speakersGrid');
  if (!container || !speakersContent.length) return;

  container.innerHTML = speakersContent
    .map(
      (speaker) => `
        <article class="card speaker-card">
          <div class="avatar">${speaker.iniciais}</div>
          <h3>${speaker.nome}</h3>
          <p>${speaker.bio}</p>
        </article>
      `
    )
    .join('');
}

function renderFaq() {
  const container = document.getElementById('faqGrid');
  if (!container || !faqContent.length) return;

  container.innerHTML = faqContent
    .map(
      (item) => `
        <article class="card faq-item">
          <h3>${item.pergunta}</h3>
          <p>${item.resposta}</p>
        </article>
      `
    )
    .join('');
}

applySiteContent();

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
  '.stat-card, .info-panel, .quote-card, .schedule-day-card, .history-slide, .card, .gallery-card, .faq-item, .location-box, .map-placeholder, .volunteer-form, .pix-card'
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

if (volunteerForm) {
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
}

const copyPixButton = document.getElementById('copyPix');
if (copyPixButton) {
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
}
