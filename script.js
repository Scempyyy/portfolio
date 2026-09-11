// ===== Sound effects =====
const backSound = new Audio('assets/sounds/back-click.mp3');
const uiSound = new Audio('assets/sounds/ui-click.mp3');
uiSound.volume = 0.6;

function playSound(audio) {
  const clone = audio.cloneNode();
  clone.volume = audio.volume;
  clone.play().catch(() => {});
}

document.addEventListener('click', (e) => {
  const backBtn = e.target.closest('.back-btn');
  if (backBtn) {
    playSound(backSound);
    handleBackNavigation();
    return;
  }
  const clickable = e.target.closest('button, .tab, .social-icon, .toggle, .project-tile');
  if (clickable) {
    playSound(uiSound);
  }
});

function handleBackNavigation() {
  // Close whatever is open, in priority order, before leaving the page
  const projectDetailEl = document.getElementById('project-detail');
  const projectsModalEl = document.getElementById('projects-modal');
  const contactsPanelEl = document.getElementById('contacts-panel');

  if (projectDetailEl && projectDetailEl.classList.contains('open')) {
    closeProjectDetail();
    return;
  }
  if (projectsModalEl && projectsModalEl.classList.contains('open')) {
    projectsModalEl.classList.remove('open');
    return;
  }
  if (contactsPanelEl && contactsPanelEl.classList.contains('open')) {
    contactsPanelEl.classList.remove('open');
    return;
  }
  // Nothing open — leave the page if there's somewhere to go back to
  if (window.history.length > 1) {
    window.history.back();
  }
}

// ===== Live date (top right) =====
function updateDate() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  document.getElementById('live-date').textContent = `${dd}-${mm}-${yyyy}`;
}
updateDate();
setInterval(updateDate, 60 * 1000);

// ===== Click-to-describe tooltip =====
const descBox = document.getElementById('desc-box');
let descTimeout;

document.querySelectorAll('[data-desc]').forEach(el => {
  el.addEventListener('click', (e) => {
    const text = el.getAttribute('data-desc');
    if (!text) return;
    descBox.textContent = text;

    const rect = el.getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.left;

    // keep inside viewport
    const maxLeft = window.innerWidth - 240;
    if (left > maxLeft) left = maxLeft;
    if (top > window.innerHeight - 60) top = rect.top - 44;

    descBox.style.top = `${top}px`;
    descBox.style.left = `${left}px`;
    descBox.classList.add('visible');

    clearTimeout(descTimeout);
    descTimeout = setTimeout(() => descBox.classList.remove('visible'), 2200);
  });
});

// ===== Project detail data =====
const PROJECT_DATA = {
  'driver-security': {
    title: 'Driver Security System',
    tagline: 'A real-time Driver Drowsiness and Attention Detection System built with Python, OpenCV and MediaPipe. A camera continuously monitors the driver\'s face — MediaPipe extracts 478 facial landmarks, and the system calculates Eye Aspect Ratio, Mouth Aspect Ratio, PERCLOS, blink rate, gaze direction and head tilt to detect drowsiness, yawning, head nodding and distraction in real time.',
    sections: [
      { icon: '📷', title: 'Camera → Face Detection', body: 'OpenCV opens the camera at up to 1280×720 and sends each frame to MediaPipe Face Landmarker, which detects 478 facial landmarks in real time — including points around the left eye, right eye, mouth, nose, chin and irises.' },
      { icon: '👁️', title: 'EAR — Eye Aspect Ratio', body: 'The core of the system. EAR is calculated from the vertical and horizontal distances between eye landmarks — a higher EAR means the eye is open, and it approaches 0 as the eye closes.\n\nThe system calibrates itself for whoever is using it: on startup you look at the camera with your eyes open for 60 frames, and it calculates your average open-eye EAR. From there:\n\nEAR threshold = average open-eye EAR × 0.75\n\nSo it never assumes everyone\'s eyes measure the same.' },
      { icon: '😴', title: 'Detecting Prolonged Eye Closure', body: 'Once calibrated, every frame is classified as eyes open or closed based on the personal threshold. The system counts consecutive closed-eye frames — 60 consecutive frames triggers the normal drowsiness alert. It\'s not reacting to a single blink; it\'s watching for a sustained closure.' },
      { icon: '📊', title: 'PERCLOS (Percentage of Eye Closure)', body: 'One of the more advanced parts of the project. The system keeps a rolling ~60-second window and records whether the eyes were closed in each frame. If PERCLOS exceeds 15%, it triggers a drowsiness alert — catching drivers who aren\'t continuously closing their eyes, but are spending an unusually large portion of recent time with eyes closed.' },
      { icon: '👁️', title: 'Blink Rate', body: 'The system records individual blink timestamps over the previous 60 seconds and calculates blinks per minute. Fewer than 10 blinks/minute or more than 30 blinks/minute is flagged as a suspicious condition — one more independent signal alongside EAR and PERCLOS.' },
      { icon: '🥱', title: 'Yawning Detection (MAR)', body: 'MAR — Mouth Aspect Ratio — increases as the mouth opens wider. The configured threshold is 0.65, and the condition has to persist for multiple frames before it\'s classified as a yawn, avoiding false positives from talking.' },
      { icon: '🤕', title: 'Head Nodding', body: 'The system tracks the position of the nose and chin to estimate forward head tilt. If the tilt exceeds the configured threshold and persists across enough frames, it\'s flagged as head nodding — a separate state representing microsleep risk.' },
      { icon: '👀', title: 'Gaze / Distraction Detection', body: 'Beyond drowsiness, the system tracks iris position relative to the eye to determine whether the driver is looking centre, left or right. Looking away for 60 frames switches the state to DISTRACTED, with an on-screen prompt like "LOOKING LEFT! — Keep eyes on road." This makes it a driver attention monitor as much as a drowsiness detector.' },
      { icon: '🚨', title: 'Alert System', body: 'A state machine prioritizes signals in this order: emergency → prolonged eye closure → high PERCLOS → yawning → nodding → looking away → low blink rate. Each layer feeds into a single alert decision so the most urgent condition always wins.' },
      { icon: '🆘', title: 'Emergency Mode', body: 'The standout feature. If the driver\'s eyes stay closed for around 4 seconds, the system treats it as a possible unresponsive/emergency situation:\n\n1. Shows a full-screen emergency warning\n2. Starts a 5-second countdown\n3. Gives the driver a chance to cancel by pressing C\n4. If there\'s no response, starts the emergency sequence\n5. Simulates sending an emergency message and sharing location\n6. Logs the event\n\nNote: the emergency SMS/location sharing is explicitly a simulation for this build — a production version would swap in a real API like Twilio or Fast2SMS.' },
      { icon: '📱', title: 'Phone Alerts', body: 'Drowsiness alerts can also trigger a Pushbullet notification to a phone once alert severity crosses a configured threshold — so the flow goes from a computer alarm to a phone notification for repeated or severe alerts.' },
      { icon: '📄', title: 'Driving Session Report', body: 'At the end of a session, the system generates a report covering driving duration, number of alerts, PERCLOS, blink rate, the calibrated EAR threshold, a safety score, and an alert timeline. It outputs a PDF (via ReportLab), falling back to a .txt report if ReportLab isn\'t installed. The safety score is out of 100, rated SAFE → CAUTION → WARNING → DANGEROUS.' }
    ]
  },
  'content-creation': {
    title: 'Content Creation',
    tagline: 'Building a small gaming brand — Scempyy / TD Nation — around Valorant content on Instagram and YouTube, with reels that broke past 300K views and a channel that reached monetization in under three months.',
    sections: [
      { icon: '🎮', title: 'The Brand — Scempyy / TD Nation', body: 'Built a gaming content brand around Valorant, posting across Instagram and YouTube. Grew it from scratch — gameplay clips, editing, captions, and a consistent posting style — while balancing it alongside school and college.' },
      { icon: '📸', title: 'Instagram — Reach Beyond Followers', body: 'Around 530 followers, but individual reels pulled in far more than that: 74.4K, 322K, and 338K views on separate reels. The content was getting pushed by Instagram to people well outside the existing follower base — the account grew through reach, not the other way around.\n\nThe style that worked best: short Valorant gameplay clips with relatable, often humorous captions — like tying exam stress to in-game skill ("Ye exams aate hi mereme skills kaha se aa jati hai") — which pulled in more than just hardcore Valorant viewers.' },
      { icon: '🎥', title: 'YouTube — Channel Stats', body: 'Lifetime numbers (22 March 2025 – 13 August 2025):\n\n• 103,800 total views\n• 4.6K hours of watch time\n• 639 subscribers\n• $12.05 estimated revenue\n\nThat works out to roughly 2.7 minutes of watch time per view on average — people weren\'t just clicking away, they were sticking around.' },
      { icon: '💰', title: 'Fast Monetization', body: 'Reached monetization in under three months — unusually quick for a small gaming channel. Combined with the Instagram reach, it meant two platforms were compounding at once: Instagram driving discovery, YouTube building a deeper, more consistent audience.' },
      { icon: '📡', title: 'The Hostel Internet Setback', body: 'Was streaming regularly alongside posting reels and videos, but after moving into the technical college hostel, the internet situation couldn\'t support regular streaming. Not a loss of interest or a content problem — a practical infrastructure limit. Streaming stopped, though the reels and videos already posted kept their views.' },
      { icon: '📊', title: 'Two Engines Running Together', body: 'Instagram handled discovery and viral reach — reels regularly outperforming the follower count by hundreds of times over. YouTube handled depth — longer watch time, a real subscriber base, and monetization. Together they turned a small account into a channel with real, measurable traction before the hostel internet cut streaming short.' }
    ]
  },
  'web-development': {
    title: 'Web Development Projects',
    tagline: 'This very site — a Valorant-themed interactive portfolio built from scratch with HTML, CSS and JavaScript.',
    sections: [
      { icon: '🌐', title: 'This Portfolio Site', body: 'The site you\'re looking at right now. Designed to match a Valorant main-menu aesthetic pixel-for-pixel — top bar, social rail, project grid, card system, and all — then built out as a real, working site with plain HTML, CSS and JavaScript, no frameworks.' },
      { icon: '🛠️', title: 'What\'s Under the Hood', body: 'Self-hosted fonts and icons (no CDN dependency), custom sound effects on every interaction, a "Choose a Project" grid modal with expandable detail panels, live-updating date, click-to-describe tooltips on nearly every element, and a swappable agent card. Built and refined iteratively, screen by screen, matching a reference mockup as closely as possible.' }
    ]
  },
  'ai-assistant': {
    title: 'Own AI Assistant',
    tagline: 'A personal AI assistant built with Python that runs on my laptop and handles tasks for me.',
    sections: [
      { icon: '🤖', title: 'How It Works', body: 'Built using Python to run locally on my laptop, acting as a personal assistant that can carry out tasks on my behalf — automating the kind of repetitive work I\'d otherwise have to do by hand.' }
    ]
  },
  'phishing-detector': { title: 'Phishing Website Detector', status: 'progress' },
  'lifestyle-tracker': {
    title: 'Lifestyle Tracker',
    tagline: 'A C++ console program for logging and tracking daily lifestyle habits.',
    sections: [
      { icon: '📋', title: 'How It Works', body: 'Written in C++ as a straightforward console-based tracker — logs daily habits like sleep, water intake, and study/workout time, storing entries so they can be reviewed later to spot patterns over time. Kept intentionally simple: basic input handling, structured logging, and simple stat calculations rather than a full app with a GUI.' }
    ]
  },
  'ai-study-buddy': { title: 'AI Study Buddy', status: 'progress' },
  'server-infrastructure': { title: 'Server Infrastructure', status: 'progress' },
  'urban-planning': { title: 'Urban Planning Tool', status: 'progress' },
  'hardware-interface': { title: 'Hardware Interface', status: 'progress' },
  'secure-vault': { title: 'Secure Vault Access', status: 'progress' }
};

const cardSlots = document.querySelector('.card-slots');
const projectDetail = document.getElementById('project-detail');

function renderProjectDetail(key) {
  const data = PROJECT_DATA[key];
  if (!data) return;

  let html = `
    <div class="pd-header">
      <button class="pd-back" id="pd-back"><i class="fa-solid fa-arrow-left"></i> BACK TO PROFILE</button>
      <h2>${data.title.toUpperCase()}</h2>
    </div>`;

  if (data.tagline) {
    html += `<p class="pd-tagline">${data.tagline}</p>`;
  }

  if (data.sections && data.sections.length) {
    html += '<div class="pd-banners">' + data.sections.map((s, i) => `
      <div class="pd-banner" data-i="${i}">
        <div class="pd-banner-head">
          <span class="pd-icon">${s.icon}</span>
          <span class="pd-title">${s.title}</span>
          <i class="fa-solid fa-chevron-down pd-chevron"></i>
        </div>
        <div class="pd-body">${s.body}</div>
      </div>`).join('') + '</div>';
  } else {
    const msg = data.status === 'progress'
      ? 'Currently working on this.'
      : 'Detailed write-up coming soon.';
    html += `<div class="pd-empty"><i class="fa-solid fa-hourglass-half"></i><p>${msg}</p></div>`;
  }

  projectDetail.innerHTML = html;

  document.getElementById('pd-back').addEventListener('click', closeProjectDetail);
  projectDetail.querySelectorAll('.pd-banner-head').forEach(head => {
    head.addEventListener('click', () => head.parentElement.classList.toggle('open'));
  });
}

function openProjectDetail(key) {
  renderProjectDetail(key);
  cardSlots.style.display = 'none';
  projectDetail.classList.add('open');
  projectsModal.classList.remove('open');
  contactsPanel.classList.remove('open');
  tabPanel.classList.remove('open');
}

function closeProjectDetail() {
  projectDetail.classList.remove('open');
  cardSlots.style.display = '';
}

document.querySelectorAll('.project-tile[data-project]').forEach(tile => {
  tile.addEventListener('click', () => openProjectDetail(tile.dataset.project));
});

// ===== Projects modal (Choose a Project grid) =====
const projectsBtn = document.getElementById('projects-btn');
const projectsModal = document.getElementById('projects-modal');
const projectsModalClose = document.getElementById('projects-modal-close');

projectsBtn.addEventListener('click', () => {
  contactsPanel.classList.remove('open');
  projectsModal.classList.add('open');
});
projectsModalClose.addEventListener('click', () => projectsModal.classList.remove('open'));
projectsModal.addEventListener('click', (e) => {
  if (e.target === projectsModal) projectsModal.classList.remove('open');
});

// ===== Contacts panel =====
const contactsBtn = document.getElementById('contacts-btn');
const contactsPanel = document.getElementById('contacts-panel');
const contactsClose = document.getElementById('contacts-close');

contactsBtn.addEventListener('click', () => {
  projectsModal.classList.remove('open');
  contactsPanel.classList.add('open');
});
contactsClose.addEventListener('click', () => contactsPanel.classList.remove('open'));

// ===== Bottom tabs =====
const tabs = document.querySelectorAll('.tab');
const tabPanel = document.getElementById('tab-panel');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    const alreadyActive = tab.classList.contains('active') && tabPanel.classList.contains('open');

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    tabContents.forEach(c => c.classList.remove('active'));
    document.getElementById(`tab-${target}`).classList.add('active');

    if (alreadyActive) {
      tabPanel.classList.remove('open');
    } else {
      tabPanel.classList.add('open');
    }
  });
});
// open About Me by default
tabPanel.classList.add('open');

// ===== Mute toggle =====
const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');
let muted = true;
muteBtn.addEventListener('click', () => {
  muted = !muted;
  muteIcon.className = muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
});

// ===== Swap card art (click the card) =====
const agentCard = document.getElementById('agent-card');
const cardArtImg = document.getElementById('card-art-img');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

agentCard.addEventListener('click', (e) => {
  // let the data-desc tooltip fire too, then open the file picker
  fileInput.click();
});
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    cardArtImg.src = URL.createObjectURL(file);
  }
});

// close side panels when clicking outside them
document.addEventListener('click', (e) => {
  if (!projectsModal.contains(e.target) && e.target !== projectsBtn && !projectsBtn.contains(e.target)) {
    projectsModal.classList.remove('open');
  }
  if (!contactsPanel.contains(e.target) && e.target !== contactsBtn && !contactsBtn.contains(e.target)) {
    contactsPanel.classList.remove('open');
  }
});
