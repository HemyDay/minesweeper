// Stores in the variable menu the HTML element that will display the game menu
const MENU = document.getElementById('menuMinesweeper');


// Function that sets the display of MENU to grid and inject the html content
function displayMenu(){
    MENU.style.display = 'grid';
    MENU.innerHTML = `
        <p> </p>
        <p>Points : <span id="points"></span> / <span id="pointsMax"></span> </p>
        <button id="endGame"     type="button" onclick="endGame()">     End Game     </button>
        <button id="restartGame" type="button" onclick="restartGame()"> Restart Game </button>
    `;
}

// Stores in revealedSquares the nb squares that have been revealed
let revealedSquares = 0;      

// Function that updates revealedSquares
function update_reveledSquares(nb){
    revealedSquares += nb;
    document.getElementById("points").innerHTML = revealedSquares;
}

// function to restart the game (hides MENU & GAME_GRID)
function restartGame(){
    GAME_GRID.style.display = "none";
    MENU.style.display = "none";
    displayStartMenu();
}