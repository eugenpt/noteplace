
function save (node = null, save_ids = true) {
  // save node state to localStorage.
  //  if node === null, saves all nodes
  //  if node == 'ids', saves ids
  // additional argument:
  //  save_ids [bool] : true => save ids too
  var nodes2save = [node];
  if (node === null) {
    nodes2save = _NODES;
    save_ids = true;
  } else if ( typeof(node) === 'string'){
    if (node === 'ids') {
      save_ids = true;
      nodes2save = [];
    }
  } else if (Array.isArray(node)) {
    nodes2save = node;
    save_ids = true;
  }
  
  nodes2save.forEach( (node) => {
    if (isString(node)) {
      node = idNode(node);
    }
    if (isDom(node)) {
      node = domNode(node);
    }
    if (isNode(node)) {
      localStorage[getNodeLocalStorageKey(node)] = JSON.stringify(stripNode(node));
    } else {
      log(node);
      throw Error('What did you aim for, calling save('+node+') ??');
    }
  })
  
  if (save_ids) {
    localStorage['noteplace.node_ids'] = JSON.stringify(
      _NODES.map((node) => node.id)
    );
  }
  localStorage['noteplace.places'] = JSON.stringify(
    stripPlace(_PLACES)
  );

  localStorage['noteplace.history'] = JSON.stringify( _HISTORY );
  localStorage['noteplace.history_current'] = _HISTORY_CURRENT_ID;

  const tsize = _localStorage.getSize() / (1024 * 1024);
  if (tsize > 4) {
    console.error('localStorage ' + tsize.toFixed(3) + ' MB, limit is 5. you know what to do.');
  }
}

function removeNodeFromLocalStorage(node){
  localStorage.removeItem(getNodeLocalStorageKey(node));
}


_localStorage = {
  save:save,
  node_ids_key: 'noteplace.node_ids',
  nodeIDs:{
    save: function() {
        localStorage[_localStorage.node_ids_key] = JSON.stringify(
          _NODES.map((node) => node.id)
        )
    },
    load: function() {
        return localStorage[_localStorage.node_ids_key];
    },
  },
  getSize: function localStorageSize (verbose=false) {
    let _lsTotal = 0;
    let _xLen = 0;
    let _x = 0;
    for (_x in localStorage) {
      if (!localStorage.hasOwnProperty(_x)) {
        continue
      }
      _xLen = ((localStorage[_x].length + _x.length) * 2);
      _lsTotal += _xLen;
      if (verbose) {
        console.log(_x.substr(0, 50) + ' = ' + (_xLen / 1024).toFixed(2) + ' KB');
      }
    }
    if (verbose) {
      console.log('Total = ' + (_lsTotal / 1024).toFixed(2) + ' KB');
    }
    return _lsTotal;
  }

}


