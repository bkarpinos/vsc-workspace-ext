import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Focus By Directory Command', async () => {
		const focusCommand = 'workspace-explorer.focusByDirectory';
		const executed = await vscode.commands.executeCommand(focusCommand);
		assert.strictEqual(executed, undefined, 'Focus By Directory command should execute without errors.');
	});

	test('Open By Directory Command', async () => {
		const openCommand = 'workspace-explorer.openByDirectory';
		const executed = await vscode.commands.executeCommand(openCommand);
		assert.strictEqual(executed, undefined, 'Open By Directory command should execute without errors.');
	});
});
