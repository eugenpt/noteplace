/*

  properties of a history object:

  id : unique identifier, generates via newHistID
  type
    A : ADD
    D : DELETE
    M : MOVE, ?
    E : EDIT, ?

  state: {T:T,S:S} of a view where it happened

  timestamp: timestamp of that action

  node_ids: ids of node objects under said action in history

  oldValues : for MOVE and EDIT events old values of specified parameters
              ( are stored in _HISTORY )
  newValues : for reverting aand going forward again

  nodes : for Actions, nodes to be created

  newValues : for Actions, new Values of MOVE/EDIT events
    (get converted to _HISTORY notation of oldValues via processAction)

*/

const btnUndo = _('#btnUndo');
const btnRedo = _('#btnRedo');

let _HISTORY = null;
let _HISTORY_Map = new Map();
let _HISTORY_j_Map = new Map();
let _HISTORY_CURRENT_ID = null; // ID of the last applied history action

function genHistIDMap () {
  _HISTORY_Map = new Map(_HISTORY.map(h => [h.id, h]));
  _HISTORY_Map.set(null, null);
  _HISTORY_j_Map = new Map([...Array(_HISTORY.length).keys()].map(j => [_HISTORY[j].id, j]));
  _HISTORY_j_Map.set(null, -1);
}

function getHistory (id) {
  return _HISTORY_Map.get(id);
}

function lastHistoryID () {
  return _HISTORY.length > 0 ? _HISTORY[_HISTORY.length - 1].id:null;
}

function newHistID (id = null) {
  return newID(id || 'h', getHistory);
}

function processAction (A) {
  // h = resulting history event
  const h = { type: A.type };
  switch (h.type) {
    case 'A':
      // ADD
      let doms = [];
      if('node_ids' in A){
        // just de-delete them, ok?
        h.node_ids = A.node_ids.slice();

        h.node_ids.forEach( id => {
          idNode(id).deleted = false;
        })
      }else{
        h.node_ids = A.nodes.map(function (node) {
          doms.push(newNode(node, false));
          return node.id;
        });
      }
      // selectNode(doms);
      break;
    case 'D':
      // delete
      h.node_ids = A.node_ids.slice();
      h.node_ids.forEach(n_id => {
        idNode(n_id).deleted = true;
      });
      break;
    case 'M':
      // move and edit are basically the same
    case 'E':
      // edit
      h.node_ids = A.node_ids.slice();
      h.oldValues = [];
      // h.newValues = [];
      let anythingChanged = false;
      for (let j = 0; j < h.node_ids.length; j++) {
        const tnode = idNode(h.node_ids[j]);
        const oldValues = {};
        const newValues = {};
        Object.keys(A.newValues[j]).forEach(prop => {
          newValues[prop] = A.newValues[j][prop];
          if(prop.indexOf('.')>0){
            oldValues[prop] = ('oldValues' in A)?A.oldValues[j][prop]:dotProp(tnode,prop);
            setDotProp(tnode, prop, newValues[prop]);

          }else{
            oldValues[prop] = ('oldValues' in A)?A.oldValues[j][prop]:tnode[prop];
            tnode[prop] = newValues[prop];
          }
          if(oldValues[prop] != newValues[prop]){
            anythingChanged = true;
          }
        });
        h.oldValues.push(oldValues);
        // h.newValues.push(newValues);
      }
      if(!anythingChanged){
        return null;
      }
      if (h.type === 'E'){
        // really redraw nodes
        h.node_ids.forEach( id => { newNode(idNode(id).node); } );
      }
      break;
    default:
      throw Error('revertHistory error: What type of history is [' + h.type + '] ??!');
      break;
  }
  return h;
}

function applyAction (A) {
  /*
   *  Applies Action A and saves it in _HISTORY
   *
   *
   */
  log('applyAction');
  log(JSON.stringify(A));

  // if we are not at the end of _HISTORY, clear all after
  if (_HISTORY_CURRENT_ID !== lastHistoryID()) {
    _HISTORY = _HISTORY.slice(0, _HISTORY_j_Map.get(_HISTORY_CURRENT_ID) + 1);
  }

  // do the actual thing, make proper _HISTORY event
  const h = processAction(A);
  if(h !== null){
    redraw();

    //
    h.id = newHistID();
    h.timestamp = now();
    // TODO: probably calculate state based on action itself?
    h.state = currentState();

    // add to _HISTORY and to indices
    _HISTORY.push(h);
    _HISTORY_CURRENT_ID = h.id;
    _HISTORY_Map.set(h.id, h);
    _HISTORY_j_Map.set(h.id, _HISTORY.length - 1);

    // save?
    save(h.node_ids);

    updateUndoRedoEnabled();
  }else{
    // nothing changed!
    log('no changes')
  }
}

function revertHistory (id) {
  /*
   *
   *  Reverts back specified history object
   *   situation is supposed to be congruent with history
   *
   */

  // get history object
  const h = id.hasOwnProperty('id') ? id:_HISTORY_Map.get(id);

  switch (h.type) {
    case 'A':
      // ADD
      //  => delete
      h.node_ids.forEach(n_id => {
        idNode(n_id).deleted = true;
      });
      break;
    case 'D':
      // delete
      //  => un-delete ;)
      h.node_ids.forEach(n_id => {
        idNode(n_id).deleted = false;
      });
      break;
    case 'M':
      // move
      for (let j = 0; j < h.node_ids.length; j++) {
        const tnode = idNode(h.node_ids[j]);
        tnode.x = h.oldValues[j].x;
        tnode.y = h.oldValues[j].y;
      }
      break;
    case 'E':
      // edit
      log('reverting EDIT');
      h.newValues = [];
      for (let j = 0; j < h.node_ids.length; j++) {
        const tnode = idNode(h.node_ids[j]);
        const newValues = {};
        log(' node ' + idNode(h.node_ids[j]).id);
        for (let prop of Object.keys(h.oldValues[j])) {
          log(' prop ' + prop);
          if(prop.indexOf('.')>0){
            // like style.color
            newValues[prop] = dotProp(tnode,prop);
            setDotProp(tnode, prop, h.oldValues[j][prop]);
          }else{
            newValues[prop] = tnode[prop];
            tnode[prop] = h.oldValues[j][prop];
          }
          log(' -> ' + newValues[prop]);
        }
        h.newValues.push(newValues);
      }
      // sometimes an Update just won't cut it
      h.node_ids.forEach( id => { newNode(idNode(id).node); } );
      break;
    default:
      throw Error('revertHistory error: What type of history is [' + h.type + '] ??!');
      break;
  }
}

function goBackInHistory () {
  log('goBackInHstory');

  let nowj = _HISTORY_j_Map.get(_HISTORY_CURRENT_ID);
  log('current nowj=' + nowj);
  if (nowj === -1) {
    // before the first one : impossible!
    return 0;
  }

  revertHistory(_HISTORY[nowj]);

  gotoState(_HISTORY[nowj].state);

  nowj--;
  _HISTORY_CURRENT_ID = nowj >= 0 ? _HISTORY[nowj].id:null;
  log('nowj=' + nowj);
  log('_HISTORY_CURRENT_ID=' + _HISTORY_CURRENT_ID);
}

function goForwardInHistory () {
  log('goForwardInHistory');

  let nowj = _HISTORY_j_Map.get(_HISTORY_CURRENT_ID);
  log('current nowj=' + nowj);
  if (nowj === _HISTORY.length - 1) {
    // after the last one : impossible!
    return 0;
  }

  nowj++;
  processAction(_HISTORY[nowj]);

  gotoState(_HISTORY[nowj].state);

  _HISTORY_CURRENT_ID = _HISTORY[nowj].id;
  log('nowj=' + nowj);
  log('_HISTORY_CURRENT_ID=' + _HISTORY_CURRENT_ID);
}

//  :::::::: ::::::::::: :::     ::::::::: ::::::::::: :::    ::: :::::::::
// :+:    :+:    :+:   :+: :+:   :+:    :+:    :+:     :+:    :+: :+:    :+:
// +:+           +:+  +:+   +:+  +:+    +:+    +:+     +:+    +:+ +:+    +:+
// +#++:++#++    +#+ +#++:++#++: +#++:++#:     +#+     +#+    +:+ +#++:++#+
//        +#+    +#+ +#+     +#+ +#+    +#+    +#+     +#+    +#+ +#+
// #+#    #+#    #+# #+#     #+# #+#    #+#    #+#     #+#    #+# #+#
//  ########     ### ###     ### ###    ###    ###      ########  ###

if (localStorage['noteplace.history'] !== undefined) {
  try {
    _HISTORY = JSON.parse(localStorage['noteplace.history']);
  }catch (e) {
    _HISTORY = null;
  }
}

_HISTORY = _HISTORY || [
  { id: '0', type: 'A', state: { T: [0, 0], S: 1 }, timestamp: 1620040025793, node_ids: ['0', '1'] },
  { id: '1', type: 'D', state: { T: [0, 0], S: 1 }, timestamp: 1620040305793, node_ids: ['1'] },
  { id: '2', type: 'M', state: { T: [0, 0], S: 1 }, timestamp: 1620044005793, node_ids: ['0'], oldValues: [{ x: -100, y: -100 }] },
  { id: '3', type: 'E', state: { T: [-200, -200], S: 0.6 }, timestamp: 1620050025793, node_ids: ['0'], oldValues: [{ rotate: -0.3 }] }
];

genHistIDMap();

if (localStorage['noteplace.history_current'] !== undefined) {
  if (getHistory(localStorage['noteplace.history_current'])) {
    _HISTORY_CURRENT_ID = localStorage['noteplace.history_current'];
  }else {
    _HISTORY_CURRENT_ID = null;
  }
}
_HISTORY_CURRENT_ID = _HISTORY_CURRENT_ID || lastHistoryID();

function updateUndoRedoEnabled(){
  btnUndo.disabled = (_HISTORY_CURRENT_ID === null);
  btnRedo.disabled = (_HISTORY_CURRENT_ID === lastHistoryID());
}

btnUndo.onclick = function(e) {
  goBackInHistory();
  updateUndoRedoEnabled();
  e.stopPropagation();

}

btnRedo.onclick = function(e) {
  goForwardInHistory();
  updateUndoRedoEnabled();
}
