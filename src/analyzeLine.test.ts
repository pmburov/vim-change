import { describe, expect, test } from 'vitest'
import { analyzeLine } from './analyzeLine'

/*
const something = computed(() => valueOne + valueTwo)
*/
const oneEmpty = `const something = computed(() => valueOne + valueTwo)`

describe("analyzeLine", () => {
  test("One pair of two is empty", () => {
    const result = analyzeLine("(", oneEmpty, () => { })
    expect(result?.length).toBe(1)
  })
})
