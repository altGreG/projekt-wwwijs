import { json, Link } from 'react-router-dom';
import "./homepage.css";
import React, {useState} from 'react'

function HomePage({socket}) {

  let [newGame, setNewGame] = useState(true)
  let [newGameDivClass, setNewGameDivClass] = useState("game-start-container new-game-div div-visible-no")
  let [nick, setNick] = useState("You")
  let [enemyNick, setEnemyNick] = useState("Enemy")

  let [gameCode, setGameCode] = useState("01234567");

  const createNewGame = () => {
    // tutaj robimy zapytanie do api

    // otrzymujemy kod i dajemy do zmiennej gameCode

    // zmieniamy status newGame na true, pojawia się okno new-game-div

    setNewGame(!newGame)
    if (newGame) {
      setNewGameDivClass("game-start-container new-game-div div-visible-flex");
    }else {
      setNewGameDivClass("game-start-container new-game-div div-visible-no");
    }




    const httpBody = {
      username: nick,
      room: gameCode
    }

    fetch("http://127.0.0.1:9000/room",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',

      },
      body: JSON.stringify(httpBody)}
    ).then((response) => 
      response.json()
    ).then((json) => {
      console.log(json)
      // if json[]
    }
    ).catch(error => console.error(error))

    console.log(newGame)
    

  }

  const handleNickChange = (event) => {
      setNick(event.target.value)
  }

  const handleGameCodeChange = (event) => {
    setGameCode(event.target.value)
}

    return (
      <>
        <div className="container">

          <div className="game-start-container">
            <Link to="/" className='homepage-logo'>
              <img src="../../public/logo.jpg"/>
            </Link>
            <div className="game-settings">
              <input type="text" placeholder={nick} onChange={handleNickChange} value={nick}/>
              <input type="text" id="kod-gry" placeholder='Kod pokoju...' onChange={handleGameCodeChange}/>
              <button onClick={createNewGame}>Stwórz Grę</button>
              <button>Dołącz do gry</button>
            </div>
          </div>

          <div className={newGameDivClass} >
            <h1>Ustalony kod gry:</h1>
            <h1>{gameCode}</h1>
            <input type="text" onChange={handleNickChange} value={nick} disabled/>
            <input type="text" value={enemyNick} className='secondPlayerNick' disabled/>
            <button>Zacznij grę</button>
          </div>

        </div>
      </>
    );
  }

  export default HomePage