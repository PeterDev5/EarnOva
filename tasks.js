
/* ==========================================
   EARNOVA TASK + SURVEY SYSTEM 2.1
   Tasks • Surveys • Rewards • XP
========================================== */

(function () {
  "use strict";

  const TASK_KEY = "earnova_task_data";
  const PLAYER_KEY = "earnova_player_data";
  const SURVEY_KEY = "earnova_survey_data";

  /* ==========================================
     TASK POSTS
  ========================================== */

  const tasks = [
    {
      id: "task_001",
      title: "Visit a Website",
      description: "Visit the assigned website and stay for 30 seconds.",
      category: "Website",
      reward: 5,
      xp: 10,
      icon: "🌐",
      duration: "30 seconds"
    },
    {
      id: "task_002",
      title: "Telegram Channel Join",
      description: "Join the specified Telegram channel.",
      category: "Social",
      reward: 8,
      xp: 15,
      icon: "✈️",
      duration: "1 minute"
    },
    {
      id: "task_003",
      title: "Read an Article",
      description: "Read the assigned article carefully.",
      category: "Website",
      reward: 6,
      xp: 10,
      icon: "📖",
      duration: "2 minutes"
    },
    {
      id: "task_004",
      title: "App Testing",
      description: "Test an application and submit your feedback.",
      category: "Apps",
      reward: 15,
      xp: 25,
      icon: "📱",
      duration: "5 minutes"
    },
    {
      id: "task_005",
      title: "Social Media Follow",
      description: "Follow the specified social media account.",
      category: "Social",
      reward: 7,
      xp: 12,
      icon: "👥",
      duration: "1 minute"
    },
    {
      id: "task_006",
      title: "Mini Survey",
      description: "Complete a short survey.",
      category: "Survey",
      reward: 12,
      xp: 20,
      icon: "📝",
      duration: "3 minutes"
    },
    {
      id: "task_007",
      title: "Signup Task",
      description: "Complete a demo signup task.",
      category: "Signup",
      reward: 20,
      xp: 30,
      icon: "🎯",
      duration: "5 minutes"
    },
    {
      id: "task_008",
      title: "Video Watch",
      description: "Watch the assigned video.",
      category: "Video",
      reward: 5,
      xp: 10,
      icon: "🎬",
      duration: "2 minutes"
    },
    {
      id: "task_009",
      title: "Feedback Task",
      description: "Provide useful feedback about a product.",
      category: "Micro Task",
      reward: 10,
      xp: 20,
      icon: "💬",
      duration: "3 minutes"
    },
    {
      id: "task_010",
      title: "Data Entry",
      description: "Complete a simple data entry task.",
      category: "Micro Task",
      reward: 15,
      xp: 25,
      icon: "⌨️",
      duration: "4 minutes"
    }
  ];

  /* ==========================================
     SURVEY POSTS
  ========================================== */

  const surveys = [
    {
      id: "survey_001",
      title: "Shopping Habits",
      description: "Tell us about your shopping preferences.",
      category: "Product",
      icon: "🛍️",
      reward: 15,
      xp: 25,
      duration: "3 minutes",
      questions: [
        {
          question: "How often do you shop online?",
          options: [
            "Every week",
            "Every month",
            "Occasionally",
            "Rarely"
          ]
        },
        {
          question: "What do you usually purchase online?",
          options: [
            "Electronics",
            "Clothing",
            "Food",
            "Other products"
          ]
        },
        {
          question: "Which factor is most important?",
          options: [
            "Price",
            "Quality",
            "Delivery",
            "Reviews"
          ]
        }
      ]
    },

    {
      id: "survey_002",
      title: "Technology Survey",
      description: "Share your technology preferences.",
      category: "Technology",
      icon: "📱",
      reward: 20,
      xp: 35,
      duration: "4 minutes",
      questions: [
        {
          question: "Which device do you use most?",
          options: [
            "Smartphone",
            "Laptop",
            "Desktop",
            "Tablet"
          ]
        },
        {
          question: "How often do you use the internet?",
          options: [
            "All day",
            "Several times daily",
            "Once daily",
            "Occasionally"
          ]
        },
        {
          question: "Which technology interests you most?",
          options: [
            "Artificial Intelligence",
            "Gaming",
            "Smartphones",
            "Robotics"
          ]
        }
      ]
    },

    {
      id: "survey_003",
      title: "Lifestyle Survey",
      description: "Share your everyday lifestyle preferences.",
      category: "Lifestyle",
      icon: "🌍",
      reward: 12,
      xp: 20,
      duration: "2 minutes",
      questions: [
        {
          question: "What do you enjoy in your free time?",
          options: [
            "Gaming",
            "Watching videos",
            "Reading",
            "Sports"
          ]
        },
        {
          question: "How often do you exercise?",
          options: [
            "Daily",
            "Several times weekly",
            "Rarely",
            "Never"
          ]
        },
        {
          question: "Which is your preferred entertainment?",
          options: [
            "Movies",
            "Music",
            "Games",
            "Social Media"
          ]
        }
      ]
    },

    {
      id: "survey_004",
      title: "Market Research",
      description: "Help us understand consumer preferences.",
      category: "Market Research",
      icon: "📈",
      reward: 25,
      xp: 40,
      duration: "5 minutes",
      questions: [
        {
          question: "What influences your purchasing decision?",
          options: [
            "Price",
            "Brand",
            "Quality",
            "Recommendations"
          ]
        },
        {
          question: "Where do you discover products?",
          options: [
            "Social Media",
            "Friends",
            "Advertisements",
            "Search Engines"
          ]
        },
        {
          question: "Would you try a new brand?",
          options: [
            "Definitely",
            "Probably",
            "Maybe",
            "No"
          ]
        }
      ]
    },

    {
      id: "survey_005",
      title: "Mobile App Experience",
      description: "Tell us about your mobile app usage.",
      category: "Technology",
      icon: "📲",
      reward: 18,
      xp: 30,
      duration: "3 minutes",
      questions: [
        {
          question: "Which type of app do you use most?",
          options: [
            "Social Media",
            "Games",
            "Shopping",
            "Productivity"
          ]
        },
        {
          question: "What makes an app better?",
          options: [
            "Fast Performance",
            "Simple Design",
            "Useful Features",
            "Security"
          ]
        },
        {
          question: "Do you try new apps?",
          options: [
            "Frequently",
            "Sometimes",
            "Rarely",
            "Never"
          ]
        }
      ]
    },

    {
      id: "survey_006",
      title: "Food Preferences",
      description: "Share your favorite foods and eating habits.",
      category: "Lifestyle",
      icon: "🍔",
      reward: 10,
      xp: 15,
      duration: "2 minutes",
      questions: [
        {
          question: "What type of food do you prefer?",
          options: [
            "Traditional Food",
            "Fast Food",
            "Healthy Food",
            "Street Food"
          ]
        },
        {
          question: "How often do you eat outside?",
          options: [
            "Daily",
            "Weekly",
            "Monthly",
            "Rarely"
          ]
        },
        {
          question: "What matters most in food?",
          options: [
            "Taste",
            "Price",
            "Health",
            "Quality"
          ]
        }
      ]
    }
  ];

  /* ==========================================
     STORAGE
  ========================================== */

  function getData(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  }

  function getTaskData() {
    const data = getData(TASK_KEY, {
      completed: [],
      started: []
    });

    return {
      completed: Array.isArray(data.completed) ? data.completed : [],
      started: Array.isArray(data.started) ? data.started : []
    };
  }

  function saveTaskData(data) {
    localStorage.setItem(TASK_KEY, JSON.stringify(data));
  }

  function getSurveyData() {
    const data = getData(SURVEY_KEY, {
      completed: [],
      answers: {}
    });

    return {
      completed: Array.isArray(data.completed) ? data.completed : [],
      answers: data.answers || {}
    };
  }

  function saveSurveyData(data) {
    localStorage.setItem(SURVEY_KEY, JSON.stringify(data));
  }

  function getPlayerData() {
    return getData(PLAYER_KEY, {});
  }

  function savePlayerData(player) {
    localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
  }

  /* ==========================================
     REWARDS
  ========================================== */

  function awardReward(amount, xp, title) {

    const engine = window.EARNOVA;

    if (engine && typeof engine.addTaskReward === "function") {
      engine.addTaskReward(amount, title);
    } else {
      const player = getPlayerData();

      player.balance = Number(player.balance || 0) + amount;
      player.totalEarnings = Number(player.totalEarnings || 0) + amount;
      player.tasksCompleted = Number(player.tasksCompleted || 0) + 1;

      savePlayerData(player);
    }

    if (engine && typeof engine.addXP === "function") {
      engine.addXP(xp);
    } else {
      const player = getPlayerData();

      player.xp = Number(player.xp || 0) + xp;

      savePlayerData(player);
    }

    if (engine && typeof engine.updateDashboard === "function") {
      engine.updateDashboard();
    }
  }

  /* ==========================================
     TASK SYSTEM
  ========================================== */

  function startTask(id) {

    const task = tasks.find(item => item.id === id);

    if (!task) return;

    const data = getTaskData();

    if (data.completed.includes(id)) {
      alert("You have already completed this task!");
      return;
    }

    if (!data.started.includes(id)) {
      data.started.push(id);
      saveTaskData(data);
    }

    alert(
      "TASK STARTED 🚀\n\n" +
      task.title +
      "\n\nComplete the task and return."
    );

    renderTasks();
  }

  function submitTask(id) {

    const task = tasks.find(item => item.id === id);

    if (!task) return;

    const data = getTaskData();

    if (data.completed.includes(id)) {
      alert("This task is already completed!");
      return;
    }

    if (!data.started.includes(id)) {
      alert("Please start this task first!");
      return;
    }

    if (!confirm(
      "Submit Task?\n\n" +
      task.title +
      "\nReward: ৳" + task.reward
    )) return;

    data.completed.push(id);

    data.started = data.started.filter(item => item !== id);

    saveTaskData(data);

    awardReward(task.reward, task.xp, task.title);

    alert(
      "TASK COMPLETED! 🎉\n\n" +
      "Reward: ৳" + task.reward +
      "\nXP: +" + task.xp
    );

    renderTasks();
  }

  function renderTasks(category = "All") {

    const container = document.getElementById("taskList");

    if (!container) return;

    const data = getTaskData();

    const filtered = category === "All"
      ? tasks
      : tasks.filter(task => task.category === category);

    container.innerHTML = filtered.map(task => {

      const completed = data.completed.includes(task.id);
      const started = data.started.includes(task.id);

      let action = "start";
      let label = "Start Task";

      if (completed) {
        action = "completed";
        label = "Completed ✓";
      } else if (started) {
        action = "submit";
        label = "Submit Task";
      }

      return `
        <div class="earnova-task-card">

          <div class="earnova-task-top">

            <div class="earnova-task-icon">
              ${task.icon}
            </div>

            <div class="earnova-task-info">
              <h3>${task.title}</h3>
              <span>${task.category}</span>
            </div>

            <div class="earnova-task-reward">
              +৳${task.reward}
            </div>

          </div>

          <p class="earnova-task-description">
            ${task.description}
          </p>

          <div class="earnova-task-meta">
            <span>⏱ ${task.duration}</span>
            <span>⭐ ${task.xp} XP</span>
          </div>

          <button
            class="earnova-task-button ${completed ? "completed" : ""}"
            data-task-action="${action}"
            data-task-id="${task.id}"
            ${completed ? "disabled" : ""}
          >
            ${label}
          </button>

        </div>
      `;

    }).join("");
  }

  /* ==========================================
     SURVEY SYSTEM
  ========================================== */

  let currentSurvey = null;
  let currentQuestion = 0;
  let currentAnswers = [];

  function renderSurveys() {

    const section = document.getElementById("surveysSection");

    if (!section) return;

    const data = getSurveyData();

    section.innerHTML = `
      <div class="page-heading">
        <h2>Survey Center</h2>
        <p>Share your opinions and earn rewards</p>
      </div>

      <div class="survey-categories">

        <div class="survey-card">
          <span>🛍️</span>
          <h3>Product Survey</h3>
          <p>Products and shopping</p>
        </div>

        <div class="survey-card">
          <span>📱</span>
          <h3>Technology</h3>
          <p>Apps and technology</p>
        </div>

        <div class="survey-card">
          <span>🌍</span>
          <h3>Lifestyle</h3>
          <p>Daily lifestyle surveys</p>
        </div>

        <div class="survey-card">
          <span>📈</span>
          <h3>Market Research</h3>
          <p>Market research surveys</p>
        </div>

      </div>

      <div class="section-heading">
        <h3>Available Surveys</h3>
      </div>

      <div id="earnovaSurveyList"></div>

      <div id="earnovaSurveyModal"></div>
    `;

    const list = document.getElementById("earnovaSurveyList");

    list.innerHTML = surveys.map(survey => {

      const completed = data.completed.includes(survey.id);

      return `
        <div class="earnova-task-card">

          <div class="earnova-task-top">

            <div class="earnova-task-icon">
              ${survey.icon}
            </div>

            <div class="earnova-task-info">
              <h3>${survey.title}</h3>
              <span>${survey.category}</span>
            </div>

            <div class="earnova-task-reward">
              +৳${survey.reward}
            </div>

          </div>

          <p class="earnova-task-description">
            ${survey.description}
          </p>

          <div class="earnova-task-meta">
            <span>⏱ ${survey.duration}</span>
            <span>⭐ ${survey.xp} XP</span>
            <span>📝 ${survey.questions.length} Questions</span>
          </div>

          <button
            class="earnova-task-button ${completed ? "completed" : ""}"
            data-survey-start="${survey.id}"
            ${completed ? "disabled" : ""}
          >
            ${completed ? "Completed ✓" : "Start Survey"}
          </button>

        </div>
      `;

    }).join("");
  }

  /* ==========================================
     START SURVEY
  ========================================== */

  function startSurvey(id) {

    const survey = surveys.find(item => item.id === id);

    if (!survey) return;

    if (getSurveyData().completed.includes(id)) {
      alert("You have already completed this survey!");
      return;
    }

    currentSurvey = survey;
    currentQuestion = 0;
    currentAnswers = [];

    renderQuestion();
  }

  /* ==========================================
     RENDER QUESTION
  ========================================== */

  function renderQuestion() {

    const modal = document.getElementById("earnovaSurveyModal");

    if (!modal || !currentSurvey) return;

    const question = currentSurvey.questions[currentQuestion];

    const progress = ((currentQuestion + 1) / currentSurvey.questions.length) * 100;

    modal.innerHTML = `
      <div style="
        position:fixed;
        inset:0;
        z-index:9999;
        background:rgba(0,0,0,.85);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:15px;
      ">

        <div style="
          width:100%;
          max-width:450px;
          max-height:90vh;
          overflow:auto;
          background:#10251b;
          border:1px solid #1e4935;
          border-radius:20px;
          padding:22px;
          color:white;
        ">

          <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
          ">

            <h3>${currentSurvey.icon} Survey</h3>

            <button data-survey-close style="
              background:none;
              border:none;
              color:white;
              font-size:24px;
            ">✕</button>

          </div>

          <p style="color:#9cae9f">
            ${currentSurvey.title}
          </p>

          <div style="
            height:7px;
            background:#07110d;
            border-radius:20px;
            margin:20px 0;
          ">

            <div style="
              width:${progress}%;
              height:100%;
              background:#42e58c;
              border-radius:20px;
            "></div>

          </div>

          <p style="color:#42e58c">
            Question ${currentQuestion + 1}
            of ${currentSurvey.questions.length}
          </p>

          <h3 style="line-height:1.5">
            ${question.question}
          </h3>

          <div>

            ${question.options.map((option, index) => `
              <button
                class="survey-option"
                data-survey-answer="${index}"
                style="
                  width:100%;
                  padding:14px;
                  margin:6px 0;
                  text-align:left;
                  border-radius:12px;
                  background:#07110d;
                  color:white;
                  border:1px solid #1e4935;
                "
              >
                ${option}
              </button>
            `).join("")}

          </div>

          <button
            id="surveyNextBtn"
            class="primary-btn"
            disabled
            style="
              width:100%;
              margin-top:15px;
              padding:15px;
              opacity:.5;
            "
          >
            ${
              currentQuestion === currentSurvey.questions.length - 1
                ? "Submit Survey"
                : "Next Question →"
            }
          </button>

        </div>

      </div>
    `;

    currentAnswers[currentQuestion] = null;
  }

  /* ==========================================
     ANSWERS
  ========================================== */

  function selectAnswer(index) {

    currentAnswers[currentQuestion] = index;

    document.querySelectorAll(".survey-option").forEach(button => {
      button.style.background = "#07110d";
      button.style.borderColor = "#1e4935";
    });

    const selected = document.querySelector(
      '[data-survey-answer="' + index + '"]'
    );

    if (selected) {
      selected.style.background = "#163b29";
      selected.style.borderColor = "#42e58c";
    }

    const next = document.getElementById("surveyNextBtn");

    if (next) {
      next.disabled = false;
      next.style.opacity = "1";
    }
  }

  function nextQuestion() {

    if (currentAnswers[currentQuestion] === null ||
        currentAnswers[currentQuestion] === undefined) {
      alert("Please select an answer!");
      return;
    }

    if (currentQuestion < currentSurvey.questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      completeSurvey();
    }
  }

  /* ==========================================
     COMPLETE SURVEY
  ========================================== */

  function completeSurvey() {

    if (!currentSurvey) return;

    const data = getSurveyData();

    if (data.completed.includes(currentSurvey.id)) {
      alert("Survey already completed!");
      closeSurvey();
      return;
    }

    data.completed.push(currentSurvey.id);

    data.answers[currentSurvey.id] = currentAnswers.slice();

    saveSurveyData(data);

    const reward = currentSurvey.reward;
    const xp = currentSurvey.xp;
    const title = currentSurvey.title;

    awardReward(
      reward,
      xp,
      "Survey: " + title
    );

    const modal = document.getElementById("earnovaSurveyModal");

    if (modal) {
      modal.innerHTML = `
        <div style="
          position:fixed;
          inset:0;
          z-index:9999;
          background:rgba(0,0,0,.85);
          display:flex;
          align-items:center;
          justify-content:center;
          padding:15px;
        ">

          <div style="
            width:100%;
            max-width:400px;
            background:#10251b;
            border:1px solid #1e4935;
            border-radius:22px;
            padding:30px;
            text-align:center;
            color:white;
          ">

            <div style="font-size:60px">🎉</div>

            <h2>Survey Completed!</h2>

            <p>${title}</p>

            <div style="
              background:#07110d;
              padding:20px;
              border-radius:15px;
              margin:20px 0;
            ">

              <h2 style="color:#42e58c">
                +৳${reward}
              </h2>

              <p>+${xp} XP</p>

            </div>

            <button
              class="primary-btn"
              data-survey-finish
              style="width:100%;padding:15px"
            >
              Continue
            </button>

          </div>

        </div>
      `;
    }

    currentSurvey = null;

    renderSurveys();
  }

  function closeSurvey() {

    currentSurvey = null;
    currentQuestion = 0;
    currentAnswers = [];

    const modal = document.getElementById("earnovaSurveyModal");

    if (modal) modal.innerHTML = "";
  }

  /* ==========================================
     EVENT LISTENERS
  ========================================== */

  document.addEventListener("click", function (event) {

    const taskButton = event.target.closest("[data-task-action]");

    if (taskButton) {

      const id = taskButton.dataset.taskId;
      const action = taskButton.dataset.taskAction;

      if (action === "start") startTask(id);
      if (action === "submit") submitTask(id);

      return;
    }

    const category = event.target.closest("[data-category]");

    if (category) {

      document.querySelectorAll("[data-category]").forEach(button => {
        button.classList.remove("active");
      });

      category.classList.add("active");

      renderTasks(category.dataset.category);

      return;
    }

    const surveyStart = event.target.closest("[data-survey-start]");

    if (surveyStart) {
      startSurvey(surveyStart.dataset.surveyStart);
      return;
    }

    const answer = event.target.closest("[data-survey-answer]");

    if (answer) {
      selectAnswer(Number(answer.dataset.surveyAnswer));
      return;
    }

    if (event.target.closest("#surveyNextBtn")) {
      nextQuestion();
      return;
    }

    if (event.target.closest("[data-survey-close]")) {
      closeSurvey();
      return;
    }

    if (event.target.closest("[data-survey-finish]")) {
      closeSurvey();
      return;
    }

  });

  /* ==========================================
     PUBLIC API
  ========================================== */

  window.EARNOVA_TASKS = tasks;
  window.EARNOVA_SURVEYS = surveys;

  window.renderEarnovaTasks = renderTasks;
  window.renderEarnovaSurveys = renderSurveys;

  window.getEarnovaTaskStats = function () {

    const data = getTaskData();

    return {
      total: tasks.length,
      completed: data.completed.length,
      started: data.started.length,
      remaining: tasks.length - data.completed.length
    };
  };

  window.getEarnovaSurveyStats = function () {

    const data = getSurveyData();

    return {
      total: surveys.length,
      completed: data.completed.length,
      remaining: surveys.length - data.completed.length
    };
  };

  /* ==========================================
     INITIALIZATION
  ========================================== */

  renderTasks();
  renderSurveys();

})();
