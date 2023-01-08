import React, { Component, useEffect, useState } from 'react';
import './App.css';

function App() {
  //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  const shuffleArray = (unshuffled) => {
    let shuffled = unshuffled
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
    return shuffled;
  }

  const [textIsColored, setTextIsColored] = useState(false);
  const [difficulty, setDifficulty] = useState(4);
  const [hexArray, setHexArray] = useState([
    { hexString: 'FF0000', correct: true, touched: false },
    { hexString: '00FF00', correct: false, touched: false },
    { hexString: '0000FF', correct: false, touched: false },
  ]);
  const [shuffledArray, setShuffledArray] = useState(shuffleArray(hexArray))
  const [feedbackText, setFeedbackText] = useState("select the RGB hexcode of the displayed color");
  const feedbackCorrect = ["Nice!", "Correct!", "Great!"]
  const [correctIndex, setCorrectIndex] = useState(0);
  const feedbackIncorrect = ["Not quite...", "Incorrect...", "Wrong..."];
  const [incorrectIndex, setIncorrectIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState('dark');

  //update the shuffle array anytime hex array is updated
  useEffect(() => {
    setShuffledArray(shuffleArray(hexArray));
  }, [hexArray])

  useEffect(() => {
    if (score < 0) {
      setDifficulty(2);
    } else {
      setDifficulty(Math.floor((score + 1) / 5) + 3)
    }
  }, [score])

  //create an array of objects: {hexString, correct bool, touched bool}
  const generateHexes = (num) => {
    const hexes = [];
    for (let n = 0; n < num; n++) {
      let hexObj = {
        hexString: randomHex(),
        correct: n === 0 ? true : false, //0th is always correct answer
        touched: false,
      };
      hexes.push(hexObj);
    }
    console.log('fresh hexes:', hexes)
    return hexes
  }

  const randomHex = () => {
    const hexChar = "0123456789ABCDEF";
    let string = ""
    for (let i = 0; i < 6; i++) {
      string += hexChar.charAt(Math.floor(Math.random() * 16));
    }
    return string;
  }

  const rightGuess = () => {
    console.log('right')
    setHexArray((generateHexes(difficulty)));
    setScore((prevScore) => prevScore + 1);
    setStreak((prevStreak) => prevStreak + 1);
    setFeedbackText(feedbackCorrect[correctIndex % feedbackCorrect.length]);
    setCorrectIndex((prev) => prev + 1);
  }

  const wrongGuess = (hexObj) => {
    //map through current array. If id match, return new touched object.
    //Else, return original object.
    setShuffledArray(shuffledArray.map(hex => {
      if (hex.hexString === hexObj.hexString) {
        // Create a *new* object with changes
        return { ...hex, touched: true };
      } else {
        // No changes -- return original object
        return hex;
      }
    }));
    console.log('touched:', shuffledArray)
    if (hexObj.touched === false) {
      setScore((prevScore) => prevScore - 1);
    }
    setStreak(0);
    setFeedbackText(feedbackIncorrect[incorrectIndex % feedbackIncorrect.length]);
    setIncorrectIndex((prev) => prev + 1);
  }

  const toggleTextColor = () => {
    setTextIsColored(!textIsColored);
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  //???Transition doesn't work when rendered as component, only direct inline rendering works.
  const Title = () => {
    return (
      <>
        <div className='title' >
          <h1>HEX<span className='hex-text' style={HEXSTYLE}>⬣</span></h1><span className='sub-title'>⁄⁄color trainer</span>
        </div>
      </>
    )
  }

  const HEXSTYLE = {
    color: `#${hexArray[0].hexString}`,
    transition: '0.7s color ease-in-out',
  }

  const BOXSTYLE = {
    // position: 'relative',
    backgroundColor: `#${hexArray[0].hexString}`,
    // width: 'auto',
    height: '30%',
    margin: 'auto',
    textAlign: 'center',
    // padding: '0',
    borderRadius: '8px',
    transition: '0.5s background-color ease-in-out',
    display: 'flex',
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
    <>
      <div className={`container ${theme}`}>
        <div className='title' >
          <h1>HEX<span className='hex-text' style={HEXSTYLE}>⬣</span></h1><span className='sub-title'>⁄⁄color trainer</span>
        </div>
        <div className='color-rectangle' style={BOXSTYLE}>
          <div className='directions'>{feedbackText}<br />
            <div className='arrow floating' style={{ display: '' }}>
              <svg fill="#ffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="-51.2 -51.2 614.42 614.42" stroke="#ffffff">
                {/* <g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-51.2" y="-51.2" width="614.42" height="614.42" rx="307.21" fill-opacity='0.25' strokewidth="0"></rect></g> */}
                <g id="SVGRepo_iconCarrier"> <g> <g> <g>
                  <path d="M248.436,295.417c4.16,4.16,10.88,4.16,15.04,0L434.143,124.75c4.053-4.267,3.947-10.987-0.213-15.04 c-4.16-3.947-10.667-3.947-14.827,0L256.009,272.803L92.916,109.71c-4.267-4.053-10.987-3.947-15.04,0.213 c-3.947,4.16-3.947,10.667,0,14.827L248.436,295.417z"></path>
                  {/* <path d="M501.343,383.95H10.996c-5.333,0-10.133,3.84-10.88,9.067c-0.96,6.613,4.16,12.267,10.56,12.267h490.347 c5.333,0,10.133-3.84,10.88-9.067C512.863,389.603,507.743,383.95,501.343,383.95z"></path> */}
                </g> </g> </g> </g></svg>
            </div>
          </div>
        </div>

        <div className='answer-box'>
          {shuffledArray.map((hexObj) =>
            <button className='answer-button'
              key={hexObj.hexString}
              onClick={hexObj.correct ? rightGuess : () => wrongGuess(hexObj)}
              style={hexObj.touched ? { backgroundColor: `#${hexObj.hexString}` } : {}}>#{
                textIsColored ? //add RGB coloring to text
                  <>
                    <span style={{ color: '#EE0000' }}>{hexObj.hexString.slice(0, 2)}</span>
                    <span style={{ color: '#00BB00' }}>{hexObj.hexString.slice(2, 4)}</span>
                    <span style={{ color: '#0000FF' }}>{hexObj.hexString.slice(4, 6)}</span>
                  </>
                  : hexObj.hexString}
            </button>
          )}
        </div>

        <div className='stats'>
          <div className='stats-block' id='score' >Score: {score}</div>
          <div className='stats-block' id='pipe'>\\</div>
          <div className='stats-block' id='streak'>Streak: {streak}</div>
        </div>

        <div className='option'>
          <label class="switch">
            <input type="checkbox" checked={textIsColored} onChange={toggleTextColor} />
            <span class="slider round"></span>
          </label>
          <span className='option-label'>RGB Color Text</span>
        </div>
        <div className='option'>
          <label class="switch">
            <input type="checkbox" onChange={toggleTheme} />
            <span class="slider round"></span>
          </label>
          <span className='option-label'>Light Theme</span>
        </div>
      </div>
    </>
  );
}

export default App;