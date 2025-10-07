function startQuiz() {
  current = 0;
  score = 0;
  selected = null;
  loadQuestion();
}

// Parse CSV and start quiz
Papa.parse("Questions.csv", {
  download: true,
  header: true,
  complete: function (results) {
    quizData = results.data;
    startQuiz();
  },
});

const loadQuestion = () => {
  if (current >= quizData.length) {
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
};

// Highlight selected button
function selectOption(button) {
  document.querySelectorAll(".options button").forEach((btn) =>
    btn.classList.remove("selected")
  );
  button.classList.add("selected");
  selected = button.innerText;
}

// Handle next question logic
function nextQuestion() {
  if (!selected) {
    alert("Please select an answer!");
    return;
  }

  const correct = quizData[current].Answer;
  const scoreEl = document.getElementById("score");
  const buttons = document.querySelectorAll(".options button");

  // Disable all buttons to prevent multiple clicks
  buttons.forEach((btn) => (btn.disabled = true));
  scoreEl.classList.remove("correct-text", "wrong-text");

  if (selected === correct) {
    score++;
    scoreEl.innerHTML = `<b>✅ Correct!</b>`;
    scoreEl.classList.add("correct-text");

    buttons.forEach((btn) => {
      if (btn.innerText === correct) btn.classList.add("correct");
    });
  } else {
    scoreEl.innerHTML = `<b>❌ Wrong!</b> Correct: ${correct}`;
    scoreEl.classList.add("wrong-text");

    // Blink the correct answer only
    buttons.forEach((btn) => {
      if (btn.innerText === correct) btn.classList.add("correct-blink");
      if (btn.innerText === selected) btn.classList.add("wrong");
    });
  }

  // Move to next question after 2 seconds
  current++;
  setTimeout(() => {
    scoreEl.innerText = "";
    loadQuestion();
  }, 2000);
}

// Show final score
function showScore() {
  document.querySelector(".quiz-container").innerHTML = `
    <h2>🎉 Quiz Completed!</h2>
    <p>Your Score: ${score} / ${quizData.length}</p>
    <button onclick="location.reload()">Play Again</button>
  `;
}
