import { findMatchingItem } from "./findMatchingItem"

export function analyzeLine(s: string, line: string, callback: (start: number, end: number) => void) {
  const items = findMatchingItem(line, s)

  if (items.length === 0) {
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
