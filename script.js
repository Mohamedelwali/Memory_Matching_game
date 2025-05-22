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
let Difficulty;
//alfy
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