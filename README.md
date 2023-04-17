# Hex Color Game

## Live Demo:
https://tylersernett.github.io/hexcolorgame

## Things Learned:
#### Flex: how to 'pan' two items hard left and hard right:

Give right-bound item an id, and use css tag 'margin-left: auto;':

```css
#streak {
  margin-left: auto;
}
```

#### Updating an array in React.

First, make a copy, then update the copy. Finally, set state to the copy:
```javascript
  const wrongGuess = (hexObj) => {
    let index = shuffledArray.indexOf(hexObj);
    let tempArr = [...shuffledArray]
    tempArr[index].touched = true;
    setShuffledArray(tempArr)
  }
```

reference: https://beta.reactjs.org/learn/updating-arrays-in-state#making-other-changes-to-an-array

Note that above, you are modifiying the ORIGINAL object! So if multiple arrays contain this object, they will be modified as well. This can lead to bugs, so best practice is map through the array, and to substitute a new object for the old one:
```javascript
const wrongGuess = (hexObj) => {
    setShuffledArray(shuffledArray.map(hex => {
      if (hex.hexString === hexObj.hexString) {
        // Create a *new* object with changes
        return { ...hex, touched: true };
      } else {
        // No changes -- return original object
        return hex;
      }
    }));
}

setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Create a *new* object with changes
    return { ...artwork, seen: nextSeen };
  } else {
    // No changes
    return artwork;
  }
}));
```

#### Text-fade retrigger
```javascript
//when answer is submitted, momentarily hide (remove the fade class), then add the fade class to restart the animation
useEffect(() => {
  setHideFeedback(true);
  setTimeout(() => {
    setHideFeedback(false);
  }, 10);
}, [correctIndex, incorrectIndex])

...
<div className={(correctIndex === 0 || hideFeedback) ? 'directions' : 'directions fading'}>
  {feedbackText}<br />
</div>
```

#### Improved algo

Problem: old algorithm was just random -- you could get a two color options very close to one another in the answers (or even two exact copies of the same color).

```javascript
  const randomHex = () => {
    const hexChar = "0123456789ABCDEF";
    let string = ""
    for (let i = 0; i < 6; i++) {
      string += hexChar.charAt(Math.floor(Math.random() * 16));
    }
    return string;
  }
  ```

Solution: new algorithm splits the possible of ranges of hue, saturation, and value. That is, assigned 3 colors, the algorithm produces values that are 360/3 = 120 degrees apart in terms of saturation, and 1/3 = 33.3% apart in terms of saturation and value.

```javascript
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

```