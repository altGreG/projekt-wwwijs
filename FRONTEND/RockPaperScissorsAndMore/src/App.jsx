import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './components/pages/homepage'
import GamePage from './components/pages/GamePage'
import NavBar from './components/NavBar'

function App() {

  return (
    <>

    {/* Trzeba naprawić routing */}
      <Router>
        <NavBar />
        <HomePage/>
        <Routes>
          <Route path='/' exact component={HomePage}/>
          <Route path='/game' exact component={GamePage}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
