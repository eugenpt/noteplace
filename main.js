var md = new Remarkable('full', {
  html: true,
  typographer: true,
});

// https://stackoverflow.com/a/17111220/2624911
dragInitiated = false;

// Translate and Scale parameters
T = [0,0];
S = 1;


BODY = document.getElementsByTagName('body')[0];
M = 0;

_NODES = [];
_DOMId2node = new Map();

zoomMax = 1e14;
zoomMin = 1e-15;

zoomK = 1.6;

let container = _("#container");
let node_container = _("#node_container");


let _selected_DOM = [];


function toStr(a){
  return(typeof(a)=="number")?
    a.toExponential(2)
    :
    (Array.isArray(a)?
      ('['+a.map(toStr).join(', ')+']')
      :
      ((typeof(a)=='object')?
      '{'+Object.keys(a).map((k)=>k+':'+toStr(a[k])).join(', ')+'}'
      :a)
    );
}


function status() {
  if((arguments.length==1)&&(typeof(arguments[0])=='object')){
    var s = toStr(arguments[0]);
    _('#status').innerText = s.slice(1,s.length-1);
  }else
    _('#status').innerText = [... Array(arguments.length).keys()].map((j)=>toStr(arguments[j])).join(', ');
}

width = (window.innerWidth || document.documentElement.clientWidth || BODY.clientWidth);
height = window.innerHeight|| document.documentElement.clientHeight|| BODY.clientHeight;

resizeWatchTimeout = null;
window.addEventListener('resize', function(event){
  // do stuff here
  clearTimeout(resizeWatchTimeout);
  resizeWatchTimeout = setTimeout(function(){
    width = (window.innerWidth || document.documentElement.clientWidth || BODY.clientWidth);
    height = window.innerHeight|| document.documentElement.clientHeight|| BODY.clientHeight;
    
    // filterNodes2Draw();
    // redraw();
  },500); // run update only every 100ms
});


   //yeah, I don't like limits, but..
   //  without proper custom infinitely precise numbers 
   //   this is what I can do with js
   // 
   // Which seems OK, 26 orders of magnitude..
   //  is ~ the size of observable universe in meters
   //
   //   I know, I know, it would've been 
   //     way cooler if it was ~ size(universe)/size(atom nucleus)
   //       which is.. ~ 10^26/(10^-15) ~ 10^41

// var drag = d3.behavior.drag()
//     .origin(function(d) { return d; })
//     .on("dragstart", dragstarted)
//     .on("drag", dragged)
//     .on("dragend", dragended);


container.ondblclick = function(e) {
  console.log('dblclick on empty field at ['+e.clientX+','+e.clientY+']');
  console.log('T='+T+' S='+S);
  // console.log(e);
  var id = newId();
  var node = {
    id:id, 
    x:e.clientX/S + T[0], 
    y:e.clientY/S + T[1], 
    fontSize:20/S, 
    text:'test'+id
  }
  newdom = newNode(node);
  // no dblclick zoom!
  e.preventDefault();
  e.stopPropagation();
  
  onNodeDblClick(newdom);
}

function zoomInOut(in_degree, clientPos=null){
  if(clientPos==null){
    // basically - we pressed a +/- button
    if(_selected_DOM.length>0){
      // zoom to it!
      center_x = 0;
      center_y = 0;
      _selected_DOM.forEach((dom)=>{
        center_x += domNode(dom).x;
        center_y += domNode(dom).y;
      })
      center_x/=_selected_DOM.length;
      center_y/=_selected_DOM.length;

      clientPos = [
        (center_x-T[0])*S,
        (center_y-T[1])*S,
      ]
    }else{
      // just center
      clientPos = [width/2,height/2];
    }
  }
  mousePos =[T[0] + clientPos[0]/S , T[1] + clientPos[1]/S]
  S = Math.min(zoomMax,Math.max(zoomMin, S*Math.pow(zoomK,in_degree)))
  applyZoom(
    [mousePos[0] - clientPos[0]/S, mousePos[1]-clientPos[1]/S],
    S
  );
}

function onMouseWheel(e){
  console.log(e.deltaX, e.deltaY, e.deltaFactor);
  zoomInOut(e.deltaY<0 ? 1 : -1,  [e.clientX , e.clientY])
}

// $(container).on('mousewheel', onMouseWheel );
// _('#container').addEventListener("wheel", onMouseWheel);
// _('#node_container').addEventListener("wheel", onMouseWheel);

// $('#container').bind('mousewheel DOMMouseScroll', onMouseWheel);
// $('#container').scroll(onMouseWheel)

// safari?
window.addEventListener("wheel",onMouseWheel);

function applyZoom(T_, S_, smooth=true){
  console.log('S='+S+' S_='+S_);
  T = T_;

  ds = Math.abs(Math.log10(S/S_));
  console.log('ds='+ds);
  S = S_;

  if(smooth){
    $('.node').css('transition-duration',(0.2+ds)+'s');
  }else{
    $('.node').css('transition-duration','0s');
  }

  // $('.node').addClass('zoom');
  
  status({T:T,S:S});

  redraw();
}


_isMouseDown = false;
_mouseDownPos = [0,0];
_mouseDownT = [0,0];
_isMouseDragging = false;
_mouseDragStart = [0,0];
_mouseDragPos = [0,0];

_isDragSelecting = false;

container.onmousedown = function(e) {
  console.log('container.onmousedown');
  console.log('T='+T+' S='+S);
  $('.node').css('transition-duration','0s');
  // $('.node').removeClass('zoom'); // disable visible transition
  if(__isResizing){
    console.log('resizing..');
  }else{
    if(contentEditMouseDown){
      contentEditMouseDown = false;
    }else{
      _mouseDownPos = [e.clientX, e.clientY];
      _mouseDownT = [T[0],T[1]];
      _isMouseDown = true;

      // console.log(e);
      //e.preventDefault();

      if(contentEditTextarea){
        stopEditing();
      }
    }

    if(e.shiftKey){
      _isDragSelecting = true;

      _('#select-box').style.display = 'block';
      _('#select-box').style.width = 0;
      _('#select-box').style.height = 0;
      _('#select-box').style.top = e.clientX+'px';
      _('#select-box').style.left = e.clientY+'px';
    }else{

      if(__nodeMouseDown){

      }else{
        selectNode(null);
      }
    }
      
    // if(_selected_DOM!==__nodeMouseDown){
    //   selectNode(null);
    // }
  }
}

window.addEventListener('mouseup',function(e) {
  console.log('window onmouseup');
  // console.log(e);
  console.log('T='+T+' S='+S);

  __nodeMouseDown = null;

  if(_isMouseDragging){
    save(_isMouseDragging);

    _isMouseDragging = false;
  }else if(_isDragSelecting){
    _('#select-box').style.display = 'none';
    _('#select-box').style.width = 0;
    _('#select-box').style.height = 0;
    _('#select-box').style.top = 0;
    _('#select-box').style.left = 0;

    _isDragSelecting = false;

    console.log('updating _dragSelected..');
    updateDragSelect();
    console.log('now ' + _dragSelected.length +' _dragSelected');

    console.log('pushing _dragSelected doms to _selected_DOM')
    _dragSelected.forEach((node)=>{
      console.log(node.node.id);
      _selected_DOM.push(node.node);
    })
    _dragSelected = [];
  }else if(_isMouseDown){
    // stop moving 
    T[0] = _mouseDownT[0] - 1*node_container.dataset['x']/S;
    T[1] = _mouseDownT[1] - 1*node_container.dataset['y']/S;

    node_container.dataset['x'] = 0;
    node_container.dataset['y'] = 0;
    
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
})


_dragSelectingTimeout = null;
_dragSelected = [];

function tempSelect(node){
  if(_selected_DOM.indexOf(node.node)>=0){
    // already really selected
  }else{
    if(_dragSelected.indexOf(node)<0){
      node.node.classList.add('selected');

      _dragSelected.push(node);
    }
  }
}

function tempDeselect(node){
  console.log('deselecting: '+node.node.id)
  if(_selected_DOM.indexOf(node.node)>=0){
    // selected previously..
  }else{
    node.node.classList.remove('selected');
    _dragSelected.splice(_dragSelected.indexOf(node),1);
  }
}

function updateDragSelect(){
  // so the function os not run two times simultaneously
  if(!('on' in updateDragSelect)){
    updateDragSelect.on=true;    
  }else{
    if(updateDragSelect.on){
      setTimeout(updateDragSelect,100);
      return 0;
    }
  }
  //
  _dragSelected.forEach((node)=>{
    node.stillSelected=false;
  })
  _NODES.forEach((node)=>{
    // if(node.vis){
      if(isNodeInClientBox(node, 
          Math.min(_mousePos[0],_mouseDownPos[0]), Math.max(_mousePos[0],_mouseDownPos[0]),
          Math.min(_mousePos[1],_mouseDownPos[1]), Math.max(_mousePos[1],_mouseDownPos[1])
        )){
        tempSelect(node);
        node.stillSelected = true;
      }
    // }
  })
  //
  _dragSelected.forEach((node)=>{
    if(node.stillSelected == false){
      tempDeselect(node);
    }    
  })
  //
  updateDragSelect.on = false;
}

function isNodeInBox(node, bxMin, bxMax, byMin, byMax){
  return isInBox(
      node.x, node.xMax, node.y, node.yMax, 
      bxMin, bxMax, byMin, byMax
    )
}

function clientToNode(pos){
  return [T[0] + pos[0]/S, T[1] + pos[1]/S];
}

function isNodeInClientBox(node, cbxMin, cbxMax, cbyMin, cbyMax){
  bMin = clientToNode([cbxMin, cbyMin])
  bMax = clientToNode([cbxMax, cbyMax])
  return isInBox(
      node.x, node.xMax, node.y, node.yMax, 
      bMin[0], bMax[0], bMin[1], bMax[1]
    )
}

_mousePos = [0,0];
container.onmousemove = function(e){
  _mousePos = [e.clientX,e.clientY];
  if(_isMouseDown){
    if(_isMouseDragging){
      if(_isMouseDragging.node.classList.contains('selected')){
        // move all selected
        _selected_DOM.forEach(function(dom){
          node = _DOMId2node.get(dom.id)
          node['x'] = node.startPos[0] +  (e.clientX - _mouseDragStart[0])/S;
          node['y'] = node.startPos[1] +  (e.clientY - _mouseDragStart[1])/S;
          calcBox(node);
          updateNode(node)
        })
      }else{
        // move the node under the cursor
        _isMouseDragging['x'] = _mouseDragPos[0] +  (e.clientX - _mouseDragStart[0])/S;
        _isMouseDragging['y'] = _mouseDragPos[1] +  (e.clientY - _mouseDragStart[1])/S;
        calcBox(_isMouseDragging);
        updateNode(_isMouseDragging)
      }
    }else if(__isResizing){

    }else if(_isDragSelecting){
      _('#select-box').style.left = Math.min(e.clientX, _mouseDownPos[0])+'px' 
      _('#select-box').style.width = Math.abs(e.clientX  - _mouseDownPos[0])+'px';
      _('#select-box').style.top = Math.min(e.clientY, _mouseDownPos[1])+'px' 
      _('#select-box').style.height = Math.abs(e.clientY - _mouseDownPos[1])+'px';

      updateDragSelect();
      // clearTimeout(_dragSelectingTimeout);
      // _dragSelectingTimeout = setTimeout(updateDragSelect, 500);
    }else{

      // T[0] = _mouseDownT[0] -  (e.clientX - _mouseDownPos[0])/S;
      // T[1] = _mouseDownT[1] -  (e.clientY - _mouseDownPos[1])/S;
      node_container.dataset['x'] = (e.clientX - _mouseDownPos[0]);
      node_container.dataset['y'] = (e.clientY - _mouseDownPos[1]);
      node_container.style.left = node_container.dataset['x'] + 'px';
      node_container.style.top = node_container.dataset['y'] + 'px';

      // redraw()
    }
  }
}

// :::    ::: :::::::::: :::   ::: :::::::::   ::::::::  :::       ::: ::::    ::: 
// :+:   :+:  :+:        :+:   :+: :+:    :+: :+:    :+: :+:       :+: :+:+:   :+: 
// +:+  +:+   +:+         +:+ +:+  +:+    +:+ +:+    +:+ +:+       +:+ :+:+:+  +:+ 
// +#++:++    +#++:++#     +#++:   +#+    +:+ +#+    +:+ +#+  +:+  +#+ +#+ +:+ +#+ 
// +#+  +#+   +#+           +#+    +#+    +#+ +#+    +#+ +#+ +#+#+ +#+ +#+  +#+#+# 
// #+#   #+#  #+#           #+#    #+#    #+# #+#    #+#  #+#+# #+#+#  #+#   #+#+# 
// ###    ### ##########    ###    #########   ########    ###   ###   ###    #### 

_clipBoard = []; // stores nodes with relative coordinates (x-centerX)*S

function calcCenterPos(nodes){
  var R=[0,0];
  nodes.forEach(function(node){
    R[0]+=node.x;
    R[1]+=node.y;
  })
  return [R[0]/nodes.length, R[1]/nodes.length]
}

function copySelection(){
  copySelection.on=true;
  _clipBoard = _selected_DOM.map(domNode).map(stripNode);
  var centerPos = calcCenterPos(_clipBoard);
  _clipBoard.forEach((node)=>{
    // yeah, my definition of S is counterintuitive here..
    node.x = (node.x - centerPos[0])*S;
    node.y = (node.y - centerPos[1])*S;
    node.fontSize *= S;
  })

  copyToClipboard(JSON.stringify(_clipBoard));

  copySelection.on=false;
}

window.addEventListener('keydown',(e)=>{
  console.log('keydown');
  console.log(e);
  if(e.key=="Delete"){
    if(_selected_DOM.length>0){
      _selected_DOM.forEach(deleteNode);
      save('ids');
    }
  }else if(e.key=='Enter'){
    if(contentEditTextarea){
      return 0;
    }else{
      if(_selected_DOM.length>0){
        // select, start editing
        onNodeDblClick(_selected_DOM[0]);
        // stop so that Enter does not overwrite the node content
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }else if(e.key=='c'){
    if(e.ctrlKey){
      // Ctrl-C !
      // moved to copy event
      // copySelection();
    }
  }else if(e.key=='x'){
    if(e.ctrlKey){
      // Ctrl-X
      // moved to cut event
      // copySelection();
      // _selected_DOM.forEach(deleteNode);
      // _selected_DOM = [];
    }
  }else if(e.key=='v'){
    if(e.ctrlKey){
      // Ctrl-V !
      if(contentEditTextarea){

      }else{
        // if anything is copied
        if(0){//_clipBoard.length>0){      
          // deselect all
          selectNode(null);
          // paste Under the cursor?
          
          _clipBoard.forEach((node)=>{
            var nnode = stripNode(node);
            nnode.x /= S;
            nnode.y /= S;
            nnode.fontSize /= S;
            var tmousePos = clientToNode(_mousePos);
            nnode.x += tmousePos[0];
            nnode.y += tmousePos[1];
            
            selectNode(newNode(nnode));
          })

        }else{

          // setTimeout(function(){
          //   // read copied
          //   tstuff = _('#copydiv').innerHTML;
          //   console.log(tstuff);
          //   selectNode(newNode({
          //     text:tstuff
          //   }))
          // },50)
        }
      }
    }
  }
})

__IMG = null

__isResizing = false;



__X = null;

function deselectOneDOM(dom){
  dom.classList.remove('selected');
  try{
  $(dom).rotatable('destroy');
  
  [].forEach.call(dom.getElementsByTagName('img'),(e)=>{
    $(e).resizable('destroy').css('width','auto');
  });
  } catch{

  }
}

function selectOneDOM(dom){
  dom.classList.add('selected');

  node = _DOMId2node.get(dom.id);
  node.startPos = [node.x, node.y];
  //
  //https://jsfiddle.net/Twisty/7zc36sug/
  //https://stackoverflow.com/a/62379454/2624911
  //https://jsfiddle.net/Twisty/cdLn56f1/
  $(function() {
    var params = {
      start:function(e){
        console.log('rotate start');
        console.log(e);
      },
      stop:function(e, ui){
        console.log('rotate stop');
        console.log(e);
        console.log(ui);

        // ui.angle.start = ui.angle.current;
        _DOMId2node.get(e.target.id)["rotate"] = ui.angle.current;
        save(e.target);
      }
     };

     $(dom).rotatable(params);

    [].forEach.call(dom.getElementsByTagName('img'),(img)=>{
      console.log('making that img resizable:');
      console.log(img);
      img.dataset['parent_node_id'] = dom.id;
      __IMG = img;
      $(img).resizable({
        aspectRatio: true,
        start:function(e,ui){
          console.log('resize start');
          console.log(e);
          console.log(ui);
        },
        stop:function(e,ui){
          console.log('resize stop');
          console.log(e);
          console.log(ui);
          var hid = ui.originalElement[0].dataset['id'];
          _DOMId2node.get(hid)['fontSize'] = ui.size.height/(5*S);
          save(_DOMId2node.get(hid));
          updateNode(_('#'+hid));
          // ui.originalElement.style.width='auto';
          __X = ui;
        }
      });
    })
    $(dom)
      .find('.ui-resizable-handle')
      .on('mousedown',function(e){
        console.log('resize mouse down');
        // e.stopPropagation();
        __isResizing = true;
      })
      .on('mouseup',function(e){
        console.log('resize mouse up');
        // e.stopPropagation();
      })
    
  });
}

function selectNode(n){
  console.log('select : ['+(n?n.id:'null')+']')
  if(n){
    if(_selected_DOM.length>0){
      if(!Array.isArray(n)){
        n = [n];
      }
      // see how many are new ones
      if(n.every((dom)=>dom.classList.contains('selected'))){
        // if all are already selected - deselect them!
        n.forEach(deselectOneDOM);
        n.forEach((dom)=>{
          _selected_DOM.splice(_selected_DOM.indexOf(dom));
        })
      }else{
        // if only some are already selected - add all new ones
        for(var dom of n){
          if(dom.classList.contains('selected')){
            continue;
          }else{              
            selectOneDOM(dom);
            _selected_DOM.push(dom);
          }
        }
      }
    }else{
      if(!Array.isArray(n)){
        n = [n];
      }
      _selected_DOM = n.slice();
      _selected_DOM.forEach(selectOneDOM);
    }
  }else{
    if(_selected_DOM.length>0){
      _selected_DOM.forEach(deselectOneDOM);
      _selected_DOM = [];
    }
  }

  if(_selected_DOM.length==1){
    _('#text').disabled = false;
    _('#fontSize').disabled = false;
    _('#text').value = domNode(_selected_DOM[0])['text'];
    _('#fontSize').value = domNode(_selected_DOM[0])['fontSize'];
    _('#fontSize').step = _('#fontSize').value * 0.25;
  }else{
    _('#text').disabled = true;
    _('#fontSize').disabled = true;
    _('#text').value = '';
    _('#fontSize').value = '';   
  }
  return 0;
  if(_selected_DOM.length>0){ //remove class
    _selected_DOM.classList.remove('selected');
    try{
    $(_selected_DOM).rotatable('destroy');
    
    [].forEach.call(_selected_DOM.getElementsByTagName('img'),(e)=>{
      $(e).resizable('destroy').css('width','auto');
    });
    } catch{

    }
  }
  _selected_DOM = n;
  if(_selected_DOM.length>0){// apply class, setup editing tools

          
    //   
  }else{// just deselect => clear inputs
    
    _('#text').disabled = true;
    _('#fontSize').disabled = true;
    _('#text').value = '';
    _('#fontSize').value = '';
  }
}


_DOMId2nodej = new Map()
function gen_DOMId2nodej(){
  _DOMId2nodej = new Map()
  for(var j=0;j<_NODES.length;j++){
    _DOMId2nodej.set(_NODES[j].node.id,j);
  }
}

function deleteNode(d){
  if('click' in d){
    // DOM
    deleteNode(_DOMId2node.get(d.id))
  }else{
    // _NODES
    // ixs (TODO:optimize further)
    gen_DOMId2nodej();
    // remove rom _NODES
    _NODES.splice(_DOMId2nodej.get(d.node.id),1);
    // remove from index
    _DOMId2node.delete(d.node.id);
    // remove from DOM
    node_container.removeChild(d.node);
    // remove from saved
    localStorage.removeItem('noteplace.'+d.node.id);
  }
}

function stopEditing(){
  if(contentEditTextarea.value==''){
    deleteNode(contentEditTextarea.parentElement);
  }else{
    newNode(contentEditTextarea.parentElement);
  }
  contentEditTextarea = null;
}


function save(node=null, save_ids=true){
  // save node state to localStorage.
  //  if node === null, saves all nodes
  //  if node == 'ids', saves ids
  // additional argument:
  //  save_ids [bool] : true => save ids too
  if(node === null){
    // save all
    node_ids = [];
    _NODES.forEach((node)=>{
      save(node, false);
      node_ids.push(node['id']);
      // nodes.push(JSON.parse(JSON.stringify(node.dataset)));
    });
    localStorage['noteplace.node_ids'] = JSON.stringify(node_ids);
  }else if(node=='ids'){
    save_ids = true;
  }else{
    // node provided, save only node
    if('x' in node){
      // original object
      localStorage['noteplace.node_'+node.id] = JSON.stringify(stripNode(node));
    }else{
      // DOM node
      localStorage['noteplace.'+node.id] = JSON.stringify(stripNode(domNode(node)));
    }
  }
  if(save_ids){
    localStorage['noteplace.node_ids'] = JSON.stringify(
      _NODES.map((node)=>node.id)
    )
  }
}





// ::::    :::  ::::::::  :::::::::  ::::::::::      :::::::::: :::    ::: ::::    :::  ::::::::   ::::::::  
// :+:+:   :+: :+:    :+: :+:    :+: :+:             :+:        :+:    :+: :+:+:   :+: :+:    :+: :+:    :+: 
// :+:+:+  +:+ +:+    +:+ +:+    +:+ +:+             +:+        +:+    +:+ :+:+:+  +:+ +:+        +:+        
// +#+ +:+ +#+ +#+    +:+ +#+    +:+ +#++:++#        :#::+::#   +#+    +:+ +#+ +:+ +#+ +#+        +#++:++#++ 
// +#+  +#+#+# +#+    +#+ +#+    +#+ +#+             +#+        +#+    +#+ +#+  +#+#+# +#+               +#+ 
// #+#   #+#+# #+#    #+# #+#    #+# #+#             #+#        #+#    #+# #+#   #+#+# #+#    #+# #+#    #+# 
// ###    ####  ########  #########  ##########      ###         ########  ###    ####  ########   ########  


contentEditNode = null;
contentEditMouseDown = false;
contentEditTextarea = null;

function textareaAutoResize(e){
  if('style' in e){
    target = e;
  }else{
    target = this;
  }
  target.style.height = 'auto';
  target.style.height = target.scrollHeight + 'px';
}

function textareaBtnDown(e){
  if((e.ctrlKey) && ((e.keyCode == 0xA)||(e.keyCode == 0xD))){
    // Ctrl+Enter
    stopEditing();
  }
  if((e.keyCode == 13) && (e.shiftKey)){
    // Shift+Enter
    stopEditing();

    selectNode(null);
    tnode = domNode(contentEditNode)
    var new_node = newNode({
      x:tnode['x'],
      y:1*tnode['y']
        // + 1*tnode['fontSize']
        + (contentEditNode.getBoundingClientRect().height/S),
      x:tnode['x'],
      text:'',
      fontSize:tnode['fontSize'],
    })
    
    selectNode(new_node);

    onNodeDblClick(new_node);

    // neither preventDefault nor stopPropagation
    //    stoped newline from appearing
    setTimeout(function(){contentEditTextarea.value='';},10);
  }

  if (e.keyCode == 9){
    //Tab
    


    // no jump-to-next-field
    e.preventDefault();
  }

  //https://stackoverflow.com/a/3369624/2624911
  if(contentEditNode){
    if (e.key === "Escape") { // escape key maps to keycode `27`
      
      selectNode(contentEditNode);
      
      stopEditing();
          
      e.stopPropagation();    
    }
  }
}

function sameState(){
  return ((history.state)
        &&('T' in history.state)
        &&(history.state.T[0] == T[0])
        &&(history.state.T[1] == T[1])
        &&('S' in history.state)
        &&(history.state.S == S)
  )
}

zoom_urlReplaceTimeout = setInterval(function(){
  // console.log('history replaced');
  if(!sameState()){
    url = window.location.href.indexOf('?')==-1 ? window.location.href : window.location.href.slice(0,window.location.href.indexOf('?'))
    window.history.replaceState(
        {T:T,S:S}, 
        'Noteplace', 
        url + '?Tx='+T[0]+'&Ty='+T[1]+'&S='+S);
  }
}, 200);

function onNodeDblClick(e){
  if('preventDefault' in e){
    e.preventDefault();
    e.stopPropagation();

    contentEditNode = this;
  }else{
    contentEditNode = e;
  }


  console.log('double-clicked on ['+contentEditNode.id+'] : '+contentEditNode.innerText);
  console.log(this);

  // console.log(contentEditNode);

  contentEditTextarea = document.createElement('textarea');
  contentEditTextarea.id = 'contentEditTextarea';
  contentEditTextarea.value = _DOMId2node.get(contentEditNode.id)['text'];
  // contentEditTextarea.style.fontSize = contentEditNode.dataset['fontSize']*S+'px';
  // contentEditTextarea.style.fontFamily = 'Open Sans';
  contentEditTextarea.dataset['initS'] = S;
  contentEditTextarea.dataset['initWidth'] = Math.max(width/3, contentEditNode.getBoundingClientRect().width+20);
  contentEditTextarea.dataset['initHeight'] = contentEditNode.getBoundingClientRect().height;
  contentEditTextarea.style.width = contentEditTextarea.dataset['initWidth'] +'px';
  contentEditTextarea.style.height = contentEditTextarea.dataset['initHeight'] +'px';
  
  contentEditTextarea.onkeydown = textareaBtnDown;
  contentEditTextarea.onkeyup = textareaAutoResize;
  contentEditTextarea.oninput = function(e){
    _DOMId2node.get(this.parentElement.id)['text'] = this.value;
  }
  
  contentEditTextarea.onmousedown = (e)=>{
    if(e.button==1){
      // drag on middle button => just pass the event
    }else{
      contentEditMouseDown = true;
    }
  }

  contentEditNode.innerHTML = '';
  contentEditNode.appendChild(contentEditTextarea);

  textareaAutoResize(contentEditTextarea);
  contentEditTextarea.select();

  // selectNode(contentEditNode);
}


function now(){
  return new Date().getTime();
}

__nodeMouseDown = null;

function domNode(dom){
  return _DOMId2node.get(dom.id);
}

function onNodeMouseDown(e){
  console.log('onNodeMouseBtn');
  console.log(this.id);

  __nodeMouseDown = _DOMId2node.get(this.id);
  // console.log(e);
  if(e.button==1){
    _isMouseDragging = __nodeMouseDown;
    _mouseDragStart = [e.clientX, e.clientY];
    _mouseDragPos = [1*__nodeMouseDown['x'], 1*__nodeMouseDown['y']];

    if(this.classList.contains('selected')){
      // save all selected positions
      _selected_DOM.forEach((dom)=>{
        var node = domNode(dom);
        node.startPos = [node.x, node.y];
      })
    }

    e.preventDefault();
  }if(e.button==0){
    // left mouse button
    console.log(e);
    
  }else{

  }

  if(e.ctrlKey){
    e.preventDefault();
  }
}

function onNodeClick(e){
  console.log('clicked on ['+this.id+'] : '+this.innerText);

  if(e.shiftKey){
    // multiselect!
    selectNode(this);
    e.stopPropagation();
  }else{
    selectNode(null);
    selectNode(this);
  }
}


// https://stackoverflow.com/a/1535650/2624911
function newId(){
  // Check to see if the counter has been initialized
  if ( typeof newId.N == 'undefined' ) {
      // It has not... perform the initialization
      newId.N = 0;
  }  
  while(getNode(newId.N)){
    newId.N++;
  }
  newId.N++;
  return newId.N-1;
}

// ::::    ::: :::::::::: :::       ::: ::::    :::  ::::::::  :::::::::  :::::::::: 
// :+:+:   :+: :+:        :+:       :+: :+:+:   :+: :+:    :+: :+:    :+: :+:        
// :+:+:+  +:+ +:+        +:+       +:+ :+:+:+  +:+ +:+    +:+ +:+    +:+ +:+        
// +#+ +:+ +#+ +#++:++#   +#+  +:+  +#+ +#+ +:+ +#+ +#+    +:+ +#+    +:+ +#++:++#   
// +#+  +#+#+# +#+        +#+ +#+#+ +#+ +#+  +#+#+# +#+    +#+ +#+    +#+ +#+        
// #+#   #+#+# #+#         #+#+# #+#+#  #+#   #+#+# #+#    #+# #+#    #+# #+#        
// ###    #### ##########   ###   ###   ###    ####  ########  #########  ########## 


function newNode(node){
  // console.log(d);
  if('className' in node){
    tdom = node;
    console.log('newNode with DOM node provided:');
    // console.log(tn);
    node = domNode(tdom);
  }else{
    console.log('newNode with node provided')
    if (!('id' in node))
      node.id = newId()
    if(!'rotate' in node)
      node.rotate=0;
    if(!('x' in node)){
      var mousePos = _mousePos;
      if('mousePos' in node){
        mousePos = node.mousePos;
      }
      mouseXY = clientToNode(mousePos);
      node.x = mouseXY[0];
      node.y = mouseXY[1];
    }
    if(!('fontSize' in node)){
      node.fontSize = 20/S;
    }

    tdom = document.createElement('div')
    tdom.id = 'node_'+node.id;

    _NODES.push(node);
    _DOMId2node.set(tdom.id, node);
    _DOMId2nodej.set(tdom.id, _NODES.length-1);


    tdom.className = "node ui-rotatable";

    //  tn.contentEditable = true;
    // tn.dataset["x"] = d.x;
    // tn.dataset["y"] = d.y;
    // tn.dataset["rotate"] = d.rotate;
    // tn.dataset["fontSize"] = d.fontSize;
    // tn.dataset['text'] = d.text;
    // tn.dataset['id'] = d.id;
  }
  tdom.innerHTML = '';
  tdom.onclick = onNodeClick;
  tdom.ondblclick = onNodeDblClick;
  tdom.onmousedown = onNodeMouseDown;


  tdom.innerHTML = getHTML(node.text);

  if(node.rotate!=0){
    tdom.style.transform="rotate("+node.rotate+"rad)"
  }

  
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

  updateNode(node);

  if(!('className' in node)){
    // console.log("!('className' in node) , appending to DOM")
    node_container.appendChild(tdom);
  }

  [].forEach.call(tdom.getElementsByTagName('a'),(elt)=>{
    if(elt.href){
      elt.onclick = (e)=>{
        e.stopPropagation();
      }
      elt.onmousedown = (e)=>{
        e.stopPropagation();
      }
    }
  })

  return tdom;
}


function updateNode(d){
  //here, sadly, d s for _NODES element, and n is for DOM element..
  if('node' in d){
    n = d.node;
  }else{
    n=d;
    d = _DOMId2node.get(n.id);
  }

  n.style.left = (d["x"] - T[0])*S + 'px';
  n.style.top = (d["y"] - T[1])*S + 'px';
  n.style.fontSize = (d["fontSize"])*S + 'px';

  [].forEach.call(n.getElementsByTagName('img'),(e)=>{
    e.style.width='auto';
    e.style.height = 5*(d["fontSize"])*S +'px';
    e.style.transitionDuration='0.2s';
    // e.setAttribute('draggable', false);
    // e.onmousedown = (e)=>{e.preventDefault();};
  })
}


function updateSizes(){
  if(!('state' in updateSizes)){
    updateSizes.state = '';
  }
  state = JSON.stringify({T:T,S:S});
  if(state == updateSizes.state){

  }else{
    for(var j=0;j<_NODES.length; j++){
      if(_NODES[j].vis){
        d = _NODES[j]
        d.xMax = d.x + d.node.clientWidth/S;
        d.yMax = d.y + d.node.clientHeight/S;
      }
    }
    updateSizes.state = state;
  }

  setTimeout(updateSizes, 100);
}

function calcBox(d){
  if(d.text.indexOf('![')>=0){
    d.xMax = d.x + d.fontSize * 10;
    d.yMax = d.y + d.fontSize * 5;
  }else{
    d.xMax = d.x + d.text.length*d.fontSize*0.5;
    d.yMax = d.y + d.text.split('\n').length * d.fontSize;
  }
}

function isInBox(xMin,xMax,yMin,yMax,bxMin,bxMax,byMin,byMax){
  return (
    (xMin <= bxMax)
  &&(yMin <= byMax)
  &&(xMax >= bxMin)
  &&(yMax >= byMin)  
  )
}

function isVisible(d){
  if(!('xMax' in d)){
    calcBox(d);
  }
  return (
      (d.fontSize > 0.2/S)
    &&isInBox(d.x, d.xMax, d.y, d.yMax, 
      T[0] - width*0.5/S, T[0]+width*1.5/(1*S),
      T[1] - height*0.5/S, T[1]+width*1.5/(1*S))
    // &&(d.x<=T[0]+width*1.5/(1*S))
    // &&(d.y<=T[1]+width*1.5/(1*S))
    // &&(d.xMax>=T[0] - width*0.5/S)
    // &&(d.yMax>=T[1] - height*0.5/S)
  )  

}

function calcVisible(d, onhide, onshow){
  if(!('vis' in d)){
    d.vis=0;
  }
  new_vis = isVisible(d);
  if(d.vis){
    if(new_vis){
      //
    }else{
      onhide(d);
    }
  }else{
    if(new_vis){
      // 
      onshow(d);
    }else{
      // did not show before and not showing now, pass
    }
  }
  d.vis = new_vis;
}

function redraw(){
  _NODES.forEach((e)=>{
    if(('vis' in e)&&(e.vis)){
      updateNode(e);
    }
  })
  
  setTimeout(function(){
    _NODES.forEach(function(e){
      calcVisible(e
      ,function(){ //onhide
        e.node.style.opacity=0;
        // e.node.style.display='none';
      },function(){ //onshow
        if('node' in e){
          // e.node.style.display='none';
        }
        updateNode(e);
        e.node.style.display='';
        // e.node.style.transitionDuration='0.2s';
        e.node.style.opacity=1;
      })
    })
  }, 5)

  if(contentEditTextarea){
    console.log('redraw : contextEditTextarea');
    console.log('initWidth:')
    console.log(contentEditTextarea.dataset['initWidth'])
    console.log('initS: '+ contentEditTextarea.dataset['initS'])
    console.log('contentEditTextarea.style.width = '+contentEditTextarea.style.width);
    contentEditTextarea.style.width = 1*contentEditTextarea.dataset['initWidth']*S/(1*contentEditTextarea.dataset['initS']) + 'px';
    console.log('contentEditTextarea.style.width = '+contentEditTextarea.style.width);
    contentEditTextarea.style.height = contentEditTextarea.dataset['initHeight']*S/contentEditTextarea.dataset['initS']  + 'px';
    }
}


function _(s){
  if(s[0]=='#'){
    return document.getElementById(s.slice(1));
  }else
  if(s[0]=='.'){
    return document.getElementsByClassName(s.slice(1));
  }else{
    throw Error('Not Implemented: selector=['+s+']')
  }
}


function zoomToURL(s, smooth=true){
  urlParams = new URLSearchParams(s);  
  applyZoom(
    [1*urlParams.get('Tx'),1*urlParams.get('Ty')]
    ,1*urlParams.get('S') ? 1*urlParams.get('S') : 1
    ,smooth
  );
}

function getHTML(text){
  return md.render(text)
            .slice(0, -1) // md.render adds newline (?)
            .replaceAll('\n', '<br />')
            .replace(/href="(\?[^"]+)"/,/class="local" onclick="zoomToURL('$1')"/);
            // .replaceAll(/(href="[^\?])/g,'onclick="(e)=>{console.log(e);e.stopPropagation();}" $1');  
}

function getFontSize(d){
  return d.fontSize * S + 'px';
}



zoom_urlPushTimeout = null;
function zoomed() {
  S = d3.event.scale;
  T[0] = d3.event.translate[0]/S;
  T[1] = d3.event.translate[1]/S;

  status({T:T,S:S});//+' E:['+d3.event.x.toFixed(2)+','+d3.event.y.toFixed(2)+']');
  
  redraw();

  clearTimeout(zoom_urlPushTimeout);

  // every 10s of stay at one place time - 
  zoom_urlPushTimeout = setTimeout(function(){
    console.log('history pushed');
      url = window.location.href.indexOf('?')==-1 ? window.location.href : window.location.href.slice(0,window.location.href.indexOf('?'))
      window.history.pushState(
          {T:T,S:S}, 
          'Noteplace', 
          url + '?Tx='+T[0]+'&Ty='+T[1]+'&S='+S);
    }, 10000);
    
}

function isCurrentState(){
  return ((history.state)
        &&('T' in history.state)
        &&('S' in history.state)
        &&(history.state.T[0]==T[0])
        &&(history.state.T[1]==T[1])
        &&(history.state.S == S));
}

function replaceHistoryState(){
  url = window.location.href.indexOf('?')==-1 ? window.location.href : window.location.href.slice(0,window.location.href.indexOf('?'))
  window.history.replaceState(
      {T:T,S:S}, 
      'Noteplace', 
      url + '?Tx='+T[0]+'&Ty='+T[1]+'&S='+S);
      console.log('history replaced');
}

zoom_urlReplaceTimeout = setInterval(function(){
  if(!isCurrentState()){
    replaceHistoryState();
  }
}, 200);

function selectAllContent(el){
  var el = getG(tnode);
  var range = document.createRange()
  var sel = window.getSelection()
  
  //range.setStart(el.childNodes[0], 0)
  range.selectNodeContents(el.childNodes[0])
  // range.collapse(true)
  
  sel.removeAllRanges()
  sel.addRange(range)
}


function getNode(id){
  return document.getElementById('node_' + id);
}

function getG(d){
  return document.getElementById('node_' + d.id);
}

function onFontSizeEdit(){
  if(_selected_DOM.length == 1){
    domNode(_selected_DOM[0])['fontSize'] = _('#fontSize').value;
    _selected_DOM[0].classList.add('zoom');
    updateNode(_selected_DOM[0]);
    // _selected_DOM.classList.remove('zoom');

    _('#fontSize').step = _('#fontSize').value*0.25;

    save(_selected_DOM[0]);
  }
}

function onTextEditChange(){
  if(_selected_DOM !== null){
    _selected_DOM.dataset['text'] = this.value;
    newNode(_selected_DOM);

    // this.style.height = "5px";
    // this.style.height = (this.scrollHeight)+"px";

    save(_selected_DOM);
  }
}


// https://gist.github.com/simondahla/0c324ba8e6ed36055787
function addOnContentChange(elt, fun){
  if(window.addEventListener) {
    // Normal browsers
    elt.addEventListener('DOMSubtreeModified', fun, false);
  } else
   if(window.attachEvent) {
      // IE
      elt.attachEvent('DOMSubtreeModified', fun);
   }
}


function addRandomNodes(N, Xlim, Ylim, FSLim){
  for(var j=0; j<N; j++){
    var id = newId();
    newNode({
      x:Xlim[0]+Math.random()*(Xlim[1]-Xlim[0]),
      y:Ylim[0]+Math.random()*(Ylim[1]-Ylim[0]),
      fontSize:FSLim[0]+Math.random()*(FSLim[1]-FSLim[0]),
      text:'test__'+id,
      id:id,
      rotate:Math.random()*2*Math.PI
    });
  }
  redraw();
}


function editFontSize(delta){
  if(_selected_DOM.length>0){
    if(_selected_DOM.length==1){
      // one element selected, fontSize input is related to it
      input = _('#fontSize');
      input.value *= Math.pow(1.25, delta);
      onFontSizeEdit();
    }else{
      var k = Math.pow(1.25, delta);

      var centerPos = calcCenterPos(_selected_DOM.map(domNode));

      _selected_DOM.forEach((dom)=>{
        domNode(dom).fontSize *= k;
        domNode(dom).x = centerPos[0] + (domNode(dom).x - centerPos[0])*k;
        domNode(dom).y = centerPos[1] + (domNode(dom).y - centerPos[1])*k;

        updateNode(dom);
      })
    }
  }
}


const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  el.style.opacity=0;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};



function showModalYesNo(title, body, yes_callback){
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


function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


function defaultFilename(){
  return 'Noteplace_'
            +(new Date().toISOString()
                        .slice(0,19)
                        .replaceAll('-','')
                        .replace('T','-')
                        .replaceAll(':','')
              )+'.json'
}


// Start file download.
_("#save").addEventListener("click", function(){
  _('#modal-input').value = defaultFilename();
  _('#modal-save').style.display='';
  _('#exampleModalLabel').innerHTML = 'Save to local file:';

  _('#modal-save').onclick = function(){
    download(
      _('#modal-input').value, 
      JSON.stringify(saveToG())
    );
  }
  _('#modal-list').innerHTML = '';
}, false);

// save everything to a single object
function saveToG(){
  return {
    T:T,
    S:S,
    nodes: _NODES.map(stripNode)
  }
}

function stripNode(d){
  // strips only relevant data for nodes, also convert to numerical
  return {
    id:newId(),//('id' in d)?1*d['id']:newId(),
    x:1*d['x'],
    y:1*d['y'],
    fontSize:1*d['fontSize'],
    text:d['text'],
    rotate:'rotate' in d?d.rotate:0
  } 
}

// load everything from single object
function loadFromG(G){
  console.log('Loading..');

  T = [1*G.T[0],1*G.T[1]];
  S = 1*G.S;
  // applyZoom([1*G.T[0],1*G.T[1]], 1*G.S);
  $('.node').remove();
  delete _NODES;
  _NODES = [];

  G.nodes.map(stripNode).forEach(newNode);
  
  redraw();
  console.log('Loading complete, now '+_NODES.length+' nodes');
}


_('#file').oninput = function(){
    var fr=new FileReader();
    fr.onload=function(){
      console.log('Received file..');
      
      loadFromG(JSON.parse(fr.result))

      $('#file').value = "";
    }
      
    fr.readAsText(this.files[0]);  
}

//  ::::::::   ::::::::   ::::::::   ::::::::  :::        ::::::::::      :::::::::  :::::::::  ::::::::::: :::     ::: :::::::::: 
// :+:    :+: :+:    :+: :+:    :+: :+:    :+: :+:        :+:             :+:    :+: :+:    :+:     :+:     :+:     :+: :+:        
// +:+        +:+    +:+ +:+    +:+ +:+        +:+        +:+             +:+    +:+ +:+    +:+     +:+     +:+     +:+ +:+        
// :#:        +#+    +:+ +#+    +:+ :#:        +#+        +#++:++#        +#+    +:+ +#++:++#:      +#+     +#+     +:+ +#++:++#   
// +#+   +#+# +#+    +#+ +#+    +#+ +#+   +#+# +#+        +#+             +#+    +#+ +#+    +#+     +#+      +#+   +#+  +#+        
// #+#    #+# #+#    #+# #+#    #+# #+#    #+# #+#        #+#             #+#    #+# #+#    #+#     #+#       #+#+#+#   #+#        
//  ########   ########   ########   ########  ########## ##########      #########  ###    ### ###########     ###     ########## 
// ™



__GDRIVE_saveFilename = null;
__files = new Map();

function fillFilesList(rowClickFun){
  
  listFiles(function(files){
    __files = new Map();
    files.forEach((file)=>{
      __files.set(file.name,file.id);
      console.log(file);
 
      var row = document.createElement('div');
      row.className = 'row my-1';
      row.dataset['fileId'] = file.id;
      row.dataset['name'] = file.name;
      
      var col_name = document.createElement('div');
      col_name.className = 'col-10 btn  btn-outline-secondary';
      col_name.innerText = file.name;
      col_name.onclick = function(_row){
        console.log('row click');
        return function(){rowClickFun(_row);
        
      }}(row)

      var col_del = document.createElement('div');
      col_del.className = 'col';
      var del_btn = document.createElement('div');
      del_btn.className = "btn btn-danger align-self-end";
      del_btn.innerHTML = '⌫';
      del_btn.title="delete "+file.name;
      del_btn.onclick = function(_row){return function(){

        _('#modalYesNoLabel').innerHTML = 'Delete?';
        _('#modalYesNoBody').innerHTML = 'Really delete <b>' + _row.dataset['name'] + '</b>?';
        _('#modalYesNo-Yes').onclick = function(){
          gapi.client.drive.files.delete({
            'fileId':_row.dataset['fileId']
          }).then(function(a){
            console.log(a); 
            if(a.status==204){
              _row.remove();
              __files.delete(_row.dataset['name']);
            }
          })
        };
        $('#modalYesNo').modal('show');
      }}(row)
      col_del.appendChild(del_btn);

      row.appendChild(col_name);
      row.appendChild(col_del);

      _('#modal-list').appendChild(row);
    })  
  });
}


_('#load_gdrive').addEventListener('click',function(){
  console.log('GDrive load..');

  _('#modal-input').value = '';
  _('#modal-input').oninput = function(){
    if( __files.has(_('#modal-input').value)){
      _('#modal-save').style.display='';
    }else{
      _('#modal-save').style.display='none';
    }
  }
  
  _('#modal-list').innerHTML = '';
  _('#exampleModalLabel').innerHTML = 'Load from Google Drive file:';
  _('#modal-save').innerHTML = 'Save';
  _('#modal-save').style.display='none';

  fillFilesList((row)=>{console.log(row); getFileContent(row.dataset['fileId'],function(e){
    if(e.status==200){
      // file loaded OK, load nodes'n'stuff
      loadFromG(JSON.parse(e.result));
      // only hide on OK load
      $('#exampleModal').modal('hide')
      // save Filename for faster save
      __GDRIVE_saveFilename = row.dataset['name'];
    }else{
      alert('error.. '+e);
      console.log(e);
    }
  })})
})

function saveToGDrive(filename){
  uploadFile(
    filename, 
    JSON.stringify(saveToG())
  );
  // save filename
  __GDRIVE_saveFilename = filename;
}

_('#save_gdrive').addEventListener('click',function(){
  console.log('GDrive save..');

  _('#modal-input').value = __GDRIVE_saveFilename?__GDRIVE_saveFilename:defaultFilename();
  _('#modal-input').oninput = function(){};
  _('#modal-save').style.display='';
  _('#exampleModalLabel').innerHTML = 'Save to Google Drive file:';
  _('#modal-save').innerHTML = 'Save';
  _('#modal-list').innerHTML = '';


  _('#modal-save').onclick = function(){
    saveToGDrive(_('#modal-input').value);
  }


  fillFilesList((_row)=>{
    showModalYesNo(
      'Overwrite?',
      'Really Overwrite <b>' + _row.dataset['name'] + '</b>?',
      function(){
        // I was not able to rewrite file content
        //  , so I will just delete and save
        gapi.client.drive.files.delete({
          'fileId':_row.dataset['fileId']
        }).then(function(a){
          if(a.status==204){
            // Now save
            saveToGDrive(_row.dataset['name']);
            $('#exampleModal').modal('hide');
          }else{
            console.log(a); 
            alert('Error while rewriting...');
          }
        })
      })
    });
}, false);

//  :::::::: ::::::::::: :::     ::::::::: ::::::::::: :::    ::: :::::::::  
// :+:    :+:    :+:   :+: :+:   :+:    :+:    :+:     :+:    :+: :+:    :+: 
// +:+           +:+  +:+   +:+  +:+    +:+    +:+     +:+    +:+ +:+    +:+ 
// +#++:++#++    +#+ +#++:++#++: +#++:++#:     +#+     +#+    +:+ +#++:++#+  
//        +#+    +#+ +#+     +#+ +#+    +#+    +#+     +#+    +#+ +#+        
// #+#    #+#    #+# #+#     #+# #+#    #+#    #+#     #+#    #+# #+#        
//  ########     ### ###     ### ###    ###    ###      ########  ###        

node_container.dataset['x'] = 0;
node_container.dataset['y'] = 0;
zoomToURL(window.location.search);


// event handlers

_('#text').oninput = onTextEditChange;
_('#fontSize').onchange = onFontSizeEdit;

_('#btnAddLots').onclick = function(){
  addRandomNodesToView(1*_('#number').value);
}

_('#btnZoomIn').onclick = function(){
  zoomInOut(1);
}
_('#btnZoomOut').onclick = function(){
  zoomInOut(-1);
}

_('#btnFontMinus').onclick = function(){
  editFontSize(-1);
}
_('#btnFontPlus').onclick = function(){
  editFontSize(+1);
}


// Load nodes? 

if($(".node").length){
  console.log("seems we already have nodes.");

  save();
}else{
  console.log('No nodes in html..');
  try{
  //if(localStorage['noteplace.node_ids']){
    node_ids = JSON.parse(localStorage['noteplace.node_ids']);
    nodes = node_ids.map(function(id){
      console.log(id);
      console.log('noteplace.node_'+id);
      
      return JSON.parse(localStorage['noteplace.node_'+id]);
    });
  }catch{
    console.log('no nodes in localStorage, loading default');
    nodes = nodes_default
  }
  nodes.map(stripNode).forEach(newNode);
}

save();


$('#exampleModal').on('shown.bs.modal', function () {
  $('#modal-input').trigger('focus')
})

window.addEventListener('paste', function(e){
  console.log('window paste');
  console.log(e);
  // items = e.clipboardData.items;
  // console.log(items);
  if(contentEditTextarea){

  }else{
    // hmm, pasting something from the outside?
    copydiv = document.createElement('div');
    copydiv.id = "copydiv";
    copydiv.contentEditable = "true";
    
    node_container.appendChild(copydiv);
    copydiv.focus();
    // copydiv.addEventListener('paste',function(e){
    addOnContentChange(copydiv,function(e){
      console.log('copydiv paste!');
      console.log(e);

      setTimeout(function(){
        tstuff = _('#copydiv').innerHTML;

        json_parsed = false;
        if(tstuff[0]=='['){
          try{
            _clipBoard = JSON.parse(
              // I know, right? 
              //  why does pasting JSON-encoded html 
              //    create this sort of nonsense?
              tstuff.replaceAll('&lt;','<')
                    .replaceAll('&gt;','>')
                    .replaceAll('&amp;','&')
                    // .replaceAll('&apos;',"'")
                    // .replaceAll('&quot;','"')
            );
            json_parsed = true;
          }catch{
            json_parsed = false;
          }
        }

        if(json_parsed){
          console.log('Pasting JSON-parsed _clipBoard')
          selectNode(null);
          // paste Under the cursor?
          
          _clipBoard.forEach((node)=>{
            var nnode = stripNode(node);
            nnode.x /= S;
            nnode.y /= S;
            nnode.fontSize /= S;
            var tmousePos = clientToNode(_mousePos);
            nnode.x += tmousePos[0];
            nnode.y += tmousePos[1];
            
            selectNode(newNode(nnode));
          })

        }else{

          // I know this is not perfect (HAHAHAHAHA!!...)
          //  but it kinda works
          tstuff = tstuff.replaceAll(/font-size:[ 0-9]+(px)?;?/g,'')
          tstuff = tstuff.replaceAll(/width:[ 0-9]+(px)?;?/g,'')
          tstuff = tstuff.replaceAll(/line-height:[ 0-9]+(px)?;?/g,'')
          tstuff = tstuff.replaceAll(/height:[ 0-9]+(px)?;?/g,'')

          console.log(tstuff);
          selectNode(newNode({
            text:tstuff
          }))

        }
        node_container.removeChild(copydiv);
      },5);
      e.stopPropagation();
    }) 
  }
});

window.addEventListener('cut', function(e){
  console.log('window cut');
  console.log(e);
  if(contentEditTextarea){

  }else{
    e.stopPropagation();
    e.preventDefault();
    if(('on' in copySelection)&&(copySelection.on)){
    }else{
      copySelection();
    }
    _selected_DOM.forEach(deleteNode);
    _selected_DOM = [];  
    
  }
});

window.addEventListener('copy', function(e){
  console.log('window copy');
  console.log(e);
  if(contentEditTextarea){

  }else{
    if(('on' in copySelection)&&(copySelection.on)){
    }else{
      copySelection();
    }
  }
});


_('#btnClear').addEventListener('click', function(){
  showModalYesNo(
    'Clear everything?',
    'Are you <b>sure</b> you want to clear <i>everything</i>?',
    function(){
      _RESTART([]);
    }
  )
})

_('#btnRestart').addEventListener('click', function(){
  showModalYesNo(
    'Restart?',
    'Are you <b>sure</b> you want to discard <i>everything</i> and restart?',
    function(){_RESTART()}
  )
})

image_file_types = [
  'image/apng'
  ,'image/avif'
  ,'image/gif'
  ,'image/jpeg'
  ,'image/png'
  ,'image/svg+xml'
  ,'image/webp'
  ,'image/bmp'
  ,'image/x-icon'
  ,'image/tiff'
]
function isImage(file){
  return image_file_types.indexOf(file.type)>=0;
}
_fileList = null;
container.addEventListener('drop',function(e){
  console.log('container drop');
  console.log(e);
  e.stopPropagation();
  e.preventDefault();

  container.classList.remove('drag-hover');

  if(e.dataTransfer.files.length > 0){
    _fileList = e.dataTransfer.files;
    console.log(_fileList);
    // _fileList
  }else{

    selectNode(null);
    selectNode(
      newNode({
        text:e.dataTransfer.getData('text')
        ,mousePos:[e.clientX,e.clientY]
      })
    );
  }


})

container.addEventListener('dragover',function(e){
  // console.log('container dragover');
  // console.log(e);
  e.preventDefault();
})

container.addEventListener('dragenter',function(e){
  console.log('container dragenter')
  // console.log(e);
  container.classList.add('drag-hover');
  e.preventDefault();
})
container.addEventListener('dragleave',function(e){
  console.log('container dragleave')
  container.classList.remove('drag-hover');
  // console.log(e);
  e.preventDefault();
})
container.addEventListener('dragend',function(e){
  console.log('container dragend')
  // console.log(e);
})

function getStateURL(){
  return '?Tx='+T[0]+'&Ty='+T[1]+'&S='+S;
}

_('#btnSaveView').dataset['view'] = null;
_('#btnSaveView').onclick = function(){
  var btn = _('#btnSaveView');
  btn.dataset['view'] = getStateURL();

  btn.classList.remove('btn-secondary');
  btn.classList.add('btn-success');

  btn.innerHTML = 'Saved View '+btoa(Math.random()).slice(10,13);
  btn.title = btn.dataset['view'];
  btn.draggable = true;


  btn.ondragstart = function(e){
    console.log('btn drag start')
    console.log(e);
    e.dataTransfer.effectAllowed = 'all';
    e.dataTransfer.setData('text', 'Tap to [View]('+this.dataset['view']+' "Saved View")');
    console.log(e);
  }

  btn.ondragend = function(e){
    console.log('btn ondragend');
    console.log(e);
  }
  

  btn.ondrop = function(e){
    console.log('btn drop');
    console.log(e);
  }
}

// start updateSizes process
updateSizes();


_('#btnPaletteToggle').onclick = function(){
  if(_('#btnPaletteToggle').ariaExpanded == 'true'){
    _('#btnPaletteToggle').innerHTML = '<i class="bi-arrow-down"></i>';
  }else{
    _('#btnPaletteToggle').innerHTML = '<i class="bi-palette"></i>';
  }
}


// :::    ::: ::::::::::: ::::::::::: :::        ::::::::::: ::::::::::: :::   ::: 
// :+:    :+:     :+:         :+:     :+:            :+:         :+:     :+:   :+: 
// +:+    +:+     +:+         +:+     +:+            +:+         +:+      +:+ +:+  
// +#+    +:+     +#+         +#+     +#+            +#+         +#+       +#++:   
// +#+    +#+     +#+         +#+     +#+            +#+         +#+        +#+    
// #+#    #+#     #+#         #+#     #+#            #+#         #+#        #+#    
//  ########      ###     ########### ########## ###########     ###        ###    

function addRandomNodesToView(N){
  addRandomNodes(
    1*N,
    [T[0], T[0]+width/S],
    [T[1], T[1]+height/S],
    [0.02/S,20/S]
  )
}

function _RESTART(new_nodes=nodes_default){
  _NODES = [];
  newId.N = 0;
  $('.node').remove();
  console.log('new_nodes=['+new_nodes+']');
  new_nodes.map(stripNode).forEach(newNode);
  applyZoom([0,0],1,0);
}



