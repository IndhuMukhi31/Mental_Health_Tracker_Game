const sequenceDiv = document.getElementById("sequence");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const scoreDiv = document.getElementById("score");
const timerDiv = document.getElementById("timer");
const gameOverDiv = document.getElementById("game-over");

let score = 0;
let time = 60; // total 1 min
let currentSequence = "";

// Arrow options
const arrows = ["↑", "↓", "←", "→"];

// Generate random sequence
function generateSequence(length = 3) {
    let seq = "";
    for(let i = 0; i < length; i++) {
        seq += arrows[Math.floor(Math.random() * arrows.length)];
    }
    return seq;
}

// Get mirrored sequence
function mirrorSequence(seq) {
    return seq.split("").map(char => {
        if(char === "↑") return "↓";
        if(char === "↓") return "↑";
        if(char === "←") return "→";
        if(char === "→") return "←";
    }).join("");
}

// Show new sequence
function newSequence() {
    userInput.value = "";
    currentSequence = generateSequence();
    sequenceDiv.textContent = currentSequence;
}

// Submit answer
submitBtn.addEventListener("click", () => {
    let userSeq = userInput.value.replace(/\s+/g, "");
    if(userSeq === mirrorSequence(currentSequence)) {
        score++;
        scoreDiv.textContent = "Score: " + score;
        newSequence();
    } else {
        endGame();
    }
});

// Timer
let countdown = setInterval(() => {
    time--;
    timerDiv.textContent = "Time: " + time + "s";
    if(time <= 0) {
        endGame();
    }
}, 1000);

// End game
function endGame() {
    clearInterval(countdown);
    submitBtn.disabled = true;
    userInput.disabled = true;
    sequenceDiv.textContent = "";
    gameOverDiv.innerHTML = `Game Over!<br>Final Score: ${score}`;
}

// Initialize first sequence
newSequence();
