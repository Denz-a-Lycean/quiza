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
    progress.textContent = `Question ${questionNumber} of ${totalQuestions}`;
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

  function handleAnswer(selectedIndex, btn, q, optionsDiv, card) {
    let correctIndex;
    if (Array.isArray(q.answer)) {
      correctIndex = q.answer[0];
    } else if (typeof q.answer === "number") {
      correctIndex = q.answer;
    } else {
      console.error("Invalid answer format for question:", q);
      return;
    }
    const isCorrect = selectedIndex === correctIndex;
    if (isCorrect) score++;
    const resultDiv = document.createElement("div");
    resultDiv.className = `answer-feedback ${
      isCorrect ? "correct" : "incorrect"
    }`;
    resultDiv.innerHTML = `
      <div class="result-icon">${isCorrect ? "✅" : "❌"}</div>
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
    const nav = document.createElement("div");
    nav.style.marginTop = "12px";
    const nextBtn = document.createElement("button");
    nextBtn.className = "next-button";
    const group = quiz.questionGroups[currentGroupIndex];
    const atLastInGroup = currentQuestionIndex >= group.questions.length - 1;
    const atLastOverall =
      currentGroupIndex >= quiz.questionGroups.length - 1 && atLastInGroup;
    nextBtn.textContent = atLastOverall
      ? "See Final Results 🎯"
      : "Next Question ➡️";
    nextBtn.onclick = () => {
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
    };
    nav.appendChild(nextBtn);
    card.appendChild(nav);
  }

  function showResults() {
    container.innerHTML = "";
    const percentage = totalQuestions ? (score / totalQuestions) * 100 : 0;
    const grade =
      percentage >= 90
        ? "A"
        : percentage >= 80
        ? "B"
        : percentage >= 70
        ? "C"
        : percentage >= 60
        ? "D"
        : "F";
    const html = `
      <div class="results-container">
        <h2>Quiz Complete! 🎉</h2>
        <div class="score-display">
          <div class="score-circle ${grade.toLowerCase()}">
            <span class="percentage">${percentage.toFixed(1)}%</span>
            <span class="grade">Grade ${grade}</span>
          </div>
          <h3>Score: ${score} out of ${totalQuestions}</h3>
        </div>
        <div class="restart-button">
          <button onclick="location.reload()">Try Again ↺</button>
        </div>
      </div>
    `;
    container.innerHTML = html;
  }

  function escapeHtml(s) {
    if (!s && s !== 0) return "";
    // Process logical symbols with special styling
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/([¬∧∨→↔])/g, '<span class="logical-symbol">$1</span>');
  }
}

// expose to global
// Export loadQuiz to global scope
window.loadQuiz = loadQuiz;
