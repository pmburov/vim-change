import * as vscode from "vscode"
import { VimState } from "./vimState"

export function activate(context: vscode.ExtensionContext) {
  VimState.init(context)

  const d1 = vscode.commands.registerCommand("vim-change.inside", () => {
    VimState.modifier = "i"
    VimState.add()
  })
  context.subscriptions.push(d1)

  const d2 = vscode.commands.registerCommand("vim-change.around", () => {
    VimState.modifier = "a"
    VimState.add()
  })
  context.subscriptions.push(d2)

  const d3 = vscode.commands.registerCommand("vim-change.stop", () => {
    VimState.stop()
  })
  context.subscriptions.push(d3)

  const d4 = vscode.commands.registerCommand("vim-change.select-inside", () => {
    VimState.modifier = "i"
    VimState.selectMode = true
    VimState.add()
  })
  context.subscriptions.push(d4)

  const d5 = vscode.commands.registerCommand("vim-change.select-around", () => {
    VimState.modifier = "a"
    VimState.selectMode = true
    VimState.add()
  })
  context.subscriptions.push(d5)

  return {
    VimState,
  }
}

export { VimState }

export function deactivate() { }
