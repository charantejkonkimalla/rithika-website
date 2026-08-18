const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const screen3 = document.getElementById('screen3');
const startButton = document.getElementById('startButton');
const wrongModal = document.getElementById('wrongModal');
const modalClose = document.getElementById('modalClose');
const fireworksCanvas = document.getElementById('fireworksCanvas');

const screens = [screen1, screen2, screen3];
let fireworksTimerId = null;
let confettiInstance = null;

function showScreen(index) {
  screens.forEach((screen) => {
    screen.classList.remove('active', 'screen-leave');
  });

  const selectedScreen = screens[index - 1];
  if (selectedScreen) {
    selectedScreen.classList.add('active');
  }

  if (index === 3) {
    startFireworks();
  } else {
    stopFireworks();
  }
}

function openWrongModal() {
  wrongModal.classList.remove('hidden');
  wrongModal.setAttribute('aria-hidden', 'false');

  const card = wrongModal.querySelector('.modal-card');
  card.animate(
    [
      { transform: 'translateY(10px) scale(0.96)', opacity: 0.3 },
      { transform: 'translateY(-8px) scale(1.02)', opacity: 1 },
      { transform: 'translateY(0) scale(1)', opacity: 1 }
    ],
    {
      duration: 460,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      iterations: 1
    }
  );
}

function closeWrongModal() {
  wrongModal.classList.add('hidden');
  wrongModal.setAttribute('aria-hidden', 'true');
}

startButton.addEventListener('click', () => {
  screen1.classList.add('screen-leave');
  setTimeout(() => showScreen(2), 260);
});

document.querySelectorAll('.choice-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const choice = button.dataset.choice;

    if (choice === 'jude and charan') {
      screen2.classList.add('screen-leave');
      setTimeout(() => showScreen(3), 320);
      return;
    }

    openWrongModal();
  });
});

modalClose.addEventListener('click', closeWrongModal);
wrongModal.addEventListener('click', (event) => {
  if (event.target === wrongModal) {
    closeWrongModal();
  }
});

function startFireworks() {
  if (!window.confetti) {
    console.error('Confetti library did not load.');
    return;
  }

  if (fireworksTimerId) {
    return;
  }

  confettiInstance = confetti.create(fireworksCanvas, {
    resize: true,
    useWorker: true,
    disableForReducedMotion: false
  });

  const shoot = () => {
    confettiInstance({
      particleCount: 28,
      spread: 90,
      startVelocity: 35,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
      colors: ['#ff70b7', '#ffd166', '#7ad7ff', '#9ef0d1', '#f7b2ff'],
      ticks: 180
    });
  };

  const burst = () => {
    confettiInstance({
      particleCount: 90,
      spread: 120,
      origin: { x: 0.5, y: 0.45 },
      colors: ['#ff83b7', '#ffcf70', '#85d6ff', '#a7f1c8', '#ffb4d9'],
      ticks: 220
    });
  };

  burst();
  fireworksTimerId = setInterval(shoot, 700);

  for (let i = 0; i < 5; i += 1) {
    setTimeout(burst, i * 220);
  }
}

function stopFireworks() {
  if (fireworksTimerId) {
    clearInterval(fireworksTimerId);
    fireworksTimerId = null;
  }
}

showScreen(1);

