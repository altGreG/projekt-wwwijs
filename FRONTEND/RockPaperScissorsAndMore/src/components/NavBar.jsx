import { Link } from 'react-router-dom';
import "../App.css";

function NavBar({showGameRules, showAbout}) {

    return (
      <>
        <nav className='nav'>
            <h1 className='game-title'> Rock, Paper, Scissors and more...</h1>
            <ul className="nav-list">
                <Link>
                    <li className="nav-list-item" onClick={showGameRules}>
                        Zasady gry
                    </li>
                </Link>
                <Link>
                    <li className="nav-list-item" onClick={showAbout}>
                        O nas
                    </li>
                </Link> 
            </ul>
        </nav>
      </>
    );
  }

  export default NavBar