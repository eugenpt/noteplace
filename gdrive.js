var CLIENT_ID = '389896466198-ddtgdva4g6in7plssve78g44n9fhsp79.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCZvopRVLVjU2CZokOGT_oyx-KK_ZF6cJg';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
//   var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
//   var SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';
var SCOPES = 'https://www.googleapis.com/auth/drive.appdata'

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
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
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listFiles(function(fs){console.log(fs);});
    $('.authorize-only').css('display','')
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    $('.authorize-only').css('display','none');
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  console.log(message);
  // var pre = document.getElementById('content');
  // var textContent = document.createTextNode(message + '\n');
  // pre.appendChild(textContent);
}

/**
 * Print files.
 */
function listFiles(filesFun, errorFun) {
  gapi.client.drive.files.list({
      'spaces': 'appDataFolder',
      // 'q':"'appDataFolder' in parents",
    // 'pageSize': 10,
    'fields': "files(id, name, parents,createdTime,modifiedTime)"
  }).then(function(response) {
    var files = response.result.files;
    filesFun(files);
  });
}

function createFolder(name, parents=null){
    if(parents==null){
      parents = ['appDataFolder'];
    }
  gapi.client.drive.files.create({
      'resource': {
          'name':name,
          'parents':parents,
          'mimeType': 'application/vnd.google-apps.folder'
      },
      'fields': 'id'
      }).then(function (err, file) {
      if (err) {
          // Handle error
          console.error(err);
      } else {
          console.log('Folder Id: ', file.id);
      }
  });
}

function getFileContent(fileId, resultFun){
  gapi.client.drive.files.get({
      fileId:fileId,
      alt:'media'
  }).then(resultFun);          
}

// https://gist.github.com/tanaikech/bd53b366aedef70e35a35f449c51eced
// 
function uploadFile(name, content){
  var fileContent = 'sample text'; // As a sample, upload a text file.
  var file = new Blob([JSON.stringify(content)], {type: 'application/json'});
  var metadata = {
      'name': name, // Filename at Google Drive
      'mimeType': 'application/json', // mimeType at Google Drive
      'parents': ['appDataFolder'], // Folder ID at Google Drive
  };
  

  var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
  var form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
      method: 'POST',
      headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
      body: form,
  }).then((res) => {
      return res.json();
  }).then(function(val) {
      console.log(val);
  });          
}

