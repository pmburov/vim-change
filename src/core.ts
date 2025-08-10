import * as vscode from "vscode"
import { Range } from "vscode"
import { processQuotes } from "./processQuotes"
import { expandSelection } from "./expandSelection"
import { getBracketPairs } from "./getBracketPairs"

export type Modifier = "i" | "a"

export type RangeData = {
  range: Range
}

export function quotesObject(c: string, type: Modifier, selection: vscode.Selection, editor: vscode.TextEditor) {
  if (!['"', "'", "`"].includes(c)) {
    console.error(`Invalid "${c}" character for textObject`)
    return null
  }

  const line = editor.document.lineAt(selection.active)
  const ci = selection.active.character
  const result = processQuotes(line.text, c, ci, type)

  return {
    range: new Range(
      new vscode.Position(line.lineNumber, result.leftIndex),
      new vscode.Position(line.lineNumber, result.rightIndex),
    ),
  }
}

// vscode.commands.executeCommand("editor.action.formatSelection", range)

export async function wordObject(type: "w" | "W", editor: vscode.TextEditor, selectMode: boolean) {
  await vscode.commands.executeCommand("editor.action.addSelectionToNextFindMatch")
  let range = editor.document.getWordRangeAtPosition(editor.selection.active) as Range

  if (type === "W") {
    increaseSelection(editor)
    range = new Range(editor.selection.anchor, editor.selection.active)
  }

  if (!selectMode) {
    await vscode.commands.executeCommand("cursorRight")
    await vscode.commands.executeCommand("cursorLeft")
  }

  return { range }
}

export function increaseSelection(editor: vscode.TextEditor) {
  editor.selection = new vscode.Selection(
    editor.selection.anchor.line,
    editor.selection.anchor.character - 1 >= 0 ? editor.selection.anchor.character - 1 : editor.selection.anchor.character,
    editor.selection.active.line,
    editor?.selection.active.character + 1
  )
}

export function decreaseSelection(editor: vscode.TextEditor) {
  editor.selection = new vscode.Selection(
    editor.selection.anchor.line,
    editor.selection.anchor.character + 1,
    editor.selection.active.line,
    editor?.selection.active.character - 1 >= 0 ? editor?.selection.active.character - 1 : editor?.selection.active.character
  )
}

export function resetSelection(editor: vscode.TextEditor) {
  const current = new vscode.Selection(
    editor.selection.active.line,
    editor.selection.active.character,
    editor.selection.active.line,
    editor.selection.active.character
  )
  editor.selection = current
  return current
}

export function jumpInsideRangeInLine(editor: vscode.TextEditor, start: number, end: number) {
  const selection = new vscode.Selection(
    editor.selection.active.line,
    start,
    editor.selection.anchor.line,
    end
  )
  editor.selection = selection
  vscode.commands.executeCommand("cursorRight")
  vscode.commands.executeCommand("cursorLeft")
  resetSelection(editor)
}

export function selectObjects(s: string, type: Modifier, editor: vscode.TextEditor) {
  const { openingBracket, closingBracket } = getBracketPairs(s)

  expandSelection(editor, [openingBracket], [closingBracket])
  if (type === "a") {
    increaseSelection(editor)
  }

  return {
    range: new Range(editor.selection.anchor, editor.selection.active)
  }
}
