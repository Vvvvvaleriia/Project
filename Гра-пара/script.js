const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const pairsEl = document.getElementById("pairs");
const timerEl = document.getElementById("timer");
const restartBtn = document.getElementById("restart");
const clickSound = new Audio("sounds/click.mp3");
const matchSound = new Audio("sounds/correct.mp3");
const winSound = new Audio("sounds/winner.mp3");
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startGame");
const difficultySelect = document.getElementById("difficulty");
const winModal = document.getElementById("win");
const closeModal = document.getElementById("closeModal");
const playAgain = document.getElementById("playAgain");

const ALL_EMOJIS = [
    "🍎","🍇","🍌","🍍","🍓","🍒","🥝","🍑","🥥","🍉",
  "🍋","🍐","🍊","🍏","🥭","🥑","🍈","🥕","🌽","🥔",
  "🥬","🥦","🧄","🧅","🍄","🥜","🌰","🥯","🍞","🥐",
  "🥖","🫓","🥨","🥞","🧇","🍗","🍖","🥩","🥓","🍔",
  "🍟","🍕","🌭","🥪","🌮","🌯","🥗","🍿","🧈","🧃",
  "🥛","☕","🍵","🫖","🍶","🍷","🍸","🍹","🍺","🍻",
  "🥂","🥤","🧋","🧉","🧊","🍩","🍪","🎂","🍰","🧁",
  "🥧","🍫","🍬","🍭","🍯","🍼","🍳","🥚","🍲","🍛",
  "🍜","🍝","🍠","🥟","🦪","🍣","🍱","🥡","🥠","🍤",
  "🍙","🍚","🍘","🍥","🥮","🥢","🥄","🍽️","🍴","🔪",
];

let deck = [];
let EMOJIS = [];
let firstCard = null;
let secondCard = null;
let lock = false;
let moves = 0;
let matches = 0;
let seconds = 0;
let timer;

function shuffle(array){ 
    return array.sort(() => Math.random() - 0.5);
}

function startTimer(){
    timer = setInterval(() => {
        seconds++;
        let m = String(Math.floor(seconds / 60)).padStart(2, "0");
        let s = String(seconds % 60).padStart(2, "0");
        timerEl.textContent = `${m}:${s}`;
    }, 1000);
}

function stopTimer(){
    clearInterval(timer);
}

function createBoard(rows, cols){
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    deck.forEach((emoji, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.index = index;

        card.innerHTML = `
        <div class="inner">
        <div class="back">?</div>
        <div class="front">${emoji}</div>
        </div>
        `;

        card.addEventListener("click", () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card){
    clickSound.currentTime = 0;
    clickSound.play();

    if(lock) return;
    if(card === firstCard) return;
    if(card.classList.contains("matched")) return;

    if (!timer) startTimer();

    card.classList.add("flip");

    if (!firstCard){
        firstCard = card;
        return;
    }

    secondCard = card;
    lock = true;
    moves++;
    movesEl.textContent = moves;

    checkMatch();
}

function showWinModal(){
    winModal.style.display = "flex";
};

playAgain.onclick = () => {
    winModal.style.display = "none";
    menu.style.display = "flex";
};

closeModal.onclick = () => {
    winModal.style.display = "none";
};

function checkMatch(){
    const i1 = firstCard.dataset.index;
    const i2 = secondCard.dataset.index;

    if(deck[i1] === deck[i2]){
        matchSound.currentTime = 0;
        matchSound.play();

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matches++;
        matchesEl.textContent = matches;
        resetTurn();

        if(matches === EMOJIS.length){
            stopTimer();
            setTimeout(() => {
                winSound.currentTime = 0;
                winSound.play();

                showWinModal();
            }, 400);
        }
    } else{
        setTimeout(() => {
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");
            resetTurn();
        }, 800);
    }
}

function resetTurn(){
    firstCard = null;
    secondCard = null;
    lock = false;
}

function initGame(){
    const difficulty = difficultySelect.value;
    let rows, cols;

    if(difficulty === "easy"){
        rows=cols=4; 
    }else if(difficulty === "medium"){
        rows=cols=10; 
    }else if(difficulty === "hard"){
        rows=cols=14;
    }

    const totalCards = rows*cols;
    const pairsCount = Math.floor(totalCards/2);

    EMOJIS = ALL_EMOJIS.slice(0, pairsCount);
    deck = shuffle([...EMOJIS, ...EMOJIS]);

    if(deck.length > totalCards) deck.pop();

    firstCard = null;
    secondCard = null;
    lock = false;
    moves = 0;
    matches = 0;
    seconds = 0;
    movesEl.textContent = 0;
    matchesEl.textContent = 0;
    timerEl.textContent = "00:00";
    pairsEl.textContent = Math.floor(deck.length/2);
    
    stopTimer();
    timer = null;
    createBoard(rows, cols);
}

restartBtn.addEventListener("click", initGame);

startBtn.addEventListener("click", () => {
    menu.style.display="none";
    initGame();
});