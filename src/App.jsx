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
  const [hideFeedback, setHideFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState('dark');

  //update the shuffle array/scramble displayed options anytime hex array is updated
  useEffect(() => {
    setShuffledArray(shuffleArray(hexArray));
  }, [hexArray])

  useEffect(() => {
    if (score < 0) {
      setDifficulty(2);
    } else {
      setDifficulty(Math.floor((score + 1) / 5) + 3); //the number of color options each round
    }
  }, [score])

  //create an array of objects: {hexString, correct bool, touched bool}
  const generateHexes = (num) => {
    const hexes = [];
    const hexStrings = generateColors(num);
    for (let n = 0; n < num; n++) {
      let hexObj = {
        hexString: hexStrings[n],
        correct: n === 0 ? true : false, //0th is always correct answer before it's shuffled
        touched: false,
      };
      hexes.push(hexObj);
    }
    console.log('fresh hexes:', hexes)
    return hexes
  }

  function generateColors(numColors) {
    const interval = 360 / numColors;
    let hue = Math.random() * 360;
    const colors = [];
    const startingSat = Math.random();
    const startingVal = Math.random();
    for (let i = 0; i < numColors; i++) {
      hue = (hue + interval) % 360;
      let sat = (startingSat + (i / numColors)) % 1
      let val = (startingVal + (i / numColors)) % 1
      console.log('hue', hue)
      const rgb = hsvToRgb(hue / 360, sat, val);
      const hexColor = rgbToHex(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
      colors.push(hexColor);
    }
    return colors;
  }

  //https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
  function hsvToRgb(h, s, v) {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v; g = t; b = p; break;
      case 1:
        r = q; g = v; b = p; break;
      case 2:
        r = p; g = v; b = t; break;
      case 3:
        r = p; g = q; b = v; break;
      case 4:
        r = t; g = p; b = v; break;
      case 5:
        r = v; g = p; b = q; break;
      default:
    }
    return [r, g, b];
  }

  function rgbToHex(r, g, b) {
    return componentToHex(Math.round(r)) + componentToHex(Math.round(g)) + componentToHex(Math.round(b));
  }

  function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  //when answer is submitted, momentarily hide (remove the fade class), then add the fade class to restart the animation
  useEffect(() => {
    setHideFeedback(true);
    setTimeout(() => {
      setHideFeedback(false);
    }, 10);
  }, [correctIndex, incorrectIndex])

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
    // color: correctIndex > 0 ? `#${hexArray[0].hexString}` : '',
    transition: '0.7s color ease-in-out',
  }

  const BOXSTYLE = {
    // position: 'relative',
    backgroundColor: `#${hexArray[0].hexString}`,
    // width: 'auto',
    height: '30%',
    // margin: 'auto',
    textAlign: 'center',
    // padding: '0',
    borderRadius: '8px',
    transition: '0.5s background-color ease-in-out',
    display: 'flex',
    // flexDirection: 'column',
    // flex: "1 1 auto",
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
      <div className={`container ${theme}`}>
        <div className='title' >
          {/* <h1>HEX<span className='hex-text' style={HEXSTYLE}>⬣</span></h1><span className='sub-title'>⁄⁄color trainer</span> */}
          <h1 style={{ display: 'flex', alignItems: 'center' }}>
            HEX<span className='hex-text' style={HEXSTYLE}>
              <svg
                fill="currentColor"
                // fill={hexArray[0].hexString}
                height="9.75vw"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 184.751 184.751"
                style={{ margin: 'auto' }} // Add this line to center the SVG vertically
              >
                <path d="M0,92.375l46.188-80h92.378l46.185,80l-46.185,80H46.188L0,92.375z" />
              </svg>
            </span>
          </h1>
          <span className='sub-title'>⁄⁄color trainer</span>


        </div>
        <div className='color-rectangle' style={BOXSTYLE}>
          <div className={(correctIndex === 0 || hideFeedback) ? 'directions' : 'directions fading'}>{feedbackText}<br />
            {/* remove arrow after first correct answer */}
            <div className='arrow floating' style={{ visibility: correctIndex > 0 ? 'hidden' : '' }}>
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
              style={hexObj.touched ? { backgroundColor: `#${hexObj.hexString}` } : {}}><span className='hashtag' aria-hidden='true'>#</span>{
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
          <div className='stats-block' id='pipe'>⁄⁄</div>
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

        <div className='spacer'></div>

        <footer className='footer'>
          ©<a href="https://github.com/tylersernett/">Tyler Sernett</a>
        </footer>
      </div>
  );
}

export default App;