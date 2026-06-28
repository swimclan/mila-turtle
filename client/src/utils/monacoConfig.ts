import type { Monaco } from "@monaco-editor/react";

export const LANGUAGE_ID = "mila-turtle";
export const THEME_ID = "mila-turtle-dark";

export function configureMonaco(monaco: Monaco) {
  if (monaco.languages.getLanguages().some((l) => l.id === LANGUAGE_ID)) return;

  monaco.languages.register({ id: LANGUAGE_ID });

  // Syntax highlighting via Monarch tokenizer
  monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, {
    ignoreCase: true,
    tokenizer: {
      root: [
        [/#.*$/, "mt-comment"],
        [/\b(move|right|left|pen|do|end|center|dir|color|stroke)\b/, "mt-keyword"],
        [/\b(up|down|north|south|east|west|red|green|blue|white|purple|pink|orange|yellow)\b/, "mt-argument"],
        [/\b\d+\b/, "mt-number"],
        [/\+\+|--/, "mt-operator"],
        [/=/, "mt-operator"],
        [/[a-zA-Z]\w*/, "mt-variable"],
      ],
    },
  });

  monaco.editor.defineTheme(THEME_ID, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "mt-comment",  foreground: "6A9955", fontStyle: "italic" },
      { token: "mt-keyword",  foreground: "569CD6", fontStyle: "bold" },
      { token: "mt-argument", foreground: "CE9178", fontStyle: "italic" },
      { token: "mt-number",   foreground: "B5CEA8", fontStyle: "italic" },
      { token: "mt-operator", foreground: "D4D4D4" },
      { token: "mt-variable", foreground: "C586C0" },
    ],
    colors: {},
  });

  // IntelliSense completions
  const { CompletionItemKind: CIK, CompletionItemInsertTextRule: CIITRT } =
    monaco.languages;

  monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, {
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      return {
        suggestions: [
          {
            label: "MOVE",
            kind: CIK.Function,
            insertText: "MOVE ${1:100}",
            insertTextRules: CIITRT.InsertAsSnippet,
            documentation: "Move the turtle forward by N pixels",
            range,
          },
          {
            label: "RIGHT",
            kind: CIK.Function,
            insertText: "RIGHT ${1:90}",
            insertTextRules: CIITRT.InsertAsSnippet,
            documentation: "Rotate the turtle clockwise by N degrees",
            range,
          },
          {
            label: "LEFT",
            kind: CIK.Function,
            insertText: "LEFT ${1:90}",
            insertTextRules: CIITRT.InsertAsSnippet,
            documentation: "Rotate the turtle counter-clockwise by N degrees",
            range,
          },
          {
            label: "PEN DOWN",
            kind: CIK.Function,
            insertText: "PEN DOWN",
            documentation: "Put pen down — turtle draws as it moves",
            range,
          },
          {
            label: "PEN UP",
            kind: CIK.Function,
            insertText: "PEN UP",
            documentation: "Lift pen — turtle moves without drawing",
            range,
          },
          {
            label: "DO",
            kind: CIK.Snippet,
            insertText: "DO ${1:10}\n$0\nEND",
            insertTextRules: CIITRT.InsertAsSnippet,
            documentation: "Loop the enclosed instructions N times",
            range,
          },
          {
            label: "END",
            kind: CIK.Keyword,
            insertText: "END",
            documentation: "Close a DO loop",
            range,
          },
          {
            label: "CENTER",
            kind: CIK.Function,
            insertText: "CENTER",
            documentation: "Teleport turtle to canvas center (keeps current direction)",
            range,
          },
          {
            label: "DIR",
            kind: CIK.Function,
            insertText: "DIR ${1|NORTH,SOUTH,EAST,WEST|}",
            insertTextRules: CIITRT.InsertAsSnippet,
            documentation: "Snap turtle to a cardinal direction",
            range,
          },
          {
            label: "COLOR",
            kind: CIK.Function,
            insertText: "COLOR ${1|RED,GREEN,BLUE,WHITE,PURPLE,PINK,ORANGE,YELLOW|}",
            insertTextRules: CIITRT.InsertAsSnippet,
            documentation: "Set the drawing color",
            range,
          },
          {
            label: "STROKE",
            kind: CIK.Function,
            insertText: "STROKE ${1:3}",
            insertTextRules: CIITRT.InsertAsSnippet,
            documentation: "Set line thickness in pixels",
            range,
          },
        ],
      };
    },
  });
}
