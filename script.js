// ===== Interface sound — preloaded + pointerdown for instant response =====
const soundSrc={ui:'assets/sounds/ui-click.mp3',back:'assets/sounds/back-click.mp3'};
const soundPools={ui:[],back:[]};
let muted=false;
let soundUnlocked=false;
function buildSoundPool(type,size=5){
  soundPools[type]=Array.from({length:size},()=>{const a=new Audio(soundSrc[type]);a.preload='auto';a.volume=type==='ui'?1.0:1.0;a.load();return a;});
}
buildSoundPool('ui'); buildSoundPool('back');
let uiIndex=0,backIndex=0;
function unlockSounds(){
  soundUnlocked=true;
  [...soundPools.ui,...soundPools.back].forEach(a=>{try{a.load()}catch(e){}});
}
function playSound(type){
  if(muted)return;
  const pool=soundPools[type];
  if(!pool?.length)return;
  const index=type==='ui'?(uiIndex++%pool.length):(backIndex++%pool.length);
  const a=pool[index];
  try{a.currentTime=0;const p=a.play();if(p?.catch)p.catch(()=>{});}catch(e){}
}
document.addEventListener('pointerdown',unlockSounds,{once:true,passive:true});

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
    tagline: 'An archived creator project — Scempyy / TD Nation — built around Valorant content on Instagram and YouTube. The creator chapter is finished, but the work is still a useful record of what I learned about editing, consistency and audience reach.',
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
    tagline: 'Frontend work built from plain web technologies — including this portfolio — with a focus on interaction, layout, visual systems and making a page feel like an actual experience.',
    sections: [
      { icon: '🌐', title: 'This Portfolio Site', body: 'The site you\'re looking at right now. It started from a visual direction inspired by a game interface, then grew into a personal portfolio with dedicated About, Achievements, Certificates, Projects and Contact views.' },
      { icon: '🧱', title: 'Built Without a Framework', body: 'The core is plain HTML, CSS and JavaScript. That means the layouts, interactions, project screens, navigation and visual details are all controlled directly rather than hidden behind a large framework.' },
      { icon: '🎛️', title: 'Interaction Is Part of the Build', body: 'The portfolio uses full-screen panels, project detail views, animated transitions, interface sounds, hover states and responsive layouts. The goal is for navigation to feel deliberate instead of like clicking through a collection of static pages.' },
      { icon: '📱', title: 'Responsive Thinking', body: 'The same information needs to remain usable on different screen sizes, so the project uses responsive layouts and mobile-specific spacing rather than assuming everyone is looking at a desktop monitor.' },
      { icon: '🧠', title: 'What I Learned', body: 'This project has been a practical lesson in structuring a real frontend, managing UI state with JavaScript, refining CSS, thinking about hierarchy, and repeatedly polishing small details until the interface feels coherent.' }
    ]
  },
  'ai-assistant': {
    title: 'Own AI Assistant',
    tagline: 'A personal local Python assistant built around one simple idea: useful AI should feel like a tool you can actually use, not just a chat window.',
    sections: [
      { icon: '🤖', title: 'The Idea', body: 'This is my attempt at making a personal assistant that lives on my own machine. Instead of building a polished consumer app, the focus is on learning how an assistant can connect AI with practical actions and everyday computer tasks.' },
      { icon: '🐍', title: 'Built With Python', body: 'Python is the main layer tying the assistant together. It gives the project a simple place to handle input, logic, AI interaction and task execution while keeping the code easy to change as the idea evolves.' },
      { icon: '🖥️', title: 'Local-First', body: 'The assistant is designed to run locally on my laptop. That makes it a useful playground for experimenting with AI workflows while keeping the project close to the machine I actually use.' },
      { icon: '⚙️', title: 'What I Am Exploring', body: 'The interesting part is not a list of flashy commands. It is figuring out how an AI model can understand intent, choose an action, execute it, and return something useful — the basic loop behind a real assistant.' },
      { icon: '🧪', title: 'Current Status', body: 'Personal project / ongoing experiment. I am still refining the idea rather than pretending it is a finished product.' }
    ]
  },
  'phishing-detector': {
    title: 'Phishing Website Detector',
    tagline: 'A security-focused experiment exploring how suspicious websites and URLs can be identified before a user trusts them.',
    status: 'experiment',
    sections: [
      { icon: '🛡️', title: 'The Problem', body: 'Phishing works by making a malicious page look trustworthy. A useful detector needs to look past appearance and examine signals that can indicate a suspicious destination.' },
      { icon: '🔎', title: 'What I Am Exploring', body: 'The project explores how URL and website characteristics can be turned into signals for deciding whether a page looks legitimate or suspicious. It is a learning project around security, feature thinking and machine-learning concepts.' },
      { icon: '🧠', title: 'Why It Matters', body: 'The interesting challenge is balancing detection with false positives. A security tool that blocks everything is not useful, while one that misses obvious phishing pages is not useful either.' },
      { icon: '🧪', title: 'Current Status', body: 'Early experiment. It is not presented as a production-grade security product, and the detailed implementation and evaluation are still being developed.' }
    ]
  },
  'lifestyle-tracker': {
    title: 'Lifestyle Tracker',
    tagline: 'A deliberately simple C++ console tracker for turning everyday routines into something I can record, review and reason about.',
    sections: [
      { icon: '📋', title: 'The Idea', body: 'The project is built around a simple problem: routines are easy to forget and hard to judge from memory. A small tracker makes those habits visible by turning them into recorded entries.' },
      { icon: '⌨️', title: 'Console-First', body: 'Written in C++ as a command-line program. The interface is intentionally simple so the focus stays on input handling, program logic and keeping the data structured.' },
      { icon: '📈', title: 'What Gets Tracked', body: 'The tracker is designed around everyday habits such as sleep, water intake and study/workout time, with entries that can be reviewed later to spot patterns in a routine.' },
      { icon: '🧠', title: 'What It Taught Me', body: 'A small project like this is useful for practicing variables, conditions, data handling, repeated input, basic statistics and the kind of logic that becomes a foundation for larger applications.' },
      { icon: '🧪', title: 'Current Scope', body: 'It is a learning project, not a full lifestyle platform. Keeping the scope small was intentional: make the core idea work first, then decide what is actually worth adding.' }
    ]
  },
  'ai-study-buddy': {
    title: 'AI Study Buddy',
    tagline: 'An experimental AI study companion focused on making questions, notes and revision easier to turn into a useful learning workflow.',
    status: 'experiment',
    sections: [
      { icon: '📚', title: 'The Idea', body: 'Instead of treating AI as a machine that simply gives answers, this project explores using it as a study companion — something that can help a student work through material, ask better questions and revise.' },
      { icon: '🧩', title: 'The Workflow', body: 'The concept is built around turning normal study inputs such as questions or notes into more structured help: explanations, prompts for revision and ways to break a difficult topic into smaller pieces.' },
      { icon: '🤖', title: 'AI + Prompting', body: 'Prompting is an important part of the experiment because the usefulness of an AI study tool depends heavily on how the task and context are communicated to the model.' },
      { icon: '🧪', title: 'Current Status', body: 'Early experiment. The idea is still being explored, so this page describes the direction rather than pretending there is a finished application behind it.' }
    ]
  },
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

function closeProjectDetail(returnToProjects = true) {
  projectDetail.classList.remove('open');
  cardSlots.style.display = '';
  if (returnToProjects) {
    const pm = document.getElementById('projects-modal');
    if (pm) pm.classList.add('open');
  }
}

document.querySelectorAll('.project-tile[data-project]').forEach(tile => {
  tile.addEventListener('click', () => openProjectDetail(tile.dataset.project));
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
function openInfoPage(type){
  const data={
    about:{kicker:'PROFILE // 001',title:'ABOUT <em>ME</em>',html:`<div class="screen-grid"><article class="screen-card about-main"><span class="micro">PRANAV SHARMA // SCEMPYY</span><h3>WHO IS SCEMPYY?</h3><p>I'm a first-year B.Tech AI/ML student who learns by actually using things — writing code, trying AI tools, living in Linux, and breaking stuff until I understand why it broke.</p><p>I don't have a perfectly planned career path yet. That's fine. Right now I'm building fundamentals and collecting the kind of experience that makes the next idea easier to build.</p><div class="skill-chips"><span class="skill-chip">PYTHON</span><span class="skill-chip">C++</span><span class="skill-chip">AI / ML</span><span class="skill-chip">AI PROMPTING</span><span class="skill-chip">HTML / CSS / JS</span><span class="skill-chip">LINUX / ARCH</span></div></article><article class="screen-card skill-matrix-card"><span class="big-number">03</span><span class="micro">AREAS I WORK IN</span><div class="skill-matrix"><div><b>PYTHON</b><span>AI · automation · scripting</span></div><div><b>C++</b><span>fundamentals · logic · console apps</span></div><div><b>AI / ML</b><span>experiments · computer vision · prompting</span></div><div><b>WEB</b><span>HTML · CSS · JavaScript</span></div><div><b>LINUX</b><span>Arch · terminal · packages · setup</span></div></div></article></div><div class="screen-card screen-wide"><div class="split-heading"><div><span class="micro">CURRENT STATE</span><h3>LEARNING & EXPLORING</h3></div><span class="state-pill"><i></i> NO FAKE ROADMAP</span></div><p>I'm not pretending to have a huge product in progress. I'm strengthening AI/ML and software fundamentals, exploring ideas, and waiting for something worth building.</p></div><div class="screen-card screen-wide timeline-card"><span class="micro">A SHORT TIMELINE</span><div class="timeline"><div><span>01</span><b>FIRST YEAR</b><p>Started the B.Tech journey and began turning curiosity into actual projects.</p></div><div><span>02</span><b>TECH FEST</b><p>Presented an idea and built a driver drowsiness detection system. Finished runner-up.</p></div><div><span>03</span><b>NOW</b><p>Going deeper into AI/ML, software and Linux while figuring out what deserves the next build.</p></div></div></div>`},
    achievements:{kicker:'MILESTONES // 2026',title:'ACHIEVE<em>MENTS</em>',html:`<div class="achievement-hero"><article class="screen-card"><span class="micro">FIRST-YEAR HIGHLIGHTS</span><h3 style="margin-top:25px">EARLY, BUT REAL.</h3><p>A couple of things I'm genuinely proud of from the first year of my degree.</p></article><article class="screen-card"><div class="achievement-line"><div class="achievement-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div><div><strong>AI PROMPTING</strong><span>Mastered AI prompting techniques for research, ideation, automation and practical AI workflows.</span></div></div><div class="achievement-line"><div class="achievement-icon"><i class="fa-solid fa-trophy"></i></div><div><strong>TECH FEST — RUNNER-UP</strong><span>Presented a project idea and built a driver drowsiness detection system for the tech fest. Finished runner-up in the first year of my degree.</span></div></div></article></div><div class="screen-card screen-wide"><h3>WHAT MATTERS NEXT</h3><div class="screen-list"><div class="screen-list-item"><strong>GET BETTER</strong><span>Strengthen AI/ML and software fundamentals.</span></div><div class="screen-list-item"><strong>MAKE THINGS</strong><span>Build when I have an idea worth building — not just to fill a portfolio.</span></div><div class="screen-list-item"><strong>STAY CURIOUS</strong><span>Keep experimenting until the next direction becomes obvious.</span></div></div></div>`},
    certificates:{kicker:'RESTRICTED // 2026',title:'CERTIFI<em>CATES</em>',html:`<div class="certificate-lock"><div class="lock-orbit"><i class="fa-solid fa-lock"></i></div><span class="micro">ACCESS RESTRICTED</span><h3>CERTIFICATES ARE LOCKED</h3><p>I keep this section private for now. If you'd like to verify my certifications or request access, contact me directly.</p><button class="unlock-btn" id="unlock-certificates"><i class="fa-regular fa-envelope"></i> CONTACT ME TO UNLOCK</button><div class="locked-note"><span>STATUS</span><b>LOCKED</b><span>ACCESS</span><b>BY REQUEST</b></div></div>`}
  }[type];
  if(!data)return;
  screenInner.innerHTML=`<div class="screen-kicker"><i class="fa-solid fa-circle"></i>${data.kicker}</div><h1 class="screen-title">${data.title}</h1>${data.html}<div class="screen-footerline"><span>SCEMPYY // PERSONAL SYSTEM</span><span>ESC TO RETURN</span></div>`;
  closeAllScreens(); infoScreen.classList.add('open'); infoScreen.setAttribute('aria-hidden','false');
}
function openProjects(){closeAllScreens();projectsModal.classList.add('open');}
function openContacts(){closeAllScreens();contactsPanel.classList.add('open');}
function handleBackNavigation(){
  if(projectDetail.classList.contains('open')){closeProjectDetail();return;}
  if(infoScreen.classList.contains('open')||projectsModal.classList.contains('open')||contactsPanel.classList.contains('open')){closeAllScreens();return;}
}
screenBack.addEventListener('click',handleBackNavigation);
projectsBtn.addEventListener('click',openProjects); contactsBtn.addEventListener('click',openContacts);
projectsModalClose?.addEventListener('click',handleBackNavigation); contactsClose?.addEventListener('click',handleBackNavigation);
document.getElementById('projects-top')?.addEventListener('click',openProjects);
document.getElementById('contacts-top')?.addEventListener('click',openContacts);
tabs.forEach(tab=>tab.addEventListener('click',()=>openInfoPage(tab.dataset.tab)));
document.addEventListener('click',e=>{if(e.target.closest('#unlock-certificates')){openContacts();}});
muteBtn.addEventListener('click',e=>{e.stopPropagation();muted=!muted;muteIcon.className=muted?'fa-solid fa-volume-xmark':'fa-solid fa-volume-high';muteBtn.classList.toggle('is-muted',muted);if(!muted)playSound('ui');});
document.addEventListener('pointerdown',e=>{
  const el=e.target.closest('button,.social-icon,.project-tile,.pd-banner-head');
  if(!el||el===muteBtn||el.closest('#mute-btn'))return;
  const isBack=el.classList.contains('pd-back')||el.classList.contains('screen-back')||el===projectsModalClose||el===contactsClose;
  playSound(isBack?'back':'ui');
},{capture:true,passive:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')handleBackNavigation();});
document.querySelectorAll('.contact-disabled,[aria-disabled=\"true\"]').forEach(el=>el.addEventListener('click',e=>e.preventDefault()));

// ===== Profile photo placeholder =====
// The profile card stays intentionally clean until a personal photo is added.

