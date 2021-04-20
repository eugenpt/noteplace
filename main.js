var md = new Remarkable();

// https://stackoverflow.com/a/17111220/2624911
dragInitiated = false;

// Translate and Scale parameters
T = [0,0];
S = 1;


BODY = document.getElementsByTagName('body')[0];
M = 0;

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
  console.log(e);
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

$(container).on('mousewheel', function(e) {
  console.log(e.deltaX, e.deltaY, e.deltaFactor);

  mousePos = [T[0] + e.clientX/S , T[1] + e.clientY/S]
  S = Math.min(zoomMax,Math.max(zoomMin,e.deltaY>0 ? S*zoomK : S/zoomK))
  applyZoom(
    [mousePos[0] - e.clientX/S, mousePos[1]-e.clientY/S],
    S
  );
});


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

    console.log(e);
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

window.onmouseup = function(e) {
  console.log('window onmouseup');
  console.log(e);
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

    redraw();

    _isMouseDown = false;
  }

  if(e.button==1){
    e.preventDefault();
  }
}


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
  console.log(e);

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
  contentEditTextarea.style.fontSize = contentEditNode.dataset['fontSize']*S+'px';
  contentEditTextarea.style.fontFamily = 'Open Sans';
  contentEditTextarea.style.width = Math.max(width/3, contentEditNode.getBoundingClientRect().width+20)+'px';
  contentEditTextarea.style.height = contentEditNode.getBoundingClientRect().height+'px';
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
  console.log(e);
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

function newNode(d){
  console.log(d);
  if('className' in d){
    tn = d;
    console.log('newNode with DOM node provided:');
    console.log(tn);
  }else{
    tn = document.createElement('div')
    if (!('id' in d))
      d.id = newId()
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
zoom_urlReplaceTimeout = setInterval(function(){
  // console.log('history replaced');
  url = window.location.href.indexOf('?')==-1 ? window.location.href : window.location.href.slice(0,window.location.href.indexOf('?'))
  window.history.replaceState(
      {T:T,S:S}, 
      'Noteplace', 
      url + '?Tx='+T[0]+'&Ty='+T[1]+'&S='+S);
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

_('#text').oninput = onTextEditChange;
_('#fontSize').onchange = onFontSizeEdit;



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


// Start file download.
_("#save").addEventListener("click", function(){
  nodes = [].map.call(_('.node'),(d)=>{return {
    id:d.dataset['id'],
    x:d.dataset['x'],
    y:d.dataset['y'],
    fontSize:d.dataset['fontSize'],
    text:d.dataset['text']
  }})
  // Generate download of hello.txt file with some content
  var text = JSON.stringify({T:T,S:S,nodes:nodes});
  var filename = 'Noteplace_'
                +(new Date().toISOString()
                            .slice(0,19)
                            .replaceAll('-','')
                            .replace('T','-')
                            .replaceAll(':','')
                  )+'.json'
  
  download(filename, text);
}, false);


_('#file').oninput = function(){
    var fr=new FileReader();
    fr.onload=function(){
        console.log('Loading..');
        G = JSON.parse(fr.result);

        T = [1*G.T[0],1*G.T[1]];
        S = 1*G.S;
        // applyZoom([1*G.T[0],1*G.T[1]], 1*G.S);
        nodes = G.nodes;
        nodes.forEach(newNode);
        redraw();
        console.log('Loading complete, now '+nodes.length+' nodes');

        $('#file').value = "";
    }
      
    fr.readAsText(this.files[0]);  
}


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