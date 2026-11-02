// ===== Interface sound — click only (never touch / scroll) =====
const soundSrc={ui:'assets/sounds/ui-click.mp3',back:'assets/sounds/back-click.mp3'};
const soundPools={ui:[],back:[]};
let muted=false;
function buildSoundPool(type,size=5){
  soundPools[type]=Array.from({length:size},()=>{
    const a=new Audio(soundSrc[type]);
    a.preload='auto';
    a.volume=1.0;
    return a;
  });
}
buildSoundPool('ui');
buildSoundPool('back');
let uiIndex=0,backIndex=0;
function playSound(type){
  if(muted)return;
  const pool=soundPools[type];
  if(!pool?.length)return;
  const index=type==='ui'?(uiIndex++%pool.length):(backIndex++%pool.length);
  const a=pool[index];
  try{
    a.currentTime=0;
    const p=a.play();
    if(p?.catch)p.catch(()=>{});
  }catch(e){}
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
  'evoryz': {
    title: 'EvoRyz — Personal Growth & Accountability Engine',
    tagline: 'A production-ready mobile application engineered around personal growth, discipline, and daily execution. EvoRyz features a 100-day Winter Arc challenge system, encrypted offline-first journal, and a connected accountability network.',
    sections: [
      { icon: '❄️', title: 'Winter Arc 100-Day Challenge Engine', body: 'A structured milestone and streak progression system that turns daily habits into a measurable campaign. Includes automated streak tracking, daily check-ins, and completion analytics.' },
      { icon: '📱', title: 'React Native & Expo Architecture', body: 'Built with React Native and Expo using TypeScript for end-to-end type safety. Designed with smooth, responsive 60fps gesture animations, modern dark mode design, and native performance.' },
      { icon: '📴', title: 'Offline-First & Cloud Sync', body: 'Engineered for seamless offline usage with fast local SQLite/persisted storage. Automatically synchronizes with Supabase whenever network connectivity is available without interrupting the user experience.' },
      { icon: '🔒', title: 'Encrypted Personal Journal', body: 'Features private reflections and daily progress logging with client-side privacy controls. Your thoughts and personal habit records stay yours.' },
      { icon: '🚀', title: 'Live Production Release (APK v1.0.0)', body: 'Fully packaged, verified, and released as a production Android APK on GitHub Releases. Ready for installation and daily testing.' }
    ]
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
    ]
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
    ]
  },
  'roborabbit': {
    title: 'RoboRabbit — Autonomous Voice AI Companion',
    tagline: 'A personal voice AI companion built in Python. Integrates speech recognition, local neural text-to-speech, computer screen perception, and resilient multi-model failover orchestration.',
    sections: [
      { icon: '🎙️', title: 'Voice Pipeline & Real-Time Loop', body: 'Streams real-time audio capture into an assistant loop, managing conversational turn-taking, barge-in support, and intelligent pause detection.' },
      { icon: '🔊', title: 'Low-Latency Local Neural TTS', body: 'Leverages local Piper neural TTS models to generate human-like speech output directly on the device with sub-second response times without external voice API latency.' },
      { icon: '🧠', title: 'Multi-Model Failover Orchestration', body: 'Architected with an abstracted provider layer that seamlessly switches between Gemini, local models, and external APIs with automatic fallback handling.' },
      { icon: '⚙️', title: 'FastAPI & WebSocket Service Layer', body: 'Built with a clean asynchronous FastAPI backend communicating via WebSockets for bidirectional audio and telemetry streaming.' }
    ]
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

const cardSlots = document.querySelector('.card-slots');
const projectDetail = document.getElementById('project-detail');

function renderProjectDetail(key) {
  const data = PROJECT_DATA[key];
  if (!data) return;

  let html = `
    <div class="pd-header">
      <button class="pd-back" id="pd-back"><i class="fa-solid fa-arrow-left"></i> BACK TO PROJECTS</button>
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
    const msg = data.status === 'experiment'
      ? 'An experiment / early build — detailed write-up coming soon.'
      : 'Detailed write-up coming soon.';
    html += `<div class="pd-empty"><i class="fa-solid fa-hourglass-half"></i><p>${msg}</p></div>`;
  }

  projectDetail.innerHTML = html;

  document.getElementById('pd-back').addEventListener('click', handleBackNavigation);
  projectDetail.querySelectorAll('.pd-banner-head').forEach(head => {
    head.addEventListener('click', () => head.parentElement.classList.toggle('open'));
  });
}

function openProjectDetail(key, addHistory = true) {
  if (addHistory) pushScreenState('project', {key});
  renderProjectDetail(key);
  cardSlots.style.display = 'none';
  projectDetail.classList.add('open');
  projectsModal.classList.remove('open');
  contactsPanel.classList.remove('open');
  tabPanel.classList.remove('open');
}

function closeProjectDetail(returnToProjects = true) {
  projectDetail.classList.remove('open');
  cardSlots.style.display = '';
  if (returnToProjects) {
    const pm = document.getElementById('projects-modal');
    if (pm) pm.classList.add('open');
  }
}

document.querySelectorAll('.project-tile[data-project]').forEach(tile => {
  tile.addEventListener('click', () => openProjectDetail(tile.dataset.project, true));
});

// ===== Full-screen section navigation =====
const infoScreen=document.getElementById('info-screen');
const screenInner=document.getElementById('screen-inner');
const screenBack=document.getElementById('screen-back');
const projectsBtn=document.getElementById('projects-btn');
const projectsModal=document.getElementById('projects-modal');
const projectsModalClose=document.getElementById('projects-modal-close');
const contactsBtn=document.getElementById('contacts-btn');
const contactsPanel=document.getElementById('contacts-panel');
const contactsClose=document.getElementById('contacts-close');
const muteBtn=document.getElementById('mute-btn');
const muteIcon=document.getElementById('mute-icon');
const tabs=document.querySelectorAll('.tab');

function closeAllScreens(){
  infoScreen.classList.remove('open'); infoScreen.setAttribute('aria-hidden','true');
  projectsModal.classList.remove('open'); contactsPanel.classList.remove('open');
  projectDetail.classList.remove('open'); cardSlots.style.display='';
}
function openInfoPage(type, addHistory = true){
  if (addHistory) pushScreenState('info', {type});
  const data={
    about:{kicker:'PROFILE // 001',title:'ABOUT <em>ME</em>',html:`<div class="screen-grid"><article class="screen-card about-main"><span class="micro">PRANAV SHARMA // SCEMPYY</span><h3>WHO IS SCEMPYY?</h3><p>I'm an AI/ML student and builder focused on practical, high-reliability software. I love understanding how systems work under the hood — from privacy-preserving static code analyzers and cross-platform mobile apps to real-time computer vision safety systems and voice-driven AI agents.</p><p>My mindset: understand the fundamentals, build with intent, and ship consistently one meaningful commit at a time.</p><div class="skill-chips"><span class="skill-chip">PYTHON</span><span class="skill-chip">TYPESCRIPT</span><span class="skill-chip">REACT NATIVE</span><span class="skill-chip">KOTLIN</span><span class="skill-chip">FASTAPI</span><span class="skill-chip">OPENCV</span><span class="skill-chip">C++</span><span class="skill-chip">LINUX / ARCH</span></div></article><article class="screen-card skill-matrix-card"><span class="big-number">04</span><span class="micro">CORE ENGINEERING DOMAINS</span><div class="skill-matrix"><div><b>MOBILE</b><span>React Native · Expo · Kotlin · Jetpack Compose · Supabase</span></div><div><b>AI & VISION</b><span>MediaPipe · OpenCV · Local Neural TTS · Orchestration</span></div><div><b>SECURITY</b><span>APK static analysis · Manifest decoding · SBOM transparency</span></div><div><b>SYSTEMS</b><span>Linux · Archiso custom OS · C++20 · Automation</span></div></div></article></div><div class="screen-card screen-wide"><div class="split-heading"><div><span class="micro">CURRENT STATE</span><h3>ACTIVE BUILDER & SHIPPER</h3></div><span class="state-pill"><i></i> PRODUCTION FOCUSED</span></div><p>Engineering practical tools and shipping working software. Constantly refining architecture, user experience, and low-latency performance.</p></div><div class="screen-card screen-wide timeline-card"><span class="micro">CAREER MILESTONES</span><div class="timeline"><div><span>01</span><b>SYSTEMS ROOTS</b><p>Explored Linux internals, shell scripting, and C++ fundamentals to understand OS assembly.</p></div><div><span>02</span><b>TECH FEST RUNNER-UP</b><p>Engineered and demonstrated NeuroDrive AI real-time driver drowsiness monitoring at tech fest.</p></div><div><span>03</span><b>SHIPPING BUILDS</b><p>Packaged & released EvoRyz v1.0.0 and Android Privacy Auditor v1.0.0, maintaining a 366-day dev streak.</p></div></div></div>`},
    achievements:{kicker:'MILESTONES // 2026',title:'ACHIEVE<em>MENTS</em>',html:`<div class="achievement-hero"><article class="screen-card"><span class="micro">PROVEN TRACK RECORD</span><h3 style="margin-top:25px">REAL MILESTONES.</h3><p>Recognitions, shipped software, and technical achievements earned through consistent daily execution.</p></article><article class="screen-card"><div class="achievement-line"><div class="achievement-icon"><i class="fa-solid fa-trophy"></i></div><div><strong>TECH FEST — RUNNER-UP</strong><span>Engineered and demonstrated a real-time computer vision driver drowsiness detection system with MediaPipe facial telemetry. Finished runner-up.</span></div></div><div class="achievement-line"><div class="achievement-icon"><i class="fa-solid fa-fire"></i></div><div><strong>366-DAY ACTIVE DEV STREAK</strong><span>Unbroken daily commit streak throughout 2025–2026 with over 1,600+ GitHub contributions recorded.</span></div></div><div class="achievement-line"><div class="achievement-icon"><i class="fa-solid fa-medal"></i></div><div><strong>GITHUB ACHIEVEMENTS</strong><span>Awarded GitHub Pull Shark, Quickdraw, YOLO, and Pair Extraordinaire badges for active engineering.</span></div></div><div class="achievement-line"><div class="achievement-icon"><i class="fa-solid fa-rocket"></i></div><div><strong>04 PRODUCTION BUILDS & APKS</strong><span>Packaged, tested, and shipped standalone Android APK releases for EvoRyz v1.0.0 and Auditor v1.0.0.</span></div></div></article></div><div class="screen-card screen-wide"><h3>ENGINEERING PRINCIPLES</h3><div class="screen-list"><div class="screen-list-item"><strong>DEEP UNDERSTANDING</strong><span>Understand how systems and dependencies function below the high-level API.</span></div><div class="screen-list-item"><strong>SHIP REAL BUILDS</strong><span>Build full-stack, tested software rather than abandoned toy prototypes.</span></div><div class="screen-list-item"><strong>CONSISTENT EXECUTION</strong><span>Show up daily, write clean code, and maintain relentless momentum.</span></div></div></div>`},
    certificates:{kicker:'RESTRICTED // 2026',title:'CERTIFI<em>CATES</em>',html:`<div class="certificate-lock"><div class="lock-orbit"><i class="fa-solid fa-lock"></i></div><span class="micro">ACCESS RESTRICTED</span><h3>CERTIFICATES ARE LOCKED</h3><p>I keep this section private for now. If you'd like to verify my certifications or request access, contact me directly.</p><button class="unlock-btn" id="unlock-certificates"><i class="fa-regular fa-envelope"></i> CONTACT ME TO UNLOCK</button><div class="locked-note"><span>STATUS</span><b>LOCKED</b><span>ACCESS</span><b>BY REQUEST</b></div></div>`}
  }[type];
  if(!data)return;
  screenInner.innerHTML=`<div class="screen-kicker"><i class="fa-solid fa-circle"></i>${data.kicker}</div><h1 class="screen-title">${data.title}</h1>${data.html}<div class="screen-footerline"><span>SCEMPYY // PERSONAL SYSTEM</span><span>ESC TO RETURN</span></div>`;
  closeAllScreens(); infoScreen.classList.add('open'); infoScreen.setAttribute('aria-hidden','false');
}
function openProjects(addHistory = true){
  if(addHistory) pushScreenState('projects');
  closeAllScreens();
  projectsModal.classList.add('open');
}
function openContacts(addHistory = true){
  if(addHistory) pushScreenState('contacts');
  closeAllScreens();
  contactsPanel.classList.add('open');
}

// ===== Mobile / browser Back support =====
// Every in-app screen gets its own real session-history entry.
// Android Back, iPhone swipe-back, and browser Back therefore return
// through the portfolio screens before leaving the site.
let scempyyHistoryIndex = 0;
function pushScreenState(screen, extra={}){
  scempyyHistoryIndex += 1;
  history.pushState(
    {scempyy:true, screen, index:scempyyHistoryIndex, ...extra},
    '',
    location.pathname + '#' + (screen==='project' ? 'project-'+encodeURIComponent(extra.key) : screen==='info' ? encodeURIComponent(extra.type) : screen==='contacts' ? 'contact' : 'projects')
  );
}

// Mark the currently loaded document as the portfolio's home state.
if(!history.state || !history.state.scempyy){
  history.replaceState({scempyy:true, screen:'home', index:0}, '', location.pathname);
}else{
  scempyyHistoryIndex = Number(history.state.index)||0;
}

function handleBackNavigation(){
  // If we're inside the portfolio, let the browser traverse the real
  // history stack. This is what native Android/iOS Back and gestures use.
  if(history.state?.scempyy && history.state.screen !== 'home'){
    history.back();
    return;
  }
  closeAllScreens();
}

function renderHistoryState(state){
  if(!state || !state.scempyy || state.screen==='home'){
    closeAllScreens();
    return;
  }
  if(state.screen==='projects') openProjects(false);
  else if(state.screen==='contacts') openContacts(false);
  else if(state.screen==='info') openInfoPage(state.type, false);
  else if(state.screen==='project') openProjectDetail(state.key, false);
}

window.addEventListener('popstate', (event)=>{
  scempyyHistoryIndex = Number(event.state?.index)||0;
  renderHistoryState(event.state);
});

// In-page BACK buttons also use the same history path.
screenBack.addEventListener('click',handleBackNavigation);
projectsBtn.addEventListener('click',()=>openProjects(true));
contactsBtn.addEventListener('click',()=>openContacts(true));
projectsModalClose?.addEventListener('click',handleBackNavigation);
contactsClose?.addEventListener('click',handleBackNavigation);
document.getElementById('projects-top')?.addEventListener('click',()=>openProjects(true));
document.getElementById('contacts-top')?.addEventListener('click',()=>openContacts(true));
tabs.forEach(tab=>tab.addEventListener('click',()=>openInfoPage(tab.dataset.tab,true)));
document.addEventListener('click',e=>{if(e.target.closest('#unlock-certificates')){openContacts(true);}});
muteBtn.addEventListener('click',e=>{
  e.stopPropagation();
  muted=!muted;
  muteIcon.className=muted?'fa-solid fa-volume-xmark':'fa-solid fa-volume-high';
  muteBtn.classList.toggle('is-muted',muted);
  if(!muted)playSound('ui');
});

// IMPORTANT: use CLICK, not pointerdown/touchstart.
// A pointerdown happens when a finger merely touches the screen, including
// the start of a scroll. A click happens after an intentional tap/click.
document.addEventListener('click',e=>{
  const el=e.target.closest('button,.social-icon,.project-tile,.pd-banner-head,a');
  if(!el || el===muteBtn || el.closest('#mute-btn')) return;
  const isBack = el.classList.contains('pd-back') ||
                 el.classList.contains('screen-back') ||
                 el===projectsModalClose ||
                 el===contactsClose;
  playSound(isBack ? 'back' : 'ui');
},{capture:true,passive:true});

document.addEventListener('keydown',e=>{if(e.key==='Escape')handleBackNavigation();});
document.querySelectorAll('.contact-disabled,[aria-disabled=\"true\"]').forEach(el=>el.addEventListener('click',e=>e.preventDefault()));

// ===== Profile photo placeholder =====
// The profile card stays intentionally clean until a personal photo is added.

