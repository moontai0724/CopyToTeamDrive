/*
---- LICENSE START ----
    Copyright (C) 2019  moontai0724

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
---- LICENSE OVER ----

First, please don't misled by the name, this is a script that can copy a whole folder into another folder, includes team drive.
That is because team drive is also a folder, it has a folder id in the URL.

URL is looks like this: https://drive.google.com/drive/folders/SfylswnasvBdCgyIOsF7 (it's fake.)
If you are confusing about what is a folder id, in this example, "SfylswnasvBdCgyIOsF7" is the folder id, it can be short, or it can be very very long and complex.

Please notice that this script does not check whether you have permission to access and manage target folder or not.
*/

function main() {
  var targetFolderId = "";
  var sourceFolderId = "";

  if (targetFolderId != "" && sourceFolderId != "") {
    var dataList = getIdListInFolder(sourceFolderId);
    copyDataByJSON(dataList, targetFolderId);
  }
}

function copyDataByJSON(dataList, targetFolderId) {
  try {
    var targetFolder = DriveApp.getFolderById(targetFolderId);

    dataList.files.forEach(function (fileId) {
      var file = DriveApp.getFileById(fileId);
      file.makeCopy(file.getName(), targetFolder);
    });

    dataList.folders.forEach(function (folderData) {
      var folder = DriveApp.getFolderById(folderData.id);
      var newFolderId = targetFolder.createFolder(folder.getName()).getId();

      copyDataByJSON(folderData, newFolderId);
    });
  } catch (err) {
    Logger.log(err);
    return false;
  }
}

function getIdListInFolder(targetFolderId) {
  return list = {
    "id": targetFolderId,
    "folders": getFoldersList(targetFolderId).map(function (folderId) {
      return getIdListInFolder(folderId);
    }),
    "files": getFileList(targetFolderId)
  };
}

// Get a list of folder ids in an array.
function getFoldersList(targetFolderId) {
  var folders = DriveApp.getFolderById(targetFolderId).getFolders();
  var folderIds = [];
  while (folders.hasNext()) {
    var folder = folders.next();
    folderIds.push(folder.getId());
    if (!folders.hasNext()) {
      return folderIds;
    }
  }
  if (!folders.hasNext()) {
    return folderIds;
  }
}

// Get a list of file ids in an array.
function getFileList(targetFolderId) {
  var files = DriveApp.getFolderById(targetFolderId).getFiles();
  var fileIds = [];
  while (files.hasNext()) {
    var file = files.next();
    fileIds.push(file.getId());
    if (!files.hasNext()) {
      return fileIds;
    }
  }
  if (!files.hasNext()) {
    return fileIds;
  }
}

function createFolder(fromFolderId, folderName) {
  try {
    return DriveApp.getFolderById(fromFolderId).createFolder(folderName);
  } catch (err) {
    Logger.log(err);
    return false;
  }
}