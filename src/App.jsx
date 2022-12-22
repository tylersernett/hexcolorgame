import React, { useEffect, useState } from 'react';
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

  const [difficulty, setDifficulty] = useState(4)
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
    if (score >= 10) {
      setDifficulty(5);
    } else if (score >= 5) {
      setDifficulty(4);
    } else if (score >= 0) {
      setDifficulty(3);
    } else {
      setDifficulty(2);
    };
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

  const BOXSTYLE = {
    position: 'relative',
    backgroundColor: `#${hexArray[0].hexString}`,
    width: '20%',
    height: '40%',
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
          <button key={hex.hexString} onClick={hex.correct ? rightGuess : wrongGuess}>{hex.hexString}</button>
        )}
        <p>Score: {score}</p>
        <p>Streak: {streak}</p>
      </div>
    </>
  );
}

export default App;