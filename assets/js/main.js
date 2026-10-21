/**
 * AJAY PAYER - INTERACTIVE PROFESSIONAL PROFILE ENGINE
 * Engineered with Human-Computer Interaction (HCI) Principles:
 * - Nielsen's 10 Usability Heuristics
 * - Fitts's Law (Optimized hit targets & floating quick-dock)
 * - Hick's Law (Categorized navigation & instant filter chips)
 * - Audio-Visual Feedback (Synthesized Web Audio clicks & toast alerts)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSoundEngine();
  initLiveClock();
  initScrollSpyAndProgress();
  initMobileDrawer();
  initProjectFilters();
  initModals();
  initCommandPalette();
  initContactForm();
  initCopyButtons();
});

/* ==========================================================================
   1. THEME ENGINE (Dark / Light Mode with LocalStorage & Shortcut)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const storedTheme = localStorage.getItem('ajay-profile-theme') || 'dark';

  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('ajay-profile-theme', nextTheme);
      updateThemeIcon(nextTheme);
      playSound('toggle');
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  // Keyboard shortcut 'T' to toggle theme
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 't' || e.key === 'T') {
      themeToggle?.click();
    }
  });
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  if (theme === 'light') {
    icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  } else {
    icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  }
}

/* ==========================================================================
   2. SYNTHESIZED SOUND ENGINE (Web Audio API - Zero External Dependencies)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = localStorage.getItem('ajay-profile-sound') === 'true';

function initSoundEngine() {
  const soundToggle = document.getElementById('sound-toggle');
  updateSoundIcon();

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('ajay-profile-sound', soundEnabled);
      updateSoundIcon();
      if (soundEnabled) {
        playSound('success');
        showToast('UI Sound Effects Enabled', 'info');
      } else {
        showToast('UI Sound Effects Muted', 'info');
      }
    });
  }

  // Attach sound to interactive buttons
  document.querySelectorAll('.btn, .nav-link, .filter-tab, .skill-pill, .dock-btn').forEach(elem => {
    elem.addEventListener('click', () => playSound('click'));
  });
}

function updateSoundIcon() {
  const icon = document.getElementById('sound-icon');
  if (!icon) return;
  if (soundEnabled) {
    icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
  } else {
    icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'toggle') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    }
  } catch (e) {
    // Graceful fallback if audio is blocked
  }
}

/* ==========================================================================
   3. LIVE CLOCK & DYNAMIC GREETING (Mumbai, Maharashtra IST)
   ========================================================================== */
function initLiveClock() {
  const greetingElem = document.getElementById('dynamic-greeting');
  const clockElem = document.getElementById('ist-clock');
  if (!greetingElem && !clockElem) return;

  function update() {
    const now = new Date();
    // Options for Indian Standard Time
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const timeString = new Intl.DateTimeFormat('en-IN', options).format(now);
    if (clockElem) clockElem.textContent = `${timeString} IST (Mumbai)`;

    // Calculate hour in IST
    const istHour = parseInt(
      new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false }).format(now)
    );

    let greeting = 'Hello';
    if (istHour >= 5 && istHour < 12) greeting = 'Good Morning ☀️';
    else if (istHour >= 12 && istHour < 17) greeting = 'Good Afternoon 🌤️';
    else if (istHour >= 17 && istHour < 22) greeting = 'Good Evening 🌇';
    else greeting = 'Working Late? Welcome 🌙';

    if (greetingElem) greetingElem.textContent = greeting;
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. SCROLL PROGRESS & ACTIVE NAV SPY (HCI Heuristic 1: System Status)
   ========================================================================== */
function initScrollSpyAndProgress() {
  const progressBar = document.getElementById('scroll-progress');
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Highlight current page nav link
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (!href.startsWith('#')) {
      link.classList.remove('active');
    }
  });

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    if (progressBar) progressBar.style.width = scrolled + '%';

    if (winScroll > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   5. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    drawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));
}

/* ==========================================================================
   6. PROJECTS FILTER & REAL-TIME SEARCH (Hick's Law & Search Recovery)
   ========================================================================== */
function initProjectFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('project-search-input');
  const countBadge = document.getElementById('projects-count-display');
  const emptyState = document.getElementById('projects-empty-state');
  const resetBtn = document.getElementById('reset-filter-btn');

  let activeFilter = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    projectCards.forEach(card => {
      const categoryStr = (card.getAttribute('data-category') || '').toLowerCase().trim();
      const categories = categoryStr.split(/\s+/);
      const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.project-desc')?.textContent.toLowerCase() || '';
      const stack = card.querySelector('.project-tech-stack')?.textContent.toLowerCase() || '';

      const filterLower = (activeFilter || 'all').toLowerCase().trim();
      const matchesFilter = (filterLower === 'all') || 
                            categories.includes(filterLower) || 
                            categoryStr.includes(filterLower) ||
                            (filterLower.includes('decision') && categoryStr.includes('decision'));

      const matchesSearch = !searchQuery || 
                            title.includes(searchQuery) || 
                            desc.includes(searchQuery) || 
                            stack.includes(searchQuery) ||
                            categoryStr.includes(searchQuery);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countBadge) countBadge.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter');
      applyFilters();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    applyFilters();
  });

  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchQuery = '';
    activeFilter = 'all';
    filterTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-filter') === 'all'));
    applyFilters();
    showToast('Filters reset', 'info');
  });
}

/* ==========================================================================
   7. MODAL ENGINE (Deep-dives, Resume, Articles, HCI Lab)
   ========================================================================== */
const projectDetailsData = {
  'hte-platform': {
    title: 'HTE-Based AI Decision Platform',
    category: 'Full-Stack AI / Government Decision Support',
    stack: 'React, Django, SQLite, ChromaDB, BM25, Groq LLaMA-3',
    period: 'Winner, VJTI AI Hackathon 2026 & Adopted by Govt of Maharashtra',
    highlights: [
      'Won 1st Place at the VJTI AI Hackathon 2026 for the HTE Decision Intelligence Platform.',
      'Engineered a centralized intelligence suite aggregating 11 educational datasets across 20+ engineering colleges in Maharashtra.',
      'Implemented Hybrid Search combining dense vector embeddings (ChromaDB) with BM25 keyword retrieval for zero-hallucination institutional Q&A.',
      'Constructed branch-wise enrollment forecasting pipeline predicting admission trends with 94.6% confidence interval.',
      'Adopted by state education authorities for executive budget allocation and policy decision-making.'
    ],
    architecture: `
┌──────────────────┐      ┌───────────────────────────────┐      ┌─────────────────────┐
│  React Frontend  │ ◄──► │  Django REST API Framework    │ ◄──► │  Groq Inference API │
│  (Vite + Charts) │      │  (Orchestration & Validation) │      │  (LLaMA-3 70B RAG)  │
└──────────────────┘      └──────────────┬────────────────┘      └─────────────────────┘
                                         │
                         ┌───────────────┴────────────────┐
                         ▼                                ▼
              ┌─────────────────────┐          ┌──────────────────────┐
              │  ChromaDB Vectors   │          │  SQLite Institutional│
              │  (Dense RAG Search) │          │  Datasets & Reports  │
              └─────────────────────┘          └──────────────────────┘`
  },
  'krushi-sarthi': {
    title: 'Krushi Sarthi — Multilingual Agritech Portal',
    category: 'Agritech AI / Farmer Support Assistant',
    stack: 'Python, Django, JavaScript, SQLite, Google Gemini API',
    period: 'Feb 2026 - May 2026',
    highlights: [
      'Comprehensive farmer portal organizing Government Schemes, Minimum Support Price (MSP), and Agricultural Loan eligibility.',
      'Integrated conversational AI powered by Google Gemini supporting seamless trilingual communication in Marathi, Hindi, and English.',
      'Automated SMS notification worker alerting enrolled farmers the moment newly published schemes or MSP revisions are released.',
      'Role-based administrative portal for departmental verification and dynamic scheme updates.'
    ],
    architecture: `
┌─────────────────┐       ┌───────────────────────────────┐       ┌──────────────────────┐
│  Farmer Mobile/ │ ◄───► │  Django Application Server    │ ◄───► │  Google Gemini API   │
│  Desktop Portal │       │  (Session & Language Handler) │       │  (NLP Multi-lingual) │
└─────────────────┘       └──────────────┬────────────────┘       └──────────────────────┘
                                         │
                         ┌───────────────┴────────────────┐
                         ▼                                ▼
              ┌─────────────────────┐          ┌──────────────────────┐
              │  SMS Gateway API    │          │  SQLite Database     │
              │  (Instant Alerts)   │          │  (Schemes, MSP, Loan)│
              └─────────────────────┘          └──────────────────────┘`
  },
  'air-dust': {
    title: 'Air Dust Particle Size & PM2.5 Prediction',
    category: 'Machine Learning / Environmental Analytics',
    stack: 'Python, Pandas, NumPy, Scikit-learn, Matplotlib, XGBoost',
    period: 'Jun 2024 - Jul 2024 (Konect U)',
    highlights: [
      'Designed end-to-end ML pipeline predicting PM2.5 particulate concentration fusing reference and low-cost sensor data.',
      'Performed IQR-based outlier detection, feature correlation matrix calculation, and timestamp-based rolling window aggregation.',
      'Benchmarked 4 regression algorithms: Multiple Linear Regression, Random Forest, SVR, and XGBoost.',
      'Random Forest achieved peak performance with R² of 89.2%, RMSE of 43.94, and MAE of 28.86.'
    ],
    architecture: `
Raw Sensor Streams (Ref + Low Cost) ──► Timestamp Alignment & Hourly Averaging
                                     │
                                     ▼
                      IQR Outlier Filtering & Feature Scaling
                                     │
                                     ▼
                     Regression Model Benchmarking Suite
     ┌──────────────────────┬──────────────────────┬──────────────────────┐
     │ MLR: R² 71.4%        │ SVR: R² 80.1%        │ XGBoost: R² 86.8%    │
     └──────────────────────┴──────────────────────┴──────────────────────┘
                                     │
                                     ▼
                     ★ Random Forest Regressor (R² = 89.2%) ★`
  },
  'minesweeper-csp': {
    title: 'Minesweeper AI — CSP Solver & Probability Engine',
    category: 'Artificial Intelligence / Constraint Satisfaction Problems',
    stack: 'JavaScript, Constraint Satisfaction Problem (CSP) Solver, Probability Inference, HTML5 Canvas',
    period: 'Apr 2026 (Open Source)',
    highlights: [
      'Formulated Minesweeper cell deduction as a Constraint Satisfaction Problem (CSP) with boundary matrix equations.',
      'Constructed exact probability calculation engine evaluating risk scores for unresolvable frontier cells.',
      'Engineered an interactive graphical interface with step-by-step AI explanation overlays demonstrating constraint resolution.',
      'Achieved superior win-rates compared to standard heuristic approaches across Beginner, Intermediate, and Expert grid layouts.'
    ],
    architecture: `
┌─────────────────────────┐       ┌─────────────────────────────┐
│  Minesweeper Grid State │ ────► │  Linear Constraint Analyzer │
│  (Revealed Numbers)     │       │  (Vars: Unopened Neighbors) │
└─────────────────────────┘       └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │ Deterministic Deduction     │
                                  │ (Subset & Boundary Solving) │
                                  └──────────────┬──────────────┘
                                                 │ Certain moves?
                                ┌────────────────┴────────────────┐
                             YES│                               NO│
                                ▼                                 ▼
                     ┌─────────────────────┐           ┌─────────────────────┐
                     │ Immediate Safe Move │           │ Probability Engine  │
                     │ Execution           │           │ (Min Risk Selector) │
                     └─────────────────────┘           └─────────────────────┘`
  },
  'healthmate': {
    title: 'HealthMate — AI Healthcare Assistant',
    category: 'Healthcare AI / Conversational Assistant',
    stack: 'JavaScript, CSS3, HTML5, Natural Language Processing, Health Informatics',
    period: 'Jun – Jul 2026',
    highlights: [
      'Developed an interactive personal healthcare assistant facilitating intuitive symptom reporting and wellness guidance.',
      'Implemented automated severity classification engine categorizing user conditions into self-care, clinical follow-up, or emergency alert.',
      'Engineered a responsive, accessibility-first medical dashboard with clean typography, rapid emergency contact access, and health habit metrics.',
      'Designed privacy-conscious client-side state handling ensuring user consultation logs remain confidential.'
    ],
    architecture: `
┌─────────────────────────┐       ┌─────────────────────────────┐
│  Patient Symptom Input  │ ────► │  Conversational Triage Flow │
│  (NLP Text / Symptoms)  │       │  (Context Intake & History) │
└─────────────────────────┘       └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │ Clinical Severity Classifier│
                                  │ (Rule-based + AI Inference) │
                                  └──────────────┬──────────────┘
                                                 │
                                ┌────────────────┼────────────────┐
                                ▼                ▼                ▼
                     ┌────────────────┐  ┌───────────────┐  ┌────────────────┐
                     │ Self-Care Tips │  │ Clinic Visit  │  │ Emergency SOS  │
                     │ & Lifestyle    │  │ Recommendation│  │ Direct Dial    │
                     └────────────────┘  └───────────────┘  └────────────────┘`
  },
  'fjms': {
    title: 'FJMS — Freelancer Job Management System',
    category: 'Full-Stack Web / Enterprise Workflow',
    stack: 'HTML5, CSS3, JavaScript, PHP / SQL, RESTful Endpoints',
    period: 'Nov 2025',
    highlights: [
      'Engineered a comprehensive job and project management platform connecting independent professionals with client engagements.',
      'Built a bidirectional proposal workflow allowing freelancers to submit milestone bids and clients to track active contracts.',
      'Implemented automated milestone deliverable tracking with status progressions (Pending, In Progress, Under Review, Completed).',
      'Developed financial reporting widgets displaying total billed hours, invoice statuses, and projected earnings.'
    ],
    architecture: `
┌──────────────────────────┐      ┌─────────────────────────────┐      ┌──────────────────────────┐
│  Client Management View  │ ◄──► │  Core Application Backend   │ ◄──► │  Freelancer Workspace    │
│  (Post Jobs, Review)     │      │  (Role Auth & API Router)   │      │  (Submit Bids, Deliver)  │
└──────────────────────────┘      └──────────────┬──────────────┘      └──────────────────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │ Relational Database         │
                                  │ (Milestones, Contracts, Pay)│
                                  └─────────────────────────────┘`
  },
  'event-register': {
    title: 'SE Lab Event Registration & Management System',
    category: 'Software Engineering / Academic Platform',
    stack: 'Python, Flask / Django, SQLite, HTML5, CSS3, Data Validation',
    period: 'Apr 2026',
    highlights: [
      'Constructed a reliable event registration and ticketing system designed for collegiate technical fests and academic seminars.',
      'Engineered atomic seat allocation logic preventing overbooking and race conditions during high-volume registration spikes.',
      'Implemented automated participant pass generation with custom registration hashes and downloadable verification slips.',
      'Designed an administrative analytics dashboard presenting real-time department participation metrics and exportable CSV rosters.'
    ],
    architecture: `
┌──────────────────────────┐      ┌─────────────────────────────┐      ┌──────────────────────────┐
│  Student / Attendee      │ ────►│  Registration Controller    │ ────►│  SQLite Database         │
│  Registration Form       │      │  (Seat Lock & Validation)   │      │  (Unique Participant ID) │
└──────────────────────────┘      └──────────────┬──────────────┘      └──────────────────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │ Confirmation & Pass Engine  │
                                  │ (QR / ID Generation & Rost) │
                                  └─────────────────────────────┘`
  }
};



function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  const projectDetailModal = document.getElementById('project-detail-modal');
  const resumeModal = document.getElementById('resume-modal');
  const articleModal = document.getElementById('article-modal');
  const hciModal = document.getElementById('hci-modal');

  function closeModal() {
    overlay?.classList.remove('active');
    document.querySelectorAll('.modal-dialog').forEach(m => m.style.display = 'none');
    document.body.style.overflow = '';
  }

  function openSpecificModal(modalElem) {
    if (!overlay || !modalElem) return;
    document.querySelectorAll('.modal-dialog').forEach(m => m.style.display = 'none');
    modalElem.style.display = 'flex';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    playSound('toggle');
  }

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Project inspect buttons
  document.querySelectorAll('[data-inspect-project]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-inspect-project');
      const data = projectDetailsData[projId];
      if (!data) return;

      document.getElementById('modal-proj-title').textContent = data.title;
      document.getElementById('modal-proj-category').textContent = data.category;
      document.getElementById('modal-proj-stack').textContent = data.stack;
      document.getElementById('modal-proj-period').textContent = data.period;

      const highlightsList = document.getElementById('modal-proj-highlights');
      highlightsList.innerHTML = data.highlights.map(h => `<li>▹ ${h}</li>`).join('');

      document.getElementById('modal-proj-arch').textContent = data.architecture;

      openSpecificModal(projectDetailModal);
    });
  });

  // Resume trigger buttons
  document.querySelectorAll('[data-open-resume]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSpecificModal(resumeModal);
    });
  });



  // HCI Guide modal triggers
  document.querySelectorAll('[data-open-hci]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSpecificModal(hciModal);
    });
  });
}

/* ==========================================================================
   8. COMMAND PALETTE (Ctrl + K or / Shortcut - HCI Efficiency & Flexibility)
   ========================================================================== */
function initCommandPalette() {
  // Ensure command palette DOM exists on the page (auto-injected if not present in HTML)
  let overlay = document.getElementById('command-palette-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'command-palette-overlay';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="modal-dialog command-palette-dialog">
        <div class="palette-search-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="palette-input" placeholder="Search pages, projects, skills, or resume (e.g. VJTI, Django, CSP)..." aria-label="Command search" autocomplete="off">
          <span class="shortcut-badge">ESC</span>
        </div>
        <div id="palette-results" class="palette-results"></div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const input = document.getElementById('palette-input');
  const resultsContainer = document.getElementById('palette-results');
  const triggerBtn = document.getElementById('cmd-palette-btn');

  const commands = [
    { label: 'Go to Executive Dashboard (Home)', url: 'index.html', icon: '🏠', keywords: 'home dashboard main executive overview bio' },
    { label: 'Go to Academic & Education (VJTI & DBATU)', url: 'education.html', icon: '🎓', keywords: 'vjti dbatu diploma btech ssc degree coursework rank 11 academic' },
    { label: 'Go to Industry Experience (Konect U)', url: 'experience.html', icon: '💼', keywords: 'konect u internship ml generative ai random forest sensor air quality work industry' },
    { label: 'Go to Featured Projects & Systems (7 Projects)', url: 'projects.html', icon: '🚀', keywords: 'projects portfolio code github systems software' },
    { label: 'Project: HTE-Based AI Decision Platform (Govt. Adoption)', url: 'projects.html', icon: '🏛️', keywords: 'hte government maharashtra rag chromadb groq llama-3 django react policy analytics' },
    { label: 'Project: Krushi Sarthi (Agritech Multilingual AI)', url: 'projects.html', icon: '🌾', keywords: 'krushi sarthi farmer agritech gemini marathi hindi english msp django sms agriculture' },
    { label: 'Project: Air Dust Particle Size & PM2.5 Prediction', url: 'projects.html', icon: '🔬', keywords: 'air dust pm2.5 sensor random forest xgboost scikit machine learning iot telemetry' },
    { label: 'Project: Minesweeper AI (CSP & Probability Engine)', url: 'projects.html', icon: '💣', keywords: 'minesweeper csp constraint satisfaction ai probability canvas game autonomous solver' },
    { label: 'Project: HealthMate (AI Healthcare Assistant)', url: 'projects.html', icon: '🩺', keywords: 'healthmate healthcare doctor triage symptom medical assistant clinical wellness' },
    { label: 'Project: Freelancer Job Management System (FJMS)', url: 'projects.html', icon: '💼', keywords: 'fjms freelancer job client milestone invoice workflow bidding contract' },
    { label: 'Project: Event Registration & Management System', url: 'projects.html', icon: '🎟️', keywords: 'se lab event registration ticketing participant quota python sqlite passes' },
    { label: 'Go to Skills & Tooling Matrix', url: 'skills.html', icon: '⚡', keywords: 'skills python react django c++ sql ml git docker linux tools technologies' },
    { label: 'Go to Achievements & Awards', url: 'achievements.html', icon: '🏆', keywords: 'awards honors rank 11 dbatu merit scholar topper performance recognition' },
    { label: 'Achievement: VJTI AI Hackathon Winner 2026 (HTE Platform)', url: 'achievements.html', icon: '🥇', keywords: 'vjti hackathon winner 2026 hte decision platform first place award' },
    { label: 'Certificate: Data Science | Kshitij, IIT Kharagpur', url: 'achievements.html', icon: '📜', keywords: 'iit kharagpur kshitij data science certificate machine learning python' },
    { label: 'Go to Contact & Connect', url: 'contact.html', icon: '📬', keywords: 'contact email phone linkedin message ajaypayer connect get in touch' },
    { label: 'View Full Resume (PDF)', action: 'resume', icon: '📄', keywords: 'cv resume pdf download curriculum vitae' },
    { label: 'Toggle Light / Dark Theme', action: 'theme', icon: '🌓', keywords: 'theme dark light mode switch color toggle' }
  ];

  let currentList = [];
  let selectedIndex = 0;

  function openPalette() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    if (input) input.value = '';
    renderResults(commands);
    setTimeout(() => input?.focus(), 80);
    playSound('toggle');
  }

  function closePalette() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function renderResults(list) {
    if (!resultsContainer) return;
    currentList = list;
    selectedIndex = 0;

    if (list.length === 0) {
      resultsContainer.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.9rem;">No commands or pages matched your query</div>`;
      return;
    }

    resultsContainer.innerHTML = list.map((cmd, idx) => `
      <div class="palette-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}" role="button" tabindex="0">
        <div class="palette-item-left">
          <span style="font-size:1.15rem;">${cmd.icon}</span>
          <span>${cmd.label}</span>
        </div>
        <span class="shortcut-badge">↵ Select</span>
      </div>
    `).join('');

    resultsContainer.querySelectorAll('.palette-item').forEach((item, idx) => {
      item.addEventListener('click', () => {
        executeCommand(list[idx]);
        closePalette();
      });
      item.addEventListener('mouseenter', () => {
        updateSelection(idx);
      });
    });
  }

  function updateSelection(newIdx) {
    if (currentList.length === 0) return;
    selectedIndex = Math.max(0, Math.min(newIdx, currentList.length - 1));
    const items = resultsContainer.querySelectorAll('.palette-item');
    items.forEach((item, idx) => {
      item.classList.toggle('selected', idx === selectedIndex);
    });
    const selectedItem = items[selectedIndex];
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest' });
    }
  }

  function executeCommand(cmd) {
    if (!cmd) return;
    if (cmd.url) {
      window.location.href = cmd.url;
    } else if (cmd.section) {
      const target = document.getElementById(cmd.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        showToast(`Navigated to ${cmd.label}`, 'info');
      }
    } else if (cmd.action === 'resume') {
      window.open('assets/images/AJAY_RESUME_final.pdf', '_blank');
    } else if (cmd.action === 'theme') {
      document.getElementById('theme-toggle')?.click();
    } else if (cmd.action === 'hci') {
      document.querySelector('[data-open-hci]')?.click();
    }
  }

  triggerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openPalette();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePalette();
  });

  input?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      renderResults(commands);
      return;
    }
    const filtered = commands.filter(c => 
      c.label.toLowerCase().includes(q) || 
      (c.keywords && c.keywords.toLowerCase().includes(q))
    );
    renderResults(filtered);
  });

  // Keyboard navigation inside input (ArrowUp, ArrowDown, Enter)
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      updateSelection((selectedIndex + 1) % currentList.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      updateSelection((selectedIndex - 1 + currentList.length) % currentList.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentList[selectedIndex]) {
        executeCommand(currentList[selectedIndex]);
        closePalette();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    }
  });

  // Global keyboard shortcuts (Ctrl+K, Cmd+K, '/')
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (overlay.classList.contains('active')) closePalette();
      else openPalette();
    } else if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openPalette();
    } else if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closePalette();
    }
  });
}

/* ==========================================================================
   9. CONTACT FORM INTERACTIVITY & ERROR PREVENTION (HCI Heuristics 5 & 9)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit-btn');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateField(elem, condition, errorMsgId) {
    const errorElem = document.getElementById(errorMsgId);
    if (!condition) {
      elem.classList.add('error');
      if (errorElem) errorElem.style.display = 'block';
      return false;
    } else {
      elem.classList.remove('error');
      if (errorElem) errorElem.style.display = 'none';
      return true;
    }
  }

  nameInput?.addEventListener('input', () => {
    validateField(nameInput, nameInput.value.trim().length >= 2, 'name-error');
  });

  emailInput?.addEventListener('input', () => {
    validateField(emailInput, validateEmail(emailInput.value.trim()), 'email-error');
  });

  messageInput?.addEventListener('input', () => {
    validateField(messageInput, messageInput.value.trim().length >= 10, 'message-error');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2, 'name-error');
    const isEmailValid = validateField(emailInput, validateEmail(emailInput.value.trim()), 'email-error');
    const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10, 'message-error');

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      playSound('click');
      showToast('Please correct the highlighted fields before sending', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Transmitting Message...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Message Sent Successfully!</span>`;
      playSound('success');
      showToast('Thank you! Your message was delivered to Ajay.', 'success');
      form.reset();
      setTimeout(() => {
        submitBtn.innerHTML = `<span>Send Direct Message</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
      }, 4000);
    }, 1200);
  });
}

/* ==========================================================================
   10. INTERACTIVE SYSTEM USABILITY SCALE (SUS) EVALUATION LAB
   HCI Direct Feature: Evaluates the interface usability using John Brooke's SUS
   Formula: Odd items - 1, Even items: 5 - score. Sum * 2.5 = SUS (0-100)
   ========================================================================== */
function initHciSusCalculator() {
  const susInputs = document.querySelectorAll('.sus-radio');
  const scoreDisplay = document.getElementById('sus-live-score');
  const gradeDisplay = document.getElementById('sus-live-grade');
  const barDisplay = document.getElementById('sus-score-bar');

  function calculateSUS() {
    let oddSum = 0;
    let evenSum = 0;
    let answeredCount = 0;

    for (let i = 1; i <= 10; i++) {
      const checked = document.querySelector(`input[name="sus_q${i}"]:checked`);
      if (checked) {
        answeredCount++;
        const val = parseInt(checked.value);
        if (i % 2 === 1) {
          // Odd: val - 1
          oddSum += (val - 1);
        } else {
          // Even: 5 - val
          evenSum += (5 - val);
        }
      }
    }

    if (answeredCount === 0) return;

    // Scale score to 10 questions even if partially filled
    const rawTotal = (oddSum + evenSum) * (10 / answeredCount);
    const susScore = Math.round(rawTotal * 2.5);

    if (scoreDisplay) scoreDisplay.textContent = `${susScore} / 100`;
    if (barDisplay) barDisplay.style.width = `${susScore}%`;

    let grade = 'Acceptable (Grade B)';
    if (susScore >= 85) grade = 'Exceptional Usability (Grade A+)';
    else if (susScore >= 75) grade = 'High Usability (Grade A)';
    else if (susScore >= 68) grade = 'Standard Usability (Grade B - Above Average)';
    else if (susScore >= 50) grade = 'Marginal (Grade C)';
    else grade = 'Suboptimal (Grade D/F)';

    if (gradeDisplay) gradeDisplay.textContent = grade;
  }

  susInputs.forEach(input => {
    input.addEventListener('change', () => {
      calculateSUS();
      playSound('click');
    });
  });

  // Calculate default initial score
  calculateSUS();
}

/* ==========================================================================
   11. ONE-CLICK CLIPBOARD COPY (HCI Heuristic 7: Efficiency of Use)
   ========================================================================== */
function initCopyButtons() {
  document.querySelectorAll('[data-copy-text]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy-text');
      navigator.clipboard.writeText(text).then(() => {
        playSound('success');
        showToast(`Copied to clipboard: "${text}"`, 'success');
      }).catch(() => {
        showToast('Clipboard access denied', 'error');
      });
    });
  });
}

/* ==========================================================================
   12. TOAST NOTIFICATION UTILITY (HCI Heuristic 1: System Status)
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = `ℹ️`;
  if (type === 'success') icon = `✅`;
  if (type === 'error') icon = `⚠️`;

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
