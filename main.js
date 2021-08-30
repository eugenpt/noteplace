log(idNode(''))

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

let __freehandStatus = null; // null / 'ready' / 'drawing'
let __freehandPoints = [];
let __freehandPath = null;
let __freehandSVG = null;

function stopFreehand(){
  __freehandStatus = null;
  _('#btnFreehand').classList.remove('btn-primary');
  _('#btnFreehand').classList.add('btn-outline-primary');
  _('#freehandField').style.display = 'none';
}

function readyFreeHand(){
  __freehandStatus = 'ready';
  __freehandPoints = [];
  _('#btnFreehand').classList.add('btn-primary');
  _('#btnFreehand').classList.remove('btn-outline-primary');
  _('#freehandField').style.display = '';

  let svgns = 'http://www.w3.org/2000/svg';
  __freehandSVG = document.createElementNS(svgns,'svg');
  __freehandSVG.id = 'freehandSVG'
  // __freehandSVG.style.position = 'absolute';
  // __freehandSVG.style.left = '0px';
  // __freehandSVG.style.top = '0px';
  // __freehandSVG.style.zIndex = '999999';
  // __freehandSVG.style.opacity = '1';



  __freehandPath = document.createElementNS(svgns, 'path');
  __freehandPath.setAttribute( 'stroke', 'blue');
  __freehandPath.setAttribute( 'fill', 'none');
  __freehandPath.setAttribute( 'strokeWidth', '2');
  __freehandSVG.appendChild(__freehandPath);
  // __freehandSVG.setAttribute("width", width);
  // __freehandSVG.setAttribute("height", height);
  // container.appendChild(__freehandSVG);
  _('#freehandField').appendChild(__freehandSVG);
}

_('#btnFreehand').onclick = function() {
  if (__freehandStatus) {
    stopFreehand();
  } else {
    readyFreeHand();
  }
}

_('#freehandField').onmouseup = function (e) {
  console.log(e);
  // return 0
  stopFreehand();
  e.stopPropagation();

  const minPs = [0,0];
  const maxPs = [0,0];
  const d = 10;
  [0,1].forEach(j => {
    minPs[j] = -d + Math.min.apply(Math, __freehandPoints.map(a => a[j]));
    __freehandPoints.forEach(a => { a[j] -= minPs[j];});
    maxPs[j] = Math.max.apply(Math, __freehandPoints.map(a => a[j]));
  });
  drawFreehand();
  __freehandSVG.setAttribute('width', maxPs[0] + d )
  __freehandSVG.setAttribute('height', maxPs[1] + d )

  // setTimeout(function(){
  applyAction({
    type: 'A',

    nodes: [{
      text: __freehandSVG.outerHTML,
      mousePos: [ minPs[0] ,  minPs[1]],
      style: { color: '#0000ff', strokeWidth: 5, fill:'none'},
    }]
  })
  // }, 50);

  __freehandSVG.parentElement.removeChild(__freehandSVG);
}

_('#freehandField').onmousedown = function (e) {
  __freehandStatus = 'drawing';
  e.stopPropagation();
}

_('#freehandField').onmousemove = function (e) {
  if( __freehandStatus == 'drawing'){
    __freehandPoints.push([e.clientX, e.clientY]);
    drawFreehand();
  }
  e.stopPropagation();
}

function drawFreehand() {
  if (__freehandPoints.length > 3) {
    const ps = __freehandPoints;
    let dstr = '';

    dstr = 'M ' + ps[0][0] + ' ' + ps[0][1];

    for ( let j = 1 ; j < ps.length ; j++) {
      dstr += " L"+ps[j][0] + ' ' + ps[j][1];
    }

    // for ( let j = 0 ; j < ps.length - 2 ; j ++ ) {
    //   // const p0 = ps[j];
    //   // const p1 = ps[j+1];
    //   // const p2 = ps[j+2];

    //   dstr += ' C ' + ps.slice(j,j+3).map( p => p[0]+' '+p[1]).join(', ')
    // }

    __freehandPath.setAttributeNS(null, 'd', dstr);

  }
}


node_container.ondblclick = function (e) {
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
  // $('.np-n-c').css('transition-duration', s + 's');
  $('#container img').css('transition-duration', s + 's');
  $('#container svg').css('transition-duration', s + 's');
  // $('#container path').css('transition-duration', s + 's');
  // $('#container .ui-wrapper').css('transition-duration', s + 's');
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
let __isRotating = null;

node_container.onmousedown = function (e) {
  console.log('container.onmousedown');
  console.log('T=' + T + ' S=' + S);
  // $('.node').css('transition-duration','0s');
  // $('.node').removeClass('zoom'); // disable visible transition
  if (__isResizing) {
    console.log('resizing..');
  } else {
    if (contentEditMouseDown) {
      log('contentEditMouseDown')
      contentEditMouseDown = false;
    } else {
      log('!contentEditMouseDown')
      _mouseDownPos = [e.clientX, e.clientY];
      _mouseDownT = [T[0], T[1]];
      _isMouseDown = true;

      // console.log(e);
      // e.preventDefault();

      if (_contentEditTextarea) {
        log('_contentEditTextarea')
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
        log('__nodeMouseDown');
      } else {
        log('!__nodeMouseDown');
        // throw Error('aaa');
      setTimeout(function(){selectNode(null);},50);
      }
    }

    // if(_selected_DOM!==__nodeMouseDown){
    //   selectNode(null);
    // }
  }
};

let __pathMouseDown = false;

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
  } else if (__isRotating) {

    rotateStop({}, {angle: { current: 0 } } );

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

  hideGridLine();
  __isResizing = false;
  _isMouseDown = false;
  __pathMouseDown = false;

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
    if (!node.deleted) {
      if (isNodeInClientBox(node,
        Math.min(_mousePos[0], _mouseDownPos[0]), Math.max(_mousePos[0], _mouseDownPos[0]),
        Math.min(_mousePos[1], _mouseDownPos[1]), Math.max(_mousePos[1], _mouseDownPos[1])
      )) {
        tempSelect(node);
        node.stillSelected = true;
      }
    }
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

function allVisibleNodesProps(prop='x', except=[]){
  const except_ids = except.map( n => n.id )
  const R = new Map();
  for( let j=0 ; j<_NODES.length ; j++){
    const node = _NODES[j];
    if ((!node.vis)||(node.deleted))
      continue;
    if (except_ids.indexOf(node.id) >= 0)
      continue;

    R.set(node.id, node[prop]);
  }
  return R;
}

_theGridAlignLines = { x: null, y:null };

function gridAlignLine(node1, node2, prop){
  if(_theGridAlignLines[prop] == null){
    _theGridAlignLines[prop] = _ce('div'
      ,'className','grid-align-line'
    );
    node_container.appendChild(_theGridAlignLines[prop]);
  }
  _theGridAlignLines[prop].style.display = '';
  const prop2 = 'y';

  let widthprop = 'width';
  let heightprop = 'height';
  let domProp = 'left';
  let domProp2 = 'top';
  if(prop == 'y'){
    widthprop = 'height';
    heightprop = 'width';
    domProp = 'top';
    domProp2 = 'left';
  }

  const delta = 0;

  node1prop = node1.node.style[domProp].slice(0,-2) * 1;
  node2prop = node2.node.style[domProp].slice(0,-2) * 1;
  node1prop2 = node1.node.style[domProp2].slice(0,-2) * 1;
  node2prop2 = node2.node.style[domProp2].slice(0,-2) * 1;

  _theGridAlignLines[prop].style[widthprop] = 1;
  _theGridAlignLines[prop].style[domProp] = Math.min( node1prop , node2prop ) + 'px'

  let tx = Math.min( node1prop2 , node2prop2) - delta;
  // log('tx=');
  // log(tx);

  _theGridAlignLines[prop].style[domProp2] = tx + 'px';
  // log(_theGridAlignLines[prop].style[domProp2])
  _theGridAlignLines[prop].style[heightprop] = (Math.max( node1prop2 , node2prop2) - tx + 2 * delta ) +'px'

}

function hideGridLine(prop){
  // log(prop);
  if(prop == null){
    Object.keys(_theGridAlignLines).forEach( hideGridLine );
    return 0;
  }
  if(_theGridAlignLines[prop] !== null) {
    // log(_theGridAlignLines[prop]);
    _theGridAlignLines[prop].style.display = 'none';
    // node_container.removeChild(_theGridAlignLines[prop]);
    // _theGridAlignLines[prop] = null;
  }
}

container.onmousemove = function (e) {
  _mousePos = [e.clientX, e.clientY];
  if (_isMouseDown) {
    if (_isMouseDragging) {
      const deltaMove = {
        x: (e.clientX - _mouseDragStart[0]) / S  ,
        y: (e.clientY - _mouseDragStart[1]) / S
      }
      const sizeScreen = {
        x: width,
        y: height
      }
      let updatePosNodes = [_isMouseDragging];

      if (_isMouseDragging.node.classList.contains('selected')) {
        // move all selected
        updatePosNodes = _selected_DOM.map(domNode);
      }

      for(let prop of ['x','y']){
        _isMouseDragging[prop] = _isMouseDragging.startPos[prop] + deltaMove[prop];

          allPropsMap = allVisibleNodesProps(prop, [_isMouseDragging]);

          allPropsAbs = [...allPropsMap.values()].map( v => Math.abs( v - _isMouseDragging[prop] ));
          minAbs = Math.min(...allPropsAbs)
          minJ = allPropsAbs.indexOf(minAbs);

          minDvh = minAbs*S / sizeScreen[prop];

        if(minDvh < 0.01){
          //
          // log('seems like node '+[...allPropsMap.keys()][minJ]+' is OK, huh?');
          // _isMouseDragging[prop] = [...allPropsMap.values()][minJ];
          deltaMove[prop] = [...allPropsMap.values()][minJ] - _isMouseDragging.startPos[prop];

          gridAlignLine(_isMouseDragging, idNode([...allPropsMap.keys()][minJ]), prop);
        } else {
          hideGridLine(prop);
        }
      }
      updatePosNodes.forEach(function (node) {
        node.x = node.startPos.x + deltaMove.x;
        node.y = node.startPos.y + deltaMove.y;
        calcBox(node);
        updateNode(node);
      });
        // move the node under the cursor
        // _isMouseDragging.x = _isMouseDragging.startPos.x + deltaMove.x;
        // _isMouseDragging.y = _isMouseDragging.startPos.y + deltaMove.y;
        // calcBox(_isMouseDragging);
        // updateNode(_isMouseDragging);
      // }
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

  if(_previewNode){
    _previewNode.style.left = e.clientX;
    _previewNode.style.top = e.clientY;
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
    if (_contentEditTextarea) {
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
    if (_contentEditTextarea) {
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
      if (_contentEditTextarea) {
        // pass
      } else {
        // moved to window paste
      }
    }
  } else if (e.code === 'F3' || ((e.ctrlKey || e.metaKey) && e.code === 'KeyF')) {
    _('#search-toggle').click();
    e.preventDefault();
  } else if ((e.code == "KeyZ") && ( (e.ctrlKey) || (e.metaKey) )) {
    if (_contentEditTextarea){
      // pass
    }else{
      if (e.shiftKey){
        // Shift - Meta - Z = Re-do on Macs
        _('#btnRedo').click();
      }else{
        // Ctrl/Meta - Z
        _('#btnUndo').click();
      }
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
  } catch(e) {
    log('error in rotatable destroy..');
    log(e);
  }

  try{
    $(domNode(dom).content_dom).resizable('destroy');

    // [].forEach.call(dom.getElementsByTagName('img'), (e) => {
    //   $(e).resizable('destroy').css('width', 'auto');
    // });
  } catch (e) {
    console.log('some error in resizable destroy');
    console.log(e);
  }
}

let _oldValues = null;

function rotateStop(e, ui) {
  console.log('rotate stop');
  console.log(e);
  console.log(ui);



  // ui.angle.start = ui.angle.current;
  applyAction({
    type: 'E',
    node_ids: [ __isRotating.id ],
    oldValues: _oldValues,
    newValues: [{ rotate: ui.angle.current }]
  });

  __isRotating.node.style.transform = 'rotate('+ui.angle.current+'rad)';
  save(__isRotating);
  __isRotating = null;
}

function selectOneDOM (dom) {
  dom.classList.add('selected');

  const node = domNode(dom);
  node.startPos = {x: node.x, y: node.y};
  //
  // https://jsfiddle.net/Twisty/7zc36sug/
  // https://stackoverflow.com/a/62379454/2624911
  // https://jsfiddle.net/Twisty/cdLn56f1/
  $(function () {
    console.log('init rotation, rotate node_'+node.id+'='+node.rotate)
    const params = {
      radians: node.rotate,
      angle: node.rotate,
      start: function (e, ui) {
        console.log('rotate start');
        console.log(e);
        log(ui);
        _oldValues = [{ rotate: node.rotate }];
        __isRotating = node;
      },
      stop: rotateStop
    };
    log(params);

    if($(dom)
    .find('.ui-rotatable-handle').length>0){

    }else
      $(node.node).rotatable(params);


    $(dom)
      .find('.ui-rotatable-handle')
      .on('mouseup', function (e) {
        log('rotatable mouse up');
        log(e);
        // e.stopPropagation();
      })
      .on('click', function(e) {
        log('rotatable click');
        e.stopPropagation();
      })
      .on('dblclick', function (e) {
        log('rotatable dblclick');
        __isRotating = node;
        rotateStop({}, { angle: { current: 0 }});
        e.stopPropagation();
      })


    let resizeParams = {
      // autoHide: true,
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
          newValues: [{ fontSize: node.fontSize }]
        })
      },
      resize: function (e, ui) {
        node.fontSize = ui.size.height * _oldValues[0].fontSize / ui.originalSize.height;
        updateNode(node);
      }
    };

    if (node.is_img){
      resizeParams.aspectRatio = true;
      // node.size = [node.img_dom.]
    }else if(node.is_svg) {
      resizeParams.aspectRatio = true;
    } else {

    }
    $(node.content_dom).resizable(resizeParams);

    if(0)
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
  console.log('select')
  if ( n == null) {
    console.log('[null]')
    _selected_DOM.forEach(deselectOneDOM);
    _selected_DOM = [];
    return 0;
  }
  if (!Array.isArray(n)) {
    log(`[${n.id}]`);
    n = [n];
  } else {
    log( n.map( dom => dom.id) );
  }
  if (_selected_DOM.length > 0) {
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
    _selected_DOM = n.slice();
    _selected_DOM.forEach(selectOneDOM);
  }
  return 0;
}

function deleteNode (d) {
  if ('click' in d) {
    // DOM
    deleteNode(domNode(d));
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
  log('stopEditing');
  let tdom = _contentEditTextarea.parentElement.parentElement;
  _contentEditTextarea.parentElement.removeChild(_contentEditTextarea);
  const A = { type: 'D', node_ids: [ domNode(tdom).id ] };
  if (_contentEditTextarea.value === '') {
    //deleteNode(tdom);
    contentEditNode = null;
  }else {
    A.type = 'E';
    A.oldValues = [ { text: domNode(tdom).startText } ];
    A.newValues = [ { text: domNode(tdom).text } ];
    // A.nodes = [ domNode(tdom) ];
    // newNode(tdom);
  }
  applyAction(A);
  _contentEditTextarea = null;
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

  localStorage['noteplace.history'] = JSON.stringify( _HISTORY );
  localStorage['noteplace.history_current'] = _HISTORY_CURRENT_ID;

  const tsize = localStorageSize() / (1024 * 1024);
  if (tsize > 4) {
    console.error('localStorage ' + tsize.toFixed(3) + ' MB, limit is 5. you know what to do.');
  }
}

function isMenuShown(){
  return !_('#wrapper').classList.contains('toggled');
}

function showMenu(){
  if(!isMenuShown()){
    _('#menu-toggle').click();
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
let _contentEditTextarea = null;

function textareaAutoResize (e) {
  let target = this;
  if ('style' in e) {
    target = e;
  }
  target.style.height = 'auto';
  target.style.height = target.scrollHeight + 'px';
}

function textareaBtnDown (e) {
  log('textareaBtnDown');
  log(e);
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

    applyAction({
      type:'A',
      nodes: [{
        x: 1 * tnode.x,
        y: 1 * tnode.y +
          // + 1*tnode['fontSize']
          (th / S),
        text: '',
        fontSize: tnode.fontSize
      }]
    })
    // const new_node = newNode();

    setTimeout(function(){
      selectNode(null);

      console.log(_NODES[_NODES.length - 1].node)
      selectNode(_NODES[_NODES.length - 1].node);

      onNodeDblClick(_NODES[_NODES.length - 1].node);

      // neither preventDefault nor stopPropagation
      //    stoped newline from appearing
      setTimeout(function () { _contentEditTextarea.value = ''; _contentEditTextarea.focus(); }, 10);
    },10);
    // }, 30);

    e.stopPropagation();

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
    contentEditNode = this;
  } else {
    contentEditNode = e;
  }

  if((!domNode(contentEditNode).is_svg)||((domNode(contentEditNode).is_svg)&&(onNodeDblClick.path_ok))){

  if ('preventDefault' in e) {
    e.preventDefault();
    e.stopPropagation();
  }
  console.log('double-clicked on [' + contentEditNode.id + '] : ' + contentEditNode.innerText);
  console.log(contentEditNode);


  // console.log(contentEditNode);

  const node = domNode(contentEditNode);

  _contentEditTextarea = document.createElement('textarea');
  _contentEditTextarea.id = '_contentEditTextarea';
  _contentEditTextarea.value = node.text;

  node.startText = node.text;

  contentEditNode = contentEditNode.getElementsByClassName('np-n-c')[0];

  // _contentEditTextarea.style.fontSize = contentEditNode.dataset['fontSize']*S+'px';
  // _contentEditTextarea.style.fontFamily = 'Open Sans';
  _contentEditTextarea.dataset.initS = S;
  console.log(contentEditNode.getBoundingClientRect());
  _contentEditTextarea.dataset.initWidth = Math.max(width / 3, contentEditNode.getBoundingClientRect().width + 20);
  _contentEditTextarea.dataset.initHeight = contentEditNode.getBoundingClientRect().height;
  _contentEditTextarea.style.width = _contentEditTextarea.dataset.initWidth + 'px';
  _contentEditTextarea.style.height = _contentEditTextarea.dataset['initHeight'] +'px';
  // _contentEditTextarea.style.height = 'auto';

  _contentEditTextarea.onkeydown = textareaBtnDown;
  _contentEditTextarea.onkeyup = textareaAutoResize;
  _contentEditTextarea.oninput = function (e) {
    console.log('_contentEditTextarea input');
    domNode(this.parentElement.parentElement).text = this.value;
  };

  _contentEditTextarea.onmousedown = (e) => {
    if (e.button === 1) {
      // drag on middle button => just pass the event
    } else {
      contentEditMouseDown = true;
    }
  };

  contentEditNode.innerHTML = '';
  contentEditNode.appendChild(_contentEditTextarea);

  // textareaAutoResize(_contentEditTextarea);
  _contentEditTextarea.select();

  // selectNode(contentEditNode);

}
onNodeDblClick.path_ok = false;
}

__nodeMouseDown = null;



function onNodeMouseDown (e) {
  console.log('onNodeMouseBtn');
  console.log(this.id);

  if((!domNode(this).is_svg)||((domNode(this).is_svg)&&(onNodeMouseDown.path_ok))){

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
}
  if (e.ctrlKey) {
    e.preventDefault();
  }

  onNodeMouseDown.path_ok=false;
}

function onNodeClick (e) {
  console.log('clicked on [' + this.id + '] : ' + this.innerText);

  if((!domNode(this).is_svg)||((domNode(this).is_svg)&&(onNodeClick.path_ok))){

    if (e.shiftKey) {
      // multiselect!
      // selectNode(this); //already handled via drag-select
      // e.stopPropagation();
    } else {
      selectNode(null);
      selectNode(this);
    }

  }
  onNodeClick.path_ok = false;
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

function newNode (node, redraw=true, domOnly=false) {
  let tdom = node;
  // console.log(d);
  if ('className' in node) {
    console.log('newNode with DOM node provided:');
    // console.log(tn);
    node = domNode(tdom);
  } else {
    console.log('newNode with node provided');
    //%% Defaults.

    if ((!('id' in node)) || (node.id === undefined) 
       || ((idNode(node.id) !== undefined) && (node !== idNode(node.id)))) {
      var tid = node.id;
      node.id = newNodeID();
      log("changed id "+tid+"->"+node.id);
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


    if(!domOnly){
      _NODES.push(node);
      _NODEId2node.set(node.id, node);
      _DOMId2node.set(tdom.id, node);
      _DOMId2nodej.set(tdom.id, _NODES.length - 1);
    }

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
    , 'innerHTML', getHTML(node)
  );

  if(node.is_svg){
    node.svg_dom = tcontent.getElementsByTagName('svg')[0];

    node.path_dom = node.svg_dom.getElementsByTagName('path')[0];

    node.path_dom.setAttribute("stroke", node.style.color);
    node.path_dom.setAttribute("strokeWidth", node.style.strokeWidth);
    node.path_dom.setAttribute("fill", node.style.fill);


    node.svg_dom.onmousedown = function(e) {
      //if(onNodeMouseDown.path_ok)
    }
    node.path_dom.onmousedown = function (e) {
      onNodeMouseDown.path_ok = true;
    }

    node.path_dom.ondblclick = function (e) {
      onNodeDblClick.path_ok = true;
    }
    node.path_dom.onclick = function (e) {
      onNodeClick.path_ok = true;
    }
  }

  if(node.is_img){
    tdom.classList.add('img');
    //
    node.img_dom = tcontent.getElementsByTagName('img')[0];
    node.img_dom.onload = function(e) {
      console.log('img load');
      console.log(this);
    }
    node.img_dom.addEventListener('load',function () {
      console.log('node '+node.id+' img ready!!');
      node.size = [node.img_dom.width, node.img_dom.height];
    });
  }

  if (node.is_svg) {
    // tcontent.classList.add('svg');
    tdom.classList.add('svg');
  }

  node.node = tdom;
  node.content_dom = tcontent;

  // Tooltip
  tdom.appendChild(nodeDOMCreateTooltip(node));

  // apply styles
  for (const p of Object.keys(node.style)) {
    tcontent.style[p] = node.style[p];
  }
  tdom.appendChild(tcontent);

  //// Anchors things
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
  
  if (!('className' in node)) {
    node_container.appendChild(tdom);
  }

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
  } else {
    updateNode(node);
  }

  if(tdom.classList.contains('selected')){
    // deselectOneDOM(tdom);
    try{$(tdom).rotatable('destroy');}catch(e){}
    setTimeout(function(){selectOneDOM(tdom);},1);
  }

  return tdom;
}

function nodeDOMCreateTooltip(node){
  const tt = _ce('div'
    , 'className', 'position-absolute start-0 np-n-tooltip'// translate-middle start-50
  );

  if (node.is_img == false) {
    // not entirely image-based node, add color select
    const tcolorselect = _ce('input'
      , 'type', 'color'
      , 'value', node.style.color
      , 'oninput', function (e) {
        node.style.color = this.value;
        node.content_dom.style.color = this.value;
        if (node.is_svg) {
          node.path_dom.setAttribute("stroke", this.value);
        }
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
  }

  if((node.is_img == false) && (node.is_svg == false)){
    if (node.content_dom.innerHTML.indexOf('<br') >= 0) {
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
    , 'title', 'make BIGGER'
    , 'innerHTML', '<i class="bi bi-plus"></i>'
  );
  const tminusbtn = _ce('button'
    , 'className', 'np-n-t-btn minus-button'// 'btn btn-outline-primary'
    , 'onclick', function (e) { editFontSize(-1); e.stopPropagation(); }
    , 'title', 'Make smaller'
    , 'innerHTML', '<i class="bi bi-dash"></i>'
  );
  tt.appendChild(tplusbtn);
  tt.appendChild(tminusbtn);

  if (node.is_svg) {
    // add line width !!
    const tplusbtnLW = _ce('button'
      , 'className', 'np-n-t-btn plus-button'// btn btn-outline-primary'
      , 'onclick', function (e) { changeStrokeWidth(+1); e.stopPropagation(); }
      , 'title', 'make <b>thicker</b>'
      , 'innerHTML', '<div style="font-weight:900; transform:translate(-20%,0);">➖</span>'
    );
    const tminusbtnLW = _ce('button'
      , 'className', 'np-n-t-btn minus-button'// 'btn btn-outline-primary'
      , 'onclick', function (e) { changeStrokeWidth(-1); e.stopPropagation(); }
      , 'title', 'make thinner'
      , 'innerHTML', '<div style="font-weight:100;">—</span>'
    );
    tt.appendChild(tplusbtnLW );
    tt.appendChild(tminusbtnLW );
  }
  
  if (node.is_svg) { 
    // fill?
    const tbutton = _ce('button'
      ,'className', "np-n-t-btn"
    );
    const tlabel = _ce('label'
      ,'innerHTML', node.style.fill=='none'?'<i class="bi-bucket"></i>':'<i class="bi-bucket-fill"></i>'
      ,'ondblclick', function (e) {
        applyAction({
          type: 'E',
          node_ids: [node.id],
          oldValues: [{'style.fill': this.dataset['oldValue']}],
          newValues: [{'style.fill': 'none'}]
        });
        e.stopPropagation();
      }
    );
    tlabel.setAttribute('for','inputfill_'+node.id);
    if(node.style.fill!=='none'){
      tlabel.style.color = node.style.fill;
    }
    const tfillinput = _ce('input'
      ,'type','color'
      ,'value', node.style.fill=='none'?'#ffffff':node.style.fill
      ,'id','inputfill_'+node.id
      ,'style','width:0px;height:0px;'
      // ,'hidden','hidden'
      ,'oninput', function (e) {
        tlabel.style.color = this.value;
        node.style.fill = this.value;
        node.path_dom.setAttribute('fill', this.value);
        tlabel.innerHTML = '<i class="bi-bucket-fill"></i>';
      }
      ,'onchange', function (e) {
        applyAction({
          type: 'E',
          node_ids: [node.id],
          oldValues: [{'style.fill': this.dataset['oldValue']}],
          newValues: [{'style.fill': this.value}],
        });
      }
    )
    tfillinput.dataset['oldValue'] = node.style.fill;
    tbutton.appendChild(tlabel);
    tbutton.appendChild(tfillinput);
    // tt.appendChild(tfillinput);
    tt.appendChild(tbutton);
  }

  // no drag no nothing on clicks etc.
  for (var event of ['click', 'mousedown', 'mouseup', 'dblclick']){
    tt.addEventListener(event, function(e) {
      e.stopPropagation();
    })
  }

  return tt;
}


function changeStrokeWidth(delta=1){
  const node_ids = [];
  const newValues = [];

  const k = Math.pow(1.25, delta);

  _selected_DOM.forEach((dom) => {
    const node = domNode(dom);
    if (node.is_svg == false) {
      return 0;
    }

    node_ids.push(node.id);
    newValues.push( {
      'style.strokeWidth': (node.style.strokeWidth || 1) * k
    });
    // node.strokeWidth *= Math.pow(1.25, delta);
    // node.strokeWidth = Math.max(1, node.strokeWidth);
  })

  applyAction( {
    type: 'E',
    node_ids: node_ids,
    newValues: newValues
  })
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


  n.style.left = (d.x - T[0]) * S + 'px';
  n.style.top = (d.y - T[1]) * S + 'px';
  n.style.fontSize = (d.fontSize) * S + 'px';

  n.style.zIndex = Math.floor(200 - 10 * Math.log((d.fontSize) * S ));

  let k = (S * d.fontSize / 20);

  if(d.is_svg){
    d.content_dom.style.position = 'relative';
    d.content_dom.style.left = '0px';
    d.content_dom.style.top = '0px';


    let ow = d.svg_dom.getAttribute('width')*1;
    let oh = d.svg_dom.getAttribute('height')*1
    d.content_dom.style.width = ow * k + 'px';
    d.content_dom.style.height = oh * k + 'px';
    d.node.style.height = oh * k + 'px';
    d.node.style.width = ow * k + 'px';
    // d.content_dom.style.transform = 'scale(' + k + ')';
    d.svg_dom.style.transform = 'translate(-'+ow/2+'px,-'+oh/2+'px) scale(' + k + ')' +' translate('+ow/2+'px,'+oh/2+'px)';// + ' rotate('+d.rotate+'rad) ' ;
  // }else{
  }

  if(d.is_img){
    if(d.size){
      const h = 5 * (d.fontSize) * S;
      const w =  h * d.size[0] / d.size[1];
      d.content_dom.style.width = w + 'px';
      d.content_dom.style.height = h + 'px';
      d.img_dom.style.width = w + 'px';
      d.img_dom.style.height = h + 'px';//d.size[1] * k + 'px';
    }
  }else{
    [].forEach.call(n.getElementsByTagName('img'), (e) => {
      e.style.width = 'auto';
      e.style.height = 5 * (d.fontSize) * S + 'px';
      // e.setAttribute('draggable', false);
      // e.onmousedown = (e)=>{e.preventDefault();};
    });
  }

    if (d.rotate !== 0) {
      if(n.classList.contains('selected')){


      }else{
        n.style.transform = 'rotate(' + d.rotate + 'rad)';
      }

    }

  // setTimeout(function () {
  //   [].forEach.call(n.getElementsByClassName('ui-wrapper'), (wrapper) => {
  //     const img = wrapper.getElementsByTagName('img')[0];
  //     wrapper.style.height = img.style.height;
  //     wrapper.style.width = img.getBoundingClientRect.width;
  //     img.dataset.origS = S;
  //   })
  // }, 10);
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

  if (_contentEditTextarea) {
    console.log('redraw : contextEditTextarea');
    console.log('initWidth:');
    console.log(_contentEditTextarea.dataset.initWidth);
    console.log('initS: ' + _contentEditTextarea.dataset.initS);
    console.log('_contentEditTextarea.style.width = ' + _contentEditTextarea.style.width);
    _contentEditTextarea.style.width = 1 * _contentEditTextarea.dataset.initWidth * S / (1 * _contentEditTextarea.dataset.initS) + 'px';
    console.log('_contentEditTextarea.style.width = ' + _contentEditTextarea.style.width);
    _contentEditTextarea.style.height = _contentEditTextarea.dataset.initHeight * S / _contentEditTextarea.dataset.initS + 'px';
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

function getHTML (node) {
  if((node.text.slice(-4)=='svg>')
  && (node.text.slice(0,4)=='<svg')) {
    node.is_svg = true;
    node.is_img = false;
    return node.text;
  }else if ((node.text.slice(-1)=='>')
  && (node.text.slice(0,4)=='<img')) {
    node.is_img=true;
    node.is_svg = false;
    return node.text;
  } else {
    node.is_svg = false;
    node.is_img = false;
    return md.render(node.text)
      .slice(0, -1) // md.render adds newline (?)
      .replaceAll('\n', '<br />')
      .replace(/href="(\?[^"]+)"/, /class="local" onclick="zoomToURL('$1',false)"/);
    // .replaceAll(/(href="[^\?])/g,'onclick="(e)=>{console.log(e);e.stopPropagation();}" $1');
  }
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
        updateNode(dom);

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

function stripNode (d) {
  // strips only relevant data for nodes, also convert to numerical
  return {
    id: ('id' in d) ? d.id+'' : newNodeID(), // newNodeID(),//
    x: 1 * d.x,
    y: 1 * d.y,
    fontSize: 1 * d.fontSize,
    text: d.text,
    rotate: 'rotate' in d ? 1 * d.rotate:0,
    deleted: 'deleted' in d ? d.deleted : false,
    style: 'style' in d ? delete_defaults(d.style, default_node_style) : undefined
  };
}

_G = {}
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

  G.nodes.map(stripNode).forEach(newNode);


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

_FILETEXT = ''
_('#file').oninput = function () {
  let fr = new FileReader();
  fr.onload = function () {
    console.log('Received file..');
    
    _FILETEXT = fr.result
    loadFromG(JSON.parse(_FILETEXT));

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
  nodes.forEach(n => {
    newNode(stripNode(n));
  });
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
  if (_contentEditTextarea) {
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

            const h = applyAction(A);

            selectNode(h.node_ids.map( id => idNode(id).node ));

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
  if (_contentEditTextarea) {
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
  if (_contentEditTextarea) {
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

_previewNode = null;

container.addEventListener('dragenter', function (e) {
  console.log('container dragenter');
  console.log(e);
  log( e.dataTransfer.getData('text'))

  container.classList.add('drag-hover');

  if(_previewNode==null){
    _previewNode = newNode({
      text: _PLACES_dragContent || "<New Node>",
      mousePos: [e.clientX, e.clientY]
    }, true, true);


    _previewNode.onmousemove = function (e) {
      if(_previewNode){
        _previewNode.style.left = e.clientX-1;
        _previewNode.style.top = e.clientY-1;
      }
    }
    _previewNode.ondragover = function (e) {
      log('previewNode dragover');
    }

    console.log(_previewNode);
  } else{
    log('already previewing')
  }
  e.preventDefault();
});

container.addEventListener('dragleave', function (e) {
  console.log('container dragleave');
  container.classList.remove('drag-hover');
  // console.log(e);

  // node_container.removeChild(_previewNode);
  // _previewNode = null;

  e.preventDefault();
});

container.addEventListener('dragend', function (e) {
  console.log('container dragend');
  // node_container.removeChild(_previewNode);
  // _previewNode = null;
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

var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
  return new bootstrap.Toast(toastEl)
})

function toast(content) {
  _('.toast-body')[0].innerHTML = content;
  toastList[0].show();
}

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
  $('.np-search-preview').removeClass('np-search-preview');
// }

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

function _RESTART (new_nodes = nodes_default, new_places = _PLACES_default, new_links=null) {
  console.log('_RESTART');
  console.log('new_nodes=[' + new_nodes + ']');
  console.log('new_places=[' + new_places + ']');
  log('new_links=[' + new_links + ']');
  // Delete old nodes.
  _NODES = [];
  newNodeID.N = 0;
  $('.node').remove();
  // reindex
  gen_DOMId2nodej();
  // Places.
  _PLACES = stripPlace(_PLACES_default);
  fillPlaces();
  //
  new_nodes.forEach(n => {
    newNode(stripNode(n));
  });
  //
  _RESTART_links(new_links);
  //
  _HISTORY = [];
  _HISTORY_CURRENT_ID = null;
  genHistIDMap();
  fillHistoryList();
  //
  console.log('restart');
  applyZoom([0, 0], 1, false, false);
}

_('#btnSaveFast').onclick = function (e) {
  save();
  if ( __GDRIVE_savedID != null ){
    gdriveRewrite(__GDRIVE_saveFilename, __GDRIVE_savedID);
  }
  e.stopPropagation();
};



fillHistoryList();
