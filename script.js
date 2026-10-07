const emojis = [
    "🍎", "🍕", "🚀", "🐱", "🌈",
    "⚽", "🎸", "🍔", "🦋", "🌟",
    "🐼", "🍩", "🚗", "🌸", "🎯",
    "🍉", "🦄", "🔥", "🎁", "🐶"
];

let round = 1;
let score = 0;
let lives = 3;
let streak = 0;
let bestScore = localStorage.getItem("flashMindBest") || 0;

let currentItems = [];
let correctAnswer = "";

const roundText = document.getElementById("round");
const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const streakText = document.getElementById("streak");
const bestText = document.getElementById("best");

const memoryArea = document.getElementById("memoryArea");
const questionArea = document.getElementById("questionArea");
const resultArea = document.getElementById("resultArea");

const startButton = document.getElementById("startBtn");
const nextButton = document.getElementById("nextBtn");

if (bestText) {
    bestText.textContent = bestScore;
}

function updateStats() {
    if (roundText) roundText.textContent = round;
    if (scoreText) scoreText.textContent = score;
    if (livesText) livesText.textContent = lives;
    if (streakText) streakText.textContent = streak;
}

function getRandomItems(count) {
    const shuffled = [...emojis].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function startGame() {
    round = 1;
    score = 0;
    lives = 3;
    streak = 0;

    updateStats();

    if (startButton) {
        startButton.style.display = "none";
    }

    if (resultArea) {
        resultArea.style.display = "none";
    }

    startRound();
}

function startRound() {
    updateStats();

    if (round > 5) {
        endGame();
        return;
    }

    const numberOfItems = Math.min(3 + round, 8);

    currentItems = getRandomItems(numberOfItems);

    correctAnswer =
        currentItems[Math.floor(Math.random() * currentItems.length)];

    if (memoryArea) {
        memoryArea.style.display = "block";

        memoryArea.innerHTML = `
            <h2>🧠 Memorize these!</h2>
            <div class="emoji-container">
                ${currentItems.map(item => `<span>${item}</span>`).join("")}
            </div>
            <p id="timer">⏱️ 3</p>
        `;
    }

    if (questionArea) {
        questionArea.style.display = "none";
    }

    let time = 3;
    const timerElement = document.getElementById("timer");

    const timer = setInterval(() => {
        time--;

        if (timerElement) {
            timerElement.textContent = `⏱️ ${time}`;
        }

        if (time <= 0) {
            clearInterval(timer);
            showQuestion();
        }
    }, 1000);
}

function showQuestion() {
    if (memoryArea) {
        memoryArea.style.display = "none";
    }

    if (!questionArea) return;

    questionArea.style.display = "block";

    const options = getRandomItems(3);

    if (!options.includes(correctAnswer)) {
        options[Math.floor(Math.random() * options.length)] = correctAnswer;
    }

    options.sort(() => Math.random() - 0.5);

    questionArea.innerHTML = `
        <h2>🔍 Which emoji did you see?</h2>

        <div class="options">
            ${options.map(item => `
                <button class="option-btn" onclick="checkAnswer('${item}')">
                    ${item}
                </button>
            `).join("")}
        </div>
    `;
}

function checkAnswer(answer) {
    const buttons = document.querySelectorAll(".option-btn");

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (answer === correctAnswer) {
        score += 10;
        streak++;

        if (streak >= 3) {
            score += 5;
        }

        showMessage("🎉 Correct! Great memory!", true);
    } else {
        lives--;
        streak = 0;

        showMessage(
            `❌ Wrong! The correct answer was ${correctAnswer}`,
            false
        );
    }

    updateStats();

    setTimeout(() => {
        if (lives <= 0) {
            endGame();
        } else {
            round++;
            startRound();
        }
    }, 1200);
}

function showMessage(message, correct) {
    if (!questionArea) return;

    const messageElement = document.createElement("div");

    messageElement.className = correct
        ? "correct-message"
        : "wrong-message";

    messageElement.textContent = message;

    questionArea.appendChild(messageElement);
}

function endGame() {
    if (memoryArea) {
        memoryArea.style.display = "none";
    }

    if (questionArea) {
        questionArea.style.display = "none";
    }

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("flashMindBest", bestScore);
    }

    let level;

    if (score >= 65) {
        level = "👑 Memory Master";
    } else if (score >= 45) {
        level = "🧠 Memory Expert";
    } else if (score >= 25) {
        level = "🔥 Memory Learner";
    } else {
        level = "🌱 Memory Beginner";
    }

    if (resultArea) {
        resultArea.style.display = "block";

        resultArea.innerHTML = `
            <h1>🏆 Game Over!</h1>

            <h2>Your Score: ${score}</h2>

            <p>🔥 Best Score: ${bestScore}</p>

            <h2>${level}</h2>

            <p>Rounds Completed: ${Math.min(round, 5)}</p>

            <button onclick="restartGame()">
                🔄 Play Again
            </button>
        `;
    }

    if (startButton) {
        startButton.style.display = "none";
    }
}

function restartGame() {
    if (resultArea) {
        resultArea.style.display = "none";
    }

    startGame();
}

if (startButton) {
    startButton.addEventListener("click", startGame);
}

updateStats();
