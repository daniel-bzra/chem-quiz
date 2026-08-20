# ChemRevise — interactive chemistry revision quiz

An interactive revision quiz for the chemistry final exam (QV), built for the
**IDAF Natural Sciences & English** project at BWZ Rapperswil.

18 exam-style questions across the whole course (chapters C1–C9), instant
feedback on every answer, and a short explanation video whenever an answer is
wrong.

**Live version:** https://USERNAME.github.io/chem-quiz/ ← replace once it is online

---

## How the brief is covered

| Requirement | Where |
|---|---|
| in English | whole app |
| tests understanding | questions are applied/reasoning, not definition recall |
| wide range of topics | 2 questions per chapter, C1–C9 |
| at least 6 questions | 18 |
| immediate feedback after each answer | feedback panel opens on click, with a note on **every** option |
| explanation video on a wrong answer | `videos/qNN.mp4`, 18 × ~40 s ≈ 12 min |
| user can continue after watching | "Continue" button, no forced waiting |
| final score + personalised feedback | result screen: score ring, message, per-topic bars, retry-the-missed |
| sources displayed | "Sources" button in the header and footer |

---

## Project structure

```
chem-quiz/
├── index.html          the three screens (start / quiz / result)
├── css/style.css       all styling
├── js/questions.js     ← the question bank, this is what you edit
├── js/app.js           quiz logic
├── videos/             q01.mp4 … q18.mp4  (add these)
├── VIDEO-SCRIPTS.md    a draft script for each of the 18 videos
├── server.js           tiny local test server (not needed once online)
└── README.md
```

No frameworks, no build step, no dependencies. Open `index.html` and it runs.

---

## Adding the videos

1. Record one video per question, 30–45 seconds — scripts are in
   [VIDEO-SCRIPTS.md](VIDEO-SCRIPTS.md).
2. Export as MP4 (H.264), 720p, ideally under 10 MB each.
3. Name them `q01.mp4` … `q18.mp4` and drop them into `videos/`.
4. Commit and push — done, nothing in the code needs changing.

Until a file exists the quiz shows a tidy placeholder instead of a broken
player, so the app is fully usable right now.

### Alternative: YouTube instead of files

If the files get too big, upload them to YouTube as **unlisted** and put the
embed URL into `js/questions.js`:

```js
video: "https://www.youtube.com/embed/VIDEO_ID"
```

The app detects the URL and switches to an iframe automatically.

---

## Editing questions

Everything lives in `js/questions.js`. One entry looks like this:

```js
{
  id: "q07",                       // also the video file name → videos/q07.mp4
  topic: "C4",                     // must exist in QUIZ_TOPICS
  question: "…",                   // HTML allowed (<sub>, &#8322;, …)
  options: ["…", "…", "…", "…"],
  correct: 1,                      // index, starts at 0
  why: ["…", "…", "…", "…"],       // one note per option — why it is right/wrong
  takeaway: "…",                   // the one sentence to remember
  video: "videos/q07.mp4",
  source: "…"
}
```

Subscripts: use `<sub>2</sub>` or the entities `&#8322;` (₂), `&#8323;` (₃),
`&#8314;` (⁺), `&#8315;` (⁻).

---

## Publishing on GitHub Pages

Once, in this folder:

```bash
git init -b main && git add -A && git commit -m "ChemRevise: interactive chemistry quiz"
```

Create an empty repository on github.com (no README, no .gitignore), then:

```bash
git remote add origin https://github.com/USERNAME/chem-quiz.git && git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch →
Branch: `main` / `(root)` → Save.**

After a minute the site is live at `https://USERNAME.github.io/chem-quiz/`.
That URL is what gets sent to Mr Pröbsting, Mr Fannenböck and Ms Marti.

Every later `git push` updates the live site automatically.

---

## Local testing

Just double-click `index.html`. For the video player to behave exactly as it
will online, serve the folder instead:

```bash
node server.js   # then open http://localhost:4321
```

---

## Sources

Listed in the app under **Sources**. Content is based on the BWZ chemistry
course script *CHEM IMST24a*, chapters C1–C9, and the periodic table used in
class.
