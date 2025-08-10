import * as vscode from 'vscode';

// Return the top of the stack
const peek = (stack: number[]) => stack.slice(-1)[0];

// Show unbalanced brackets error
const showErrorPopup = () => vscode.window.showInformationMessage('Unbalanced brackets :(');

type Direction = {
  predicate: (i: number, text: string) => boolean
  step: number
  searchSymbols: string[]
  otherSymbols: string[]
}

function searchScope(text: string, offset: number, direction: Direction, then: (i: number, k: number) => void) {
  // Stack of other brackets
  const stack: number[] = [];

  // Look for bracket towards direction
  for (let i = offset; direction.predicate(i, text); i += direction.step) {
    // Current character
    const c = text[i];

    const matchingOther = direction.otherSymbols.indexOf(c);
    if (matchingOther !== -1) {
      // Found bracket of "other" kind while looking for "my" bracket
      stack.push(matchingOther);
      continue;
    }

    const matchingSearchSymbols = direction.searchSymbols.indexOf(c);
    if (matchingSearchSymbols === -1) {
      continue;
    }
    else if (stack.length > 0) {
      // Found "my" bracket
      if (peek(stack) === matchingSearchSymbols) {
        // Bracket of "my" kind matches top of stack
        stack.pop();
        continue;
      }
      else {
        // Failure
        showErrorPopup();
        return;
      }
    }
    else {
      then(i, matchingSearchSymbols);
      return;
    }
  }
}

export function expandSelection(editor: vscode.TextEditor, symbolsLeft: string[] = ["{"], symbolsRight: string[] = ["}"]) {
  // Behavior for `search scope` towards left
  const left: Direction =
  {
    predicate: (i: number) => i >= 0,
    step: -1,
    searchSymbols: symbolsLeft,
    otherSymbols: symbolsRight
  };

  // Behavior for search scope` towards right
  const right: Direction =
  {
    predicate: (i: number, text: string) => i < text.length,
    step: 1,
    searchSymbols: symbolsRight,
    otherSymbols: symbolsLeft
  };

  const document = editor.document;
  editor.selections = editor.selections.map((selection) => {
    const text = document.getText();

    const offsetLeft = document.offsetAt(selection.start);
    const offsetRight = document.offsetAt(selection.end) - 1;

    // Try expanding selection to outer scope
    if (offsetLeft > 0 && offsetRight < text.length - 1) {
      // Try to get surrounding brackets
      const symbolLeft = symbolsLeft.indexOf(text[offsetLeft - 1]);
      const symbolRight = symbolsRight.indexOf(text[offsetRight + 1]);

      // Verify that both are brackets and match
      const bothBrackets = symbolLeft !== -1 && symbolRight !== -1;
      const equal = symbolLeft === symbolRight;

      if (bothBrackets && equal) {
        // Expand selection
        return new vscode.Selection(
          document.positionAt(offsetLeft - 1), document.positionAt(offsetRight + 2));
      }
    }

    // Search matching scopes, first to the left, then to the right
    searchScope(text, offsetLeft - 1, left, (indexLeft, matchLeft) => {
      searchScope(text, offsetRight + 1, right, (indexRight, matchRight) => {
        if (matchLeft !== matchRight) {
          showErrorPopup();
          return selection;
        }

        // Select everything inside the scope
        const posLeft = document.positionAt(indexLeft + 1);
        const posRight = document.positionAt(indexRight);
        selection = new vscode.Selection(posLeft, posRight);
      });
    });

    return selection;
  });
}

