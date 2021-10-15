


_localStorage = {
  nodeIDs:{
    save: function() {
        localStorage[_localStorage.keys.node_ids] = JSON.stringify(
          _NODES.map((node) => node.id)
        )
    },
    load: function() {
        return JSON.parse(localStorage[_localStorage.keys.node_ids]);
    },
  },
  keys:{
    node_ids: 'noteplace.node_ids',
    node: {
      byId: function getNodeIdLocalStorageKey(node_id){
        return  'noteplace.node_' + node_id
      },
      byNode: function getNodeLocalStorageKey(node){
        return _localStorage.keys.node.byId(node.id)
      },
      byDom: function getNodeDomLocalStorageKey(dom) {
        // but shouldnt it be _localStorage.keys.node.byNode(domNode(dom)) ?
        return 'noteplace.' + dom.id;
      },
    }
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
  },
  removeNode: function removeNodeFromLocalStorage(node){
    localStorage.removeItem(_localStorage.getNodeKey(node));
  },
  node:{
    save: function saveNode(node){
      if (isString(node)) {
        node = idNode(node);
      }
      if (isDom(node)) {
        node = domNode(node);
      }
      if (isNode(node)) {
        localStorage[_localStorage.keys.node.byNode(node)] = JSON.stringify(stripNode(node));
      } else {
        log(node);
        throw Error('What did you aim for, calling save('+node+') ??');
      }
    },
    load: function loadNodeById(id){
      return JSON.parse(localStorage[_localStorage.keys.node.byId(id)]);
    },
  },
  
  save: function save (node = null, save_ids = true) {
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
    
    nodes2save.forEach(_localStorage.node.save)
    
    if (save_ids) {
      _localStorage.nodeIDs.save()
    }
    
    _localStorage.places.save();
    
    localStorage['noteplace.history'] = JSON.stringify( _HISTORY );
    localStorage['noteplace.history_current'] = _HISTORY_CURRENT_ID;
  
    const tsize = _localStorage.getSize() / (1024 * 1024);
    if (tsize > 4) {
      console.error('localStorage ' + tsize.toFixed(3) + ' MB, limit is 5. you know what to do.');
    }
  },
  
  places_key:'noteplace.places',
  places:{
    save: function(){
      localStorage['noteplace.places'] = JSON.stringify(
        stripPlace(_PLACES)
      );
    },
    load: function(){
      return JSON.parse(localStorage[places_key]);
    }
  },

}


