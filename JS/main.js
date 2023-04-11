const pvp = document.getElementById('pvp') 
const pvc = document.getElementById('pvc')
const returnhome = document.getElementById('returnhome')
const reset = document.getElementById('reset')
const prev = document.getElementById('prev') // Previous Button
const next = document.getElementById('next')// Next Button
const clearhistory = document.getElementById('clearhistory')

const popup = document.getElementsByClassName('popup')[0]
const msg = document.getElementsByClassName('msg')[0]
const menucontainer = document.getElementsByClassName('menucontainer')[0]
const boardscene = document.getElementsByClassName('boardscene')[0]
const mainboard = document.getElementsByClassName('mainboard')[0]


const historylist = document.getElementsByClassName('historylist')[0]
const closebtn = document.getElementsByClassName('closebtn')[0]
const historymodule = document.getElementById('historymodule')
const historymodal = document.getElementById('historymodal')

let mode = "" // mode of the game
let gamestatus = true // player1 turn
let player1sym = "" //player1 symbol
let player2sym = ""//player2 symbol
let gameover = false // gameover state
// mainboard
let board= [
    ["","",""],
    ["","",""],
    ["","",""]
]
let moves = [] // history container of all
let history = []

//player vs player is clicked
pvp.addEventListener('click',async()=>{
    mode = "pvp"

    const { value: player1 } = await Swal.fire({
        title: 'Player 1 Symbol',
        input: 'text',
        inputPlaceholder: 'X',
        inputValidator: (value) => {
            if (value.length == 0) {
                return 'You need to write something!'
            }else if (value.length > 1 ){
                return 'Should contain 1 character only'
            }
        }
    })
    
    player1sym = player1.toUpperCase();

    const { value: player2 } = await Swal.fire({
        title: 'Player 2 Symbol',
        input: 'text',
        inputPlaceholder: 'O',
        inputValidator: (value) => {
            if (value.length == 0) {
                return 'You need to write something!'
            }else if (value.length > 1 ){
                return 'Should contain 1 character only'
            }else if (value.toUpperCase() == player1sym ){
                return 'Use Different Character'
            }
        }
    })
    
    player2sym = player2.toUpperCase();

    menucontainer.style.display = "none"
    boardscene.style.display = "block"
})
//player vs ai is clicked
pvc.addEventListener('click',async()=>{
    mode = "pva"

    
    const { value: player1 } = await Swal.fire({
        title: 'Player 1 Symbol',
        input: 'text',
        inputPlaceholder: 'X',
        inputValidator: (value) => {
            if (value.length == 0) {
                return 'You need to write something!'
            }else if (value.length > 1 ){
                return 'Should contain 1 character only'
            }
        }
    })
    
    player1sym = player1.toUpperCase();

    const { value: player2 } = await Swal.fire({
        title: 'Player 2 Symbol',
        input: 'text',
        inputPlaceholder: 'O',
        inputValidator: (value) => {
            if (value.length == 0) {
                return 'You need to write something!'
            }else if (value.length > 1 ){
                return 'Should contain 1 character only'
            }else if (value.toUpperCase() == player1sym ){
                return 'Use Different Character'
            }
        }
    })
    
    player2sym = player2.toUpperCase();

    menucontainer.style.display = "none"
    boardscene.style.display = "block"
})
// resetting the board
reset.addEventListener('click',()=>{
    board= [
        ["","",""],
        ["","",""],
        ["","",""]
    ]
    for (let i = 0; i < mainboard.children.length; i++) {
        mainboard.children[i].innerHTML = ""
        mainboard.children[i].className = "box"
    }
    gamestatus = true
    gameover = false

    prev.style.display = "none" // hide the previous button
    next.style.display = "none"// hide the next button
    moves = []
})
// return to main menu
returnhome.addEventListener('click',()=>{
    // call the reset function
    reset.click();
    history = []
    menucontainer.style.display = "block"
    boardscene.style.display = "none"
    historylist.innerHTML = ""
    clearhistory.style.display ="none"
})
popup.addEventListener('click',()=>{
    popup.style.display = "none"
})

// when the board has been clicked
function panelclick(idval){
    const id = document.getElementById(idval)

    // split the id to get the coordinate of the board
    let pval = idval.split("") 
    let positionx = parseInt(pval[1])
    let positiony = parseInt(pval[2])

    //check if the position in the board has been occupied
    if(board[positionx][positiony] != "" || gameover)
        return 0

    // designate proper symbol based on the symbol status from gamestatus
    let usersym = (gamestatus) ? player1sym : player2sym
    let playerwho = (gamestatus) ? "player1" : "player2"

    // set the value in designated position
    id.innerHTML = usersym
    id.classList.add(playerwho)
    id.classList.remove("box")
    board[positionx][positiony] = usersym

    // Use to copy the current board
    let copymove = []
    for (var i = 0; i < board.length; i++) {
        copymove[i] = board[i].slice();
    }
    // Save the copy of the current board in the moves
    moves.push(copymove)

    // check if someone wins the game
    if(verticalcheck(usersym) || horizontalcheck(usersym) || diagonalcheck(usersym)){
        endgame(playerwho + " Wins")

    }else if (checkdraw()){
        endgame("Tie")
    }

    //turn change
    gamestatus = !gamestatus

    if(mode != 'pvp'){
        aimove()
    }
}

