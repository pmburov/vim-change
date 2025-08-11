import { describe, expect, test } from 'vitest'
import { processCommas } from './processCommas'

/*
editor.selection = new vscode.Selection(range.range.start, range.range.end)
result = selectObjects(text, modifier, editor)
const bracesList = ["{", "}", "[", "]", "(", ")", "<", ">"]
*/

const testBraces = `editor.selection = new vscode.Selection(range.range.start, range.range.end)`
const testCommas = `result = selectObjects(text, modifier, editor)`
const testSquareBrackets = `const bracesList = ["{", "}", "[", "]", "(", ")", "<", ">"]`

describe("processCommas", () => {
  test("we are between two commas", () => {
    const result = processCommas(testCommas, ',', 34, "i")
    expect(result.isBetweenCommas).toBe(true)
  })
  test("we are between comma and brace", () => {
    const result = processCommas(testCommas, ',', 43, "i")
    expect(result.isBetweenCommas).toBe(false)
    expect(result.isBetweenCommaAndBrace).toBe(true)
    const result2 = processCommas(testBraces, ',', 68, "i")
    expect(result2.isBetweenCommas).toBe(false)
    expect(result2.isBetweenCommaAndBrace).toBe(true)
  })
  test("we are between comma and square bracket", () => {
    const result = processCommas(testSquareBrackets, ',', 57, "i")
    expect(result.isBetweenCommas).toBe(false)
    expect(result.isBetweenCommaAndBrace).toBe(true)
  })
})
