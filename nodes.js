
let _NODES = [];
let _DOMId2node = new Map();
let _DOMId2nodej = new Map();

let _NODEId2node = new Map();

function gen_DOMId2nodej () {
  _DOMId2node = new Map();
  _DOMId2nodej = new Map();
  _NODEId2node = new Map();

  for (let j = 0; j < _NODES.length; j++) {
    _DOMId2node.set(_NODES[j].dom.id, _NODES[j]);
    _DOMId2nodej.set(_NODES[j].dom.id, j);
    _NODEId2node.set(_NODES[j].id, _NODES[j].id);
  }
}

function stripNode (d) {
  // strips only relevant data for nodes, also convert to numerical
  return {
    id: ('id' in d) ? d.id+'' : newNodeID(), // newNodeID(),//
    x: 1 * d.x,
    y: 1 * d.y,
    fontSize: 1 * d.fontSize,
    text: d.text,
    rotate: 'rotate' in d ? 1 * d.rotate:0,
    deleted: 'deleted' in d ? d.deleted : false,
    style: 'style' in d ? delete_defaults(d.style, default_node_style) : undefined
  };
}

function isNode (obj) {
  return 'x' in obj; // yeah..
}

function idNode (id) {
  return _NODEId2node.get(id);
}

function domNode (dom) {
  return _DOMId2node.get(typeof (dom) === 'string' ? dom : dom.id);
}

function newNodeID (id = null) {
  return newID(id || 'n', idNode);
}

function pushNodeNDom(node, tdom) {
  console.log("pushing..");
  _NODES.push(node);
  _NODEId2node.set(node.id, node);
  _DOMId2node.set(tdom.id, node);
  _DOMId2nodej.set(tdom.id, _NODES.length - 1);
}

function getNodeIdLocalStorageKey(node_id){
  return  'noteplace.node_' + node_id
}

function getNodeLocalStorageKey(node){
  return getNodeIdLocalStorageKey(node.id)
}

function getNodeDomLocalStorageKey(dom) {
 return 'noteplace.' + dom.id;
}

function deleteNode(d) {
  if (isDom(d)) {
    d = domNode(d);
  }
  // _NODES
  // ixs (TODO:optimize further)
  gen_DOMId2nodej();
  // remove from _NODES
  _NODES.splice(_DOMId2nodej.get(d.dom.id), 1);
  // remove from index
  _DOMId2node.delete(d.dom.id);
  // remove from DOM
  node_container.removeChild(d.dom);
  // remove from saved
  removeNodeFromLocalStorage(d);
}

// ::::    ::: :::::::::: :::       ::: ::::    :::  ::::::::  :::::::::  ::::::::::
// :+:+:   :+: :+:        :+:       :+: :+:+:   :+: :+:    :+: :+:    :+: :+:
// :+:+:+  +:+ +:+        +:+       +:+ :+:+:+  +:+ +:+    +:+ +:+    +:+ +:+
// +#+ +:+ +#+ +#++:++#   +#+  +:+  +#+ +#+ +:+ +#+ +#+    +:+ +#+    +:+ +#++:++#
// +#+  +#+#+# +#+        +#+ +#+#+ +#+ +#+  +#+#+# +#+    +#+ +#+    +#+ +#+
// #+#   #+#+# #+#         #+#+# #+#+#  #+#   #+#+# #+#    #+# #+#    #+# #+#
// ###    #### ##########   ###   ###   ###    ####  ########  #########  ##########

function newNode (node, redraw=true, addToNodes=true) {
  var tdom;
  // console.log(d);
  if ('className' in node) {
    console.log('newNode with DOM node provided:');
    tdom = node;
    node = domNode(tdom);
  } else {
    console.log('newNode with node provided');
    
    fillMissingNodeFields(node);

    tdom = _ce('div'
      , 'id', 'node_' + node.id
      , 'className', 'node ui-rotatable'
      , 'onclick', onNodeClick
      , 'ondblclick', onNodeDblClick
      , 'onmousedown', onNodeMouseDown
      , 'style.display', 'none'
    );

    if(addToNodes){
      pushNodeNDom(node, tdom);
    }
  }
  tdom.innerHTML = '';

  const tcontent = _ce('div'
    , 'className', 'np-n-c'
    , 'innerHTML', getHTML(node)
  );

  if(node.is_svg){
    // tcontent.classList.add('svg');
    tdom.classList.add('svg');

    node.svg_dom = tcontent.getElementsByTagName('svg')[0];

    node.path_dom = node.svg_dom.getElementsByTagName('path')[0];

    node.path_dom.setAttribute("stroke", node.style.color);
    node.path_dom.setAttribute("strokeWidth", node.style.strokeWidth);
    node.path_dom.setAttribute("fill", node.style.fill);
    

    node.svg_dom.onmousedown = function(e) {
      //if(onNodeMouseDown.path_ok)
    }
    node.path_dom.onmousedown = function (e) {
      onNodeMouseDown.path_ok = true;
    }

    node.path_dom.ondblclick = function (e) {
      onNodeDblClick.path_ok = true;
    }
    node.path_dom.onclick = function (e) {
      onNodeClick.path_ok = true;
    }
    
  }
  if(node.is_img){
    tdom.classList.add('img');

    node.img_dom = tcontent.getElementsByTagName('img')[0];
    node.img_dom.onload = function(e) {
      console.log('img load');
      console.log(this);
    }
    node.img_dom.addEventListener('load',function () {
      console.log('node '+node.id+' img ready!!');
      node.size = [node.img_dom.width, node.img_dom.height];
    });
  }

  // Tooltip

  const tt = _ce('div'
    , 'className', 'position-absolute start-0 np-n-tooltip'// translate-middle start-50
  );

  if (node.is_img == false) {
    // not entirely image-based node, add color select
    const tcolorselect = _ce('input'
      , 'type', 'color'
      , 'value', node.style.color
      , 'oninput', function (e) {
        node.style.color = this.value;
        node.content_dom.style.color = this.value;
        if (node.is_svg) {
          node.path_dom.setAttribute("stroke", this.value);
        }
      }
      , 'onchange', function (e) {
        applyAction( { 
          type: 'E',
          node_ids: [ node.id ],
          oldValues: [ { 'style.color': this.dataset['oldValue'] } ],
          newValues: [ { 'style.color': this.value } ]
        })
      }
    );
    tcolorselect.dataset['oldValue'] = node.style.color;
    tt.appendChild(tcolorselect);
  
  }
  if((node.is_img == false) && (node.is_svg == false)){
    if (tcontent.innerHTML.indexOf('<br') >= 0) {
      // text align only valuable for multiline nodes
      ['left', 'center', 'right'].forEach((jta) => {
        let tbtn = _ce('button'
          , 'className', 'np-n-t-btn np-n-t-ta' + (node.style.textAlign == jta ? ' np-n-t-ta-selected':'')
          , 'innerHTML', '<i class="bi-text-' + jta + '"></i>'
          , 'onclick', function (e) {
            console.log('clicked on text-align=' + this.dataset.textAlign);
            $(this.parent)
              .find('.np-n-t-ta')
              .removeClass('np-n-t-ta-selected')
              .find('[data-text-align="' + this.dataset.textAlign + '"]')
              .addClass('np-n-t-ta-selected');

            applyAction({
              type: 'E',
              node_ids: [ node.id ],
              newValues: [ { 'style.textAlign': this.dataset.textAlign } ]
            })  
            // node.style.textAlign = this.dataset.textAlign;
            node.content_dom.style.textAlign = this.dataset.textAlign;
            // newNode(node.node);
            // selectNode(node)
            e.stopPropagation();
          }
        );

        tbtn.dataset.textAlign = jta;
        tt.appendChild(tbtn);
      });
    }
  }

  const tplusbtn = _ce('button'
    , 'className', 'np-n-t-btn plus-button'// btn btn-outline-primary'
    , 'onclick', function (e) { editFontSize(+1); e.stopPropagation(); }
    , 'title', 'make BIGGER'
    , 'innerHTML', '<i class="bi bi-plus"></i>'
  );
  const tminusbtn = _ce('button'
    , 'className', 'np-n-t-btn minus-button'// 'btn btn-outline-primary'
    , 'onclick', function (e) { editFontSize(-1); e.stopPropagation(); }
    , 'title', 'Make smaller'
    , 'innerHTML', '<i class="bi bi-dash"></i>'
  );
  tt.appendChild(tplusbtn);
  tt.appendChild(tminusbtn);

  if (node.is_svg) {
    // add line width !!
    const tplusbtnLW = _ce('button'
      , 'className', 'np-n-t-btn plus-button'// btn btn-outline-primary'
      , 'onclick', function (e) { changeStrokeWidth(+1); e.stopPropagation(); }
      , 'title', 'make <b>thicker</b>'
      , 'innerHTML', '<div style="font-weight:900; transform:translate(-20%,0);">➖</span>'
    );
    const tminusbtnLW = _ce('button'
      , 'className', 'np-n-t-btn minus-button'// 'btn btn-outline-primary'
      , 'onclick', function (e) { changeStrokeWidth(-1); e.stopPropagation(); }
      , 'title', 'make thinner'
      , 'innerHTML', '<div style="font-weight:100;">—</span>'
    );
    tt.appendChild(tplusbtnLW );
    tt.appendChild(tminusbtnLW );

    // fill?
    const tbutton = _ce('button'
      ,'className', "np-n-t-btn"
    );

    const tlabel = _ce('label'
      ,'innerHTML', node.style.fill=='none'?'<i class="bi-bucket"></i>':'<i class="bi-bucket-fill"></i>'
      ,'ondblclick', function (e) {
        applyAction({
          type: 'E',
          node_ids: [node.id],
          oldValues: [{'style.fill': this.dataset['oldValue']}],
          newValues: [{'style.fill': 'none'}]
        });
        e.stopPropagation();
      }
    );
    tlabel.setAttribute('for','inputfill_'+node.id);
    if(node.style.fill!=='none'){
      tlabel.style.color = node.style.fill;
    }


    const tfillinput = _ce('input'
      ,'type','color'
      ,'value', node.style.fill=='none'?'#ffffff':node.style.fill
      ,'id','inputfill_'+node.id
      ,'style','width:0px;height:0px;'
      // ,'hidden','hidden'
      ,'oninput', function (e) {
        tlabel.style.color = this.value;
        node.style.fill = this.value;
        node.path_dom.setAttribute('fill', this.value);
        tlabel.innerHTML = '<i class="bi-bucket-fill"></i>';
      }
      ,'onchange', function (e) {
        applyAction({
          type: 'E',
          node_ids: [node.id],
          oldValues: [{'style.fill': this.dataset['oldValue']}],
          newValues: [{'style.fill': this.value}],
        });
      }

    )
    tfillinput.dataset['oldValue'] = node.style.fill;
    tbutton.appendChild(tlabel);
    tbutton.appendChild(tfillinput);

    // tt.appendChild(tfillinput);
    tt.appendChild(tbutton);
  }


  tt.addEventListener('click', function(e) {
    e.stopPropagation();
  })
  tt.addEventListener('mousedown', function(e) {
    e.stopPropagation();
  })
  tt.addEventListener('mouseup', function(e) {
    e.stopPropagation();
  })
  tt.addEventListener('dblclick', function (e) {
    e.stopPropagation();
  });

  tdom.appendChild(tt);

  for (const p of Object.keys(node.style)) {
    tcontent.style[p] = node.style[p];
  }

  tdom.appendChild(tcontent);

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
  // node.node = tdom;
  node.dom = tdom;
  node.content_dom = tcontent;

  if (!('className' in node)) {
    node_container.appendChild(tdom);
  }

  

  tdom.getElementsByTagName('a').forEach( (elt) => {
    if (elt.href) {
      elt.onclick = (e) => {
        e.stopPropagation();
      };
      elt.onmousedown = (e) => {
        e.stopPropagation();
      };
    }
  });

  if (redraw) {
    redrawNode(node);
  } else {
    updateNode(node);
  }

  if(tdom.classList.contains('selected')){
    // deselectOneDOM(tdom);
    try{$(tdom).rotatable('destroy');}catch(e){}
    setTimeout(function(){selectOneDOM(tdom);},1);
  }

  return tdom;
}

function fillMissingNodeFields(node){
  if ((!('id' in node)) || (node.id === undefined) || (idNode(node.id))) {
    node.id = newNodeID();
  }
  if (!('rotate' in node)) {
    node.rotate = 0;
  }
  if (!('x' in node)) {
    let mousePos = _Mouse.pos;
    if ('mousePos' in node) {
      mousePos = node.mousePos;
    }
    const mouseXY = clientToNode(mousePos);
    node.x = mouseXY[0];
    node.y = mouseXY[1];
  }
  if (!('fontSize' in node)) {
    node.fontSize = 20 / S;
  }
  if ((!node.hasOwnProperty('style'))||
      (node.style === undefined)) {
    node.style = Object.assign({}, default_node_style);
  } else {
    node.style = Object.assign({}, default_node_style, node.style);
  }
}

