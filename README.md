# Vim-Change

In Vim you can use simple motions like `ci"` - change inside quotes, that will delete everything inside quotes, or `ca{` - change around curly braces, that will delete everything inside braces including braces, `vi[` - visually select everything inside square brackets and so on.

```" ` '``` - quotes are supported

`{} [] () <>` - braces are supported

## Default hotkeys

Hotkeys and commands activate input mode to enter a single character

- `alt+]` - Change inside
- `alt+[` - Change around
- `shift+alt+]` - Visually select inside
- `shift+alt+[` - Visually select around

## Available commands

- Vim-Change: Change inside
- Vim-Change: Change around
- Vim-Change: Select inside
- Vim-Change: Select around

## How to build locally

Run `npm run deps` once, it will globally install `@vscode/vsce` necessary for creating `.vsix` package

```bash
npm run build
npm run pack
```

Drag and drop `.vsix` package into Extensions sidebar area inside VS Code

## Credits

- [vscode-expand-selection-to-scope](https://github.com/vittorioromeo/vscode-expand-selection-to-scope)
- [vim-like-vscode](https://github.com/mint-lemonade/vim-like-vscode)
