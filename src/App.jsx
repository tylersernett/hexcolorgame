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
    { hexString: 'FF0000', correct: true },
    { hexString: '00FF00', correct: false },
    { hexString: '0000FF', correct: false },
  ]);
  const [shuffledArray, setShuffledArray] = useState(shuffleArray(hexArray))
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  //update the shuffle array anytime hex array is updated
  useEffect(() => {
    setShuffledArray(shuffleArray(hexArray));
  }, [hexArray])

  useEffect(() => {
    if (score < 0) {
      setDifficulty(2);
    } else {
      setDifficulty(Math.floor(score / 5) + 3)
    }
  }, [score])

  const generateHexes = (num) => {
    const hexes = [];
    for (let n = 0; n < num; n++) {
      let hexObj = {
        hexString: randomHex(),
        correct: n === 0 ? true : false,
      };
      hexes.push(hexObj);
    }
    console.log(hexes)
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

  const wrongGuess = () => {
    console.log('wrong')
    setScore((prevScore) => prevScore - 1);
    setStreak(0);
  }

  const toggleTextColor = () => {
    setTextIsColored(!textIsColored);
  }

  const Title = () => {
    return (
      <>
        <div className='title'>
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
  //TODO: wrong answers reveal color on button

  return (
    <>
      <div className='container'>
        <div className='title' >
          <h1>HEX<span className='hex-text' style={HEXSTYLE}>⬣</span></h1><span className='sub-title'>⁄⁄color trainer</span>
        </div>
        <div className='color-rectangle' style={BOXSTYLE}>
        </div>

        <div className='answer-box'>
          {shuffledArray.map((hex) =>
            <button className='answer-button' key={hex.hexString} onClick={hex.correct ? rightGuess : wrongGuess}>#{
              textIsColored ?
                <>
                  <span style={{ color: 'red' }}>{hex.hexString.slice(0, 2)}</span>
                  <span style={{ color: 'green' }}>{hex.hexString.slice(2, 4)}</span>
                  <span style={{ color: 'blue' }}>{hex.hexString.slice(4, 6)}</span>
                </>
                : hex.hexString}
            </button>
          )}
        </div>
        <div className='stats'>
          <div className='stats-block' id='score' >Score: {score}</div>
          <div className='stats-block' id='pipe'>\\</div>
          <div className='stats-block' id='streak'>Streak: {streak}</div>
        </div>
        <div className='check-block' ><input type='checkbox' checked={textIsColored} onChange={toggleTextColor} />Color Text</div>
      </div>
    </>
  );
}

export default App;