var md = new Remarkable();

// https://stackoverflow.com/a/17111220/2624911
dragInitiated = false;

// Translate and Scale parameters
T = [0,0];
S = 1;


BODY = document.getElementsByTagName('body')[0];
M = 0;

NODES = [];

zoomMax = 1e14;
zoomMin = 1e-15;

zoomK = 1.6;

let container = _("#container");
let node_container = _("#node_container");


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

// resizeWatchTimeout = null;
// window.addEventListener('resize', function(event){
//   // do stuff here
//   clearTimeout(resizeWatchTimeout);
//   resizeWatchTimeout = setTimeout(function(){
//     width = (window.innerWidth || document.documentElement.clientWidth || BODY.clientWidth);
//     height = window.innerHeight|| document.documentElement.clientHeight|| BODY.clientHeight;
    
//     filterNodes2Draw();
//     redraw();
//   },100); // run update only every 100ms
// });


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
  var node = newNode({
    id:id, 
    x:e.clientX/S + T[0], 
    y:e.clientY/S + T[1], 
    fontSize:20/S, 
    text:'test'+id
  });
  // no dblclick zoom!
  e.preventDefault();
  e.stopPropagation();
  
  onNodeDblClick(node);
}

function zoomInOut(in_degree, clientPos=null){
  if(clientPos==null){
    if(selected_node){
      // zoom to it!
      clientPos = [
        (1*selected_node.dataset['x']-T[0])*S,
        (1*selected_node.dataset['y']-T[1])*S,
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

function applyZoom(T_,S_){
  console.log('S='+S+' S_='+S_);
  T = T_;

  ds = Math.abs(Math.log10(S/S_));
  console.log('ds='+ds);
  S = S_;

  $('.node').css('transition-duration',(0.2+ds)+'s');

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

selected_node = null;

container.onmousedown = function(e) {
  console.log('container.onmousedown');
  console.log('T='+T+' S='+S);
  $('.node').css('transition-duration','0s');
  // $('.node').removeClass('zoom'); // disable visible transition
  
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


  if(selected_node){
    selectNode(null);
  }
}

function selectNode(n){
  if(selected_node){ //remove class
    selected_node.classList.remove('selected');
  }
  selected_node = n;
  if(selected_node){// apply class, setup editing tools
    selected_node.classList.add('selected');
    //   
    _('#text').disabled = false;
    _('#fontSize').disabled = false;
    _('#text').value = selected_node.dataset['text'];
    _('#fontSize').value = selected_node.dataset['fontSize'];
    _('#fontSize').step = _('#fontSize').value * 0.25;
  }else{// just deselect => clear inputs
    
    _('#text').disabled = true;
    _('#fontSize').disabled = true;
    _('#text').value = '';
    _('#fontSize').value = '';
  }
}


function stopEditing(){
  if(contentEditTextarea.value==''){
    node_container.removeChild(contentEditTextarea.parentElement);
  }else{
    newNode(contentEditTextarea.parentElement);
  }
  contentEditTextarea = null;
}

window.addEventListener('mouseup',function(e) {
  console.log('window onmouseup');
  // console.log(e);
  console.log('T='+T+' S='+S);

  if(_isMouseDragging){
    save(_isMouseDragging);

    _isMouseDragging = false;
    _isMouseDown = false;

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

    _isMouseDown = false;
  }

  if(e.button==1){
    e.preventDefault();
  }
  
})


container.onmousemove = function(e){
  if(_isMouseDown){
    if(_isMouseDragging){
      _isMouseDragging.dataset['x'] = _mouseDragPos[0] +  (e.clientX - _mouseDragStart[0])/S;
      _isMouseDragging.dataset['y'] = _mouseDragPos[1] +  (e.clientY - _mouseDragStart[1])/S;

      updateNode(_isMouseDragging)
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


function save(node=null){
  if(node === null){
    // save all
    node_ids = [];
    [].forEach.call(_(".node"),(node)=>{
      save(node);
      node_ids.push(node.dataset['id']);
    });
    localStorage['noteplace.node_ids'] = JSON.stringify(node_ids);
  }else{
    // node provided, save only node
    if('x' in node){
      // original object
      localStorage['noteplace.node_'+node.id] = JSON.stringify(node);
    }else{
      // DOM node
      localStorage['noteplace.'+node.id] = JSON.stringify(node.dataset);
    }
  }
}





// ::::    :::  ::::::::  :::::::::  ::::::::::      :::::::::: :::    ::: ::::    :::  ::::::::   ::::::::  
// :+:+:   :+: :+:    :+: :+:    :+: :+:             :+:        :+:    :+: :+:+:   :+: :+:    :+: :+:    :+: 
// :+:+:+  +:+ +:+    +:+ +:+    +:+ +:+             +:+        +:+    +:+ :+:+:+  +:+ +:+        +:+        
// +#+ +:+ +#+ +#+    +:+ +#+    +:+ +#++:++#        :#::+::#   +#+    +:+ +#+ +:+ +#+ +#+        +#++:++#++ 
// +#+  +#+#+# +#+    +#+ +#+    +#+ +#+             +#+        +#+    +#+ +#+  +#+#+# +#+               +#+ 
// #+#   #+#+# #+#    #+# #+#    #+# #+#             #+#        #+#    #+# #+#   #+#+# #+#    #+# #+#    #+# 
// ###    ####  ########  #########  ##########      ###         ########  ###    ####  ########   ########  

function onNodeClick(e){
  console.log('clicked on ['+this.id+'] : '+this.innerText);
  selectNode(this);
}

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

    var new_node = newNode({
      x:contentEditNode.dataset['x'],
      y:1*contentEditNode.dataset['y']
        // + 1*contentEditNode.dataset['fontSize']
        + (contentEditNode.getBoundingClientRect().height/S),
      x:contentEditNode.dataset['x'],
      text:'',
      fontSize:contentEditNode.dataset['fontSize'],
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
  if (e.key === "Escape") { // escape key maps to keycode `27`
    
    selectNode(contentEditNode);
    
    stopEditing();
        
    e.stopPropagation();    
  }
}

function onNodeDblClick(e){
  console.log('double-clicked on ['+this.id+'] : '+this.innerText);
  // console.log(e);

  if('preventDefault' in e){
    e.preventDefault();
    e.stopPropagation();

    contentEditNode = this;
  }else{
    contentEditNode = e;
  }
  console.log(contentEditNode);

  contentEditTextarea = document.createElement('textarea');
  contentEditTextarea.id = 'contentEditTextarea';
  contentEditTextarea.value = contentEditNode.dataset['text'];
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
    this.parentElement.dataset['text'] = this.value;
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
}

function onNodeMouseDown(e){
  console.log('onNodeMouseBtn');
  // console.log(e);
  if(e.button==1){
    _isMouseDragging = this;
    _mouseDragStart = [e.clientX, e.clientY];
    _mouseDragPos = [1*this.dataset['x'], 1*this.dataset['y']];

    e.preventDefault();
  }

  if(e.ctrlKey){
    e.preventDefault();
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


function newNode(d){
  // console.log(d);
  if('className' in d){
    tn = d;
    // console.log('newNode with DOM node provided:');
    // console.log(tn);
  }else{
    if (!('id' in d))
      d.id = newId()
    NODES.push(d);



    tn = document.createElement('div')
    tn.id = 'node_'+d.id;
    tn.className = "node";
    //  tn.contentEditable = true;
    tn.dataset["x"] = d.x;
    tn.dataset["y"] = d.y;
    tn.dataset["fontSize"] = d.fontSize;
    tn.dataset['text'] = d.text;
    tn.dataset['id'] = d.id;
  }
  tn.innerHTML = '';
  tn.onclick = onNodeClick;
  tn.ondblclick = onNodeDblClick;
  tn.onmousedown = onNodeMouseDown;
  tn.innerHTML = getHTML(tn.dataset['text']);
  // Links do look promising, but all the behaviour breaks then
  // tn.innerHTML =  '';
  // ta = document.createElement('a');
  // ta.href = '?Tx='+tn.dataset["x"]+'&Ty='+tn.dataset["y"]+'&S='+30/tn.dataset["fontSize"];
  // ta.className = 'node_a';
  // ta.innerHTML = getHTML(tn.dataset['text']);
  // ta.onclick = function(e){
  //   console.log('a click!');
  //   e.preventDefault();
  //   e.stopPropagation();
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
  updateNode(tn);

  if(!('className' in d)){
    node_container.appendChild(tn);
  }
  return tn;
}


function updateNode(n){
  n.style.left = (n.dataset["x"] - T[0])*S + 'px';
  n.style.top = (n.dataset["y"] - T[1])*S + 'px';
  n.style.fontSize = (n.dataset["fontSize"])*S + 'px';
}


function redraw(){
  [].forEach.call(_('.node'),
    updateNode)

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


function zoomToURL(s){
  urlParams = new URLSearchParams(s);
  

  applyZoom([1*urlParams.get('Tx'),1*urlParams.get('Ty')], 1*urlParams.get('S') ? 1*urlParams.get('S') : 1);
  

  redraw();
}

function getHTML(text){
  return md.render(text)
            .slice(0, -1) // md.render adds newline (?)
            .replaceAll('\n', '<br />')
            .replace(/href="(\?[^"]+)"/,/class="local" onclick="zoomToURL('$1')"/);  
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
  if(selected_node !== null){
    selected_node.dataset['fontSize'] = this.value;
    selected_node.classList.add('zoom');
    updateNode(selected_node);
    // selected_node.classList.remove('zoom');

    this.step = this.value*0.25;

    save(selected_node);
  }
}

function onTextEditChange(){
  if(selected_node !== null){
    selected_node.dataset['text'] = this.value;
    newNode(selected_node);

    // this.style.height = "5px";
    // this.style.height = (this.scrollHeight)+"px";

    save(selected_node);
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
    id = newId();

    newNode({
      x:Xlim[0]+Math.random()*(Xlim[1]-Xlim[0]),
      y:Ylim[0]+Math.random()*(Ylim[1]-Ylim[0]),
      fontSize:FSLim[0]+Math.random()*(FSLim[1]-FSLim[0]),
      text:'test__'+id,
      id:id
    });
  }
  redraw();
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
}, false);

// save everything to a single object
function saveToG(){
  return {
    T:T,
    S:S,
    nodes: [].map.call(_('.node'),
                      (d)=>{return {
                        id:d.dataset['id'],
                        x:d.dataset['x'],
                        y:d.dataset['y'],
                        fontSize:d.dataset['fontSize'],
                        text:d.dataset['text']
                      }}
                    )
  }
}

// load everything from single object
function loadFromG(G){
  console.log('Loading..');

  T = [1*G.T[0],1*G.T[1]];
  S = 1*G.S;
  // applyZoom([1*G.T[0],1*G.T[1]], 1*G.S);
  $('.node').remove();

  nodes = G.nodes;
  nodes.forEach(newNode);
  redraw();
  console.log('Loading complete, now '+nodes.length+' nodes');
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
    _('#modalYesNoLabel').innerHTML = 'Overwrite?';
    _('#modalYesNoBody').innerHTML = 'Really Overwrite <b>' + _row.dataset['name'] + '</b>?';
    _('#modalYesNo-Yes').onclick = function(){
      // I was not able to rewrite file content
      //  , so I will just delete and save
      gapi.client.drive.files.delete({
        'fileId':_row.dataset['fileId']
      }).then(function(a){
        if(a.status==204){
          // Now save
          saveToGDrive(_row.dataset['name']);
        }else{
          console.log(a); 
          alert('Error while rewriting...');
        }
      })
    };
    $('#modalYesNo').modal('show');    
  })

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
  addRandomNodes(
    1*_('#number').value,
    [T[0], T[0]+width/S],
    [T[1], T[1]+height/S],
    [0.02/S,20/S]
  )
}

_('#btnZoomIn').onclick = function(){
  zoomInOut(1);
}
_('#btnZoomOut').onclick = function(){
  zoomInOut(-1);
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
    nodes = nodes_default
  }
  nodes.forEach(newNode);
}

save();


var exampleModal = document.getElementById('exampleModal')
exampleModal.addEventListener('show.bs.modal', function (event) {
  console.log('AAA!');
  // Button that triggered the modal
  var button = event.relatedTarget
  // Extract info from data-bs-* attributes
  var recipient = button.getAttribute('data-bs-whatever')
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  var modalTitle = exampleModal.querySelector('.modal-title')
  var modalBodyInput = exampleModal.querySelector('.modal-body input')

  modalTitle.textContent = 'New message to ' + recipient
  modalBodyInput.value = recipient
})



$('#exampleModal').on('shown.bs.modal', function () {
  
  $('#modal-input').trigger('focus')
})
