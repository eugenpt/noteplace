
// https://stackoverflow.com/a/17111220/2624911
dragInitiated = false;


// Translate and Scale parameters
T = [0,0];
S = 1;

// is necessary for proper dragging..
dragstartpos = null;



BODY = document.getElementsByTagName('body')[0];
M = 0;


function status(a){
  $('#status').innerText = a;
}


// M = 10;
// var margin = {top: -M, right: -M, bottom: -M, left: -M}
var margin = {top: 0, right:0, bottom: 0, left: 0}
var width = (window.innerWidth || document.documentElement.clientWidth || BODY.clientWidth) - margin.left - margin.right,
    height = window.innerHeight|| document.documentElement.clientHeight|| BODY.clientHeight - margin.top - margin.bottom;

var zoom = d3.behavior.zoom()
    .scale(S).translate([T[0]*S,T[1]*S]) // initial parameters
    .on("zoom", zoomed);
//    .scaleExtent([1, 10]) //yeah, I don't like limits

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);



// function __resize(){
//     width = Math.min(window.innerWidth , document.documentElement.clientWidth);// , BODY.clientWidth);
//     height = Math.min( window.innerHeight, document.documentElement.clientHeight);//, BODY.clientHeight);
//     width = width - margin.left - margin.right;
//     height = height - 10 - margin.top - margin.bottom;

//     d3.select("#svg0")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom);
    
//     d3.select('#rect0')
//         .attr("width", width)
//         .attr("height", height);
// }

// __resize();

// resize_timeout = null;
// function _resize(){
//     clearTimeout(resize_timeout);
//     resize_timeout = setTimeout(__resize, 500);
// }

// d3.select(window).on('resize.updatesvg', _resize);

var container = d3.select("#container");

container
    .call(zoom)
    .on("dblclick.zoom", null)
    .on("dblclick",dblclick)
// var container = svg.append("g");

// container.append("g")
//     .attr("class", "x axis")
//   .selectAll("line")
//     .data(d3.range(0, width, 10))
//   .enter().append("line")
//     .attr("x1", function(d) { return d; })
//     .attr("y1", 0)
//     .attr("x2", function(d) { return d; })
//     .attr("y2", height);

// container.append("g")
//     .attr("class", "y axis")
//   .selectAll("line")
//     .data(d3.range(0, height, 10))
//   .enter().append("line")
//     .attr("x1", 0)
//     .attr("y1", function(d) { return d; })
//     .attr("x2", width)
    // .attr("y2", function(d) { return d; });

// d3.tsv("dots.tsv", dottype, function(error, dots) {
//   dot = container.append("g")
//       .attr("class", "dot")
//     .selectAll("circle")
//       .data(dots)
//     .enter().append("circle")
//       .attr("r", 5)
//       .attr("cx", function(d) { return d.x; })
//       .attr("cy", function(d) { return d.y; })
//       .call(drag);
// });


nodes = ((localStorage['noteplace.nodes'] == 'undefined')||(localStorage['noteplace.nodes'] == undefined))?[
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
     ]:JSON.parse(localStorage['noteplace.nodes']);

node = container.selectAll(".node")

selected_node = null;

function $(s){
  if(s[0]=='#'){
    return document.getElementById(s.slice(1));
  }else{
    throw "Not Implemented"
  }
}

function select(d){
  selected_node = d;

  $('#text').enabled = true;
  $('#fontSize').enabled = true;
  $('#text').value = d.text;
  $('#fontSize').value = d.fontSize;
  $('#fontSize').step = d.fontSize * 0.25;
  
}


function select_clear(){
  selected_node = null;

  $('#text').enabled = false;
  $('#fontSize').enabled = false;
  $('#text').value='';
  $('#fontSize').value='';
}


function getHTML(d){
  return d.text.replaceAll('\n','<br/>').replaceAll(' ','&nbsp');
}

function getFontSize(d){
  return d.fontSize*S+'px';
}





function redraw(){
node = node.data(nodes);
        node.enter()
          .insert("div")
          .attr("class","node")
          .attr("id",(d)=>"node_"+d.id)
          .call(drag) 
          .append("div")
            .attr("class","inside_node")
            .attr('contentEditable',true)
            // .append("text")
            .on("dblclick", function(d){
              console.log('aaa!');
              // console.log(this);
              //this.setAttribute("contentEditable", "true");
              
              d3.event.stopPropagation();
            })
            // .append("text")
            .html(getHTML)
            .each((d)=>addOnContentChange(getG(d),function(e){d.text = getG(d).innerText;save();}))
            
          node
            .style("left",getX)
            .style("top",getY)
            .style("font-size",getFontSize)
            // .attr("x",(d)=>d.x).attr("y",(d)=>d.y)
            // .on("mousedown",function(d){
            //   selected_node = d;
            //   redraw();
            // })
            .on("mousedown",function(d){
              if(selected_node === d){
                select_clear();
              }else
                select(d);
              redraw();
            })
            // .on("dblclick",function(d){
            //   d3.event.stopPropagation();
            // })
            //.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
  node.exit().remove();          
  node.classed("selected", function(d) { return d === selected_node; })
}
redraw();

function dottype(d) {
  d.x = +d.x;
  d.y = +d.y;
  return d;
}


function getX(d){
  return (d.x + T[0])*S + 'px';
  return d.x+'px';
}

function getY(d){
  return (d.y + T[1])*S + 'px';
  return d.y+'px';
}

function zoomed() {
    S = d3.event.scale;
    T[0] = d3.event.translate[0]/S;
    T[1] = d3.event.translate[1]/S;

//    console.log(T)
//    console.log(S)
status('T=['+T[0].toFixed(2)+','+T[1].toFixed(2)+']'+' S='+S.toFixed(2));//+' E:['+d3.event.x.toFixed(2)+','+d3.event.y.toFixed(2)+']');

    //container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    
    
    redraw();
}


function dragstarted(d) {
  console.log(d3.event.sourceEvent.which);
  if (d3.event.sourceEvent.which == 2){
  dragInitiated = true;
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
  }
}


function dragged(d) {
  if(dragInitiated){
    if(dragstartpos==null){
      dragstartpos = [d3.event.x,d3.event.y];
    }
    status(' E:['+d3.event.x.toFixed(2)+','+d3.event.y.toFixed(2)+']');
    d3.select(this)
    .style("left",function(d){d.x = (d3.event.x - dragstartpos[0])/S + dragstartpos[0] ; return getX(d);})
    .style("top",function(d){d.y = (d3.event.y- dragstartpos[1])/S + dragstartpos[1]  ; return getY(d);})

    status(
      'T=['+T[0].toFixed(2)+','+T[1].toFixed(2)+']'+' S='+S.toFixed(2)
      + ' E:['+d3.event.x.toFixed(2)+','+d3.event.y.toFixed(2)+']'
      +' left:'+getG(d).style.left+' top:'+getG(d).style.top+''
      );

    //.attr("transform", function(d) {d.x = d3.event.x;d.y = d3.event.y; return "translate(" + d.x + "," + d.y + ")"; })
        //      .attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
  }
}

function dragended(d) {
  // console.log(d3.event.x+' '+d3.event.y)  ;
  d3.select(this).classed("dragging", false);
  dragstartpos = null;
  save();

  dragInitiated = false;
}

var N=Math.max.apply(Math,nodes.map((d) => d.id));

function nodeFromMouse(_t){
    var point = d3.mouse(_t);
    N=N+1;
    fontSize = 20/S;

    return {
        id:N, 
        x: (d3.event.x)/S - T[0], 
        y: (d3.event.y)/S - T[1], 
        text:'test'+N, 
        fontSize:fontSize
      }
}

function save(){

  localStorage['noteplace.nodes'] = JSON.stringify(nodes);

}

function addNode(n){
  nodes.push(n);
  save();
}

function dblclick(){
    console.log("T="+T);
    console.log("S="+S);
    console.log(d3.event.x+' '+d3.event.y)  ;

    tnode = nodeFromMouse(this)
    addNode( tnode );

    redraw()

    var el = getG(tnode);
    var range = document.createRange()
    var sel = window.getSelection()
    
    //range.setStart(el.childNodes[0], 0)
    range.selectNodeContents(el.childNodes[0])
    // range.collapse(true)
    
    sel.removeAllRanges()
    sel.addRange(range)
    
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
document.getElementById("save").addEventListener("click", function(){
  // Generate download of hello.txt file with some content
  var text = JSON.stringify({T:T,S:S,nodes:nodes});
  var filename = "hello.txt";
  
  download(filename, text);
}, false);


$('#file').oninput = function(){
    var fr=new FileReader();
    fr.onload=function(){
        console.log('Loading..');
        G = JSON.parse(fr.result);
        T = [1*G.T[0],1*G.T[1]];
        S = 1*G.S;
        zoom.scale(S).translate([T[0]*S,T[1]*S]);
        nodes = G.nodes;
        redraw();
        console.log('Loading complete, now '+nodes.length+' nodes');

        $('#file').value = "";
    }
      
    fr.readAsText(this.files[0]);  
}


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

function contentChanged() {
   // this function will run each time the content of the DIV changes
}