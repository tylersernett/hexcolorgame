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
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState('light');

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
    setScore((prevScore) => prevScore - 1);
    setStreak(0);
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
    position: 'relative',
    backgroundColor: `#${hexArray[0].hexString}`,
    width: 'auto',
    height: '30%',
    margin: 'auto',
    textAlign: 'center',
    padding: '0',
    borderRadius: '8px',
    transition: '0.5s background-color ease-in-out',
  }

  //TODO: dark mode
  //TODO: colored text shows degree of color

  return (
    <>
      <div className={`container ${theme}`}>
        <div className='title' >
          <h1>HEX<span className='hex-text' style={HEXSTYLE}>⬣</span></h1><span className='sub-title'>⁄⁄color trainer</span>
        </div>
        <div className='color-rectangle' style={BOXSTYLE}>
        </div>

        <div className='answer-box'>
          {shuffledArray.map((hexObj) =>
            <button className='answer-button'
              key={hexObj.hexString}
              onClick={hexObj.correct ? rightGuess : () => wrongGuess(hexObj)}
              style={hexObj.touched ? { backgroundColor: `#${hexObj.hexString}` } : {}}>#{
                textIsColored ?
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
        <div className='check-block' ><input type='checkbox' checked={textIsColored} onChange={toggleTextColor} />Color Text</div>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>
    </>
  );
}

export default App;