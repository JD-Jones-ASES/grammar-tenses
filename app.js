(function () {
  const SETTINGS_KEY = "tense-atlas-settings";
  const THEME_KEY = "tense-atlas-theme";
  const RECORDS_KEY = "tense-atlas-records";
  const game = window.TenseAtlas;

  const els = {
    views: {
      home: document.getElementById("view-home"),
      lexicon: document.getElementById("view-lexicon"),
      setup: document.getElementById("view-setup"),
      play: document.getElementById("view-play"),
      summary: document.getElementById("view-summary"),
    },
    themeBtn: document.getElementById("theme-btn"),
    themeLabel: document.getElementById("theme-label"),
    homeAtlas: document.getElementById("home-atlas"),
    studyCard: document.getElementById("study-card"),
    pathGrid: document.getElementById("path-grid"),
    records: document.getElementById("records"),
    lexSearch: document.getElementById("lex-search"),
    lexSubject: document.getElementById("lex-subject"),
    lexRandom: document.getElementById("lex-random"),
    lexLetters: document.getElementById("lex-letters"),
    lexChips: document.getElementById("lex-chips"),
    lexAtlas: document.getElementById("lex-atlas"),
    lexNote: document.getElementById("lex-note"),
    lexiconBack: document.getElementById("lexicon-back"),
    setupBack: document.getElementById("setup-back"),
    modeGrid: document.getElementById("mode-grid"),
    scopeGrid: document.getElementById("scope-grid"),
    countGrid: document.getElementById("count-grid"),
    scopeBlock: document.getElementById("scope-block"),
    countBlock: document.getElementById("count-block"),
    startBtn: document.getElementById("start-btn"),
    statProgress: document.getElementById("stat-progress"),
    statCorrect: document.getElementById("stat-correct"),
    statStreak: document.getElementById("stat-streak"),
    statAccuracy: document.getElementById("stat-accuracy"),
    leaveBtn: document.getElementById("leave-btn"),
    playKicker: document.getElementById("play-kicker"),
    playPrompt: document.getElementById("play-prompt"),
    playSentence: document.getElementById("play-sentence"),
    playBlank: document.getElementById("play-blank"),
    playPattern: document.getElementById("play-pattern"),
    playAtlas: document.getElementById("play-atlas"),
    playOptions: document.getElementById("play-options"),
    answerForm: document.getElementById("answer-form"),
    answerInput: document.getElementById("answer-input"),
    playFeedback: document.getElementById("play-feedback"),
    playNextRow: document.getElementById("play-next-row"),
    nextBtn: document.getElementById("next-btn"),
    summaryGrid: document.getElementById("summary-grid"),
    review: document.getElementById("review"),
    againBtn: document.getElementById("again-btn"),
    menuBtn: document.getElementById("menu-btn"),
    leave: document.getElementById("leave"),
    leaveCancel: document.getElementById("leave-cancel"),
    leaveConfirm: document.getElementById("leave-confirm"),
    live: document.getElementById("live"),
  };

  const PATHS = [
    { id: "lexicon", label: "Lexicon", blurb: "One verb, twelve cells, any subject." },
    { id: "practice", label: "Practice", blurb: "Name, match, write, or tell two cells apart." },
    { id: "daily", label: "Daily atlas", blurb: "Today’s twelve. Same sequence on every machine." },
  ];

  const COUNT_LABELS = {
    8: { label: "Eight", blurb: "A short crossing." },
    12: { label: "Twelve", blurb: "One for each cell, if you stay in all waters." },
    20: { label: "Twenty", blurb: "A longer watch." },
    0: { label: "Open sea", blurb: "Until you leave." },
  };

  const state = {
    view: "home",
    theme: "parchment",
    config: game.normalizeConfig(null),
    studyId: "simple-present",
    lexQuery: "",
    lexLetter: "",
    lexLemma: "write",
    lexSubject: "maya",
    atlasFocus: "simple-present",
    session: null,
  };

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      /* ignore quota */
    }
  }

  function loadSettings() {
    const saved = loadJson(SETTINGS_KEY, {});
    state.config = game.normalizeConfig(saved);
    const theme = localStorage.getItem(THEME_KEY);
    state.theme = theme === "ink" || theme === "parchment" ? theme : "parchment";
    state.config.theme = state.theme;
  }

  function saveSettings() {
    saveJson(SETTINGS_KEY, {
      mode: state.config.mode,
      scope: state.config.scope,
      count: state.config.count,
    });
    try {
      localStorage.setItem(THEME_KEY, state.theme);
    } catch (err) {
      /* ignore */
    }
  }

  function records() {
    const data = loadJson(RECORDS_KEY, { daily: {}, bestStreak: 0 });
    data.daily = data.daily || {};
    data.bestStreak = data.bestStreak || 0;
    return data;
  }

  function saveRecords(data) {
    saveJson(RECORDS_KEY, data);
  }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    els.themeLabel.textContent = state.theme === "ink" ? "Ink" : "Parchment";
    els.themeBtn.setAttribute("aria-pressed", state.theme === "ink" ? "true" : "false");
  }

  function toggleTheme() {
    state.theme = state.theme === "ink" ? "parchment" : "ink";
    state.config.theme = state.theme;
    applyTheme();
    saveSettings();
  }

  function announce(text) {
    els.live.textContent = text;
  }

  function showView(name) {
    state.view = name;
    Object.entries(els.views).forEach(function (entry) {
      const active = entry[0] === name;
      entry[1].hidden = !active;
      entry[1].classList.toggle("is-active", active);
    });
    if (name === "lexicon") els.lexSearch.focus();
  }

  function renderAtlas(root, options) {
    const opts = options || {};
    const sample = opts.card || game.lexiconCard(opts.lemma || "write", opts.subject || "i");
    const selected = opts.selected || null;
    const marked = opts.marked || {};
    const interactive = opts.interactive !== false;
    const table = document.createElement("table");
    table.className = "atlas" + (opts.compact ? " compact" : "");
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.appendChild(document.createElement("th"));
    game.TIMES.forEach(function (time) {
      const th = document.createElement("th");
      th.textContent = time;
      headRow.appendChild(th);
    });
    head.appendChild(headRow);
    table.appendChild(head);
    const body = document.createElement("tbody");
    game.atlasRows().forEach(function (row, rowIndex) {
      const tr = document.createElement("tr");
      const label = document.createElement("th");
      label.className = "row-label";
      label.scope = "row";
      label.textContent = row.label;
      tr.appendChild(label);
      row.cells.forEach(function (tense, colIndex) {
        const td = document.createElement("td");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cell";
        btn.dataset.tense = tense.id;
        btn.dataset.time = tense.time;
        btn.dataset.row = String(rowIndex);
        btn.dataset.col = String(colIndex);
        if (!interactive) btn.tabIndex = -1;
        if (selected === tense.id) {
          btn.classList.add("is-selected");
          btn.setAttribute("aria-pressed", "true");
        }
        if (marked[tense.id] === "correct") btn.classList.add("is-correct");
        if (marked[tense.id] === "wrong") btn.classList.add("is-wrong");
        const cell = sample && sample.cells.find(function (item) {
          return item.tense.id === tense.id;
        });
        if (cell && cell.unusual) btn.classList.add("is-unusual");
        const title = document.createElement("span");
        title.className = "cell-label";
        title.textContent = tense.label;
        const phrase = document.createElement("span");
        phrase.className = "cell-phrase";
        phrase.textContent = cell ? cell.phrase : tense.short;
        btn.appendChild(title);
        btn.appendChild(phrase);
        if (interactive && opts.onPick) {
          btn.addEventListener("click", function () {
            opts.onPick(tense.id);
          });
        }
        td.appendChild(btn);
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
    table.appendChild(body);
    root.replaceChildren(table);
  }

  function renderStudy() {
    const tense = game.tenseById(state.studyId);
    if (!tense) {
      els.studyCard.hidden = true;
      return;
    }
    const card = game.exampleCard(tense.id, "write", "maya");
    els.studyCard.hidden = false;
    els.studyCard.replaceChildren();
    const title = document.createElement("h3");
    title.textContent = tense.label;
    const pattern = document.createElement("p");
    pattern.className = "pattern-line";
    pattern.textContent = tense.pattern + " · " + card.phrase;
    const uses = document.createElement("ul");
    tense.uses.forEach(function (use) {
      const li = document.createElement("li");
      li.textContent = use;
      uses.appendChild(li);
    });
    const signals = document.createElement("ul");
    signals.className = "signals";
    tense.signals.forEach(function (word) {
      const li = document.createElement("li");
      li.textContent = word;
      signals.appendChild(li);
    });
    const example = document.createElement("p");
    example.className = "sentence";
    example.textContent = card.sentence;
    const contrast = document.createElement("p");
    contrast.className = "copy quiet";
    contrast.textContent = tense.contrast;
    els.studyCard.append(title, pattern, uses, signals, example, contrast);
  }

  function renderChoices(root, items, selected, onPick) {
    root.replaceChildren();
    items.forEach(function (item) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.setAttribute("aria-pressed", item.id === selected ? "true" : "false");
      const label = document.createElement("span");
      label.className = "choice-label";
      label.textContent = item.label;
      const blurb = document.createElement("span");
      blurb.className = "choice-blurb";
      blurb.textContent = item.blurb;
      btn.append(label, blurb);
      btn.addEventListener("click", function () {
        onPick(item.id);
      });
      root.appendChild(btn);
    });
  }

  function renderHome() {
    renderAtlas(els.homeAtlas, {
      lemma: "write",
      subject: "i",
      selected: state.studyId,
      onPick: function (id) {
        state.studyId = id;
        state.atlasFocus = id;
        renderHome();
        announce(game.tenseById(id).label);
      },
    });
    renderStudy();
    renderChoices(els.pathGrid, PATHS, null, function (id) {
      if (id === "lexicon") {
        renderLexicon();
        showView("lexicon");
      } else if (id === "daily") {
        state.config.mode = "daily";
        startSession();
      } else {
        renderSetup();
        showView("setup");
      }
    });
    const data = records();
    const today = game.dailyId(new Date());
    const daily = data.daily[today];
    els.records.replaceChildren();
    const items = [
      ["Best streak", String(data.bestStreak || 0)],
      ["Today’s daily", daily ? daily.correct + " / " + daily.total : "Not yet sailed"],
    ];
    items.forEach(function (pair) {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = pair[0];
      const strong = document.createElement("strong");
      strong.textContent = pair[1];
      li.append(span, strong);
      els.records.appendChild(li);
    });
  }

  function renderLexicon() {
    if (!els.lexSubject.options.length) {
      game.SUBJECTS.forEach(function (subject) {
        const opt = document.createElement("option");
        opt.value = subject.id;
        opt.textContent = subject.label;
        els.lexSubject.appendChild(opt);
      });
    }
    els.lexSubject.value = state.lexSubject;
    els.lexSearch.value = state.lexQuery;
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    els.lexLetters.replaceChildren();
    letters.forEach(function (letter) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "letter";
      btn.textContent = letter;
      btn.setAttribute("aria-pressed", state.lexLetter === letter ? "true" : "false");
      btn.addEventListener("click", function () {
        state.lexLetter = state.lexLetter === letter ? "" : letter;
        state.lexQuery = "";
        els.lexSearch.value = "";
        const first = game.listVerbs(state.lexLetter)[0];
        if (first) state.lexLemma = first.lemma;
        renderLexicon();
      });
      els.lexLetters.appendChild(btn);
    });
    const query = state.lexQuery || state.lexLetter;
    const matches = game.listVerbs(query).slice(0, 24);
    if (!matches.some(function (verb) { return verb.lemma === state.lexLemma; }) && matches[0]) {
      state.lexLemma = matches[0].lemma;
    }
    els.lexChips.replaceChildren();
    matches.forEach(function (verb) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = verb.lemma;
      btn.setAttribute("aria-pressed", verb.lemma === state.lexLemma ? "true" : "false");
      btn.addEventListener("click", function () {
        state.lexLemma = verb.lemma;
        renderLexicon();
      });
      els.lexChips.appendChild(btn);
    });
    const card = game.lexiconCard(state.lexLemma, state.lexSubject);
    renderAtlas(els.lexAtlas, {
      card: card,
      selected: null,
      interactive: false,
    });
    if (card && card.verb.stative) {
      els.lexNote.hidden = false;
      els.lexNote.textContent = card.verb.lemma + " is stative. Continuous cells are grammatical but uncommon in natural English.";
    } else {
      els.lexNote.hidden = true;
    }
  }

  function renderSetup() {
    const modes = Object.values(game.MODES).filter(function (mode) {
      return mode.id !== "daily";
    });
    renderChoices(els.modeGrid, modes, state.config.mode, function (id) {
      state.config.mode = id;
      saveSettings();
      renderSetup();
    });
    renderChoices(els.scopeGrid, Object.values(game.SCOPES), state.config.scope, function (id) {
      state.config.scope = id;
      saveSettings();
      renderSetup();
    });
    const counts = game.COUNTS.map(function (count) {
      return Object.assign({ id: count }, COUNT_LABELS[count]);
    });
    renderChoices(els.countGrid, counts, state.config.count, function (id) {
      state.config.count = id;
      saveSettings();
      renderSetup();
    });
  }

  function startSession() {
    const cfg = game.normalizeConfig(state.config);
    const rng = cfg.mode === "daily" ? game.rngForDaily(new Date()) : game.createRng(Date.now());
    const queue = cfg.mode === "daily"
      ? game.generateDaily(new Date())
      : cfg.count === 0
        ? []
        : game.generateSession(cfg, rng);
    state.session = {
      config: cfg,
      rng: rng,
      queue: queue,
      index: 0,
      stats: game.emptyStats(),
      review: [],
      question: null,
      resolved: false,
      marked: {},
    };
    showView("play");
    showQuestion();
  }

  function currentQuestion() {
    const session = state.session;
    if (!session) return null;
    if (session.queue.length) return session.queue[session.index];
    if (!session.question) session.question = game.generateQuestion(session.config, session.rng);
    return session.question;
  }

  function progressLabel() {
    const session = state.session;
    if (session.config.count === 0 && session.config.mode !== "daily") {
      return String(session.stats.total + (session.resolved ? 0 : 1));
    }
    const total = session.queue.length || session.config.count || 12;
    return (session.index + 1) + " / " + total;
  }

  function updatePlayStats() {
    const stats = state.session.stats;
    els.statProgress.textContent = progressLabel();
    els.statCorrect.textContent = String(stats.correct);
    els.statStreak.textContent = String(stats.streak);
    els.statAccuracy.textContent = stats.total ? game.accuracy(stats) + "%" : "—";
  }

  function showQuestion() {
    const question = currentQuestion();
    state.session.resolved = false;
    state.session.marked = {};
    state.atlasFocus = question.tenseId;
    els.playKicker.textContent = game.MODES[question.type === "name" ? "name" : question.type].label;
    els.playPrompt.textContent = question.prompt;
    els.playFeedback.hidden = true;
    els.playNextRow.hidden = true;
    els.playSentence.hidden = true;
    els.playBlank.hidden = true;
    els.playPattern.hidden = true;
    els.playAtlas.hidden = true;
    els.playOptions.hidden = true;
    els.answerForm.hidden = true;
    els.answerInput.value = "";
    els.answerInput.disabled = false;

    if (question.sentence) {
      els.playSentence.hidden = false;
      els.playSentence.textContent = question.sentence;
    }
    if (question.blank) {
      els.playBlank.hidden = false;
      els.playBlank.textContent = question.blank;
      els.playPattern.hidden = false;
      els.playPattern.textContent = question.hint + " · " + question.pattern;
    }
    if (question.input === "grid") {
      els.playAtlas.hidden = false;
      renderPlayAtlas();
    } else if (question.input === "text") {
      els.answerForm.hidden = false;
      els.answerInput.focus();
    } else {
      els.playOptions.hidden = false;
      renderOptions();
    }
    updatePlayStats();
    announce(question.prompt);
  }

  function renderPlayAtlas() {
    const question = currentQuestion();
    renderAtlas(els.playAtlas, {
      lemma: question.verb,
      subject: question.subject,
      selected: state.session.resolved ? question.tenseId : state.atlasFocus,
      marked: state.session.marked,
      compact: true,
      interactive: !state.session.resolved,
      onPick: function (id) {
        if (state.session.resolved) return;
        resolve(id);
      },
    });
  }

  function renderOptions() {
    const question = currentQuestion();
    els.playOptions.replaceChildren();
    question.options.forEach(function (option, index) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.dataset.answer = option;
      btn.textContent = (index + 1) + ".  " + option;
      if (state.session.resolved) {
        if (option === question.answer) btn.classList.add("is-correct");
        if (state.session.chosen === option && option !== question.answer) btn.classList.add("is-wrong");
        btn.disabled = true;
      } else {
        btn.addEventListener("click", function () {
          resolve(option);
        });
      }
      els.playOptions.appendChild(btn);
    });
  }

  function resolve(input) {
    const session = state.session;
    if (!session || session.resolved) return;
    const question = currentQuestion();
    const result = question.type === "write"
      ? game.checkAnswer(question, input)
      : { correct: String(input) === String(question.answer), empty: !String(input || "").trim() };
    if (result.empty) {
      announce("Enter an answer first.");
      return;
    }
    session.resolved = true;
    session.chosen = input;
    session.stats = game.applyResult(session.stats, question.tenseId, result.correct);
    session.review.push({
      prompt: question.sentence || question.blank || question.prompt,
      answer: question.type === "write" ? question.answer : (game.tenseById(question.tenseId) || {}).label || question.answer,
      correct: result.correct,
    });
    if (question.input === "grid") {
      session.marked[input] = result.correct ? "correct" : "wrong";
      session.marked[question.answer] = "correct";
      renderPlayAtlas();
    } else if (question.input === "choices") {
      renderOptions();
    } else {
      els.answerInput.disabled = true;
    }
    els.playFeedback.hidden = false;
    els.playFeedback.className = "feedback " + (result.correct ? "is-ok" : "is-bad");
    const tense = game.tenseById(question.tenseId);
    const verb = game.getVerb(question.verb);
    const subject = game.subjectById(question.subject);
    const sentence = game.sentenceFor(verb, question.tenseId, subject);
    els.playFeedback.textContent = result.correct
      ? "True heading. " + tense.label + "."
      : "Off course. " + tense.label + " — " + sentence;
    els.playNextRow.hidden = false;
    els.nextBtn.focus();
    updatePlayStats();
    announce(els.playFeedback.textContent);
  }

  function nextQuestion() {
    const session = state.session;
    if (!session.resolved) return;
    const finite = session.queue.length > 0;
    if (finite && session.index >= session.queue.length - 1) {
      endSession();
      return;
    }
    if (finite) session.index += 1;
    else session.question = null;
    showQuestion();
  }

  function endSession() {
    const session = state.session;
    if (!session) {
      showView("home");
      renderHome();
      return;
    }
    const data = records();
    data.bestStreak = Math.max(data.bestStreak || 0, session.stats.bestStreak);
    if (session.config.mode === "daily" && session.stats.total) {
      data.daily[game.dailyId(new Date())] = {
        correct: session.stats.correct,
        total: session.stats.total,
      };
    }
    saveRecords(data);
    els.summaryGrid.replaceChildren();
    [
      ["Correct", session.stats.correct + " / " + session.stats.total],
      ["Accuracy", session.stats.total ? game.accuracy(session.stats) + "%" : "—"],
      ["Best streak", String(session.stats.bestStreak)],
    ].forEach(function (pair) {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = pair[0];
      const strong = document.createElement("strong");
      strong.textContent = pair[1];
      li.append(span, strong);
      els.summaryGrid.appendChild(li);
    });
    els.review.replaceChildren();
    session.review.slice(-12).forEach(function (item) {
      const div = document.createElement("div");
      div.className = "review-item";
      const strong = document.createElement("strong");
      strong.textContent = (item.correct ? "Correct" : "Miss") + " · " + item.answer;
      const p = document.createElement("p");
      p.textContent = item.prompt;
      div.append(strong, p);
      els.review.appendChild(div);
    });
    showView("summary");
  }

  function moveAtlas(dRow, dCol) {
    const rows = game.atlasRows();
    let row = 0;
    let col = 0;
    rows.forEach(function (item, r) {
      item.cells.forEach(function (cell, c) {
        if (cell.id === state.atlasFocus) {
          row = r;
          col = c;
        }
      });
    });
    row = Math.max(0, Math.min(3, row + dRow));
    col = Math.max(0, Math.min(2, col + dCol));
    state.atlasFocus = rows[row].cells[col].id;
    if (state.view === "home") {
      state.studyId = state.atlasFocus;
      renderHome();
    } else if (state.view === "play" && currentQuestion() && currentQuestion().input === "grid" && !state.session.resolved) {
      renderPlayAtlas();
      const focused = els.playAtlas.querySelector('[data-tense="' + state.atlasFocus + '"]');
      if (focused) focused.focus();
    }
  }

  function onKey(event) {
    if (event.key === "Escape") {
      if (!els.leave.hidden) {
        els.leave.hidden = true;
        return;
      }
      if (state.view === "play") {
        els.leave.hidden = false;
        els.leaveConfirm.focus();
      } else if (state.view !== "home") {
        showView("home");
        renderHome();
      }
      return;
    }
    if (state.view === "play" && state.session) {
      const question = currentQuestion();
      if (!state.session.resolved && question && question.input === "choices" && /^[1-4]$/.test(event.key)) {
        const option = question.options[Number(event.key) - 1];
        if (option) resolve(option);
        return;
      }
      if (!state.session.resolved && question && question.input === "grid") {
        if (event.key === "ArrowUp") { event.preventDefault(); moveAtlas(-1, 0); }
        if (event.key === "ArrowDown") { event.preventDefault(); moveAtlas(1, 0); }
        if (event.key === "ArrowLeft") { event.preventDefault(); moveAtlas(0, -1); }
        if (event.key === "ArrowRight") { event.preventDefault(); moveAtlas(0, 1); }
        if (event.key === "Enter" && document.activeElement !== els.answerInput) {
          event.preventDefault();
          resolve(state.atlasFocus);
        }
      }
      if (state.session.resolved && event.key === "Enter" && document.activeElement !== els.answerInput) {
        event.preventDefault();
        nextQuestion();
      }
    }
    if (state.view === "home") {
      if (event.key === "ArrowUp") { event.preventDefault(); moveAtlas(-1, 0); }
      if (event.key === "ArrowDown") { event.preventDefault(); moveAtlas(1, 0); }
      if (event.key === "ArrowLeft") { event.preventDefault(); moveAtlas(0, -1); }
      if (event.key === "ArrowRight") { event.preventDefault(); moveAtlas(0, 1); }
    }
    if (event.key === "/" && state.view === "home" && document.activeElement.tagName !== "INPUT") {
      event.preventDefault();
      renderLexicon();
      showView("lexicon");
    }
  }

  function bind() {
    els.themeBtn.addEventListener("click", toggleTheme);
    els.lexiconBack.addEventListener("click", function () {
      showView("home");
      renderHome();
    });
    els.setupBack.addEventListener("click", function () {
      showView("home");
      renderHome();
    });
    els.lexSearch.addEventListener("input", function (event) {
      state.lexQuery = event.target.value;
      state.lexLetter = "";
      renderLexicon();
    });
    els.lexSubject.addEventListener("change", function (event) {
      state.lexSubject = event.target.value;
      renderLexicon();
    });
    els.lexRandom.addEventListener("click", function () {
      const rng = game.createRng(Date.now());
      state.lexLemma = rng.pick(game.VERBS).lemma;
      state.lexQuery = "";
      state.lexLetter = "";
      els.lexSearch.value = "";
      renderLexicon();
    });
    els.startBtn.addEventListener("click", startSession);
    els.answerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      resolve(els.answerInput.value);
    });
    els.nextBtn.addEventListener("click", nextQuestion);
    els.leaveBtn.addEventListener("click", function () {
      els.leave.hidden = false;
      els.leaveConfirm.focus();
    });
    els.leaveCancel.addEventListener("click", function () {
      els.leave.hidden = true;
    });
    els.leaveConfirm.addEventListener("click", function () {
      els.leave.hidden = true;
      endSession();
    });
    els.againBtn.addEventListener("click", startSession);
    els.menuBtn.addEventListener("click", function () {
      if (state.session && state.session.config.mode === "daily") {
        showView("home");
        renderHome();
      } else {
        renderSetup();
        showView("setup");
      }
    });
    document.addEventListener("keydown", onKey);
  }

  loadSettings();
  applyTheme();
  bind();
  renderHome();
})();
