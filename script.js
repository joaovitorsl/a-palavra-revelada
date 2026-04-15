const targetDate = new Date('2027-02-06T08:00:00-03:00').getTime();
const officialInstagram = 'https://www.instagram.com/apalavrareveladaoficial/';

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
  copyPixButton.textContent = 'Abrindo contato oficial...';

  setTimeout(() => {
    copyPixButton.textContent = 'Copiar chave PIX';
  }, 1800);
});
