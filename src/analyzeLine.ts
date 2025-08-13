import { findMatchingItem } from "./findMatchingItem"

export function checkLastOpening(s: string, line: string) {
  const numOfItems = line.split("").filter(el => el === s).length

  const index = line.indexOf(s)

  if (numOfItems === 1 && index === line.length - 1) {
    return index
  }

  return null
}

export function analyzeLine(s: string, line: string, callback: (start: number, end: number) => void) {
  const { pairs: items, isIncompleteString } = findMatchingItem(line, s)

  /*
  Case like this
  const somefunction = () => {
  */
  const lastIndex = checkLastOpening(s, line)
  if (lastIndex !== null) {
    callback(lastIndex + 1, lastIndex + 1)
    return []
  }

  if (items.length === 0 || isIncompleteString) {
    return []
  }

  if (items.length === 1) {
    callback(items[0][0], items[0][1])
    return items
  }

  const notEmpty = items.filter((el) => (el[1] !== el[0] + 1))
  /*
  Case like this:
  const something = computed(() => valueOne + valueTwo)

  Jump into large brackets
  */
  if (notEmpty.length === 1) {
    callback(notEmpty[0][0], notEmpty[0][1])
    return notEmpty
  }

  return []
}
