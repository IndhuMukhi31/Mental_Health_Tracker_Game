const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const gameOverContainer = document.getElementById("gameOverContainer");

let score = 0;
let level = 1;
let flashCells = [];
let userClicks = [];

// Score-based suggestions
const scoreSuggestions = [
    {min:10, max:20, suggestion:"You are just starting. Focus on short sequences to improve attention."},
    {min:21, max:30, suggestion:"Good start! Practice flashing patterns daily for better memory."},
    {min:31, max:40, suggestion:"Nice! Your visual attention is improving. Keep trying."},
    {min:41, max:50, suggestion:"Great! You are becoming more aware of patterns."},
    {min:51, max:60, suggestion:"Well done! Your observation skills are above average."},
    {min:61, max:70, suggestion:"Excellent! You can recall most sequences accurately."},
    {min:71, max:80, suggestion:"Impressive! Your focus and pattern recognition are strong."},
    {min:81, max:90, suggestion:"Outstanding! Your visual memory is sharp."},
    {min:91, max:100, suggestion:"Superb! You have high alertness and memory retention."},
    {min:101, max:120, suggestion:"Amazing! Your brain processes sequences efficiently."},
    {min:121, max:150, suggestion:"Phenomenal! Your observation and memory are very strong."},
    {min:151, max:170, suggestion:"Exceptional! You can handle complex patterns easily."},
    {min:171, max:200, suggestion:"Elite! Your focus and memory are top-notch."},
    {min:201, max:1000, suggestion:"Legendary! Your visual memory and attention are extraordinary."}
];

// Mental health tips
const mentalHealthTips = [
    {min:10, max:50, tip:"Your attention span is low. Try short focus exercises daily."},
    {min:51, max:100, tip:"Good focus! Maintain balance and rest properly."},
    {min:101, max:150, tip:"Excellent alertness! Keep challenging your memory regularly."},
    {min:151, max:200, tip:"Outstanding! Your mental sharpness is very high."},
    {min:201, max:1000, tip:"Legendary mind! Your brain performance is extraordinary."}
];

// Create grid
function createGrid() {
    grid.innerHTML = "";
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", cellClick);
        grid.appendChild(cell);
    }
}

// Start level with flashing cells
function startLevel() {
    userClicks = [];
    flashCells = [];
    const allCells = Array.from(document.querySelectorAll(".cell"));

    // Pick random cells to flash
    while (flashCells.length < level + 2) {
        let rand = Math.floor(Math.random() * 16);
        if (!flashCells.includes(rand)) flashCells.push(rand);
    }

    // Flash cells one by one
    flashCells.forEach((index, i) => {
        setTimeout(() => {
            allCells[index].classList.add("flash");
            setTimeout(() => allCells[index].classList.remove("flash"), 500);
        }, i * 700);
    });
}

// Handle cell click
function cellClick(e) {
    const index = parseInt(e.target.dataset.index);
    userClicks.push(index);

    // Check if user clicked wrong
    for (let i = 0; i < userClicks.length; i++) {
        if (userClicks[i] !== flashCells[i]) {
            gameOver();
            return;
        }
    }

    // Level complete
    if (userClicks.length === flashCells.length) {
        score += flashCells.length * 10;
        scoreDisplay.textContent = "Score: " + score;
        level++;
        setTimeout(startLevel, 1000);
    }
}

// Get suggestion for score
function getSuggestion(score) {
    for (let s of scoreSuggestions) {
        if (score >= s.min && score <= s.max) return s.suggestion;
    }
    return "Keep practicing!";
}

// Get mental health tip for score
function getMentalHealthTip(score) {
    for (let t of mentalHealthTips) {
        if (score >= t.min && score <= t.max) return t.tip;
    }
    return "Stay consistent with focus exercises.";
}

// Game over logic
function gameOver() {
    grid.style.display = "none";
    scoreDisplay.style.display = "none";

    const suggestion = getSuggestion(score);
    const tip = getMentalHealthTip(score);

    gameOverContainer.innerHTML = `
        <div class="game-over">Game Over!</div>
        <div class="final-score">Final Score: ${score}</div>
        <div class="score-suggestion"><strong>Suggestion:</strong> ${suggestion}</div>
        <div class="mental-tip"><strong>Mental Health Tip:</strong> ${tip}</div>
        <a href="/dashboard"><button>Back to Dashboard</button></a>
    `;
}

// Initialize game
createGrid();
setTimeout(startLevel, 500);
