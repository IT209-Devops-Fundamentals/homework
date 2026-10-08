/**
 * DevOps Master Quiz - Core Application Engine
 * Pure Vanilla JavaScript (Zero External Dependencies)
 * Features: Practice Mode, Timed Exam Simulation, Flashcards, Bookmarks, Audio Synth, Confetti
 */

(function () {
  "use strict";

  // =========================================================================
  // STATE MANAGEMENT & LOCAL STORAGE
  // =========================================================================
  const STORAGE_KEYS = {
    USER_ANSWERS: "devops_quiz_user_answers_v1",
    BOOKMARKS: "devops_quiz_bookmarks_v1",
    STREAK: "devops_quiz_streak_v1",
    THEME: "devops_quiz_theme_v1",
    SOUND: "devops_quiz_sound_v1"
  };

  const state = {
    allQuestions: Array.isArray(QUIZ_DATA) ? QUIZ_DATA : [],
    filteredQuestions: [],
    practiceIndex: 0,
    currentCategory: "all",
    searchQuery: "",
    currentMode: "practice", // 'practice' | 'exam' | 'flashcard' | 'bookmarks' | 'mistakes'

    // Persistent data
    userAnswers: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_ANSWERS) || "{}"),
    bookmarks: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || "[]")),
    streak: parseInt(localStorage.getItem(STORAGE_KEYS.STREAK) || "0", 10),
    isDarkTheme: localStorage.getItem(STORAGE_KEYS.THEME) !== "light",
    isSoundOn: localStorage.getItem(STORAGE_KEYS.SOUND) !== "false",

    // Flashcard State
    flashcardIndex: 0,
    flashcardFlipped: false,

    // Exam State
    exam: {
      active: false,
      type: "quick",
      questions: [],
      currentIndex: 0,
      userAnswers: {},
      flagged: new Set(),
      totalSeconds: 900,
      remainingSeconds: 900,
      timerId: null,
      submitted: false,
      startTime: null,
      result: null
    }
  };

  // =========================================================================
  // DOM ELEMENT REFERENCES
  // =========================================================================
  const DOM = {
    body: document.body,
    themeToggleBtn: document.getElementById("theme-toggle-btn"),
    themeIcon: document.getElementById("theme-icon"),
    soundToggleBtn: document.getElementById("sound-toggle-btn"),
    soundIcon: document.getElementById("sound-icon"),
    deployGuideBtn: document.getElementById("deploy-guide-btn"),
    deployModal: document.getElementById("deploy-modal"),
    closeDeployModal: document.getElementById("close-deploy-modal"),
    closeDeployModalBtn: document.getElementById("close-deploy-modal-btn"),
    copyDeployGuideBtn: document.getElementById("copy-deploy-guide-btn"),
    toastContainer: document.getElementById("toast-container"),
    confettiCanvas: document.getElementById("confetti-canvas"),

    // Search
    searchInput: document.getElementById("search-input"),
    clearSearchBtn: document.getElementById("clear-search-btn"),

    // Stats
    totalQuestionsStat: document.getElementById("total-questions-stat"),
    completedStat: document.getElementById("completed-stat"),
    accuracyStat: document.getElementById("accuracy-stat"),
    streakStat: document.getElementById("streak-stat"),
    bookmarkCountStat: document.getElementById("bookmark-count-stat"),
    resetProgressBtn: document.getElementById("reset-progress-btn"),
    bookmarkBadgeNum: document.getElementById("bookmark-badge-num"),
    mistakesBadgeNum: document.getElementById("mistakes-badge-num"),

    // Modes & Viewports
    modeTabs: document.querySelectorAll(".mode-tab"),
    sidebarFilters: document.getElementById("sidebar-filters"),
    filteredCount: document.getElementById("filtered-count"),
    categoryPills: document.querySelectorAll(".cat-pill"),

    // Views
    practiceView: document.getElementById("practice-view"),
    examView: document.getElementById("exam-view"),
    flashcardView: document.getElementById("flashcard-view"),
    bookmarksView: document.getElementById("bookmarks-view"),
    mistakesView: document.getElementById("mistakes-view"),

    // Practice View Elements
    currentTopicTag: document.getElementById("current-topic-tag"),
    questionIndexIndicator: document.getElementById("question-index-indicator"),
    bookmarkBtn: document.getElementById("bookmark-btn"),
    questionProgressBar: document.getElementById("question-progress-bar"),
    questionTitleText: document.getElementById("question-title-text"),
    optionsContainer: document.getElementById("options-container"),
    explanationBox: document.getElementById("explanation-box"),
    explanationText: document.getElementById("explanation-text"),
    prevQuestionBtn: document.getElementById("prev-question-btn"),
    nextQuestionBtn: document.getElementById("next-question-btn"),
    jumpSelect: document.getElementById("jump-select"),

    // Exam View Elements
    examSetupBox: document.getElementById("exam-setup-box"),
    configCards: document.querySelectorAll(".config-card"),
    startExamBtn: document.getElementById("start-exam-btn"),
    examPlayingBox: document.getElementById("exam-playing-box"),
    examTimerDisplay: document.getElementById("exam-timer-display"),
    examTimerDigits: document.getElementById("exam-timer-digits"),
    examAnsweredCounter: document.getElementById("exam-answered-counter"),
    submitExamBtn: document.getElementById("submit-exam-btn"),
    examQTopic: document.getElementById("exam-q-topic"),
    examQNumber: document.getElementById("exam-q-number"),
    examQTitle: document.getElementById("exam-q-title"),
    examOptionsContainer: document.getElementById("exam-options-container"),
    examPrevBtn: document.getElementById("exam-prev-btn"),
    examNextBtn: document.getElementById("exam-next-btn"),
    examFlagBtn: document.getElementById("exam-flag-btn"),
    examPaletteGrid: document.getElementById("exam-palette-grid"),

    // Exam Results Elements
    examResultBox: document.getElementById("exam-result-box"),
    resultPercentText: document.getElementById("result-percent-text"),
    resultFractionText: document.getElementById("result-fraction-text"),
    resultVerdictTitle: document.getElementById("result-verdict-title"),
    resultVerdictDesc: document.getElementById("result-verdict-desc"),
    resultTimeSpent: document.getElementById("result-time-spent"),
    resultHighestTopic: document.getElementById("result-highest-topic"),
    resultTopicBreakdown: document.getElementById("result-topic-breakdown"),
    reviewExamMistakesBtn: document.getElementById("review-exam-mistakes-btn"),
    retakeExamBtn: document.getElementById("retake-exam-btn"),
    backToPracticeBtn: document.getElementById("back-to-practice-btn"),
    examReviewSection: document.getElementById("exam-review-section"),
    examReviewQuestionsList: document.getElementById("exam-review-questions-list"),

    // Flashcard Elements
    flashcardCounter: document.getElementById("flashcard-counter"),
    shuffleFlashcardsBtn: document.getElementById("shuffle-flashcards-btn"),
    flashcardElement: document.getElementById("flashcard-element"),
    fcFrontTopic: document.getElementById("fc-front-topic"),
    fcFrontQuestion: document.getElementById("fc-front-question"),
    fcBackAnswer: document.getElementById("fc-back-answer"),
    fcBackExplanation: document.getElementById("fc-back-explanation"),
    fcPrevBtn: document.getElementById("fc-prev-btn"),
    fcFlipBtn: document.getElementById("fc-flip-btn"),
    fcNextBtn: document.getElementById("fc-next-btn"),

    // Custom List Views
    bookmarksListContainer: document.getElementById("bookmarks-list-container"),
    mistakesListContainer: document.getElementById("mistakes-list-container")
  };

  // =========================================================================
  // AUDIO SYNTHESIZER (Web Audio API - Pure synthesized SFX)
  // =========================================================================
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const Sound = {
    playClick() {
      if (!state.isSoundOn) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {
        /* ignore audio autoplay restrictions */
      }
    },

    playCorrect() {
      if (!state.isSoundOn) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
        });
      } catch (e) {}
    },

    playWrong() {
      if (!state.isSoundOn) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) {}
    },

    playVictory() {
      if (!state.isSoundOn) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
          gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.45);
        });
      } catch (e) {}
    }
  };

  // =========================================================================
  // TOAST & NOTIFICATIONS
  // =========================================================================
  function showToast(message, icon = "ℹ️") {
    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // =========================================================================
  // CANVAs CONFETTI CELEBRATION
  // =========================================================================
  function launchConfetti() {
    const canvas = DOM.confettiCanvas;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#38bdf8", "#818cf8", "#10b981", "#f59e0b", "#f43f5e", "#a855f7"];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.5,
        w: Math.random() * 9 + 4,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 5 + 3,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8
      });
    }

    let animationFrame;
    let frames = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frames++;
      if (frames < 200) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    render();
  }

  // =========================================================================
  // FILTERING & SEARCH
  // =========================================================================
  function filterQuestions() {
    let result = [...state.allQuestions];

    // Category Filter
    if (state.currentCategory === "git-all") {
      result = result.filter((q) => q.part === "git");
    } else if (state.currentCategory === "linux-all") {
      result = result.filter((q) => q.part === "linux");
    } else if (state.currentCategory !== "all") {
      result = result.filter((q) => q.topic === state.currentCategory);
    }

    // Keyword Search Filter
    if (state.searchQuery.trim()) {
      const qLower = state.searchQuery.toLowerCase().trim();
      result = result.filter(
        (q) =>
          q.question.toLowerCase().includes(qLower) ||
          q.topic.toLowerCase().includes(qLower) ||
          q.options.some((opt) => opt.toLowerCase().includes(qLower)) ||
          q.explanation.toLowerCase().includes(qLower)
      );
    }

    state.filteredQuestions = result;
    if (state.practiceIndex >= result.length) {
      state.practiceIndex = 0;
    }

    DOM.filteredCount.textContent = `${result.length} câu`;
    renderJumpSelect();
  }

  function renderJumpSelect() {
    DOM.jumpSelect.innerHTML = "";
    if (state.filteredQuestions.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "Không có câu hỏi";
      DOM.jumpSelect.appendChild(opt);
      return;
    }

    state.filteredQuestions.forEach((q, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      const isAns = state.userAnswers[q.id] !== undefined;
      const statusIcon = isAns ? (state.userAnswers[q.id].isCorrect ? "✓ " : "✗ ") : "";
      opt.textContent = `${statusIcon}Câu ${idx + 1}: ${q.topic} (#${q.id})`;
      if (idx === state.practiceIndex) opt.selected = true;
      DOM.jumpSelect.appendChild(opt);
    });
  }

  // =========================================================================
  // STATS & PROGRESS TRACKING
  // =========================================================================
  function updateGlobalStats() {
    const total = state.allQuestions.length;
    const answeredEntries = Object.values(state.userAnswers);
    const answeredCount = answeredEntries.length;
    const correctCount = answeredEntries.filter((a) => a.isCorrect).length;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    const mistakeCount = answeredEntries.filter((a) => !a.isCorrect).length;

    DOM.totalQuestionsStat.textContent = total;
    DOM.completedStat.textContent = `${answeredCount}/${total}`;
    DOM.accuracyStat.textContent = `${accuracy}%`;
    DOM.streakStat.textContent = `🔥 ${state.streak}`;
    DOM.bookmarkCountStat.textContent = `⭐ ${state.bookmarks.size}`;
    DOM.bookmarkBadgeNum.textContent = state.bookmarks.size;
    DOM.mistakesBadgeNum.textContent = mistakeCount;
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(state.userAnswers));
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(Array.from(state.bookmarks)));
    localStorage.setItem(STORAGE_KEYS.STREAK, state.streak.toString());
    updateGlobalStats();
  }

  // =========================================================================
  // PRACTICE MODE ENGINE
  // =========================================================================
  function renderPracticeQuestion() {
    if (state.filteredQuestions.length === 0) {
      DOM.questionTitleText.textContent = "Không tìm thấy câu hỏi nào phù hợp với bộ lọc!";
      DOM.optionsContainer.innerHTML = "";
      DOM.explanationBox.style.display = "none";
      DOM.currentTopicTag.textContent = "Trống";
      DOM.questionIndexIndicator.textContent = "0 / 0";
      DOM.questionProgressBar.style.width = "0%";
      DOM.prevQuestionBtn.disabled = true;
      DOM.nextQuestionBtn.disabled = true;
      return;
    }

    const q = state.filteredQuestions[state.practiceIndex];
    const total = state.filteredQuestions.length;

    // Meta tags
    DOM.currentTopicTag.textContent = q.topic;
    DOM.questionIndexIndicator.textContent = `Câu ${state.practiceIndex + 1} / ${total}`;
    DOM.questionProgressBar.style.width = `${((state.practiceIndex + 1) / total) * 100}%`;
    DOM.jumpSelect.value = state.practiceIndex;

    // Bookmarked button
    const isBookmarked = state.bookmarks.has(q.id);
    DOM.bookmarkBtn.classList.toggle("bookmarked", isBookmarked);
    DOM.bookmarkBtn.querySelector(".bookmark-icon").textContent = isBookmarked ? "★" : "☆";
    DOM.bookmarkBtn.querySelector(".btn-label").textContent = isBookmarked ? "Đã ghim" : "Ghim câu hỏi";

    // Nav button state
    DOM.prevQuestionBtn.disabled = state.practiceIndex === 0;
    DOM.nextQuestionBtn.disabled = state.practiceIndex === total - 1;

    // Render Question Title with safe HTML formatting (backticks to code)
    DOM.questionTitleText.innerHTML = formatCodeSnippets(q.question);

    // Options rendering
    DOM.optionsContainer.innerHTML = "";
    const letters = ["A", "B", "C", "D"];
    const savedAnswer = state.userAnswers[q.id];

    q.options.forEach((optText, idx) => {
      const optItem = document.createElement("div");
      optItem.className = "option-item";
      optItem.setAttribute("data-index", idx);

      const isThisCorrect = idx === q.answer;
      const wasSelected = savedAnswer && savedAnswer.selectedOption === idx;

      if (savedAnswer) {
        optItem.classList.add("disabled");
        if (isThisCorrect) {
          optItem.classList.add("correct");
        } else if (wasSelected) {
          optItem.classList.add("incorrect");
        }
      }

      optItem.innerHTML = `
        <div class="opt-prefix">${letters[idx]}</div>
        <div class="option-text">${formatCodeSnippets(optText)}</div>
      `;

      if (!savedAnswer) {
        optItem.addEventListener("click", () => handlePracticeSelect(idx));
      }

      DOM.optionsContainer.appendChild(optItem);
    });

    // Explanation Box
    if (savedAnswer) {
      DOM.explanationBox.style.display = "block";
      DOM.explanationText.innerHTML = formatCodeSnippets(q.explanation);
    } else {
      DOM.explanationBox.style.display = "none";
    }
  }

  function handlePracticeSelect(selectedIdx) {
    const q = state.filteredQuestions[state.practiceIndex];
    if (state.userAnswers[q.id] !== undefined) return;

    const isCorrect = selectedIdx === q.answer;

    // Update streak
    if (isCorrect) {
      state.streak += 1;
      Sound.playCorrect();
    } else {
      state.streak = 0;
      Sound.playWrong();
    }

    state.userAnswers[q.id] = {
      selectedOption: selectedIdx,
      isCorrect: isCorrect,
      answeredAt: new Date().toISOString()
    };

    saveState();
    renderPracticeQuestion();
    renderJumpSelect();
  }

  function formatCodeSnippets(str) {
    if (!str) return "";
    // Replace `code` with <code>code</code>
    return str.replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  // =========================================================================
  // EXAM MODE ENGINE (TIMED SIMULATION)
  // =========================================================================
  function initExamSetup() {
    DOM.configCards.forEach((card) => {
      card.addEventListener("click", () => {
        DOM.configCards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        state.exam.type = card.getAttribute("data-exam-type");
      });
    });

    DOM.startExamBtn.addEventListener("click", () => {
      startExam();
    });
  }

  function startExam() {
    Sound.playClick();
    const activeConfig = document.querySelector(".config-card.active");
    const count = parseInt(activeConfig.getAttribute("data-count"), 10) || 20;
    const minutes = parseInt(activeConfig.getAttribute("data-time"), 10) || 15;

    // Pick random questions from allQuestions
    const shuffled = [...state.allQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, count);

    state.exam = {
      active: true,
      type: state.exam.type,
      questions: selectedQuestions,
      currentIndex: 0,
      userAnswers: {},
      flagged: new Set(),
      totalSeconds: minutes * 60,
      remainingSeconds: minutes * 60,
      timerId: null,
      submitted: false,
      startTime: Date.now(),
      result: null
    };

    DOM.examSetupBox.style.display = "none";
    DOM.examResultBox.style.display = "none";
    DOM.examPlayingBox.style.display = "block";

    renderExamQuestion();
    renderExamPalette();
    startExamTimer();
    showToast(`Đã bắt đầu bài thi ${count} câu trong ${minutes} phút. Chúc bạn thi tốt!`, "🎯");
  }

  function startExamTimer() {
    clearInterval(state.exam.timerId);
    updateExamTimerDisplay();

    state.exam.timerId = setInterval(() => {
      state.exam.remainingSeconds--;
      updateExamTimerDisplay();

      if (state.exam.remainingSeconds <= 0) {
        clearInterval(state.exam.timerId);
        submitExam(true);
      }
    }, 1000);
  }

  function updateExamTimerDisplay() {
    const sec = Math.max(0, state.exam.remainingSeconds);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    const formatted = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    DOM.examTimerDigits.textContent = formatted;

    if (sec <= 120) {
      DOM.examTimerDisplay.classList.add("timer-danger");
    } else {
      DOM.examTimerDisplay.classList.remove("timer-danger");
    }
  }

  function renderExamQuestion() {
    const q = state.exam.questions[state.exam.currentIndex];
    const total = state.exam.questions.length;

    DOM.examQTopic.textContent = q.topic;
    DOM.examQNumber.textContent = `Câu ${state.exam.currentIndex + 1} / ${total}`;
    DOM.examQTitle.innerHTML = formatCodeSnippets(q.question);

    const answeredCount = Object.keys(state.exam.userAnswers).length;
    DOM.examAnsweredCounter.textContent = `Đã trả lời: ${answeredCount}/${total} câu`;

    // Flag button state
    const isFlagged = state.exam.flagged.has(q.id);
    DOM.examFlagBtn.classList.toggle("is-flagged", isFlagged);
    DOM.examFlagBtn.textContent = isFlagged ? "🚩 Bỏ cờ xem lại" : "🏳️ Đặt cờ xem lại";

    // Nav state
    DOM.examPrevBtn.disabled = state.exam.currentIndex === 0;
    DOM.examNextBtn.disabled = state.exam.currentIndex === total - 1;

    // Render Options (No reveal during exam!)
    DOM.examOptionsContainer.innerHTML = "";
    const letters = ["A", "B", "C", "D"];
    const currentAnswer = state.exam.userAnswers[q.id];

    q.options.forEach((optText, idx) => {
      const optItem = document.createElement("div");
      optItem.className = "option-item";
      if (currentAnswer === idx) {
        optItem.classList.add("selected-exam");
      }

      optItem.innerHTML = `
        <div class="opt-prefix">${letters[idx]}</div>
        <div class="option-text">${formatCodeSnippets(optText)}</div>
      `;

      optItem.addEventListener("click", () => {
        Sound.playClick();
        state.exam.userAnswers[q.id] = idx;
        renderExamQuestion();
        renderExamPalette();
      });

      DOM.examOptionsContainer.appendChild(optItem);
    });
  }

  function renderExamPalette() {
    DOM.examPaletteGrid.innerHTML = "";
    state.exam.questions.forEach((q, idx) => {
      const item = document.createElement("div");
      item.className = "palette-grid-item";
      item.textContent = idx + 1;

      if (idx === state.exam.currentIndex) item.classList.add("current");
      if (state.exam.userAnswers[q.id] !== undefined) item.classList.add("answered");
      if (state.exam.flagged.has(q.id)) item.classList.add("flagged");

      item.addEventListener("click", () => {
        Sound.playClick();
        state.exam.currentIndex = idx;
        renderExamQuestion();
        renderExamPalette();
      });

      DOM.examPaletteGrid.appendChild(item);
    });
  }

  function submitExam(isAuto = false) {
    if (!isAuto) {
      const total = state.exam.questions.length;
      const answered = Object.keys(state.exam.userAnswers).length;
      const unans = total - answered;
      let msg = "Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?";
      if (unans > 0) {
        msg = `Bạn còn ${unans} câu chưa trả lời. Bạn vẫn muốn nộp bài chứ?`;
      }
      if (!confirm(msg)) return;
    }

    clearInterval(state.exam.timerId);
    state.exam.active = false;
    state.exam.submitted = true;

    // Calculate Results
    let correct = 0;
    const topicStats = {};

    state.exam.questions.forEach((q) => {
      const userChoice = state.exam.userAnswers[q.id];
      const isCorrect = userChoice === q.answer;
      if (isCorrect) correct++;

      // Record to global user answers too
      if (userChoice !== undefined) {
        state.userAnswers[q.id] = {
          selectedOption: userChoice,
          isCorrect: isCorrect,
          answeredAt: new Date().toISOString()
        };
      }

      // Topic stats
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 };
      }
      topicStats[q.topic].total++;
      if (isCorrect) topicStats[q.topic].correct++;
    });

    saveState();

    const totalQuestions = state.exam.questions.length;
    const scorePct = Math.round((correct / totalQuestions) * 100);
    const timeSpentSec = state.exam.totalSeconds - state.exam.remainingSeconds;
    const mSpent = Math.floor(timeSpentSec / 60);
    const sSpent = timeSpentSec % 60;

    // Display Results View
    DOM.examPlayingBox.style.display = "none";
    DOM.examResultBox.style.display = "flex";

    DOM.resultPercentText.textContent = `${scorePct}%`;
    DOM.resultFractionText.textContent = `${correct}/${totalQuestions} Đúng`;
    DOM.resultTimeSpent.textContent = `⏱️ Thời gian: ${mSpent}p ${sSpent}s`;

    if (scorePct >= 80) {
      DOM.resultVerdictTitle.textContent = "🏆 Xuất Sắc - Senior DevOps!";
      DOM.resultVerdictDesc.textContent = "Bạn nắm rất vững cả kiến thức Git phân tán lẫn quản trị Ubuntu Linux Server.";
      Sound.playVictory();
      launchConfetti();
    } else if (scorePct >= 50) {
      DOM.resultVerdictTitle.textContent = "👍 Đạt Yêu Cầu - Cố Gắng Thêm!";
      DOM.resultVerdictDesc.textContent = "Bạn đã nắm được các nguyên tắc nền tảng, chỉ cần trau chuốt thêm các lệnh nâng cao.";
      Sound.playCorrect();
    } else {
      DOM.resultVerdictTitle.textContent = "📖 Cần Ôn Tập Thêm!";
      DOM.resultVerdictDesc.textContent = "Hãy xem lại danh sách câu sai và chuyển sang chế độ Flashcard để củng cố lý thuyết.";
      Sound.playWrong();
    }

    // Best topic
    let highestTopic = "Tổng hợp";
    let highestPct = -1;
    for (const [topic, val] of Object.entries(topicStats)) {
      const pct = (val.correct / val.total) * 100;
      if (pct > highestPct) {
        highestPct = pct;
        highestTopic = topic;
      }
    }
    DOM.resultHighestTopic.textContent = `🔥 Nổi bật: ${highestTopic}`;

    // Breakdown Bars
    DOM.resultTopicBreakdown.innerHTML = "";
    for (const [topic, val] of Object.entries(topicStats)) {
      const pct = Math.round((val.correct / val.total) * 100);
      const row = document.createElement("div");
      row.className = "topic-bar-row";
      row.innerHTML = `
        <div class="topic-bar-meta">
          <span>${topic}</span>
          <span>${val.correct}/${val.total} (${pct}%)</span>
        </div>
        <div class="topic-bar-track">
          <div class="topic-bar-fill" style="width: ${pct}%;"></div>
        </div>
      `;
      DOM.resultTopicBreakdown.appendChild(row);
    }

    // Build Detailed Review List
    DOM.examReviewSection.style.display = "none";
    renderExamDetailedReview();
  }

  function renderExamDetailedReview() {
    DOM.examReviewQuestionsList.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    state.exam.questions.forEach((q, idx) => {
      const userChoice = state.exam.userAnswers[q.id];
      const isCorrect = userChoice === q.answer;
      const card = document.createElement("div");
      card.className = `review-card-item ${isCorrect ? "was-correct" : "was-wrong"}`;

      let statusBadge = isCorrect
        ? `<span class="badge-pill" style="color: var(--success);"><span class="pulse-dot"></span> Đúng</span>`
        : `<span class="badge-pill" style="color: var(--danger);">✗ Sai hoặc Chưa làm</span>`;

      let userAnsText = userChoice !== undefined ? `${letters[userChoice]}. ${q.options[userChoice]}` : "Chưa chọn";
      let correctAnsText = `${letters[q.answer]}. ${q.options[q.answer]}`;

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="topic-tag">${q.topic} - Câu ${idx + 1}</span>
          ${statusBadge}
        </div>
        <h4 style="font-size:1.05rem;">${formatCodeSnippets(q.question)}</h4>
        <div style="font-size:0.9rem; display:flex; flex-direction:column; gap:0.3rem;">
          <div><strong>Lựa chọn của bạn:</strong> <span style="color:${isCorrect ? "var(--success)" : "var(--danger)"}">${formatCodeSnippets(userAnsText)}</span></div>
          <div><strong>Đáp án chuẩn xác:</strong> <span style="color:var(--success)">${formatCodeSnippets(correctAnsText)}</span></div>
        </div>
        <div class="explanation-box" style="margin-top:0.5rem; display:block;">
          <strong>💡 Giải thích:</strong> ${formatCodeSnippets(q.explanation)}
        </div>
      `;

      DOM.examReviewQuestionsList.appendChild(card);
    });
  }

  // =========================================================================
  // FLASHCARD ENGINE (3D MEMORY CARDS)
  // =========================================================================
  function renderFlashcard() {
    if (state.filteredQuestions.length === 0) {
      DOM.fcFrontTopic.textContent = "Trống";
      DOM.fcFrontQuestion.textContent = "Không có câu hỏi nào để hiển thị flashcard!";
      DOM.flashcardCounter.textContent = "0 / 0";
      return;
    }

    const q = state.filteredQuestions[state.flashcardIndex];
    const total = state.filteredQuestions.length;

    state.flashcardFlipped = false;
    DOM.flashcardElement.classList.remove("is-flipped");

    DOM.flashcardCounter.textContent = `Thẻ ${state.flashcardIndex + 1} / ${total}`;
    DOM.fcFrontTopic.textContent = q.topic;
    DOM.fcFrontQuestion.innerHTML = formatCodeSnippets(q.question);

    const letters = ["A", "B", "C", "D"];
    DOM.fcBackAnswer.innerHTML = `✓ ${letters[q.answer]}. ${formatCodeSnippets(q.options[q.answer])}`;
    DOM.fcBackExplanation.innerHTML = formatCodeSnippets(q.explanation);

    DOM.fcPrevBtn.disabled = state.flashcardIndex === 0;
    DOM.fcNextBtn.disabled = state.flashcardIndex === total - 1;
  }

  function flipFlashcard() {
    Sound.playClick();
    state.flashcardFlipped = !state.flashcardFlipped;
    DOM.flashcardElement.classList.toggle("is-flipped", state.flashcardFlipped);
  }

  // =========================================================================
  // BOOKMARKS & MISTAKES VIEWS
  // =========================================================================
  function renderBookmarksList() {
    DOM.bookmarksListContainer.innerHTML = "";
    const bookmarkedQuestions = state.allQuestions.filter((q) => state.bookmarks.has(q.id));

    if (bookmarkedQuestions.length === 0) {
      DOM.bookmarksListContainer.innerHTML = `
        <div class="list-empty-state">
          <span class="empty-icon">⭐</span>
          <h3>Chưa có câu hỏi nào được ghim</h3>
          <p>Khi luyện tập, bạn hãy bấm vào nút "Ghim câu hỏi" ở góc phải để lưu các câu hỏi hóc búa vào đây.</p>
        </div>
      `;
      return;
    }

    bookmarkedQuestions.forEach((q) => {
      const item = createQuestionSummaryCard(q, () => {
        // Unbookmark action
        state.bookmarks.delete(q.id);
        saveState();
        renderBookmarksList();
        showToast("Đã bỏ ghim câu hỏi", "🗑️");
      });
      DOM.bookmarksListContainer.appendChild(item);
    });
  }

  function renderMistakesList() {
    DOM.mistakesListContainer.innerHTML = "";
    const mistakeQuestions = state.allQuestions.filter(
      (q) => state.userAnswers[q.id] && !state.userAnswers[q.id].isCorrect
    );

    if (mistakeQuestions.length === 0) {
      DOM.mistakesListContainer.innerHTML = `
        <div class="list-empty-state">
          <span class="empty-icon">🎉</span>
          <h3>Tuyệt vời! Không có câu sai nào</h3>
          <p>Bạn chưa trả lời sai câu nào hoặc đã hoàn thành xuất sắc tất cả các câu đã làm.</p>
        </div>
      `;
      return;
    }

    mistakeQuestions.forEach((q) => {
      const item = createQuestionSummaryCard(q, null, () => {
        // Clear mistake and retry in practice
        delete state.userAnswers[q.id];
        saveState();
        switchToPracticeQuestion(q.id);
      });
      DOM.mistakesListContainer.appendChild(item);
    });
  }

  function createQuestionSummaryCard(q, onRemoveBookmark, onRetry) {
    const card = document.createElement("div");
    card.className = "quiz-card";
    const letters = ["A", "B", "C", "D"];

    let actionBtnHtml = "";
    if (onRemoveBookmark) {
      actionBtnHtml = `<button class="btn-ghost-sm unbookmark-action">⭐ Bỏ ghim</button>`;
    }
    if (onRetry) {
      actionBtnHtml = `<button class="btn-primary retry-action">🔄 Luyện lại câu này</button>`;
    }

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="topic-tag">${q.topic} - #${q.id}</span>
        <div>${actionBtnHtml}</div>
      </div>
      <h3 style="font-size:1.15rem; line-height:1.5;">${formatCodeSnippets(q.question)}</h3>
      <div style="background:var(--success-bg); border:1px solid var(--success-border); padding:0.75rem 1rem; border-radius:8px; font-size:0.92rem; color:var(--success);">
        <strong>Đáp án đúng:</strong> ${letters[q.answer]}. ${formatCodeSnippets(q.options[q.answer])}
      </div>
      <div class="explanation-content" style="font-size:0.9rem;">
        <strong>💡 Giải thích:</strong> ${formatCodeSnippets(q.explanation)}
      </div>
    `;

    if (onRemoveBookmark) {
      card.querySelector(".unbookmark-action").addEventListener("click", onRemoveBookmark);
    }
    if (onRetry) {
      card.querySelector(".retry-action").addEventListener("click", onRetry);
    }

    return card;
  }

  function switchToPracticeQuestion(questionId) {
    state.currentCategory = "all";
    DOM.categoryPills.forEach((p) => p.classList.toggle("active", p.getAttribute("data-category") === "all"));
    filterQuestions();

    const idx = state.filteredQuestions.findIndex((q) => q.id === questionId);
    if (idx !== -1) {
      state.practiceIndex = idx;
    }
    switchMode("practice");
  }

  // =========================================================================
  // VIEW MODE SWITCHER
  // =========================================================================
  function switchMode(newMode) {
    Sound.playClick();
    state.currentMode = newMode;

    // Update active tab buttons
    DOM.modeTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.getAttribute("data-mode") === newMode);
    });

    // Hide all view panels
    [DOM.practiceView, DOM.examView, DOM.flashcardView, DOM.bookmarksView, DOM.mistakesView].forEach(
      (v) => (v.className = "view-panel")
    );

    // Sidebar filter visibility
    if (newMode === "exam") {
      DOM.sidebarFilters.style.display = "none";
    } else {
      DOM.sidebarFilters.style.display = "flex";
    }

    // Show selected view
    switch (newMode) {
      case "practice":
        DOM.practiceView.className = "view-panel active";
        renderPracticeQuestion();
        break;
      case "exam":
        DOM.examView.className = "view-panel active";
        if (!state.exam.active && !state.exam.submitted) {
          DOM.examSetupBox.style.display = "block";
          DOM.examPlayingBox.style.display = "none";
          DOM.examResultBox.style.display = "none";
        }
        break;
      case "flashcard":
        DOM.flashcardView.className = "view-panel active";
        renderFlashcard();
        break;
      case "bookmarks":
        DOM.bookmarksView.className = "view-panel active";
        renderBookmarksList();
        break;
      case "mistakes":
        DOM.mistakesView.className = "view-panel active";
        renderMistakesList();
        break;
    }
  }

  // =========================================================================
  // EVENT LISTENERS & WIRING
  // =========================================================================
  function bindEvents() {
    // Mode tabs
    DOM.modeTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const mode = tab.getAttribute("data-mode");
        switchMode(mode);
      });
    });

    // Category pills in sidebar
    DOM.categoryPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        Sound.playClick();
        DOM.categoryPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        state.currentCategory = pill.getAttribute("data-category");
        filterQuestions();
        if (state.currentMode === "flashcard") {
          state.flashcardIndex = 0;
          renderFlashcard();
        } else {
          renderPracticeQuestion();
        }
      });
    });

    // Search bar
    DOM.searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      DOM.clearSearchBtn.style.display = state.searchQuery ? "block" : "none";
      filterQuestions();
      renderPracticeQuestion();
    });

    DOM.clearSearchBtn.addEventListener("click", () => {
      DOM.searchInput.value = "";
      state.searchQuery = "";
      DOM.clearSearchBtn.style.display = "none";
      filterQuestions();
      renderPracticeQuestion();
    });

    // Theme toggle
    DOM.themeToggleBtn.addEventListener("click", () => {
      Sound.playClick();
      state.isDarkTheme = !state.isDarkTheme;
      applyTheme();
    });

    // Sound toggle
    DOM.soundToggleBtn.addEventListener("click", () => {
      state.isSoundOn = !state.isSoundOn;
      localStorage.setItem(STORAGE_KEYS.SOUND, state.isSoundOn.toString());
      DOM.soundIcon.textContent = state.isSoundOn ? "🔊" : "🔇";
      showToast(state.isSoundOn ? "Đã bật âm thanh" : "Đã tắt âm thanh", state.isSoundOn ? "🔊" : "🔇");
      if (state.isSoundOn) Sound.playClick();
    });

    // Reset Progress
    DOM.resetProgressBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ làm bài không?")) {
        state.userAnswers = {};
        state.streak = 0;
        saveState();
        renderPracticeQuestion();
        renderJumpSelect();
        showToast("Đã làm mới lại toàn bộ tiến độ!", "🔄");
      }
    });

    // Practice Nav
    DOM.prevQuestionBtn.addEventListener("click", () => {
      if (state.practiceIndex > 0) {
        Sound.playClick();
        state.practiceIndex--;
        renderPracticeQuestion();
      }
    });

    DOM.nextQuestionBtn.addEventListener("click", () => {
      if (state.practiceIndex < state.filteredQuestions.length - 1) {
        Sound.playClick();
        state.practiceIndex++;
        renderPracticeQuestion();
      }
    });

    DOM.jumpSelect.addEventListener("change", (e) => {
      Sound.playClick();
      state.practiceIndex = parseInt(e.target.value, 10);
      renderPracticeQuestion();
    });

    // Bookmark Toggle Button
    DOM.bookmarkBtn.addEventListener("click", () => {
      Sound.playClick();
      if (state.filteredQuestions.length === 0) return;
      const q = state.filteredQuestions[state.practiceIndex];
      if (state.bookmarks.has(q.id)) {
        state.bookmarks.delete(q.id);
        showToast("Đã bỏ ghim câu hỏi", "☆");
      } else {
        state.bookmarks.add(q.id);
        showToast("Đã ghim câu hỏi vào danh sách ⭐", "★");
      }
      saveState();
      renderPracticeQuestion();
    });

    // Flashcard events
    DOM.flashcardElement.addEventListener("click", flipFlashcard);
    DOM.fcFlipBtn.addEventListener("click", flipFlashcard);

    DOM.fcPrevBtn.addEventListener("click", () => {
      if (state.flashcardIndex > 0) {
        Sound.playClick();
        state.flashcardIndex--;
        renderFlashcard();
      }
    });

    DOM.fcNextBtn.addEventListener("click", () => {
      if (state.flashcardIndex < state.filteredQuestions.length - 1) {
        Sound.playClick();
        state.flashcardIndex++;
        renderFlashcard();
      }
    });

    DOM.shuffleFlashcardsBtn.addEventListener("click", () => {
      Sound.playClick();
      state.filteredQuestions.sort(() => 0.5 - Math.random());
      state.flashcardIndex = 0;
      renderFlashcard();
      showToast("Đã xáo trộn ngẫu nhiên bộ thẻ flashcard!", "🔀");
    });

    // Exam Events
    initExamSetup();

    DOM.examPrevBtn.addEventListener("click", () => {
      if (state.exam.currentIndex > 0) {
        Sound.playClick();
        state.exam.currentIndex--;
        renderExamQuestion();
        renderExamPalette();
      }
    });

    DOM.examNextBtn.addEventListener("click", () => {
      if (state.exam.currentIndex < state.exam.questions.length - 1) {
        Sound.playClick();
        state.exam.currentIndex++;
        renderExamQuestion();
        renderExamPalette();
      }
    });

    DOM.examFlagBtn.addEventListener("click", () => {
      Sound.playClick();
      const q = state.exam.questions[state.exam.currentIndex];
      if (state.exam.flagged.has(q.id)) {
        state.exam.flagged.delete(q.id);
      } else {
        state.exam.flagged.add(q.id);
      }
      renderExamQuestion();
      renderExamPalette();
    });

    DOM.submitExamBtn.addEventListener("click", () => submitExam(false));

    DOM.reviewExamMistakesBtn.addEventListener("click", () => {
      DOM.examReviewSection.style.display =
        DOM.examReviewSection.style.display === "none" ? "flex" : "none";
      DOM.examReviewSection.scrollIntoView({ behavior: "smooth" });
    });

    DOM.retakeExamBtn.addEventListener("click", () => {
      state.exam.active = false;
      state.exam.submitted = false;
      DOM.examResultBox.style.display = "none";
      DOM.examSetupBox.style.display = "block";
    });

    DOM.backToPracticeBtn.addEventListener("click", () => {
      switchMode("practice");
    });

    // Deploy Modal Dialog
    DOM.deployGuideBtn.addEventListener("click", () => {
      Sound.playClick();
      DOM.deployModal.style.display = "flex";
    });

    const closeModal = () => (DOM.deployModal.style.display = "none");
    DOM.closeDeployModal.addEventListener("click", closeModal);
    DOM.closeDeployModalBtn.addEventListener("click", closeModal);
    DOM.deployModal.addEventListener("click", (e) => {
      if (e.target === DOM.deployModal) closeModal();
    });

    DOM.copyDeployGuideBtn.addEventListener("click", () => {
      const guideText = `=== HƯỚNG DẪN DEPLOY DEVOPS QUIZ LÊN GITHUB PAGES ===
Bước 1: Commit mã nguồn thư mục Quiz_Devops và push lên GitHub.
Bước 2: Vào GitHub Repo > Settings > Pages.
Bước 3: Chọn Build and deployment: Deploy from a branch, chọn branch main, thư mục /root.
Bước 4: Bấm Save và nhận link GitHub Pages!`;
      navigator.clipboard.writeText(guideText).then(() => {
        showToast("Đã sao chép hướng dẫn vào Clipboard!", "📋");
      });
    });

    // Keyboard Shortcuts
    document.addEventListener("keydown", (e) => {
      // Don't intercept when user is typing in search bar
      if (document.activeElement === DOM.searchInput) return;

      // Mode: Practice
      if (state.currentMode === "practice") {
        if (e.key === "ArrowLeft") {
          DOM.prevQuestionBtn.click();
        } else if (e.key === "ArrowRight") {
          DOM.nextQuestionBtn.click();
        } else {
          const keyUpper = e.key.toUpperCase();
          const keyMap = { A: 0, B: 1, C: 2, D: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
          if (keyMap[keyUpper] !== undefined) {
            handlePracticeSelect(keyMap[keyUpper]);
          }
        }
      }

      // Mode: Flashcard
      if (state.currentMode === "flashcard") {
        if (e.code === "Space") {
          e.preventDefault();
          flipFlashcard();
        } else if (e.key === "ArrowLeft") {
          DOM.fcPrevBtn.click();
        } else if (e.key === "ArrowRight") {
          DOM.fcNextBtn.click();
        }
      }

      // Mode: Exam
      if (state.currentMode === "exam" && state.exam.active) {
        if (e.key === "ArrowLeft") {
          DOM.examPrevBtn.click();
        } else if (e.key === "ArrowRight") {
          DOM.examNextBtn.click();
        } else {
          const keyUpper = e.key.toUpperCase();
          const keyMap = { A: 0, B: 1, C: 2, D: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
          if (keyMap[keyUpper] !== undefined) {
            const q = state.exam.questions[state.exam.currentIndex];
            state.exam.userAnswers[q.id] = keyMap[keyUpper];
            renderExamQuestion();
            renderExamPalette();
          }
        }
      }
    });
  }

  function applyTheme() {
    DOM.body.classList.toggle("dark-theme", state.isDarkTheme);
    DOM.body.classList.toggle("light-theme", !state.isDarkTheme);
    DOM.themeIcon.textContent = state.isDarkTheme ? "🌙" : "☀️";
    localStorage.setItem(STORAGE_KEYS.THEME, state.isDarkTheme ? "dark" : "light");
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  function init() {
    applyTheme();
    DOM.soundIcon.textContent = state.isSoundOn ? "🔊" : "🔇";
    filterQuestions();
    updateGlobalStats();
    renderPracticeQuestion();
    bindEvents();
    console.log("⚡ DevOps Master Quiz Engine Initialized successfully with 68 questions!");
  }

  // Bootstrapping
  document.addEventListener("DOMContentLoaded", init);
})();
