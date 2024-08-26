import { Link } from 'react-router-dom';
import React, {useState} from 'react'
import "./GamePage.css";

function GamePage({socket, pNick, eNick, gCode}) {

  // let [playerNick, setPlayerNick] = useState(pNick)
  let [playerScore, setPlayerScore] = useState("0")
  // let [enemyNick, setEnemyNick] = useState(eNick)
  let [enemyScore, setEnemyScore] = useState("0")
  // let [gameCode, setGameCode] = useState(gCode)

  let playerNick = pNick;
  let enemyNick = eNick;
  let gameCode = gCode;

  let [playerMove, setPlayerMove] = useState("nothing")

  let [possibleMoves, setPossibleMoves] = useState(["fire", "scissors", "snake", "human", "tree", "wolf", "sponge", "paper", "air", "water", "dragon", "devil", "lightning", "gun", "rock"])

  let [attackButtonStyle, setAttackButtonStyle] = useState("attack-btn disabled")


  const handleMovePick = (event) => {
    if (event.target.name != playerMove){
      setPlayerMove(event.target.id)
    }
  }

  const handleAttack= () => {
    socket.emit('on_play', {username: playerNick, room: gameCode, playerMove: playerMove})
  }

  socket.on('secondPlayer', (data) =>{
    console.log("Enemy nick: " + data)
    setAttackButtonStyle("attack-btn")
  })

    return (
      <>
        <div className="container">
          
          {/* <div className="game-history">
            <h2>Game History</h2>
          </div> */}


          <div className="game-display">
          <div className="rounds-counter">
            <h2>Jak Grać?</h2>
            <h2>Runda 1 z 20</h2>
            <h2>Historia Gry</h2>
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
              <h2>{playerNick}: {playerScore}</h2>
              <h2>vs</h2>
              <h2>{enemyNick}: {enemyScore}</h2>
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