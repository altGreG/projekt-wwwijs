import { Link } from 'react-router-dom';
import React, {useState} from 'react'
import "./GameRules.css";

function GameRules({isActive, closeGameRules}) {

    let gameRulesStyle = ""

    if (!isActive) {
      gameRulesStyle = "game game-rules-div div-visible-no"
    } else {
      gameRulesStyle = "game game-rules-div"
    }

    return (
      <>
        <div className={gameRulesStyle}>
          <span className='close-game-rules' onClick={closeGameRules}>Zamknij</span>
          <div className="game-rules-page">
          <h1>Zasady gry</h1>
          <ol className='game-rules-list'>
            <li>Gra składa się z kolejnych tur. W każdej turze obydwaj gracze, na umówiony sygnał, szybko wystawiają przed siebie dłoń, pokazującą symbol papieru, kamienia lub nożyc. Gracz, który pokazał silniejszy symbol, otrzymuje jeden punkt. W przypadku pokazania dwóch takich samych symboli następuje remis – punktu brak. Oto hierarchia symboli:</li>
            <li>nożyce są silniejsze od papieru, ponieważ go tną,</li>
            <li>kamień jest silniejszy od nożyc, ponieważ je tępi lub łamie,</li>
            <li>papier jest silniejszy od kamienia, ponieważ go owija.</li>
            <li>Gracz, który pierwszy uzyska umówioną wcześniej liczbę punktów, wygrywa partię.</li>
          </ol>  
          </div>
          <div className="game-rules-page">
            <img src="../public/moves.jpg" />
          </div>
        </div>
      </>
    );
  }

  export default GameRules