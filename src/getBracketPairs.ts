import { closingBrackets, openingBrackets } from "./consts"

export function getBracketPairs(s: string) {
  const openingBracket = openingBrackets[s]
  const closingBracket = closingBrackets[s]

  return { openingBracket, closingBracket }
}
