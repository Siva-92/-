let current = 0;
let score = 0;
let selected = null;
let quizData = [];
let quizLength = 0;

// Load CSV data
Papa.parse("Questions.csv", {
  download: true,
  header: true,
  complete: function (results) {
    quizData = results.data;
    console.log("Loaded questions:", quizData);
  },
});

// Wait for Start button
document.getElementById("startBtn").addEventListener("click", () => {
  const inputVal = parseInt(document.getElementById("quest").value);
  if (isNaN(inputVal) || inputVal <= 0) {
    alert("Please enter a valid number of questions!");
    return;
  }

  quizLength = Math.min(inputVal, quizData.length);
  document.querySelector(".FPage").hidden = true;
  document.querySelector(".quiz-container").hidden = false;

  startQuiz();
});

function startQuiz() {
  current = 0;
  score = 0;
  selected = null;
  loadQuestion();
}

function loadQuestion() {
  if (current >= quizLength) {
    showScore();
    return;
  }

  const q = quizData[current];
  document.getElementById("question").innerText = `${q.ID}. ${q.Question}`;
  document.getElementById("optionA").innerText = q["Option A"];
  document.getElementById("optionB").innerText = q["Option B"];
  document.getElementById("optionC").innerText = q["Option C"];
  document.getElementById("optionD").innerText = q["Option D"];
  selected = null;

  const buttons = document.querySelectorAll(".options button");
  buttons.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("correct-blink", "blink", "correct", "wrong", "selected");
    btn.style.background = "rgba(255,255,255,0.15)";
  });

  document.getElementById("score").innerText = "";
}

function selectOption(button) {
  document.querySelectorAll(".options button").forEach((btn) =>
    btn.classList.remove("selected")
  );
  button.classList.add("selected");
  selected = button.innerText;
}

function nextQuestion() {
  if (!selected) {
    alert("Please select an answer!");
    return;
  }

  const correct = quizData[current].Answer;
  const scoreEl = document.getElementById("score");
  const buttons = document.querySelectorAll(".options button");

  buttons.forEach((btn) => (btn.disabled = true));
  scoreEl.classList.remove("correct-text", "wrong-text");

  if (selected === correct) {
    score++;
    scoreEl.innerHTML = `<b>(^0^) Correct!</b>`;
    scoreEl.classList.add("correct-text");
    buttons.forEach((btn) => {
      if (btn.innerText === correct) btn.classList.add("correct");
    });
  } else {
    scoreEl.innerHTML = `<b>(＞︿＜) Wrong!</b> Correct: ${correct}`;
    scoreEl.classList.add("wrong-text");

    buttons.forEach((btn) => {
      if (btn.innerText === correct) btn.classList.add("correct-blink");
      if (btn.innerText === selected) btn.classList.add("wrong");
    });
  }

  current++;
  setTimeout(() => {
    scoreEl.innerText = "";
    loadQuestion();
  }, 2000);
}

function showScore() {
  document.querySelector(".quiz-container").innerHTML = `
    <h2>\\(^o^)/ Quiz Completed!</h2>
    <p>Your Score: ${score} / ${quizLength}</p>
    <button onclick="location.reload()">Play Again</button>
  `;
}
