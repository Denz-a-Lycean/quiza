
// ---------- FLASHCARD DATA ----------
const flashcards = [
    // Lesson 1
    ["L1", "Project", "A temporary undertaking created to produce a unique product, service, system, or result."],
    ["L1", "Project Management", "The organized process of planning, executing, monitoring, and completing a project."],
    ["L1", "Temporary (DNA)", "Has a defined beginning and finish line."],
    ["L1", "Unique (DNA)", "Creates a particular product, service, or result."],
    ["L1", "Resource-Constrained (DNA)", "Operates with limited people, money, tech, and time."],
    ["L1", "Value System (Macro)", "How projects fit into overarching organizational strategy and business objectives."],
    ["L1", "The 12 Principles (Philosophy)", "The behavioral compass and ethical guidelines directing all project work."],
    ["L1", "The 8 Domains (Execution)", "The active engine of concurrent, interrelated project performance activities."],
    ["L1", "Tailoring & Frameworks (Micro)", "Adapting methodologies (Agile, Waterfall) to fit unique organizational realities."],
    ["L1", "SMART Objectives", "Specific, Measurable, Achievable, Relevant, Time-bound."],
    ["L1", "Project Scope", "The total work and requirements needed to produce the project's expected deliverables."],
    ["L1", "Scope Creep", "The uncontrolled addition of requirements beyond agreed project boundaries."],
    ["L1", "Project Deliverables", "Measurable, tangible outputs produced by the project."],
    ["L1", "Project Constraints", "Scope, time, cost, quality, resources, risk — interconnected; changing one affects the others."],
    ["L1", "Project Charter (context)", "Turns an idea into an achievable, valuable outcome through structured planning."],
    ["L1", "Initiation (phase)", "Identify core purpose, initial objectives, key stakeholders; determine feasibility."],
    ["L1", "Planning (phase)", "Establish scope, schedule, budget, roles, quality standards, risk responses."],
    ["L1", "Execution (phase)", "Carry out planned activities, coordinate the team, produce deliverables."],
    ["L1", "Monitoring & Control (phase)", "Measure progress vs. plan, evaluate performance, manage risk, control changes."],
    ["L1", "Closing (phase)", "Obtain formal acceptance, transfer output, document lessons learned, complete the project."],
    ["L1", "Role of the Project Manager", "The conductor, not the soloist — ensures the team works together toward a shared goal."],
    ["L1", "Project vs. Operation", "A project is temporary and unique; an operation is ongoing and repetitive."],
    ["L1", "Output vs. Outcome vs. Value", "An output is produced by the project; an outcome happens because of it; value is the benefit created."],
    ["L1", "Business Analyst", "Gathers, analyzes, and documents stakeholder and system requirements."],
    ["L1", "UI/UX Designer", "Designs the user interface and user experience."],
    ["L1", "Programmer", "Develops and maintains the system software."],
    ["L1", "Database Developer", "Designs and manages the data architecture and database."],
    ["L1", "QA / Tester", "Tests the system and verifies that quality requirements are met."],
    // Lesson 2
    ["L2", "System", "A group of interconnected components that work together to achieve a common goal."],
    ["L2", "Systems View of PM", "An approach that examines a project as part of the larger organizational environment."],
    ["L2", "Systems Philosophy", "Views an organization and its projects as interconnected parts rather than separate activities."],
    ["L2", "Systems Analysis", "Identifying and evaluating a system's components, problems, requirements, relationships, solutions."],
    ["L2", "Systems Management", "Managing business, organizational, and technological factors so a system achieves its purpose."],
    ["L2", "Three-Sphere Model", "A framework examining a project from three perspectives: business, organization, technology."],
    ["L2", "Organization", "A structured group of people who work together using established roles, processes, resources."],
    ["L2", "Organizational Structure", "The arrangement of authority, responsibilities, communication, and reporting relationships."],
    ["L2", "Functional Structure", "Employees are grouped according to their areas of specialization or departments."],
    ["L2", "Projectized Structure", "Employees are primarily assigned to projects; the PM has substantial authority."],
    ["L2", "Matrix Structure", "Employees report to both a functional manager and a project manager."],
    ["L2", "Strong Matrix", "The project manager has greater authority and control over project resources."],
    ["L2", "Organizational Culture", "Shared values, beliefs, attitudes, expectations, and behaviors influencing how people work."],
    ["L2", "Resistance to Change", "The unwillingness or hesitation to accept a new system, procedure, or arrangement."],
    ["L2", "Project Governance", "The framework of policies, responsibilities, authority, and decision-making for a project."],
    ["L2", "Stakeholder", "Any person, group, or organization that can affect or be affected by a project."],
    ["L2", "Stakeholder Register", "A document with names, roles, interests, influence, expectations, communication needs."],
    ["L2", "Power–Interest Grid", "A tool to classify stakeholders by their level of authority and interest."],
    ["L2", "Project Charter", "A formal document that authorizes a project and gives the PM authority over resources."],
    ["L2", "Business Case", "Explains why a project is needed and what value/benefits it is expected to provide."],
    ["L2", "Feasibility Study", "Evaluates whether a project is technically, financially, operationally, legally achievable."],
    ["L2", "Project Sponsor", "Provides resources, organizational support, and high-level direction."],
    ["L2", "Project Team", "Performs the work needed to achieve project objectives."],
    ["L2", "End User", "Directly uses the project's final product, service, or system."],
    ["L2", "Stakeholder Management", "Identify, analyze, engage, communicate with, and monitor stakeholders."],
    ["L2", "Technical Feasibility", "Determines whether available technology, skills, and infrastructure can support the project."],
    ["L2", "Operational Feasibility", "Determines whether the system can function effectively within existing operations."],
    ["L2", "System Integration", "Connecting different applications, databases, devices, or platforms to work together."],
    ["L2", "Innovation", "Creating or implementing new ideas, approaches, technologies, or solutions."],
    ["L2", "DevSecOps", "Integrates security practices throughout software development and IT operations."],
    ["L2", "Cloud Computing", "Delivery of computing resources — storage, servers, databases, software — via the internet."],
];

const lessonLabel = { L1: "Lesson 1", L2: "Lesson 2" };

let fcOrder = flashcards.map((_, i) => i);
let fcIndex = 0;
let fcFlipped = false;
const fcCard = document.getElementById('fcCard');
const fcTerm = document.getElementById('fcTerm');
const fcDef = document.getElementById('fcDef');
const fcProgress = document.getElementById('fcProgress');
const fcLessonF = document.getElementById('fcLessonF');
const fcLessonB = document.getElementById('fcLessonB');

function renderFlashcard() {
    const idx = fcOrder[fcIndex];
    const [lesson, term, def] = flashcards[idx];
    fcTerm.textContent = term;
    fcDef.textContent = def;
    fcLessonF.textContent = lessonLabel[lesson];
    fcLessonB.textContent = lessonLabel[lesson];
    fcCard.classList.remove('flipped');
    fcFlipped = false;
    fcProgress.textContent = `Card ${fcIndex + 1} of ${flashcards.length}`;
}
fcCard.addEventListener('click', () => {
    fcFlipped = !fcFlipped;
    fcCard.classList.toggle('flipped', fcFlipped);
    fcCard.setAttribute('aria-label', fcFlipped ? 'Show flashcard term' : 'Show flashcard definition');
});
fcCard.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        fcCard.click();
    }
});
document.getElementById('fcNext').addEventListener('click', () => {
    fcIndex = (fcIndex + 1) % fcOrder.length; renderFlashcard();
});
document.getElementById('fcPrev').addEventListener('click', () => {
    fcIndex = (fcIndex - 1 + fcOrder.length) % fcOrder.length; renderFlashcard();
});
function shuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
document.getElementById('fcShuffle').addEventListener('click', () => {
    shuffleArr(fcOrder); fcIndex = 0; renderFlashcard();
});
renderFlashcard();

// ---------- QUIZ DATA ----------
const quizBank = [
    // Lesson 1
    { lesson: "L1", q: "What does the 'T' in the project DNA (T.U.G.R.C.) stand for?", options: ["Temporary", "Technical", "Targeted", "Timed"], answerText: "Temporary" },
    { lesson: "L1", q: "Which paradigm defines success purely by meeting scope, schedule, and budget?", options: ["Modern / Outcome-Driven", "Old / Output-Driven", "Agile Paradigm", "Systems Paradigm"], answerText: "Old / Output-Driven" },
    { lesson: "L1", q: "In the Anatomy of a Project Environment, which layer represents the 'active engine' of concurrent activities?", options: ["The Value System", "The 12 Principles", "The 8 Domains", "Tailoring & Frameworks"], answerText: "The 8 Domains" },
    { lesson: "L1", q: "Which SMART letter stands for 'the objective must have a deadline'?", options: ["Specific", "Measurable", "Achievable", "Time-bound"], answerText: "Time-bound" },
    { lesson: "L1", q: "What is scope creep?", options: ["A planned scope revision approved by the sponsor", "The uncontrolled addition of requirements beyond agreed boundaries", "A technique for estimating budget", "A stakeholder engagement strategy"], answerText: "The uncontrolled addition of requirements beyond agreed boundaries" },
    { lesson: "L1", q: "Which project life cycle phase is about obtaining formal acceptance and documenting lessons learned?", options: ["Initiation", "Planning", "Execution", "Closing"], answerText: "Closing" },
    { lesson: "L1", q: "According to the lesson, the Project Manager is best described as:", options: ["The soloist who performs every task", "The conductor who ensures the team works toward a shared goal", "An external auditor", "A passive observer"], answerText: "The conductor who ensures the team works toward a shared goal" },
    { lesson: "L1", q: "Which of these is NOT one of the 5 Building Blocks of Project Management?", options: ["Objectives", "Scope", "Deliverables", "Organizational Culture"], answerText: "Organizational Culture" },
    { lesson: "L1", q: "Which of the Six Golden Rules refers to keeping scope, time, cost, quality, resources, and risk in balance?", options: ["Embrace the Temporary", "Balance the Scale", "Anticipate Risk", "Control Change"], answerText: "Balance the Scale" },
    { lesson: "L1", q: "Per the PMBOK Guide 7th Edition quote in the lesson, what do projects ultimately enable?", options: ["Faster deadlines", "Outputs that drive outcomes delivering value", "Lower project costs", "Bigger project teams"], answerText: "Outputs that drive outcomes delivering value" },
    { lesson: "L1", q: "Which statement best distinguishes a project from a routine operation?", options: ["A project is ongoing and repetitive", "A project is temporary and unique", "An operation has a definite end", "An operation creates a unique result"], answerText: "A project is temporary and unique" },
    { lesson: "L1", q: "A working prototype is best classified as which project concept?", options: ["Objective", "Deliverable", "Constraint", "Stakeholder"], answerText: "Deliverable" },
    { lesson: "L1", q: "Who is primarily responsible for gathering and documenting system requirements?", options: ["QA / Tester", "Business Analyst", "Database Developer", "Project Sponsor"], answerText: "Business Analyst" },
    { lesson: "L1", q: "Who verifies that a system meets its quality requirements through testing?", options: ["UI/UX Designer", "Programmer", "QA / Tester", "End User"], answerText: "QA / Tester" },
    // Lesson 2
    { lesson: "L2", q: "Which matrix structure gives the project manager the most authority?", options: ["Weak Matrix", "Balanced Matrix", "Strong Matrix", "Functional Structure"], answerText: "Strong Matrix" },
    { lesson: "L2", q: "A stakeholder has high power but low interest. What's the engagement strategy?", options: ["Manage Closely", "Keep Satisfied", "Keep Informed", "Monitor"], answerText: "Keep Satisfied" },
    { lesson: "L2", q: "What document authorizes a project and gives the PM authority to use resources?", options: ["Business Case", "Feasibility Study", "Project Charter", "Stakeholder Register"], answerText: "Project Charter" },
    { lesson: "L2", q: "Which of the three spheres focuses on hardware, software, data, and infrastructure?", options: ["Business Sphere", "Organizational Sphere", "Technology Sphere", "Governance Sphere"], answerText: "Technology Sphere" },
    { lesson: "L2", q: "Which project phase is about 'keeping it on track'?", options: ["Initiation", "Planning", "Monitoring & Controlling", "Closure"], answerText: "Monitoring & Controlling" },
    { lesson: "L2", q: "In which structure are employees grouped by specialization/department?", options: ["Functional Structure", "Projectized Structure", "Matrix Structure", "Balanced Matrix"], answerText: "Functional Structure" },
    { lesson: "L2", q: "A stakeholder has low power but high interest. What's the strategy?", options: ["Manage Closely", "Keep Satisfied", "Keep Informed", "Monitor"], answerText: "Keep Informed" },
    { lesson: "L2", q: "What evaluates whether a project is technically, financially, operationally, and legally achievable?", options: ["Business Case", "Feasibility Study", "Project Charter", "Stakeholder Analysis"], answerText: "Feasibility Study" },
    { lesson: "L2", q: "Which approach integrates security practices throughout dev and operations?", options: ["DevOps", "DevSecOps", "Cloud Computing", "System Integration"], answerText: "DevSecOps" },
    { lesson: "L2", q: "What's the process of connecting different applications, databases, or platforms so they work together?", options: ["System Integration", "User Acceptance", "Data Privacy", "Technical Feasibility"], answerText: "System Integration" },
    { lesson: "L2", q: "Which term describes a stakeholder who belongs to the organization itself?", options: ["External Stakeholder", "Internal Stakeholder", "End User", "Vendor"], answerText: "Internal Stakeholder" },
    { lesson: "L2", q: "Which concept refers to an uncertain event or condition that may positively or negatively affect project objectives?", options: ["Project Constraint", "Project Risk", "Project Scope", "Project Governance"], answerText: "Project Risk" },
    { lesson: "L2", q: "Which stakeholder provides resources, organizational support, and high-level direction?", options: ["End User", "Project Sponsor", "QA / Tester", "Vendor"], answerText: "Project Sponsor" },
    { lesson: "L2", q: "What should be done with a high-power, low-interest stakeholder?", options: ["Manage Closely", "Keep Satisfied", "Keep Informed", "Monitor"], answerText: "Keep Satisfied" },
    { lesson: "L2", q: "A company has the technology to build a system, but its employees cannot use it effectively. What concern exists?", options: ["Technical feasibility", "Operational feasibility", "System integration", "Data privacy"], answerText: "Operational feasibility" },
    { lesson: "L2", q: "A company lacks the required hardware, skills, and infrastructure. What concern exists?", options: ["Operational feasibility", "Technical feasibility", "User acceptance", "Project governance"], answerText: "Technical feasibility" },
    { lesson: "L2", q: "Which sequence best describes stakeholder management?", options: ["Plan, build, test, close", "Identify, analyze, engage, communicate, monitor", "Scope, schedule, budget, deliver", "Design, code, integrate, deploy"], answerText: "Identify, analyze, engage, communicate, monitor" },
    { lesson: "L2", q: "What is innovation in a project context?", options: ["Repeating an existing process", "Creating or implementing new ideas, approaches, technologies, or solutions", "Limiting project scope", "Approving the project budget"], answerText: "Creating or implementing new ideas, approaches, technologies, or solutions" },
];

let quizQueue = [];
let quizIndex = 0;
let quizScore = 0;
let answered = false;
const quizArea = document.getElementById('quizArea');

function buildQuizQueue() {
    const q = quizBank.map(item => {
        const options = [...item.options];
        shuffleArr(options);
        const answerIndex = options.indexOf(item.answerText);
        return { lesson: item.lesson, q: item.q, options, answerIndex };
    });
    shuffleArr(q);
    return q;
}

function renderQuiz() {
    if (quizIndex >= quizQueue.length) {
        quizArea.innerHTML = `
        <div class="quiz-done">
          <div style="font-size:14px;color:var(--text-muted);">Quiz complete</div>
          <div class="quiz-score">${quizScore} / ${quizQueue.length}</div>
          <div class="quiz-score-sub">${quizScore === quizQueue.length ? "Perfect score! 🎉" : "Nice work — review the misses and try again."}</div>
          <button class="fc-btn primary" id="quizRestart">🔀 New Random Quiz</button>
        </div>`;
        document.getElementById('quizRestart').addEventListener('click', () => {
            quizQueue = buildQuizQueue(); quizIndex = 0; quizScore = 0; renderQuiz();
        });
        return;
    }

    answered = false;
    const item = quizQueue[quizIndex];
    const pct = Math.round((quizIndex / quizQueue.length) * 100);

    quizArea.innerHTML = `
      <div class="quiz-progress">Question ${quizIndex + 1} of ${quizQueue.length} · Score: ${quizScore}</div>
      <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${pct}%"></div></div>
      <div class="q-card">
        <div class="q-tag">${lessonLabel[item.lesson]}</div>
        <div class="q-text">${item.q}</div>
        <div id="opts"></div>
        <div class="q-feedback" id="qFeedback"></div>
      </div>
      <div class="quiz-nav">
        <button class="fc-btn primary" id="qNext" style="display:none;">Next →</button>
      </div>
    `;

    const optsDiv = document.getElementById('opts');
    item.options.forEach((opt, i) => {
        const btn = document.createElement('button');
                btn.type = 'button';
        btn.className = 'opt';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            if (answered) return;
            answered = true;
            const correct = i === item.answerIndex;
            if (correct) quizScore++;
            [...optsDiv.children].forEach((b, bi) => {
                b.disabled = true;
                if (bi === item.answerIndex) b.classList.add('correct');
                else if (bi === i) b.classList.add('incorrect');
            });
            document.getElementById('qFeedback').textContent = correct
                ? "Correct!"
                : `Not quite — correct answer: ${item.options[item.answerIndex]}`;
            document.getElementById('qNext').style.display = 'inline-block';
        });
        optsDiv.appendChild(btn);
    });

    document.getElementById('qNext').addEventListener('click', () => {
        quizIndex++; renderQuiz();
    });
}

quizQueue = buildQuizQueue();
renderQuiz();

// ---------- TABS ----------
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
        document.querySelectorAll('.panel').forEach(p => {
            const isActive = p.id === 'panel-' + btn.dataset.tab;
            p.classList.toggle('active', isActive);
            p.hidden = !isActive;
        });
        btn.classList.add('active');
    });
});
