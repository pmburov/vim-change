import { Modifier } from "./core"

export function processCommas(input: string, c: string = ',', cursorIndex: number, type: Modifier) {
  let isBetweenCommas = false
  let isBetweenCommaAndBrace = false


  const leftPart = input.slice(0, cursorIndex)
  const rightPart = input.slice(cursorIndex)
  let leftIndexFromCursor: number = 0
  let rightIndexFromCursor: number = 0
  let leftIndex: number = -1
  let rightIndex: number = -1
  let leftBraceIndex: number = -1
  let rightBraceIndex: number = -1

  const leftReverse = leftPart.split("").reverse().join("")

  rightIndexFromCursor = rightPart.indexOf(c) // find closest quote
  leftIndexFromCursor = leftReverse.indexOf(c) // find closest quote

  if (rightIndexFromCursor !== -1 && leftIndexFromCursor !== -1) {
    isBetweenCommas = true
  } else {
    if (leftIndexFromCursor > -1 && rightIndexFromCursor === -1) {
      // if no right comma check for )
      let braceIndex = rightPart.indexOf(")")
      if (braceIndex === -1) {
        braceIndex = rightPart.indexOf("]")
      }
      // we are between comma and right brace
      if (braceIndex > -1) {
        rightBraceIndex = cursorIndex + braceIndex
        rightIndexFromCursor = braceIndex
        isBetweenCommaAndBrace = true
      }
    } else if (leftIndexFromCursor === -1 && rightIndexFromCursor > -1) {
      // if no left comma check for (
      let braceIndex = leftReverse.indexOf("(")
      if (braceIndex === -1) {
        braceIndex = leftReverse.indexOf("[")
      }

      if (braceIndex > -1) {
        leftBraceIndex = cursorIndex - braceIndex
        leftIndexFromCursor = braceIndex
        isBetweenCommaAndBrace = true
      }
    }
  }

  // we are between two commas
  leftIndex = cursorIndex - leftIndexFromCursor
  rightIndex = cursorIndex + rightIndexFromCursor

  if (type === "a") {
    leftIndex -= 1
    rightIndex += 1
  }

  return {
    isBetweenCommas,
    isBetweenCommaAndBrace,
    leftIndex,
    rightIndex,
    leftBraceIndex,
    rightBraceIndex,
  }
}
