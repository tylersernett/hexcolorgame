# Hex Color Game
A hexadecimal training game where users guess the hexcode of the displayed color.
## Live Demo:
https://tylersernett.github.io/hexcolorgame

## Notes:
#### Flex: how to 'pan' two items hard left and hard right:

Give right-bound item an id, and use css tag 'margin-left: auto;':

```css
#streak {
  margin-left: auto;
}
```

## Updating an array in React.

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

## Retriggering Text Fade
Problem: Get text to re-appear after fading
Solution: remove fade class, then re-add
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

---
## Improved Hex Generation Algo

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
Documentation for the `generateHexes` Function
----------------------------------------------

The `generateHexes` function is a utility function that generates an array of objects representing hexadecimal colors. Each object in the array contains the following properties:

*   `hexString`: The hexadecimal representation of the color.
*   `correct`: A boolean value indicating whether the color is the correct answer (always true for the first color).
*   `touched`: A boolean value indicating whether the color has been selected or interacted with (initially false for all colors).

### Usage

`import generateHexes from './generateHexes';  const numberOfColors = 5; const hexes = generateHexes(numberOfColors); console.log(hexes);`

### Parameters

*   `num` (number): The number of colors to generate.

### Return Value

The function returns an array of objects representing hexadecimal colors.

### Implementation Details

1.  The function first generates an array of color strings using the `generateColors` helper function.
2.  It then creates an object for each color in the array, setting the `hexString`, `correct`, and `touched` properties.
3.  The objects are pushed into an array.
4.  Finally, the array of color objects is returned.

### `generateColors` Helper Function

The `generateColors` function is a helper function used by `generateHexes` to generate an array of colors. It ensures that the colors are spread throughout the color wheel in terms of hue, saturation, and value.

### `hsvToRgb` Helper Function

The `hsvToRgb` function converts an HSV (Hue, Saturation, Value) color representation to an RGB (Red, Green, Blue) color representation. It is used by the `generateColors` function to convert the generated HSV values to RGB values.

### `rgbToHex` and `componentToHex` Helper Functions
The `rgbToHex` function converts RGB color values to a hexadecimal color string. It is used by the `generateColors` function to convert the generated RGB values to hexadecimal color strings. The `componentToHex` function is a helper function used by `rgbToHex` to convert individual color components (Red, Green, Blue) to their hexadecimal representation.

---

## Improved Contrast
Problem: when a lighter color is randomly selected for the background, it's difficult to read the white text upon it.

Solution: create a function that compares the randomly selected brackground color to black and white. Then, choose black or white for the text color based upon which has a greater contrast with the random brackground color.

```js
//////////CHOOSE BLACK OR WHITE FOR FOREGROUND TEXT COLOR\\\\\\\\
export default function findBiggerBWContrast(hexColor) {
    const blackContrast = getContrastRatio(hexColor, '#000000');
    const whiteContrast = getContrastRatio(hexColor, '#FFFFFF');
    if (blackContrast > whiteContrast) {
        return '#000000'
    } else {
        return '#FFFFFF'
    }

    function getContrastRatio(color1, color2) {
        const luminance1 = getRelativeLuminance(color1);
        const luminance2 = getRelativeLuminance(color2);
        const contrastRatio = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
        return contrastRatio;
    }

    function getRelativeLuminance(hexColor) {
        // Convert hexadecimal color to RGB values
        const r = parseInt(hexColor.slice(1, 3), 16) / 255;
        const g = parseInt(hexColor.slice(3, 5), 16) / 255;
        const b = parseInt(hexColor.slice(5, 7), 16) / 255;
        // Apply the relative luminance formula
        const luminance = 0.2126 * getSRGBComponent(r) + 0.7152 * getSRGBComponent(g) + 0.0722 * getSRGBComponent(b);
        return luminance;
    }

    function getSRGBComponent(component) {
        if (component <= 0.03928) {
            return component / 12.92;
        } else {
            return Math.pow((component + 0.055) / 1.055, 2.4);
        }
    }
}
```

## Documentation: findBiggerBWContrast

The `findBiggerBWContrast` function is used to determine whether black or white is a better foreground text color for a given background color. It calculates the contrast ratio between the background color and black as well as white, and returns the color that provides the higher contrast ratio.

### Parameters

- `hexColor` (string): The hexadecimal representation of the background color. It should be in the format `#RRGGBB`, where RR, GG, and BB are two-digit hexadecimal values representing the red, green, and blue components of the color, respectively.

### Return Value

- Returns a string representing the chosen foreground text color. It will be either `#000000` (black) or `#FFFFFF` (white).

### Example Usage

```javascript
const foregroundColor = findBiggerBWContrast('#FF0000');
console.log(foregroundColor); // Output: #FFFFFF
```
In this example, the function `findBiggerBWContrast` is called with the background color `#FF0000` (red). It calculates the contrast ratio between red and black, as well as red and white. Since the contrast ratio with white is higher, it returns `#FFFFFF` as the foreground text color.

## Helper Functions

The `findBiggerBWContrast` function utilizes two helper functions: `getContrastRatio` and `getRelativeLuminance`.

### getContrastRatio

The `getContrastRatio` function calculates the contrast ratio between two colors. It takes two parameters: `color1` and `color2`, which are hexadecimal color values. The function internally calls the `getRelativeLuminance` function to calculate the relative luminance of each color and then uses the luminance values to calculate the contrast ratio.

### getRelativeLuminance

The `getRelativeLuminance` function calculates the relative luminance of a given color. It takes a single parameter `hexColor`, which is the hexadecimal representation of the color. The function converts the hexadecimal color to RGB values, applies the relative luminance formula, and returns the calculated luminance value.

### getSRGBComponent

The `getSRGBComponent` function is a helper function used by `getRelativeLuminance` to calculate the sRGB component of a given color component value. It takes a single parameter `component`, which represents a single RGB color component value. The function applies the appropriate calculation based on the component value to convert it into the sRGB component value.
