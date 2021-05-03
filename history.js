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

  nodes : for Actions, nodes to be created

  newValues : for Actions, new Values of MOVE/EDIT events
    (get converted to _HISTORY notation of oldValues via processAction)

*/

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
      h.node_ids = A.nodes.map(function (node) {
        doms.push(newNode(node, false));
        return node.id;
      });
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
      // move
      h.node_ids = A.node_ids.slice();
      h.oldValues = [];
      for (let j = 0; j < h.node_ids.length; j++) {
        const tnode = idNode(n_id);
        h.oldValues.push({ x: tnode.x, y: tnode.y });
        tnode.x = A.newValues[j].x;
        tnode.y = A.newValues[j].y;
      }
      break;
    case 'E':
      // edit
      h.node_ids = A.node_ids.slice();
      h.oldValues = [];
      for (let j = 0; j < h.node_ids.length; j++) {
        const tnode = idNode(n_id);
        const oldValues = {};
        Object.keys(A.newValues[j]).forEach(prop => {
          if (tnode[prop] != A.newValues[j][prop]) {
            oldValues[prop] = tnode[prop];
            tnode[prop] = A.newValues[j][prop];
          }
        });
        h.oldValues.push(oldValues);
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
    _HISTORY = _HISTORY.slice(0, _HISTORY_j_Map(_HISTORY_CURRENT_ID) + 1);
  }

  // do the actual thing, make proper _HISTORY event
  const h = processAction(A);
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
        const tnode = idNode(node_ids[j]);
        tnode.x = h.oldValues[j].x;
        tnode.y = h.oldValues[j].y;
      }
      break;
    case 'E':
      // edit
      log('reverting EDIT');
      for (let j = 0; j < h.node_ids.length; j++) {
        const tnode = idNode(node_ids[j]);
        log(' node ' + idNode(node_ids[j]).id);
        for (let prop of Object.keys(h.oldValues[j])) {
          log(' prop ' + prop);

          idNode(node_ids[j])[prop] = h.oldValues[j][prop];
          log(' -> ' + idNode(node_ids[j])[prop]);
        }
      }
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
