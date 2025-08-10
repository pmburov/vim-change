import { describe, expect, test } from 'vitest'

import { processQuotes } from "./processQuotes"

// const something = "Lorem ipsum dolor sit amet consectetur adipisicing elit.".split("or").join("lorem")
const testString = `const something = "Lorem ipsum dolor sit amet consectetur adipisicing elit.".split("or").join("lorem")`

describe("we are in the middle of the line (i)", () => {
  test("We are inside quoted string (i)", () => {
    const result = processQuotes(testString, '"', 24, "i")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`Lorem ipsum dolor sit amet consectetur adipisicing elit.`)
  })
  test("We are between quoted strings", () => {
    const result = processQuotes(testString, '"', 79, "i")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`Lorem ipsum dolor sit amet consectetur adipisicing elit.`)
  })
  test("We are between quoted strings closer to second quoted string", () => {
    const result = processQuotes(testString, '"', 82, "i")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`or`)
  })
  test("We are inside second quoted string", () => {
    const result = processQuotes(testString, '"', 86, "i")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`or`)
  })
  test("We are between second and third quoted string", () => {
    const result = processQuotes(testString, '"', 92, "i")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`lorem`)
  })
  test("We are inside third quoted string", () => {
    const result = processQuotes(testString, '"', 98, "i")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`lorem`)
  })
})

describe("we are NOT in the middle of the line (i)", () => {
  test("we are at the beginning of the string to the left from quoted string", () => {
    const result = processQuotes(testString, '"', 5, "i")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`Lorem ipsum dolor sit amet consectetur adipisicing elit.`)
  })
  test("we are at the end of the string to the right from quoted string", () => {
    const result = processQuotes(testString, '"', 102, "i")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`lorem`)
  })
})

describe("we are in the middle of the line (a)", () => {
  test("We are inside quoted string", () => {
    const result = processQuotes(testString, '"', 24, "a")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`"Lorem ipsum dolor sit amet consectetur adipisicing elit."`)
  })
  test("We are between quoted strings", () => {
    const result = processQuotes(testString, '"', 79, "a")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`"Lorem ipsum dolor sit amet consectetur adipisicing elit."`)
  })
  test("We are between quoted strings closer to second quoted string", () => {
    const result = processQuotes(testString, '"', 82, "a")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`"or"`)
  })
  test("We are inside second quoted string", () => {
    const result = processQuotes(testString, '"', 86, "a")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`"or"`)
  })
  test("We are between second and third quoted string", () => {
    const result = processQuotes(testString, '"', 92, "a")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`"lorem"`)
  })
  test("We are inside third quoted string", () => {
    const result = processQuotes(testString, '"', 98, "a")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`"lorem"`)
  })
})

describe("we are NOT in the middle of the line (a)", () => {
  test("we are at the beginning of the string to the left from quoted string", () => {
    const result = processQuotes(testString, '"', 5, "a")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`"Lorem ipsum dolor sit amet consectetur adipisicing elit."`)
  })
  test("we are at the end of the string to the right from quoted string", () => {
    const result = processQuotes(testString, '"', 102, "a")
    const str = testString.slice(result.leftIndex, result.rightIndex)
    expect(str).toBe(`"lorem"`)
  })
})
