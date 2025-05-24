const gridContainer = document.querySelector(".grid-container");
const Container = document.querySelector(".container");
const restartButton = document.querySelector(".restartBtn");
const correctSound = document.querySelector(".correctSound")
const wrongSound = document.querySelector(".wrongSound")
const muteButton = document.querySelector(".muteBtn");
const homeButton = document.querySelector(".homeBtn");
const ScoreboardBox = document.querySelector(".scoreboard-box");
const bgSound = document.querySelector(".bgSound")
const MainTitle = document.querySelector("#MainTitle")
const nav = document.querySelector(".nav")
const greeting = document.createElement("h3");
const welcome = document.createElement("div");
welcome.classList.add("welcome")


let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let timer;
let time = 0;
let playerName;

document.querySelector(".score").textContent = score;
// adding the mute button
window.onload = function () {
	bgSound.play()
	SetScoreBoard();
}
	let isMuted = false;

	muteButton.addEventListener("click", () => {
	if(isMuted){
		bgSound.play()
		muteButton.textContent = "🔊"
	} else {
		bgSound.pause()
		muteButton.textContent = "🔇";
	}
	isMuted = !isMuted
})

// welcome page elements
welcome.innerHTML = `
							<p>WELCOME TO OUR MATCHING GAME </p>
							<input type="text" class="name" maxLength="9" placeholder="please enter your name">
							<button class='btn btn-primary easyBtn'> Easy</button>
							<button class='btn btn-primary mediumBtn'> Medium</button>
							<button class='btn btn-danger hardBtn'> Hard</button>
					`;

gridContainer.appendChild(welcome);
// levels buttons for game
const easyBtn = document.querySelector(".easyBtn");
const mediumBtn = document.querySelector(".mediumBtn");
const hardBtn = document.querySelector(".hardBtn");
// event for every button fetching json array of object that have numbers of pics for level -- 1
easyBtn.addEventListener("click", function () {

	Difficulty = "easy";
	 playerName = document.querySelector(".name").value;
	gridContainer.innerHTML = "";
	greeting.innerHTML = `welcome to our game <span>${playerName}</span>`;
	gridContainer.before(greeting);
	restartButton.style.display = "block";
	fetch("data/cards.json")
		.then((res) => res.json())
		.then((data) => {
			// [1]
			cards = [...data, ...data];
			shuffleCards();
			generateCards();
			startTimer();
			ToggleNavbar();
			gridContainer.style.gridTemplateColumns = "repeat(4, 50px)";
		});
MainTitle.style.display = "none"
});
// -- 2
mediumBtn.addEventListener("click", function () {
	Difficulty = "medium";
	 playerName = document.querySelector(".name").value;
	gridContainer.innerHTML = "";
	greeting.innerHTML = `welcome to our game <span>${playerName}</span>`;
	gridContainer.before(greeting);
	restartButton.style.display = "block";
	fetch("data/cards2.json")
		.then((res) => res.json())
		.then((data) => {
			cards = [...data, ...data];
			shuffleCards();
			generateCards();
			startTimer();
			ToggleNavbar();
			gridContainer.style.gridTemplateColumns = "repeat(6, 50px)";
		});
		MainTitle.style.display = "none"

});
// -- 3
hardBtn.addEventListener("click", function () {
	Difficulty = "hard";
	 playerName = document.querySelector(".name").value;
	gridContainer.innerHTML = "";
	greeting.innerHTML = `welcome to our game <span>${playerName}</span>`;
	gridContainer.before(greeting);
	restartButton.style.display = "block";
	fetch("data/cards3.json")
		.then((res) => res.json())
		.then((data) => {
			cards = [...data, ...data];
			shuffleCards();
			generateCards();
			startTimer();
			ToggleNavbar();
					gridContainer.style.gridTemplateColumns = "repeat(8, 50px)";




		});
		MainTitle.style.display = "none"


});

// timer using set interval that time += 1 runs that function every second with format i gave him
function startTimer() {
	let seconds = 0;
	let minutes = 0;

	document.querySelector(".timer").textContent = "0:00";

	timer = setInterval(() => {
		seconds++;

		if (seconds >= 60) {
			seconds = 0;
			minutes++;
		}
		const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
		document.querySelector(".timer").textContent = `${minutes}:${formattedSeconds}`;
		}, 1000);
}

function ToggleNavbar(toggle = true) {

	if(toggle){
	nav.style.display =  "flex" ;

	ScoreboardBox.style.display = "none" ;
	Container.classList.add("game-container");
	}else{
	nav.style.display = "none";
	MainTitle.style.display =  "none";
	ScoreboardBox.style.display = "block";
		Container.classList.remove("game-container");
	}

}

// shuffle cards using math methods and check if fetching was done probably before it was run
function shuffleCards() {
	let currentIndex = cards.length;
	let randomIndex;
	let temporaryValue;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = cards[currentIndex];
		cards[currentIndex] = cards[randomIndex];
		cards[randomIndex] = temporaryValue;
	}
}
// creating divs and adding image and name to the card to compare if they match or not in next functions
function generateCards() {
	for (let card of cards) {
		const cardElement = document.createElement("div");
		cardElement.classList.add("card");
		cardElement.setAttribute("data-name", card.name);
		cardElement.innerHTML = `
			<div class="front">
			<img class="front-image" src=${card.image} />
			</div>
			<div class="back"></div>
			`;
		gridContainer.appendChild(cardElement);
		cardElement.addEventListener("click", flipCard);
	}
}

function SaveToLocalStorage( time) {
	var offlineData = JSON.parse(localStorage.getItem("offlineData")) || [];

	if(offlineData.length == 3){
		offlineData.pop();
	}
	offlineData = [{
		name: playerName ?? "Unknown",
		time: time,
		difficulty : Difficulty
	} , ...offlineData]
	localStorage.setItem("offlineData", JSON.stringify(offlineData));
}

function SetScoreBoard() {
	// get the current score and time from local storage
	var offlineData = JSON.parse(localStorage.getItem("offlineData")) || [];
	for (let index = 0; index < offlineData.length; index++) {
		const element = offlineData[index];
			const rows = document.querySelectorAll('.score-row');
	 rows[index].textContent = element.name + "-" + element.time +  "-" +element.difficulty ;
	}
}
//----------------------------------------------------------------------------------------

// stop the timer
function stopTimer() {
	clearInterval(timer);
}
// home button that reset everything
homeButton.addEventListener("click", function hoom () {
	gridContainer.innerHTML = "";
	greeting.innerHTML = "";
	SetScoreBoard()
	score = 0;
	gridContainer.appendChild(welcome);
	gridContainer.style.gridTemplateColumns = "";
	restartButton.style.display = "none";
	document.querySelector(".timer").textContent = "0:00";
	stopTimer();
	ToggleNavbar(false);
	document.querySelector(".score").textContent = score;
});
// restart button to restart the current difficulty
function restart() {
	resetBoard();
	shuffleCards();
	score = 0;
	document.querySelector(".score").textContent = score;
	gridContainer.innerHTML = "";
	generateCards();
	stopTimer();
	startTimer();
	document.getElementById('endGameModal').classList.add('hidden');

}
// fliping card and adding score by one and get it ready for next function that matches the cards
function flipCard() {
	if (lockBoard) return;
	if (this === firstCard) return;

	this.classList.add("flipped");
	if (!firstCard) {
		firstCard = this;
		return;
	}

	secondCard = this;
	score++;
	document.querySelector(".score").textContent = score;
	lockBoard = true;


	checkForMatch();
}
// checking the match of cards using the name of it i used in json file
function checkForMatch() {
	let isMatch = firstCard.dataset.name === secondCard.dataset.name;

	isMatch ? disableCards() : unflipCards();
}
// this function works if cards match
function disableCards() {
	firstCard.removeEventListener("click", flipCard); // --> to keep the card on its face
	secondCard.removeEventListener("click", flipCard);

	resetBoard();
}
// this function works if cards didnt match and takes 1 second before fliping it to make memory for the player
function unflipCards() {
	setTimeout(() => {
		firstCard.classList.remove("flipped");
		secondCard.classList.remove("flipped");
		resetBoard();
	}, 1000);
}
// to reset all flags i created and assigned to go to next cards
function resetBoard() {
	firstCard = null;
	secondCard = null;
	lockBoard = false;
}
// every time i flip 2 cards i go check for win
function checkForMatch() {
	let isMatch = firstCard.dataset.name === secondCard.dataset.name;

	if (isMatch) {
		disableCards();
		checkWin();
		correctSound.play()
	} else {
		unflipCards();
		wrongSound.play()
	}
}
// this check if all json file is now flipped and alreting or poping up for win time
function checkWin() {

	const flippedCards = document.querySelectorAll(".flipped");
	if (flippedCards.length === cards.length) {
		setTimeout(() => {
			time = document.querySelector(".timer").textContent;
			stopTimer();
			SaveToLocalStorage( time);
			showEndGame(score);
			document.getElementById("endGameModal").style.display = "flex";
		}, 500);
	}
}

function showEndGame(score) {
	const modal = document.getElementById("endGameModal");
	const scoreSpan = document.getElementById("finalScore");
	scoreSpan.textContent = score;
	modal.classList.remove("hidden"); // <-- makes it visible
	document.getElementById("difficulty").focus();
}


function restart_game_from_popup(selectedDifficulty = "easy") {
	document.getElementById("endGameModal").style.display = "none";

	score = 0;
	document.querySelector(".score").textContent = score;
	document.querySelector(".timer").textContent = "0:00";
	clearInterval(timer);

	// Clear board
    gridContainer.innerHTML = "";

	// Fetch and generate cards based on selectedDifficulty
    let jsonFile = "data/cards.json"; // default easy
    let gridCols = "repeat(4, 50px)";
		if (selectedDifficulty === "medium") {
			jsonFile = "data/cards2.json";
			gridCols = "repeat(6, 50px)";
		} else if (selectedDifficulty === "hard") {
			jsonFile = "data/cards3.json";
			gridCols = "repeat(8, 50px)";
		}

    fetch(jsonFile)
        .then(res => res.json())
        .then(data => {
            cards = [...data, ...data];
            shuffleCards();
            generateCards();
            gridContainer.style.gridTemplateColumns = gridCols;
            startTimer();
			// ToggleNavbar();
        });

}

function startNewGame() {
	// Hide the end game modal
	document.getElementById('endGameModal').classList.add('hidden');
	const boxes = document.getElementsByClassName("scoreboard-box");
	for (let box of boxes) {
		box.style.display = "none";
	}
	// Get the selected difficulty
	const difficulty = document.getElementById("difficulty").value;
	restart_game_from_popup(difficulty);
}

function home() {
	document.getElementById("endGameModal").style.display = "none"
	gridContainer.innerHTML = "";
	greeting.innerHTML = "";
	SetScoreBoard()
	score = 0;
	gridContainer.appendChild(welcome);
	gridContainer.style.gridTemplateColumns = "";
	restartButton.style.display = "none";
	document.querySelector(".timer").textContent = "0:00";
	stopTimer();
	ToggleNavbar(false);
	document.querySelector(".score").textContent = score;
	document.getElementById('endGameModal').classList.add('hidden');
}
