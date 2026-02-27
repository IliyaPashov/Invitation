/* ============================================================
   Invitation Card — script.js
   ============================================================ */

// ── Music Control ──────────────────────────────────────────
var music = null;
var musicPlaying = false;

function initMusic() {
  music = document.getElementById('bgMusic');
  music.volume = 0.3; // Set to 30% volume for background ambiance
}

function toggleMusic() {
  if (!music) initMusic();
  
  var btn = document.getElementById('musicToggle');
  if (musicPlaying) {
    music.pause();
    btn.textContent = '🔇';
    musicPlaying = false;
  } else {
    music.play();
    btn.textContent = '🎵';
    musicPlaying = true;
  }
}

function startMusic() {
  if (!music) initMusic();
  music.play();
  musicPlaying = true;
  document.getElementById('musicToggle').textContent = '🎵';
}

// ── Random Love Notes ───────────────────────────────────────
var loveNotes = [
  "Всеки момент с теб е магия ✨",
  "Не мога да спра да се усмихвам, когато мисля за теб 😊",
  "Ти + аз = Завинаги 💍"
];

function showRandomLoveNote() {
  var noteEl = document.getElementById('loveNote');
  var randomNote = loveNotes[Math.floor(Math.random() * loveNotes.length)];
  
  noteEl.textContent = randomNote;
  noteEl.classList.add('show');
  
  setTimeout(function() {
    noteEl.classList.remove('show');
  }, 3500);
}

// ── Hidden Heart Secret Message ─────────────────────────────
var secretMessages = [
  {
    emoji: "💕",
    lines: [
      "Всеки момент с теб е магия...",
      "Ти не си просто моята любов,<br>ти си моят най-добър приятел, моето всичко.",
      "Нямам търпение нашето малко семейство да расте 👨‍👩‍👶",
      "Обичам те повече, отколкото думите могат да кажат 💖"
    ]
  },
  {
    emoji: "🌙",
    lines: [
      "Когато съм с теб, времето спира...",
      "Правиш ме по-добър човек всеки ден.",
      "Бъдещето ни заедно е всичко, за което мечтая 💭",
      "Завинаги не е достатъчно дълго с теб 💍"
    ]
  },
  {
    emoji: "✨",
    lines: [
      "Ти осветяваш най-тъмните ми дни...",
      "Влюбвам се в теб все повече с всеки миг.",
      "Заедно можем да победим всичко 💪",
      "Ти и аз? Това е моята любима история 📖💕"
    ]
  },
  {
    emoji: "🥰",
    lines: [
      "Сърцето ми те избра и беше право...",
      "Всеки ден с теб е ново приключение.",
      "Нашият малък Мартин ще има най-добрата майка 👶💖",
      "Благодаря ти, че си ти, любов моя ✨"
    ]
  },
  {
    emoji: "💖",
    lines: [
      "Домът е навсякъде, където съм с теб...",
           "Нашата любовна история е любимата ми ❤️",
      "Ти си моето днес и всички мои утре 🌅"
    ]
  }
];

var currentSecretIndex = 0;

function revealSecret() {
  var secretEl = document.getElementById('secretMessage');
  var contentEl = secretEl.querySelector('.secret-content');
  
  // Get current message
  var msg = secretMessages[currentSecretIndex];
  
  // Update content
  var html = '<span class="close-secret" onclick="closeSecret()">✕</span>';
  html += '<p>' + msg.emoji + '</p>';
  msg.lines.forEach(function(line) {
    html += '<p>' + line + '</p>';
  });
  
  contentEl.innerHTML = html;
  secretEl.classList.add('show');
  
  // Move to next message for next time
  currentSecretIndex = (currentSecretIndex + 1) % secretMessages.length;
}

function closeSecret() {
  document.getElementById('secretMessage').classList.remove('show');
}

// ── State ──────────────────────────────────────────────────
const answers = { name: '', day: null, venue: null, time: null };

// Track which day & venue are currently selected (before Next is pressed)
var selectedDay  = null;   // stores { num, label }
var selectedVenue = null;  // stores 'sweathouse' | 'marica' | 'happy'

// ── Utility: Shake animation ────────────────────────────────
function shake(el) {
  el.classList.remove('shake');
  void el.offsetWidth; // force reflow so animation re-triggers
  el.classList.add('shake');
  el.addEventListener('animationend', function () {
    el.classList.remove('shake');
  }, { once: true });
}

// ── Floating Hearts Background ──────────────────────────────
(function buildHearts() {
  var container   = document.getElementById('heartsBg');
  var heartEmojis = ['💕', '💗', '🌸', '💓', '🌷', '💖', '✨'];

  for (var i = 0; i < 18; i++) {
    var h = document.createElement('span');
    h.className   = 'heart-float';
    h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    h.style.left             = Math.random() * 100 + 'vw';
    h.style.fontSize         = (0.8 + Math.random() * 1.2) + 'rem';
    h.style.animationDuration= (8 + Math.random() * 12) + 's';
    h.style.animationDelay   = (-Math.random() * 12) + 's';
    container.appendChild(h);
  }
})();

// ── Build Mini 3-Day Calendar ───────────────────────────────
(function buildCalendar() {
  var grid = document.getElementById('days-grid');

  var days = [
    { num: 28, label: 'Съб', month: 'фев' },
    { num: 7, label: 'Съб', month: 'март' },
    { num: 8, label: 'Нед', month: 'март' },
  ];

  days.forEach(function (day) {
    var btn = document.createElement('button');
    btn.className = 'day-btn mini-day';
    var monthText = day.month ? '<span class="day-month">' + day.month + '</span>' : '';
    btn.innerHTML =
      '<span class="day-num">' + day.num + '</span>' +
      monthText +
      '<span class="day-label">' + day.label + '</span>';

    btn.addEventListener('click', function () {
      // Just highlight the selection — no error shown yet
      document.querySelectorAll('.day-btn').forEach(function (b) {
        b.classList.remove('selected');
      });
      btn.classList.add('selected');
      selectedDay = day;

      // Hide any previous error when they change selection
      document.getElementById('day-error').style.display = 'none';
    });

    grid.appendChild(btn);
  });
})();

// ── Q1 — Next button handler ────────────────────────────────
// Called from onclick="tryNextFromQ1()" in HTML
window.tryNextFromQ1 = function () {
  var errorBox = document.getElementById('day-error');

  // Nothing picked yet
  if (!selectedDay) {
    errorBox.textContent = '👆 Моля, избери ден първо!';
    errorBox.style.display = 'block';
    shake(document.getElementById('days-grid'));
    return;
  }

  // Wrong day picked
  if (selectedDay.num !== 8) {
    var wrongMessages = {
      28: "⏰ Твърде рано, скъпа! пробвай с 8-ми март! 😂",
      7: "😬 Не! Този ден съм зает… със скръбта, че не избра 8-ми март 💔",
    };
    errorBox.textContent = wrongMessages[selectedDay.num];
    errorBox.style.display = 'block';

    // Shake the selected (wrong) button
    var selected = document.querySelector('.day-btn.selected');
    if (selected) shake(selected);
    return;
  }

  // Correct!
  errorBox.className = 'field-error field-success';
  errorBox.textContent = 'Перфектно! 8-ми март значи — отбележи си в календара! 💕';
  errorBox.style.display = 'block';
  answers.day = 'Март 8 (Неделя) 💖';
  
  setTimeout(function () {
    errorBox.style.display = 'none';
    goTo('screen-q2');
  }, 4000);
};

// ── Name Screen — validate only on button click ─────────────
(function setupNameScreen() {
  var firstInput = document.getElementById('input-first');
  var lastInput  = document.getElementById('input-last');
  var lastError  = document.getElementById('last-name-error');

  var CORRECT_LAST = 'пашова';
  var funnyErrors = [
    "🚨 Не! Само една фамилия отключва тази покана…",
    "😅 Подсказка: завършва на -ова 💁‍♀️ Опитай пак!",
    "🕵️ Системата засече самозванец. КОЯ СИ ТИ?!",
    "❌ Грешка 404: Фамилията не е намерена в нашата база от сърца",
    "😂 Не познаваме никого с това име. ПОДОЗРИТЕЛНО.",
  ];
  var errorIndex = 0;

  // Clear error while typing — no mid-word red alerts
  lastInput.addEventListener('input', function () {
    lastError.style.display = 'none';
    lastInput.classList.remove('input-error');
  });

  firstInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') lastInput.focus();
  });
  lastInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') tryNextFromName();
  });

  window.tryNextFromName = function () {
    var first  = firstInput.value.trim();
    var last   = lastInput.value.trim();
    var lastOk = last.toLowerCase() === CORRECT_LAST;

    if (!first || !last) {
      shake(lastInput);
      return;
    }

    if (!lastOk) {
      lastError.textContent = funnyErrors[errorIndex % funnyErrors.length];
      lastError.style.display = 'block';
      lastInput.classList.add('input-error');
      shake(lastInput);
      errorIndex++;
      return;
    }

    answers.name = first + ' ' + last;
    goTo('screen-secret');
  };
})();

// ── Secret Question Screen ──────────────────────────────────
(function setupSecretScreen() {
  var bossInput = document.getElementById('input-boss');
  var bossError = document.getElementById('boss-error');

  var CORRECT_BOSS = 'мартин';
  var funnyBossErrors = [
    "🤔 Хмм… това не ми звучи познато. Мисли по-добре!",
    "❌ Не! Легендата гласи, че името започва с М… 👀",
    "😅 Близо? Не. Дори малко. Опитай пак!",
    "🔐 Достъпът отказан! Шефът не е съгласен с този отговор.",
    "🧐 Сигурна ли си? Твоят бъдещ шеф е МНОГО специфичен за името си.",
  ];
  var errorIndex = 0;

  bossInput.addEventListener('input', function () {
    bossError.style.display = 'none';
    bossInput.classList.remove('input-error');
  });
  bossInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') tryNextFromSecret();
  });

  window.tryNextFromSecret = function () {
    var val = bossInput.value.trim();

    if (!val) { shake(bossInput); return; }

    if (val.toLowerCase() !== CORRECT_BOSS) {
      bossError.textContent = funnyBossErrors[errorIndex % funnyBossErrors.length];
      bossError.style.display = 'block';
      bossInput.classList.add('input-error');
      shake(bossInput);
      errorIndex++;
      return;
    }

    // Show success message
    bossError.className = 'field-error field-success';
    bossError.textContent = '✨ Перфектно! Познаваш добре бъдещия шеф! 🥰';
    bossError.style.display = 'block';
    bossInput.classList.remove('input-error');

    setTimeout(function () {
      goTo('screen-q1');
    }, 4000);
  };
})();

// ── Q2 — Time Selection with Dodging Morning Button ────────
(function setupDodgingButton() {
  var morningBtn = document.getElementById('morning-btn');
  var timeOptions = document.getElementById('time-options');
  
  morningBtn.addEventListener('mouseenter', function (e) {
    var optionsRect = timeOptions.getBoundingClientRect();
    var btnRect = morningBtn.getBoundingClientRect();
    
    // Calculate safe random position within the options container
    var maxX = optionsRect.width - btnRect.width - 20;
    var maxY = optionsRect.height - btnRect.height - 20;
    
    var newX = Math.random() * maxX;
    var newY = Math.random() * maxY;
    
    morningBtn.style.position = 'absolute';
    morningBtn.style.left = newX + 'px';
    morningBtn.style.top = newY + 'px';
    morningBtn.style.transition = 'all 0.3s ease';
  });
  
  // Prevent clicking the morning button
  morningBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });
})();

function selectTime(btn, val) {
  answers.time = val;
  btn.classList.add('selected');
  
  // Show success message
  var msgBox = document.createElement('div');
  msgBox.className = 'venue-message venue-correct';
  msgBox.textContent = '🌙 Вечер значи! Перфектното време за романтика ✨';
  msgBox.style.marginTop = '14px';
  document.getElementById('time-options').parentElement.appendChild(msgBox);
  
  // Auto-advance after short delay when evening is selected
  setTimeout(function () {
    goTo('screen-q3');
  }, 4000);
}

// ── Q3 — Venue Selection (was Q2) ───────────────────────────
function selectVenue(btn, val) {
  document.querySelectorAll('#venue-options .option-btn').forEach(function (b) {
    b.classList.remove('selected', 'wrong-venue');
  });
  btn.classList.add('selected');
  selectedVenue = val;

  // Hide any previous message when they change mind
  var msgBox = document.getElementById('venue-msg');
  msgBox.style.display = 'none';
}

// ── Q3 — Next button handler (was Q2) ───────────────────────
window.tryNextFromQ3 = function () {
  var msgBox  = document.getElementById('venue-msg');
  var nextBtn = document.getElementById('next-q3');

  // Nothing selected
  if (!selectedVenue) {
    msgBox.className  = 'venue-message venue-wrong';
    msgBox.textContent = '👆 Моля, избери място първо!';
    msgBox.style.display = 'block';
    shake(document.getElementById('venue-options'));
    return;
  }

  // Wrong venue
  if (selectedVenue !== 'special') {
    var wrongBtn = document.querySelector('#venue-options .option-btn.selected');
    if (wrongBtn) {
      wrongBtn.classList.add('wrong-venue');
      shake(wrongBtn);
    }

    var msg = '';
    if (selectedVenue === 'sweathouse') {
      msg = "🍬 Сладкарница Нико?! Не си ли яла достатъчно сладко засега, мила?? Хайде, малко по-солено! 😂";
    } else if (selectedVenue === 'happy') {
      msg = "🍺 Пак ли Happy Bar?! Нека бъдем малко по-оригинални този път, а? Заслужаваш по-добро! 😄";
    } else if (selectedVenue === 'marica') {
      msg = "🍽️ Малката Марица е хубаво място, но има още по-специално нещо, което планирах за теб! 💕";
    }

    msgBox.className  = 'venue-message venue-wrong';
    msgBox.textContent = msg;
    msgBox.style.display = 'block';
    return;
  }

  // Correct — show message then auto-advance after 4s
  answers.venue = 'special';
  msgBox.className  = 'venue-message venue-correct';
  msgBox.textContent = "😍 Знаех си! Нищо не може да се сравни с вечеря, приготвена само за теб! 👨‍🍳💕";
  msgBox.style.display = 'block';

    setTimeout(function () {
    goTo('screen-q4');
    nextBtn.textContent = 'Напред →';
    nextBtn.classList.add('enabled');
  }, 4000);
};

// ── Q4 — Boss Invite Selection ─────────────────────────────
var selectedBossInvite = null;

function selectBossInvite(btn, val) {
  document.querySelectorAll('#boss-invite-options .option-btn').forEach(function (b) {
    b.classList.remove('selected', 'wrong-venue');
  });
  btn.classList.add('selected');
  selectedBossInvite = val;

  var msgBox = document.getElementById('boss-invite-msg');
  msgBox.style.display = 'none';
}

// ── Q4 — Next button handler ───────────────────────────────
window.tryNextFromQ4 = function () {
  var msgBox  = document.getElementById('boss-invite-msg');
  var nextBtn = document.getElementById('next-q4');

  // Nothing selected
  if (!selectedBossInvite) {
    msgBox.className  = 'venue-message venue-wrong';
    msgBox.textContent = '👆 Моля, направи избор първо!';
    msgBox.style.display = 'block';
    shake(document.getElementById('boss-invite-options'));
    return;
  }

  // Wrong answer (said no)
  if (selectedBossInvite !== 'yes') {
    var wrongBtn = document.querySelector('#boss-invite-options .option-btn.selected');
    if (wrongBtn) {
      wrongBtn.classList.add('wrong-venue');
      shake(wrongBtn);
    }

    msgBox.className  = 'venue-message venue-wrong';
    msgBox.textContent = "О, не! Не можеш да оставиш Мартин настрана! Нашият малък шеф трябва да дойде също! 😱💔";
    msgBox.style.display = 'block';
    return;
  }

  // Correct!
  answers.bossInvite = 'yes';
  msgBox.className  = 'venue-message venue-correct';
  msgBox.textContent = "🥰 Перфектно! Нашият малък Мартин ще бъде толкова щастлив! Добре дошли на семейната среща! 👨‍👩‍👶💕";
  msgBox.style.display = 'block';

   setTimeout(function () {
    showFinal();
    nextBtn.textContent = "Да тръгваме! 🎉";
    nextBtn.classList.add('enabled');
  }, 4000);
};

// ── Screen Navigation ───────────────────────────────────────
function goTo(id) {
  if (id === 'screen-q1') {
    var first = answers.name.split(' ')[0];
    document.getElementById('greeting-name').textContent = first + ',';
  }

  // Show random love note sometimes when transitioning (40% chance, not from home)
  var currentScreen = document.querySelector('.screen.active');
  if (currentScreen && currentScreen.id !== 'screen-home' && Math.random() < 0.4) {
    showRandomLoveNote();
  }

  document.querySelectorAll('.screen').forEach(function (s) {
    s.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
  document.querySelector('.card').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── Final Screen ────────────────────────────────────────────
function showFinal() {
  var venueMap = { 
    'marica': '🍽️ Малката Марица',
    'sweathouse': '🍰 Сладкарница Нико',
    'happy': '🍻 Happy Bar & Dinner',
    'special': '👨‍🍳 Специална вечеря приготвена от твоя любим'
  };
  var timeMap  = { 'morning': '🌅 Сутрин', 'evening': '🌙 Вечер' };

  document.getElementById('sum-name').textContent  = answers.name;
  document.getElementById('sum-day').textContent   = answers.day   || '—';
  document.getElementById('sum-venue').textContent = venueMap[answers.venue] || '—';
  document.getElementById('sum-time').textContent  = timeMap[answers.time]   || '—';

  goTo('screen-final');
  launchConfetti();
}

// ── Confetti ────────────────────────────────────────────────
function launchConfetti() {
  var canvas = document.getElementById('confetti-canvas');
  var ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  var colors = ['#f4a7b9', '#e8829a', '#fde8ee', '#ff6b8a', '#ffffff', '#ffb3c6'];
  var pieces = Array.from({ length: 120 }, function () {
    return {
      x:         Math.random() * canvas.width,
      y:         -10 - Math.random() * 200,
      r:         3 + Math.random() * 5,
      color:     colors[Math.floor(Math.random() * colors.length)],
      vy:        2 + Math.random() * 4,
      vx:        -1.5 + Math.random() * 3,
      spin:      Math.random() * Math.PI * 2,
      spinSpeed: -0.1 + Math.random() * 0.2,
    };
  });

  var frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(function (p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
      p.x    += p.vx;
      p.y    += p.vy;
      p.spin += p.spinSpeed;
      p.vy   += 0.05;
    });
    frame++;
    if (frame < 220) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  draw();
}
