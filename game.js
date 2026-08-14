/**
 * Tense metadata, conjugation, and drill generation for The Tense Atlas.
 * Works in the browser (global TenseAtlas) and in Node (module.exports).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./verbs.js"));
  } else {
    root.TenseAtlas = factory(root.TenseAtlasVerbs);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (lexicon) {
  const TIMES = ["past", "present", "future"];
  const ASPECTS = ["simple", "continuous", "perfect", "perfect-continuous"];

  const TENSES = [
    {
      id: "simple-past",
      time: "past",
      aspect: "simple",
      label: "Simple Past",
      short: "walked",
      pattern: "past form",
      uses: [
        "A finished action at a finished time",
        "A sequence of completed events",
        "A past habit, often with a time phrase",
      ],
      signals: ["yesterday", "last week", "in 2019", "ago", "when I was young"],
      contrast: "Use present perfect when the time is still open, or the result still matters now.",
    },
    {
      id: "simple-present",
      time: "present",
      aspect: "simple",
      label: "Simple Present",
      short: "walk / walks",
      pattern: "base form (add -s after he/she/it)",
      uses: [
        "Habits and routines",
        "Facts and general truths",
        "Scheduled future (timetables)",
      ],
      signals: ["every day", "usually", "always", "never", "on Mondays"],
      contrast: "Use present continuous for something happening around now, not for a habit.",
    },
    {
      id: "simple-future",
      time: "future",
      aspect: "simple",
      label: "Simple Future",
      short: "will walk",
      pattern: "will + base form",
      uses: [
        "A decision or prediction about later",
        "A promise or offer",
        "A fact that is not yet true",
      ],
      signals: ["tomorrow", "later", "soon", "next year", "I think"],
      contrast: "Going to is also common for plans and evidence-based predictions. This atlas drills will.",
    },
    {
      id: "continuous-past",
      time: "past",
      aspect: "continuous",
      label: "Past Continuous",
      short: "was walking",
      pattern: "was/were + -ing",
      uses: [
        "An action in progress at a past moment",
        "A background action behind a simple-past event",
        "Two overlapping past actions",
      ],
      signals: ["while", "when", "at 8 p.m.", "all morning"],
      contrast: "Simple past names the finished event; past continuous paints the scene around it.",
    },
    {
      id: "continuous-present",
      time: "present",
      aspect: "continuous",
      label: "Present Continuous",
      short: "am walking",
      pattern: "am/is/are + -ing",
      uses: [
        "An action happening now or around now",
        "A temporary situation",
        "A fixed personal plan",
      ],
      signals: ["now", "right now", "at the moment", "this week", "tonight"],
      contrast: "Stative verbs (know, want, seem) rarely take this form.",
    },
    {
      id: "continuous-future",
      time: "future",
      aspect: "continuous",
      label: "Future Continuous",
      short: "will be walking",
      pattern: "will be + -ing",
      uses: [
        "An action that will be in progress at a future moment",
        "A polite question about plans",
        "An expected scene, not a sudden decision",
      ],
      signals: ["at this time tomorrow", "this time next week", "all evening"],
      contrast: "Simple future names the event; future continuous places you inside it.",
    },
    {
      id: "perfect-past",
      time: "past",
      aspect: "perfect",
      label: "Past Perfect",
      short: "had walked",
      pattern: "had + past participle",
      uses: [
        "The earlier of two past events",
        "A past state that was already complete",
        "Reported speech looking further back",
      ],
      signals: ["already", "before", "by the time", "after", "until then"],
      contrast: "If the order is obvious, simple past is often enough. Past perfect makes the earlier event explicit.",
    },
    {
      id: "perfect-present",
      time: "present",
      aspect: "perfect",
      label: "Present Perfect",
      short: "have walked",
      pattern: "have/has + past participle",
      uses: [
        "A past action with a present result",
        "Experience up to now",
        "An unfinished time period (today, this week)",
      ],
      signals: ["already", "yet", "ever", "never", "since", "for", "just", "recently"],
      contrast: "Do not pair this tense with a finished time such as yesterday or in 2014.",
    },
    {
      id: "perfect-future",
      time: "future",
      aspect: "perfect",
      label: "Future Perfect",
      short: "will have walked",
      pattern: "will have + past participle",
      uses: [
        "An action that will be complete before a future point",
        "Looking back from a later moment",
      ],
      signals: ["by then", "by tomorrow", "by the time", "before Friday"],
      contrast: "Simple future says it will happen. Future perfect says it will already be done.",
    },
    {
      id: "perfect-continuous-past",
      time: "past",
      aspect: "perfect-continuous",
      label: "Past Perfect Continuous",
      short: "had been walking",
      pattern: "had been + -ing",
      uses: [
        "A longer action that continued up to a past moment",
        "Explaining a past result (tired because…)",
      ],
      signals: ["for", "since", "all day", "before"],
      contrast: "Past perfect names the completed act. This form keeps the duration in view.",
    },
    {
      id: "perfect-continuous-present",
      time: "present",
      aspect: "perfect-continuous",
      label: "Present Perfect Continuous",
      short: "have been walking",
      pattern: "have/has been + -ing",
      uses: [
        "An action that started earlier and is still going",
        "A recent activity with a present effect",
      ],
      signals: ["for", "since", "all morning", "lately", "recently"],
      contrast: "Present perfect can name a finished total. This form stresses the ongoing activity.",
    },
    {
      id: "perfect-continuous-future",
      time: "future",
      aspect: "perfect-continuous",
      label: "Future Perfect Continuous",
      short: "will have been walking",
      pattern: "will have been + -ing",
      uses: [
        "How long an action will have lasted by a future point",
      ],
      signals: ["for", "by then", "by this time next year"],
      contrast: "Rare in speech. Useful when duration up to a future moment is the point.",
    },
  ];

  const TENSE_INDEX = Object.fromEntries(TENSES.map((tense) => [tense.id, tense]));

  const CONFUSIONS = {
    "simple-past": ["perfect-present", "perfect-past", "continuous-past"],
    "simple-present": ["continuous-present", "perfect-present", "simple-future"],
    "simple-future": ["continuous-future", "perfect-future", "simple-present"],
    "continuous-past": ["simple-past", "perfect-continuous-past", "continuous-present"],
    "continuous-present": ["simple-present", "perfect-continuous-present", "continuous-future"],
    "continuous-future": ["simple-future", "perfect-continuous-future", "continuous-present"],
    "perfect-past": ["simple-past", "perfect-present", "perfect-continuous-past"],
    "perfect-present": ["simple-past", "perfect-continuous-present", "perfect-past"],
    "perfect-future": ["simple-future", "perfect-present", "perfect-continuous-future"],
    "perfect-continuous-past": ["perfect-past", "continuous-past", "perfect-continuous-present"],
    "perfect-continuous-present": ["perfect-present", "continuous-present", "perfect-continuous-past"],
    "perfect-continuous-future": ["perfect-future", "continuous-future", "perfect-continuous-present"],
  };

  const SUBJECTS = [
    { id: "i", label: "I", person: 1, number: "sg", be: { present: "am", past: "was" }, have: "have" },
    { id: "you", label: "You", person: 2, number: "sg", be: { present: "are", past: "were" }, have: "have" },
    { id: "he", label: "He", person: 3, number: "sg", be: { present: "is", past: "was" }, have: "has" },
    { id: "she", label: "She", person: 3, number: "sg", be: { present: "is", past: "was" }, have: "has" },
    { id: "we", label: "We", person: 1, number: "pl", be: { present: "are", past: "were" }, have: "have" },
    { id: "they", label: "They", person: 3, number: "pl", be: { present: "are", past: "were" }, have: "have" },
    { id: "maya", label: "Maya", person: 3, number: "sg", be: { present: "is", past: "was" }, have: "has" },
    { id: "crew", label: "The crew", person: 3, number: "sg", be: { present: "is", past: "was" }, have: "has" },
    { id: "students", label: "The students", person: 3, number: "pl", be: { present: "are", past: "were" }, have: "have" },
  ];

  const SUBJECT_INDEX = Object.fromEntries(SUBJECTS.map((item) => [item.id, item]));

  const SCOPES = {
    all: { id: "all", label: "All twelve", blurb: "The full atlas.", ids: TENSES.map((tense) => tense.id) },
    simple: {
      id: "simple",
      label: "Simple",
      blurb: "Past, present, and future.",
      ids: TENSES.filter((tense) => tense.aspect === "simple").map((tense) => tense.id),
    },
    continuous: {
      id: "continuous",
      label: "Continuous",
      blurb: "Actions in progress.",
      ids: TENSES.filter((tense) => tense.aspect === "continuous").map((tense) => tense.id),
    },
    perfect: {
      id: "perfect",
      label: "Perfect",
      blurb: "Earlier events, later views.",
      ids: TENSES.filter((tense) => tense.aspect === "perfect").map((tense) => tense.id),
    },
    "perfect-continuous": {
      id: "perfect-continuous",
      label: "Perfect continuous",
      blurb: "Duration up to a point.",
      ids: TENSES.filter((tense) => tense.aspect === "perfect-continuous").map((tense) => tense.id),
    },
    past: {
      id: "past",
      label: "Past column",
      blurb: "The four past cells.",
      ids: TENSES.filter((tense) => tense.time === "past").map((tense) => tense.id),
    },
    present: {
      id: "present",
      label: "Present column",
      blurb: "The four present cells.",
      ids: TENSES.filter((tense) => tense.time === "present").map((tense) => tense.id),
    },
    future: {
      id: "future",
      label: "Future column",
      blurb: "The four future cells.",
      ids: TENSES.filter((tense) => tense.aspect && tense.time === "future").map((tense) => tense.id),
    },
  };

  const MODES = {
    name: {
      id: "name",
      label: "Name the cell",
      blurb: "Read a sentence. Find its place on the atlas.",
    },
    match: {
      id: "match",
      label: "Find the sentence",
      blurb: "A tense is named. Pick the sentence that belongs there.",
    },
    write: {
      id: "write",
      label: "Write the form",
      blurb: "Given a subject, a verb, and a cell, type the verb phrase.",
    },
    contrast: {
      id: "contrast",
      label: "Tell them apart",
      blurb: "Two neighboring cells. One sentence is right.",
    },
    mixed: {
      id: "mixed",
      label: "Mixed drill",
      blurb: "Name, match, and write, in rotation.",
    },
    daily: {
      id: "daily",
      label: "Daily atlas",
      blurb: "Twelve prompts, one per cell, seeded from today’s date.",
    },
  };

  const COUNTS = [8, 12, 20, 0];
  const THEMES = ["parchment", "ink"];
  const DEFAULT_CONFIG = { mode: "name", scope: "all", count: 12, theme: "parchment" };

  const DOUBLE = new Set([
    "admit",
    "begin",
    "clap",
    "commit",
    "control",
    "drop",
    "excel",
    "forget",
    "get",
    "grab",
    "hug",
    "jog",
    "nod",
    "occur",
    "plan",
    "prefer",
    "refer",
    "regret",
    "rob",
    "rub",
    "run",
    "shop",
    "sit",
    "skip",
    "slip",
    "stir",
    "stop",
    "swim",
    "tap",
    "trip",
    "wrap",
  ]);

  function tenseById(id) {
    return TENSE_INDEX[id] || null;
  }

  function subjectById(id) {
    return SUBJECT_INDEX[id] || null;
  }

  function scopeIds(scope) {
    const found = SCOPES[scope] || SCOPES.all;
    return found.ids.slice();
  }

  function isContinuousAspect(aspect) {
    return aspect === "continuous" || aspect === "perfect-continuous";
  }

  function allowedTenses(verb, ids) {
    const pool = ids || TENSES.map((tense) => tense.id);
    return pool.filter((id) => {
      const tense = tenseById(id);
      if (!tense) return false;
      if (verb.stative && isContinuousAspect(tense.aspect)) return false;
      return true;
    });
  }

  function endsWithConsonantY(word) {
    return /[^aeiou]y$/i.test(word);
  }

  function isCvc(word) {
    return /[^aeiou][aeiou][^aeiouwxy]$/i.test(word);
  }

  function shouldDouble(lemma) {
    if (DOUBLE.has(lemma)) return true;
    return lemma.length <= 4 && isCvc(lemma);
  }

  function gerundOf(lemma) {
    if (lemma.endsWith("ie")) return lemma.slice(0, -2) + "ying";
    if (lemma.endsWith("e") && !/(ee|ye|oe)$/.test(lemma)) {
      return lemma.slice(0, -1) + "ing";
    }
    if (shouldDouble(lemma)) return lemma + lemma.slice(-1) + "ing";
    return lemma + "ing";
  }

  function pastRegular(lemma) {
    if (endsWithConsonantY(lemma)) return lemma.slice(0, -1) + "ied";
    if (lemma.endsWith("e")) return lemma + "d";
    if (shouldDouble(lemma)) return lemma + lemma.slice(-1) + "ed";
    return lemma + "ed";
  }

  function sFormOf(lemma) {
    if (endsWithConsonantY(lemma)) return lemma.slice(0, -1) + "ies";
    if (/(s|x|z|ch|sh|o)$/i.test(lemma)) return lemma + "es";
    return lemma + "s";
  }

  function formsOf(verb) {
    const lemma = verb.lemma;
    return {
      lemma: lemma,
      past: verb.past || pastRegular(lemma),
      participle: verb.participle || verb.past || pastRegular(lemma),
      gerund: verb.gerund || gerundOf(lemma),
      s: verb.s || sFormOf(lemma),
      pasts: verb.pasts || [],
      participles: verb.participles || [],
    };
  }

  function phraseFor(verb, tenseId, subject) {
    const forms = formsOf(verb);
    const be = subject.be;
    const have = subject.have;
    const isBe = verb.lemma === "be";

    switch (tenseId) {
      case "simple-present":
        if (isBe) return be.present;
        return subject.person === 3 && subject.number === "sg" ? forms.s : forms.lemma;
      case "simple-past":
        if (isBe) return be.past;
        return forms.past;
      case "simple-future":
        return "will " + forms.lemma;
      case "continuous-present":
        return be.present + " " + forms.gerund;
      case "continuous-past":
        return be.past + " " + forms.gerund;
      case "continuous-future":
        return "will be " + forms.gerund;
      case "perfect-present":
        return have + " " + forms.participle;
      case "perfect-past":
        return "had " + forms.participle;
      case "perfect-future":
        return "will have " + forms.participle;
      case "perfect-continuous-present":
        return have + " been " + forms.gerund;
      case "perfect-continuous-past":
        return "had been " + forms.gerund;
      case "perfect-continuous-future":
        return "will have been " + forms.gerund;
      default:
        return forms.lemma;
    }
  }

  function alternatePhrases(verb, tenseId, subject) {
    const forms = formsOf(verb);
    const extras = [];
    const swap = function (from, to) {
      const main = phraseFor(verb, tenseId, subject);
      if (main.includes(from)) extras.push(main.replace(from, to));
    };

    if (tenseId === "simple-past") {
      forms.pasts.forEach(function (alt) {
        extras.push(alt);
      });
    }
    if (tenseId.indexOf("perfect") === 0 && tenseId.indexOf("continuous") === -1) {
      forms.participles.forEach(function (alt) {
        const main = phraseFor(verb, tenseId, subject);
        extras.push(main.replace(forms.participle, alt));
      });
    }
    if (verb.lemma === "be" && tenseId === "simple-past" && subject.id === "you") {
      extras.push("was");
    }
    swap("gotten", "got");
    return extras.filter(Boolean);
  }

  function sentenceFor(verb, tenseId, subject) {
    const phrase = phraseFor(verb, tenseId, subject);
    return subject.label + " " + phrase + " " + verb.scene + ".";
  }

  function blankSentence(verb, subject) {
    return subject.label + " _____ " + verb.scene + ".";
  }

  function splitSentence(verb, tenseId, subject) {
    const phrase = phraseFor(verb, tenseId, subject);
    return {
      subject: subject.label,
      phrase: phrase,
      scene: verb.scene,
      sentence: sentenceFor(verb, tenseId, subject),
    };
  }

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[.,!?]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function contract(subjectLabel, phrase) {
    const full = subjectLabel + " " + phrase;
    const rules = [
      [/^I am\b/i, "I'm"],
      [/^I have\b/i, "I've"],
      [/^I will\b/i, "I'll"],
      [/^I had\b/i, "I'd"],
      [/^You are\b/i, "You're"],
      [/^You have\b/i, "You've"],
      [/^You will\b/i, "You'll"],
      [/^You had\b/i, "You'd"],
      [/^He is\b/i, "He's"],
      [/^He has\b/i, "He's"],
      [/^He will\b/i, "He'll"],
      [/^He had\b/i, "He'd"],
      [/^She is\b/i, "She's"],
      [/^She has\b/i, "She's"],
      [/^She will\b/i, "She'll"],
      [/^She had\b/i, "She'd"],
      [/^We are\b/i, "We're"],
      [/^We have\b/i, "We've"],
      [/^We will\b/i, "We'll"],
      [/^We had\b/i, "We'd"],
      [/^They are\b/i, "They're"],
      [/^They have\b/i, "They've"],
      [/^They will\b/i, "They'll"],
      [/^They had\b/i, "They'd"],
      [/^Maya is\b/i, "Maya's"],
      [/^Maya has\b/i, "Maya's"],
      [/^Maya will\b/i, "Maya'll"],
    ];
    for (let i = 0; i < rules.length; i += 1) {
      if (rules[i][0].test(full)) {
        return full.replace(rules[i][0], rules[i][1]);
      }
    }
    return null;
  }

  function acceptedAnswers(verb, tenseId, subject) {
    const phrase = phraseFor(verb, tenseId, subject);
    const sentence = sentenceFor(verb, tenseId, subject);
    const accepted = [phrase, subject.label + " " + phrase, sentence];
    alternatePhrases(verb, tenseId, subject).forEach(function (alt) {
      accepted.push(alt);
      accepted.push(subject.label + " " + alt);
      accepted.push(subject.label + " " + alt + " " + verb.scene + ".");
    });
    const contracted = contract(subject.label, phrase);
    if (contracted) {
      accepted.push(contracted);
      accepted.push(contracted + " " + verb.scene + ".");
    }
    return accepted;
  }

  function checkAnswer(question, input) {
    const norm = normalize(input);
    if (!norm) return { correct: false, empty: true };
    if (question.type === "write") {
      const ok = (question.accepted || []).some(function (item) {
        return normalize(item) === norm;
      });
      return { correct: ok, empty: false };
    }
    return { correct: normalize(question.answer) === norm, empty: false };
  }

  function mulberry32(seed) {
    let t = seed >>> 0;
    return function () {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashString(text) {
    let h = 2166136261;
    const str = String(text);
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function createRng(next) {
    const unit = typeof next === "function" ? next : mulberry32(hashString(String(next)));
    return {
      unit: unit,
      int: function (min, max) {
        return min + Math.floor(unit() * (max - min + 1));
      },
      pick: function (list) {
        return list[Math.floor(unit() * list.length)];
      },
      shuffle: function (list) {
        const copy = list.slice();
        for (let i = copy.length - 1; i > 0; i -= 1) {
          const j = Math.floor(unit() * (i + 1));
          const tmp = copy[i];
          copy[i] = copy[j];
          copy[j] = tmp;
        }
        return copy;
      },
    };
  }

  function dailyId(date) {
    const d = date instanceof Date ? date : new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function rngForDaily(date) {
    return createRng(mulberry32(hashString("tense-atlas-daily-" + dailyId(date))));
  }

  function listVerbs(query) {
    const term = normalize(query);
    const verbs = lexicon.VERBS;
    if (!term) return verbs.slice();
    if (term.length === 1) {
      return verbs.filter(function (verb) {
        return verb.lemma.charAt(0) === term;
      });
    }
    return verbs.filter(function (verb) {
      return verb.lemma.indexOf(term) !== -1 || verb.scene.indexOf(term) !== -1;
    });
  }

  function getVerb(lemma) {
    const key = normalize(lemma);
    return (
      lexicon.VERBS.find(function (verb) {
        return verb.lemma === key;
      }) || null
    );
  }

  function pickVerb(rng, tenseId) {
    const pool = lexicon.VERBS.filter(function (verb) {
      return allowedTenses(verb, [tenseId]).length > 0;
    });
    return rng.pick(pool);
  }

  function uniqueOptions(preferred, fallback, count, rng) {
    const out = [];
    const seen = new Set();
    preferred.concat(rng.shuffle(fallback)).forEach(function (id) {
      if (seen.has(id) || !TENSE_INDEX[id]) return;
      seen.add(id);
      out.push(id);
    });
    return out.slice(0, count);
  }

  function optionTenses(correctId, scope, rng) {
    const pool = scopeIds(scope);
    const nearby = (CONFUSIONS[correctId] || []).filter(function (id) {
      return pool.indexOf(id) !== -1;
    });
    const others = pool.filter(function (id) {
      return id !== correctId;
    });
    const picks = uniqueOptions(nearby, others, 3, rng);
    return rng.shuffle([correctId].concat(picks));
  }

  function makeNameQuestion(rng, scope) {
    const ids = scopeIds(scope);
    const tenseId = rng.pick(ids);
    const verb = pickVerb(rng, tenseId);
    const subject = rng.pick(SUBJECTS);
    const sentence = sentenceFor(verb, tenseId, subject);
    const options = optionTenses(tenseId, scope, rng);
    return {
      type: "name",
      input: scope === "all" || ids.length > 4 ? "grid" : "choices",
      tenseId: tenseId,
      verb: verb.lemma,
      subject: subject.id,
      sentence: sentence,
      prompt: "Which cell does this sentence belong to?",
      options: options,
      optionLabels: options.map(function (id) {
        return TENSE_INDEX[id].label;
      }),
      answer: tenseId,
    };
  }

  function makeMatchQuestion(rng, scope) {
    const ids = scopeIds(scope);
    const tenseId = rng.pick(ids);
    const verb = pickVerb(rng, tenseId);
    const subject = rng.pick(SUBJECTS);
    const optionIds = optionTenses(tenseId, scope, rng);
    const options = optionIds.map(function (id) {
      return {
        id: id,
        sentence: sentenceFor(verb, id, subject),
      };
    });
    return {
      type: "match",
      input: "choices",
      tenseId: tenseId,
      verb: verb.lemma,
      subject: subject.id,
      prompt: "Which sentence is " + TENSE_INDEX[tenseId].label + "?",
      options: options.map(function (item) {
        return item.sentence;
      }),
      optionIds: optionIds,
      answer: sentenceFor(verb, tenseId, subject),
    };
  }

  function makeWriteQuestion(rng, scope) {
    const ids = scopeIds(scope);
    const tenseId = rng.pick(ids);
    const verb = pickVerb(rng, tenseId);
    const subject = rng.pick(SUBJECTS);
    const phrase = phraseFor(verb, tenseId, subject);
    return {
      type: "write",
      input: "text",
      tenseId: tenseId,
      verb: verb.lemma,
      subject: subject.id,
      prompt: "Write the verb phrase.",
      hint: TENSE_INDEX[tenseId].label,
      blank: blankSentence(verb, subject),
      pattern: TENSE_INDEX[tenseId].pattern,
      answer: phrase,
      accepted: acceptedAnswers(verb, tenseId, subject),
    };
  }

  function makeContrastQuestion(rng, scope) {
    const ids = scopeIds(scope);
    const tenseId = rng.pick(ids);
    const rivals = (CONFUSIONS[tenseId] || []).filter(function (id) {
      return ids.indexOf(id) !== -1;
    });
    const otherId = rivals.length ? rng.pick(rivals) : rng.pick(ids.filter(function (id) {
      return id !== tenseId;
    }));
    const verb = pickVerb(rng, tenseId);
    const subject = rng.pick(SUBJECTS);
    const correct = sentenceFor(verb, tenseId, subject);
    const wrong = sentenceFor(verb, otherId, subject);
    const options = rng.shuffle([correct, wrong]);
    return {
      type: "contrast",
      input: "choices",
      tenseId: tenseId,
      otherId: otherId,
      verb: verb.lemma,
      subject: subject.id,
      prompt: "Which sentence is " + TENSE_INDEX[tenseId].label + "?",
      note: TENSE_INDEX[tenseId].contrast,
      options: options,
      answer: correct,
    };
  }

  function questionForMode(mode, rng, scope) {
    if (mode === "match") return makeMatchQuestion(rng, scope);
    if (mode === "write") return makeWriteQuestion(rng, scope);
    if (mode === "contrast") return makeContrastQuestion(rng, scope);
    return makeNameQuestion(rng, scope);
  }

  function generateQuestion(config, rng) {
    const cfg = normalizeConfig(config);
    if (cfg.mode === "mixed") {
      const cycle = ["name", "match", "write", "contrast"];
      return questionForMode(rng.pick(cycle), rng, cfg.scope);
    }
    if (cfg.mode === "daily") {
      return questionForMode(rng.pick(["name", "write"]), rng, "all");
    }
    return questionForMode(cfg.mode, rng, cfg.scope);
  }

  function generateDaily(date) {
    const rng = rngForDaily(date);
    const order = rng.shuffle(TENSES.map(function (tense) {
      return tense.id;
    }));
    return order.map(function (tenseId, index) {
      const mode = index % 2 === 0 ? "name" : "write";
      const scoped = { mode: mode, scope: "all", count: 12, theme: "parchment" };
      const question = questionForMode(mode, rng, "all");
      question.tenseIdForced = tenseId;
      return rebuildForTense(question, tenseId, rng, scoped);
    });
  }

  function rebuildForTense(question, tenseId, rng) {
    const verb = pickVerb(rng, tenseId);
    const subject = rng.pick(SUBJECTS);
    if (question.type === "write") {
      return {
        type: "write",
        input: "text",
        tenseId: tenseId,
        verb: verb.lemma,
        subject: subject.id,
        prompt: "Write the verb phrase.",
        hint: TENSE_INDEX[tenseId].label,
        blank: blankSentence(verb, subject),
        pattern: TENSE_INDEX[tenseId].pattern,
        answer: phraseFor(verb, tenseId, subject),
        accepted: acceptedAnswers(verb, tenseId, subject),
      };
    }
    const options = optionTenses(tenseId, "all", rng);
    return {
      type: "name",
      input: "grid",
      tenseId: tenseId,
      verb: verb.lemma,
      subject: subject.id,
      sentence: sentenceFor(verb, tenseId, subject),
      prompt: "Which cell does this sentence belong to?",
      options: options,
      optionLabels: options.map(function (id) {
        return TENSE_INDEX[id].label;
      }),
      answer: tenseId,
    };
  }

  function generateSession(config, rng) {
    const cfg = normalizeConfig(config);
    if (cfg.mode === "daily") {
      return generateDaily(cfg.date || new Date());
    }
    const count = cfg.count > 0 ? cfg.count : 12;
    const questions = [];
    for (let i = 0; i < count; i += 1) {
      questions.push(generateQuestion(cfg, rng));
    }
    return questions;
  }

  function emptyStats() {
    return { total: 0, correct: 0, streak: 0, bestStreak: 0, byTense: {} };
  }

  function applyResult(stats, tenseId, correct) {
    const next = {
      total: stats.total + 1,
      correct: stats.correct + (correct ? 1 : 0),
      streak: correct ? stats.streak + 1 : 0,
      bestStreak: stats.bestStreak,
      byTense: Object.assign({}, stats.byTense),
    };
    next.bestStreak = Math.max(next.bestStreak, next.streak);
    const cell = next.byTense[tenseId] || { ok: 0, n: 0 };
    next.byTense[tenseId] = { ok: cell.ok + (correct ? 1 : 0), n: cell.n + 1 };
    return next;
  }

  function accuracy(stats) {
    if (!stats.total) return 0;
    return Math.round((stats.correct / stats.total) * 100);
  }

  function normalizeConfig(raw) {
    const src = raw && typeof raw === "object" ? raw : {};
    return {
      mode: MODES[src.mode] ? src.mode : DEFAULT_CONFIG.mode,
      scope: SCOPES[src.scope] ? src.scope : DEFAULT_CONFIG.scope,
      count: COUNTS.indexOf(src.count) !== -1 ? src.count : DEFAULT_CONFIG.count,
      theme: THEMES.indexOf(src.theme) !== -1 ? src.theme : DEFAULT_CONFIG.theme,
      date: src.date,
    };
  }

  function aspectLabel(aspect) {
    if (aspect === "perfect-continuous") return "Perfect cont.";
    return aspect.charAt(0).toUpperCase() + aspect.slice(1);
  }

  function grid() {
    return ASPECTS.map(function (aspect) {
      return TIMES.map(function (time) {
        return tenseById(aspect + "-" + time);
      });
    });
  }

  function atlasRows() {
    return ASPECTS.map(function (aspect) {
      return {
        aspect: aspect,
        label: aspectLabel(aspect),
        cells: TIMES.map(function (time) {
          return tenseById(aspect + "-" + time);
        }),
      };
    });
  }

  function exampleCard(tenseId, lemma, subjectId) {
    const verb = getVerb(lemma) || getVerb("write");
    const subject = subjectById(subjectId) || SUBJECT_INDEX.maya;
    const tense = tenseById(tenseId);
    if (!verb || !tense) return null;
    const allowed = allowedTenses(verb, [tenseId]).length > 0;
    return {
      tense: tense,
      verb: verb,
      subject: subject,
      forms: formsOf(verb),
      phrase: phraseFor(verb, tenseId, subject),
      sentence: sentenceFor(verb, tenseId, subject),
      unusual: !allowed,
    };
  }

  function lexiconCard(lemma, subjectId) {
    const verb = getVerb(lemma);
    if (!verb) return null;
    const subject = subjectById(subjectId) || SUBJECT_INDEX.they;
    return {
      verb: verb,
      subject: subject,
      forms: formsOf(verb),
      cells: TENSES.map(function (tense) {
        return {
          tense: tense,
          phrase: phraseFor(verb, tense.id, subject),
          sentence: sentenceFor(verb, tense.id, subject),
          unusual: verb.stative && isContinuousAspect(tense.aspect),
        };
      }),
    };
  }

  return {
    TIMES: TIMES,
    ASPECTS: ASPECTS,
    TENSES: TENSES,
    SUBJECTS: SUBJECTS,
    SCOPES: SCOPES,
    MODES: MODES,
    COUNTS: COUNTS,
    THEMES: THEMES,
    DEFAULT_CONFIG: DEFAULT_CONFIG,
    VERBS: lexicon.VERBS,
    tenseById: tenseById,
    subjectById: subjectById,
    scopeIds: scopeIds,
    allowedTenses: allowedTenses,
    formsOf: formsOf,
    gerundOf: gerundOf,
    pastRegular: pastRegular,
    sFormOf: sFormOf,
    phraseFor: phraseFor,
    sentenceFor: sentenceFor,
    acceptedAnswers: acceptedAnswers,
    normalize: normalize,
    checkAnswer: checkAnswer,
    mulberry32: mulberry32,
    hashString: hashString,
    createRng: createRng,
    dailyId: dailyId,
    rngForDaily: rngForDaily,
    listVerbs: listVerbs,
    getVerb: getVerb,
    generateQuestion: generateQuestion,
    generateDaily: generateDaily,
    generateSession: generateSession,
    emptyStats: emptyStats,
    applyResult: applyResult,
    accuracy: accuracy,
    normalizeConfig: normalizeConfig,
    grid: grid,
    atlasRows: atlasRows,
    exampleCard: exampleCard,
    lexiconCard: lexiconCard,
  };
});
