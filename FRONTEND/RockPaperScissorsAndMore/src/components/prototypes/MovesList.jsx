import { Link } from 'react-router-dom';
import React, {useState} from 'react'
import "./pages/GamePage.css";

function MovesList(possibleMoves, playerMove, handleMovePick) {

  // let possibleMoves = props.possibleMoves
  // let playerMove = props.playerMove


    return (
      <>
        <div className="move">
            <label htmlFor="fire">
              <img src="../../public/moves/fire.png" />
            </label>
            <span>Fire</span> 
            <input type="radio" name="move" onChange={handleMovePick} id="fire" />
        </div>

        <div className="move">
                  <label htmlFor="water">
                    <img src="../../public/moves/water.png" />
                  </label>
                  <span>Water</span> 
                  <input type="radio" name="move" onChange={handleMovePick} id="water" />
        </div>
      </>
    );
  }

  // MovesList.propTypes = {
  //   possibleMoves: PropTypes.string,
  //   playerMove: PropTypes.string

  //   }

  export default MovesList