import { describe, expect, test } from 'vitest'
import { getBracketPairs } from './getBracketPairs'

describe("getBracketPairs", () => {
  test("{}", () => {
    const { openingBracket, closingBracket } = getBracketPairs("{")
    expect(openingBracket).toBe(`{`)
    expect(closingBracket).toBe(`}`)
  })
  test("}{", () => {
    const { openingBracket, closingBracket } = getBracketPairs("}")
    expect(openingBracket).toBe(`{`)
    expect(closingBracket).toBe(`}`)
  })
})
