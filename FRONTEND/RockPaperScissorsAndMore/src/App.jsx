import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import socketIO from 'socket.io-client';

import HomePage from './components/pages/homepage'
import GamePage from './components/pages/GamePage'
import NavBar from './components/NavBar'
import GameRules from './components/GameRules';
import About from './components/About';
import { useState } from 'react';

const socket = socketIO.io('http://localhost:9000')
socket.on('connect', (data) => {
  console.log("Successfully connected with server!")
  socket.emit('connection_info', {data: 'I\'m connected!'});
})

function App() {

  let [isGameRulesActive, setIsGameRulesActive] = useState(false)
  let [isAboutActive, setIsAboutActive] = useState(false)

  let [nick, setNick] = useState("You")
  let [enemyNick, setEnemyNick] = useState("Enemy")
  let [gameCode, setGameCode] = useState("01234567")

  const handleCloseGameRules = () => {
    console.log(isGameRulesActive)
    setIsGameRulesActive(!isGameRulesActive)
  }

  const handleCloseAbout = () => {
    console.log(isAboutActive)
    setIsAboutActive(!isAboutActive)
  }

  const handleSendingStartDataToGamePage = (n, en, gc) => {
    setNick(n)
    setEnemyNick(en)
    setGameCode(gc)
  }

  // const socket = new WebSocket("ws://localhost:8080")

  // // connection opened
  // socket.addEventListener("open", event => {
  //   socket.send("Connection established")
  // })

  // // listen for messages
  // socket.addEventListener("message", event => {
  //   console.log("Message from server ", event.data)
  // })

  return (
    <>

    {/* Trzeba naprawić routing */}
      <Router>
        <NavBar showGameRules={handleCloseGameRules} showAbout={handleCloseAbout}/>
        <GameRules isActive={isGameRulesActive} closeGameRules={handleCloseGameRules}/>
        <About isActive={isAboutActive} closeAbout={handleCloseAbout}/>
        <HomePage socket={socket} sendStartData={handleSendingStartDataToGamePage}/>
        <GamePage socket={socket} pNick={nick} eNick={enemyNick} gCode={gameCode}/>
        <Routes>
          <Route path='/' exact component={HomePage}/>
          <Route path='/game' exact component={GamePage}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
