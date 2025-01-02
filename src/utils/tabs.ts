import * as vscode from 'vscode';
import type { FolderOption } from './workspace';

interface FileOption {
  label: string;
  description: string | undefined;
  uri: vscode.Uri | null;
  tab: vscode.Tab;
}

export function getTabUri(tab: vscode.Tab): vscode.Uri | null {
  if (tab.input instanceof vscode.TabInputText && tab.input.uri) {
    return tab.input.uri;
  }
  return null;
};

export function getTabsByFolderPath(folderPath: string): vscode.Tab[] {
  const directoryTabs: vscode.Tab[] = [];
  const allTabs = vscode.window.tabGroups.all.flatMap(group => group.tabs);
  allTabs.forEach(tab => {
    if (tab.input instanceof vscode.TabInputText && tab.input.uri) {
      const tabPath = tab.input.uri.path;
      if (tabPath.startsWith(folderPath)) {
        directoryTabs.push(tab);
      }
    }
  });

  return directoryTabs;
}

export async function selectFile(folder: FolderOption): Promise<FileOption | null> {
  const directoryTabs = getTabsByFolderPath(folder.description);
  if (directoryTabs.length === 0) {
    vscode.window.showInformationMessage(
      `No OPEN files found for workspace folder '${folder.label}'.`
    );
    return null;
  }

  const directoryFileOptions = directoryTabs.map((tab): FileOption => {
    const tabUri = getTabUri(tab);
    return { label: tab.label, description: tabUri?.path, uri: tabUri, tab: tab };
  });

  const selectedFile = await vscode.window.showQuickPick(
    directoryFileOptions,
    {
      placeHolder: `Select a file to focus in folder:'${folder.label}'`,
    }
  );
  if (!selectedFile) {
    return null;
  }
  return selectedFile;
}

export function getHighestViewColumn (): vscode.ViewColumn {
  // Grab the last tab now that its been created
  const tabGroups = vscode.window.tabGroups.all;
  // Find the last (highest) column
  const lastColumnNumber = Math.max(
    ...tabGroups.map(group => group.viewColumn ?? vscode.ViewColumn.One)
  );
  // Convert to ViewColumn (it already is effectively)
  const lastViewColumn = lastColumnNumber as vscode.ViewColumn;
  return lastViewColumn;
}