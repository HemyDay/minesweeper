// Stores in the variable startMenu the HTML element that will display the start menu
const START_MENU = document.getElementById('startMenu')


// Function that sets the display of START_MENU to grid and inject the html content
function displayStartMenu() {
        START_MENU.innerHTML = `
                <div> <p>Columns</p> <input type="number" id="col" min="1" max="20"></input> </div>
                <div> <p>Rows</p>    <input type="number" id="row" min="1" max="20"></input> </div>
                <button id="start" type="button" onclick="startGame()"> START ! </button>
        `
        START_MENU.style.display = 'grid'
};


// Funcition that sets the display of START_MENU to none
function hideStartMenu(){
        START_MENU.style.display = 'none';
}

// Function that is executed when the page loads
displayStartMenu();

