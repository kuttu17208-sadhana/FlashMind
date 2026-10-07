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
let correctCount = 0;
let totalQuestions = 0;
let currentItems = [];
let correctAnswer = "";
let timerInterval = null;

let bestScore = Number(localStorage.getItem("flashMindBest")) || 0;

// Get HTML elements
const homeScreen = document.getElementById("home");
const gameScreen = document.getElementById("game");
const resultScreen = document.getElementById("result");

const startBtn = document.getElementById("startBtn");
const againBtn = document.getElementById("againBtn");

const roundLabel = document.getElementById("roundLabel");
const streakLabel = document.getElementById("streakLabel");
const livesLabel = document.getElementById("livesLabel");

const phase = document.getElementById("phase");
const timer = document.getElementById("timer");
const memoryGrid = document.getElementById("memoryGrid");
const choices = document.getElementById("choices");
const submitBtn = document.getElementById("submitBtn");
const instruction = document.getElementById("instruction");

const bestScoreElement = document.getElementById("bestScore");

const resultTitle = document.getElementById("resultTitle");
const scoreElement = document.getElementById("score");
const resultMessage = document.getElementById("resultMessage");
const correctStat = document.getElementById("correctStat");
const accuracyStat = document.getElementById("accuracyStat");
const resultBest = document.getElementById("resultBest");


// Display best score
bestScoreElement.textContent = bestScore + "%";


// Random emojis
function getRandomItems(count) {
    const shuffled = [...emojis].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}


// Update game information
function updateGameInfo() {
    roundLabel.textContent = `Round ${round}`;
    streakLabel.textContent = `🔥 Streak: ${streak}`;

    let hearts = "";

    for (let i = 0; i < lives; i++) {
        hearts += "❤️";
    }

    livesLabel.textContent = hearts || "💔";
}


// Start game
function startGame() {

    clearInterval(timerInterval);

    round = 1;
    score = 0;
    lives = 3;
    streak = 0;
    correctCount = 0;
    totalQuestions = 0;

    homeScreen.classList.remove("active");
    resultScreen.classList.remove("active");
    gameScreen.classList.add("active");

    updateGameInfo();

    startRound();
}


// Start a round
function startRound() {

    clearInterval(timerInterval);

    if (round > 5 || lives <= 0) {
        endGame();
        return;
    }

    updateGameInfo();

    phase.textContent = "MEMORIZE";
    instruction.textContent = "Remember every emoji in order.";

    choices.classList.add("hidden");
    submitBtn.classList.add("hidden");

    memoryGrid.innerHTML = "";

    // Number of emojis increases every round
    const numberOfItems = Math.min(3 + round, 8);

    currentItems = getRandomItems(numberOfItems);

    // Pick the emoji that the player must remember
    correctAnswer =
        currentItems[Math.floor(Math.random() * currentItems.length)];

    // Display emojis
    currentItems.forEach((emoji) => {

        const item = document.createElement("div");

        item.className = "memory-item";
        item.textContent = emoji;

        memoryGrid.appendChild(item);
    });


    // 3 second timer
    let timeLeft = 3;

    timer.textContent = timeLeft;


    timerInterval = setInterval(() => {

        timeLeft--;

        timer.textContent = timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            showQuestion();
        }

    }, 1000);
}


// Show question
function showQuestion() {

    phase.textContent = "CHOOSE";

    timer.textContent = "❓";

    memoryGrid.innerHTML = "";

    instruction.textContent =
        "Which emoji did you see?";

    choices.innerHTML = "";

    // Generate 3 choices
    let options = getRandomItems(3);

    // Make sure correct answer exists
    if (!options.includes(correctAnswer)) {

        const randomIndex =
            Math.floor(Math.random() * options.length);

        options[randomIndex] = correctAnswer;
    }

    // Shuffle choices
    options.sort(() => Math.random() - 0.5);


    options.forEach((emoji) => {

        const button = document.createElement("button");

        button.className = "option-btn";
        button.textContent = emoji;

        button.addEventListener("click", () => {

            checkAnswer(emoji);
        });

        choices.appendChild(button);
    });


    choices.classList.remove("hidden");
}


// Check answer
function checkAnswer(answer) {

    const buttons =
        document.querySelectorAll(".option-btn");

    buttons.forEach(button => {
        button.disabled = true;
    });

    totalQuestions++;

    if (answer === correctAnswer) {

        correctCount++;

        streak++;

        score += 10;

        // Bonus for 3+ streak
        if (streak >= 3) {
            score += 5;
        }

        instruction.textContent =
            "🎉 Correct! Excellent memory!";

    } else {

        lives--;

        streak = 0;

        instruction.textContent =
            `❌ Wrong! The correct emoji was ${correctAnswer}`;
    }

    updateGameInfo();

    setTimeout(() => {

        if (lives <= 0) {

            endGame();

        } else {

            round++;

            startRound();
        }

    }, 1200);
}


// End game
function endGame() {

    clearInterval(timerInterval);

    gameScreen.classList.remove("active");
    resultScreen.classList.add("active");

    // Calculate percentage
    let percentage = 0;

    if (totalQuestions > 0) {

        percentage =
            Math.round((correctCount / totalQuestions) * 100);
    }

    // Update best score
    if (percentage > bestScore) {

        bestScore = percentage;

        localStorage.setItem(
            "flashMindBest",
            bestScore
        );
    }


    // Result level
    let level;

    if (percentage >= 80) {

        level = "👑 Memory Master";

    } else if (percentage >= 60) {

        level = "🧠 Memory Expert";

    } else if (percentage >= 40) {

        level = "🔥 Memory Learner";

    } else {

        level = "🌱 Memory Beginner";
    }


    resultTitle.textContent = level;

    scoreElement.textContent =
        percentage + "%";

    resultMessage.textContent =
        "Your memory performance is complete!";

    correctStat.textContent =
        `${correctCount} / ${totalQuestions}`;

    accuracyStat.textContent =
        percentage + "%";

    resultBest.textContent =
        bestScore + "%";

    bestScoreElement.textContent =
        bestScore + "%";
}


// Play again
function restartGame() {

    resultScreen.classList.remove("active");

    startGame();
}


// Button events
startBtn.addEventListener("click", startGame);

againBtn.addEventListener("click", restartGame);


// Initial display
bestScoreElement.textContent =
    bestScore + "%";
