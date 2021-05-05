
let _NODES = [];
let _DOMId2node = new Map();
let _DOMId2nodej = new Map();

let _NODEId2node = new Map();

function gen_DOMId2nodej () {
  _DOMId2node = new Map();
  _DOMId2nodej = new Map();
  _NODEId2node = new Map();

  for (let j = 0; j < _NODES.length; j++) {
    _DOMId2node.set(_NODES[j].node.id, _NODES[j]);
    _DOMId2nodej.set(_NODES[j].node.id, j);
    _NODEId2node.set(_NODES[j].id, _NODES[j].id);
  }
}

function idNode (id) {
  return _NODEId2node.get(id);
}

function domNode (dom) {
  return _DOMId2node.get(typeof (dom) === 'string' ? dom : dom.id);
}