import { Link } from 'react-router-dom';
import "../App.css";

function NavBar() {

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
                <Link to="/credits">
                    <li className="nav-list-item">
                        Credits
                    </li>
                </Link>
                <Link to="/game-rules">
                    <li className="nav-list-item">
                        Game Rules
                    </li>
                </Link>
            </ul>
        </nav>
      </>
    );
  }

  export default NavBar