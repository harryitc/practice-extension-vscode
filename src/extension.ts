// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { workspace, window, EndOfLine } from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hitc" is now active!');


	// vscode.languages.registerHoverProvider

	// 👍 only works with files on disk
	const disposable1 = vscode.languages.registerHoverProvider(
		{ scheme: 'file', language: 'typescript' },
		{
			provideHover(doc: vscode.TextDocument) {
				const { size } = fs.statSync(doc.uri.fsPath);
				return new vscode.Hover(`Size in bytes is ${size}`);
			}
		}
	);

	let editor: vscode.TextEditor;
	let selection: vscode.Selection;
	let textHighlighted: string = "";
	const disposable3 = vscode.window.onDidChangeActiveTextEditor(editorChange => {
		editor = editorChange as vscode.TextEditor;
		console.log('editor = ', editor);
	})
	const disposable2 = vscode.window.onDidChangeTextEditorSelection(selectionChange => {
		selection = selectionChange.textEditor.selection;
		// console.log("editor = ", editorChange)
		// editor = editor as vscode.TextEditor;
		// selection = editorChange?.selection as vscode.Selection;
		if (!editor) {
			return vscode.window.showWarningMessage("Chưa có file nào được chọn!");
		}
		else {
			const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
			textHighlighted = editor.document.getText(selectionRange);
		}
	})

	const disposable4 = vscode.commands.registerCommand("hitc.insertText", () => {
		// let moveBy = {to: 'wrappedLineEnd', by: 'line'};
		// await vscode.commands.executeCommand('cursorMove', moveBy);

		// TODO 1: thực hiện console.log bằng shortcut keyboard.
		// TODO 2: Chưa insert được 1 dòng mới ở đằng sau. 
		// get range at end of line
		const editRange = editor.document.lineAt(editor.selection.end.line).range.end;

		editor.edit(editBuilder => {
			if (editor !== undefined) {
				// editBuilder.setEndOfLine(EndOfLine.LF);
				editBuilder.insert(editRange, `\r\nconsole.log("${textHighlighted} = ", ${textHighlighted});`);
			}
		});
	})


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('hitc.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user




		// await window.showInputBox({
		// 	title: 'ahihi',
		// 	placeHolder: "Ví dụ: tôi là cường",
		// }).then(
		// 	(value) => {
		// 		console.log("value = ", value);
		// 	},
		// 	(reason) => {
		// 		console.log("error = ", reason);
		// 	}
		// )

		// const message = "Hello World from harryitc-toools!";

		// vscode.window.showInformationMessage(message);

		// const editor = vscode.window.activeTextEditor;
		// const selection = editor?.selection;

		// window.showOpenDialog({
		// 	canSelectFolders: true,
		// 	canSelectFiles: true,
		// }).then(
		// 	(value) => {
		// 		console.log("value = ", value);
		// 	},
		// 	(reason) => {
		// 		console.log("error = ", reason);
		// 	}
		// );

		const panel = vscode.window.createWebviewPanel(
			'myWebview',
			'My Webview.txt',
			vscode.ViewColumn.One,
			{}
		);
		panel.webview.html = '<h1>Hello, Webview!</h1>';
	});

	context.subscriptions.push(
		disposable1,
		disposable3,
		disposable2,
		disposable4,
		disposable,
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
