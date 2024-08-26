import { json, Link } from 'react-router-dom';
import "./homepage.css";
import React, {useState} from 'react'

function HomePage({socket}) {

  let [newGame, setNewGame] = useState(false)
  let [newGameDivClass, setNewGameDivClass] = useState("game-start-container new-game-div div-visible-no")
  let [nick, setNick] = useState("Twój nick...")
  let [enemyNick, setEnemyNick] = useState("Nick drugiego gracza")

  let [gameCode, setGameCode] = useState("01234567");

  const createNewGame = () => {
    // tutaj robimy zapytanie do api

    // otrzymujemy kod i dajemy do zmiennej gameCode

    // zmieniamy status newGame na true, pojawia się okno new-game-div

    const httpBody = {
      username: {nick},
      room: 'tymczasowe'
    }

    fetch("http://127.0.0.1:5000/room",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',

      },
      body: JSON.stringify(httpBody)}
    ).then((response) => 
      response.json()
    ).then((json) => console.log(json)
    ).catch(error => console.error(error))

    console.log(newGame)
    
    setNewGame(!newGame)
    if (newGame) {
      setNewGameDivClass("game-start-container new-game-div div-visible-flex");
    }else {
      setNewGameDivClass("game-start-container new-game-div div-visible-no");
    }
  }

  const handleNickChange = (event) => {
      setNick(event.target.value)
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
              <button onClick={createNewGame}>Stwórz Grę</button>
              <input type="text" id="kod-gry" placeholder='Kod pokoju...'/>
              <button>Dołącz do gry</button>
            </div>
          </div>

          <div className={newGameDivClass} >
            <h1>Przydzielony kod gry:</h1>
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