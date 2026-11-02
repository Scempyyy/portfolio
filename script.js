// ==========================================================================
// SCEMPYY // CYBER COMMAND SYSTEM JAVASCRIPT
// Architecture: Canvas Particles, Matrix Rain, 3D Card Tilt, Audio Synthesizer,
// Interactive CLI Terminal, Project Showcase Drawer, GitHub Telemetry Engine
// ==========================================================================

// ===== 1. TACTICAL AUDIO SYSTEM =====
const soundSrc = {
  ui: 'assets/sounds/ui-click.mp3',
  back: 'assets/sounds/back-click.mp3'
};
const soundPools = { ui: [], back: [] };
let muted = false;

function buildSoundPool(type, size = 5) {
  soundPools[type] = Array.from({ length: size }, () => {
    const a = new Audio(soundSrc[type]);
    a.preload = 'auto';
    a.volume = 0.8;
    return a;
  });
}
try {
  buildSoundPool('ui');
  buildSoundPool('back');
} catch (e) {}

let uiIndex = 0, backIndex = 0;
let audioCtx = null;

function playSound(type = 'ui') {
  if (muted) return;
  const pool = soundPools[type];
  if (pool && pool.length) {
    const index = type === 'ui' ? (uiIndex++ % pool.length) : (backIndex++ % pool.length);
    const a = pool[index];
    try {
      a.currentTime = 0;
      const p = a.play();
      if (p?.catch) p.catch(() => playSynthBeep(type));
      return;
    } catch (e) {}
  }
  playSynthBeep(type);
}

// Fallback Web Audio API Synthesizer
function playSynthBeep(type = 'ui') {
  if (muted) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    const freq = type === 'ui' ? 880 : 440;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}

const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');
muteBtn.addEventListener('click', () => {
  muted = !muted;
  document.body.classList.toggle('muted', muted);
  if (muted) {
    muteIcon.className = 'fa-solid fa-volume-xmark';
  } else {
    muteIcon.className = 'fa-solid fa-volume-high';
    playSound('ui');
  }
});

// ===== 2. LIVE UTC CLOCK =====
function updateLiveClock() {
  const d = new Date();
  const hrs = String(d.getUTCHours()).padStart(2, '0');
  const mins = String(d.getUTCMinutes()).padStart(2, '0');
  const secs = String(d.getUTCSeconds()).padStart(2, '0');
  const el = document.getElementById('live-utc');
  if (el) el.textContent = `${hrs}:${mins}:${secs} UTC`;
}
updateLiveClock();
setInterval(updateLiveClock, 1000);

// ===== 3. TYPEWRITER EFFECT =====
const phrases = [
  "Building practical software, local AI systems, and privacy-first tools.",
  "Shipped EvoRyz v1.0.0 APK — 100-Day Winter Arc Challenge Engine.",
  "1,602 verified GitHub commits with unbroken 366-day streak.",
  "Android Privacy Auditor: Local-first DEX & manifest static analysis.",
  "NeuroDrive AI: Real-time 478-point facial computer vision safety.",
  "RoboRabbit: Voice AI companion with local Piper neural TTS."
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typeEl = document.getElementById('typewriter-text');

function typeTick() {
  if (!typeEl) return;
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typeEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typeEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }

  let speed = isDeleting ? 25 : 55;
  if (!isDeleting && charIdx === current.length) {
    speed = 2200; // Pause at end of sentence
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    speed = 400;
  }
  setTimeout(typeTick, speed);
}
setTimeout(typeTick, 600);

// ===== 4. CYBER CANVAS PARTICLES =====
const cyberCanvas = document.getElementById('cyber-canvas');
if (cyberCanvas) {
  const ctx = cyberCanvas.getContext('2d');
  let width, height;
  let particles = [];
  const mouse = { x: -1000, y: -1000, radius: 140 };

  function resizeCanvas() {
    width = cyberCanvas.width = window.innerWidth;
    height = cyberCanvas.height = window.innerHeight;
    initParticles();
  }
  window.addEventListener('resize', resizeCanvas);

  function initParticles() {
    particles = [];
    const count = Math.floor((width * height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 0.8
      });
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.025)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse repulsion
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const angle = Math.atan2(dy, dx);
        p.x -= Math.cos(angle) * 1.8;
        p.y -= Math.sin(angle) * 1.8;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.fill();

      // Constellation connectors
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist2 < 95) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist2 / 95)})`;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  animateParticles();
}

// ===== 5. MATRIX DIGITAL RAIN =====
const matrixCanvas = document.getElementById('matrix-canvas');
let matrixRunning = false;
let matrixInterval = null;

if (matrixCanvas) {
  const mctx = matrixCanvas.getContext('2d');
  const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
  let drops = [];
  let fontSize = 14;

  function resizeMatrix() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    const cols = Math.floor(matrixCanvas.width / fontSize);
    drops = Array(cols).fill(1);
  }
  window.addEventListener('resize', resizeMatrix);
  resizeMatrix();

  function drawMatrix() {
    mctx.fillStyle = 'rgba(3, 7, 11, 0.08)';
    mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    mctx.fillStyle = '#00ff73';
    mctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      mctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  window.toggleMatrixRain = function() {
    matrixRunning = !matrixRunning;
    document.body.classList.toggle('matrix-active', matrixRunning);
    if (matrixRunning) {
      if (!matrixInterval) matrixInterval = setInterval(drawMatrix, 35);
      playSound('ui');
    } else {
      clearInterval(matrixInterval);
      matrixInterval = null;
      mctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      playSound('back');
    }
  };

  const matrixBtn = document.getElementById('matrix-toggle-btn');
  if (matrixBtn) matrixBtn.addEventListener('click', window.toggleMatrixRain);
}

// ===== 6. 3D HOLOGRAPHIC CARD PARALLAX TILT =====
const cardStage = document.getElementById('card-stage');
const agentCard = document.getElementById('agent-3d-card');

if (cardStage && agentCard) {
  cardStage.addEventListener('mousemove', (e) => {
    const rect = agentCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / 15);
    const rotateY = (x / 15);
    agentCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  cardStage.addEventListener('mouseleave', () => {
    agentCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });

  agentCard.addEventListener('click', () => {
    playSound('ui');
    openInfoPage('about');
  });
}

// ===== 7. PROJECT CASE STUDY DATA =====
const PROJECT_DATA = {
  'evoryz': {
    title: 'EvoRyz — Personal Growth & Accountability Engine',
    tagline: 'A production mobile application engineered around personal growth, discipline, and daily execution. EvoRyz features a 100-day Winter Arc challenge system, encrypted offline-first journal, and a connected accountability network.',
    sections: [
      { icon: '❄️', title: 'Winter Arc 100-Day Challenge Engine', body: 'A structured milestone and streak progression system that turns daily habits into a measurable campaign. Includes automated streak tracking, daily check-ins, and completion analytics.' },
      { icon: '📱', title: 'React Native & Expo Architecture', body: 'Built with React Native and Expo using TypeScript for end-to-end type safety. Designed with smooth, responsive 60fps gesture animations, modern dark mode design, and native performance.' },
      { icon: '📴', title: 'Offline-First & Cloud Sync', body: 'Engineered for seamless offline usage with fast local SQLite/persisted storage. Automatically synchronizes with Supabase whenever network connectivity is available without interrupting the user experience.' },
      { icon: '🔒', title: 'Encrypted Personal Journal', body: 'Features private reflections and daily progress logging with client-side privacy controls. Your thoughts and personal habit records stay yours.' },
      { icon: '🚀', title: 'Live Production Release (APK v1.0.0)', body: 'Fully packaged, verified, and released as a production Android APK on GitHub Releases. Ready for installation and daily testing.' }
    ],
    github: 'https://github.com/Scempyyy/EvoRyz',
    apk: 'https://github.com/Scempyyy/EvoRyz/releases/tag/v1.0.0'
  },
  'privacy-auditor': {
    title: 'Auditor — Android Privacy & Security Auditor',
    tagline: 'A local-first static analysis platform designed to inspect Android apps and APKs, surface risky permissions and tracker fingerprints, and turn technical findings into understandable risk reports.',
    sections: [
      { icon: '📱', title: 'Android App & Jetpack Compose', body: 'Native Android frontend built with Kotlin and Jetpack Compose, utilizing Coroutines and Flow for reactive asynchronous workflows and Room for local audit storage.' },
      { icon: '🔬', title: 'APK Manifest & Static Analysis', body: 'The backend pipeline decodes AndroidManifest.xml and inspects DEX-level components to fingerprint tracking SDKs, analyze exported services, and identify potential attack surfaces.' },
      { icon: '🧩', title: 'Contextual Permission Scoring', body: 'Permissions alone do not define risk. Auditor calculates contextual risk scores by correlating requested permissions with app category, third-party libraries, and background capabilities.' },
      { icon: '📊', title: 'Exportable Audit Reports', body: 'Generates clean, readable executive summaries and detailed technical findings with local PDF report export capabilities.' },
      { icon: '🚀', title: 'Production Release (APK v1.0.0)', body: 'Published as a standalone production APK on GitHub Releases, allowing instant on-device APK auditing.' }
    ],
    github: 'https://github.com/Scempyyy/privacy-auditor',
    apk: 'https://github.com/Scempyyy/privacy-auditor/releases/tag/v1.0.0'
  },
  'driver-security': {
    title: 'Driver Security System (NeuroDrive AI)',
    tagline: 'A real-time computer vision driver attention and drowsiness detection system built with Python, OpenCV, and MediaPipe. Evaluates multiple facial telemetry signals rather than reacting to a single blink.',
    sections: [
      { icon: '📷', title: '478 Facial Landmark Mesh', body: 'OpenCV captures video frames while MediaPipe Face Landmarker extracts 478 high-precision 3D landmarks, tracking micro-movements across eyes, mouth, and head orientation.' },
      { icon: '👁️', title: 'EAR & PERCLOS Metric Modeling', body: 'Calculates Eye Aspect Ratio (EAR) for blink dynamics and PERCLOS (percentage of eyelid closure over time) across rolling temporal windows, with automatic baseline user calibration.' },
      { icon: '🥱', title: 'Multi-Signal Fusion (Yawn & Head Pose)', body: 'Combines Mouth Aspect Ratio (MAR), yawning frequency, 3D head pitch/yaw/roll tilt, and gaze deviation to prevent false positives and detect microsleeps.' },
      { icon: '🚨', title: 'Prioritized Alert State Machine', body: 'Features an escalating alert hierarchy that triggers progressive auditory and visual warnings based on distraction severity.' },
      { icon: '🏆', title: 'Tech Fest Runner-Up', body: 'Presented and demonstrated live at tech fest, securing 2nd place runner-up honors for real-time edge computer vision safety.' }
    ],
    github: 'https://github.com/Scempyyy/driver-security-system'
  },
  'roborabbit': {
    title: 'RoboRabbit — Autonomous Voice AI Companion',
    tagline: 'A personal voice AI companion built in Python. Integrates speech recognition, local neural text-to-speech, computer screen perception, and resilient multi-model failover orchestration.',
    sections: [
      { icon: '🎙️', title: 'Voice Pipeline & Real-Time Loop', body: 'Streams real-time audio capture into an assistant loop, managing conversational turn-taking, barge-in support, and intelligent pause detection.' },
      { icon: '🔊', title: 'Low-Latency Local Neural TTS', body: 'Leverages local Piper neural TTS models to generate human-like speech output directly on the device with sub-second response times without external voice API latency.' },
      { icon: '🧠', title: 'Multi-Model Failover Orchestration', body: 'Architected with an abstracted provider layer that seamlessly switches between Gemini, local models, and external APIs with automatic fallback handling.' },
      { icon: '⚙️', title: 'FastAPI & WebSocket Service Layer', body: 'Built with a clean asynchronous FastAPI backend communicating via WebSockets for bidirectional audio and telemetry streaming.' }
    ],
    github: 'https://github.com/Scempyyy/Roborabbit'
  },
  'roboos': {
    title: 'RoboOS — Custom Linux Distribution Build',
    tagline: 'A custom Arch-based Linux distribution experiment created to master Linux system assembly, package configuration, desktop theming, and bootable ISO generation.',
    sections: [
      { icon: '🐧', title: 'Arch Linux Foundation & Archiso', body: 'Built using Archiso tooling, defining custom package sets, pacman repositories, systemd services, and kernel configurations for a reproducible build.' },
      { icon: '🎨', title: 'Custom Cyber Visual Identity', body: 'Features a tailored dark purple-and-black aesthetic, customized shell environments, and preconfigured developer dotfiles.' },
      { icon: '💿', title: 'Bootable Live Media Packaging', body: 'Generates a bootable hybrid ISO image tested across virtualized environments (QEMU/KVM) and bare-metal live USB installations.' },
      { icon: '🧰', title: 'Low-Level Systems Knowledge', body: 'Provided deep practical experience in system init processes, bootloaders (GRUB/systemd-boot), filesystem hierarchies, and modular Linux internals.' }
    ]
  },
  'privacy-browser': {
    title: 'Privacy Browser + AI Cyber Shield',
    tagline: 'A privacy-first browser architecture and security companion focused on safe download staging, automated static analysis, and software supply-chain transparency.',
    sections: [
      { icon: '🧱', title: 'C++20 Core & Safe File Staging', body: 'Core engine written in modern C++20 with strict path sanitization and isolated sandbox download staging to prevent directory traversal and drive-by execution.' },
      { icon: '🔐', title: 'Cryptographic Hashing & SHA-256', body: 'Computes cryptographic checksums of incoming artifacts in real time, validating integrity against known threat intelligence registries.' },
      { icon: '📦', title: 'Automated SBOM Generation (Syft)', body: 'Integrates Anchore Syft to automatically inspect application binaries and archives, producing Software Bill of Materials (SBOM) for supply-chain vulnerability inspection.' },
      { icon: '🛡️', title: 'Local-First Threat Heuristics', body: 'Performs all inspection routines locally on-device, ensuring zero sensitive user file data or metadata leaves the local machine.' }
    ]
  },
  'content-creation': {
    title: 'Content Creation — Digital Media & Analytics',
    tagline: 'An archived digital creator chapter centered on short-form video editing, motion graphics pacing, community building, and content analytics.',
    sections: [
      { icon: '🎬', title: 'Motion Graphics & Video Editing', body: 'Mastered pacing, keyframing, dynamic text overlays, sound design, and retention-focused visual storytelling.' },
      { icon: '📊', title: '103.8K+ YouTube Analytics', body: 'Channel analytics achieved 103,800+ total views, 4,600+ hours of watch time, and an engaged audience across YouTube and Instagram.' },
      { icon: '💡', title: 'Workflow & Creator Discipline', body: 'Instilled habits of rigorous delivery schedules, audience feedback loops, thumbnail/title packaging, and data-driven creative iteration.' }
    ]
  }
};

// ===== 8. PROJECT MODAL & DRAWER SYSTEM =====
const projectsModal = document.getElementById('projects-modal');
const projectsBtn = document.getElementById('projects-btn');
const projectsTop = document.getElementById('projects-top');
const projectsClose = document.getElementById('projects-modal-close');
const projectDrawer = document.getElementById('project-detail-drawer');
const pdContent = document.getElementById('pd-inner-content');

function openProjectsModal() {
  playSound('ui');
  closeAllModals();
  projectsModal.classList.add('open');
}
function closeProjectsModal() {
  playSound('back');
  projectsModal.classList.remove('open');
}

if (projectsBtn) projectsBtn.addEventListener('click', openProjectsModal);
if (projectsTop) projectsTop.addEventListener('click', openProjectsModal);
if (projectsClose) projectsClose.addEventListener('click', closeProjectsModal);

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    playSound('ui');
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.cyber-project-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Open project detail drawer
function openProjectDrawer(key) {
  const data = PROJECT_DATA[key];
  if (!data) return;
  playSound('ui');

  let html = `
    <div class="pd-header">
      <button class="pd-back-btn" id="pd-drawer-back"><i class="fa-solid fa-arrow-left"></i> BACK TO PROJECTS</button>
      <h2>${data.title}</h2>
    </div>
    <p class="pd-tagline">${data.tagline}</p>
    <div class="pd-banners">
      ${data.sections.map((s, idx) => `
        <div class="pd-banner ${idx === 0 ? 'open' : ''}">
          <div class="pd-banner-head">
            <span class="pd-icon">${s.icon}</span>
            <span class="pd-title">${s.title}</span>
            <i class="fa-solid fa-chevron-down pd-chevron"></i>
          </div>
          <div class="pd-body">${s.body}</div>
        </div>
      `).join('')}
    </div>
  `;

  if (data.github || data.apk) {
    html += `
      <div style="max-width:1040px; margin:28px auto 0; display:flex; gap:14px; flex-wrap:wrap;">
        ${data.apk ? `<a href="${data.apk}" target="_blank" rel="noopener" class="cyber-btn primary-cyber-btn"><i class="fa-brands fa-android"></i> DOWNLOAD PRODUCTION APK</a>` : ''}
        ${data.github ? `<a href="${data.github}" target="_blank" rel="noopener" class="cyber-btn secondary-cyber-btn"><i class="fa-brands fa-github"></i> VIEW GITHUB REPOSITORY</a>` : ''}
      </div>
    `;
  }

  pdContent.innerHTML = html;
  projectDrawer.classList.add('open');

  document.getElementById('pd-drawer-back').addEventListener('click', () => {
    playSound('back');
    projectDrawer.classList.remove('open');
  });

  pdContent.querySelectorAll('.pd-banner-head').forEach(head => {
    head.addEventListener('click', () => {
      playSound('ui');
      head.parentElement.classList.toggle('open');
    });
  });
}

document.querySelectorAll('.cyber-project-card').forEach(card => {
  card.addEventListener('click', () => {
    const proj = card.dataset.project;
    if (proj) openProjectDrawer(proj);
  });
});

// ===== 9. GITHUB TELEMETRY MODAL =====
const telemetryModal = document.getElementById('telemetry-modal');
const telemetryBtn = document.getElementById('telemetry-btn');
const telemetryTop = document.getElementById('telemetry-top');
const telemetryClose = document.getElementById('telemetry-modal-close');

function openTelemetryModal() {
  playSound('ui');
  closeAllModals();
  telemetryModal.classList.add('open');
  generateHeatmapGrid();
}
function closeTelemetryModal() {
  playSound('back');
  telemetryModal.classList.remove('open');
}

if (telemetryBtn) telemetryBtn.addEventListener('click', openTelemetryModal);
if (telemetryTop) telemetryTop.addEventListener('click', openTelemetryModal);
if (telemetryClose) telemetryClose.addEventListener('click', closeTelemetryModal);

// Generate mini GitHub heatmap
function generateHeatmapGrid() {
  const container = document.getElementById('mini-heatmap-preview');
  if (!container || container.children.length > 0) return;
  const totalCells = 52 * 7;
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'heat-cell';
    const rand = Math.random();
    if (rand > 0.85) cell.classList.add('l4');
    else if (rand > 0.65) cell.classList.add('l3');
    else if (rand > 0.35) cell.classList.add('l2');
    else cell.classList.add('l1');
    container.appendChild(cell);
  }
}

// ===== 10. CONTACTS PANEL =====
const contactsPanel = document.getElementById('contacts-panel');
const contactsBtn = document.getElementById('contacts-btn');
const contactsTop = document.getElementById('contacts-top');
const contactsClose = document.getElementById('contacts-close');

function openContacts() {
  playSound('ui');
  closeAllModals();
  contactsPanel.classList.add('open');
}
function closeContacts() {
  playSound('back');
  contactsPanel.classList.remove('open');
}

if (contactsBtn) contactsBtn.addEventListener('click', openContacts);
if (contactsTop) contactsTop.addEventListener('click', openContacts);
if (contactsClose) contactsClose.addEventListener('click', closeContacts);

// ===== 11. GENERAL INFO MODAL (ABOUT / ACHIEVEMENTS / CERTS) =====
const infoScreen = document.getElementById('info-screen');
const screenInner = document.getElementById('screen-inner');
const screenBack = document.getElementById('screen-back');

function openInfoPage(type) {
  playSound('ui');
  closeAllModals();
  const data = {
    about: {
      kicker: 'SYSTEM ARCHITECTURE // OPERATIVE 001',
      title: 'ABOUT <em>SCEMPYY</em>',
      html: `
        <div class="screen-grid">
          <article class="screen-card about-main">
            <span class="micro">PRANAV SHARMA // SCEMPYY</span>
            <h3>WHO IS SCEMPYY?</h3>
            <p>I'm an AI/ML student and builder focused on practical, high-reliability software. I love understanding how systems work under the hood — from privacy-preserving static code analyzers and cross-platform mobile apps to real-time computer vision safety systems and voice-driven AI agents.</p>
            <p>My mindset: understand the fundamentals, build with intent, and ship consistently one meaningful commit at a time.</p>
            <div class="skill-chips">
              <span class="skill-chip">PYTHON 3.11</span>
              <span class="skill-chip">TYPESCRIPT</span>
              <span class="skill-chip">REACT NATIVE</span>
              <span class="skill-chip">EXPO</span>
              <span class="skill-chip">KOTLIN</span>
              <span class="skill-chip">FASTAPI</span>
              <span class="skill-chip">OPENCV</span>
              <span class="skill-chip">C++20</span>
              <span class="skill-chip">ARCH LINUX</span>
            </div>
          </article>
          <article class="screen-card skill-matrix-card">
            <span class="micro">CORE ENGINEERING DOMAINS</span>
            <div class="skill-matrix">
              <div><b>MOBILE ENGINEERING</b><span>React Native · Expo · Kotlin · Jetpack Compose · Supabase</span></div>
              <div><b>AI & COMPUTER VISION</b><span>MediaPipe 478 · OpenCV · Local Neural TTS (Piper) · Model Orchestration</span></div>
              <div><b>SECURITY & ANALYSIS</b><span>APK DEX static analysis · Manifest decoding · SBOM transparency (Syft)</span></div>
              <div><b>SYSTEMS & LINUX</b><span>Arch Linux · Archiso custom OS build · C++20 · Shell automation</span></div>
            </div>
          </article>
        </div>
        <div class="screen-card screen-wide">
          <div class="split-heading">
            <div><span class="micro">CURRENT STATUS</span><h3>ACTIVE BUILDER & SHIPPER</h3></div>
            <span class="state-pill"><i class="fa-solid fa-circle text-green"></i> PRODUCTION FOCUSED</span>
          </div>
          <p>Engineering practical tools and shipping working software. Constantly refining architecture, user experience, and low-latency performance.</p>
        </div>
        <div class="screen-card screen-wide timeline-card">
          <span class="micro">CAREER MILESTONES</span>
          <div class="timeline">
            <div>
              <span>01</span><b>SYSTEMS ROOTS</b>
              <p>Explored Linux internals, shell scripting, and C++ fundamentals to understand OS assembly.</p>
            </div>
            <div>
              <span>02</span><b>TECH FEST RUNNER-UP</b>
              <p>Engineered and demonstrated NeuroDrive AI real-time driver drowsiness monitoring at tech fest.</p>
            </div>
            <div>
              <span>03</span><b>SHIPPING BUILDS</b>
              <p>Packaged & released EvoRyz v1.0.0 and Android Privacy Auditor v1.0.0, maintaining a 366-day dev streak.</p>
            </div>
          </div>
        </div>
      `
    },
    achievements: {
      kicker: 'VERIFIED MILESTONES // 2026',
      title: 'ACHIEVE<em>MENTS</em>',
      html: `
        <div class="achievement-hero">
          <article class="screen-card">
            <span class="micro">PROVEN TRACK RECORD</span>
            <h3 style="margin-top:20px;">ENGINEERED MOMENTUM.</h3>
            <p>Milestones, recognitions, and production builds shipped through consistent daily execution.</p>
          </article>
          <article class="screen-card">
            <div class="achievement-line">
              <div class="achievement-icon text-amber"><i class="fa-solid fa-fire"></i></div>
              <div>
                <strong>366-DAY ACTIVE DEV STREAK</strong>
                <span>Maintained an unbroken daily commit streak across 2025–2026 with 1,602 contributions recorded.</span>
              </div>
            </div>
            <div class="achievement-line">
              <div class="achievement-icon text-purple"><i class="fa-solid fa-trophy"></i></div>
              <div>
                <strong>AI TECH FEST — RUNNER-UP</strong>
                <span>Engineered and demonstrated a real-time computer vision driver drowsiness detection system with MediaPipe facial telemetry. Finished runner-up.</span>
              </div>
            </div>
            <div class="achievement-line">
              <div class="achievement-icon text-cyan"><i class="fa-solid fa-medal"></i></div>
              <div>
                <strong>GITHUB ACHIEVEMENTS UNLOCKED</strong>
                <span>Awarded GitHub Pull Shark, Quickdraw, YOLO, and Pair Extraordinaire badges on public engineering work.</span>
              </div>
            </div>
            <div class="achievement-line">
              <div class="achievement-icon text-green"><i class="fa-solid fa-rocket"></i></div>
              <div>
                <strong>04 PRODUCTION BUILDS & APKS</strong>
                <span>Packaged, tested, and shipped standalone Android APK releases for EvoRyz v1.0.0 and Auditor v1.0.0.</span>
              </div>
            </div>
          </article>
        </div>
      `
    },
    certificates: {
      kicker: 'ENCRYPTED VAULT // 2026',
      title: 'CERTIFI<em>CATES</em>',
      html: `
        <div class="certificate-lock">
          <div class="lock-orbit"><i class="fa-solid fa-lock"></i></div>
          <span class="micro">ACCESS RESTRICTED</span>
          <h3>CREDENTIALS VAULT</h3>
          <p>Official certifications, degree transcripts, and verified course completions are available upon direct request.</p>
          <button class="unlock-btn" onclick="openContacts()"><i class="fa-regular fa-envelope"></i> CONTACT SCEMPYY FOR ACCESS</button>
        </div>
      `
    }
  }[type];

  if (!data) return;
  screenInner.innerHTML = `
    <div class="screen-kicker"><i class="fa-solid fa-circle"></i> ${data.kicker}</div>
    <h1 class="screen-title">${data.title}</h1>
    ${data.html}
  `;
  infoScreen.classList.add('open');
}

if (screenBack) {
  screenBack.addEventListener('click', () => {
    playSound('back');
    infoScreen.classList.remove('open');
  });
}

document.querySelectorAll('.hud-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    openInfoPage(tab.dataset.tab);
  });
});

// Close all overlay screens helper
function closeAllModals() {
  projectsModal.classList.remove('open');
  telemetryModal.classList.remove('open');
  contactsPanel.classList.remove('open');
  projectDrawer.classList.remove('open');
  infoScreen.classList.remove('open');
  document.getElementById('terminal-modal').classList.remove('open');
}

// ESC to close any open modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllModals();
    playSound('back');
  }
});

// ===== 12. HACKER CLI TERMINAL EMULATOR =====
const terminalModal = document.getElementById('terminal-modal');
const terminalBtn = document.getElementById('terminal-btn');
const termTriggerTop = document.getElementById('terminal-trigger-top');
const termTriggerHint = document.getElementById('trigger-cli-hint');
const terminalCloseBtn = document.getElementById('terminal-close-btn');
const terminalCloseDot = document.getElementById('terminal-close-dot');
const termInput = document.getElementById('term-input');
const termHistory = document.getElementById('term-history');
const termBody = document.getElementById('terminal-body');

function toggleTerminal() {
  const isOpen = terminalModal.classList.toggle('open');
  if (isOpen) {
    playSound('ui');
    setTimeout(() => termInput.focus(), 50);
  } else {
    playSound('back');
  }
}

if (terminalBtn) terminalBtn.addEventListener('click', toggleTerminal);
if (termTriggerTop) termTriggerTop.addEventListener('click', toggleTerminal);
if (termTriggerHint) termTriggerHint.addEventListener('click', toggleTerminal);
if (terminalCloseBtn) terminalCloseBtn.addEventListener('click', toggleTerminal);
if (terminalCloseDot) terminalCloseDot.addEventListener('click', toggleTerminal);

// Global shortcut: ~ or Ctrl+K
window.addEventListener('keydown', (e) => {
  if (e.key === '`' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
    e.preventDefault();
    toggleTerminal();
  }
});

// Terminal command execution
if (termInput) {
  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = termInput.value.trim();
      const cmd = rawCmd.toLowerCase();
      termInput.value = '';

      // Print command entry
      const line = document.createElement('div');
      line.className = 'term-line';
      line.innerHTML = `<span class="term-prompt">scempyy@deck:~$</span> ${escapeHtml(rawCmd)}`;
      termHistory.appendChild(line);

      executeTerminalCommand(cmd);
      termBody.scrollTop = termBody.scrollHeight;
    }
  });
}

function printTerm(text, isError = false) {
  const out = document.createElement('div');
  out.className = 'term-line';
  if (isError) out.style.color = 'var(--red)';
  out.innerHTML = text;
  termHistory.appendChild(out);
}

function executeTerminalCommand(cmd) {
  playSound('ui');
  switch (cmd) {
    case 'help':
      printTerm(`
        Available tactical directives:<br>
        &nbsp;&nbsp;<span class="term-cmd">projects</span>&nbsp;&nbsp;&nbsp;&nbsp;- Open production projects modal<br>
        &nbsp;&nbsp;<span class="term-cmd">streak</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Output GitHub streak metrics & launch telemetry<br>
        &nbsp;&nbsp;<span class="term-cmd">badges</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Display unlocked GitHub achievements<br>
        &nbsp;&nbsp;<span class="term-cmd">skills</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Print core engineering tech stack<br>
        &nbsp;&nbsp;<span class="term-cmd">about</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Load operative background & story<br>
        &nbsp;&nbsp;<span class="term-cmd">matrix</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Toggle digital rain canvas mode<br>
        &nbsp;&nbsp;<span class="term-cmd">contact</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Open transmission channels<br>
        &nbsp;&nbsp;<span class="term-cmd">cv</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Download Curriculum Vitae PDF<br>
        &nbsp;&nbsp;<span class="term-cmd">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Flush terminal buffer<br>
        &nbsp;&nbsp;<span class="term-cmd">exit</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Close terminal window
      `);
      break;

    case 'projects':
      printTerm('>> Opening Projects Showcase...');
      setTimeout(() => { toggleTerminal(); openProjectsModal(); }, 300);
      break;

    case 'streak':
      printTerm(`
        <span class="text-amber">🔥 GITHUB STREAK TELEMETRY</span><br>
        &bull; Current Daily Streak: <strong>366 Days</strong> (Active)<br>
        &bull; Total Contributions: <strong>1,602 Commits</strong><br>
        &bull; Missing Days in Year: <strong>0 (100% Continuity)</strong><br>
        &bull; Permanent Streak Card: <strong>69 Streak Locked Forever</strong>
      `);
      setTimeout(() => { toggleTerminal(); openTelemetryModal(); }, 1200);
      break;

    case 'badges':
      printTerm(`
        <span class="text-purple">🏅 GITHUB ACHIEVEMENTS:</span><br>
        &bull; 🦈 <strong>Pull Shark</strong> [Silver] - Merged pull requests on public repositories<br>
        &bull; ⚡ <strong>Quickdraw</strong> [Gold] - Closed issue within 5 minutes<br>
        &bull; 🚀 <strong>YOLO</strong> [Emerald] - Merged PR without review<br>
        &bull; 👥 <strong>Pair Extraordinaire</strong> [Violet] - Co-authored merged commit
      `);
      break;

    case 'skills':
      printTerm(`
        <span class="text-cyan">⚡ CORE ENGINEERING MATRIX:</span><br>
        &bull; <strong>Languages:</strong> Python, TypeScript, JavaScript, Kotlin, C++20, Bash<br>
        &bull; <strong>Frameworks:</strong> React Native, Expo, Jetpack Compose, Next.js, FastAPI<br>
        &bull; <strong>AI & Vision:</strong> MediaPipe 478, OpenCV, Piper Neural TTS, Gemini<br>
        &bull; <strong>Systems:</strong> Arch Linux, Archiso, Systemd, Supabase, Syft SBOM
      `);
      break;

    case 'about':
      printTerm('>> Loading operative dossier...');
      setTimeout(() => { toggleTerminal(); openInfoPage('about'); }, 300);
      break;

    case 'contact':
      printTerm('>> Opening secure transmission channels...');
      setTimeout(() => { toggleTerminal(); openContacts(); }, 300);
      break;

    case 'matrix':
      if (window.toggleMatrixRain) window.toggleMatrixRain();
      printTerm('>> Matrix digital rain toggled.');
      break;

    case 'cv':
    case 'resume':
      printTerm('>> Opening Curriculum Vitae PDF...');
      window.open('assets/Pranav_Sharma_CV.pdf', '_blank');
      break;

    case 'clear':
      termHistory.innerHTML = '';
      break;

    case 'exit':
    case 'quit':
      toggleTerminal();
      break;

    case 'sudo':
      printTerm('scempyy is already operating with full root clearance.', true);
      break;

    case '':
      break;

    default:
      printTerm(`Command not recognized: "${escapeHtml(cmd)}". Type <span class="term-cmd">help</span> for directives.`, true);
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== 13. CLICK-TO-DESCRIBE HUD TOOLTIP =====
const descBox = document.getElementById('desc-box');
let descTimeout;

document.querySelectorAll('[data-desc]').forEach(el => {
  el.addEventListener('click', (e) => {
    const text = el.getAttribute('data-desc');
    if (!text) return;
    descBox.textContent = text;

    const rect = el.getBoundingClientRect();
    let top = rect.bottom + 10;
    let left = rect.left;

    const maxLeft = window.innerWidth - 300;
    if (left > maxLeft) left = maxLeft;
    if (top > window.innerHeight - 70) top = rect.top - 46;

    descBox.style.top = `${Math.max(10, top)}px`;
    descBox.style.left = `${Math.max(10, left)}px`;
    descBox.classList.add('visible');

    clearTimeout(descTimeout);
    descTimeout = setTimeout(() => descBox.classList.remove('visible'), 2600);
  });
});
