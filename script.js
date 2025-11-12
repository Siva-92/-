let quizData = [];
let current = 0;
let score = 0;
let selected = null;
let quizLength = 0;

// Load CSV but do not start quiz yet
Papa.parse("Questions.csv", {
  download: true,
  header: true,
  complete: function (results) {
    quizData = results.data.filter(q => q.Question); // remove empty rows
    console.log("CSV loaded:", quizData.length, "questions found");
  },
  error: function (err) {
    console.error("Error loading CSV:", err);
  }
});

// Start quiz when user clicks Start
document.getElementById("startBtn").addEventListener("click", () => {
  const inputVal = parseInt(document.getElementById("quest").value);

  if (!inputVal || inputVal <= 0) {
    alert("Please enter a valid number of questions!");
    return;
  }

  if (inputVal > quizData.length) {
    alert(`There are only ${quizData.length} questions available.`);
    return;
  }

  quizLength = inputVal;

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

const loadQuestion = () => {
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
    btn.classList.remove("correct-blink", "correct", "wrong", "selected");
    btn.style.background = "rgba(255,255,255,0.15)";
  });

  document.getElementById("score").innerText = `Question ${current + 1} of ${quizLength}`;
};

// Select answer
function selectOption(button) {
  document.querySelectorAll(".options button").forEach((btn) =>
    btn.classList.remove("selected")
  );
  button.classList.add("selected");
  selected = button.innerText;
}

// Next question logic
function nextQuestion() {
  if (!selected) {
    alert("Please select an answer!");
    return;
  }

  const correct = quizData[current].Answer;
  const scoreEl = document.getElementById("score");
  const buttons = document.querySelectorAll(".options button");
  buttons.forEach((btn) => (btn.disabled = true));

  if (selected === correct) {
    score++;
    scoreEl.innerHTML = `<b>(^0^) Correct!</b> (${score}/${quizLength})`;
    scoreEl.className = "correct-text";
    buttons.forEach((btn) => {
      if (btn.innerText === correct) btn.classList.add("correct");
    });
  } else {
    scoreEl.innerHTML = `<b>(＞︿＜) Wrong!</b> Correct: ${correct} (${score}/${quizLength})`;
    scoreEl.className = "wrong-text";
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

// Show final score
function showScore() {
  document.querySelector(".quiz-container").innerHTML = `
    <h2>\\(^o^)/ Quiz Completed!</h2>
    <p>Your Score: ${score} / ${quizLength}</p>
    <button onclick="location.reload()">Play Again</button>
  `;
}
