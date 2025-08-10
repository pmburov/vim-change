import { Modifier } from "./core"

export function processQuotes(input: string, c: string = '"', cursorIndex: number, type: Modifier) {
  const numOfItems = input.split("").filter((el) => el === c).length
  const isEven = numOfItems % 2 === 0
  let isCompleteString = false

  if (numOfItems >= 2 && isEven) {
    isCompleteString = true
  }

  const leftPart = input.slice(0, cursorIndex)
  const rightPart = input.slice(cursorIndex)
  const numOfLeft = leftPart.split("").filter((el) => el === c).length
  const isLeftEven = numOfLeft % 2 === 0
  const numOfRight = rightPart.split("").filter((el) => el === c).length
  const isRightEven = numOfRight % 2 === 0

  let leftIndexFromCursor: number = 0
  let rightIndexFromCursor: number = 0
  let leftIndex: number = 0
  let rightIndex: number = 0

  if (isCompleteString) {
    // we are in the middle of the line
    if (numOfLeft > 0 && numOfRight > 0) {
      rightIndexFromCursor = rightPart.indexOf(c) // find closest quote
      leftIndexFromCursor = leftPart.split("").reverse().join("").indexOf(c) // find closest quote

      // We are between quoted strings
      if (isLeftEven && isRightEven) {
        // we go left
        if (leftIndexFromCursor <= rightIndexFromCursor) {
          rightIndex = cursorIndex - leftIndexFromCursor - 1
          leftIndex = cursorIndex - leftIndexFromCursor - leftPart.slice(0, leftPart.length - leftIndexFromCursor - 1 /* - 1 to cut quote */).split("").reverse().join("").indexOf(c) - 1

          if (type === "a") {
            leftIndex -= 1
            rightIndex += 1
          }
          //we go right
        } else {
          leftIndex = cursorIndex + rightIndexFromCursor + 1
          rightIndex = cursorIndex + rightIndexFromCursor + rightPart.slice(rightIndexFromCursor + 1 /* - 1 to cut quote */).indexOf(c) + 1

          if (type === "a") {
            leftIndex -= 1
            rightIndex += 1
          }
        }

        //  We are inside quoted string
      } else if (!isLeftEven && !isRightEven) {
        leftIndex = cursorIndex - leftIndexFromCursor
        rightIndex = cursorIndex + rightIndexFromCursor

        if (type === "a") {
          leftIndex -= 1
          rightIndex += 1
        }
      }
    } else {
      // we are at the beginning of the string to the left from quoted string
      if (numOfRight > numOfLeft) {
        const temp = rightPart.indexOf(c)
        leftIndex = cursorIndex + rightPart.indexOf(c) + 1
        rightIndex = cursorIndex + temp + rightPart.slice(temp + 1 /* - 1 to cut quote */).indexOf(c) + 1

        if (type === "a") {
          leftIndex -= 1
          rightIndex += 1
        }

        // we are at the end of the string to the right from quoted string
      } else {
        const temp = leftPart.split("").reverse().join("").indexOf(c)
        rightIndex = cursorIndex - temp - 1
        leftIndex = cursorIndex - temp - leftPart.slice(0, cursorIndex - temp - 1 /* - 1 to cut quote */).split("").reverse().join("").indexOf(c) - 1

        if (type === "a") {
          leftIndex -= 1
          rightIndex += 1
        }
      }
      if (!isLeftEven && !isRightEven) {
        //
      }
    }
  }

  return {
    numOfItems,
    isCompleteString,
    leftIndex,
    leftIndexFromCursor,
    rightIndex,
    rightIndexFromCursor,
  }
}

