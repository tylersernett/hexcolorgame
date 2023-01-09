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