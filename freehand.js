class FreeHand{
  status = null;// null / 'ready' / 'drawing'
  points = [];
  path = null;
  svg = null;
  
  static svgns = 'http://www.w3.org/2000/svg';

  stop(){
    this.status = null;
    this.toggleButton(false);
    this.fieldSetVisible(false);
  }
  
  ready(){
    this.status = 'ready';
    this.points = [];
    this.toggleButton(true);
    this.fieldSetVisible(true);
    this.createSVG(this);
  }
  
  toggleButton(go){
    var cl = _('#btnFreehand').classList;
    if(go){
      cl.add('btn-primary');
      cl.remove('btn-outline-primary');
    }else{
      cl.remove('btn-primary');
      cl.add('btn-outline-primary');
    }
  }
  
  fieldSetVisible(vis){
    _('#freehandField').style.display = vis?'':'none';
  }
  
  createSVG(T){
    T.svg = document.createElementNS(T.svgns, 'svg');
    T.svg.id = 'freehandsvg';
    T.svg.setAttributeNS(null, 'width', width);
    T.svg.setAttributeNS(null, 'height', height);
  
    T.path = document.createElementNS(T.svgns, 'path');
    T.path.setAttributeNS( null, 'stroke', 'blue');
    T.path.setAttributeNS(null,  'fill', 'none');
    T.path.setAttributeNS(null,  'strokeWidth', '2');
    T.svg.appendChild(T.path);
    
    // for some reason svg is not properly added otherwise.
    // _('#freehandField').appendChild(T.svg);
    _('#freehandField').innerHTML += T.svg.outerHTML;
    T.svg = _('#freehandsvg');
    T.path = _FreeHand.svg.childNodes[0];
    
  }
  
  draw(T) {
    if (T.points.length > 3) {
     
      T.path.setAttributeNS(
        null, 
        'd', 
        'M ' + T.points.map(a => a[0] + ' ' + a[1]).join(' L')
      );
  
    }
  }
  
  constructor() {
    var T = this
    _('#btnFreehand').onclick = function() {
      if (T.status) {
        T.stop();
      } else {
        T.ready();
      }
    }
    
    _('#freehandField').onmouseup = function (e) {
      console.log(e);
      // return 0
      T.stop();
      e.stopPropagation();
    
      const minPs = [0,0];
      const maxPs = [0,0];
      const d = 10;
      [0,1].forEach(j => {
        minPs[j] = -d + Math.min.apply(Math, T.points.map(a => a[j]));
        T.points.forEach(a => { a[j] -= minPs[j];});
        maxPs[j] = Math.max.apply(Math, T.points.map(a => a[j]));
      });
      T.draw(T);
      T.svg.setAttribute('width', maxPs[0] + d )
      T.svg.setAttribute('height', maxPs[1] + d )
      T.svg.id = "";
      
      // setTimeout(function(){
      applyAction({
        type: 'A',
        
        nodes: [{
          text: T.svg.outerHTML,
          mousePos: [ minPs[0] ,  minPs[1]],
          style: { color: '#0000ff', strokeWidth: 5, fill:'none'},
        }]
      })
      // }, 50);
    
      T.svg.parentElement.removeChild(T.svg);
    }
    
    _('#freehandField').onmousedown = function (e) {
      T.status = 'drawing';
      e.stopPropagation();
    }
    
    _('#freehandField').onmousemove = function (e) {
      if( T.status == 'drawing'){
        T.points.push([e.clientX, e.clientY]);
        T.draw(T);
      }
      e.stopPropagation();
    }
    
    console.log("Created a FreeHand");
  }
      
}
