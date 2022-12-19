import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

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

  const shuffleArray = (unshuffled) => {
    let shuffled = unshuffled
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
    return shuffled;
  }

  // const [difficulty, setDifficulty] = useState(3)
  const [hexArray, setHexArray] = useState(generateHexes(3));
  const [shuffledArray, setShuffledArray] = useState(shuffleArray(hexArray))
  const [answer, setAnswer] = useState(hexArray[0].hexString);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setAnswer(hexArray[0].hexString);
    setShuffledArray(shuffleArray(hexArray));

  }, [hexArray])


  const rightGuess = () => {
    console.log('right')
    setHexArray((generateHexes(3)));
    setAnswer(hexArray[0].hexString);
    setScore((prevScore) => prevScore + 1);
    // setShuffledArray(shuffleArray(hexArray))
    // shuffleArray(hexArray)
  }

  const wrongGuess = () => {
    console.log('wrong')
    setScore((prevScore) => prevScore - 1);
  }

  const BOXSTYLE = {
    position: 'relative',
    backgroundColor: `#${answer}`,
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

        {shuffledArray.map((hex) =>
          <button key={hex.hexString} onClick={hex.correct ? (e) => rightGuess(e) : wrongGuess}>{hex.hexString}</button>
        )}
        <p>{score}</p>
      </div>
    </>
  );
}

export default App;