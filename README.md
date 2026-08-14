# The Tense Atlas

A small, dependency-free map of English verb time. Twelve cells — three times by four aspects — hold a verb in place. Read the coastline, browse a lexicon, then find your way back by naming a cell, matching a sentence, or writing the form.

This is a rebuild of an older two-page prototype. The concept is the same; the implementation has a shared conjugator, keyboard-friendly controls, and no third-party services.

## Try it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

1. Click a cell on the atlas to read its pattern, uses, and signal words.
2. Open the **Lexicon** to see one verb in all twelve cells. Change the subject to watch agreement.
3. **Practice** names a cell, finds a sentence, writes a verb phrase, or tells two neighboring cells apart.
4. **Daily atlas** is today’s twelve, seeded from the calendar date so every machine sees the same sequence.

Parchment and ink palettes, last-used settings, and records stay in `localStorage` on that browser. Nothing is sent anywhere.

## The map

| | Past | Present | Future |
| --- | --- | --- | --- |
| Simple | walked | walk / walks | will walk |
| Continuous | was walking | am walking | will be walking |
| Perfect | had walked | have walked | will have walked |
| Perfect continuous | had been walking | have been walking | will have been walking |

Stative verbs such as *know* and *want* are kept out of continuous drills. They still appear in the lexicon, marked as uncommon in those cells.

Write-the-form accepts the verb phrase, the full sentence, and ordinary contractions (`she's written`). American participles are the default; a few British variants (`got`, `learnt`) also count.

## Files

```
index.html      Map, lexicon, drills, and summary
app.js          UI and session flow
game.js         Tenses, conjugation, questions, and scoring
verbs.js        Lexicon of common regular and irregular verbs
styles.css      Layout and chart-room theme
favicon.svg     App icon
test/           Node tests for game.js
```

## Tests

Node 18+ is enough. No install step.

```bash
npm test
```

## License

MIT License. Copyright (c) 2025-2026 JD Jones. See [LICENSE](LICENSE).
