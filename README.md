Flex: how to 'pan' two items hard left and hard right:

Give right-bound item an id, and use css tag 'margin-left: auto;':

```css
#streak {
  margin-left: auto;
}
```

=============

Updating an array in React.

First, make a copy, then update the copy. Finally, set state to the copy:
```javascript
  const wrongGuess = (hexObj) => {
    let index = shuffledArray.indexOf(hexObj);
    let tempArr = [...shuffledArray]
    tempArr[index].touched = true;
    setShuffledArray(tempArr)
  }
```