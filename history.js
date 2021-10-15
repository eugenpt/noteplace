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
const btnHistoryStatus = _('#btnHistoryStatus');
const historyContainer = _('#historyContainer');

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
  return _HISTORY.length > 0 ? _HISTORY[_HISTORY.length - 1].id : null;
}

function newHistID (id = null) {
  return newID(id || 'h', getHistory);
}

function getAllHistoryProps(h){
  const R = [];
  h.oldValues.forEach( vs => {
    Object.keys(vs).forEach( prop => {
      R.push(prop);
    })
  })
  return R;
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
      const allProps = [];
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

          allProps.push(prop);
        });
        h.oldValues.push(oldValues);
        // h.newValues.push(newValues);
      }
      if (h.type === 'E'){
        // really redraw nodes
        h.node_ids.forEach( id => { newNode(idNode(id).node, false); } );
      }

      if(!anythingChanged){
        return null;
      }

      if (_HISTORY.length > 0) {
        const lh = _HISTORY[_HISTORY.length - 1];

        if (lh.type == h.type) {
          if (h.node_ids.length == lh.node_ids.length) {
            if(equalSetsOfItems(h.node_ids, lh.node_ids)) {
              if (equalSetsOfItems(allProps, getAllHistoryProps(lh))) {
                // same action basically,
                //  +old Values stay the same, new ones - already applied.
                return null;
              }
            }
          }
        }
      }


      break;
    default:
      throw Error('processAction error: What type of history is [' + h.type + '] ??!');
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

    fillHistoryList();

    updateUndoRedoEnabled();
  }else{
    // nothing changed!
    log('no changes')
  }

  return h;
}

function revertHistory (id) {
  /*
   *
   *  Reverts back specified history object
   *   situation is supposed to be congruent with history
   *
   */

  // get history object
  let h = id.hasOwnProperty('id') ? id:_HISTORY_Map.get(id);

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

function clearAllHistory() {
  _HISTORY = [];
  _HISTORY_CURRENT_ID = null;
  // delete the deleted nodes ;)
  _NODES = _NODES.filter(n => ((!('deleted' in n)) || (n.deleted == false)))

  genHistIDMap();
  fillHistoryList();
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
  // { id: '0', type: 'A', state: { T: [0, 0], S: 1 }, timestamp: 1620040025793, node_ids: ['0', '1'] },
  // { id: '1', type: 'D', state: { T: [0, 0], S: 1 }, timestamp: 1620040305793, node_ids: ['1'] },
  // { id: '2', type: 'M', state: { T: [0, 0], S: 1 }, timestamp: 1620044005793, node_ids: ['0'], oldValues: [{ x: -100, y: -100 }] },
  // { id: '3', type: 'E', state: { T: [-200, -200], S: 0.6 }, timestamp: 1620050025793, node_ids: ['0'], oldValues: [{ rotate: -0.3 }] }
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
  fillHistoryList();  
}

btnRedo.onclick = function(e) {
  goForwardInHistory();
  updateUndoRedoEnabled();
  fillHistoryList();  
}

function fillHistoryList () {
  console.log("idNode");
  console.log(idNode);
  historyContainer.innerHTML = '';

  const nowDate = new Date();
  for( let j=_HISTORY.length-1 ; j>=0 ; j-- ){
    const h = _HISTORY[j];

    const date = new Date(h.timestamp);

    const isToday = nowDate.toLocaleDateString() == date.toLocaleDateString();
    // no need for date if it was today
    let datestr = isToday ? date.toLocaleTimeString() : date.toLocaleString();    
    datestr = datestr.replaceAll(' ','&nbsp');

    let actionStr = '';

    if (h.type === 'A') {
      actionStr = '<i class="bi-file-earmark-plus" title="Added"></i>';
    }else if(h.type === 'D'){
      actionStr = '<i class="bi-file-earmark-x" title="Deleted"></i>';
    }else if(h.type === 'M'){
      actionStr = '<i class="bi-arrows-move" title="Moved"></i>';
    }else if(h.type === 'E'){
      actionStr = '<i class="bi-pencil" title="Edited"></i>';
    }
  
    let nodeStr = '';
    if(h.node_ids.length > 1) {
      nodeStr =  h.node_ids.length + ' node' + (h.node_ids.length>1?'s':'') ;
    } else {
      var temp =  idNode(h.node_ids[0]);
      if(temp) {
        nodeStr = temp.text.split('\n')[0];
      }else{
        nodeStr = '???';
        console.error('No node with id=',h.node_ids[0])
      }
    }

    let allstr = datestr + ' ' + actionStr + ' ' + nodeStr;

    const nodePreview = _ce('div'
      ,'className', 'np-h-r-c'
      ,'innerHTML', allstr
    )

    const row = _ce('div'
      ,'className','row btn btn-outline-' + ( h.id == _HISTORY_CURRENT_ID ? 'primary' : 'secondary')
      ,'onmouseenter', function (e) {
        const _h_id = this.dataset['histodyID'];
        previewState(getHistory(_h_id).state);
      }
      ,'onmouseleave', function (e) {
        exitPreview();
      }
      ,'onclick', function (e) {
        const _h_id = this.dataset['histodyID'];
        const clickJ = _HISTORY_j_Map.get(_h_id);
        const nowJ = _HISTORY_j_Map.get(_HISTORY_CURRENT_ID);

        let goBtn = btnUndo;
        if(nowJ < clickJ){
          goBtn = btnRedo;
        }

        while(_HISTORY_CURRENT_ID !== _h_id){
          goBtn.click();
        }
      }
    );
    row.dataset['histodyID'] = h.id;

    row.appendChild(nodePreview);
    // log(allstr);

    historyContainer.appendChild(row);
  }

  // start row

  const row = _ce('div'
    ,'className','row btn btn-outline-' + ( null == _HISTORY_CURRENT_ID ? 'primary' : 'secondary')
    ,'innerHTML','T = 0 , all STARTED'
    ,'onmouseenter', function (e) {
      _HISTORY.length > 0 ?  previewState(_HISTORY[0].state) : '';
    }
    ,'onmouseleave', function (e) {
      _HISTORY.length > 0 ?  exitPreview() : '';
    }
    ,'onclick', function (e) {
      while(_HISTORY_CURRENT_ID !== null){
        btnUndo.click();
      }
    }
  );
  historyContainer.appendChild(row);

  // history status : how many changes, when it all started, ..

  let html = '<i class="bi-calendar2"></i>';
  let title = 'No history';
  if(_HISTORY.length > 0) {
    let sameDay = false;
    if( (new Date(_HISTORY[0].timestamp)).toLocaleDateString
        == (new Date()).toLocaleDateString ) {
      // same day
      sameDay = true;
      html = '<i class="bi-calendar2-event"></i>';
    } else if ( ( now() - _HISTORY[0].timestamp ) < 24 * 3600 * 7 * 1000 ) {
      // same week
      html = '<i class="bi-calendar2-week"></i>';
    } else {
      html = '<i class="bi-calendar2-minus"></i>';
    }
    const firstDate = (new Date(_HISTORY[0].timestamp));
    const lastHistDate = new Date(_HISTORY[_HISTORY.length - 1].timestamp);

    title = _HISTORY.length + ' event'
      + ( (_HISTORY.length > 1) ? 's' : '')
      + ', ' + ( sameDay 
                  ? firstDate.toLocaleDateString() + ', from ' + firstDate.toLocaleTimeString()
                  : 'from ' + firstDate.toLocaleString()
              )
      + ' to ' + ( sameDay ? lastHistDate.toLocaleTimeString() : lastHistDate.toLocaleString() )
  }
  
  btnHistoryStatus.innerHTML = html;
  btnHistoryStatus.title = title;
}

_('#btnHistoryClear').onclick = function () {
  showModalYesNo(
    'Really?',
    'Are you sure you want to delete all <b>History</b>?',
    function () {
      clearAllHistory();
    }
  )
}
