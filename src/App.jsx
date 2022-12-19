import React, { useState } from 'react';
import './App.css';

function App() {
  const generateHexes = (num) => {
    const hexChar = "0123456789ABCDEF";

    const hexes = [];
    for (let n = 0; n < num; n++) {
      let hexObj = {
        hexString: "",
        correct: n === 0 ? true : false,
      };
      for (let i = 0; i < 6; i++) {
        hexObj.hexString += hexChar.charAt(Math.floor(Math.random() * 16));
      }
      hexes.push(hexObj);

    }
    console.log(hexes)
    return hexes
  }

  const rightGuess = () => {
    setHexArray(generateHexes(3));
    setScore((prevScore) => prevScore + 1);
  }

  const [hexArray, setHexArray] = useState(generateHexes(3));
  const [score, setScore] = useState(0);

  const BOXSTYLE = {
    position: 'relative',
    backgroundColor: `#${hexArray[0].hexString}`,
    width: '8rem',
    height: '6rem',
    margin: 'auto',
    textAlign: 'center',
    marginTop: '2rem',
    padding: '2rem'
  }

  return (
    <>
      <div className='container'>
        <div className='colorBox' style={BOXSTYLE}>
        </div>

        {hexArray.map((hex) =>
          <button key={hex.hexString} onClick={hex.correct? rightGuess : ''}>{hex.hexString}</button>
        )}
        <p>{score}</p>
      </div>
    </>
  );
}

export default App;