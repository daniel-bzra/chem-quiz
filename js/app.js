/* ==================================================================
   ChemRevise - application logic
   Plain JavaScript, no dependencies, no build step.
   ================================================================== */
(function () {
  "use strict";

  /* --------------------------------------------------------- state */
  const state = {
    pool: [],      // the questions of the current run
    index: 0,      // which one we are on
    answered: [],  // { id, topic, chosen, correct:boolean }
    locked: false, // true while the feedback panel is open
    order: [],     // display order of the options for the current question
    gate: 0,       // bumped per question, so a removed video cannot unlock the next one
    nextLabel: ""  // "Continue" or "See my result"
  };

  const LETTERS = ["A", "B", "C", "D", "E", "F"];
  const BEST_KEY = "chemrevise.best";

  /* ---------------------------------------------------------- refs */
  const $ = (id) => document.getElementById(id);

  const screens = {
    start:  $("screen-start"),
    quiz:   $("screen-quiz"),
    result: $("screen-result")
  };

  /* ------------------------------------------------------ helpers */
  function show(name) {
    Object.values(screens).forEach((s) => s.classList.remove("is-active"));
    screens[name].classList.add("is-active");
    $("hud").hidden = name !== "quiz";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function topicOf(key) {
    return QUIZ_TOPICS[key] || { name: key, colour: "#818cf8" };
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* =============================================== START SCREEN === */
  function buildTopicGrid() {
    const grid = $("topicGrid");
    grid.innerHTML = "";

    Object.keys(QUIZ_TOPICS).forEach((key) => {
      const t = topicOf(key);
      const n = QUIZ_QUESTIONS.filter((q) => q.topic === key).length;
      if (!n) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "topic-btn";
      btn.innerHTML =
        '<span class="topic-key" style="background:' + t.colour + '">' + key + "</span>" +
        "<span>" + t.name + "</span>" +
        '<span class="topic-n">' + n + "</span>";
      btn.addEventListener("click", () => start(QUIZ_QUESTIONS.filter((q) => q.topic === key)));
      grid.appendChild(btn);
    });

    $("startCount").textContent = QUIZ_QUESTIONS.length;
  }

  /* ===================================================== RUN QUIZ = */
  function start(questions) {
    state.pool = shuffle(questions);
    state.index = 0;
    state.answered = [];
    state.locked = false;
    show("quiz");
    render();
  }

  function render() {
    const q = state.pool[state.index];
    const t = topicOf(q.topic);
    state.locked = false;
    state.gate++;

    /* header + progress */
    $("qTopic").textContent = q.topic + " · " + t.name.replace(/&amp;/g, "&");
    $("qTopic").style.background = t.colour;
    $("qCounter").textContent = "Question " + (state.index + 1) + " of " + state.pool.length;
    $("progressBar").style.width = (state.index / state.pool.length) * 100 + "%";
    $("hudProgress").textContent = (state.index + 1) + " / " + state.pool.length;
    $("hudScore").textContent = state.answered.filter((a) => a.correct).length + " correct";

    /* question */
    $("qText").innerHTML = q.question;

    /* options - shuffled every time, so neither the position nor the
       length of an answer can be used as a shortcut */
    state.order = shuffle(q.options.map((_, i) => i));

    const list = $("options");
    list.innerHTML = "";
    state.order.forEach((source, slot) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "opt";
      btn.dataset.i = source;   // index in the question data
      btn.dataset.slot = slot;  // position on screen
      btn.innerHTML =
        '<span class="opt-key">' + LETTERS[slot] + "</span><span>" + q.options[source] + "</span>";
      btn.addEventListener("click", () => answer(source));
      li.appendChild(btn);
      list.appendChild(li);
    });

    /* reset feedback */
    $("feedback").hidden = true;
    $("videoBlock").hidden = true;
    $("videoFrame").innerHTML = "";
    $("hint").hidden = false;
  }

  function answer(chosen) {
    if (state.locked) return;
    state.locked = true;

    const q = state.pool[state.index];
    const right = chosen === q.correct;

    state.answered.push({ id: q.id, topic: q.topic, chosen: chosen, correct: right });

    /* colour the options */
    document.querySelectorAll(".opt").forEach((btn) => {
      const i = Number(btn.dataset.i);
      btn.disabled = true;
      if (i === q.correct) btn.classList.add("is-correct");
      else if (i === chosen) btn.classList.add("is-wrong");
      else btn.classList.add("is-dim");
    });

    /* feedback panel */
    $("fbIcon").textContent = right ? "✓" : "✗";
    $("fbIcon").className = "fb-icon " + (right ? "good" : "bad");
    $("fbTitle").textContent = right ? "Correct!" : "Not quite.";
    $("fbWhy").innerHTML = q.why[chosen];

    const fbCorrect = $("fbCorrect");
    if (right) {
      fbCorrect.hidden = true;
    } else {
      fbCorrect.hidden = false;
      /* the letter depends on where the correct option landed after shuffling */
      fbCorrect.innerHTML =
        "<strong>" + LETTERS[state.order.indexOf(q.correct)] + " is right:</strong> " +
        q.why[q.correct];
    }

    $("fbTakeaway").innerHTML = "<strong>Remember:</strong> " + q.takeaway;
    $("fbSource").innerHTML = "Source: " + q.source;
    $("hint").hidden = true;

    state.nextLabel = state.index === state.pool.length - 1 ? "See my result →" : "Continue →";
    unlockContinue(false);

    /* video only when the answer was wrong - and then Continue waits for it */
    if (!right) mountVideo(q);

    $("feedback").hidden = false;
    $("hudScore").textContent = state.answered.filter((a) => a.correct).length + " correct";
    $("feedback").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ---------------------------------------------------- the video */
  function mountVideo(q) {
    const frame = $("videoFrame");
    frame.innerHTML = "";

    const src = q.video || "";
    const embedded = /youtube|youtu\.be|vimeo/i.test(src);

    if (!src) {
      frame.appendChild(missingBox(q, "no file set yet"));
    } else if (embedded) {
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.title = "Explanation video for question " + q.id;
      frame.appendChild(iframe);
    } else {
      const video = document.createElement("video");
      const gate = state.gate;
      video.src = src;
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";

      /* Continue stays locked until the video has really been watched.
         Counted from the ranges that were actually played, so skipping to
         the end does not count. */
      lockContinue("Watch the video to continue");
      const check = () => {
        if (gate !== state.gate) return;
        const d = video.duration;
        if (!isFinite(d) || d <= 0) return;
        let seen = 0;
        for (let i = 0; i < video.played.length; i++) seen += video.played.end(i) - video.played.start(i);
        if (d - seen <= 0.75) {
          unlockContinue(true);
        } else {
          $("btnNext").textContent = "Watch the video to continue · " + Math.ceil(d - seen) + " s left";
        }
      };
      video.addEventListener("loadedmetadata", check);
      video.addEventListener("timeupdate", check);
      video.addEventListener("ended", check);

      /* if the file is not there yet, show a friendly placeholder - and do
         not trap the user behind a video that cannot play */
      video.addEventListener("error", () => {
        if (gate !== state.gate) return;
        frame.innerHTML = "";
        frame.appendChild(missingBox(q, src));
        unlockContinue(false);
      });
      frame.appendChild(video);
    }

    $("videoBlock").hidden = false;
  }

  function lockContinue(text) {
    const btn = $("btnNext");
    btn.disabled = true;
    btn.textContent = text;
  }

  function unlockContinue(focus) {
    const btn = $("btnNext");
    const was = btn.disabled;
    btn.disabled = false;
    btn.textContent = state.nextLabel;
    if (focus && was) btn.focus({ preventScroll: true });
  }

  function missingBox(q, src) {
    const box = document.createElement("div");
    box.className = "video-missing";
    box.innerHTML =
      '<div class="vm-icon">🎬</div>' +
      "<strong>The video is not uploaded yet</strong>" +
      "<span>Expected file: <code>" + src + "</code></span>" +
      "<span>The written explanation above already covers the point.</span>";
    return box;
  }

  /* -------------------------------------------------------- next */
  function next() {
    if (state.index < state.pool.length - 1) {
      state.index++;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      finish();
    }
  }

  /* =================================================== RESULT ==== */
  function finish() {
    const total = state.pool.length;
    const score = state.answered.filter((a) => a.correct).length;
    const pct = Math.round((score / total) * 100);

    $("progressBar").style.width = "100%";
    $("scoreValue").textContent = score;
    $("scoreOf").textContent = "of " + total;
    $("scoreRing").style.background =
      "conic-gradient(var(--accent) " + pct + "%, var(--card-2) 0)";

    const fb = feedbackFor(pct, total - score);
    $("resultTitle").textContent = fb.title;
    $("resultMsg").innerHTML = fb.msg;

    buildBreakdown();
    buildReview();
    saveBest(pct);

    show("result");
  }

  function feedbackFor(pct, missed) {
    if (pct === 100) {
      return {
        title: "Perfect score!",
        msg: "Every single question right. You are not revising any more – you are teaching. Try a chapter you found hard and see whether it still holds up."
      };
    }
    if (pct >= 85) {
      return {
        title: "Very strong.",
        msg: "You clearly understand the reasoning, not just the facts. Look at the " + missed +
             " question" + (missed === 1 ? "" : "s") + " below, watch " +
             (missed === 1 ? "that video" : "those videos") + " once more, and you are in good shape for the exam."
      };
    }
    if (pct >= 65) {
      return {
        title: "Solid – with a few gaps.",
        msg: "The basics are there. The topic bars below show exactly where the gaps are: revise those chapters in the script first, then run the quiz again."
      };
    }
    if (pct >= 40) {
      return {
        title: "A good start.",
        msg: "You got some of it, but several chapters still need work. Take the weakest topic below, read that chapter in the script, then come back and do just that chapter here."
      };
    }
    return {
      title: "Let's build this up.",
      msg: "Do not worry about the score – you have just found out exactly what to study. Pick one chapter from the start page, work through it slowly, and repeat. The videos are there for precisely this."
    };
  }

  function buildBreakdown() {
    const wrap = $("breakdown");
    wrap.innerHTML = "";

    const keys = [];
    state.answered.forEach((a) => { if (keys.indexOf(a.topic) === -1) keys.push(a.topic); });
    keys.sort();

    keys.forEach((key) => {
      const t = topicOf(key);
      const rows = state.answered.filter((a) => a.topic === key);
      const ok = rows.filter((a) => a.correct).length;
      const pct = Math.round((ok / rows.length) * 100);

      const row = document.createElement("div");
      row.className = "bd-row";
      row.innerHTML =
        '<span class="bd-key" style="background:' + t.colour + '">' + key + "</span>" +
        '<span class="bd-track"><span class="bd-fill" style="width:' + pct +
          "%;background:" + t.colour + '"></span></span>' +
        '<span class="bd-num">' + ok + "/" + rows.length + "</span>";
      row.title = t.name.replace(/&amp;/g, "&");
      wrap.appendChild(row);
    });
  }

  function buildReview() {
    const wrong = state.answered.filter((a) => !a.correct);
    const wrap = $("reviewWrap");
    const list = $("reviewList");

    if (!wrong.length) {
      wrap.hidden = true;
      $("btnRetryWrong").hidden = true;
      return;
    }

    list.innerHTML = "";
    wrong.forEach((a) => {
      const q = QUIZ_QUESTIONS.find((x) => x.id === a.id);
      const t = topicOf(q.topic);
      const li = document.createElement("li");
      li.innerHTML = "<b>" + q.topic + " – " + t.name + ":</b> " + q.takeaway;
      list.appendChild(li);
    });

    wrap.hidden = false;
    $("btnRetryWrong").hidden = false;
  }

  function saveBest(pct) {
    const note = $("bestNote");
    let best = null;
    try { best = Number(localStorage.getItem(BEST_KEY)); } catch (e) { /* private mode */ }

    if (best && best > pct) {
      note.hidden = false;
      note.textContent = "Your best run so far: " + best + "%.";
      return;
    }
    try { localStorage.setItem(BEST_KEY, String(pct)); } catch (e) { /* ignore */ }
    if (best && pct > best) {
      note.hidden = false;
      note.textContent = "New personal best – the old one was " + best + "%.";
    } else {
      note.hidden = true;
    }
  }

  function retryWrong() {
    const ids = state.answered.filter((a) => !a.correct).map((a) => a.id);
    start(QUIZ_QUESTIONS.filter((q) => ids.indexOf(q.id) !== -1));
  }

  /* ============================================ PERIODIC TABLE === */
  function buildPeriodicTable() {
    const grid = $("pseGrid");
    grid.innerHTML = "";

    /* the two cells that stand in for the f-block rows */
    [[6, 3, "57&ndash;71"], [7, 3, "89&ndash;103"]].forEach(([row, col, label]) => {
      const ph = document.createElement("div");
      ph.className = "el el-placeholder";
      ph.style.gridRow = row;
      ph.style.gridColumn = col;
      ph.innerHTML = '<span class="el-sym">' + label + "</span>";
      grid.appendChild(ph);
    });

    ELEMENTS.forEach(([z, sym, name, mass, cat]) => {
      const pos = elementPosition(z);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "el";
      btn.style.gridRow = pos.row;
      btn.style.gridColumn = pos.col;
      btn.style.setProperty("--el", ELEMENT_CATEGORIES[cat].colour);
      btn.innerHTML =
        '<span class="el-z">' + z + "</span>" +
        '<span class="el-sym">' + sym + "</span>" +
        '<span class="el-mass">' + mass + "</span>";
      btn.addEventListener("click", () => showElement(z, sym, name, mass, cat));
      btn.addEventListener("mouseenter", () => showElement(z, sym, name, mass, cat));
      grid.appendChild(btn);
    });

    const legend = $("pseLegend");
    legend.innerHTML = "";
    Object.keys(ELEMENT_CATEGORIES).forEach((key) => {
      const c = ELEMENT_CATEGORIES[key];
      const item = document.createElement("span");
      item.className = "lg";
      item.innerHTML = '<i style="background:' + c.colour + '"></i>' + c.label;
      legend.appendChild(item);
    });
  }

  function showElement(z, sym, name, mass, cat) {
    $("prZ").textContent = z;
    $("prSym").textContent = sym;
    $("prSym").style.color = ELEMENT_CATEGORIES[cat].colour;
    $("prName").textContent = name;
    $("prMass").innerHTML = "M = " + mass + " g/mol";
  }

  /* ==================================================== WIRING === */
  function init() {
    buildTopicGrid();
    buildPeriodicTable();

    $("btnStartAll").addEventListener("click", () => start(QUIZ_QUESTIONS));
    $("btnNext").addEventListener("click", next);
    $("btnRestart").addEventListener("click", () => show("start"));
    $("btnRetryWrong").addEventListener("click", retryWrong);

    const dlg = $("sourcesDialog");
    const open = () => (dlg.showModal ? dlg.showModal() : (dlg.open = true));
    $("btnSources").addEventListener("click", open);
    $("btnSources2").addEventListener("click", open);
    $("btnCloseSources").addEventListener("click", () => dlg.close());

    const pse = $("pseDialog");
    const openPse = () => (pse.showModal ? pse.showModal() : (pse.open = true));
    $("btnPse").addEventListener("click", openPse);
    $("btnClosePse").addEventListener("click", () => pse.close());

    /* P opens the periodic table from anywhere */
    document.addEventListener("keydown", (e) => {
      if (e.key !== "p" && e.key !== "P") return;
      if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      e.preventDefault();
      pse.open ? pse.close() : openPse();
    });

    /* keyboard: 1-4 to answer, Enter/Space to continue */
    document.addEventListener("keydown", (e) => {
      if (!screens.quiz.classList.contains("is-active")) return;
      if (pse.open || dlg.open) return;
      if (e.target.tagName === "BUTTON" && e.key === " ") return;
      if (e.target.tagName === "VIDEO") return;   // space/arrows belong to the player

      if (!state.locked && /^[1-4]$/.test(e.key)) {
        const btn = document.querySelector('.opt[data-slot="' + (Number(e.key) - 1) + '"]');
        if (btn) { e.preventDefault(); btn.click(); }
      } else if (state.locked && !$("btnNext").disabled && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
