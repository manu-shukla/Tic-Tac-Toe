function back() {
  window.open("./index.html", "_self");
}

let board;
let player1 = {
  name:"",
  role: "X",
  score: 0,
};
let player2 = {
  name: "",
  role: "O",
  score: 0,
};

setTimeout(setName, 2000)

function setName()
{
  player1.name =  prompt("Enter Player1 Name:", "Player1");

player2. name= prompt("Enter Player2 Name:", "Player2");
startGame();
}


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
let k=1;
const cells = document.querySelectorAll(".cell");


function startGame() {
    
    let scores = document.getElementById("scores");
    scores.innerHTML = null;
    let score1 = document.createElement("h2");
    score1.id = "first"
    score1.style.padding = "8px 8px"
    score1.innerText = `${player1.name} (${player1.role}): ${player1.score}`;
    let score2 = document.createElement("h2");
    score2.id= "second"

    score2.style.padding = "8px 8px"
    score2.innerText = `${player2.name} (${player2.role}): ${player2.score}`;
 scores.append(score1);
 scores.append(score2);  
 
 if (k % 2) {
   
    second.style.removeProperty("border")
  
   first.style.border = "4px solid red"

} else {
   
    first.style.removeProperty("border")
  
    second.style.border = "4px solid red"

}
 
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
    let audio = new Audio("./scribble.wav");
  if (typeof board[square.target.id] == "number") {
      let first =  document.getElementById("first")
      let second =  document.getElementById("second")

    if (k % 2) {
      
        first.style.removeProperty("border")
       
        second.style.border = "4px solid red"
      turn(square.target.id, player1.role);
      audio.play();
      if (!checkWin(board, player1.role) && !checkTie()) ++k;
    } else {
      
        second.style.removeProperty("border")
      
       first.style.border = "4px solid red"
       audio.play();
      turn(square.target.id, player2.role);
      if (!checkWin(board, player2.role) && !checkTie()) ++k;
    }
  }
}

function turn(squareId, player) {
  board[squareId] = player;
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
      gameWon.player == player1.role ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }

  if (gameWon.player == player1.role) {
    ++player1.score;
    declareWinner(`${player1.name} Won!`);
  } else {
    ++player2.score;
    declareWinner(`${player2.name} Won!`);
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
function darkMode() {
    let element = document.body;
    element.classList.toggle("dark-mode");
for(i of cells)
i.classList.toggle("tablecolor");
  }