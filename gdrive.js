const CLIENT_ID = '389896466198-ddtgdva4g6in7plssve78g44n9fhsp79.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCZvopRVLVjU2CZokOGT_oyx-KK_ZF6cJg';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
//   var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
//   var SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

const authorizeButton = document.getElementById('authorize_button');
const signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad () {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient () {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function (error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus (isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listFiles(function (fs) {
      console.log(fs);
    });
    $('.authorize-only').css('display', '');
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    $('.authorize-only').css('display', 'none');
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick (event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick (event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre (message) {
  console.log(message);
  // var pre = document.getElementById('content');
  // var textContent = document.createTextNode(message + '\n');
  // pre.appendChild(textContent);
}

/**
 * Print files.
 */
function listFiles (filesFun, errorFun) {
  gapi.client.drive.files.list({
    spaces: 'appDataFolder',
    // 'q':"'appDataFolder' in parents",
    // 'pageSize': 10,
    fields: 'files(id, name, parents,createdTime,modifiedTime)'
  }).then(function (response) {
    filesFun(response.result.files);
  });
}

function createFolder (name, parents = null) {
  if (parents === null) {
    parents = ['appDataFolder'];
  }
  gapi.client.drive.files.create({
    resource: {
      name: name,
      parents: parents,
      mimeType: 'application/vnd.google-apps.folder'
    },
    fields: 'id'
  }).then(function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('Folder Id: ', file.id);
    }
  });
}

function getFileContent (fileId, resultFun) {
  gapi.client.drive.files.get({
    fileId: fileId,
    alt: 'media'
  }).then(resultFun);
}

// https://gist.github.com/tanaikech/bd53b366aedef70e35a35f449c51eced
function uploadFile (name, content) {
  const file = new Blob([JSON.stringify(content)], { type: 'application/json' });
  const metadata = {
    name: name, // Filename at Google Drive
    mimeType: 'application/json', // mimeType at Google Drive
    parents: ['appDataFolder'] // Folder ID at Google Drive
  };
  const accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    method: 'POST',
    headers: new Headers({ Authorization: 'Bearer ' + accessToken }),
    body: form
  })
  // .then((res) => {
  //   return res.json();
  // }).then(function (val) {
  //   console.log(val);
  // });
}

// :::        ::::::::   ::::::::      :::     :::
// :+:       :+:    :+: :+:    :+:   :+: :+:   :+:
// +:+       +:+    +:+ +:+         +:+   +:+  +:+
// +#+       +#+    +:+ +#+        +#++:++#++: +#+
// +#+       +#+    +#+ +#+        +#+     +#+ +#+
// #+#       #+#    #+# #+#    #+# #+#     #+# #+#
// ########## ########   ########  ###     ### ##########

let __GDRIVE_saveFilename = null;
let __GDRIVE_savedID = null;
let __files = new Map();
let __files_allInfo = new Map();

function fillFilesList (rowClickFun) {
  listFiles(function (files) {
    __files = new Map();
    __files_allInfo = new Map();
    files.forEach((file) => {
      __files.set(file.name, file.id);
      __files_allInfo.set(file.name, file)
      console.log(file);

      const row = document.createElement('div');
      row.className = 'row my-1';
      row.dataset.fileId = file.id;
      row.dataset.name = file.name;

      const col_name = document.createElement('div');
      col_name.className = 'col-10 btn  btn-outline-secondary';
      col_name.innerText = file.name;
      col_name.onclick = (function (_row) {
        console.log('row click');
        return function(){rowClickFun(_row);
      }}(row));

      let col_del = document.createElement('div');
      col_del.className = 'col';
      let del_btn = document.createElement('div');
      del_btn.className = 'btn btn-danger align-self-end';
      del_btn.innerHTML = '⌫';
      del_btn.title = 'delete ' + file.name;
      del_btn.onclick = (function (_row) {
        return function () {
          _('#modalYesNoLabel').innerHTML = 'Delete?';
          _('#modalYesNoBody').innerHTML = 'Really delete <b>' + _row.dataset.name + '</b>?';
          _('#modalYesNo-Yes').onclick = function () {
            gapi.client.drive.files.delete({
              fileId: _row.dataset.fileId
            }).then(function (a) {
              console.log(a);
              if (a.status === 204) {
                _row.remove();
                __files.delete(_row.dataset.name);
              }
            });
          };
          $('#modalYesNo').modal('show');
        };
      })(row);
      col_del.appendChild(del_btn);

      row.appendChild(col_name);
      row.appendChild(col_del);

      _('#modal-list').appendChild(row);
    });
  });
}

_('#load_gdrive').addEventListener('click', function () {
  console.log('GDrive load..');

  _('#modal-input').value = '';
  _('#modal-input').oninput = function () {
    if (__files.has(_('#modal-input').value)) {
      _('#modal-save').style.display = '';
    } else {
      _('#modal-save').style.display = 'none';
    }
  };

  _('#modal-list').innerHTML = '';
  _('#exampleModalLabel').innerHTML = 'Load from Google Drive file:';
  _('#modal-save').innerHTML = 'Save';
  _('#modal-save').style.display = 'none';

  fillFilesList((row) => {
    console.log(row);
    loadFromGDriveFile(row.dataset.name, row.dataset.fileId);
  });
});

function loadFromGDriveFile(name, fileId){
  if(fileId==undefined){
    fileId = __files.get(name);
  }
  getFileContent(fileId, function (e) {
    if (e.status === 200) {
      // file loaded OK, load nodes'n'stuff
      loadFromG(JSON.parse(e.result));
      // only hide on OK load
      $('#exampleModal').modal('hide');
      // save Filename for faster save
      __GDRIVE_saveFilename = name;
      __GDRIVE_savedID = fileId;
    }else {
      alert('error.. ' + e);
      console.log(e);
    }
  });
}

function saveToGDrive (filename) {
  uploadFile(
    filename,
    JSON.stringify(saveToG())
  ).then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log('Saved to GDRIVE');
    // TODO: simple mobile-like notification
    console.log(data);
    __GDRIVE_savedID = data.id;
    localStorage.getItem('__GDRIVE_savedID') = __GDRIVE_savedID;
  });
  // save filename
  __GDRIVE_saveFilename = filename;
  localStorage.getItem('__GDRIVE_saveFilename') = __GDRIVE_saveFilename;
}

function gdriveRewrite(filename, id){
  // I was not able to rewrite file content
  //  , so I will just delete and save
  gapi.client.drive.files.delete({
    fileId: id
  }).then(function (a) {
    if (a.status == 204) {
      // Now save
      saveToGDrive(filename);
      $('#exampleModal').modal('hide');
      toast(filename + ' successfully written to GDrive');
    } else {
      console.log(a);
      alert('Error while rewriting...');
    }
  });
}

_('#saveas_gdrive').addEventListener('click', function () {
  console.log('GDrive save as..');

  _('#modal-input').value = __GDRIVE_saveFilename || defaultFilename();
  _('#modal-input').oninput = function () {};
  _('#modal-save').style.display = '';
  _('#exampleModalLabel').innerHTML = 'Save to Google Drive file:';
  _('#modal-save').innerHTML = 'Save';
  _('#modal-list').innerHTML = '';

  _('#modal-save').onclick = function () {
    saveToGDrive(_('#modal-input').value);
  };

  fillFilesList((_row) => {
    showModalYesNo(
      'Overwrite?',
      'Really Overwrite <b>' + _row.dataset.name + '</b>?',
      function () {
        gdriveRewrite(_row.dataset.name, _row.dataset.fileId);
      });
  });
}, false);

_('#save_gdrive').addEventListener('click', function () {
  console.log('GDrive save..');

  if ( __GDRIVE_savedID !== null ) {
    gdriveRewrite(__GDRIVE_saveFilename, __GDRIVE_savedID);
  } else {
    _('#saveas_gdrive').click();
  }

}, false);




__GDRIVE_saveFilename = localStorage.getItem('__GDRIVE_saveFilename');
__GDRIVE_savedID = localStorage.getItem('__GDRIVE_savedID');

if(__GDRIVE_saveFilename){
  
  listFiles((files) => {
    for(var file of files){
      if(file.name == __GDRIVE_saveFilename){
        if(file.id == __GDRIVE_savedID){

        } else {
          showModalYesNo(
            'Load from Google?',
            'Looks like you have worked on <b>' + __GDRIVE_saveFilename + '</b> GDrive file, but its version on Google is different from yours, load from Google (It will overwrite local changes)?',
            function () {
              loadFromGDriveFile(__GDRIVE_saveFilename, file.id)
            }
          );
        }
      }
    }
  })

}
