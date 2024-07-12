import { Link } from 'react-router-dom';
import React, {useState} from 'react'
import "./About.css";

function About({isActive, closeAbout}) {


    let aboutStyle = ""

    if (!isActive) {
        aboutStyle = "game-about div-visible-no"
    } else {
        aboutStyle = "game-about"
    }

    return (
      <>
        <div className={aboutStyle}>
            <span className='close-game-rules' onClick={closeAbout}>Zamknij</span>
            <h2>Projekt "Rock, Paper, Scissors and more..." jest grą tworzoną w ramach zajęć z przedmiotu WWW I Języki Skryptowe prowadzonych na kierunku Teleinformatyka, na wydziale Informatyki, Elektroniki i Telekomunikacji, w Akademii Górniczo-Hutniczej w Krakowie.</h2>
            <h2>
                Członkowie projektu:
                <ul>
                    <li>Dorian Sraga</li>
                    <li>Grzegorz Bąk</li>
                </ul>
            </h2>
            <h2>Rok Akademicki: 2023/2024</h2>
        </div>
      </>
    );
  }

  export default About