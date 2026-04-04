async function loadQuiz(jsonPath) {
  try {
    const loadingEl = document.getElementById("loading-message");
    if (loadingEl) loadingEl.style.display = "block";
    const res = await fetch(jsonPath);
    const quizzes = await res.json();
    const groupedQuestions = groupQuestionsByDependency(quizzes);
    startQuiz({
      title: "Mathematics Comprehensive Quiz",
      questionGroups: groupedQuestions,
    });
  } catch (err) {
    console.error("Error loading quiz:", err);
    const container = document.getElementById("quiz-container");
    if (container)
      container.innerHTML = `<div style="color:#721c24;background:#f8d7da;padding:16px;border-radius:8px;">Error loading quiz data. Check console.</div>`;
    throw err;
  }
}
function groupQuestionsByDependency(quizzes) {
  const all = [];
  quizzes.forEach((unit) => {
    const unitData = unit.data || null;
    (unit.questions || []).forEach((q) => {
      all.push({
        ...q,
        unit: unit.title || unit.id,
        data: q.data || unitData,
      });
    });
  });
  const groups = [];
  const used = new Set();
  all.forEach((question) => {
    if (used.has(question)) return;
    if (question.data) {
      const relatedQuestions = all.filter(
        (q) =>
          !used.has(q) &&
          q.data &&
          ((q.data.id && q.data.id === question.data.id) ||
            (q.data.type === question.data.type &&
              JSON.stringify(q.data) === JSON.stringify(question.data)))
      );
      if (relatedQuestions.length > 0) {
        groups.push({
          data: question.data,
          questions: shuffleArray(relatedQuestions),
        });
        relatedQuestions.forEach((q) => used.add(q));
      }
    }
    if (!used.has(question)) {
      groups.push({
        data: question.data,
        questions: [question],
      });
      used.add(question);
    }
  });
  return shuffleArray(groups);
}
// Fisher-Yates
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function startQuiz(quiz) {
  let currentGroupIndex = 0;
  let currentQuestionIndex = 0;
  let score = 0;
  let questionNumber = 1;
  let results = [];
  const totalQuestions = quiz.questionGroups.reduce(
    (sum, group) => sum + group.questions.length,
    0
  );
  const container = document.getElementById("quiz-container");
  if (!container) return;
  showQuestion();
  function showQuestion() {
    const group = quiz.questionGroups[currentGroupIndex];
    const q = group.questions[currentQuestionIndex];
    container.innerHTML = "";
    // Progress bar
    const progress = document.createElement("div");
    progress.className = "progress-bar";
    const progressPercent = ((questionNumber - 1) / totalQuestions) * 100;
    progress.innerHTML = `
      <div class="progress-text">Question ${questionNumber} of ${totalQuestions}</div>
      <div class="progress-visual">
        <div class="progress-fill" style="width: ${progressPercent}%"></div>
      </div>
    `;
    container.appendChild(progress);
    // Shared data display
    if (group.data) {
      const dataContainer = document.createElement("div");
      dataContainer.className = "data-container";
      if (
        group.data.type === "FDT" &&
        Array.isArray(group.data.headers) &&
        Array.isArray(group.data.rows)
      ) {
        const thead = `<tr>${group.data.headers
          .map((h) => `<th>${h}</th>`)
          .join("")}</tr>`;
        const tbody = group.data.rows
          .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`)
          .join("");
        dataContainer.innerHTML = `
          <div class="data-title">${
            group.data.title || "Frequency Distribution Table"
          }</div>
          <table class="data-table">
            <thead>${thead}</thead>
            <tbody>${tbody}</tbody>
          </table>
          ${
            group.data.note
              ? `<div class="data-note">${group.data.note}</div>`
              : ""
          }
        `;
      } else if (
        group.data.type === "raw" &&
        Array.isArray(group.data.values)
      ) {
        dataContainer.innerHTML = `
          <div class="data-title">${group.data.title || "Raw Data"}</div>
          <div class="data-values">${group.data.values.join(", ")}</div>
        `;
      } else if (group.data.title || group.data.content) {
        dataContainer.innerHTML = `
          <div class="data-title">${group.data.title || ""}</div>
          <div class="data-values">${group.data.content || ""}</div>
        `;
      }
      container.appendChild(dataContainer);
    }
    // Question card
    const card = document.createElement("div");
    card.className = "question-card";
    // Exit-to-review button (top-right corner)
    const exitBtn = document.createElement("button");
    exitBtn.className = "exit-review-button";
    exitBtn.title = "Exit to review";
    exitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    exitBtn.onclick = () => {
      // Mark all remaining questions as skipped then show results
      let qNum = questionNumber;
      for (let gi = currentGroupIndex; gi < quiz.questionGroups.length; gi++) {
        const grp = quiz.questionGroups[gi];
        const startQ = gi === currentGroupIndex ? currentQuestionIndex : 0;
        for (let qi = startQ; qi < grp.questions.length; qi++) {
          const remaining = grp.questions[qi];
          let correctIndex;
          if (Array.isArray(remaining.answer)) correctIndex = remaining.answer[0];
          else correctIndex = remaining.answer;
          results.push({
            questionNumber: qNum++,
            question: remaining,
            selectedIndex: null,
            correctIndex,
            isCorrect: null,
            skipped: true,
            unit: remaining.unit
          });
        }
      }
      showResults();
    };
    card.appendChild(exitBtn);
    const header = document.createElement("div");
    header.className = "question-header";
    const difficultySpan = q.difficulty
      ? `<span class="difficulty-tag difficulty-${
          q.difficulty
        }">${q.difficulty.toUpperCase()}</span>`
      : "";
    header.innerHTML = `<div class="unit-tag">${escapeHtml(
      q.unit || ""
    )}</div><h3 class="question-text">Q${questionNumber}: ${escapeHtml(
      q.question
    )} ${difficultySpan}</h3>`;
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options-grid";
    (q.options || []).forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-button";
      btn.textContent = opt;
      btn.onclick = () => handleAnswer(idx, btn, q, optionsDiv, card);
      optionsDiv.appendChild(btn);
    });
    card.appendChild(header);
    card.appendChild(optionsDiv);
    container.appendChild(card);
  }
  function moveToNext() {
    const group = quiz.questionGroups[currentGroupIndex];
    const atLastInGroup = currentQuestionIndex >= group.questions.length - 1;
    if (!atLastInGroup) {
      currentQuestionIndex++;
    } else {
      currentGroupIndex++;
      currentQuestionIndex = 0;
    }
    questionNumber++;
    if (currentGroupIndex < quiz.questionGroups.length) {
      showQuestion();
    } else {
      showResults();
    }
  }
  function handleAnswer(selectedIndex, btn, q, optionsDiv, card, skipped = false) {
    let correctIndex;
    if (Array.isArray(q.answer)) {
      correctIndex = q.answer[0];
    } else if (typeof q.answer === "number") {
      correctIndex = q.answer;
    } else {
      console.error("Invalid answer format for question:", q);
      return;
    }
    const isCorrect = skipped ? null : selectedIndex === correctIndex;
    if (isCorrect) score++;
    results.push({
      questionNumber,
      question: q,
      selectedIndex,
      correctIndex,
      isCorrect,
      skipped,
      unit: q.unit
    });
    // Hide exit button once answered
    const exitBtn = card.querySelector(".exit-review-button");
    if (exitBtn) exitBtn.style.display = "none";
    if (!skipped) {
      const resultDiv = document.createElement("div");
      resultDiv.className = `answer-feedback ${
        isCorrect ? "correct" : "incorrect"
      }`;
      resultDiv.innerHTML = `
        <div class="feedback-text">
          <h3>${isCorrect ? "Correct!" : "Wrong!"}</h3>
          <p class="explanation">${escapeHtml(q.explanation || "")}</p>
        </div>
      `;
      card.appendChild(resultDiv);
      optionsDiv.querySelectorAll("button").forEach((b, i) => {
        b.disabled = true;
        if (i === correctIndex) b.classList.add("correct-answer");
        if (i === selectedIndex && selectedIndex !== correctIndex)
          b.classList.add("wrong-answer");
      });
    }
    const nav = document.createElement("div");
    nav.style.marginTop = "12px";
    const nextBtn = document.createElement("button");
    nextBtn.className = "next-button";
    const group = quiz.questionGroups[currentGroupIndex];
    const atLastInGroup = currentQuestionIndex >= group.questions.length - 1;
    const atLastOverall =
      currentGroupIndex >= quiz.questionGroups.length - 1 && atLastInGroup;
    nextBtn.textContent = atLastOverall
      ? "See Final Results"
      : "Next Question";
    nextBtn.onclick = () => moveToNext();
    nav.appendChild(nextBtn);
    card.appendChild(nav);
  }
  function showResults() {
    container.innerHTML = "";
    const correctAnswers = results.filter(r => r.isCorrect === true).length;
    const wrongCount = results.filter(r => r.isCorrect === false).length;
    const skippedCount = results.filter(r => r.skipped).length;
    const reviewHtml = `
      <div class="review-wrap">
        <div class="score-strip">
          <div class="score-chip c">
            <span class="chip-dot"></span>
            <span class="chip-num">${correctAnswers}</span>
            <span class="chip-lbl">Correct</span>
          </div>
          <div class="score-chip w">
            <span class="chip-dot"></span>
            <span class="chip-num">${wrongCount}</span>
            <span class="chip-lbl">Wrong</span>
          </div>
          <div class="score-chip s">
            <span class="chip-dot"></span>
            <span class="chip-num">${skippedCount}</span>
            <span class="chip-lbl">Skipped</span>
          </div>
          <div class="score-chip">
            <span class="chip-dot"></span>
            <span class="chip-num">${totalQuestions}</span>
            <span class="chip-lbl">Total</span>
          </div>
        </div>

        <p class="section-heading">Answer review</p>

        <div class="review-list">
          ${results
            .map((result) => {
              const status = result.skipped
                ? "Skipped"
                : result.isCorrect
                ? "Correct"
                : "Wrong";
              const statusClass = result.skipped
                ? "skipped"
                : result.isCorrect
                ? "correct"
                : "wrong";
              const userAnswer = result.skipped
                ? "Not answered"
                : result.selectedIndex !== null
                ? result.question.options[result.selectedIndex]
                : "Not answered";
              const correctAnswer = result.question.options[result.correctIndex];
              return `
                <div class="rv-card ${statusClass}">
                  <div class="card-header">
                    <span class="q-num">Q${result.questionNumber}</span>
                    <span class="unit-tag">${escapeHtml(result.unit || "")}</span>
                    <span class="status-tag">${status}</span>
                  </div>
                  <p class="card-question">${escapeHtml(result.question.question)}</p>
                  <div class="answer-block">
                    <div class="answer-row">
                      <span class="answer-label">Your answer</span>
                      <span class="answer-val ${result.skipped ? "val-skipped" : result.isCorrect ? "val-correct" : "val-wrong"}">${escapeHtml(userAnswer)}</span>
                    </div>
                    <div class="answer-divider"></div>
                    <div class="answer-row">
                      <span class="answer-label">Correct answer</span>
                      <span class="answer-val val-correct">${escapeHtml(correctAnswer)}</span>
                    </div>
                  </div>
                  <div class="expl-block">
                    <p class="expl-label">Why</p>
                    <p class="expl-text">${escapeHtml(result.question.explanation || "")}</p>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>

        <button class="retake-btn" onclick="location.reload()">Take Quiz Again</button>
      </div>
    `;
    container.innerHTML = reviewHtml;
  }
  function escapeHtml(s) {
    if (!s && s !== 0) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/([¬∧∨→↔])/g, '<span class="logical-symbol">$1</span>');
  }
}
window.loadQuiz = loadQuiz;