const colors = ["Red","Blue","Green","Yellow","Purple","Orange"];
let score = 0;
let timeLeft = 30;
let gameOver = false;

const wordEl = document.getElementById("word");
const buttonsEl = document.getElementById("buttons");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const gameOverContainer = document.getElementById("gameOverContainer");

// Score-based suggestions
const scoreSuggestions = [
    {min:10, max:20, suggestion:"Focus on colors! Start with easy sequences."},
    {min:21, max:30, suggestion:"Good! Your color recognition is improving."},
    {min:31, max:40, suggestion:"Nice! Try to react faster to increase score."},
    {min:41, max:50, suggestion:"Great! Your attention and focus are improving."},
    {min:51, max:60, suggestion:"Excellent! Your observation skills are strong."},
    {min:61, max:70, suggestion:"Well done! You can handle more challenging patterns."},
    {min:71, max:80, suggestion:"Impressive! Your focus is sharp and fast."},
    {min:81, max:90, suggestion:"Outstanding! Very good color recognition and reflexes."},
    {min:91, max:100, suggestion:"Superb! Your attention and accuracy are excellent."},
    {min:101, max:120, suggestion:"Amazing! Your brain processes colors efficiently."},
    {min:121, max:150, suggestion:"Phenomenal! Reaction time and focus are very high."},
    {min:151, max:170, suggestion:"Exceptional! You can handle intense challenges."},
    {min:171, max:200, suggestion:"Elite! Perfect combination of focus and reflex."},
    {min:201, max:1000, suggestion:"Legendary! Your attention and speed are extraordinary."}
];

// Mental health tips
const mentalTips = [
    {min:10, max:50, tip:"Your attention span is low. Practice short focus exercises daily."},
    {min:51, max:100, tip:"Good focus! Maintain balance and rest properly."},
    {min:101, max:150, tip:"Excellent alertness! Keep challenging your memory regularly."},
    {min:151, max:200, tip:"Outstanding! Your mental sharpness is very high."},
    {min:201, max:1000, tip:"Legendary mind! Your brain performance is extraordinary."}
];

function getSuggestion(score) {
    for(let s of scoreSuggestions){
        if(score >= s.min && score <= s.max) return s.suggestion;
    }
    return "Keep practicing!";
}

function getMentalTip(score){
    for(let t of mentalTips){
        if(score >= t.min && score <= t.max) return t.tip;
    }
    return "Stay consistent!";
}

function randomChoice(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

function nextRound(){
    if(gameOver) return;

    let wordText = randomChoice(colors);
    let wordColor = randomChoice(colors);

    wordEl.textContent = wordText;
    wordEl.style.color = wordColor.toLowerCase();

    buttonsEl.innerHTML = "";
    colors.forEach(c => {
        let btn = document.createElement("button");
        btn.textContent = c;
        btn.className = "btn";
        btn.style.backgroundColor = c.toLowerCase();
        btn.onclick = () => checkAnswer(c, wordColor);
        buttonsEl.appendChild(btn);
    });
}

function checkAnswer(selected, correctColor){
    if(gameOver) return;
    if(selected === correctColor){
        score += 10; // increment by 10 points
        scoreEl.textContent = "Score: " + score;
        nextRound();
    } else {
        endGame("Wrong choice! Game Over.");
    }
}

function startTimer(){
    let timer = setInterval(()=>{
        if(gameOver){
            clearInterval(timer);
            return;
        }
        timeLeft--;
        timerEl.textContent = "Time Left: " + timeLeft;
        if(timeLeft <=0){
            clearInterval(timer);
            endGame("Time's up!");
        }
    },1000);
}

function endGame(message){
    gameOver = true;
    buttonsEl.innerHTML = "";
    wordEl.textContent = "";
    const suggestion = getSuggestion(score);
    const tip = getMentalTip(score);

    gameOverContainer.innerHTML = `
        <div class="game-over">${message}</div>
        <div class="final-score">Final Score: ${score}</div>
        <div class="score-suggestion"><strong>Suggestion:</strong> ${suggestion}</div>
        <div class="mental-tip"><strong>Mental Health Tip:</strong> ${tip}</div>
        <a href="/dashboard"><button>Back to Dashboard</button></a>
    `;
}

// Start game
nextRound();
startTimer();
