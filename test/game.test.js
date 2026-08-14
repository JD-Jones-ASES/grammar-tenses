const test = require("node:test");
const assert = require("node:assert/strict");
const game = require("../game.js");

function seeded(n) {
  return game.createRng(game.mulberry32(n));
}

test("normalizeConfig fills defaults and drops unknown values", () => {
  assert.deepEqual(game.normalizeConfig(null), {
    mode: "name",
    scope: "all",
    count: 12,
    theme: "parchment",
    date: undefined,
  });
  assert.deepEqual(game.normalizeConfig({ mode: "arcade", scope: "mood", count: 99, theme: "neon" }), {
    mode: "name",
    scope: "all",
    count: 12,
    theme: "parchment",
    date: undefined,
  });
  assert.equal(game.normalizeConfig({ mode: "write", scope: "past", count: 20, theme: "ink" }).mode, "write");
  assert.equal(game.normalizeConfig({ mode: "write", scope: "past", count: 20, theme: "ink" }).scope, "past");
  assert.equal(game.normalizeConfig({ mode: "write", scope: "past", count: 20, theme: "ink" }).count, 20);
  assert.equal(game.normalizeConfig({ mode: "write", scope: "past", count: 20, theme: "ink" }).theme, "ink");
});

test("seeded rng is deterministic", () => {
  const a = seeded(42);
  const b = seeded(42);
  const seqA = [a.int(0, 9), a.pick(["x", "y", "z"]), a.unit()];
  const seqB = [b.int(0, 9), b.pick(["x", "y", "z"]), b.unit()];
  assert.deepEqual(seqA, seqB);
});

test("dailyId formats local calendar dates", () => {
  assert.equal(game.dailyId(new Date(2026, 7, 13)), "2026-08-13");
});

test("regular inflection follows English spelling", () => {
  assert.equal(game.pastRegular("walk"), "walked");
  assert.equal(game.pastRegular("try"), "tried");
  assert.equal(game.pastRegular("like"), "liked");
  assert.equal(game.pastRegular("stop"), "stopped");
  assert.equal(game.gerundOf("make"), "making");
  assert.equal(game.gerundOf("see"), "seeing");
  assert.equal(game.gerundOf("die"), "dying");
  assert.equal(game.gerundOf("stop"), "stopping");
  assert.equal(game.gerundOf("play"), "playing");
  assert.equal(game.sFormOf("watch"), "watches");
  assert.equal(game.sFormOf("try"), "tries");
  assert.equal(game.sFormOf("echo"), "echoes");
  assert.equal(game.sFormOf("walk"), "walks");
});

test("irregular forms stay irregular", () => {
  const write = game.formsOf(game.getVerb("write"));
  assert.deepEqual([write.past, write.participle, write.gerund, write.s], ["wrote", "written", "writing", "writes"]);
  const go = game.formsOf(game.getVerb("go"));
  assert.deepEqual([go.past, go.participle], ["went", "gone"]);
  const lie = game.formsOf(game.getVerb("lie"));
  assert.equal(lie.past, "lay");
  assert.equal(lie.gerund, "lying");
});

test("be agrees with the subject in every simple cell", () => {
  const be = game.getVerb("be");
  const i = game.subjectById("i");
  const she = game.subjectById("she");
  const they = game.subjectById("they");
  assert.equal(game.phraseFor(be, "simple-present", i), "am");
  assert.equal(game.phraseFor(be, "simple-present", she), "is");
  assert.equal(game.phraseFor(be, "simple-present", they), "are");
  assert.equal(game.phraseFor(be, "simple-past", i), "was");
  assert.equal(game.phraseFor(be, "simple-past", they), "were");
  assert.equal(game.phraseFor(be, "perfect-present", she), "has been");
  assert.equal(game.phraseFor(be, "continuous-present", i), "am being");
});

test("twelve-cell conjugation for write", () => {
  const write = game.getVerb("write");
  const maya = game.subjectById("maya");
  assert.equal(game.phraseFor(write, "simple-present", maya), "writes");
  assert.equal(game.phraseFor(write, "simple-past", maya), "wrote");
  assert.equal(game.phraseFor(write, "simple-future", maya), "will write");
  assert.equal(game.phraseFor(write, "continuous-present", maya), "is writing");
  assert.equal(game.phraseFor(write, "continuous-past", maya), "was writing");
  assert.equal(game.phraseFor(write, "continuous-future", maya), "will be writing");
  assert.equal(game.phraseFor(write, "perfect-present", maya), "has written");
  assert.equal(game.phraseFor(write, "perfect-past", maya), "had written");
  assert.equal(game.phraseFor(write, "perfect-future", maya), "will have written");
  assert.equal(game.phraseFor(write, "perfect-continuous-present", maya), "has been writing");
  assert.equal(game.phraseFor(write, "perfect-continuous-past", maya), "had been writing");
  assert.equal(game.phraseFor(write, "perfect-continuous-future", maya), "will have been writing");
  assert.equal(game.sentenceFor(write, "perfect-present", maya), "Maya has written a letter home.");
});

test("stative verbs are kept out of continuous drills", () => {
  const know = game.getVerb("know");
  const allowed = game.allowedTenses(know);
  assert.ok(allowed.includes("simple-past"));
  assert.ok(allowed.includes("perfect-present"));
  assert.ok(!allowed.includes("continuous-present"));
  assert.ok(!allowed.includes("perfect-continuous-past"));
});

test("write answers accept phrases, sentences, and contractions", () => {
  const write = game.getVerb("write");
  const she = game.subjectById("she");
  const question = {
    type: "write",
    answer: "has written",
    accepted: game.acceptedAnswers(write, "perfect-present", she),
  };
  assert.equal(game.checkAnswer(question, "has written").correct, true);
  assert.equal(game.checkAnswer(question, "She has written").correct, true);
  assert.equal(game.checkAnswer(question, "she's written").correct, true);
  assert.equal(game.checkAnswer(question, "She has written a letter home.").correct, true);
  assert.equal(game.checkAnswer(question, "wrote").correct, false);
  assert.equal(game.checkAnswer(question, "   ").empty, true);
});

test("gotten also accepts got", () => {
  const get = game.getVerb("get");
  const they = game.subjectById("they");
  const question = {
    type: "write",
    accepted: game.acceptedAnswers(get, "perfect-present", they),
  };
  assert.equal(game.checkAnswer(question, "have gotten").correct, true);
  assert.equal(game.checkAnswer(question, "have got").correct, true);
});

test("atlas grid is 4 by 3 and fully named", () => {
  const grid = game.grid();
  assert.equal(grid.length, 4);
  grid.forEach((row) => {
    assert.equal(row.length, 3);
    row.forEach((cell) => {
      assert.ok(cell);
      assert.ok(cell.label);
    });
  });
  assert.equal(grid[0][0].id, "simple-past");
  assert.equal(grid[3][2].id, "perfect-continuous-future");
});

test("generated questions are internally consistent", () => {
  const modes = ["name", "match", "write", "contrast", "mixed"];
  modes.forEach((mode) => {
    for (let seed = 1; seed <= 30; seed += 1) {
      const rng = seeded(seed * 19 + mode.length);
      const question = game.generateQuestion({ mode: mode, scope: "all" }, rng);
      assert.ok(game.tenseById(question.tenseId), mode + " " + seed);
      if (question.type === "write") {
        const verb = game.getVerb(question.verb);
        const subject = game.subjectById(question.subject);
        assert.equal(question.answer, game.phraseFor(verb, question.tenseId, subject));
        assert.equal(game.checkAnswer(question, question.answer).correct, true);
      } else if (question.type === "name") {
        assert.ok(question.options.includes(question.answer));
        assert.equal(question.sentence, game.sentenceFor(game.getVerb(question.verb), question.tenseId, game.subjectById(question.subject)));
      } else {
        assert.ok(question.options.includes(question.answer));
        assert.equal(new Set(question.options).size, question.options.length);
      }
    }
  });
});

test("scope limits option tenses", () => {
  const rng = seeded(11);
  for (let i = 0; i < 20; i += 1) {
    const question = game.generateQuestion({ mode: "name", scope: "simple" }, rng);
    const allowed = game.scopeIds("simple");
    assert.ok(allowed.includes(question.tenseId));
    question.options.forEach((id) => {
      assert.ok(allowed.includes(id));
    });
  }
});

test("daily atlas is twelve unique cells and stable for a date", () => {
  const date = new Date(2026, 7, 13);
  const first = game.generateDaily(date);
  const second = game.generateDaily(date);
  assert.equal(first.length, 12);
  const ids = first.map((item) => item.tenseId);
  assert.equal(new Set(ids).size, 12);
  assert.deepEqual(
    first.map((item) => [item.type, item.tenseId, item.verb, item.subject, item.answer]),
    second.map((item) => [item.type, item.tenseId, item.verb, item.subject, item.answer])
  );
  const other = game.generateDaily(new Date(2026, 7, 14));
  assert.notDeepEqual(
    first.map((item) => item.answer),
    other.map((item) => item.answer)
  );
});

test("session stats track accuracy and streaks", () => {
  let stats = game.emptyStats();
  stats = game.applyResult(stats, "simple-past", true);
  stats = game.applyResult(stats, "simple-past", true);
  stats = game.applyResult(stats, "perfect-present", false);
  stats = game.applyResult(stats, "perfect-present", true);
  assert.equal(stats.total, 4);
  assert.equal(stats.correct, 3);
  assert.equal(stats.streak, 1);
  assert.equal(stats.bestStreak, 2);
  assert.equal(game.accuracy(stats), 75);
  assert.deepEqual(stats.byTense["simple-past"], { ok: 2, n: 2 });
});

test("lexicon search and cards", () => {
  const ws = game.listVerbs("w");
  assert.ok(ws.every((verb) => verb.lemma.startsWith("w")));
  assert.ok(game.listVerbs("write").some((verb) => verb.lemma === "write"));
  const card = game.lexiconCard("write", "maya");
  assert.equal(card.cells.length, 12);
  assert.equal(card.cells[0].sentence.endsWith("a letter home."), true);
  const stative = game.lexiconCard("know", "i");
  assert.ok(stative.cells.some((cell) => cell.unusual));
});

test("verb list has unique lemmas and no empty scenes", () => {
  const lemmas = game.VERBS.map((verb) => verb.lemma);
  assert.equal(new Set(lemmas).size, lemmas.length);
  assert.ok(lemmas.length >= 150);
  game.VERBS.forEach((verb) => {
    assert.ok(verb.scene.length > 3, verb.lemma);
  });
});
