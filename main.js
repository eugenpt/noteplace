let M = 0;

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

  }, 500); // run update only every 100ms
});

const _FreeHand = new FreeHand()

node_container.ondblclick = function (e) {
  console.log('dblclick on empty field at [' + e.clientX + ',' + e.clientY + ']');
  console.log(_View.state);
  applyAction({
    type: 'A',
    nodes: [
      { text: 'test' + _NODES.length }
    ]
  });

  e.preventDefault();
  e.stopPropagation();

  setTimeout(function () {
    onNodeDblClick(_NODES[_NODES.length - 1].dom);
  }, 10);
};

function haveNodesSelection(){
  return _selected_DOM.length > 0;
}

function zoomInOut (inDegree, clientPos = null) {
  let centerX = 0;
  let centerY = 0;
  if (clientPos == null) {
    // basically - we pressed a +/- button
    if (haveNodesSelection()) {
      centerPos = calcCenterPos(_selected_DOM.map(domNode))

      clientPos = _View.posToClient(centerPos)
    } else {
      // just center
      clientPos = [width / 2, height / 2];
    }
  }
  _View.changeZoom(
    Math.pow(zoomK, inDegree),
    clientPos
  )
}

function fitInBorders(x, minX, maxX){
  return ( x > maxX ) ? maxX : ( x < minX ? minX : x);
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

let _Mouse = {
  is:  {
    down: false,
    downContentEdit: false,
    downPath: false,
    dragging: false,
    dragSelecting: false,
    resizing: false,
  },
  pos: [0, 0],
  clipboard: [],          // stores nodes with relative coordinates (x-centerX)*S
  dragSelected: [],
  rotatingNode: null,
  down:{
    pos: [0,0],
    T: [0,0],
    node: null,
  },
  drag:{
    start: [0, 0],
    pos: [0, 0],
    node: null,
  },
}

node_container.onmousedown = function (e) {
  console.log('container.onmousedown');
  console.log('T=' + _View.state.T + ' S=' + _View.state.S);
  
  if (_Mouse.is.resizing) {
    console.log('resizing..');
  } else {
    if (_Mouse.is.downContentEdit) {
      log('_Mouse.is.downContentEdit')
      _Mouse.is.downContentEdit = false;
    } else {
      log('!_Mouse.is.downContentEdit')
      _Mouse.down.pos = [e.clientX, e.clientY];
      _Mouse.down.T = [_View.state.T[0],_View.state.T[1]];
      _Mouse.is.down = true;

      if (_ContentEditing.textarea) {
        log('_ContentEditing.textarea')
        _ContentEditing.stop();
      }
    }

    if (e.shiftKey) {
      _Mouse.is.dragSelecting = true;

      _('#select-box').style.display = 'block';
      _('#select-box').style.width = 0;
      _('#select-box').style.height = 0;
      _('#select-box').style.top = e.clientX.toPx();
      _('#select-box').style.left = e.clientY.toPx();
    } else {
      if (_Mouse.down.node) {
        // pass
        log('_Mouse.down.node');
      } else {
        log('!_Mouse.down.node');
        // throw Error('aaa');
      setTimeout(function(){selectNode(null);},50);
      }
    }
  }
};

function hideSelectBox(){
  _('#select-box').style.display = 'none';
  _('#select-box').style.width = 0;
  _('#select-box').style.height = 0;
  _('#select-box').style.top = 0;
  _('#select-box').style.left = 0;
}

window.addEventListener('mouseup', function (e) {
  console.log('window onmouseup');
  // console.log('T=' + T + ' S=' + S);

  _Mouse.down.node = null;

  if (_Mouse.drag.node) {
    // stop dragging
    const A = { type: 'M' }

    if (_selected_DOM.contains(_Mouse.drag.node.dom)) {
      // moving all selected
      A.node_ids = _selected_DOM.map( dom => domNode(dom).id );
    } else {
      // moving just the one node
      A.node_ids = [ _Mouse.drag.node.id ];
    }
    A.oldValues = A.node_ids.map( id => idNode(id).startPos );
    A.newValues = A.node_ids.map( id => {
      const node = idNode(id);
      return { x: node.x, y: node.y}
    });

    applyAction(A);
    // save(_Mouse.drag.node);

    _Mouse.drag.node = false;
  } else if (_Mouse.is.dragSelecting) {
    hideSelectBox();

    _Mouse.is.dragSelecting = false;

    console.log('updating _Mouse.dragSelected..');
    updateDragSelect();
    console.log('now ' + _Mouse.dragSelected.length + ' _Mouse.dragSelected');

    console.log('pushing _Mouse.dragSelected doms to _selected_DOM');
    _Mouse.dragSelected.forEach((node) => {
      console.log(node.dom.id);
      _selected_DOM.push(node.dom);
    });
    _Mouse.dragSelected = [];
  } else if (_Mouse.rotatingNode) {

    rotateStop({}, {angle: { current: 0 } } );

  } else if (_Mouse.is.down) {
    // stop moving
    _View.state.T[0] = _Mouse.down.T[0] - 1 * node_container.dataset.x / _View.state.S;
    _View.state.T[1] = _Mouse.down.T[1] - 1 * node_container.dataset.y / _View.state.S;

    node_container.dataset.x = 0;
    node_container.dataset.y = 0;

    node_container.style.left = 0;
    node_container.style.top = 0;

    replaceHistoryState();

    redraw();
  }

  hideGridLine();
  _Mouse.is.resizing = false;
  _Mouse.is.down = false;
  _Mouse.is.downPath = false;
});

function tempSelect (node) {
  if (_selected_DOM.indexOf(node.dom) >= 0) {
    // already really selected
  } else {
    if (_Mouse.dragSelected.indexOf(node) < 0) {
      node.dom.classList.add('selected');

      _Mouse.dragSelected.push(node);
    }
  }
}

function tempDeselect (node) {
  console.log('deselecting: ' + node.dom.id);
  if (_selected_DOM.indexOf(node.dom) >= 0) {
    // selected previously..
  } else {
    node.dom.classList.remove('selected');
    _Mouse.dragSelected.splice(_Mouse.dragSelected.indexOf(node), 1);
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
  _Mouse.dragSelected.forEach((node) => {
    node.stillSelected = false;
  });
  _NODES.forEach((node) => {
    // if(node.vis){
    if (!node.deleted) {
      if (nodeIsInClientBox(node,
      [_Mouse.pos, _Mouse.down.pos]
      )) {
        tempSelect(node);
        node.stillSelected = true;
      }
    }
  });
  //
  _Mouse.dragSelected.forEach((node) => {
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

function nodeBox(node){
  return [[node.x, node.y], [node.xMax, node.yMax]];
}

function nodeIsInBox(node, box){
  return isInBox( nodeBox(node), box );
}

function nodeIsInClientBox(node, cBox){
  return nodeIsInBox(node, cBox.map((pos)=>clientToPos(pos)));
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

  node1prop = node1.dom.style[domProp].pxToFloat();
  node2prop = node2.dom.style[domProp].pxToFloat();
  node1prop2 = node1.dom.style[domProp2].pxToFloat();
  node2prop2 = node2.dom.style[domProp2].pxToFloat();

  _theGridAlignLines[prop].style[widthprop] = 1;
  _theGridAlignLines[prop].style[domProp] = Math.min( node1prop , node2prop ).toPx();

  let tx = Math.min( node1prop2 , node2prop2) - delta;
  // log('tx=');
  // log(tx);

  _theGridAlignLines[prop].style[domProp2] = tx.toPx();
  // log(_theGridAlignLines[prop].style[domProp2])
  _theGridAlignLines[prop].style[heightprop] = (Math.max( node1prop2 , node2prop2) - tx + 2 * delta ).toPx();

}

function hideGridLine(prop){
  // log(prop);
  if(prop == null){
    Object.keys(_theGridAlignLines).forEach( hideGridLine );
    return 0;
  }
  if(_theGridAlignLines[prop] !== null) {
    _theGridAlignLines[prop].style.display = 'none';
  }
}

container.onmousemove = function (e) {
  _Mouse.pos = [e.clientX, e.clientY];
  if (_Mouse.is.down) {
    if (_Mouse.drag.node) {
      const deltaMove = { 
        x: (e.clientX - _Mouse.drag.start[0]) / _View.state.S  ,
        y: (e.clientY - _Mouse.drag.start[1]) / _View.state.S
      }
      const sizeScreen = {
        x: width,
        y: height
      }
      let updatePosNodes = [_Mouse.drag.node];

      if (_Mouse.drag.node.dom.classList.contains('selected')) {
        // move all selected
        updatePosNodes = _selected_DOM.map(domNode);
      }

      for(let prop of ['x','y']){
        _Mouse.drag.node[prop] = _Mouse.drag.node.startPos[prop] + deltaMove[prop];

          allPropsMap = allVisibleNodesProps(prop, [_Mouse.drag.node]);

          allPropsAbs = [...allPropsMap.values()].map( v => Math.abs( v - _Mouse.drag.node[prop] ));
          minAbs = Math.min(...allPropsAbs)
          minJ = allPropsAbs.indexOf(minAbs);

          minDvh = minAbs * _View.state.S / sizeScreen[prop];

        if(minDvh < 0.01){
          //
          // log('seems like node '+[...allPropsMap.keys()][minJ]+' is OK, huh?');
          // _Mouse.drag.node[prop] = [...allPropsMap.values()][minJ];
          deltaMove[prop] = [...allPropsMap.values()][minJ] - _Mouse.drag.node.startPos[prop];

          gridAlignLine(_Mouse.drag.node, idNode([...allPropsMap.keys()][minJ]), prop);
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
        // _Mouse.drag.node.x = _Mouse.drag.node.startPos.x + deltaMove.x;
        // _Mouse.drag.node.y = _Mouse.drag.node.startPos.y + deltaMove.y;
        // calcBox(_Mouse.drag.node);
        // updateNode(_Mouse.drag.node);
      // }
    } else if (_Mouse.is.resizing) {
      // pass
    } else if (_Mouse.is.dragSelecting) {
      _('#select-box').style.left = Math.min(e.clientX, _Mouse.down.pos[0]).toPx();
      _('#select-box').style.width = Math.abs(e.clientX - _Mouse.down.pos[0]).toPx();
      _('#select-box').style.top = Math.min(e.clientY, _Mouse.down.pos[1]).toPx();
      _('#select-box').style.height = Math.abs(e.clientY - _Mouse.down.pos[1]).toPx();

      updateDragSelect();
      // clearTimeout(_dragSelectingTimeout);
      // _dragSelectingTimeout = setTimeout(updateDragSelect, 500);
    } else {
      // T[0] = _Mouse.down.T[0] -  (e.clientX - _Mouse.down.pos[0])/S;
      // T[1] = _Mouse.down.T[1] -  (e.clientY - _Mouse.down.pos[1])/S;
      node_container.dataset.x = (e.clientX - _Mouse.down.pos[0]);
      node_container.dataset.y = (e.clientY - _Mouse.down.pos[1]);
      node_container.style.left = node_container.dataset.x.toPx();
      node_container.style.top = node_container.dataset.y.toPx();

      // redraw()
    }
  }

  if(_previewNode){
    _previewNode.style.left = e.clientX;
    _previewNode.style.top = e.clientY;
  }
};

_previewNode = null;

// :::    ::: :::::::::: :::   ::: :::::::::   ::::::::  :::       ::: ::::    :::
// :+:   :+:  :+:        :+:   :+: :+:    :+: :+:    :+: :+:       :+: :+:+:   :+:
// +:+  +:+   +:+         +:+ +:+  +:+    +:+ +:+    +:+ +:+       +:+ :+:+:+  +:+
// +#++:++    +#++:++#     +#++:   +#+    +:+ +#+    +:+ +#+  +:+  +#+ +#+ +:+ +#+
// +#+  +#+   +#+           +#+    +#+    +#+ +#+    +#+ +#+ +#+#+ +#+ +#+  +#+#+#
// #+#   #+#  #+#           #+#    #+#    #+# #+#    #+#  #+#+# #+#+#  #+#   #+#+#
// ###    ### ##########    ###    #########   ########    ###   ###   ###    ####


function calcCenterPos (nodes) {
  const R = [0, 0];
  nodes.forEach(function (node) {
    R[0] += node.x;
    R[1] += node.y;
  });
  return [R[0] / nodes.length, R[1] / nodes.length];
}

function copySelectedNodesToClipboard (de_id = false) {
  if (('on' in copySelectedNodesToClipboard) && (copySelectedNodesToClipboard.on)) {
    // pass
  } else {
    copySelectedNodesToClipboard.on = true;
    _Mouse.clipboard = _selected_DOM.map(domNode).map(stripNode);
    const centerPos = calcCenterPos(_Mouse.clipboard);
    _Mouse.clipboard.forEach((node) => {
      // yeah, my definition of S is counterintuitive here..
      node.x = (node.x - centerPos[0]) * _View.state.S;
      node.y = (node.y - centerPos[1]) * _View.state.S;
      node.fontSize *= _View.state.S;
    });
  
    copyToClipboard(JSON.stringify(_Mouse.clipboard));
  
    copySelectedNodesToClipboard.on = false;
  }
}

window.addEventListener('keydown', (e) => {
  console.log('keydown');
  console.log(e);
  if (e.key === 'Delete') {
    if (_ContentEditing.textarea) {
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
    if (_ContentEditing.textarea) {
      e.stopPropagation();
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
      // copySelectedNodesToClipboard();
    }
  } else if (e.key === 'x') {
    if (e.ctrlKey) {
      // Ctrl-X
      // moved to cut event
      // copySelectedNodesToClipboard();
      // _selected_DOM.forEach(deleteNode);
      // _selected_DOM = [];
    }
  } else if (e.key === 'v') {
    if (e.ctrlKey) {
      // Ctrl-V !
      if (_ContentEditing.textarea) {
        // pass
      } else {
        // moved to window paste
      }
    }
  } else if (e.code === 'F3' || ((e.ctrlKey || e.metaKey) && e.code === 'KeyF')) {
    _('#search-toggle').click();
    e.preventDefault();
  } else if ((e.code == "KeyZ") && ( (e.ctrlKey) || (e.metaKey) )) {
    if (_ContentEditing.textarea){
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


let _oldValues = null;

function rotateStop(e, ui) {
  console.log('rotate stop');
  console.log(e);
  console.log(ui);



  // ui.angle.start = ui.angle.current;
  applyAction({
    type: 'E',
    node_ids: [ _Mouse.rotatingNode.id ],
    oldValues: _oldValues,
    newValues: [{ rotate: ui.angle.current }]
  });

  _Mouse.rotatingNode.dom.style.transform = 'rotate('+ui.angle.current+'rad)';
  save(_Mouse.rotatingNode);
  _Mouse.rotatingNode = null;
}

class Set{
  constructor(){
    this.arr = [];
  }

}

class NodeSelection{
  constructor() {
    this.nodes = [];
    this.control = null;
  }
  
  add(node){
    if (this.empty) {
      this.createControl();
    }
    this.nodes.push(node);
  }

  contains(node){
    return this.nodes.indexOf(node)>=0;
  }

  clear(){
    this.deleteControl();

    this.nodes = [];
  }

  get length() { return this.nodes.length; }
  get empty() { return this.nodes.length > 0; }

  createControl() {
    console.log('createControl placeholder');
  }

  deleteControl() {
    console.log('deleteControl placeholder');
  }
}

_Selection = new NodeSelection();



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


function deselectOneDOM (dom) {
  dom.classList.remove('selected');
  try {
    $(dom).rotatable('destroy');
  } catch(e) {
    // log('error in rotatable destroy..');
    // log(e);
  }

  try{
    $(domNode(dom).content_dom).resizable('destroy');
  } catch (e) {
    // console.log('some error in resizable destroy');
    // console.log(e);
  }
}


function selectOneDOM (dom) {
  dom.classList.add('selected');

  const node = domNode(dom);
  node.startPos = {x: node.x, y: node.y};

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
        _Mouse.rotatingNode = node;
      },
      stop: rotateStop
    };
    log(params);

    if($(dom)
      .find('.ui-rotatable-handle').length>0){
    }else
      $(node.dom).rotatable(params);

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
        _Mouse.rotatingNode = node;
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
    }else if(node.is_svg) {
      resizeParams.aspectRatio = true;
    }
    
    $(node.content_dom).resizable(resizeParams);
    $(dom)
      .find('.ui-resizable-handle')
      .on('mousedown', function (e) {
        console.log('resize mouse down');
        // e.stopPropagation();
        _Mouse.is.resizing = true;
      })
      .on('mouseup', function (e) {
        console.log('resize mouse up');
        // e.stopPropagation();
      });
  });
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

let _ContentEditing = {
  dom: null,
  textarea: null,
  stop: function(){
    log('_ContentEditing.stop');
    let tdom = _ContentEditing.textarea.parentElement.parentElement;
    _ContentEditing.textarea.parentElement.removeChild(_ContentEditing.textarea);
    const A = { type: 'D', node_ids: [ domNode(tdom).id ] };
    if (_ContentEditing.textarea.value === '') {
      //deleteNode(tdom);    
      _ContentEditing.dom = null;
    }else {
      A.type = 'E';
      A.oldValues = [ { text: domNode(tdom).startText } ];
      A.newValues = [ { text: domNode(tdom).text } ];
      // A.nodes = [ domNode(tdom) ];
      // newNode(tdom);
    }
    applyAction(A);
    _ContentEditing.textarea = null;
  },
  start: function(node){
  
  },
  isInProgress: function nodeEditInProgress() {
    return _ContentEditing.dom;
  },
}

// let _ContentEditing.dom = null;
// let _ContentEditing.textarea = null;

function textareaAutoResize (e) {
  var target = ('style' in e) ? e : this;
  target.style.height = 'auto';
  target.style.height = target.scrollHeight.toPx();
}

function textareaBtnDown (e) {
  log('textareaBtnDown');
  log(e);
  if ((e.ctrlKey) && ((e.keyCode === 0xA) || (e.keyCode === 0xD))) {
    log('Ctrl+Enter!');
    _ContentEditing.stop();
    e.stopPropagation();
    
  }
  if ((e.key === 'Enter') && (e.shiftKey)) {
    log('Shift-enter');
    const tnode_orig = domNode(_ContentEditing.dom.parentElement);
    const tnode = stripNode(tnode_orig);
    let th = _ContentEditing.dom.getBoundingClientRect().height;
    
    _ContentEditing.stop();

    if (_ContentEditing.isInProgress()) {
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
          (th / _View.state.S),
        text: '',
        fontSize: tnode.fontSize
      }]
    })

    setTimeout(function(){
      selectNode(null);

      console.log(_NODES[_NODES.length - 1].dom)
      selectNode(_NODES[_NODES.length - 1].dom);
  
      onNodeDblClick(_NODES[_NODES.length - 1].dom);
  
      // neither preventDefault nor stopPropagation
      //    stoped newline from appearing
      setTimeout(function () { 
        _ContentEditing.textarea.value = ''; 
        _ContentEditing.textarea.focus(); 
      }, 10);
    },10);

    e.stopPropagation();

  }

  if (e.key === 'Tab') {
    // Tab

    // no jump-to-next-field
    e.preventDefault();
  }

  // https://stackoverflow.com/a/3369624/2624911
  if (_ContentEditing.isInProgress()) {
    if (e.key === 'Escape') { // escape key maps to keycode `27`
      log('Escape!');
    
      selectNode(_ContentEditing.dom.parentElement);

      _ContentEditing.stop();

      e.stopPropagation();
    }
  }
}

function onNodeDblClick (e) {
  if ('preventDefault' in e) {
    _ContentEditing.dom = this;
  } else {
    _ContentEditing.dom = e;
  }

  if ( (!domNode(_ContentEditing.dom).is_svg)
       ||((domNode(_ContentEditing.dom).is_svg)
          &&(onNodeDblClick.path_ok))) {
  
    if ('preventDefault' in e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('double-clicked on [' + _ContentEditing.dom.id + '] : ' + _ContentEditing.dom.innerText);
    console.log(_ContentEditing.dom);
  
    const node = domNode(_ContentEditing.dom);
    node.startText = node.text;
  
    _ContentEditing.dom = _ContentEditing.dom.getElementsByClassName('np-n-c')[0];
  
    ta = document.createElement('textarea');
    ta.id = 'ta';
    ta.value = node.text;
  
    ta.dataset.initS = _View.state.S;
    ta.dataset.initWidth = Math.max(width / 3, _ContentEditing.dom.getBoundingClientRect().width + 20);
    ta.dataset.initHeight = _ContentEditing.dom.getBoundingClientRect().height;
    ta.style.width = ta.dataset.initWidth.toPx();
    ta.style.height = ta.dataset['initHeight'].toPx();
  
    ta.onkeydown = textareaBtnDown;
    ta.onkeyup = textareaAutoResize;
    ta.oninput = function (e) {
      console.log('ta input');
      domNode(this.parentElement.parentElement).text = this.value;
    };
  
    ta.onmousedown = (e) => {
      if (e.button === 1) {
        // drag on middle button => just pass the event
      } else {
        _Mouse.is.downContentEdit = true;
      }
    };
  
    _ContentEditing.dom.innerHTML = '';
    _ContentEditing.dom.appendChild(ta);
  
    ta.select();
    _ContentEditing.textarea = ta; 
  
  }
  onNodeDblClick.path_ok = false;
}


function onNodeMouseDown (e) {
  console.log('onNodeMouseBtn');
  console.log(this.id);

  if((!domNode(this).is_svg)||((domNode(this).is_svg)&&(onNodeMouseDown.path_ok))){
    _Mouse.down.node = domNode(this);
    // console.log(e);
    if (e.button === 1) {
      _Mouse.drag.node = _Mouse.down.node;
      _Mouse.drag.start = [e.clientX, e.clientY];
  
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
  })

  applyAction( {
    type: 'E',
    node_ids: node_ids,
    newValues: newValues
  })
}

function updateNode (node_) {
  let node = node_;
  if (node.hasOwnProperty('dom')) {
    dom = node.dom;
  } else {
    dom = node_;
    node = domNode(dom);
  }

  var pos = _View.posToClient(node.x, node.y);
  dom.style.left = pos[0].toPx();
  dom.style.top = pos[1].toPx();
  dom.style.fontSize = (node.fontSize * _View.state.S).toPx();

  dom.style.zIndex = Math.floor(200 - 10 * Math.log((node.fontSize) * _View.state.S ));

  let k = ( _View.state.S * node.fontSize / 20);

  if(node.is_svg){
    node.content_dom.style.position = 'relative';
    node.content_dom.style.left = '0px';
    node.content_dom.style.top = '0px';

    let ow = node.svg_dom.getAttribute('width')*1;
    let oh = node.svg_dom.getAttribute('height')*1
    node.content_dom.style.width = (ow * k).toPx();
    node.content_dom.style.height = (oh * k).toPx();
    node.dom.style.height = (oh * k).toPx();
    node.dom.style.width = (ow * k).toPx();
    node.svg_dom.style.transform = 'translate(-'+ow/2+'px,-'+oh/2+'px) scale(' + k + ')' +' translate('+ow/2+'px,'+oh/2+'px)';// + ' rotate('+node.rotate+'rad) ' ;
  }

  if(node.is_img){
    if(node.size){
      const h = 5 * (node.fontSize) * _View.state.S;
      const w =  h * node.size[0] / node.size[1];
      node.content_dom.style.width = w.toPx();
      node.content_dom.style.height = h.toPx();
      node.img_dom.style.width = w.toPx();
      node.img_dom.style.height = h.toPx();
    }
  }else{
    dom.getElementsByTagName('img').forEach( (e) => {
      e.style.width = 'auto';
      e.style.height = (100 * k).toPx();
    });
  }

  if (node.rotate !== 0) {
    if(dom.classList.contains('selected')){

    }else{
      dom.style.transform = 'rotate(' + node.rotate + 'rad)';
    }
  }
}

function updateSizes () {
  if (!('state' in updateSizes)) {
    updateSizes.state = '';
  }
  const state = JSON.stringify(_View.state);
  if (state === updateSizes.state) {
    // pass
  } else {
    for (let j = 0; j < _NODES.length; j++) {
      if (_NODES[j].vis) {
        const d = _NODES[j];
        d.xMax = d.x + d.dom.clientWidth / _View.state.S;
        d.yMax = d.y + d.dom.clientHeight / _View.state.S;
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
    (d.fontSize > 0.2 / _View.state.S)
    && _View.isBoxSeen(d.x, d.xMax, d.y, d.yMax)
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
    e.dom.style.display = 'none';
  } else {
    e.dom.style.display = '';
    calcVisible(e
      , function () { // onhide
        e.dom.style.opacity = 0;
        e.dom.style.display = 'none';
      }, function () { // onshow
        let oldTD = 0;
        if ('node' in e) {
          oldTD = e.dom.style.transitionDuration.slice(0, -1) * 1;
          e.dom.style.display = 'none';
        }
        updateNode(e);
        setTimeout(function () {
          e.dom.style.display = '';
          e.dom.style.opacity = 1;
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

  if (_ContentEditing.textarea) {
    console.log('redraw : contextEditTextarea');
    console.log('initWidth:');
    console.log(_ContentEditing.textarea.dataset.initWidth);
    console.log('initS: ' + _ContentEditing.textarea.dataset.initS);
    console.log('_ContentEditing.textarea.style.width = ' + _ContentEditing.textarea.style.width);
    _ContentEditing.textarea.style.width = 1 * _ContentEditing.textarea.dataset.initWidth * _View.state.S / (1 * _ContentEditing.textarea.dataset.initS).toPx();
    console.log('_ContentEditing.textarea.style.width = ' + _ContentEditing.textarea.style.width);
    _ContentEditing.textarea.style.height = _ContentEditing.textarea.dataset.initHeight * _View.state.S / _ContentEditing.textarea.dataset.initS.toPx();
  }

  if (_selected_DOM.length > 0) {
    _selected_DOM.forEach(dom => {
      let wrapper = dom.getElementsByClassName('ui-wrapper');

      if (wrapper.length > 0) {
        wrapper = wrapper[0];
        const img = wrapper.getElementsByTagName('img')[0];

        wrapper.style.width = (wrapper.style.width.pxToFloat() * _View.state.S / img.dataset.origS).toPx();
        wrapper.style.height = (wrapper.style.height.pxToFloat() * _View.state.S / img.dataset.origS).toPx();
        img.dataset.origS = _View.state.S;
      }
    });
  }
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
      && (history.state.T[0] == _View.state.T[0])
      && (history.state.T[1] == _View.state.T[1])
      && (history.state.S == _View.state.S));
}

function replaceHistoryState () {
  const url = window.location.href.indexOf('?') == -1
    ? window.location.href
    : window.location.href.slice(0, window.location.href.indexOf('?'));
  window.history.replaceState(
    _View.state,
    'Noteplace',
    url + _View.getStateURL());
  console.log('history replaced');
}

// const zoom_urlReplaceTimeout = setInterval(function () {
//   if (!isCurrentState()) {
//     replaceHistoryState();
//   }
// }, 200);

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
          wrapper.style.width = (wrapper.style.width.slice(0, -2) * k).toPx();
          wrapper.style.height = (wrapper.style.height.slice(0, -2) * k).toPx();
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

if (_('.node').length) {
  console.log('seems we already have nodes in HTML.');

  _localStorage.save();
} else {
  console.log('No nodes in html..');
  let nodes = [];
  let nodeIDs = [];
  try {
    nodeIDs = _localStorage.nodeIDs.load();
    nodes = nodeIDs.map(_localStorage.node.load);
  }catch (e) {
    console.trace(e);
    console.log('no nodes in localStorage, loading default');
    nodes = nodes_default;
  }
  nodes.forEach(n => {
    newNode(stripNode(n));
  });
}

try {
  _PLACES = _localStorage.places.load();
}catch (e) {
  _PLACES = stripPlace(_PLACES_default);
}

fillPlaces();

_localStorage.save();

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
  
  if (_ContentEditing.textarea) {
    // pass
  } else {
    // hmm, pasting something from the outside?
    copydiv.focus();

    if (1) {
      copydiv_observer = addOnContentChange(copydiv, function (e) {
        console.log('copydiv paste!');
        console.log(e);

        E = e;

        let tstuff = e.map( 
          je => je.addedNodes.map( 
            (n) => 'innerHTML' in n ? n.innerHTML:n.textContent 
          ).join('')
        ).join('');

        setTimeout(function () {
          tstuff = _('#copydiv').innerHTML;

          copydiv_observer.disconnect();
          copydiv.innerHTML = '';

          let json_parsed = false;
          if (tstuff[0] == '[') {
            try {
              _Mouse.clipboard = JSON.parse(
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
            console.log('Pasting JSON-parsed _Mouse.clipboard');
            selectNode(null);
            // paste Under the cursor?

            const A = { type: 'A', nodes: [] };

            _Mouse.clipboard.forEach((node) => {
              const nnode = stripNode(node);
              // de-duplicate if
              nnode.id = newNodeID(nnode.id);
              nnode.x /= _View.state.S;
              nnode.y /= _View.state.S;
              nnode.fontSize /= _View.state.S;
              const tmousePos = clientToPos(_Mouse.pos);
              nnode.x += tmousePos[0];
              nnode.y += tmousePos[1];

              A.nodes.push(nnode);

              // selectNode(newNode(nnode));
            });

            const h = applyAction(A);

            selectNode(h.node_ids.map( id => idNode(id).dom ));

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
            selectNode(_NODES[_NODES.length - 1].dom);
          }

        }, 50);
      });
    }
  }
});

window.addEventListener('cut', function (e) {
  console.log('window cut');
  console.log(e);
  if (_ContentEditing.textarea) {
    // pass
  } else {
    e.stopPropagation();
    e.preventDefault();
    copySelectedNodesToClipboard();
    _selected_DOM.forEach(deleteNode);
    _selected_DOM = [];
  }
});

window.addEventListener('copy', function (e) {
  console.log('window copy');
  console.log(e);
  if (_ContentEditing.textarea) {
    // pass
  } else {
    copySelectedNodesToClipboard();
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
    selectNode(_NODES[_NODES.length-1].dom);
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
  _View.goto(e.state);
};

// applyZoom(T,S, false);
_View.gotoURL(window.location.search, false);

// :::    ::: ::::::::::: ::::::::::: :::        ::::::::::: ::::::::::: :::   :::
// :+:    :+:     :+:         :+:     :+:            :+:         :+:     :+:   :+:
// +:+    +:+     +:+         +:+     +:+            +:+         +:+      +:+ +:+
// +#+    +:+     +#+         +#+     +#+            +#+         +#+       +#++:
// +#+    +#+     +#+         +#+     +#+            +#+         +#+        +#+
// #+#    #+#     #+#         #+#     #+#            #+#         #+#        #+#
//  ########      ###     ########### ########## ###########     ###        ###

function status (...arguments) {
  var s = arguments.map(toStr).join(', ');
  if ((arguments.length === 1) && (typeof (arguments[0]) === 'object')) {
    s = s.slice(1, s.length - 1);
  }
  console.log(s);
  _('#status').innerText = s
}

function addRandomNodesToView (N) {
  addRandomNodes(
    1 * N,
    [_View.state.T[0], _View.state.T[0] + width / _View.state.S],
    [_View.state.T[1], _View.state.T[1] + height / _View.state.S],
    [0.02 / _View.state.S, 20 / _View.state.S]
  );
}

function _RESTART (new_nodes = nodes_default, new_places = _PLACES_default, new_links=[]) {
  console.log('_RESTART');
  console.log('new_nodes=[' + new_nodes + ']');
  console.log('new_places=[' + new_places + ']');
  log('new_links=[' + new_links + ']');
  //
  _NODES = [];
  newNodeID.N = 0;
  $('.node').remove();
  //
  gen_DOMId2nodej();  _PLACES = stripPlace(_PLACES_default);
  fillPlaces();
  //
  new_nodes.forEach(n => {
    newNode(stripNode(n));
  });
  //
  _HISTORY = [];
  _HISTORY_CURRENT_ID = null;
  genHistIDMap();
  fillHistoryList();
  //
  console.log('restart');
  _View.applyZoom([0, 0], 1, false, false);
  //
  __GDRIVE_saveFilename = null;
  __GDRIVE_savedID = null;
}

_('#btnSaveFast').onclick = function (e) {
  _localStorage.save();
  if ( __GDRIVE_savedID != null ){
    gdriveRewrite(__GDRIVE_saveFilename, __GDRIVE_savedID);
  }
  e.stopPropagation();
};



fillHistoryList();
