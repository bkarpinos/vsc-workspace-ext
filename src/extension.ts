// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { getHighestViewColumn, getTabsByFolderPath, getTabUri, selectFile} from './utils/tabs';
import { selectWorkplaceFolder } from './utils/workspace';
import { open } from 'fs';

const EXTENSION_NAME = "workspace-explorer";


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(`Extension [${EXTENSION_NAME}] is now active!`);

	const focusDisposable = vscode.commands.registerCommand('workspace-explorer.focusByDirectory', async () => {

		// Launch First Quick Pick for Folder Selection
		const selectedFolder = await selectWorkplaceFolder();
		if (!selectedFolder) {
			vscode.window.showInformationMessage('No workspace folder selected.');
			return;
		}
		const selectedFolderPath = selectedFolder.description;

		// Identify tabs belonging to the selected folder
		const directoryTabs = getTabsByFolderPath(selectedFolderPath);
		if (directoryTabs.length === 0) {
			vscode.window.showInformationMessage(
				`No OPEN files found for workspace folder '${selectedFolder.label}'.`
			);
			return;
		}

		// Launch Second Quick Pick for File Selection
		const selectedFile = await selectFile(selectedFolder);
		if (!selectedFile) {
			vscode.window.showInformationMessage('No file selected.');
			return;
		}
		if(!selectedFile.uri){
			vscode.window.showInformationMessage('Selected file format not supported.');
			return;
		}

		// Find the group and viewColumn where the file is already open
		const tabGroup = vscode.window.tabGroups.all.find(group =>
			group.tabs.includes(selectedFile.tab)
		);
		const viewColumn = tabGroup?.viewColumn;


		await vscode.window.showTextDocument(selectedFile.uri, { viewColumn, preview: false });
	});
	context.subscriptions.push(focusDisposable);

	const openDisposable = vscode.commands.registerCommand('workspace-explorer.openByDirectory', async () => {
		try {
			// Launch First Quick Pick for Folder Selection
			const selectedFolder = await selectWorkplaceFolder();
			if (!selectedFolder) {
				vscode.window.showInformationMessage('No workspace folder selected.');
				return;
			}
			const selectedFolderPath = selectedFolder.description;

			// Identify tabs belonging to the selected folder
			const directoryTabs = getTabsByFolderPath(selectedFolderPath);
			if (directoryTabs.length === 0) {
				vscode.window.showInformationMessage(
					`No OPEN files found for workspace folder '${selectedFolder.label}'.`
				);
				return;
			}
			const directoryFilePaths = directoryTabs.map((tab) => getTabUri(tab)?.path);

			// Add initial tab to the right of the current tab
			const firstTab = directoryTabs.shift();
			if (!firstTab) {
				vscode.window.showInformationMessage(
					`No OPEN files found for workspace folder '${selectedFolder.label}'.`
				);
				return;
			}
			const besidesColumn = vscode.ViewColumn.Beside;
			const tabUri = getTabUri(firstTab);
			if (tabUri) {
				await vscode.window.showTextDocument(tabUri, { viewColumn: besidesColumn, preview: false });
			}

			// Grab the last tab now that its been created and add remaining tabs
			const newColumn = getHighestViewColumn();
			await Promise.all(directoryTabs.map(async (tab) => {
				const tabUri = getTabUri(tab);
				if (tabUri) {
					await vscode.window.showTextDocument(tabUri, { viewColumn: newColumn, preview: false });
				}
			}));

			// Close old selected directory tabs
			const originalTabs = vscode.window.tabGroups.all
				.filter((group) => group.viewColumn !== newColumn)
				.flatMap((group) => group.tabs);

			const toDelete = originalTabs.filter((tab) => {
				const tabPath = getTabUri(tab)?.path;
				return directoryFilePaths.includes(tabPath);
			});

			await Promise.all(toDelete.map(async (tab) => {
				await vscode.window.tabGroups.close(tab);
			}));
		} catch (error) {
			vscode.window.showErrorMessage("There was an issue opening the folder.");
		}
	});
	context.subscriptions.push(openDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
