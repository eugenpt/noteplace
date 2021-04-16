BODY = document.getElementsByTagName('body')[0];

M = 0;
// M = 10;
// var margin = {top: -M, right: -M, bottom: -M, left: -M}
var margin = {top: 0, right:0, bottom: 0, left: 0}
var width = (window.innerWidth || document.documentElement.clientWidth || BODY.clientWidth) - margin.left - margin.right,
    height = window.innerHeight|| document.documentElement.clientHeight|| BODY.clientHeight - margin.top - margin.bottom;

var zoom = d3.behavior.zoom()
    .on("zoom", zoomed);
//    .scaleExtent([1, 10])

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

var svg = d3.select("body").append("svg").attr("id","svg0")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
    .call(zoom)
    .on("dblclick.zoom", null)
    .on("dblclick",dblclick)
    ;

var rect = svg.append("rect").attr("id","rect0")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");


function __resize(){
    width = Math.min(window.innerWidth , document.documentElement.clientWidth);// , BODY.clientWidth);
    height = Math.min( window.innerHeight, document.documentElement.clientHeight);//, BODY.clientHeight);
    width = width - margin.left - margin.right;
    height = height - 10 - margin.top - margin.bottom;

    d3.select("#svg0")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    
    d3.select('#rect0')
        .attr("width", width)
        .attr("height", height);

}

__resize();

resize_timeout = null;
function _resize(){
    clearTimeout(resize_timeout);
    resize_timeout = setTimeout(__resize, 500);
}

d3.select(window).on('resize.updatesvg', _resize);

var container = svg.append("g");

container.append("g")
    .attr("class", "x axis")
  .selectAll("line")
    .data(d3.range(0, width, 10))
  .enter().append("line")
    .attr("x1", function(d) { return d; })
    .attr("y1", 0)
    .attr("x2", function(d) { return d; })
    .attr("y2", height);

container.append("g")
    .attr("class", "y axis")
  .selectAll("line")
    .data(d3.range(0, height, 10))
  .enter().append("line")
    .attr("x1", 0)
    .attr("y1", function(d) { return d; })
    .attr("x2", width)
    .attr("y2", function(d) { return d; });

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


nodes = localStorage['noteplace.nodes'] == undefined?[
   {id: 0, x: 0, y: 0, text: "test0", fontSize: 12},
   {id: 1, x: 90.10408020019531, y: 45.55634880065918, text: "test1", fontSize: 12},
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
   {id: 21, x: -60637.16828294902, y: -7697.692581519314, text: "test21", fontSize: 14481.546878700345},
   {id: 22, x: -85847.63605109324, y: -13852.14863316447, text: "test22", fontSize: 24354.96171525547},
   {id: 23, x: -114125.98197880859, y: -20149.82054705238, text: "test23", fontSize: 48709.92343051093}
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
  $('#text').value=d.text;
  $('#fontSize').value=d.fontSize;
}


function select_clear(){
  selected_node = null;

  $('#text').enabled = false;
  $('#fontSize').enabled = false;
  $('#text').value='';
  $('#fontSize').value='';
}

function redraw(){
node = node.data(nodes);
        node.enter()
          .insert("g")
          .attr("class","node")
          .attr("id",(d)=>"node_"+d.id)
          .call(drag) 
            .append("text")
            .on("dblclick", function(d){
              console.log('aaa!');
              // console.log(this);
              select(d);
              $('#text').select();
              d3.event.stopPropagation();
            })
            // .append("text")
            .text((d)=>d.text)
            
          node
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            // .attr("x",(d)=>d.x).attr("y",(d)=>d.y)
            .style("font-size",(d)=>d.fontSize)
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
            .on("dblclick",function(d){
              d3.event.stopPropagation();
            })
            
  node.classed("selected", function(d) { return d === selected_node; })
}
redraw();

function dottype(d) {
  d.x = +d.x;
  d.y = +d.y;
  return d;
}

T = [0,0];
S = 1;

function zoomed() {
    S = d3.event.scale;
    T = d3.event.translate;
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this)
      .attr("transform", function(d) {d.x = d3.event.x;d.y = d3.event.y; return "translate(" + d.x + "," + d.y + ")"; })
      //      .attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
}

function dragended(d) {
  console.log(d3.event.x+' '+d3.event.y)  ;
  d3.select(this).classed("dragging", false);

  save();
}

var N=Math.max.apply(Math,nodes.map((d) => d.id));

function nodeFromMouse(_t){
    var point = d3.mouse(_t);
    N=N+1;
    fontSize = 20/S;

    return {id:N, x: (d3.event.x - T[0])/S, y: (d3.event.y - T[1])/S, text:'test'+N, fontSize:fontSize}
}

function save(){

  localStorage['noteplace.nodes'] = JSON.stringify(nodes);

}

function addNode(n){
  nodes.push(n);
  save();
}

function dblclick(){
    console.log("T="+T)  ;
    console.log("S="+S);
    console.log(d3.event.x+' '+d3.event.y);
    var tnode = nodeFromMouse(this)
    addNode(tnode);
    select(tnode);
    $('#text').select();
    redraw()
}

function getG(d){
  return document.getElementById('node_' + d.id);
}

function onFontSizeEdit(){
  if(selected_node !==null){
    selected_node.fontSize = 1*document.getElementById("fontSize").value;
    getG(selected_node).style.fontSize = selected_node.fontSize;

    save();
  }
}

function onTextEditChange(){
  if(selected_node !==null){
    selected_node.text = this.value;
    getG(selected_node).getElementsByTagName('text')[0].innerHTML = selected_node.text;

    save();
  }
}

$('#text').oninput = onTextEditChange;
$('#fontSize').onchange = onFontSizeEdit;

