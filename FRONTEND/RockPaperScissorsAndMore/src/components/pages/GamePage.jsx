import { Link } from 'react-router-dom';
import React, {useState} from 'react'
import "./GamePage.css";

function GamePage({socket, pNick, eNick, gCode, fPlayer}) {

  let [playerScore, setPlayerScore] = useState("0")
  let [enemyNick, setEnemyNick] = useState("Enemy")
  let [enemyScore, setEnemyScore] = useState("0")

  let [roundStarted, setRoundStarted] = useState(false)
  let [roundNumer, setRoundNumber] = useState(1)
  let [gameEnded, setGameEnded] = useState(false)

  let playerNick = pNick;
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

    if(data.player1 == playerNick){
      setPlayerScore(data.score1)
      setEnemyScore(data.score2)
    }else{
      setPlayerScore(data.score2)
      setEnemyScore(data.score1)
    }

    if(!data.game_over){
      if(playerMove != "nothing"){
        setAttackButtonStyle('attack-btn')
      }else(
        setAttackButtonStyle('attack-btn disabled')
      )

      console.log(data)
    }else{
      if(localStorage.getItem("gameEnded") == "0"){
        localStorage.removeItem("gameEnded")
        localStorage.setItem("gameEnded", "1")
        console.log("Koniec gry!!!!")
        setGameEnded(true)

        console.log(data)

        setRoundStarted(false)
        setAttackButtonStyle('attack-btn disabled')
        if(data.score1 == 3){
          window.alert("Koniec Gry! Wygrał gracz o nicku: " + data.player1 + "\nGratulacje dla zwyciężcy!")
        }else{
          window.alert("Koniec Gry! Wygrał gracz o nicku: " + data.player2 + "\nGratulacje dla zwyciężcy!")
        }
        window.location.reload();
      }
    }
  })

    return (
      <>
        <div className="container">
          <div className="game-display">
          <div className="rounds-counter">
            <h2>Numer rundy: {roundNumer}</h2>
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
              <h4>Kod pokoju: {gameCode}</h4>
              <br />
              <button className={attackButtonStyle} onClick={handleAttack}>Atak</button>
            </span>
            <span className='span-player-move'>
              <h3>Twój wybór: {playerMove.toUpperCase()}</h3>
              <h4>{playerMove.toUpperCase}</h4>
              <img src={"../../public/moves/" + playerMove + ".png"} />
            </span>
          </div>
        </div>
      </>
    );
  }

  export default GamePage