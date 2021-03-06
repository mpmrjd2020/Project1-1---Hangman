console.log('Welcome to your first project')

var randomWordArray = ['Dubuque', 'Maquoketa', 'Davenport', 'Des Moines', 'Bettendorf',
                    'Iowa City', 'Cedar Rapids', 'Waterloo', 'Van Horne', 'Grimes',
                    'Johnston', 'Ankeny', 'Ames', 'Urbandale', 'Sioux City', 
                    'Cedar Falls', 'Asburry', 'Ottumwa', 'Cedar Falls', 'Mason City',
                    'Adel', 'Adair', 'Clive', 'Ely', 'Nashua']

var keyboardArr = [['a','b','c','d','e','f','g'],
               ['h','i','j','k','l','m','n'],
               ['o','p','q','r','s','t','u'],
               ['v','w','x','y','z']]

var scaffoldCanvas = [[' ', '|', '_', '_', '_', '_', ' '],
                       [' ', '|', ' ', ' ', ' ', ' ', ' '],
                       [' ', '|', ' ', ' ', ' ', ' ', ' '],
                       [' ', '|', ' ', ' ', ' ', ' ', ' '],
                       [' ', '|', ' ', ' ', ' ', ' ', ' '],
                       [' ', '|', ' ', ' ', ' ', ' ', ' '],
                       [' ', '|', ' ', ' ', ' ', ' ', ' '],
                       ['_', '|', '_', '_', '_', '_', '_']]

var guessWordArr = [] 
var compareWordArr = []
var keyboardDisbleArr = []

const keyboardTotalKeys = 26

const pressStart = document.querySelector('#startBtn')
const submitButton = document.querySelector('#submitBtn')
const guessLetterIn = document.querySelector('.guessWordIn')
const onStartGameDisplay = document.querySelector('#gameDisplay')

var currentWord = ""
var numberOfGuess = 0
var numberOfMissedGuess = 0
var numberOfGguessRemaining = 0
var numberOfLives = 8
var compareMatch = false
var gameWon = false

var timeGmStart = 0
var timeGmFinish = 0
var timeGameDuration = 0
var timeGameMinute = 0
var timeGameSecond = 0
var highestScoreDisplay = 0
var highestGameScore = 0
var highestGameSecond = 0


main()

function main() {
    buildKeyboard()
    buildScafold()
    getDisplayHighestScore()
    pressStart.addEventListener("click", onPressStart)
    submitButton.addEventListener("click", onSubmit)
    document.querySelector('#gameDisplay').innerHTML = `Please select the 'Random City' button to have the name of a city in Iowa generated for you. Or enter a word and submit for a friend to play.`
}

/* 
*   Load game key board upon starting the game 
*/
function buildKeyboard() {
    keyboardArr.forEach(function(element,index,kbArr) {
        const arrKBLen = element.length
        letterArray = element
        for (let i = 0; i < arrKBLen; i++) {
            const appendKeyNode = document.querySelector(`.keyRows${index+1}`)
            var divNodeKB = document.createElement("DIV")
            divNodeKB.setAttribute("class", "gameKeys")
            divNodeKB.setAttribute("id", `keys${letterArray[i]}`)
            divNodeKB.innerHTML = letterArray[i]
            appendKeyNode.append(divNodeKB)
        }
    })
}

/*
*   Build initial gallows mat upon starting the game
*/
function buildScafold() {
    scaffoldCanvas.forEach(function(scElement, scIndex, scArr) {
        const arrSCLen = scElement.length
        scaffoldArray = scElement
        for (let j = 0; j < arrSCLen; j++) {
            const appendSCNode = document.querySelector(`.HangLayer${scIndex+1}`)
            var divNodeSC = document.createElement("DIV")
            divNodeSC.setAttribute("class", "scafoldPiece")
            divNodeSC.setAttribute("id", `scaffold${scIndex}${j}`)
            divNodeSC.innerHTML = scaffoldArray[j]
            appendSCNode.append(divNodeSC)            

        }
    })
}

/*
*   Pressing the start button activate the gameboard with a ramdom guess
*/
function onPressStart() {
    playSound()
    generateRandomWord()
    deactivateSubmit()
    processGameChoice() 
}

/*
*   Pressing the submit button to activate the gameboard with a user provided guess
*/
function onSubmit() {
    captureUserEntry()
    playSound()
    deactivateStart()
    processGameChoice() 

}

function playSound() {
    var gameSound = document.querySelector('#hangmanSound')
    gameSound.play()
}

/*
*   Activate keyboard
*/
function processGameChoice() {
    const onStartHangingArea = document.querySelectorAll('.scafoldPiece')
    const activateKeysArray = document.querySelectorAll('.gameKeys')
    activateKeysArray.forEach(elem => {
        elem.addEventListener('click', playTheGameFunction)
        elem.style.color = 'rgb(0,0,0)'
        elem.style.border = '2px solid rgb(0, 0, 0)' 
    })

    activatePlayAgain()
/*
*   Setting up the style of various elements when the gameboard is activated
*/ 
    guessLetterIn.style.border = '2px solid rgb(0, 0, 0)'
    guessLetterIn.style.background = 'rgb(255, 255, 255)'

    onStartHangingArea.forEach(function(hangElem, hangIndex, hangArr) {
        hangElem.style.color = 'rgb(0, 0, 0)'
    })

    onStartGameDisplay.style.border = '2px solid rgb(0, 0, 0)'
    onStartGameDisplay.style.color = 'rgb(0, 0, 0)'

    document.querySelector('#gameDisplay').innerHTML = `Please guess the name of a city in the state of Iowa. You have ${numberOfGuess} guesses.`

//    this.removeEventListener("click", onPressStart)
//    this.removeEventListener("click", onSubmit)
    deactivateSubmit()
    deactivateStart()


/*
*   Getting the game starting time to start tracking the user time to completing the game.
*/
    timeGmStart = Date.now()
 
}

/*
*   Function with main game logic
*/
function playTheGameFunction(event) {
    let elKey = `${this.textContent}`
    let compareWordArr = currentWord.toLowerCase().split(''); 

    compareWordArr.forEach(function(letterCompare, indexCompare, compareArray){
        if (indexCompare === 0) {
            numberOfGuess -= 1
        }
        if (letterCompare === elKey) {
            guessWordArr.push(letterCompare)
            document.querySelector(`#${letterCompare}${indexCompare}`).innerHTML = letterCompare
            evaluateGameResult()
            compareMatch = true
            } 
        if (gameWon === false) {
            if ((indexCompare + 1) === currentWord.length) {
                if (numberOfGuess !== 0) {      
                    if (compareMatch === false) {
                        numberOfMissedGuess += 1
                        numberOfLives -= 1
                        updateScaffold()    
                    } else {
                        compareMatch = false
                    }                   
                        if (numberOfLives === 0) {
                            document.querySelector('#gameDisplay').innerHTML = `Game over! You are out of lives. The guess is ${currentWord}`
                            gameKeyboardReset() 
                        } else {
                            document.querySelector('#gameDisplay').innerHTML = `You have ${numberOfGuess} guesses and ${numberOfLives} lives remaining.`
                        }                                 
                } else {
                        numberOfMissedGuess += 1
                        numberOfLives -= 1
                        updateScaffold() 
                        if (numberOfLives !== 0) {
                            document.querySelector('#gameDisplay').innerHTML = `Game over! You are out of guesses. The guess is ${currentWord}`   
                        } else {
                            document.querySelector('#gameDisplay').innerHTML = `Game over! You are out of guesses and lives. The guess is ${currentWord}`
                        }                
                    gameKeyboardReset() 
                }
            }
        }

    } )

    this.style.color = 'rgb(183, 163, 163)'
    this.style.border = '2px solid rgb(183, 163, 163)' 

    this.removeEventListener('click',playTheGameFunction)
}

/*
*   Play again game logic
*/

function activatePlayAgain(event) {
    console.log('activatePlayAgain ')
    const pressPlayAgain = document.querySelector('#resetBtn')
    pressPlayAgain.style.color = 'rgb(0, 0, 0)' 
    pressPlayAgain.style.background = 'rgb(206, 206, 156)'
    pressPlayAgain.style.border = '2px solid rgb(0, 0, 0)'  
    pressPlayAgain.addEventListener("click", () => {
        window.location.reload(true)
    })
}

function deactivateSubmit() {
    console.log('deactivate submit')
    console.log(this)
    submitButton.style.color = 'rgb(183, 163, 163)'
    submitButton.style.border = '2px solid rgb(183, 163, 163)' 
    submitButton.style.background = 'rgb(249, 250, 245)'
    submitButton.disabled = true

    userWord.style.color = 'rgb(183, 163, 163)'
    userWord.style.border = '2px solid rgb(183, 163, 163)' 
    userWord.value = ''
    userWord.disabled = true
}

function deactivateStart() {
    console.log('deactivate start')
    console.log(this)
    pressStart.style.color = 'rgb(183, 163, 163)'
    pressStart.style.border = '2px solid rgb(183, 163, 163)' 
    pressStart.style.background = 'rgb(249, 250, 245)'
    pressStart.disabled = true

}
/*
*   Random city generation
*/
function generateRandomWord() {
    const indexRdArr = Math.floor(Math.random() * randomWordArray.length)
    currentWord = randomWordArray[indexRdArr]
    guessWordPrompt() 
}

/*
*   Capture user guess
*/
function captureUserEntry() {
    currentWord = document.querySelector('#userWord').value
    if (currentWord.length === 0) {
        alert('Please enter the name of a city!')
        window.location.reload(true)
    } else {
    console.log(currentWord)
    guessWordPrompt() 
    }
}

/*
*   Display logic for word to be guessed
*/
function guessWordPrompt() {    
    let currentWordArr = currentWord.toLowerCase().split('');
    const currentWordArrLen = currentWordArr.length
    currentWordArr.forEach(function(currElem, currIndex, currWarr){
        var currNodeLetter = document.createElement("DIV")
        currNodeLetter.setAttribute("class", "currWordLetter")
        currNodeLetter.setAttribute("id", `${currElem}${currIndex}`)
        if (currElem === ' ') {
            currNodeLetter.innerHTML = ' '
        } else {
            currNodeLetter.innerHTML = '_'
        }
        guessLetterIn.append(currNodeLetter)       
    })
    if (currentWordArrLen <= 5) {
        numberOfGuess = 8
    } else {
        numberOfGuess = currentWordArrLen + 3
    }
} 


/*
*   Determine winner
*/
function evaluateGameResult() {
    var removeBlank = []
    let ctrial = currentWord.toLowerCase().split(''); 
    ctrial.forEach(function(remElement, remIndex, remArr){
        if (remElement !== ' ') {
            removeBlank.push(remArr[remIndex]) 
        }
    })
    if (guessWordArr.length == removeBlank.length) {
        gameOverWin()
    }

}

/*
*   Process winning steps
*/
function gameOverWin() {
    document.querySelector('#gameDisplay').innerHTML = 'Congratulations! You have won the game.'
    gameWon = true
    calculateGameDuration()
    determineStoreHighestScore()
    gameKeyboardReset() 
}

/*
*   Scaffold building
*/
function updateScaffold() {
    if (numberOfMissedGuess === 1) {
        document.querySelector('#scaffold15').innerHTML = '|'
    } else if (numberOfMissedGuess === 2) {
        document.querySelector('#scaffold25').innerHTML = 'O'
    } else if (numberOfMissedGuess === 3) {
        document.querySelector('#scaffold35').innerHTML = '|'
    } else if (numberOfMissedGuess === 4) {
        document.querySelector('#scaffold34').innerHTML = '/'
    } else if (numberOfMissedGuess === 5) {
        document.querySelector('#scaffold36').innerHTML = '\\'
    } else if (numberOfMissedGuess === 6) {
        document.querySelector('#scaffold45').innerHTML = '|'
    } else if (numberOfMissedGuess === 7) {
        document.querySelector('#scaffold54').innerHTML = '/'
    } else if (numberOfMissedGuess === 8) {
        document.querySelector('#scaffold56').innerHTML = '\\'
    } 
}

/*
*   Reset all keyboard keys
*/
function gameKeyboardReset() {
    keyboardDisbleArr = document.querySelectorAll('.gameKeys')
    keyboardDisbleArr.forEach(function checkMatch(cmatchEl, cmatchIndex, cmatchArr) {
        let matchArrElement = false
        for (let k = 0; k < guessWordArr.length; k++) {
            if (cmatchEl === guessWordArr[k]) {
                matchArrElement = true
            } 
        }

        if (matchArrElement === false) {
            cmatchEl.style.color = 'rgb(183, 163, 163)'
            cmatchEl.style.border = '2px solid rgb(183, 163, 163)' 
            cmatchEl.removeEventListener('click',playTheGameFunction)
        }
    });
 
}

/*
*   Game scoring logic
*/
function calculateGameDuration() {
    timeGmFinish = Date.now()
    timeGameDuration = timeGmFinish - timeGmStart
    timeGameMinute = timeGameDuration / 60000
    timeGameSecond = Math.ceil((timeGameMinute - Math.trunc(timeGameMinute)) * 60)

    timeDisplayMinute = Math.trunc(timeGameMinute)
    document.querySelector('.playerScore').innerHTML = `Player score: ${timeDisplayMinute} min. ${timeGameSecond} sec.`
}

function getDisplayHighestScore() {
    highestGameScore = parseFloat(localStorage.getItem('highestScore'))
    if (isNaN(highestGameScore)) {
        highestGameScore = 0
    }
    highestGameSecond = Math.ceil((highestGameScore - Math.trunc(highestGameScore)) * 60)
    highestScoreDisplay = Math.trunc(highestGameScore)
    document.querySelector('.gameScore').innerHTML = `Highest Score: ${highestScoreDisplay} min. ${highestGameSecond} sec.`  
}

function determineStoreHighestScore() {
    if (highestGameScore > timeGameMinute) {
        localStorage.removeItem('highestScore')
        localStorage.setItem('highestScore', timeGameMinute)
        document.querySelector('.gameScore').innerHTML = `Player score: ${timeDisplayMinute} min. ${timeGameSecond} sec.` 
    }
}

//