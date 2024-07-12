import { Link } from 'react-router-dom';
import "../App.css";

function NavBar({showGameRules, showAbout}) {

    return (
      <>
        <nav className='nav'>
            <h1 className='game-title'> Rock, Paper, Scissors and more...</h1>
            <ul className="nav-list">
                <Link to="/">
                    <li className="nav-list-item">
                        Home
                    </li>
                </Link>
                <Link>
                    <li className="nav-list-item" onClick={showGameRules}>
                        Game Rules
                    </li>
                </Link>
                <Link>
                    <li className="nav-list-item" onClick={showAbout}>
                        About
                    </li>
                </Link>

                    
            </ul>
        </nav>
      </>
    );
  }

  export default NavBar