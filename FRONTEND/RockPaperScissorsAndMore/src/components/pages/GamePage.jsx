import { Link } from 'react-router-dom';
import React, {useState} from 'react'
import "./GamePage.css";

function GamePage({socket, pNick, eNick, gCode, fPlayer}) {

  // let [playerNick, setPlayerNick] = useState(pNick)
  let [playerScore, setPlayerScore] = useState("0")
  let [enemyNick, setEnemyNick] = useState("Enemy")
  let [enemyScore, setEnemyScore] = useState("0")
  // let [gameCode, setGameCode] = useState(gCode)

  let [roundStarted, setRoundStarted] = useState(false)
  let [roundNumer, setRoundNumber] = useState(1)
  // let [messageCounter, setMessageCounter] = useState(0)

  console.log("Ustawiam counter na zero!")
  localStorage.setItem("counter", 0)


  let playerNick = pNick;
  // let enemyNick = eNick;
  let gameCode = gCode;

  let isFirstPlayer = fPlayer



  let [playerMove, setPlayerMove] = useState("nothing")

  let [possibleMoves, setPossibleMoves] = useState(["fire", "scissors", "snake", "human", "tree", "wolf", "sponge", "paper", "air", "water", "dragon", "devil", "lightning", "gun", "rock"])

  let [attackButtonStyle, setAttackButtonStyle] = useState("attack-btn disabled")


  const handleMovePick = (event) => {
    if (event.target.name != playerMove){
      setPlayerMove(event.target.id)
      if(roundStarted){
        setAttackButtonStyle('attack-btn')
      }
    }
    
  }

  const handleAttack= () => {
    socket.emit('on_play', {username: playerNick, room: gameCode, playerMove: playerMove})
    setAttackButtonStyle('attack-btn disabled')
    setPlayerMove("nothing")
    setRoundStarted(false)
    // setPossibleMoves(possibleMoves.filter(it != playerMove))
    const filtering = move => move != playerMove
    console.log(possibleMoves.filter(filtering))
    setPossibleMoves(possibleMoves.filter(filtering))
  }

  socket.on('secondPlayer', (data) =>{
    console.log(data)

    if (data.player1 == playerNick){
      setEnemyNick(data.player2)
    }else{
      setEnemyNick(data.player1)
    }
    setRoundStarted(true)
    if(playerMove != "nothing"){
      setAttackButtonStyle('attack-btn')
    }
    
  })

  socket.on('result', (data) => {
    setRoundStarted(true)

    if(!data.game_over){
      if(playerMove != "nothing"){
        setAttackButtonStyle('attack-btn')
      }else(
        setAttackButtonStyle('attack-btn disabled')
      )
  
  
      console.log(data)
      setRoundNumber(data.round_number + 1)
      if(data.player1 == playerNick){
        setPlayerScore(data.score1)
        setEnemyScore(data.score2)
      }else{
        setPlayerScore(data.score2)
        setEnemyScore(data.score1)
      }
    }else{
      console.log(data)
      console.log("Koniec gry!!!!")
      setRoundStarted(false)
      setAttackButtonStyle('attack-btn disabled')
      if(localStorage.getItem("counter") >= 30){
        if(data.score1 == 3){
          window.alert("Koniec Gry! Wygrał gracz o nicku: " + data.player1 + "\nGratulacje dla zwyciężcy!")
        }else{
          window.alert("Koniec Gry! Wygrał gracz o nicku: " + data.player2 + "\nGratulacje dla zwyciężcy!")
        }
        window.location.reload();
      }else{
        let temp = Number(localStorage.getItem("counter"))
        localStorage.removeItem("counter");
        localStorage.setItem("counter", temp + 1)
        console.log(localStorage.getItem("counter"))

      }

      // messageCounter++
      // console.log(messageCounter)
    }
  })

    return (
      <>
        <div className="container">
          
          {/* <div className="game-history">
            <h2>Game History</h2>
          </div> */}


          <div className="game-display">
          <div className="rounds-counter">
            <h2>Round number: {roundNumer}</h2>
          </div>
            <div className="moves-picker">
              {possibleMoves.map((move) => {
                return <div className="move">
                  <label htmlFor={move}>
                    <img src={"../../public/moves/"+ move + ".png"} />
                  </label>
                  <span>{move.toUpperCase()}</span> 
                  <input type="radio" name="move" onChange={handleMovePick} id={move} />
                </div>
              })}


            </div>


          </div>

          <div className="game-options">
            <span>
              <h2>{(isFirstPlayer)?playerNick:enemyNick}: {(isFirstPlayer)?playerScore:enemyScore}</h2>
              <hr />
              <h2>{(isFirstPlayer)?enemyNick:playerNick}: {(isFirstPlayer)?enemyScore:playerScore}</h2>
            </span>

            <span>
              <h4>Room: {gameCode}</h4>
              <br />
              <button className={attackButtonStyle} onClick={handleAttack}>Attack</button>
            </span>

            <span className='span-player-move'>
              <h3>Your Pick: {playerMove.toUpperCase()}</h3>
              <h4>{playerMove.toUpperCase}</h4>
              <img src={"../../public/moves/" + playerMove + ".png"} />
            </span>

          </div>

        </div>
      </>
    );
  }

  export default GamePage