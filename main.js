BODY = document.getElementsByTagName('body')[0];

var margin = {top: -5, right: -5, bottom: -5, left: -5},
    width = (window.innerWidth || document.documentElement.clientWidth || BODY.clientWidth) - margin.left - margin.right,
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
    width = window.innerWidth || document.documentElement.clientWidth || BODY.clientWidth;
    height = window.innerHeight|| document.documentElement.clientHeight|| BODY.clientHeight;
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    d3.select("#svg0")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    
    d3.select('#rect0')
        .attr("width", width)
        .attr("height", height);

}

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

d3.tsv("dots.tsv", dottype, function(error, dots) {
  dot = container.append("g")
      .attr("class", "dot")
    .selectAll("circle")
      .data(dots)
    .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .call(drag);
});


nodes = [
    {x:0, y:0, text:"test0", fontSize:12},
    {x:30, y:30, text:"test1", fontSize:12}
    ];

node = container.selectAll(".node")

function redraw(){
node = node.data(nodes);
        node.enter()
            // .insert("g")
            .append("text")
            .attr("class","node")
            // .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    
            .attr("x",(d)=>d.x)
            .attr("y",(d)=>d.y)
            .text((d)=>d.text)
            .style("font-size",(d)=>d.fontSize)
            .call(drag);
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
  d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
}

function dragended(d) {
  console.log(d3.event.x+' '+d3.event.y)  ;
  d3.select(this).classed("dragging", false);
}

var N=2;

function nodeFromMouse(_t){
    var point = d3.mouse(_t);
    N=N+1;
    return {x: (d3.event.x - T[0])/S, y: (d3.event.y - T[1])/S, text:'test'+N, fontSize:5}
}

function dblclick(){
    console.log("T="+T)  ;
    console.log("S="+S);
    console.log(d3.event.x+' '+d3.event.y)  ;
    nodes.push(nodeFromMouse(this));
    redraw()
}