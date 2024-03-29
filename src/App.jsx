import React, { useEffect, useState } from 'react';
import './App.css';
import findBiggerBWContrast from './findBiggerBWContrast';
import generateHexes from './generateHexes';
import ColorRectangle from './ColorRectangle';
import Footer from './Footer';
import Option from './Option';
import Stats from './Stats';
import Title from './Title';

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
  const [feedbackTextColor, setFeedbackTextColor] = useState("#FFFFFF")
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState('dark');

  //update the shuffle array/scramble displayed options anytime hex array is updated
  useEffect(() => {
    if (correctIndex > 0) { //keep the initial text white
      setFeedbackTextColor(findBiggerBWContrast(`#${hexArray[0].hexString}`))
    }
    setShuffledArray(shuffleArray(hexArray));
  }, [hexArray, correctIndex])

  //set the number of color options each round
  useEffect(() => {
    if (score < 0) {
      setDifficulty(2);
    } else {
      setDifficulty(Math.floor((score + 1) / 5) + 3);
    }
  }, [score])

  //when answer is submitted, momentarily hide (remove the fade class), then add the fade class to restart the animation
  useEffect(() => {
    setHideFeedback(true);
    setTimeout(() => {
      setHideFeedback(false);
    }, 10);
  }, [correctIndex, incorrectIndex])

  const handleRightGuess = () => {
    setHexArray((generateHexes(difficulty)));
    setScore((prevScore) => prevScore + 1);
    setStreak((prevStreak) => prevStreak + 1);
    setFeedbackText(feedbackCorrect[correctIndex % feedbackCorrect.length]);
    setCorrectIndex((prev) => prev + 1);
  }

  const handleWrongGuess = (hexObj) => {
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

  return (
    <div className={`container ${theme}`}>
      <Title hexArray={hexArray} />
      <ColorRectangle
        hexString={hexArray[0].hexString}
        feedbackText={feedbackText}
        correctIndex={correctIndex}
        hideFeedback={hideFeedback}
        feedbackTextColor={feedbackTextColor}
      />

      <div className='answer-box'>
        {shuffledArray.map((hexObj) => {
          const { hexString, correct, touched } = hexObj;
          const handleClick = correct ? handleRightGuess : () => handleWrongGuess(hexObj);
          const color = touched ? `#${hexString}` : ''; //wrong guesses should reveal their color once touched
          const hashOrHex = touched ? <svg fill="currentColor" viewBox="0 0 184.751 184.751" style={{ height: "17px", width: '17px' }} >
            <path d="M0,92.375l46.188-80h92.378l46.185,80l-46.185,80H46.188L0,92.375z" />
          </svg> : '#'

          return (
            <button
              className='answer-button'
              key={hexString}
              onClick={handleClick}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ display: 'inline-grid', gridTemplateColumns: '6fr 6fr 5.25fr ' }}>
                  <span id='hashtag' aria-hidden='true' style={{ color, justifySelf: 'end', display: 'flex', alignItems: 'center' }}>
                    {hashOrHex}
                  </span>
                  <span id='hextext' style={{ justifySelf: 'start' }}>
                    {textIsColored ? (
                      <>
                        <span style={{ color: '#EE0000' }}>{hexString.slice(0, 2)}</span>
                        <span style={{ color: '#00BB00' }}>{hexString.slice(2, 4)}</span>
                        <span style={{ color: '#0000FF' }}>{hexString.slice(4, 6)}</span>
                      </>
                    ) : (
                      hexString
                    )}
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <Stats score={score} streak={streak} />
      <Option label='RGB Color Text' checked={textIsColored} onChange={toggleTextColor} />
      <Option label='Light Theme' checked={theme === 'light'} onChange={toggleTheme} />
      <div className='spacer'></div>
      <Footer />
    </div>
  );
}

export default App;