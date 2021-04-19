var md = new Remarkable();

// https://stackoverflow.com/a/17111220/2624911
dragInitiated = false;

// Translate and Scale parameters
T = [0,0];
S = 1;

urlParams = new URLSearchParams(window.location.search);
T[0] = 1*urlParams.get('Tx')
T[1] = 1*urlParams.get('Ty')

S = 1*urlParams.get('S')
S = S?S:1;

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
  T = T_;
  S = S_;

  $('.node').addClass('zoom');
  
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
  $('.node').removeClass('zoom'); // disable visible transition
  
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
  if(selected_node){
    selected_node.classList.remove('selected');
  }
  selected_node = n;
  if(selected_node){
    selected_node.classList.add('selected');
  }
}

function stopEditing(){
  newNode(contentEditTextarea.parentElement);
  contentEditTextarea = null;
}

window.onmouseup = function(e) {
  _isMouseDown = false;
  _isMouseDragging = false;

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

      T[0] = _mouseDownT[0] -  (e.clientX - _mouseDownPos[0])/S;
      T[1] = _mouseDownT[1] -  (e.clientY - _mouseDownPos[1])/S;

      redraw()
    }
  }
}

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

    nodes = [
    {id: 0, x: 0, y: 0, text: "test0", fontSize: 12},
    {id: 1, x: 100, y: 100, text: "test1", fontSize: 12},
    {id: 2, x: 183, y: 85.5, text: "test2", fontSize: 10.000000000000002},
    {id: 3, x: 177.71582669914915, y: 84.10224103813428, text: "test3", fontSize: 4.204482076268574},
    {id: 4, x: 173.18169898809143, y: 83.77972083086841, text: "test4", fontSize: 1.7677669529663695},
    {id: 5, x: 172.25362133778404, y: 83.82391500469258, text: "test5", fontSize: 0.8838834764831848},
    {id: 6, x: 171.81167959954246, y: 83.89020626542883, text: "test6", fontSize: 0.4419417382415924},
    {id: 7, x: 171.69807758002312, y: 83.84816472660286, text: "test7", fontSize: 0.039062499999999965},
    {id: 8, x: 171.58772601752312, y: 83.84914128910286, text: "test8", fontSize: 0.019531249999999983},
    {id: 9, x: 171.53938617377312, y: 83.85451238285286, text: "test9", fontSize: 0.009765624999999991},
    {id: 10, x: 171.52229633002312, y: 83.85841863285286, text: "test10", fontSize: 0.004882812499999996},
    {id: 11, x: 171.5140747601513, y: 83.86304412981941, text: "test11", fontSize: 0.0029033376831121096},
    {id: 12, x: 171.5083740342907, y: 83.86542565010431, text: "test12", fontSize: 0.001726334915006218},
    {id: 13, x: 171.50607848896962, y: 83.86699217543257, text: "test13", fontSize: 0.000513242440950753},
    {id: 14, x: 171.50464071771412, y: 83.86762401331647, text: "test14", fontSize: 0.000513242440950753},
    {id: 15, x: -491.3739216040643, y: -85.2758672147873, text: "test15", fontSize: 159.99999999999872},
    {id: 16, x: -1303.9223347593845, y: -189.27585654519936, text: "test16", fontSize: 226.27416997969334},
    {id: 17, x: -3614.630561610377, y: -323.70819890103445, text: "test17", fontSize: 905.0966799187728},
    {id: 18, x: -9342.456857155341, y: -809.2705284670758, text: "test18", fontSize: 2152.6948230494886},
    {id: 19, x: -17632.957016230488, y: -1748.6982337578795, text: "test19", fontSize: 3044.3702144069366},
    {id: 20, x: -34529.21208752887, y: -3879.757393564678, text: "test20", fontSize: 6088.740428813872},
    {id: 113, x: 10412901562002.574, y: 1891828629789.287, text: "WOW you're far from home.", fontSize: 2311438465816.513},
    {id: 114, x: 374.2565272544432, y: 354.53262339773846, text: "test114", fontSize: 159.99999999999832},
    {id: 115, x: 214123162955070.66, y: 10711632881380.672, text: "I mean. WOW.", fontSize: 31098885119754.062},
    {id: 116, x: 1104592423952645, y: -81819586322754.16, text: "Is anyone seeing this??", fontSize: 209207528124706.03},
    {id: 117, x: 27359550959356268, y: -1764328513537750, text: "Here's a heart for ya:\n❤️", fontSize: 3980657295328512.5},
    {id: 118, x: 339542519644310660, y: 20194450624807310, text: "Here's a beacon of hope:\n⛯", fontSize: 31845258362628070},
    {id: 119, x: 1044733020186787100, y: -43038781628711940, text: "Now that is just.. stupid", fontSize: 151482431295748700},
    {id: 120, x: 5369006128692392000, y: -759527390857764900, text: "STOP.", fontSize: 720575940379260300} //yep. this is totally the end.
    ];
  }
  nodes.forEach(newNode);
}

function save(node=null){
  if(node === null){
    // save all
    node_ids = [];
    [].forEach.call($(".node"),(node)=>{
      save(node);
      node_ids.push(node.dataset['id']);
      localStorage['noteplace.node_ids'] = JSON.stringify(node_ids);
    })
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


save();

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
    stopEditing();
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
      console.log('newId.N init')
      newId.N = 0;
  }  
  console.log('pre-loop : newId.N='+newId.N);
  console.log('pre-loop : getNode(newId.N)='+getNode(newId.N));

  while(getNode(newId.N)){
    newId.N++;
    console.log('in-loop : newId.N='+newId.N);
    console.log('in-loop : getNode(newId.N)='+getNode(newId.N));
  }
  console.log('after-loop : newId.N='+newId.N);
  console.log('after-loop : getNode(newId.N)='+getNode(newId.N));
  newId.N++;
  return newId.N-1;
}

function newNode(d){
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
  [].forEach.call($('.node'),
    updateNode)
}

selected_node = null;

function _(s){
  if(s[0]=='#'){
    return document.getElementById(s.slice(1));
  }else{
    throw Error('Not Implemented: selector=['+s+']')
  }
}

function select(d){
  selected_node = d;

  _('#text').disabled = false;
  _('#fontSize').disabled = false;
  _('#text').value = d.text;
  _('#fontSize').value = d.fontSize;
  _('#fontSize').step = d.fontSize * 0.25;
  
}


function select_clear(){
  selected_node = null;

  _('#text').disabled = true;
  _('#fontSize').disabled = true;
  _('#text').value = '';
  _('#fontSize').value = '';
}


function getHTML(text){
  return md.render(text).slice(0,-1).replaceAll('\n','<br />');  
}

function getFontSize(d){
  return d.fontSize*S+'px';
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


// function save(){
//   // TODO: probably will want to save each changed node separately
//   localStorage['noteplace.nodes'] = JSON.stringify(nodes);
// }


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

function dblclick(){
  console.log("T="+T);
  console.log("S="+S);
  console.log(d3.event.x+' '+d3.event.y)  ;

  tnode = nodeFromMouse(this)
  addNode( tnode );

  select(tnode);

  redraw()

  $('#text').select();
    
}


function getNode(id){
  return document.getElementById('node_' + id);
}

function getG(d){
  return document.getElementById('node_' + d.id);
}

function onFontSizeEdit(){
  if(selected_node !==null){
    selected_node.fontSize = 1*this.value;
    getG(selected_node).style.fontSize = getFontSize(selected_node);

    this.step = this.value*0.25;

    save();
  }
}

function onTextEditChange(){
  if(selected_node !==null){
    selected_node.text = this.value;
    getG(selected_node).getElementsByTagName('div')[0].innerHTML = getHTML(selected_node);

    this.style.height = "5px";
    this.style.height = (this.scrollHeight)+"px";

    save();
  }
}

$('#text').oninput = onTextEditChange;
$('#fontSize').onchange = onFontSizeEdit;




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
  nodes = [].map.call($('.node'),(d)=>{return {
    id:d.dataset['id'],
    x:d.dataset['x'],
    y:d.dataset['y'],
    fontSize:d.dataset['fontSize'],
    text:d.dataset['text']
  }})
  // Generate download of hello.txt file with some content
  var text = JSON.stringify({T:T,S:S,nodes:nodes});
  var filename = "hello.txt";
  
  download(filename, text);
}, false);


function smoothZoom(T_,S_){
  moveZoom.start.T = T;
  moveZoom.start.S = S;
  moveZoom.end.T = T_;
  moveZoom.end.S = S_;

  moveZoom.tStart = Date.now();

  moveZoom.interval = setInterval(zoomStep, moveZoom.dt);
}

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


