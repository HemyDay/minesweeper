// Variable gameStarted stores the current state of the game (false = not started & true = started) 
let gameStarted = false;

// SETTINGS FOR THE GAME GRID ------------------------------------------------------------------------------------------------------------------------ //

const GAME_GRID = document.getElementById('gameMinesweeper');                       // Stores in the variable GAME_GRID the HTML element that will display the grid

const SQUARE_SIZE = '30px';                                                         // The size of the squares in px
let gridWidth = 0;                                                                  // The nb of squares in width
let gridHeight = 0;                                                                 // The nb of squares in height
let nbOfMines = Math.floor((gridWidth * gridHeight) / 10);                          // The number of mines (default = 10%)


// INITIALIZATION OF VARIABLES THAT ARE USEFULL FOR THE GAME ----------------------------------------------------------------------------------------- //
let allSquares = null;                                                              // Stores in allSquares all the HTML elements where class="square"



// FUNCTIONS DECLARATIONS  --------------------------------------------------------------------------------------------------------------------------- //

// generateGrid() GENERATES GRID USING THE INPUTS FROM THE FORM IN #startMenu
function generateGrid() {

    gridWidth = document.getElementById('col').value || 10;                         // The nb of squares in width  (default = 10)
    gridHeight = document.getElementById('row').value || 10;                        // The nb of squares in height (default = 10)
    nbOfMines = Math.floor(gridWidth * gridHeight) / 10;                            // The nb of mines             (10% of total squares)

    // Creates a grid element using the gridWidth and gridHeight properties, setting the size to SQUARE_SIZE px
    GAME_GRID.innerHTML = '<link rel="stylesheet" href="main.css">';
    GAME_GRID.style.display = "grid";
    GAME_GRID.style.gridTemplateColumns = `repeat(${gridWidth},${SQUARE_SIZE})`;
    GAME_GRID.style.gridTemplateRows = `repeat(${gridHeight}, ${SQUARE_SIZE})`;


    // Generate the squares inside the GAME_GRID
    for (let h = 0; h < (gridHeight); h++) {
        for (let w = 0; w < (gridWidth); w++) {
            GAME_GRID.innerHTML += `
            <div 
                class="square" 
                reveled="false" 
                nbOfMinesAround="0" 
                mine="0" flag="false" 
                id="${h}.${w}">
            </div>`;
        }
    }

    // arrayOfMines stores the id of squares that will be mines
    let arrayOfMinesID = [];

    // While we don't have the right amount of mines, generate one randomly and checks that it doesn't already exist
    while (arrayOfMinesID.length < nbOfMines) {
        newMine = `${Math.floor(Math.random() * gridHeight)}.${Math.floor(Math.random() * gridWidth)}`;
        if (arrayOfMinesID.indexOf(newMine) == -1) {arrayOfMinesID.push(newMine);}
    }

    // Assign the mine value to the square that will be mines
    for (let s = 0; s < arrayOfMinesID.length; s++) {
        document.getElementById(arrayOfMinesID[s]).setAttribute("mine", "1");
    }

    // Generates HTML that will display the score
    revealedSquares = 0;
    document.getElementById("points").innerHTML = revealedSquares;
    document.getElementById("pointsMax").innerHTML = (gridWidth * gridHeight) - nbOfMines;

}

// Template for checkSurroundings()
    // attribute = the attribute we are checking
    // goalValue = the value of the attribute we want to check
    // squareWeAreChecking = the id of the square we are checking
    // arrayToPush = the array where we want to store the id of the squareToCheck if it fulfills the requirements
function templateCheckSurroundings(attribute, goalValue, squareWeAreChecking, arrayToPush){
    if (document.getElementById(squareWeAreChecking).getAttribute(attribute) == goalValue 
    &&  document.getElementById(squareWeAreChecking).getAttribute('reveled') == 'false')
    {arrayToPush.push(squareWeAreChecking)};
    
}

// Function to check all adjacent squares and return and see if the fulfull a certain requirement
    // square = the id of the square we are checking    
    // input = either 'mine' or 'noMine 
        // 'mine' if we want to find the number of mines around the square 
        // 'noMine' if we want to make sure there are no mines around the square
function checkSurroundings(square, input){
    // Splits square's id into its row and column
    let squareID = square.getAttribute("id").split(".");
    let R = Number(squareID[0]);                        // row number
    let C = Number(squareID[1]);                        // column number

    // if input = 'mine' -> sets search settings to find squares where mine = 1
    if (input === "mine"){
        goalValue = 1;
        attribute = "mine";
    }

    // if input = 'noMine' -> sets search settings to find squares where mine = 0
    if (input === "noMine"){
        goalValue = 0;
        attribute = "mine";
    }

    // yes stores the id of the squares that fulfull the requirements
    let yes = [];

    // CHECK LEFT 
    if (C > 0){
        templateCheckSurroundings(attribute, goalValue, `${R}.${C-1}`, yes);
    }
    // CHECK UP LEFT
    if (R > 0 && C > 0){
        templateCheckSurroundings(attribute, goalValue, `${R-1}.${C-1}`, yes);
    }
    // CHECK UP
    if (R > 0){ 
        templateCheckSurroundings(attribute, goalValue, `${R-1}.${C}`, yes);
    }
    // CHECK UP RIGHT
    if (R > 0 && C < gridWidth-1){ 
        templateCheckSurroundings(attribute, goalValue, `${R-1}.${C+1}`, yes);
    }
    // CHECK RIGHT
    if (C < gridWidth-1){
        templateCheckSurroundings(attribute, goalValue, `${R}.${C+1}`, yes);
    }
    // CHECK DOWN RIGHT
    if (R < gridHeight-1 && C < gridWidth-1){
        templateCheckSurroundings(attribute, goalValue, `${R+1}.${C+1}`, yes);
    }
    // CHECK DOWN
    if (R < gridHeight-1){
        templateCheckSurroundings(attribute, goalValue, `${R+1}.${C}`, yes);
    }
    // CHECK DOWN LEFT
    if (R < gridHeight-1 && C > 0){
        templateCheckSurroundings(attribute, goalValue, `${R+1}.${C-1}`, yes);
    }

    // if input = 'mine' -> sets tje nbOfMinesAround attribute of this square to the nb of mines around
    if (input == "mine"){
        square.setAttribute('nbOfMinesAround', yes.length) 
    }

    // if input = 'noMine' -> returns yes (an array with the id of the surrounding squares that are not mines)
    if (input == "noMine"){
        return yes;
    }

}

// Function that executes when a square is revealed
function revealSquare(square){

    // Resets the innerHTML of the square
    square.innerHTML = ' ';

    // if square is not a mine but surrounded by at least one
    if (square.getAttribute('mine') != 1 && square.getAttribute('nbOfMinesAround') != 0) {
        // Redifine lineHeight to center text vertically
        square.style.lineHeight = SQUARE_SIZE;
        // square.innerHTML = nb of surrounding mines
        square.innerHTML = square.getAttribute("nbOfMinesAround");

    // if square is a mine
    } else if (square.getAttribute('mine') == 1) {
        // changes innerHTML to display a mine icon
        square.innerHTML = `<img src="ressources/icon_mine_16x16.png"/>`;

    // if the square is not a mine and surrounded by none
    } else if (square.getAttribute('nbOfMinesAround') == 0){
        // stores the id of all surrounding squares that are not mines in adjEmptySquare
        let ajdEmptySquares = checkSurroundings(square, "noMine");

        // For each surrounding squares that are not mines -> simulates a left click on them
        if (ajdEmptySquares.length > 0 && gameStarted === true ){
            ajdEmptySquares.forEach((adjsquare) => onSquareLeftClick(document.getElementById(adjsquare)));
        }

    }
}

// Left click event | reveals a square if it hasn't been reveled yet and handles the cases where it's a mine or not a mine
function onSquareLeftClick(square){

    // if the square hasn't been revelead yet (reveled = false) and if the game is running (gameStarted = true)
    if (square.getAttribute('reveled') == 'false' && gameStarted == true){

        // set reveled = true
        square.setAttribute('reveled', 'true');

        // if square is a mine
        if (square.getAttribute('mine') == 1) {
            // ends the game
            endGame();
            // colors the square in red
            square.style.backgroundColor = 'red';
        
        // if the square is not a mine
        } else {
            // reveals square
            revealSquare(square);
            
            // adds +1 to revealedSquares
            update_reveledSquares(+1);
        }
    
    }


}

// Right click event | adds a flag to the square if it hasn't been revealed yet and the game is still running
function onSquareRightClick(square){

    if (square.getAttribute('reveled') == 'false' && gameStarted === true) {
        // if the square already has a flag on it
        if (square.getAttribute('flag') == 'true'){
            // set flag = false
            square.setAttribute('flag', 'false');
            // removes flag image by setting innerHTML = ''
            square.innerHTML = ``;

        // if attribute flag = true
        } else { 
            // set flag = true
            square.setAttribute('flag', 'true');

            // adds a flag icon as innerHTML of the square
            square.innerHTML = `<img src="ressources/icon_flag_16x16.png"/>`;

        };
    }
}

// Set evenListeners to all squares for leftClick and rightClick (deactivates default rightClick behavior)
function addEventListenerToSquare(target){
    target.addEventListener("click", function (){onSquareLeftClick(target);});
    target.addEventListener("contextmenu", e => e.preventDefault());
    target.addEventListener("contextmenu", function (){onSquareRightClick(target);});
}

// START GAME FUNCTIONS ------------------------------------------------------------------------------------------------------------------------------ //
function startGame(){

    // dispay menu
        displayMenu();

    // Generate game grid
        generateGrid();

    // Stores all the elements where class='square' and stores them in the array allSquares
        allSquares = document.querySelectorAll('.square');
    
    // Checks the surroundings for each square and determines how many mines are around. Stores that result in the nbOfMinesAround attribute
        allSquares.forEach((square) => checkSurroundings(square, "mine"));
    
    // Adds all event listeners to all the squares to handle leftClick and rightClick events
        allSquares.forEach((square) => addEventListenerToSquare(square));

    // Start the game
        gameStarted = true;

    // Hides start menu
        hideStartMenu()


}

// END GAME FUNCTIONS -------------------------------------------------------------------------------------------------------------------------------- //
function endGame(){
    // Set gameStarted = false
    gameStarted = false;
    // Reveals all squares
    allSquares.forEach((square) => revealSquare(square));
    // Resets cursor to default 
    allSquares.forEach((square) => square.style.cursor = "default");
   
}

    
