import { json, Link } from 'react-router-dom';
import "./homepage.css";
import React, {useState} from 'react'

function HomePage({socket, sendStartData}) {

  let [newGame, setNewGame] = useState(true)
  let [newGameDivClass, setNewGameDivClass] = useState("game-start-container new-game-div div-visible-no")
  let [nick, setNick] = useState("You")
  let [enemyNick, setEnemyNick] = useState("Enemy")
  let [gameCode, setGameCode] = useState("01234567")
  let [nickRoomInputsStyle, setNickRoomInputsStyle] = useState("");
  let [pageVisibility, setPageVisibility] = useState("container")
  let [errorMessage, setErrorMessage] = useState("No errors!")
  let [errorBoxStyle, setErrorBoxStyle] = useState("error-box div-visible-no")

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
      if(json.roomCreated=="true") {
        console.log("Pokój został stworzony!")
        setNickRoomInputsStyle("inputs-disabled")
        sendStartData(nick, enemyNick, gameCode, true)
      }else {
        console.log("Z pewnego powodu pokój nie został stworzony!")
        setErrorMessage("Z pewnego powodu pokój nie został stworzony!")
        setErrorBoxStyle("error-box")

      }
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

  const joinGame = () => {
    socket.emit('join', {username: nick, room: gameCode});

    socket.on('full_room', (data) => {
      console.log(data)
      setErrorMessage(data.msg)
      setErrorBoxStyle("error-box")
    })
    socket.on('message', (data) => {
      console.log(data)
      setPageVisibility("div-visible-no")
    })
    
  }
  socket.on('error', (data) => {
    console.log(data)
    setErrorMessage(data.msg)
    setErrorBoxStyle("error-box")
  })
  const joinGameByCode = () => {
    socket.emit('join', {username: nick, room: gameCode});

    socket.on('full_room', (data) => {
      console.log(data)
      setErrorMessage(data.msg)
      setErrorBoxStyle("error-box")
    })

    socket.on('message', (data) => {
      console.log(data)
      setPageVisibility("div-visible-no")
      sendStartData(nick, enemyNick, gameCode, false)
    })
  }

    return (
      <>
        <div className={pageVisibility}>

          <div className="game-start-container">
            <Link to="/" className='homepage-logo'>
              <img src="../../public/logo.jpg"/>
            </Link>
            <div className="game-settings">
              <input type="text" className={nickRoomInputsStyle} placeholder={nick} onChange={handleNickChange} value={nick}/>
              <input type="text" className={nickRoomInputsStyle} id="kod-gry" placeholder='Kod pokoju...' onChange={handleGameCodeChange}/>
              <button className={nickRoomInputsStyle} onClick={createNewGame}>Stwórz Grę</button>
              <button className={nickRoomInputsStyle} onClick={joinGameByCode}>Dołącz do gry</button>
            </div>
            <div className={errorBoxStyle}>
                {errorMessage}
            </div>
          </div>

          <div className={newGameDivClass} >
            <h1>Ustalony kod gry:</h1>
            <h1>{gameCode}</h1>
            <input type="text" onChange={handleNickChange} value={nick} disabled/>
            {/* <input type="text" value={enemyNick} className='secondPlayerNick' disabled/> */}
            <button onClick={joinGame}>Zacznij grę</button>
          </div>

        </div>
      </>
    );
  }

  export default HomePage