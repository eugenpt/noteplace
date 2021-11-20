

function clientToStatePos(clientPos, state){
  return [
      state.T[0] + clientPos[0] / state.S, 
      state.T[1] + clientPos[1] / state.S
  ]
}

function stateToClientPos(pos, state){
  return [
    (pos[0] - state.T[0]) * state.S, 
    (pos[1] - state.T[1]) * state.S
  ]
}

let _View = {
  state:{
    T: [0, 0],
    S: 1,
  },
  getState: function getState(){
    return copy(_View.state);
  },
  
  preview: {
    saved: {
      node: null,
      oldState: { T: [0, 0], S: 1 },
    },
  },
  
  clientToPos: function(x, y) {
    var pos = [x,y];
    if (y==undefined) {
      pos = x;
    }
    return clientToStatePos(pos, _View.state);
  },
  
  posToClient: function(x, y) {
    var pos = [x,y];
    if (y==undefined) {
      pos = x;
    }
    return stateToClientPos(pos, _View.state);
    
  },

  
  changeZoom: function changeViewZooom(Scoef, centerClientPos){
    mousePos = _View.clientToPos(centerClientPos);
    _View.state.S = fitInBorders( _View.state.S * Scoef, zoomMin, zoomMax);
    _View.applyZoom(
      [
        mousePos[0] - centerClientPos[0] / _View.state.S, 
        mousePos[1] - centerClientPos[1] / _View.state.S
      ],
      _View.state.S,
      true
    );  
  },
  
  getStateURL: function getStateURL (state = null) {
    if (state == null) {
      state = currentState();
    }
    return '?Tx=' + state.T[0] + '&Ty=' + state.T[1] + '&S=' + state.S;
  },  
  
  applyZoom: function applyZoom (T_, S_, smooth = true, noTemp = false) {
    console.log('S=' + _View.state.S + ' S_=' + S_);
    _View.state.T = T_;
  
    const ds = 0.2 + Math.abs(Math.log10(_View.state.S / S_));
    console.log('ds=' + ds);
    _View.state.S = S_;
  
    if (smooth) {
      setTransitionDur(ds);
    }
  
    status(_View.state);
  
    redraw();
  
    if (noTemp) {
      _View.preview.saved.oldState = { T: T_, S: S_ };
    }
  
    if (smooth) {
      clearTimeout(_View.applyZoom_zoomResetTimeout);
      _View.applyZoom_zoomResetTimeout = setTimeout(function () {
        setTransitionDur(0);
      }, 1000 * ds);
    }
  },
  applyZoom_zoomResetTimeout : null,
  applyZoom_lastSmooth : false,

  goto: function gotoState (state, smooth = false, rewrite_preview = false) {
    _View.applyZoom(state.T, state.S, smooth, rewrite_preview);
  },

  isBoxSeen: function isBoxSeen(x, xMax, y, yMax) {
    if (xMax===undefined) { 
      yMax = x[3];
      y = x[2];
      xMax = x[1];
      x=x[0];
    }
    return isInBox(x, xMax, y, yMax,
      _View.state.T[0] - width * 0.5 / _View.state.S, _View.state.T[0] + width * 1.5 / (1 * _View.state.S),
      _View.state.T[1] - height * 0.5 / _View.state.S, _View.state.T[1] + width * 1.5 / (1 * _View.state.S)
    )    
  },
  
  gotoURL: function zoomToURL (s, smooth = true, noTemp = false) {
    const urlParams = new URLSearchParams(s);
    _View.applyZoom(
      [1 * urlParams.get('Tx'), 1 * urlParams.get('Ty')]
      , 1 * urlParams.get('S') ? 1 * urlParams.get('S') : 1
      , smooth
      , noTemp
    );
  }, 

  
  gotoNode: function gotoNode (node) {
    gotoState(nodeState(node), false, true);
    depreviewNode();
  },

  previewState: function previewState(state){
    // accepts state as 
    //  - {T: .., S:..}
    //  - JSON string
    //  - URLSearchParams string
    if (typeof (state) === 'string') {
      state = parseStateFromString(state);
    }

    _View.preview.saved.oldState = currentState();

    _View.goto(state, false, false);
  },

  
  previewNode: function previewNode (node) {
    _View.previewState(nodeState(node));

    node.dom.classList.add('np-search-preview');
  },

  exitPreview: function exitPreview(){
    _View.goto(_View.preview.saved.oldState, false, true)
  }

}

zoomToURL = _View.gotoURL;
gotoState = _View.goto;
gotoNode = _View.gotoNode;
getStateURL = _View.getStateURL;
exitPreview = _View.exitPreview;
previewState = _View.previewState;
posToClient = _View.posToClient;
clientToPos = _View.clientToPos;
previewNode = _View.previewNode;

function currentState(){
  return copy(_View.state);
}

function parseStateFromString(stateString){
  try {
    state = JSON.parse(stateString);
    state = { T: [state.T[0] * 1, state.T[1] * 1], S: state.S * 1 };
  } catch (e) {
    state = new URLSearchParams(stateString);
    state = { T: [state.get('Tx') * 1, state.get('Ty') * 1], S: state.get('S') * 1 };
  }
  return state
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
  exitPreview();
  
  $('.np-search-preview').removeClass('np-search-preview');
}

