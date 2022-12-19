import React, { useState } from 'react';
import './App.css';



function App() {
  const generateHex = () => {
    const hexChar = "0123456789ABCDEF";
    let hexString = "";
    for (let i = 0; i < 6; i++) {
      hexString += hexChar.charAt(Math.floor(Math.random() * 16));
    }

    return hexString
  }
  
  const [hexArray, setHexArray] = useState([generateHex(), generateHex(), generateHex()]);


  const BOXSTYLE = {
    position: 'relative',
    backgroundColor: `#${hexArray[0]}`,
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
          <button key={hex} onClick={() => setHexArray([generateHex(), generateHex(), generateHex()])}>{hex}</button>
        )}
      </div>
    </>
  );
}

export default App;