// :::::::::: ::::::::::: :::        :::::::::: ::::::::
// :+:            :+:     :+:        :+:       :+:    :+:
// +:+            +:+     +:+        +:+       +:+
// :#::+::#       +#+     +#+        +#++:++#  +#++:++#++
// +#+            +#+     +#+        +#+              +#+
// #+#            #+#     #+#        #+#       #+#    #+#
// ###        ########### ########## ########## ########

function defaultFilename () {
  return 'Noteplace_' + date2str(new Date()) + '.json';
}

// Start file download.
_('#save').addEventListener('click', function () {
  _('#modal-input').value = defaultFilename();
  _('#modal-save').style.display = '';
  _('#exampleModalLabel').innerHTML = 'Save to local file:';

  _('#modal-save').onclick = function () {
    download(
      _('#modal-input').value,
      JSON.stringify(saveToG())
    );
  };
  _('#modal-list').innerHTML = '';
}, false);

// save everything to a single object
function saveToG (add_history = true) {
  const G = {
    T: T,
    S: S,
    nodes: (
      add_history
        ? _NODES
        : _NODES.filter(node => !node.deleted)
    ).map(stripNode),
    places: stripPlace()
  };
  if (add_history) {
    G.history = _HISTORY;
    G.history_current_id = _HISTORY_CURRENT_ID;
  }
  return G;
}

_G = null;
// load everything from single object
function loadFromG (G) {
  console.log('Loading..');
  
  _G = G;

  T = [1 * G.T[0], 1 * G.T[1]];
  S = 1 * G.S;

  // delete _PLACES;
  if ('places' in G) {
    _PLACES = G.places;
  } else {
    _PLACES = _PLACES_default;
  }
  fillPlaces();

  // applyZoom([1*G.T[0],1*G.T[1]], 1*G.S);
  $('.node').remove();
  // delete _NODES;
  _NODES = [];
  gen_DOMId2nodej();

  G.nodes.map(stripNode).forEach(node => newNode(node, false, true));


  redraw();

  if ( 'history' in G ) {
    _HISTORY = G.history;
    if ( 'history_current_id' in G ){
      _HISTORY_CURRENT_ID = G.history_current_id;
    } else {
      _HISTORY_CURRENT_ID = lastHistoryID();
    }
    genHistIDMap();
    fillHistoryList();
  } else {
    clearAllHistory();
  }

  console.log('Loading complete, now ' + _NODES.length + ' nodes');
}

_('#file').oninput = function () {
  let fr = new FileReader();
  fr.onload = function () {
    console.log('Received file..');

    loadFromG(JSON.parse(fr.result));

    $('#file').value = '';
  };

  fr.readAsText(this.files[0]);
};


