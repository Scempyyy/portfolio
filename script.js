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
  'privacy-auditor': {
    title: 'Auditor — Android Privacy Auditor',
    tagline: 'An Android privacy and security auditing platform designed to make app behaviour easier to inspect and understand. The project combines APK analysis, permission review and clear reporting instead of treating a permission list as the whole privacy story.',
    sections: [
      { icon: '📱', title: 'Android App Architecture', body: 'Built around Kotlin and Jetpack Compose, with Coroutines and Flow for asynchronous work and Room for local persistence. Android package visibility is handled explicitly for modern Android versions.' },
      { icon: '🔬', title: 'APK & Static Analysis', body: 'The analysis flow inspects APK contents and DEX-level information to look for security-relevant indicators. Findings are surfaced as evidence and signals for review, not as proof that an app is malicious.' },
      { icon: '🧩', title: 'Permissions Need Context', body: 'A permission is not automatically a vulnerability. Auditor is intended to combine requested access, app context and other available indicators so users can understand why something deserves attention.' },
      { icon: '📊', title: 'Privacy Review & Reports', body: 'The interface focuses on a readable summary, risk explanations and locally exportable PDF reports. The goal is to make technical findings usable for both everyday users and reviewers.' },
      { icon: '🛡️', title: 'Design Principle', body: 'The project prioritizes explainability: show what was observed, why it matters and what the user can check next. A score is a summary aid, not a definitive verdict.' }
    ]
  },
  'roborabbit': {
    title: 'RoboRabbit — Personal AI Assistant',
    tagline: 'A personal voice assistant project built in Python. RoboRabbit connects speech input, an AI model and text-to-speech so that a conversation can become a practical computer-side workflow.',
    sections: [
      { icon: '🎙️', title: 'Voice Pipeline', body: 'The project experiments with audio capture and processing, passing user input into an assistant loop and returning spoken responses. The first milestone was getting RoboRabbit to speak successfully.' },
      { icon: '🧠', title: 'AI Integration', body: 'The assistant uses a model API for language understanding and response generation. The architecture keeps model interaction separate from the voice interface so providers can be changed.' },
      { icon: '🔊', title: 'Text to Speech', body: 'Piper is used for local text-to-speech experiments, keeping spoken output close to the machine rather than relying entirely on a cloud voice service.' },
      { icon: '⚙️', title: 'Local Service Layer', body: 'A small FastAPI service provides a clean local interface for parts of the assistant. This makes it easier to separate the assistant logic from future frontends or integrations.' },
      { icon: '🧪', title: 'Current Direction', body: 'The focus is on modularity and reliability: speech in, intent and response processing, then speech out. It remains an evolving personal project.' }
    ]
  },
  'roboos': {
    title: 'RoboOS — Custom Linux Build',
    tagline: 'A custom Arch-based Linux distribution experiment created to learn how a Linux system is assembled, themed and packaged into a bootable ISO.',
    sections: [
      { icon: '🐧', title: 'Arch Linux Foundation', body: 'RoboOS is based on Arch Linux and uses the Archiso tooling to produce a bootable image. The project is a hands-on way to understand the pieces that make up a Linux installation.' },
      { icon: '🎨', title: 'Visual Identity', body: 'The design direction uses a purple and black visual theme, giving the custom environment a recognizable identity rather than shipping an untouched default setup.' },
      { icon: '💿', title: 'Building an ISO', body: 'The workflow includes configuring the build profile, selecting packages and generating an ISO that can be tested in a virtual machine before considering real hardware.' },
      { icon: '🧰', title: 'What It Teaches', body: 'The project explores package selection, boot media, system configuration, Linux internals and the practical difference between installing a distribution and assembling one.' }
    ]
  },
  'privacy-browser': {
    title: 'Privacy Browser + AI Cyber Shield',
    tagline: 'A privacy-first browser and security companion concept focused on safer downloads, local analysis and transparent software supply-chain information.',
    sections: [
      { icon: '🧱', title: 'Core Architecture', body: 'The architecture is organized around a C++20 core, with explicit boundaries for path sanitization, staging and download analysis. The goal is to keep risky file handling deliberate and reviewable.' },
      { icon: '🔐', title: 'Download Safety', body: 'The proposed flow stages downloads before they are opened, validates paths and computes SHA-256 hashes. This creates a controlled point where checks can run before a file reaches its final destination.' },
      { icon: '📦', title: 'Software Transparency', body: 'The project uses Anchore Syft as a pinned SBOM tool to explore software-bill-of-materials generation and dependency visibility.' },
      { icon: '📱', title: 'Android Companion', body: 'The Android side is designed as a security companion, with optional VPN or DNS filtering rather than assuming every feature must live inside the browser.' },
      { icon: '🧠', title: 'Local-First AI', body: 'The design preference is local-first analysis, with cloud fallback disabled by default. That keeps sensitive inspection data on-device unless a user deliberately chooses otherwise.' }
    ]
  },
  'myfam-devices': {
    title: 'MyFam Devices',
    tagline: 'A family device companion app experiment built with Expo and Supabase. The project explores the basics of building a cross-platform mobile app backed by a hosted data service.',
    sections: [
      { icon: '📲', title: 'Mobile App', body: 'The frontend is built with Expo, making it possible to develop and test a React Native application across supported mobile platforms.' },
      { icon: '🗄️', title: 'Backend', body: 'Supabase provides the backend building blocks for data storage and application connectivity. It keeps the prototype focused on app flows rather than building every backend service from scratch.' },
      { icon: '🧪', title: 'Prototype Status', body: 'This is an exploratory build. The goal is to learn mobile development, authentication and connected app workflows while validating the product idea.' }
    ]
  },
  'driver-security': {
    title: 'Driver Security System',
    tagline: 'A real-time driver drowsiness and attention detection system built with Python, OpenCV and MediaPipe. The camera monitors facial landmarks and combines several signals rather than reacting to a single blink.',
    sections: [
      { icon: '📷', title: 'Face Landmarks', body: 'OpenCV captures camera frames and MediaPipe Face Landmarker extracts 478 facial landmarks, including eye, mouth and iris points.' },
      { icon: '👁️', title: 'EAR & PERCLOS', body: 'Eye Aspect Ratio helps estimate eye closure, while PERCLOS tracks the proportion of time eyes remain closed across a rolling window. The system calibrates an open-eye baseline for the current user.' },
      { icon: '🥱', title: 'Multiple Signals', body: 'Mouth Aspect Ratio, blink rate, head tilt and gaze direction add context for yawning, nodding and distraction. Combining signals helps avoid relying on one measurement alone.' },
      { icon: '🚨', title: 'Alerts & Emergency Flow', body: 'A prioritised alert state machine surfaces the most urgent condition. The emergency messaging and location-sharing sequence in this build is a simulation, not a live emergency service.' },
      { icon: '📄', title: 'Session Report', body: 'The system can generate a driving-session report containing duration, alerts, selected metrics and a summary safety score.' }
    ]
  },
  'content-creation': {
    title: 'Content Creation — Archived',
    tagline: 'An archived creator chapter built around gaming content, editing and audience growth across Instagram and YouTube.',
    sections: [
      { icon: '🎮', title: 'Gaming Content', body: 'Created Valorant-focused clips and posts, learning how pacing, editing, captions and consistency shape short-form content.' },
      { icon: '📊', title: 'YouTube Results', body: 'Historical channel analytics recorded 103,800 views, 4.6K hours of watch time and 639 subscribers between 22 March 2025 and 13 August 2025.' },
      { icon: '🎬', title: 'What I Learned', body: 'The project taught practical lessons in editing, motion, publishing workflows, audience retention and interpreting creator analytics.' }
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
    about:{kicker:'PROFILE // 001',title:'ABOUT <em>ME</em>',html:`<div class="screen-grid"><article class="screen-card about-main"><span class="micro">PRANAV SHARMA // SCEMPYY</span><h3>WHO IS SCEMPYY?</h3><p>I'm a first-year B.Tech AI/ML student who learns by actually using things — writing code, trying AI tools, living in Linux, and breaking stuff until I understand why it broke.</p><p>I don't have a perfectly planned career path yet. That's fine. Right now I'm building fundamentals and collecting the kind of experience that makes the next idea easier to build.</p><div class="skill-chips"><span class="skill-chip">PYTHON</span><span class="skill-chip">C++</span><span class="skill-chip">AI / ML</span><span class="skill-chip">AI PROMPTING</span><span class="skill-chip">HTML / CSS / JS</span><span class="skill-chip">LINUX / ARCH</span></div></article><article class="screen-card skill-matrix-card"><span class="big-number">03</span><span class="micro">AREAS I WORK IN</span><div class="skill-matrix"><div><b>PYTHON</b><span>AI · automation · scripting</span></div><div><b>C++</b><span>fundamentals · logic · console apps</span></div><div><b>AI / ML</b><span>experiments · computer vision · prompting</span></div><div><b>WEB</b><span>HTML · CSS · JavaScript</span></div><div><b>LINUX</b><span>Arch · terminal · packages · setup</span></div></div></article></div><div class="screen-card screen-wide"><div class="split-heading"><div><span class="micro">CURRENT STATE</span><h3>LEARNING & EXPLORING</h3></div><span class="state-pill"><i></i> NO FAKE ROADMAP</span></div><p>I'm not pretending to have a huge product in progress. I'm strengthening AI/ML and software fundamentals, exploring ideas, and waiting for something worth building.</p></div><div class="screen-card screen-wide timeline-card"><span class="micro">A SHORT TIMELINE</span><div class="timeline"><div><span>01</span><b>FIRST YEAR</b><p>Started the B.Tech journey and began turning curiosity into actual projects.</p></div><div><span>02</span><b>TECH FEST</b><p>Presented an idea and built a driver drowsiness detection system. Finished runner-up.</p></div><div><span>03</span><b>NOW</b><p>Going deeper into AI/ML, software and Linux while figuring out what deserves the next build.</p></div></div></div>`},
    achievements:{kicker:'MILESTONES // 2026',title:'ACHIEVE<em>MENTS</em>',html:`<div class="achievement-hero"><article class="screen-card"><span class="micro">FIRST-YEAR HIGHLIGHTS</span><h3 style="margin-top:25px">EARLY, BUT REAL.</h3><p>A couple of things I'm genuinely proud of from the first year of my degree.</p></article><article class="screen-card"><div class="achievement-line"><div class="achievement-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div><div><strong>AI PROMPTING</strong><span>Mastered AI prompting techniques for research, ideation, automation and practical AI workflows.</span></div></div><div class="achievement-line"><div class="achievement-icon"><i class="fa-solid fa-trophy"></i></div><div><strong>TECH FEST — RUNNER-UP</strong><span>Presented a project idea and built a driver drowsiness detection system for the tech fest. Finished runner-up in the first year of my degree.</span></div></div></article></div><div class="screen-card screen-wide"><h3>WHAT MATTERS NEXT</h3><div class="screen-list"><div class="screen-list-item"><strong>GET BETTER</strong><span>Strengthen AI/ML and software fundamentals.</span></div><div class="screen-list-item"><strong>MAKE THINGS</strong><span>Build when I have an idea worth building — not just to fill a portfolio.</span></div><div class="screen-list-item"><strong>STAY CURIOUS</strong><span>Keep experimenting until the next direction becomes obvious.</span></div></div></div>`},
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

