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

// Shows the winner
function endgame(message){
    popup.style.display = "block"
    msg.innerHTML = message

    gameover = true
    currentmovecount = moves.length -1 // get the final move

    prev.style.display = "block" // show the previous button
    next.style.display = "block"// show the next button
    prev.disabled = false
    next.disabled = true

    // Use to copy the current board 
    let copymove = []
    for (var i = 0; i < moves.length; i++) {
        copymove[i] = moves[i].slice();
    }
    history.push(copymove)

    
   
    // create a list for the history list
    let listtobeadded = document.createElement('li')
    // value of the list
    let listinner = `<div>Game ${history.length}</div>
    <button id="${history.length - 1}" onclick="showhistory(${history.length - 1})">Show</button>`
    listtobeadded.innerHTML = listinner
    // append the list
    historylist.append(listtobeadded)
    clearhistory.style.display = "block"
}

// check the lines vertically 
function verticalcheck(sym){
    for (let i = 0; i < 3; i++) {
        if(board[0][i]== sym &&
            board[1][i]== sym &&
            board[2][i]== sym 
        ){
            return true
        }
        
    }
    return false;
}
// check the lines horizontally
function horizontalcheck(sym){
    for (let i = 0; i < 3; i++) {
        if(board[i][0]== sym &&
            board[i][1]== sym &&
            board[i][2]== sym 
        ){
            return true
        }
        
    }
    return false;
}
// check the lines diagonally
function diagonalcheck(sym) {
    if(board[0][0] == sym &&
        board[1][1] == sym &&
        board[2][2] == sym 
    ){
        return true
    }
    if(board[0][2] == sym &&
        board[1][1] == sym &&
        board[2][0] == sym 
    ){
        return true
    }

    return false
}
// check if there are an empty parts in the board
function checkdraw(){
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(board[i][j]==""){
                return false
            }
        }
    }
    return true
}
//Previous Button
prev.addEventListener('click',()=>{
    //check if the button is disabled
    if (prev.disabled) {return }
    // check if the counter is 1 disable the previous button
    if (currentmovecount == 1){
        prev.disabled  = true
    }
    currentmovecount -= 1 
    next.disabled = false // undisabled the next button

    /// change the values in the board based on the history of moves
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById("p"+i+""+j).innerHTML = moves[currentmovecount][i][j]
        }
        
    }
})
// Next Button onclick function
next.addEventListener('click',()=>{
    //check if the button is disabled
    if (next.disabled) {return }


    currentmovecount += 1 
    prev.disabled = false // undisabled the next button

    /// change the values in the board based on the history of moves
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById("p"+i+""+j).innerHTML = moves[currentmovecount][i][j]
        }
        
    }
    // check if the counter is 1 disable the previous button
    if (currentmovecount == moves.length-1){
        next.disabled  = true
    }
})

// show the history modal
historymodal.addEventListener('click',()=>{
    historymodule.style.display = "block"
})
// clear all the existing history of the match
clearhistory.addEventListener('click',()=>{
    history = []
    historylist.innerHTML = ""
    clearhistory.style.display = "none"
})
//close the history modal
closebtn.addEventListener('click',()=>{
    historymodule.style.display = "none"
})
//show the history per game
function showhistory(id){
    gameover = true
    moves = history[id]
    currentmovecount = moves.length -1 // get the final move
    let usersym = ""

    //reset the board
    for (let i = 0; i < mainboard.children.length; i++) {
        mainboard.children[i].innerHTML = ""
        mainboard.children[i].className = "box"
    }
    prev.style.display = "block" // show the previous button
    next.style.display = "block"// show the next button
    prev.disabled = false
    next.disabled = true
    //to know the symbol of the 1st player
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (moves[0][i][j] != ""){
                usersym = moves[0][i][j]
                break
            }
        }
        
    }

    /// change the values in the board based on the history of moves
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById("p"+i+""+j).innerHTML = moves[currentmovecount][i][j]
            if (moves[currentmovecount][i][j] == usersym){
                document.getElementById("p"+i+""+j).classList.add("player1")
            }else
            {
                document.getElementById("p"+i+""+j).classList.add("player2")
            }
        }
    }


}

// position taken by the ai
function randomai(){
    // ai possible coordinate
    let pmove = [
        [0,0],[0,1],[0,2],
        [1,0],[1,1],[1,2],
        [2,0],[2,1],[2,2]
    ]
    //random number targetting the coordinates in the pmove array
    let randomnum = Math.floor(Math.random() * 9);

    // designate proper symbol based on the symbol status from gamestatus
    let usersym = (gamestatus) ? player1sym : player2sym
    let enemysym = !(gamestatus) ? player1sym : player2sym

    //try to secure the win of the computer and increase the difficulty of the game

    //secure the center board
    if(board[1][1] == ""){
        return pmove[4]
    }else{
        //check for ai's winning move
        if(aiverticalcheck(usersym)!= false || aihorizontalcheck(usersym)!= false || aidiagonalcheck(usersym)!= false ){
            let aiwinning = [aiverticalcheck(usersym),aihorizontalcheck(usersym),aidiagonalcheck(usersym)]

            for (let i = 0; i < aiwinning.length; i++) {
                if(aiwinning[i] != false){
                    //pick the winning coordinate
                    return aiwinning[i]
                }
            }
        }
       
        //check if player is winning
        else if(aiverticalcheck(enemysym)!= false || aihorizontalcheck(enemysym) != false || aidiagonalcheck(enemysym)!= false ){
            let aiwinning = [aiverticalcheck(enemysym),aihorizontalcheck(enemysym),aidiagonalcheck(enemysym)]
            for (let i = 0; i < aiwinning.length; i++) {
                if(aiwinning[i] != false){
                    //pick the good position coordinate
                    return aiwinning[i]
                }
            }
        }
    }

    //check if it will be the 1st move of the ai
    let counteratk = 0
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(board[i][j]!=""){
                counteratk++
            }
        }
    }
    //secure the corner side
    if(counteratk <= 1){
        let randomnum2 = Math.floor(Math.random() * 4);
        let corners = [
            [0,0],[0,2],
            [2,0],[2,2]
        ]
        //random cornermove
        return corners[randomnum2]
    }
    


    //random move
    return pmove[randomnum]
}
// aimove based on randomai
function aimove(){
    if(gameover)
        return 0

    
    let targetnum = randomai()
    let positionx =targetnum[0]
    let positiony =targetnum[1]

    const id = document.getElementById("p"+targetnum[0] +""+targetnum[1])

    //check if the position in the board has been occupied
    if(board[targetnum[0]][targetnum[1]] == ""){
        

        // designate proper symbol based on the symbol status from gamestatus
        let usersym = (gamestatus) ? player1sym : player2sym // ai symbol
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

        // check if computer wins the game
        if(verticalcheck(usersym) || horizontalcheck(usersym) || diagonalcheck(usersym)){
            endgame("Computer Wins")
    
        }else if (checkdraw()){
            endgame("Tie")
        }
    
        //turn change
        gamestatus = !gamestatus
    }else{
        aimove()
    }
}
// check the lines vertically
function aiverticalcheck(sym){
    let aicounter = 0 // count the number of sign in the range
    let poscontainer = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(board[j][i] == sym){
                aicounter++
            }else{
                if (board[j][i] == ""){
                    poscontainer[0] = j
                    poscontainer[1] = i
                }else{
                    aicounter--
                }
            }
        }
        if(aicounter == 2){
            return poscontainer
        }
        aicounter = 0
    }
    return false

}
// check the lines horizontally
function aihorizontalcheck(sym){
    let aicounter = 0 // count the number of sign in the range
    let poscontainer = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {

            if(board[i][j] == sym){
                aicounter++
            }else{
                if (board[i][j] == ""){
                    poscontainer[0] = i
                    poscontainer[1] = j
                }else{
                    aicounter--
                }
            }
        }

        if(aicounter == 2){
            return poscontainer
        }
        aicounter = 0
    }

    return false
}
// check the lines diagonally
function aidiagonalcheck(sym) {

    let aicounter = 0 // count the number of sign in the range
    let poscontainer = []

    for (let i = 0; i < 3; i++){
        if(board[i][i] == sym){
                aicounter++
        }else{
            if (board[i][i] == ""){
                poscontainer[0] = i
                poscontainer[1] = i
            }else{
                aicounter--
            }
        }
    }
    //check if the counter is 2
    if(aicounter == 2){
        return poscontainer
    }
    // reset the counter
    aicounter = 0

    for (let i = 0; i < 3; i++) {
        if(board[i][2-i] == sym){
            aicounter++
        }else{
            if (board[i][2-i] == ""){
                poscontainer[0] = i
                poscontainer[1] = 2-i
            }else{
                aicounter--
            }
        }
    }
    
    //check if the counter is 2
    if(aicounter == 2){
        return poscontainer
    }

    return false
}