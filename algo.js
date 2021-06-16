// Global Variables
let body = document.getElementById("main");
body.style.visibility = "hidden";
let board;
let person = "O";
let person_name;
let computer = "X";
const winSet = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const cells = document.querySelectorAll(".cell");

// Form Control
let forms = document.getElementById("forms");
let single;
let playfirst = "";
let comscore = 0,
  perscore = 0,
  k = 1;
let player1 = {
    name: "",
    role: "X",
  },
  player2 = {
    name: "",
    role: "O",
  };
let select = document.getElementById("mode");
function playerMode() {
  if (select.value == "0") {
    alert("Please Select a Mode!");
    return;
  }
  if (select.value == "1") {
    single = true;
  } else if (select.value == "2") {
    single = false;
  }
  roleSelect();
}
function roleSelect() {
  select.innerHTML = null;
  if (single == false) {
    TwoPlayer();
    return;
  }
  let def = document.createElement("option");
  def.value = "0";
  def.innerText = "What Do you want to become?";
  def.selected;
  def.disabled;
  select.innerHTML = null;
  select.append(def);

  let option1 = document.createElement("option");
  option1.value = "X";
  option1.innerText = "X";
  select.append(option1);
  let option2 = document.createElement("option");
  option2.value = "O";
  option2.innerText = "O";
  select.append(option2);
  document.getElementById("next").onclick = getRole;
}

function getRole() {
  if (select.value == "0") {
    alert("Please select a character!");
    return;
  } else if (select.value == "X") {
    person = "X";
    computer = "O";
  } else if (select.value == "O") {
    person = "O";
    computer = "X";
  }
  singlePlayer();
}
function singlePlayer() {
  select.innerHTML = null;

  let def = document.createElement("option");
  def.value = "0";
  def.innerText = "Who do you want to play first";
  def.selected;
  def.disabled;
  select.innerHTML = null;
  select.append(def);

  let option1 = document.createElement("option");
  option1.value = "ai";
  option1.innerText = "Computer";
  select.append(option1);
  let option2 = document.createElement("option");
  option2.value = "you";
  option2.innerText = "You";
  select.append(option2);
  document.getElementById("next").innerText = "Play";
  document.getElementById("next").onclick = playsingle;
}

function playsingle() {
  person_name = prompt("Enter Player Name:", "Player");
  if (select.value == "0") {
    alert("Please select a correct Option!");
    return;
  }
  if (select.value == "you") {
    playfirst = "you";
  } else if (select.value == "ai") {
    playfirst = "ai";
  }
  forms.style.visibility = "hidden";
  startGame();
}

function TwoPlayer() {
  window.open("./twoplayer.html", "_self");
}

// App Code Begins

function startGame() {
  let scores = document.getElementById("scores");
  scores.innerHTML = null;
  let score1 = document.createElement("h2");
  score1.id = "first";
  score1.style.padding = "8px 8px";
  score1.innerText = `${person_name} (${person}): ${perscore}`;
  let score2 = document.createElement("h2");
  score2.id = "second";

  score2.style.padding = "8px 8px";
  score2.innerText = `Computer (${computer}): ${comscore}`;
  scores.append(score1);
  scores.append(score2);

  body.style.visibility = "visible";
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
  if (playfirst == "ai") {
    cells[0].innerText = computer;
    board[0] = computer;
  }
}

function turnClick(square) {
  let audio = new Audio("./scribble.wav");

  if (typeof board[square.target.id] == "number") {
    {
      audio.play();
      turn(square.target.id, person);
    }
    if (!checkWin(board, person) && !checkTie()) {
      turn(bestCell(), computer);
    }
  }
}

function turn(squareId, player) {
  console.log(squareId);
  board[squareId] = player;
  let temp = true;
  for (let i of board) {
    if (typeof i == "number") temp = false;
  }
  if (temp == true && playfirst == "ai") {
    document.getElementById(squareId).innerText = player;
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }

    declareWinner(`Tie Game!`);
  }
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(board, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winSet.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winSet[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == person ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  // declareWinner(gameWon.player == person ? "You win!" : "You lose.");
  if (gameWon.player == person) {
    ++perscore;
    declareWinner(`You Won!`);
  } else {
    ++comscore;
    declareWinner(`You Lost! Better Luck Next Time :(`);
  }
}

function declareWinner(who) {
  document.getElementById("status").innerText = who;
  let mymodal = new bootstrap.Modal(document.getElementById("myModal"));
  mymodal.toggle();
}

function emptySquares() {
  return board.filter((s) => typeof s == "number");
}

function bestCell() {
  return minMaxAlgo(board, computer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function minMaxAlgo(newBoard, player) {
  let availSpots = emptySquares();

  if (checkWin(newBoard, person)) {
    return { score: -10 };
  } else if (checkWin(newBoard, computer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == computer) {
      let result = minMaxAlgo(newBoard, person);
      move.score = result.score;
    } else {
      let result = minMaxAlgo(newBoard, computer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === computer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
function darkMode() {
  let element = document.body;
  element.classList.toggle("dark-mode");
  for (i of cells) i.classList.toggle("tablecolor");
}
