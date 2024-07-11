import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './components/pages/homepage'
import GamePage from './components/pages/GamePage'
import NavBar from './components/NavBar'
import GameRules from './components/GameRules';
import { useState } from 'react';

function App() {

  let [isGameRulesActive, setIsGameRulesActive] = useState(false)

  const handleCloseGameRules = () => {
    console.log(isGameRulesActive)
    setIsGameRulesActive(!isGameRulesActive)
  }

  return (
    <>

    {/* Trzeba naprawić routing */}
      <Router>
        <NavBar showGameRules={handleCloseGameRules}/>
        <GameRules isActive={isGameRulesActive}/>
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
