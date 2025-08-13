import { describe, expect, test } from 'vitest'
import { checkLastOpening } from './analyzeLine'

const testLastOpeningBrace = `describe("checkLastOpening", () => {`
const testLastNotOpeningBrace = `describe("checkLastOpening", () => {})`
const testLastOpeningQuote = "const sometext = `"
const testLastNotOpeningQuote = "const sometext = ``"

describe("checkLastOpening", () => {
  test("Last opening {", () => {
    const result = checkLastOpening("{", testLastOpeningBrace)
    expect(result).not.toBe(null)
    expect(result).toBe(35)
  })
  test("Last not opening {", () => {
    const result = checkLastOpening("{", testLastNotOpeningBrace)
    expect(result).toBe(null)
  })
  test("Last opening `", () => {
    const result = checkLastOpening("`", testLastOpeningQuote)
    expect(result).not.toBe(null)
    expect(result).toBe(17)
  })
  test("Last not opening `", () => {
    const result = checkLastOpening("`", testLastNotOpeningQuote)
    expect(result).toBe(null)
  })
})
