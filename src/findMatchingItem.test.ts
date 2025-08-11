import { describe, expect, test } from 'vitest'
import { findMatchingItem } from './findMatchingItem'

// const something = "Lorem ipsum dolor sit amet consectetur adipisicing elit.".split("or").join("lorem")
const testString = `const something = "Lorem ipsum dolor sit amet consectetur adipisicing elit.".split("or").join("lorem")`
const testNested = `objectRange = new Range(scanner.peekLeftAhead(), scanner.peekRightBehind())`
const oddNumber = `const someResult = something.map((el) => {`

describe("findMatchingItem", () => {
  test("find ()", () => {
    const { pairs: result } = findMatchingItem(testString, "(")
    console.info('result:', result)
    expect(result.length).toBe(2)
  })
  test("find nested", () => {
    const { pairs: result } = findMatchingItem(testNested, "(")
    console.info('result:', result)
    expect(result.length).toBe(3)
  })
  test("find in incomplete string", () => {
    const { pairs: result } = findMatchingItem(oddNumber, "(")
    console.info('result:', result)
    expect(result.length).toBe(1)
  })
})
