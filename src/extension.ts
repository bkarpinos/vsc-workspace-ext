// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "workspace-organizer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('workspace-organizer.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from workspace-organizer!');
	});

	context.subscriptions.push(disposable);

	const organizeDisposable = vscode.commands.registerCommand('workspace-organizer.gatherDirector', async () => {

		// Grab workspace folders
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folders found!');
			return;
		}

		// Offer the user a choice of workspace directories
		const folderOptions = workspaceFolders.map(folder => ({
			label: folder.name,
			description: folder.uri.path, // Display the folder's path
		}));

		const selectedFolder = await vscode.window.showQuickPick(folderOptions, {
			placeHolder: 'Select a workspace directory to move its open files to the current tab group',
		});

		if (!selectedFolder) {
			vscode.window.showInformationMessage('No workspace folder selected.');
			return;
		}

		vscode.window.showInformationMessage(
			`About to move tab(s) from '${selectedFolder.label}' to the active group.`
		);
	});
	context.subscriptions.push(organizeDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
