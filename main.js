const md = new Remarkable('full', {
  html: true,
  typographer: true
});

// https://stackoverflow.com/a/17111220/2624911
let dragInitiated = false;

// Translate and Scale parameters
let T = [0, 0];
let S = 1;

let BODY = document.getElementsByTagName('body')[0];
let M = 0;

let _NODES = [];
let _DOMId2node = new Map();
let _NODEId2node = new Map();

const zoomMax = 1e14;
const zoomMin = 1e-15;

const zoomK = 1.6;

const container = _('#container');
const node_container = _('#node_container');

let _selected_DOM = [];

let width = (window.innerWidth || document.documentElement.clientWidth || BODY.clientWidth);
let height = window.innerHeight || document.documentElement.clientHeight || BODY.clientHeight;

let resizeWatchTimeout = null;
window.addEventListener('resize', function (event) {
  // do stuff here
  clearTimeout(resizeWatchTimeout);
  resizeWatchTimeout = setTimeout(function () {
    width = (window.innerWidth || document.documentElement.clientWidth || BODY.clientWidth);
    height = window.innerHeight || document.documentElement.clientHeight || BODY.clientHeight;

    // filterNodes2Draw();
    // redraw();
  }, 500); // run update only every 100ms
});

// yeah, I don't like limits, but..
//  without proper custom infinitely precise numbers
//   this is what I can do with js
//
// Which seems OK, 26 orders of magnitude..
//  is ~ the size of observable universe in meters
//
//   I know, I know, it would've been
//     way cooler if it was ~ size(universe)/size(atom nucleus)
//       which is.. ~ 10^26/(10^-15) ~ 10^41

let mousePos = [0, 0];
let _mousePos = [0, 0];

container.ondblclick = function (e) {
  console.log('dblclick on empty field at [' + e.clientX + ',' + e.clientY + ']');
  console.log('T=' + T + ' S=' + S);
  applyAction({
    type: 'A',
    nodes: [
      { text: 'test' + _NODES.length }
    ]
  });
  // console.log(e);
  // let id = newNodeID();
  // let node = {
  //   id: id,
  //   x: e.clientX / S + T[0],
  //   y: e.clientY / S + T[1],
  //   fontSize: 20 / S,
  //   text: 'test' + id
  // };
  // newdom = newNode(node);
  // no dblclick zoom!
  e.preventDefault();
  e.stopPropagation();

  setTimeout(function () {
    onNodeDblClick(_NODES[_NODES.length - 1].node);
  }, 10);
};

function zoomInOut (inDegree, clientPos = null) {
  let centerX = 0;
  let centerY = 0;
  if (clientPos == null) {
    // basically - we pressed a +/- button
    if (_selected_DOM.length > 0) {
      // zoom to it!
      _selected_DOM.forEach((dom) => {
        centerX += domNode(dom).x;
        centerY += domNode(dom).y;
      });
      centerX /= _selected_DOM.length;
      centerY /= _selected_DOM.length;

      clientPos = [
        (centerX - T[0]) * S,
        (centerY - T[1]) * S
      ];
    } else {
      // just center
      clientPos = [width / 2, height / 2];
    }
  }
  mousePos = [T[0] + clientPos[0] / S, T[1] + clientPos[1] / S];
  S = Math.min(zoomMax, Math.max(zoomMin, S * Math.pow(zoomK, inDegree)));
  applyZoom(
    [mousePos[0] - clientPos[0] / S, mousePos[1] - clientPos[1] / S],
    S,
    true
  );
}

const wheelZoom_minInterval_ms = 10;

function onMouseWheel (e) {
  // console.log(e);
  e.preventDefault();
  e.stopPropagation();
  // console.log(e.deltaX, e.deltaY, e.deltaFactor);
  let hdelta = e.deltaY < 0 ? 1 : -1;
  if ((e.ctrlKey) && (_selected_DOM.length > 0)) {
    editFontSize(hdelta);
  }else {
    if (now() - onMouseWheel.lastZoom > wheelZoom_minInterval_ms) {
      if (e.ctrlKey) {
        hdelta = -e.deltaY / 10;
      }
      zoomInOut(hdelta, [e.clientX, e.clientY]);
      onMouseWheel.lastZoom = now();
    }
  }
}
onMouseWheel.lastZoom = null;

// $(container).on('mousewheel', onMouseWheel );
// _('#container').addEventListener("wheel", onMouseWheel);
// _('#node_container').addEventListener("wheel", onMouseWheel);

// $('#container').bind('mousewheel DOMMouseScroll', onMouseWheel);
// $('#container').scroll(onMouseWheel)

// safari?
// window.onwheel = onMouseWheel;
// window.addEventListener("wheel",onMouseWheel);
_('#wrapper').onwheel = onMouseWheel;

// Safari zoomes on pinch no matter what
// all of these do not work =(
window.addEventListener('gestureend', e => {
  console.log('gestureend');
  console.log(e);
  e.preventDefault();
});
window.addEventListener('gesturestart', e => {
  console.log('gesturestart');
  console.log(e);
  e.preventDefault();
});
window.addEventListener('gesturechange', e => {
  console.log('gesturechange');
  console.log(e);
  e.preventDefault();
});

function setTransitionDur (s) {
  $('.node').css('transition-duration', s + 's');
  $('#container img').css('transition-duration', s + 's');
  $('#container .ui-wrapper').css('transition-duration', s + 's');
}

let __previewOldState = { T: [0, 0], S: 1 };

function applyZoom (T_, S_, smooth = true, noTemp = false) {
  console.log('S=' + S + ' S_=' + S_);
  T = T_;

  const ds = 0.2 + Math.abs(Math.log10(S / S_));
  console.log('ds=' + ds);
  S = S_;

  if (smooth) {
    setTransitionDur(ds);
  }

  status({ T: T, S: S });

  redraw();

  if (noTemp) {
    __previewOldState = { T: T, S: S };
  }

  if (smooth) {
    clearTimeout(applyZoom.zoomResetTimeout);
    applyZoom.zoomResetTimeout = setTimeout(function () {
      setTransitionDur(0);
    }, 1000 * ds);
  }
}
applyZoom.zoomResetTimeout = null;
applyZoom.lastSmooth = false;

let _isMouseDown = false;
let _mouseDownPos = [0, 0];
let _mouseDownT = [0, 0];
let _isMouseDragging = false;
let _mouseDragStart = [0, 0];
let _mouseDragPos = [0, 0];

let _isDragSelecting = false;

let __nodeMouseDown = false;

let _dragSelected = [];

let __isResizing = false;

container.onmousedown = function (e) {
  console.log('container.onmousedown');
  console.log('T=' + T + ' S=' + S);
  // $('.node').css('transition-duration','0s');
  // $('.node').removeClass('zoom'); // disable visible transition
  if (__isResizing) {
    console.log('resizing..');
  } else {
    if (contentEditMouseDown) {
      contentEditMouseDown = false;
    } else {
      _mouseDownPos = [e.clientX, e.clientY];
      _mouseDownT = [T[0], T[1]];
      _isMouseDown = true;

      // console.log(e);
      // e.preventDefault();

      if (contentEditTextarea) {
        stopEditing();
      }
    }

    if (e.shiftKey) {
      _isDragSelecting = true;

      _('#select-box').style.display = 'block';
      _('#select-box').style.width = 0;
      _('#select-box').style.height = 0;
      _('#select-box').style.top = e.clientX + 'px';
      _('#select-box').style.left = e.clientY + 'px';
    } else {
      if (__nodeMouseDown) {
        // pass
      } else {
        selectNode(null);
      }
    }

    // if(_selected_DOM!==__nodeMouseDown){
    //   selectNode(null);
    // }
  }
};

window.addEventListener('mouseup', function (e) {
  console.log('window onmouseup');
  // console.log(e);
  console.log('T=' + T + ' S=' + S);

  __nodeMouseDown = null;

  if (_isMouseDragging) {
    // stop dragging
    const A = { type: 'M' }

    if (_selected_DOM.indexOf(_isMouseDragging.node) >= 0) {
      // moving all selected
      A.node_ids = _selected_DOM.map( dom => domNode(dom).id );
    } else {
      // moving just the one node
      A.node_ids = [ _isMouseDragging.id ];
    }
    A.oldValues = A.node_ids.map( id => idNode(id).startPos );
    A.newValues = A.node_ids.map( id => {
      const node = idNode(id);
      return { x: node.x, y: node.y}  
    });

    applyAction(A);
    // save(_isMouseDragging);

    _isMouseDragging = false;
  } else if (_isDragSelecting) {
    _('#select-box').style.display = 'none';
    _('#select-box').style.width = 0;
    _('#select-box').style.height = 0;
    _('#select-box').style.top = 0;
    _('#select-box').style.left = 0;

    _isDragSelecting = false;

    console.log('updating _dragSelected..');
    updateDragSelect();
    console.log('now ' + _dragSelected.length + ' _dragSelected');

    console.log('pushing _dragSelected doms to _selected_DOM');
    _dragSelected.forEach((node) => {
      console.log(node.node.id);
      _selected_DOM.push(node.node);
    });
    _dragSelected = [];
  } else if (_isMouseDown) {
    // stop moving
    T[0] = _mouseDownT[0] - 1 * node_container.dataset.x / S;
    T[1] = _mouseDownT[1] - 1 * node_container.dataset.y / S;

    node_container.dataset.x = 0;
    node_container.dataset.y = 0;

    node_container.style.left = 0;
    node_container.style.top = 0;

    replaceHistoryState();

    redraw();
  }

  // if(e.button==1){
  //   e.preventDefault();
  // }

  __isResizing = false;
  _isMouseDown = false;
});

function tempSelect (node) {
  if (_selected_DOM.indexOf(node.node) >= 0) {
    // already really selected
  } else {
    if (_dragSelected.indexOf(node) < 0) {
      node.node.classList.add('selected');

      _dragSelected.push(node);
    }
  }
}

function tempDeselect (node) {
  console.log('deselecting: ' + node.node.id);
  if (_selected_DOM.indexOf(node.node) >= 0) {
    // selected previously..
  } else {
    node.node.classList.remove('selected');
    _dragSelected.splice(_dragSelected.indexOf(node), 1);
  }
}

function updateDragSelect () {
  // so the function os not run two times simultaneously
  if (!('on' in updateDragSelect)) {
    updateDragSelect.on = true;
  } else {
    if (updateDragSelect.on) {
      setTimeout(updateDragSelect, 100);
      return 0;
    }
  }
  //
  _dragSelected.forEach((node) => {
    node.stillSelected = false;
  });
  _NODES.forEach((node) => {
    // if(node.vis){
    if (isNodeInClientBox(node,
      Math.min(_mousePos[0], _mouseDownPos[0]), Math.max(_mousePos[0], _mouseDownPos[0]),
      Math.min(_mousePos[1], _mouseDownPos[1]), Math.max(_mousePos[1], _mouseDownPos[1])
    )) {
      tempSelect(node);
      node.stillSelected = true;
    }
    // }
  });
  //
  _dragSelected.forEach((node) => {
    if (node.stillSelected === false) {
      tempDeselect(node);
    }
  });
  //
  updateDragSelect.on = false;
}

function isNodeInBox (node, bxMin, bxMax, byMin, byMax) {
  return isInBox(
    node.x, node.xMax, node.y, node.yMax,
    bxMin, bxMax, byMin, byMax
  );
}

function clientToNode (pos) {
  return [T[0] + pos[0] / S, T[1] + pos[1] / S];
}

function isNodeInClientBox (node, cbxMin, cbxMax, cbyMin, cbyMax) {
  const bMin = clientToNode([cbxMin, cbyMin]);
  const bMax = clientToNode([cbxMax, cbyMax]);
  return isInBox(
    node.x, node.xMax, node.y, node.yMax,
    bMin[0], bMax[0], bMin[1], bMax[1]
  );
}

container.onmousemove = function (e) {
  _mousePos = [e.clientX, e.clientY];
  if (_isMouseDown) {
    if (_isMouseDragging) {
      if (_isMouseDragging.node.classList.contains('selected')) {
        // move all selected
        _selected_DOM.forEach(function (dom) {
          const node = _DOMId2node.get(dom.id);
          node.x = node.startPos.x + (e.clientX - _mouseDragStart[0]) / S;
          node.y = node.startPos.y + (e.clientY - _mouseDragStart[1]) / S;
          calcBox(node);
          updateNode(node);
        });
      }else {
        // move the node under the cursor
        _isMouseDragging.x = _isMouseDragging.startPos.x + (e.clientX - _mouseDragStart[0]) / S;
        _isMouseDragging.y = _isMouseDragging.startPos.y + (e.clientY - _mouseDragStart[1]) / S;
        calcBox(_isMouseDragging);
        updateNode(_isMouseDragging);
      }
    } else if (__isResizing) {
      // pass
    } else if (_isDragSelecting) {
      _('#select-box').style.left = Math.min(e.clientX, _mouseDownPos[0]) + 'px';
      _('#select-box').style.width = Math.abs(e.clientX - _mouseDownPos[0]) + 'px';
      _('#select-box').style.top = Math.min(e.clientY, _mouseDownPos[1]) + 'px';
      _('#select-box').style.height = Math.abs(e.clientY - _mouseDownPos[1]) + 'px';

      updateDragSelect();
      // clearTimeout(_dragSelectingTimeout);
      // _dragSelectingTimeout = setTimeout(updateDragSelect, 500);
    } else {
      // T[0] = _mouseDownT[0] -  (e.clientX - _mouseDownPos[0])/S;
      // T[1] = _mouseDownT[1] -  (e.clientY - _mouseDownPos[1])/S;
      node_container.dataset.x = (e.clientX - _mouseDownPos[0]);
      node_container.dataset.y = (e.clientY - _mouseDownPos[1]);
      node_container.style.left = node_container.dataset.x + 'px';
      node_container.style.top = node_container.dataset.y + 'px';

      // redraw()
    }
  }
};

// :::    ::: :::::::::: :::   ::: :::::::::   ::::::::  :::       ::: ::::    :::
// :+:   :+:  :+:        :+:   :+: :+:    :+: :+:    :+: :+:       :+: :+:+:   :+:
// +:+  +:+   +:+         +:+ +:+  +:+    +:+ +:+    +:+ +:+       +:+ :+:+:+  +:+
// +#++:++    +#++:++#     +#++:   +#+    +:+ +#+    +:+ +#+  +:+  +#+ +#+ +:+ +#+
// +#+  +#+   +#+           +#+    +#+    +#+ +#+    +#+ +#+ +#+#+ +#+ +#+  +#+#+#
// #+#   #+#  #+#           #+#    #+#    #+# #+#    #+#  #+#+# #+#+#  #+#   #+#+#
// ###    ### ##########    ###    #########   ########    ###   ###   ###    ####

let _clipBoard = []; // stores nodes with relative coordinates (x-centerX)*S

function calcCenterPos (nodes) {
  const R = [0, 0];
  nodes.forEach(function (node) {
    R[0] += node.x;
    R[1] += node.y;
  });
  return [R[0] / nodes.length, R[1] / nodes.length];
}

function copySelection (de_id = false) {
  copySelection.on = true;
  _clipBoard = _selected_DOM.map(domNode).map(stripNode);
  const centerPos = calcCenterPos(_clipBoard);
  _clipBoard.forEach((node) => {
    // yeah, my definition of S is counterintuitive here..
    node.x = (node.x - centerPos[0]) * S;
    node.y = (node.y - centerPos[1]) * S;
    node.fontSize *= S;
  });

  copyToClipboard(JSON.stringify(_clipBoard));

  copySelection.on = false;
}

window.addEventListener('keydown', (e) => {
  console.log('keydown');
  console.log(e);
  if (e.key === 'Delete') {
    if (contentEditTextarea) {
      // pass
    }else {
      if (_selected_DOM.length > 0) {
        applyAction({
          type: 'D',
          node_ids: _selected_DOM.map(dom => domNode(dom).id)
        });
        // _selected_DOM.forEach(deleteNode);
        // save('ids');
      }
    }
  } else if (e.key === 'Enter') {
    if (contentEditTextarea) {
      return 0;
    } else {
      if (_selected_DOM.length > 0) {
        // select, start editing
        onNodeDblClick(_selected_DOM[0]);
        // stop so that Enter does not overwrite the node content
        e.stopPropagation();
        e.preventDefault();
      }
    }
  } else if (e.key === 'c') {
    if (e.ctrlKey) {
      // Ctrl-C !
      // moved to copy event
      // copySelection();
    }
  } else if (e.key === 'x') {
    if (e.ctrlKey) {
      // Ctrl-X
      // moved to cut event
      // copySelection();
      // _selected_DOM.forEach(deleteNode);
      // _selected_DOM = [];
    }
  } else if (e.key === 'v') {
    if (e.ctrlKey) {
      // Ctrl-V !
      if (contentEditTextarea) {
        // pass
      } else {
        // moved to window paste
      }
    }
  } else if (e.code === 'F3' || ((e.ctrlKey || e.metaKey) && e.code === 'KeyF')) {
    _('#search-toggle').click();
    e.preventDefault();
  } else if ((e.code == "KeyZ") && ( (e.ctrlKey) || (e.metaKey) )) {
    if (e.shiftKey){
      // Shift - Meta - Z = Re-do on Macs
      _('#btnRedo').click();
    }else{
      // Ctrl/Meta - Z
      _('#btnUndo').click();
    }
  } else if ((e.code == "KeyY") && ( (e.ctrlKey) || (e.metaKey) )) {
    // Ctrl-Y was Re-do, right?
    _('#btnRedo').click();
  }
});

let __IMG = null;
let __X = null;

function deselectOneDOM (dom) {
  dom.classList.remove('selected');
  try {
    $(dom).rotatable('destroy');

    [].forEach.call(dom.getElementsByTagName('img'), (e) => {
      $(e).resizable('destroy').css('width', 'auto');
    });
  } catch (e) {
    console.log('some error in rotatable and resizable destroy');
    console.log(e);
  }
}

let _oldValues = null;

function selectOneDOM (dom) {
  dom.classList.add('selected');

  const node = domNode(dom);
  node.startPos = {x: node.x, y: node.y};
  //
  // https://jsfiddle.net/Twisty/7zc36sug/
  // https://stackoverflow.com/a/62379454/2624911
  // https://jsfiddle.net/Twisty/cdLn56f1/
  $(function () {
    const params = {
      start: function (e) {
        console.log('rotate start');
        console.log(e);
        _oldValues = [{ rotate: node.rotate }];
      },
      stop: function (e, ui) {
        console.log('rotate stop');
        console.log(e);
        console.log(ui);

        // ui.angle.start = ui.angle.current;
        applyAction({
          type: 'E',
          node_ids: [ node.id ],
          oldValues: _oldValues,
          newValues: [{ rotate: ui.angle.current }]
        });

        save(e.target);
      }
    };

    $(dom).rotatable(params);

    [].forEach.call(dom.getElementsByTagName('img'), (img) => {
      console.log('making that img resizable:');
      console.log(img);
      img.dataset.parent_node_id = dom.id;
      img.dataset.origS = S;
      __IMG = img;
      $(img).resizable({
        aspectRatio: true,
        start: function (e, ui) {
          console.log('resize start');
          console.log(e);
          console.log(ui);
          _oldValues = [{ fontSize: node.fontSize }];
        },
        stop: function (e, ui) {
          console.log('resize stop');
          console.log(e);
          console.log(ui);
          applyAction({
            type:'E',
            node_ids:[ node.id ],
            oldValues: _oldValues,
            newValues: [{ fontSize: ui.size.height / (5 * S) }]
          })
          // let hid = ui.originalElement[0].dataset.parent_node_id;
          // domNode(hid).fontSize = ui.size.height / (5 * S);
          // save(domNode(hid));
          // updateNode(_('#' + hid));

          // ui.originalElement.style.width='auto';
          __X = ui;
        }
      });
    });
    $(dom)
      .find('.ui-resizable-handle')
      .on('mousedown', function (e) {
        console.log('resize mouse down');
        // e.stopPropagation();
        __isResizing = true;
      })
      .on('mouseup', function (e) {
        console.log('resize mouse up');
        // e.stopPropagation();
      });
  });
}

function selectNode (n) {
  console.log('select : [' + (n ? n.id:'null') + ']');
  if (n) {
    if (_selected_DOM.length > 0) {
      if (!Array.isArray(n)) {
        n = [n];
      }
      // see how many are new ones
      if (n.every((dom) => dom.classList.contains('selected'))) {
        // if all are already selected - deselect them!
        n.forEach(deselectOneDOM);
        n.forEach((dom) => {
          _selected_DOM.splice(_selected_DOM.indexOf(dom));
        });
      }else {
        // if only some are already selected - add all new ones
        for (let dom of n) {
          if (dom.classList.contains('selected')) {
            continue;
          }else {
            selectOneDOM(dom);
            _selected_DOM.push(dom);
          }
        }
      }
    }else {
      if (!Array.isArray(n)) {
        n = [n];
      }
      _selected_DOM = n.slice();
      _selected_DOM.forEach(selectOneDOM);
    }
  }else {
    if (_selected_DOM.length > 0) {
      _selected_DOM.forEach(deselectOneDOM);
      _selected_DOM = [];
    }
  }

  if (_selected_DOM.length == 1) {
    _('#text').disabled = false;
    _('#fontSize').disabled = false;
    _('#text').value = domNode(_selected_DOM[0]).text;
    _('#fontSize').value = domNode(_selected_DOM[0]).fontSize;
    _('#fontSize').step = _('#fontSize').value * 0.25;
  } else {
    _('#text').disabled = true;
    _('#fontSize').disabled = true;
    _('#text').value = '';
    _('#fontSize').value = '';
  }
  return 0;
}

let _DOMId2nodej = new Map();
function gen_DOMId2nodej () {
  _DOMId2node = new Map();
  _DOMId2nodej = new Map();
  _NODEId2node = new Map();

  for (let j = 0; j < _NODES.length; j++) {
    _DOMId2node.set(_NODES[j].node.id, _NODES[j]);
    _DOMId2nodej.set(_NODES[j].node.id, j);
    _NODEId2node.set(_NODES[j].id, _NODES[j].id);
  }
}

function deleteNode (d) {
  if ('click' in d) {
    // DOM
    deleteNode(_DOMId2node.get(d.id));
  }else {
    // _NODES
    // ixs (TODO:optimize further)
    gen_DOMId2nodej();
    // remove rom _NODES
    _NODES.splice(_DOMId2nodej.get(d.node.id), 1);
    // remove from index
    _DOMId2node.delete(d.node.id);
    // remove from DOM
    node_container.removeChild(d.node);
    // remove from saved
    localStorage.removeItem('noteplace.' + d.node.id);
  }
}

function stopEditing () {
  let tdom = contentEditTextarea.parentElement.parentElement;
  contentEditTextarea.remove();
  const A = { type: 'D', node_ids: [ domNode(tdom).id ] };
  if (contentEditTextarea.value === '') {
    //deleteNode(tdom);    
    contentEditNode = null;
  }else {
    A.type = 'E';
    A.oldValues = [ { text: domNode(tdom).startText } ];
    A.newValues = [ { text: domNode(tdom).text } ];
    // A.nodes = [ domNode(tdom) ];
    newNode(tdom);
  }
  applyAction(A);
  contentEditTextarea = null;
}

function save (node = null, save_ids = true) {
  // save node state to localStorage.
  //  if node === null, saves all nodes
  //  if node == 'ids', saves ids
  // additional argument:
  //  save_ids [bool] : true => save ids too
  // log('save!');
  // log(node);
  if (node === null) {
    // save all
    const node_ids = [];
    _NODES.forEach((node) => {
      save(node, false);
      node_ids.push(node.id);
      // nodes.push(JSON.parse(JSON.stringify(node.dataset)));
    });
    localStorage['noteplace.node_ids'] = JSON.stringify(node_ids);
  } else if ( typeof(node) === 'string'){
    if (node === 'ids') {
      save_ids = true;
    } else if (node === 'places') {
      // do nothing, I intend on saving places anyway
    } else {
      // ID
      localStorage['noteplace.node_' + node] = JSON.stringify(stripNode(idNode(node)));
    }
  } else if (Array.isArray(node)) {
    // you know, array is for saving all of them
    node.forEach( save );
    // aand ids, just in case.
    save('ids');
  } else {
    // node provided, save only node
    if ('x' in node) {
      // original object
      localStorage['noteplace.node_' + node.id] = JSON.stringify(stripNode(node));
    } else if ('id' in node) {
      // DOM node
      localStorage['noteplace.' + node.id] = JSON.stringify(stripNode(domNode(node)));
    } else {
      log(node);
      throw Error('What did you aim for, calling save('+node+') ??');
    }
  }
  if (save_ids) {
    localStorage['noteplace.node_ids'] = JSON.stringify(
      _NODES.map((node) => node.id)
    );
  }
  localStorage['noteplace.places'] = JSON.stringify(
    stripPlace(_PLACES)
  );

  localStorage['noteplace.history'] = JSON.stringify( _HISTORY);
  localStorage['noteplace.history_current'] = _HISTORY_CURRENT_ID;

  const tsize = localStorageSize() / (1024 * 1024);
  if (tsize > 4) {
    console.error('localStorage ' + tsize.toFixed(3) + ' MB, limit is 5. you know what to do.');
  }
}

// ::::    :::  ::::::::  :::::::::  ::::::::::      :::::::::: :::    ::: ::::    :::  ::::::::   ::::::::
// :+:+:   :+: :+:    :+: :+:    :+: :+:             :+:        :+:    :+: :+:+:   :+: :+:    :+: :+:    :+:
// :+:+:+  +:+ +:+    +:+ +:+    +:+ +:+             +:+        +:+    +:+ :+:+:+  +:+ +:+        +:+
// +#+ +:+ +#+ +#+    +:+ +#+    +:+ +#++:++#        :#::+::#   +#+    +:+ +#+ +:+ +#+ +#+        +#++:++#++
// +#+  +#+#+# +#+    +#+ +#+    +#+ +#+             +#+        +#+    +#+ +#+  +#+#+# +#+               +#+
// #+#   #+#+# #+#    #+# #+#    #+# #+#             #+#        #+#    #+# #+#   #+#+# #+#    #+# #+#    #+#
// ###    ####  ########  #########  ##########      ###         ########  ###    ####  ########   ########

let contentEditNode = null;
let contentEditMouseDown = false;
let contentEditTextarea = null;

function textareaAutoResize (e) {
  let target = this;
  if ('style' in e) {
    target = e;
  }
  target.style.height = 'auto';
  target.style.height = target.scrollHeight + 'px';
}

function textareaBtnDown (e) {
  if ((e.ctrlKey) && ((e.keyCode === 0xA) || (e.keyCode === 0xD))) {
    // Ctrl+Enter
    stopEditing();
  }
  if ((e.keyCode === 13) && (e.shiftKey)) {
    // Shift-enter
    const tnode_orig = domNode(contentEditNode.parentElement);
    const tnode = stripNode(tnode_orig);
    let th = contentEditNode.getBoundingClientRect().height;
    // Shift+Enter
    stopEditing();

    // setTimeout(function(){
    if (contentEditNode) {
      // if the node has not been deleted (as empty)
      //  , get actual height (not height of markdown textarea)
      th = tnode_orig.content_dom.getBoundingClientRect().height;
    }

    selectNode(null);
    const new_node = newNode({
      x: 1 * tnode.x,
      y: 1 * tnode.y +
        // + 1*tnode['fontSize']
        (th / S),
      text: '',
      fontSize: tnode.fontSize
    });

    selectNode(new_node);

    onNodeDblClick(new_node);

    // neither preventDefault nor stopPropagation
    //    stoped newline from appearing
    setTimeout(function () { contentEditTextarea.value = ''; contentEditTextarea.focus(); }, 10);
  // },10);
  }

  if (e.keyCode === 9) {
    // Tab

    // no jump-to-next-field
    e.preventDefault();
  }

  // https://stackoverflow.com/a/3369624/2624911
  if (contentEditNode) {
    if (e.key === 'Escape') { // escape key maps to keycode `27`
      selectNode(contentEditNode.parentElement);

      stopEditing();

      e.stopPropagation();
    }
  }
}

function onNodeDblClick (e) {
  if ('preventDefault' in e) {
    e.preventDefault();
    e.stopPropagation();

    contentEditNode = this;
  } else {
    contentEditNode = e;
  }

  console.log('double-clicked on [' + contentEditNode.id + '] : ' + contentEditNode.innerText);
  console.log(contentEditNode);

  // console.log(contentEditNode);

  const node = domNode(contentEditNode);

  contentEditTextarea = document.createElement('textarea');
  contentEditTextarea.id = 'contentEditTextarea';
  contentEditTextarea.value = node.text;

  node.startText = node.text;

  contentEditNode = contentEditNode.getElementsByClassName('np-n-c')[0];

  // contentEditTextarea.style.fontSize = contentEditNode.dataset['fontSize']*S+'px';
  // contentEditTextarea.style.fontFamily = 'Open Sans';
  contentEditTextarea.dataset.initS = S;
  console.log(contentEditNode.getBoundingClientRect());
  contentEditTextarea.dataset.initWidth = Math.max(width / 3, contentEditNode.getBoundingClientRect().width + 20);
  contentEditTextarea.dataset.initHeight = contentEditNode.getBoundingClientRect().height;
  contentEditTextarea.style.width = contentEditTextarea.dataset.initWidth + 'px';
  // contentEditTextarea.style.height = contentEditTextarea.dataset['initHeight'] +'px';
  contentEditTextarea.style.height = 'auto';

  contentEditTextarea.onkeydown = textareaBtnDown;
  contentEditTextarea.onkeyup = textareaAutoResize;
  contentEditTextarea.oninput = function (e) {
    console.log('contentEditTextarea input');
    domNode(this.parentElement.parentElement).text = this.value;
  };

  contentEditTextarea.onmousedown = (e) => {
    if (e.button === 1) {
      // drag on middle button => just pass the event
    } else {
      contentEditMouseDown = true;
    }
  };

  contentEditNode.innerHTML = '';
  contentEditNode.appendChild(contentEditTextarea);

  // textareaAutoResize(contentEditTextarea);
  contentEditTextarea.select();

  // selectNode(contentEditNode);
}

__nodeMouseDown = null;

function idNode (id) {
  return _NODEId2node.get(id);
}

function domNode (dom) {
  return _DOMId2node.get(typeof (dom) === 'string' ? dom : dom.id);
}

function onNodeMouseDown (e) {
  console.log('onNodeMouseBtn');
  console.log(this.id);

  __nodeMouseDown = domNode(this);
  // console.log(e);
  if (e.button === 1) {
    _isMouseDragging = __nodeMouseDown;
    _mouseDragStart = [e.clientX, e.clientY];

    let applyDrag = [ this ];
    if (this.classList.contains('selected')) {
      // save all selected positions
      applyDrag = _selected_DOM;
    }
    applyDrag.forEach((dom) => {
      const node = domNode(dom);
      node.startPos = { x: node.x, y: node.y };
    });

    e.preventDefault();
  } else if (e.button === 0) {
    // left mouse button
    console.log(e);
  } else {
    // pass
  }

  if (e.ctrlKey) {
    e.preventDefault();
  }
}

function onNodeClick (e) {
  console.log('clicked on [' + this.id + '] : ' + this.innerText);

  if (e.shiftKey) {
    // multiselect!
    // selectNode(this); //already handled via drag-select
    // e.stopPropagation();
  } else {
    selectNode(null);
    selectNode(this);
  }
}

function newNodeID (id = null) {
  return newID(id || 'n', idNode);
}

// ::::    ::: :::::::::: :::       ::: ::::    :::  ::::::::  :::::::::  ::::::::::
// :+:+:   :+: :+:        :+:       :+: :+:+:   :+: :+:    :+: :+:    :+: :+:
// :+:+:+  +:+ +:+        +:+       +:+ :+:+:+  +:+ +:+    +:+ +:+    +:+ +:+
// +#+ +:+ +#+ +#++:++#   +#+  +:+  +#+ +#+ +:+ +#+ +#+    +:+ +#+    +:+ +#++:++#
// +#+  +#+#+# +#+        +#+ +#+#+ +#+ +#+  +#+#+# +#+    +#+ +#+    +#+ +#+
// #+#   #+#+# #+#         #+#+# #+#+#  #+#   #+#+# #+#    #+# #+#    #+# #+#
// ###    #### ##########   ###   ###   ###    ####  ########  #########  ##########

// function addNode(node){

//   _NODES.push(node);
//   _DOMId2node.set(tdom.id, node);
//   _DOMId2nodej.set(tdom.id, _NODES.length-1);
// }

// function addNodes(nodes){

// }

function newNode (node, redraw = true) {
  let tdom = node;
  // console.log(d);
  if ('className' in node) {
    console.log('newNode with DOM node provided:');
    // console.log(tn);
    node = domNode(tdom);
  } else {
    console.log('newNode with node provided');
    if ((!('id' in node)) || (node.id === undefined)) {
      node.id = newNodeID();
    }
    if (!('rotate' in node)) {
      node.rotate = 0;
    }
    if (!('x' in node)) {
      let mousePos = _mousePos;
      if ('mousePos' in node) {
        mousePos = node.mousePos;
      }
      const mouseXY = clientToNode(mousePos);
      node.x = mouseXY[0];
      node.y = mouseXY[1];
    }
    if (!('fontSize' in node)) {
      node.fontSize = 20 / S;
    }
    if ((!node.hasOwnProperty('style'))||
        (node.style === undefined)) {
      node.style = Object.assign({}, default_node_style);
    } else {
      node.style = Object.assign({}, default_node_style, node.style);
    }

    tdom = _ce('div'
      , 'id', 'node_' + node.id
      , 'className', 'node ui-rotatable'
      , 'onclick', onNodeClick
      , 'ondblclick', onNodeDblClick
      , 'onmousedown', onNodeMouseDown
    );
    // tdom.dataset['bsHtml']='true';
    // tdom.dataset['bsPlacement']='top';
    // tdom.dataset['bsToggle']='popover';
    // tdom.dataset['bsContainer']="body";

    tdom.style.display = 'none';

    _NODES.push(node);
    _NODEId2node.set(node.id, node);
    _DOMId2node.set(tdom.id, node);
    _DOMId2nodej.set(tdom.id, _NODES.length - 1);

    //  tn.contentEditable = true;
    // tn.dataset["x"] = d.x;
    // tn.dataset["y"] = d.y;
    // tn.dataset["rotate"] = d.rotate;
    // tn.dataset["fontSize"] = d.fontSize;
    // tn.dataset['text'] = d.text;
    // tn.dataset['id'] = d.id;
  }
  tdom.innerHTML = '';

  const tcontent = _ce('div'
    , 'className', 'np-n-c'
    , 'innerHTML', getHTML(node.text)
  );

  // Tooltip

  const tt = _ce('div'
    , 'className', 'position-absolute start-0 np-n-tooltip'// translate-middle start-50
  );

  if (node.text.slice(0, 2) != '![') {
    // not entirely image-based node
    const tcolorselect = _ce('input'
      , 'type', 'color'
      , 'value', node.style.color
      , 'oninput', function (e) {
        node.style.color = this.value;
        node.content_dom.style.color = this.value;
      }
      , 'onchange', function (e) {
        applyAction( { 
          type: 'E',
          node_ids: [ node.id ],
          oldValues: [ { 'style.color': this.dataset['oldValue'] } ],
          newValues: [ { 'style.color': this.value } ]
        })
      }
    );
    tcolorselect.dataset['oldValue'] = node.style.color;
    tt.appendChild(tcolorselect);

    if (tcontent.innerHTML.indexOf('<br') >= 0) {
      // text align only valuable for multiline nodes
      ['left', 'center', 'right'].forEach((jta) => {
        let tbtn = _ce('button'
          , 'className', 'np-n-t-btn np-n-t-ta' + (node.style.textAlign == jta ? ' np-n-t-ta-selected':'')
          , 'innerHTML', '<i class="bi-text-' + jta + '"></i>'
          , 'onclick', function (e) {
            console.log('clicked on text-align=' + this.dataset.textAlign);
            $(this.parent)
              .find('.np-n-t-ta')
              .removeClass('np-n-t-ta-selected')
              .find('[data-text-align="' + this.dataset.textAlign + '"]')
              .addClass('np-n-t-ta-selected');

            applyAction({
              type: 'E',
              node_ids: [ node.id ],
              newValues: [ { 'style.textAlign': this.dataset.textAlign } ]
            })  
            // node.style.textAlign = this.dataset.textAlign;
            node.content_dom.style.textAlign = this.dataset.textAlign;
            // newNode(node.node);
            // selectNode(node)
            e.stopPropagation();
          }
        );

        tbtn.dataset.textAlign = jta;
        tt.appendChild(tbtn);
      });
    }
  }

  const tplusbtn = _ce('button'
    , 'className', 'np-n-t-btn plus-button'// btn btn-outline-primary'
    , 'onclick', function (e) { editFontSize(+1); e.stopPropagation(); }
    , 'innerHTML', '<i class="bi bi-plus"></i>'
  );
  const tminusbtn = _ce('button'
    , 'className', 'np-n-t-btn minus-button'// 'btn btn-outline-primary'
    , 'onclick', function (e) { editFontSize(-1); e.stopPropagation(); }
    , 'innerHTML', '<i class="bi bi-dash"></i>'
  );
  tt.appendChild(tplusbtn);
  tt.appendChild(tminusbtn);

  tt.addEventListener('dblclick', function (e) {
    e.stopPropagation();
  });

  tdom.appendChild(tt);

  for (const p of Object.keys(node.style)) {
    tcontent.style[p] = node.style[p];
  }

  tdom.appendChild(tcontent);

  // tn.innerHTML =  '';
  // ta = document.createElement('a');
  // ta.href = '(?Tx='+tn.dataset["x"]+'&Ty='+tn.dataset["y"]+'&S='+30/tn.dataset["fontSize"];
  // ta.className = 'node_a';
  // ta.innerHTML = getHTML(tn.dataset['text']);
  // ta.onclick = function(e){
  //   console.log('a click!');
  //   e.preventDefault();
  //   e.stopPropagation();
  // }
  // ta.onauxclick = function(e){
  //   // middle mouse button click!!
  //   e.preventDefault();
  // }
  // ta.onmousedown = function(e){
  //   console.log('a onmousedown!');
  //   e.preventDefault();
  //   e.stopPropagation();
  // }
  // ta.onmouseup = function(e){
  //   console.log('a onmouseup!');
  //   e.preventDefault();
  //   e.stopPropagation();
  // }
  // tn.appendChild(ta);
  node.node = tdom;
  node.content_dom = tcontent;

  if (!('className' in node)) {
    node_container.appendChild(tdom);
  }

  updateNode(node);

  [].forEach.call(tdom.getElementsByTagName('a'), (elt) => {
    if (elt.href) {
      elt.onclick = (e) => {
        e.stopPropagation();
      };
      elt.onmousedown = (e) => {
        e.stopPropagation();
      };
    }
  });

  if (redraw) {
    redrawNode(node);
  }

  return tdom;
}

function updateNode (d) {
  // here, sadly, d s for _NODES element, and n is for DOM element..
  let n = d;
  if (d.hasOwnProperty('node')) {
    n = d.node;
  } else {
    n = d;
    d = _DOMId2node.get(n.id);
  }

  if (d.rotate !== 0) {
    n.style.transform = 'rotate(' + d.rotate + 'rad)';
  }

  n.style.left = (d.x - T[0]) * S + 'px';
  n.style.top = (d.y - T[1]) * S + 'px';
  n.style.fontSize = (d.fontSize) * S + 'px';

  [].forEach.call(n.getElementsByTagName('img'), (e) => {
    e.style.width = 'auto';
    e.style.height = 5 * (d.fontSize) * S + 'px';
    // e.setAttribute('draggable', false);
    // e.onmousedown = (e)=>{e.preventDefault();};
  });
  setTimeout(function () {
    [].forEach.call(n.getElementsByClassName('ui-wrapper'), (wrapper) => {
      const img = wrapper.getElementsByTagName('img')[0];
      wrapper.style.height = img.style.height;
      wrapper.style.width = img.getBoundingClientRect.width;
      img.dataset.origS = S;
    })
  }, 10);
  return 1;
  [].forEach.call(n.getElementsByClassName('ui-wrapper'), (wrapper) => {
    const img = wrapper.getElementsByTagName('img')[0];
    // e.style.height = img.clientHeight+'px';
    // e.style.width = img.clientWidth+'px';
    wrapper.style.width = wrapper.style.width.slice(0, -2) * S / img.dataset.origS + 'px';
    wrapper.style.height = wrapper.style.height.slice(0, -2) * S / img.dataset.origS + 'px';
    img.dataset.origS = S;
  });
}

function updateSizes () {
  if (!('state' in updateSizes)) {
    updateSizes.state = '';
  }
  const state = JSON.stringify({ T: T, S: S });
  if (state === updateSizes.state) {
    // pass
  } else {
    for (let j = 0; j < _NODES.length; j++) {
      if (_NODES[j].vis) {
        const d = _NODES[j];
        d.xMax = d.x + d.node.clientWidth / S;
        d.yMax = d.y + d.node.clientHeight / S;
      }
    }
    updateSizes.state = state;
  }

  setTimeout(updateSizes, 100);
}

function calcBox (d) {
  if (d.text.indexOf('![') >= 0) {
    d.xMax = d.x + d.fontSize * 10;
    d.yMax = d.y + d.fontSize * 5;
  } else {
    d.xMax = d.x + d.text.length * d.fontSize * 0.5;
    d.yMax = d.y + d.text.split('\n').length * d.fontSize;
  }
}

function isVisible (d) {
  if (!('xMax' in d)) {
    calcBox(d);
  }
  return (
    (d.fontSize > 0.2 / S)
    && isInBox(d.x, d.xMax, d.y, d.yMax,
      T[0] - width * 0.5 / S, T[0] + width * 1.5 / (1 * S),
      T[1] - height * 0.5 / S, T[1] + width * 1.5 / (1 * S))
    // &&(d.x<=T[0]+width*1.5/(1*S))
    // &&(d.y<=T[1]+width*1.5/(1*S))
    // &&(d.xMax>=T[0] - width*0.5/S)
    // &&(d.yMax>=T[1] - height*0.5/S)
  );

}

function calcVisible (d, onhide, onshow) {
  const newVis = isVisible(d);

  if (!('vis' in d)) {
    if (newVis) {
      onshow(d);
    } else {
      onhide(d);
    }
  } else {
    if (d.vis) {
      if (newVis) {
        //
      } else {
        // console.log('hiding:');
        // console.log(d);
        onhide(d);
      }
    } else {
      if (newVis) {
        // console.log('show:');
        // console.log(d);
        onshow(d);
      } else {
        // did not show before and not showing now, pass
      }
    }
  }
  d.vis = newVis;
}

function redrawNode (e) {
  if (!e.hasOwnProperty('deleted')) {
    e.deleted = false;
  }
  if (e.deleted) {
    e.node.style.display = 'none';
  } else {
    e.node.style.display = '';
    calcVisible(e
      , function () { // onhide
        e.node.style.opacity = 0;
        e.node.style.display = 'none';
      }, function () { // onshow
        let oldTD = 0;
        if ('node' in e) {
          oldTD = e.node.style.transitionDuration.slice(0, -1) * 1;
          e.node.style.display = 'none';
        }
        updateNode(e);
        setTimeout(function () {
          e.node.style.display = '';
          e.node.style.opacity = 1;
        }, 1 + 1000 * oldTD);
      }
    );
  }
}

// function redrawAllNodes(){
//   if(redrawAllNodes.running){
//     redrawAllNodes.waiting = true;
//   }else{
//     redrawAllNodes.running = true;
//     _NODES.forEach(redrawNode);

//     if(redrawAllNodes.waiting){
//       redrawAllNodes.waiting = false;
//       setTimeout(redrawAllNodes,5);
//     }else{
//       redrawAllNodes.running=false;
//     }
//   }
//   // clearTimeout(redrawAllNodes.timeout);
//   // redrawAllNodes.timeout = setTimeout(function(){
//   // }, 1);
// }
// redrawAllNodes.running=false;
// redrawAllNodes.waiting=false;

function redraw () {
  console.log('redraw');
  _NODES.forEach((e) => {
    if (('vis' in e) && (e.vis)) {
      // console.log('vis => update');
      // console.log(e);
      updateNode(e);
    }
  });

  // setTimeout(function(){redrawAllNodes();},10);
  setTimeout(function () {
    _NODES.forEach(redrawNode);
  }, 5);

  // _NODES.forEach(redrawNode);

  if (contentEditTextarea) {
    console.log('redraw : contextEditTextarea');
    console.log('initWidth:');
    console.log(contentEditTextarea.dataset.initWidth);
    console.log('initS: ' + contentEditTextarea.dataset.initS);
    console.log('contentEditTextarea.style.width = ' + contentEditTextarea.style.width);
    contentEditTextarea.style.width = 1 * contentEditTextarea.dataset.initWidth * S / (1 * contentEditTextarea.dataset.initS) + 'px';
    console.log('contentEditTextarea.style.width = ' + contentEditTextarea.style.width);
    contentEditTextarea.style.height = contentEditTextarea.dataset.initHeight * S / contentEditTextarea.dataset.initS + 'px';
  }

  if (_selected_DOM.length > 0) {
    _selected_DOM.forEach(dom => {
      let wrapper = dom.getElementsByClassName('ui-wrapper');

      if (wrapper.length > 0) {
        wrapper = wrapper[0];
        const img = wrapper.getElementsByTagName('img')[0];

        wrapper.style.width = wrapper.style.width.slice(0, -2) * S / img.dataset.origS + 'px';
        wrapper.style.height = wrapper.style.height.slice(0, -2) * S / img.dataset.origS + 'px';
        img.dataset.origS = S;
      }
    });
  }
}

function zoomToURL (s, smooth = true, noTemp = false) {
  const urlParams = new URLSearchParams(s);
  applyZoom(
    [1 * urlParams.get('Tx'), 1 * urlParams.get('Ty')]
    , 1 * urlParams.get('S') ? 1 * urlParams.get('S') : 1
    , smooth
    , noTemp
  );
}

function getHTML (text) {
  return md.render(text)
    .slice(0, -1) // md.render adds newline (?)
    .replaceAll('\n', '<br />')
    .replace(/href="(\?[^"]+)"/, /class="local" onclick="zoomToURL('$1',false)"/);
  // .replaceAll(/(href="[^\?])/g,'onclick="(e)=>{console.log(e);e.stopPropagation();}" $1');
}

function isCurrentState () {
  return ((history.state)
      && ('T' in history.state)
      && ('S' in history.state)
      && (history.state.T[0] == T[0])
      && (history.state.T[1] == T[1])
      && (history.state.S == S));
}

function replaceHistoryState () {
  const url = window.location.href.indexOf('?') == -1
    ? window.location.href
    : window.location.href.slice(0, window.location.href.indexOf('?'));
  window.history.replaceState(
    { T: T, S: S },
    'Noteplace',
    url + getStateURL());
  console.log('history replaced');
}

const zoom_urlReplaceTimeout = setInterval(function () {
  if (!isCurrentState()) {
    replaceHistoryState();
  }
}, 200);

function getDOM (id) {
  return document.getElementById('node_' + id);
}

function onFontSizeEdit () {
  if (_selected_DOM.length === 1) {
    const dom = _selected_DOM[0];
    const node = domNode(dom);
    node.fontSize = _('#fontSize').value;
    _selected_DOM[0].classList.add('zoom');

    updateNode(_selected_DOM[0]);
    // _selected_DOM.classList.remove('zoom');

    _('#fontSize').step = _('#fontSize').value * 0.25;

    save(_selected_DOM[0]);
  }
}

function onTextEditChange () {
  if (_selected_DOM !== null) {
    _selected_DOM.dataset.text = this.value;
    newNode(_selected_DOM);

    // this.style.height = "5px";
    // this.style.height = (this.scrollHeight)+"px";

    save(_selected_DOM);
  }
}

function addRandomNodes (N, Xlim, Ylim, FSLim) {
  for (let j = 0; j < N; j++) {
    const id = newNodeID();
    newNode({
      x: Xlim[0] + Math.random() * (Xlim[1] - Xlim[0]),
      y: Ylim[0] + Math.random() * (Ylim[1] - Ylim[0]),
      fontSize: FSLim[0] + Math.random() * (FSLim[1] - FSLim[0]),
      text: 'test__' + id,
      id: id,
      rotate: Math.random() * 2 * Math.PI
    });
  }
  redraw();
}

function editFontSize (delta) {
  if (_selected_DOM.length > 0) {
    if (_selected_DOM.length == 0) {
      // one element selected, fontSize input is related to it
      _('#fontSize').value *= Math.pow(1.25, delta);
      onFontSizeEdit();
    } else {
      const k = Math.pow(1.25, delta);

      const centerPos = calcCenterPos(_selected_DOM.map(domNode));

      applyAction({
        type: 'E',
        node_ids: _selected_DOM.map( dom => domNode(dom).id ),
        newValues: _selected_DOM.map( dom => { 
          let node = domNode(dom);
          return {
            fontSize: node.fontSize * k,
            x: centerPos[0] + (node.x - centerPos[0]) * k,
            y: centerPos[1] + (node.y - centerPos[1]) * k
        }; })
      })

      _selected_DOM.forEach((dom) => {
        // let node = domNode(dom);
        // node.fontSize *= k;
        // node.x = centerPos[0] + (node.x - centerPos[0]) * k;
        // node.y = centerPos[1] + (node.y - centerPos[1]) * k;
        // updateNode(dom);

        let wrapper = dom.getElementsByClassName('ui-wrapper');
        if (wrapper.length > 0) {
          wrapper = wrapper[0];
          console.log(wrapper);
          wrapper.style.width = (wrapper.style.width.slice(0, -2) * k) + 'px';
          wrapper.style.height = (wrapper.style.height.slice(0, -2) * k) + 'px';
        }
      });
    }
  }
}

function showModalYesNo (title, body, yes_callback) {
  _('#modalYesNoLabel').innerHTML = title;
  _('#modalYesNoBody').innerHTML = body;
  _('#modalYesNo-Yes').onclick = yes_callback;
  $('#modalYesNo').modal('show');
}

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
function saveToG (add_history = false) {
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

function stripNode (d) {
  // strips only relevant data for nodes, also convert to numerical
  return {
    id: ('id' in d) ? d.id+'' : newNodeID(), // newNodeID(),//
    x: 1 * d.x,
    y: 1 * d.y,
    fontSize: 1 * d.fontSize,
    text: d.text,
    rotate: 'rotate' in d ? 1 * d.rotate:0,
    style: 'style' in d ? delete_defaults(d.style, default_node_style) : undefined
  };
}

// load everything from single object
function loadFromG (G) {
  console.log('Loading..');

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

  G.nodes.map(stripNode).forEach(newNode);

  redraw();
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

//  :::::::: ::::::::::: :::     ::::::::: ::::::::::: :::    ::: :::::::::
// :+:    :+:    :+:   :+: :+:   :+:    :+:    :+:     :+:    :+: :+:    :+:
// +:+           +:+  +:+   +:+  +:+    +:+    +:+     +:+    +:+ +:+    +:+
// +#++:++#++    +#+ +#++:++#++: +#++:++#:     +#+     +#+    +:+ +#++:++#+
//        +#+    +#+ +#+     +#+ +#+    +#+    +#+     +#+    +#+ +#+
// #+#    #+#    #+# #+#     #+# #+#    #+#    #+#     #+#    #+# #+#
//  ########     ### ###     ### ###    ###    ###      ########  ###

node_container.dataset.x = 0;
node_container.dataset.y = 0;

// event handlers

_('#text').oninput = onTextEditChange;
_('#fontSize').onchange = onFontSizeEdit;

_('#btnAddLots').onclick = function () {
  addRandomNodesToView(1 * _('#number').value);
};

_('#btnZoomIn').onclick = function () {
  zoomInOut(1);
};
_('#btnZoomOut').onclick = function () {
  zoomInOut(-1);
};

_('#btnFontMinus').onclick = function () {
  editFontSize(-1);
};
_('#btnFontPlus').onclick = function () {
  editFontSize(+1);
};

// Load nodes?

if ($('.node').length) {
  console.log('seems we already have nodes.');

  save();
} else {
  console.log('No nodes in html..');
  let nodes = [];
  let nodeIDs = [];
  try {
  // if(localStorage['noteplace.node_ids']){
    nodeIDs = JSON.parse(localStorage['noteplace.node_ids']);
    nodes = nodeIDs.map(function (id) {
      console.log(id);
      console.log('noteplace.node_' + id);

      return JSON.parse(localStorage['noteplace.node_' + id]);
    });
  }catch (e) {
    console.log('no nodes in localStorage, loading default');
    nodes = nodes_default;
  }
  nodes.map(stripNode).forEach(newNode);
}

try {
  _PLACES = JSON.parse(localStorage['noteplace.places']);
}catch (e) {
  _PLACES = stripPlace(_PLACES_default);
}

fillPlaces();

save();

$('#exampleModal').on('shown.bs.modal', function () {
  $('#modal-input').trigger('focus');
});

const copydiv = _ce('div'
  , 'id', 'copydiv'
  , 'contentEditable', 'true'
  , 'onready', function () { copydiv.focus() ;}
);
let copydiv_observer = null;
node_container.appendChild(copydiv);

window.addEventListener('paste', function (e) {
  console.log('window paste');
  console.log(e);
  // items = e.clipboardData.items;
  // console.log(items);
  if (contentEditTextarea) {
    // pass
  } else {
    // hmm, pasting something from the outside?
    copydiv.focus();

    // copydiv.addEventListener('input',function(e){
    //   console.log('copydiv input')
    //   console.log(this);
    //   console.log(e)
    // })
    if (1) {
    // copydiv.addEventListener('paste',function(e){
      copydiv_observer = addOnContentChange(copydiv, function (e) {
        console.log('copydiv paste!');
        console.log(e);

        E = e;

        let tstuff = [].map.call(e, je => [].map.call(
          je.addedNodes, n => 'innerHTML' in n ? n.innerHTML:n.textContent
        ).join('')).join('');

        setTimeout(function () {
          tstuff = _('#copydiv').innerHTML;

          copydiv_observer.disconnect();
          copydiv.innerHTML = '';

          let json_parsed = false;
          if (tstuff[0] == '[') {
            try {
              _clipBoard = JSON.parse(
              // I know, right?
              //  why does pasting JSON-encoded html
              //    create this sort of nonsense?
                tstuff.replaceAll('&lt;', '<')
                  .replaceAll('&gt;', '>')
                  .replaceAll('&amp;', '&')
                // .replaceAll('&apos;',"'")
                // .replaceAll('&quot;','"')
              );
              json_parsed = true;
            }catch (e) {
              json_parsed = false;
            }
          }

          if (json_parsed) {
            console.log('Pasting JSON-parsed _clipBoard');
            selectNode(null);
            // paste Under the cursor?

            const A = { type: 'A', nodes: [] };

            _clipBoard.forEach((node) => {
              const nnode = stripNode(node);
              // de-duplicate if
              nnode.id = newNodeID(nnode.id);
              nnode.x /= S;
              nnode.y /= S;
              nnode.fontSize /= S;
              const tmousePos = clientToNode(_mousePos);
              nnode.x += tmousePos[0];
              nnode.y += tmousePos[1];

              A.nodes.push(nnode);

              // selectNode(newNode(nnode));
            });

            applyAction(A);

            selectNode(A.nodes.map( n => idNode(n.id).node ));

          }else {
            // I know this is not perfect (HAHAHAHAHA!!...)
            //  but it kinda works
            tstuff = tstuff.replaceAll(/font-size:[ 0-9]+(px)?;?/g, '');
            tstuff = tstuff.replaceAll(/width:[ 0-9]+(px)?;?/g, '');
            tstuff = tstuff.replaceAll(/line-height:[ 0-9]+(px)?;?/g, '');
            tstuff = tstuff.replaceAll(/height:[ 0-9]+(px)?;?/g, '');

            console.log(tstuff);

            applyAction({
              type: 'A',
              nodes: [{
                text: tstuff
              }]
            });
            selectNode(_NODES[_NODES.length - 1].node);
          }

        // node_container.removeChild(copydiv);
        }, 50);
      // e.stopPropagation();
        // })
      });
    }
  }
});

window.addEventListener('cut', function (e) {
  console.log('window cut');
  console.log(e);
  if (contentEditTextarea) {
    // pass
  } else {
    e.stopPropagation();
    e.preventDefault();
    if (('on' in copySelection) && (copySelection.on)) {
      // pass
    } else {
      copySelection();
    }
    _selected_DOM.forEach(deleteNode);
    _selected_DOM = [];
  }
});

window.addEventListener('copy', function (e) {
  console.log('window copy');
  console.log(e);
  if (contentEditTextarea) {
    // pass
  } else {
    if (('on' in copySelection) && (copySelection.on)) {
      // pass
    } else {
      copySelection();
    }
  }
});

_('#btnClear').addEventListener('click', function () {
  showModalYesNo(
    'Clear everything?',
    'Are you <b>sure</b> you want to clear <i>everything</i>?',
    function () {
      _RESTART([]);
    }
  );
});

_('#btnRestart').addEventListener('click', function () {
  showModalYesNo(
    'Restart?',
    'Are you <b>sure</b> you want to discard <i>everything</i> and restart?',
    function () {
      _RESTART();
    }
  );
});

let _fileList = null;
container.addEventListener('drop', function (e) {
  console.log('container drop');
  console.log(e);
  e.stopPropagation();
  e.preventDefault();

  container.classList.remove('drag-hover');

  if (e.dataTransfer.files.length > 0) {
    _fileList = e.dataTransfer.files;
    console.log(_fileList);
    // _fileList
  } else {
    selectNode(null);
    let h = applyAction( { 
      type: 'A',
      nodes: [{
        text: e.dataTransfer.getData('text'),
        mousePos: [e.clientX, e.clientY]
      }]
    } );
    selectNode(_NODES[_NODES.length-1].node);
    // selectNode(
    //   newNode({
    //     text: e.dataTransfer.getData('text'),
    //     mousePos: [e.clientX, e.clientY]
    //   })
    // );
  }
});

container.addEventListener('dragover', function (e) {
  // console.log('container dragover');
  // console.log(e);
  e.preventDefault();
});

container.addEventListener('dragenter', function (e) {
  console.log('container dragenter');
  // console.log(e);
  container.classList.add('drag-hover');
  e.preventDefault();
});

container.addEventListener('dragleave', function (e) {
  console.log('container dragleave');
  container.classList.remove('drag-hover');
  // console.log(e);
  e.preventDefault();
});

container.addEventListener('dragend', function (e) {
  console.log('container dragend');
  // console.log(e);
});

function getStateURL (state = null) {
  if (state == null) {
    state = currentState();
  }
  return '?Tx=' + state.T[0] + '&Ty=' + state.T[1] + '&S=' + state.S;
}

// start updateSizes process
updateSizes();

_('#btnPaletteToggle').onclick = function () {
  if (_('#btnPaletteToggle').ariaExpanded === 'true') {
    _('#btnPaletteToggle').innerHTML = '<i class="bi-arrow-down"></i>';
  }else {
    _('#btnPaletteToggle').innerHTML = '<i class="bi-palette"></i>';
    randomizePalette();
  }
};

$('#menu-toggle').click(function (e) {
  e.preventDefault();
  $('#wrapper').toggleClass('toggled');
});

window.onpopstate = function (e) {
  e.stopPropagation();
  e.preventDefault();
  console.log('location: ' + document.location + ', state: ' + JSON.stringify(e.state));
  gotoState(e.state);
};

// applyZoom(T,S, false);
zoomToURL(window.location.search, false);

// :::    ::: ::::::::::: ::::::::::: :::        ::::::::::: ::::::::::: :::   :::
// :+:    :+:     :+:         :+:     :+:            :+:         :+:     :+:   :+:
// +:+    +:+     +:+         +:+     +:+            +:+         +:+      +:+ +:+
// +#+    +:+     +#+         +#+     +#+            +#+         +#+       +#++:
// +#+    +#+     +#+         +#+     +#+            +#+         +#+        +#+
// #+#    #+#     #+#         #+#     #+#            #+#         #+#        #+#
//  ########      ###     ########### ########## ###########     ###        ###

function status () {
  if ((arguments.length === 1) && (typeof (arguments[0]) === 'object')) {
    let s = toStr(arguments[0]);
    _('#status').innerText = s.slice(1, s.length - 1);
  } else {
    _('#status').innerText = [...Array(arguments.length).keys()].map((j) => toStr(arguments[j])).join(', ');
  }
}

function currentState () {
  return { T: T, S: S };
}

function previewState (state) {
  if (typeof (state) === 'string') {
    try {
      state = JSON.parse(state);
      state = { T: [state.T[0] * 1, state.T[1] * 1], S: state.S * 1 };
    } catch (e) {
      state = new URLSearchParams(state);
      state = { T: [state.get('Tx') * 1, state.get('Ty') * 1], S: state.get('S') * 1 };
    }
  }
  __previewOldState = currentState();

  gotoState(state, false, false);
}

function gotoState (state, smooth = false, rewrite_preview = false) {
  applyZoom(state.T, state.S, smooth, rewrite_preview);
}

function exitPreview () {
  gotoState(__previewOldState, false, true);
}

function nodeState (node) {
  let hS = 20 / node.fontSize;
  return {
    T: [
      (node.xMax ? (node.x + node.xMax) / 2 : (node.x + node.text.length * node.fontSize * 0.4)) - width / (3 * hS),
      node.y - height / (3 * hS)
    ],
    S: hS
  };
}

function depreviewNode () {
  if (previewNode.node) {
    previewNode.node.node.classList.remove('np-search-preview');
  }
}

function previewNode (node) {
  previewState(nodeState(node));

  node.node.classList.add('np-search-preview');

  previewNode.node = node;
}
previewNode.node = null;

function gotoNode (node) {
  gotoState(nodeState(node), false, true);
  depreviewNode();
}

function addRandomNodesToView (N) {
  addRandomNodes(
    1 * N,
    [T[0], T[0] + width / S],
    [T[1], T[1] + height / S],
    [0.02 / S, 20 / S]
  );
}

function _RESTART (new_nodes = nodes_default, new_places = _PLACES_default) {
  console.log('_RESTART');
  console.log('new_nodes=[' + new_nodes + ']');
  console.log('new_places=[' + new_places + ']');

  _NODES = [];
  newNodeID.N = 0;
  $('.node').remove();

  _PLACES = stripPlace(_PLACES_default);
  fillPlaces();

  new_nodes.map(stripNode).forEach(newNode);

  _HISTORY = [];
  _HISTORY_CURRENT_ID = null;
  genHistIDMap();
  fillHistoryList();

  console.log('restart');
  applyZoom([0, 0], 1, false, false);
}

_('#btnSaveFast').onclick = function (e) {
  save();
  e.stopPropagation();
};
