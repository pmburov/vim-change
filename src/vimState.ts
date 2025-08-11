import * as vscode from "vscode"
import { jumpInsideRangeInLine, Modifier, quotesObject, selectObjects, RangeData, wordObject, commasObject } from "./core"
import { analyzeLine } from "./analyzeLine"

export class VimState {
  static statusBar: vscode.StatusBarItem
  static listenForInput: boolean
  static typeHandler: vscode.Disposable | null = null
  static modifier: Modifier = "i"
  static selectMode: boolean = false

  static init(context: vscode.ExtensionContext) {
    this.listenForInput = false

    this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10)
    context.subscriptions.push(this.statusBar)
    vscode.commands.executeCommand("setContext", "vim-change.mode", "")
  }

  static regTypeHandler() {
    this.typeHandler = vscode.commands.registerCommand("type", (text) => {
      this.type(text.text)
    })
  }

  static add() {
    vscode.commands.executeCommand("setContext", "vim-change.mode", "input")
    this.regTypeHandler()
    const config = vscode.workspace.getConfiguration("vim-change")

    this.listenForInput = true

    if (config.get("showInputIndicator")) {
      if (this.selectMode) {
        this.statusBar.text = this.modifier === "i" ? "Select inside" : "Select around"
      } else {
        this.statusBar.text = this.modifier === "i" ? "Change inside" : "Change around"
      }
      this.statusBar.show()
    }
  }

  static stop() {
    this.listenForInput = false
    this.selectMode = false
    this.statusBar.text = ""
    this.statusBar.hide()
    if (this.typeHandler) {
      this.typeHandler.dispose()
      this.typeHandler = null
    }
    vscode.commands.executeCommand("setContext", "vim-change.mode", "")
  }

  static async type(text: string) {
    if (this.listenForInput) {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        return false
      }

      const bracesList = ["{", "}", "[", "]", "(", ")", "<", ">"]
      const quotesList = ["'", '"', "`"]
      const wordsList = ["w", "W"]
      const commasList = [","]
      const modifier = this.modifier

      let mode: "braces" | "quotes" | "word" | "commas"

      let result: RangeData | null = null
      if (bracesList.includes(text) || text === "0" || text === "9") {
        if (text === "9") { text = "(" }
        if (text === "0") { text = ")" }
        if (this.selectMode) {
          selectObjects(text, modifier, editor)
          this.selectMode = false
        } else {
          const line = editor.document.lineAt(editor.selection.anchor.line).text
          analyzeLine(text, line, (start, end) => {
            jumpInsideRangeInLine(editor, start, end)
          })
          result = selectObjects(text, modifier, editor)
          mode = "braces"
        }
      } else if (quotesList.includes(text)) {
        if (this.selectMode) {
          const range = quotesObject(text, modifier, editor)
          if (range?.range) {
            editor.selection = new vscode.Selection(range.range.start, range.range.end)
          }
        } else {
          result = quotesObject(text, modifier, editor)
        }
        mode = "quotes"
      } else if (commasList.includes(text)) {
        if (this.selectMode) {
          const range = commasObject(text, modifier, editor)
          if (range?.range) {
            editor.selection = new vscode.Selection(range.range.start, range.range.end)
          }
        } else {
          result = commasObject(text, modifier, editor)
        }
        mode = "commas"
      } else if (wordsList.includes(text)) {
        if (this.selectMode) {
          await wordObject(modifier === "i" ? "w" : "W", editor, this.selectMode)
        } else {
          result = await wordObject(modifier === "i" ? "w" : "W", editor, this.selectMode)
        }
        mode = "word"
      }
      if (result?.range) {
        editor.edit((e) => {
          e.delete(result?.range as vscode.Range)
        }).then(() => {
          this.stop()
          if (mode && (mode === "quotes" || mode === "commas" || mode === "word")) {
            // jump cursor to position
            editor.selection = new vscode.Selection(
              result?.range.start.line as number,
              result?.range.start.character as number,
              result?.range.start.line as number,
              result?.range.start.character as number,
            )
          }
        })
      }
      this.stop()
    } else {
      vscode.commands.executeCommand("default:type", { text: text })
    }
  }
}
