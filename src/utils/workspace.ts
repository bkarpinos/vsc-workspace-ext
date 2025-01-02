import * as vscode from 'vscode';

export interface FolderOption {
  label: string;
  description: string;
}

export function getWorkspaceFolderOptions(): FolderOption[] {
  // Grab workspace folders
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folders found!');
    return [];
  }

  // Offer the user a choice of workspace directories
  const folderOptions = workspaceFolders.map(folder => ({
    label: folder.name,
    description: folder.uri.path, // Display the folder's path
  }));

  return folderOptions;
}

export async function selectWorkplaceFolder(): Promise<FolderOption | null> {
  const folderOptions = getWorkspaceFolderOptions();
  if (folderOptions.length === 0) {
    vscode.window.showErrorMessage('No workspace folders found!');
    return null;
  }
  const selectedFolder = await vscode.window.showQuickPick(folderOptions, {
    placeHolder: 'Select a workspace folder to explore',
  });

  if (!selectedFolder) {
    return null;
  }
  return selectedFolder;
}