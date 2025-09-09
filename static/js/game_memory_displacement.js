const gridSize = 16; // 4x4
const numbers = [];
for(let i=1; i<=8; i++){
    numbers.push(i, i); // 8 pairs
}
let shuffledNumbers = [];
let firstChoice = null;
let secondChoice = null;
let clickable = false;
let score = 0;
let timerInterval;

// ---------------- Score Suggestions ----------------
const scoreSuggestions = [
    {score:10, suggestion:"You are just starting. Practice memory exercises daily."},
    {score:20, suggestion:"Good effort! Your memory is improving."},
    {score:30, suggestion:"Nice! Your short-term memory is above average."},
    {score:40, suggestion:"Great! Your memory retention is strong."},
    {score:50, suggestion:"Excellent! Your memory skills are very good."},
    {score:60, suggestion:"Outstanding! Your memory is sharp."},
    {score:70, suggestion:"Exceptional! Your mind is highly alert."},
    {score:80, suggestion:"Superb! You have excellent focus and memory."},
    {score:90, suggestion:"Elite! Your memory and attention are top-notch."},
    {score:100, suggestion:"Perfect! You have an extraordinary memory."}
];

const mentalHealthTips = [
    {min:0, max:20, tip:"Your focus and memory are low. Try relaxing, sleep well, and do daily brain exercises."},
    {min:21, max:50, tip:"Your memory is average. Keep practicing puzzles and maintain a healthy routine."},
    {min:51, max:80, tip:"Good memory! Keep challenging your brain and maintain balanced lifestyle."},
    {min:81, max:100, tip:"Excellent mental alertness! Continue brain exercises and stay active."}
];

// ---------------- Utility Functions ----------------
function shuffle(array){
    for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ---------------- Create Board ----------------
function createBoard(){
    shuffledNumbers = shuffle(numbers.slice());
    const board = document.getElementById("game-board");
    board.innerHTML = "";
    for(let i=0;i<gridSize;i++){
        let btn = document.createElement("button");
        btn.dataset.index = i;
        btn.innerText = shuffledNumbers[i]; // Show all numbers for observation
        board.appendChild(btn);
    }

    startObservation(5); // 5-second observation
}

// ---------------- Observation Timer ----------------
function startObservation(seconds){
    let obsTime = seconds;
    document.getElementById("timer").innerText = "Observation Time: " + obsTime + "s";
    timerInterval = setInterval(()=>{
        obsTime--;
        document.getElementById("timer").innerText = "Observation Time: " + obsTime + "s";
        if(obsTime <= 0){
            clearInterval(timerInterval);
            startGameplay(30); // 30-second gameplay
        }
    },1000);
}

// ---------------- Gameplay Timer ----------------
function startGameplay(seconds){
    const board = document.getElementById("game-board");
    const buttons = board.querySelectorAll("button");
    buttons.forEach(btn => btn.innerText = ""); // Hide all numbers
    clickable = true;
    let gameTime = seconds;
    document.getElementById("timer").innerText = "Time Left: " + gameTime + "s";

    timerInterval = setInterval(()=>{
        gameTime--;
        document.getElementById("timer").innerText = "Time Left: " + gameTime + "s";
        if(gameTime <= 0){
            clearInterval(timerInterval);
            endGame();
        }
    },1000);
}

// ---------------- Handle Box Click ----------------
function handleClick(e){
    if(!clickable) return;
    const btn = e.target;
    const index = btn.dataset.index;
    if(btn.innerText !== "") return;

    btn.innerText = shuffledNumbers[index];

    if(!firstChoice){
        firstChoice = btn;
    } else if(!secondChoice){
        secondChoice = btn;
        clickable = false;
        setTimeout(checkMatch, 500);
    }
}

// ---------------- Check Match ----------------
function checkMatch(){
    if(firstChoice.innerText === secondChoice.innerText){
        score += 10;
        document.getElementById("score").innerText = score;
        firstChoice.style.backgroundColor = "#ADFF2F";
        secondChoice.style.backgroundColor = "#ADFF2F";
    } else {
        firstChoice.innerText = "";
        secondChoice.innerText = "";
    }
    firstChoice = null;
    secondChoice = null;
    clickable = true;
}

// ---------------- End Game ----------------
function endGame(){
    clickable = false;
    document.getElementById("game-board").style.display = "none";
    document.getElementById("result").style.display = "block";

    // Score suggestion
    let suggestionText = "Keep practicing!";
    for(let s of scoreSuggestions){
        if(score <= s.score){
            suggestionText = s.suggestion;
            break;
        }
    }
    document.getElementById("suggestion").innerText = "Score Suggestion: " + suggestionText;

    // Mental health tips
    let tipText = "";
    for(let t of mentalHealthTips){
        if(score >= t.min && score <= t.max){
            tipText = t.tip;
            break;
        }
    }
    document.getElementById("tips").innerText = "Mental Health Tip: " + tipText;

    // Save result to server
    fetch("/save_result", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({game_name:"Memory Displacement", score:score})
    });
}

// ---------------- Initialize ----------------
window.onload = function(){
    createBoard();
    document.getElementById("game-board").addEventListener("click", handleClick);
};
