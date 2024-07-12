import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './components/pages/homepage'
import GamePage from './components/pages/GamePage'
import NavBar from './components/NavBar'
import GameRules from './components/GameRules';
import About from './components/About';
import { useState } from 'react';

function App() {

  let [isGameRulesActive, setIsGameRulesActive] = useState(false)
  let [isAboutActive, setIsAboutActive] = useState(false)

  const handleCloseGameRules = () => {
    console.log(isGameRulesActive)
    setIsGameRulesActive(!isGameRulesActive)
  }

  const handleCloseAbout = () => {
    console.log(isAboutActive)
    setIsAboutActive(!isAboutActive)
  }

  return (
    <>

    {/* Trzeba naprawić routing */}
      <Router>
        <NavBar showGameRules={handleCloseGameRules} showAbout={handleCloseAbout}/>
        <GameRules isActive={isGameRulesActive} closeGameRules={handleCloseGameRules}/>
        <About isActive={isAboutActive} closeAbout={handleCloseAbout}/>
        {/* <HomePage/> */}
        <GamePage />
        <Routes>
          <Route path='/' exact component={HomePage}/>
          <Route path='/game' exact component={GamePage}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
