const gridContainer = document.querySelector(".grid-container");
const Container = document.querySelector(".container");
const restartButton = document.querySelector(".restartBtn");
const correctSound = document.querySelector(".correctSound")
const wrongSound = document.querySelector(".wrongSound")
const muteButton = document.querySelector(".muteBtn");
const homeButton = document.querySelector(".homeBtn");
const bgSound = document.querySelector(".bgSound")
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
			gridContainer.style.gridTemplateColumns = "repeat(4, 70px)";
		});
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
			gridContainer.style.gridTemplateColumns = "repeat(6, 70px)";
		});
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
			gridContainer.style.gridTemplateColumns = "repeat(8, 70px)";
		});
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

		document.querySelector(
			".timer"
		).textContent = `${minutes}:${formattedSeconds}`;
	}, 1000);
}

function ToggleNavbar(toggle = true) {

	if(toggle){
	nav.style.display =  "flex" ;
	MainTitle.style.display =  "block" ;
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
