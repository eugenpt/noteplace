// _PLACES = {}

_PLACES_dragContent = null;

const _PLACES_default = {
  name: 'Places',
  items: [
    { name: 'Home?', state: { T: [0, 0], S: 1 } }
    // {name:'Test folder', items:[
    //   {name:'test 1', state:{T:[-4000,-2000], S:0.1}},
    //   {name:'Test sub-folder..', items:[
    //     {name:'test 2', state:{T:[-400000,-200000], S:0.001}},
    //     {name:'test 3', state:{T:[-400000,-250000], S:0.001}},
    //   ]}
    // ]}
  ]
};

function stripPlace (place = null) {
  if (place === null) {
    place = _PLACES;
  }

  if ('items' in place) {
    return {
      name: place.name,
      items: place.items.map(stripPlace)
    };
  } else {
    return {
      name: place.name,
      state: {
        T: place.state.T.slice(),
        S: place.state.S
      }
    };
  }
}

function placeOKNewName (path, new_name) {
  console.log('placeOKNewName path=' + path + ' new_name=' + new_name);
  if (!Array.isArray(path)) {
    path = JSON.parse(path);
  }

  return (pathPlace(path)// .slice(0,-1))
    .items
    .map(s => s.name)
    .indexOf(new_name) === -1
  );
}

// returns _PLACES for path
function pathPlace (path) {
  let p = _PLACES;
  path = ((typeof (path) === 'string') ? JSON.parse(path) : path).forEach((e) => {
    p = p.items[p.items.map(jp => jp.name).indexOf(e)];
  });
  return p;
}

function placesUpdatePaths (places = null, _path = []) {
  if (!places) {
    places = _PLACES.items;
  }
  for (const place of places) {
    const path = _path.slice();
    path.push(place.name);
    if ('items' in place) {
      place.dom.hBtn.dataset.path = JSON.stringify(path);

      placesUpdatePaths(place.items, path);
    } else {
      place.dom.a.dataset.path = JSON.stringify(path);
    }
  }
}

function placeNewName (path, folder = false) {
  let _name = 'New ' + (folder ? 'Folder':'Place');
  let j = 0;
  while (!placeOKNewName(path, _name)) {
    j++;
    _name = 'New ' + (folder ? 'Folder':'Place') + ' ' + j;
  }
  return _name;
}

function addPlaceFolder (path) {
  console.log('addPlaceFolder path=' + path);
  const place = { name: placeNewName(path, true), items: [] };
  const hpath = JSON.parse(path);
  hpath.push(place.name);

  const rli = createPlaceFolderDOM(place, JSON.stringify(hpath));

  pathPlace(path).dom.ul.appendChild(rli);
  pathPlace(path).items.push(place);

  _localStorage.places.save();

  place.dom.btnEdit.click();
}

function addPlace (path) {
  console.log('addPlace path=' + path);

  const place = { name: placeNewName(path), state: _View.getState()};
  const hpath = JSON.parse(path);
  hpath.push(place.name);

  const rli = createPlaceDOM(place, JSON.stringify(hpath));

  pathPlace(path).dom.ul.appendChild(rli);
  pathPlace(path).items.push(place);

  _localStorage.places.save();

  place.dom.btnEdit.click();
}

function fillPlaces () {
  createPlaceFolderDOM.N = 0;
  _('#places-root').innerHTML = '';
  _PLACES.dom = {
    hBtn: _('#btnPlaces'),
    ul: _('#places-root')
  };
  rec_fillPlace(_PLACES.items, _('#places-root'));
}

function showPlacePath(path) {
  if (!Array.isArray(path)) {
    path = JSON.parse(path);
  }

  showMenu();

  const btns2check = [_('#btnPlaces')];
  for(var j=0 ; j<=path.length-1 ; j++){
    const btn = pathPlace(path.slice(0, j)).dom.hBtn;
    if(btn.classList.contains('collapsed')){
      btn.click();
    }
  }
}

function previewPlacePath(path){
  const place = pathPlace(path);
  const dom = 'items' in place ? place.dom.hBtn : place.dom.a;
  dom.classList.add('np-search-place-preview');
}

function depreviewPlace(){
  $('.np-search-place-preview').removeClass('np-search-place-preview');
}

function rec_fillPlace (places, root_dom, _P_path = '') {
  console.log('rec_fillPlace path=' + _P_path);
  for (let place of places) {
    let path = _P_path ? JSON.parse(_P_path) : [];
    path.push(place.name);
    path = JSON.stringify(path);

    if ('items' in place) {
      // Folder
      const rli = createPlaceFolderDOM(place, path);

      console.log(' >rec_fillPlace with path=' + path);
      rec_fillPlace(place.items, place.dom.ul, path);

      root_dom.appendChild(rli);
    } else {
      // place, not a Folder
      root_dom.appendChild(createPlaceDOM(place, path));
    }
  }
}

function createPlaceFolderDOM (place, path) {
  createPlaceFolderDOM.N++;

  const rli = document.createElement('li');
  const hid = 'places-collapse-' + createPlaceFolderDOM.N;

  const hdiv = _ce('div');

  const hBtn = _ce('span'
    , 'className', 'btn btn-toggle align-items-center collapsed places-folder places-name'
    , 'ariaExpanded', 'false'
    , 'innerHTML', place.name
    , 'title', 'Edit name'
    , 'onmouseenter', function (e) {
      console.log('mouseenter');
      console.log(e);
    }
    , 'onmouseleave', function (e) {
      console.log('onmouseleave');
      console.log(e);
    }
  );
  hBtn.dataset.bsToggle = 'collapse';
  hBtn.dataset.bsTarget = '#' + hid;
  hBtn.dataset.path = path;

  const btnEdit = _ce('button'
    , 'className', 'btn p-1'
    , 'innerHTML', '<i class="bi-pencil"></i>'
    , 'onclick', function (e) {
      const elt = this.parentNode.getElementsByClassName('places-name')[0];
      elt.contentEditable = 'true';
      elt.dataset.originalName = elt.innerHTML;
      elt.focus();
      elt.addEventListener('focusout', function () {
        console.log('focusout1!');
        console.log(this);
        console.log(this.innerHTML);
        this.contentEditable = 'false';
        if (this.innerHTML != this.dataset.originalName) {
          const thisplace = pathPlace(this.dataset.path);
          const tpath = JSON.parse(this.dataset.path).slice(0, -1);
          if (placeOKNewName(tpath, this.innerHTML)) {
            tpath.push(this.innerHTML);
            this.dataset.path = JSON.stringify(tpath);
            thisplace.name = this.innerHTML;
            placesUpdatePaths(thisplace.items, tpath);
            save('places');
          } else {
            // return to original
            this.innerHTML = this.dataset.originalName;
          }
        }
      });
      elt.addEventListener('keydown', function (e) {
        console.log(e);
        if (e.key === 'Enter') {
          // end editing
          this.contentEditable = 'false';
        } else if (e.key === ' ') {
          // e.preventDefault();
          // this.innerHTML+=' ';
          // e.stopPropagation();
        }
      });
    }
  );

  const btnDel = _ce('button'
    , 'className', 'btn text-danger p-1'
    , 'innerHTML', '<i class="bi-folder-x"></i>'
    , 'title', 'Delete folder'
    , 'onclick', function (e) {
      showModalYesNo(
        'Really?'
        , 'Are you sure you want to delete folder <b>' + place.name + '</b> with <i>all</i> it\'s contents???'
        , function () {
          // find parent place
          const path = place.dom.hBtn.dataset.path;
          let parent_place = pathPlace(JSON.parse(path).slice(0, -1));

          if ('items' in parent_place) {
            parent_place = parent_place.items;
          }
          // remove place
          parent_place.splice(parent_place.indexOf(place), 1);

          // remove dom
          place.dom.hBtn.parentNode.parentNode.parentNode.removeChild(place.dom.hBtn.parentNode.parentNode);

          save('places');
        }
      );
    }
  );

  const btnAddFolder = _ce('button'
    , 'className', 'btn p-1'
    , 'innerHTML', '<i class="bi-folder-plus"></i>'
    , 'title', 'Add sub-folder'
    , 'onclick', function (e) {
      if (hBtn.ariaExpanded == 'false') {
        hBtn.click();
      }
      addPlaceFolder(place.dom.hBtn.dataset.path);
    }
  );

  const btnAddPlace = _ce('button'
    , 'className', 'btn p-1'
    , 'innerHTML', '<i class="bi-plus-square-dotted"></i>'
    , 'title', 'Add place to folder'
    , 'onclick', function (e) {
      if (hBtn.ariaExpanded == 'false') {
        hBtn.click();
      }
      addPlace(place.dom.hBtn.dataset.path);
    }
  );

  const bdiv = _ce('div'
    , 'className', 'collapse'
    , 'id', hid
  );

  const tul = _ce('ul'
    , 'className', 'btn-toggle-nav list-unstyled fw-normal pb-1 small'
  );
  bdiv.appendChild(tul);

  hdiv.appendChild(hBtn);
  hdiv.appendChild(btnEdit);
  hdiv.appendChild(btnDel);
  hdiv.appendChild(btnAddFolder);
  hdiv.appendChild(btnAddPlace);

  place.dom = {
    hBtn: hBtn,
    btnEdit: btnEdit,
    btnDel: btnDel,
    btnAddFolder: btnAddFolder,
    btnAddPlace: btnAddPlace,
    ul: tul
  };
  rli.appendChild(hdiv);
  rli.appendChild(bdiv);

  return rli;
}

function createPlaceDOM (place, path) {
  const rli = _ce('li'
  );

  const ta = _ce('a'
    , 'className', 'btn col align-self-start align-items-center places-place places-name'
    , 'innerHTML', place.name
    , 'onclick', function (e) {
      gotoState(pathPlace(this.dataset.path).state, false, true);
    }
    , 'onmouseenter', function (e) {
      console.log('enter');
      previewState(pathPlace(this.dataset.path).state);
    }
    , 'onmouseleave', function (e) {
      console.log('leave');
      exitPreview();
    }
  );
  ta.dataset.path = path;

  const btnEdit = _ce('button'
    , 'className', 'btn p-1'
    , 'innerHTML', '<i class="bi-pencil"></i>'
    , 'title', 'Edit name'
    , 'onclick', function (e) {
      const elt = this.parentNode.getElementsByClassName('places-name')[0];
      elt.contentEditable = 'true';
      // save for probable collision check
      elt.dataset.originalName = elt.innerHTML;
      elt.focus();
      elt.addEventListener('focusout', function () {
        console.log('focusout1!');
        console.log(this);
        this.contentEditable = 'false';
        if (this.innerHTML != this.dataset.originalName) {
          console.log(this.dataset.path);
          const thisplace = pathPlace(this.dataset.path);
          const tpath = JSON.parse(this.dataset.path).slice(0, -1);
          if (placeOKNewName(tpath, this.innerHTML)) {
            console.log('OK NAME!');
            console.log(this.dataset.path);
            tpath.push(this.innerHTML);
            this.dataset.path = JSON.stringify(tpath);
            thisplace.name = this.innerHTML;
            console.log(this.dataset.path);
            save('places');
          } else {
            this.innerHTML = this.dataset.originalName;
          }
        }
      });
      elt.addEventListener('keydown', function (e) {
        if (e.key == 'Enter') {
          // end editing
          this.contentEditable = 'false';
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }
  );

  const btnDel = _ce('button'
    , 'className', 'btn text-danger p-1'
    , 'innerHTML', '<i class="bi-file-x"></i>'
    , 'title', 'Delete place'
    , 'onclick', function (e) {
      showModalYesNo(
        'Really?'
        , 'Are you sure you want to delete <b>' + place.name + '</b>?'
        , function () {
          // find parent place
          let path = place.dom.a.dataset.path;
          parent_place = pathPlace(JSON.parse(path).slice(0, -1));

          if ('items' in parent_place) {
            parent_place = parent_place.items;
          }
          // remove place
          parent_place.splice(parent_place.indexOf(place), 1);

          // remove dom
          place.dom.a.parentNode.parentNode.removeChild(place.dom.a.parentNode);

          save('places');
        }
      );
    }
  );

  const btnSubs = _ce('button'
    , 'className', 'btn p-1'
    , 'innerHTML', '<i class="bi-fullscreen"></i>'
    , 'title', 'Save current here'
    , 'onclick', function (e) {
      showModalYesNo(
        'Rewrite?'
        , 'Are you sure you want to save current position as <b>' + place.name + '</b>?'
        , function () {
          place.state = { T: T, S: S };
          save('places');
        }
      );
    }
  );

  const btnPlace = _ce('button'
    , 'className', 'btn p-1 col align-self-end'
    , 'innerHTML', '<i class="bi-geo-alt"></i>'
    , 'title', 'Drag to place link'
    , 'draggable', true
    , 'ondragstart', function (e) {
      console.log('place drag start');
      console.log(e);
      e.dataTransfer.effectAllowed = 'all';
      _PLACES_dragContent = 'Tap to [' + place.name + '](' + getStateURL(place.state) + ' "Goto ' + place.name + '")';
      e.dataTransfer.setData('text', _PLACES_dragContent);
      console.log(e);
    }
    , 'ondragend', function (e) {
      _PLACES_dragContent = null;
    }
    , 'ondrop', function (e) {
      _PLACES_dragContent = null;
    }
  );

  rli.appendChild(ta);
  rli.appendChild(btnEdit);
  rli.appendChild(btnDel);
  rli.appendChild(btnSubs);
  rli.appendChild(btnPlace);

  place.dom = {
    a: ta,
    btnEdit: btnEdit,
    btnDel: btnDel,
    btnSubs: btnSubs
  };

  return rli;
}

//  :::::::: ::::::::::: :::     ::::::::: ::::::::::: :::    ::: :::::::::
// :+:    :+:    :+:   :+: :+:   :+:    :+:    :+:     :+:    :+: :+:    :+:
// +:+           +:+  +:+   +:+  +:+    +:+    +:+     +:+    +:+ +:+    +:+
// +#++:++#++    +#+ +#++:++#++: +#++:++#:     +#+     +#+    +:+ +#++:++#+
//        +#+    +#+ +#+     +#+ +#+    +#+    +#+     +#+    +#+ +#+
// #+#    #+#    #+# #+#     #+# #+#    #+#    #+#     #+#    #+# #+#
//  ########     ### ###     ### ###    ###    ###      ########  ###

//  :::::::::: :::     ::: :::::::::: ::::    ::: ::::::::::: ::::::::
// :+:        :+:     :+: :+:        :+:+:   :+:     :+:    :+:    :+:
// +:+        +:+     +:+ +:+        :+:+:+  +:+     +:+    +:+
// +#++:++#   +#+     +:+ +#++:++#   +#+ +:+ +#+     +#+    +#++:++#++
// +#+         +#+   +#+  +#+        +#+  +#+#+#     +#+           +#+
// #+#          #+#+#+#   #+#        #+#   #+#+#     #+#    #+#    #+#
// ##########     ###     ########## ###    ####     ###     ########

_('#btnNewHomeSubFolder').addEventListener('click', (e) => {
  const domwpath = _('#btnPlaces');
  if (domwpath.ariaExpanded == 'false') {
    domwpath.click();
  }

  addPlaceFolder('[]');
});

_('#btnNewHomeSubPlace').addEventListener('click', (e) => {
  const domwpath = _('#btnPlaces');
  if (domwpath.ariaExpanded == 'false') {
    domwpath.click();
  }
  addPlace('[]');
});



_('#btnSaveView').dataset.view = null;
_('#btnSaveView').onclick = function () {
  const btn = _('#btnSaveView');
  btn.dataset.view = getStateURL();

  btn.innerHTML = '<i class="bi-stickies-fill"></i>&nbsp';
  // btn.getElementsByTagName('i')[0].className='bi-stickies-fill';
  // btn.classList.remove('btn-secondary');
  // btn.classList.add('btn-success');

  btn.title = 'Saved View ' + btoa(Math.random()).slice(10, 13) + '&nbsp';

  const telt = _ce('i'
    , 'className', 'bi-fullscreen'
    , 'title', 'Preview'
  );
  telt.addEventListener('mouseenter', e => {
    previewState(_('#btnSaveView').dataset.view);
  });
  telt.addEventListener('mouseleave', e => {
    exitPreview();
  });
  telt.addEventListener('click', (e) => {
    e.stopPropagation();
    __previewOldState = { T: T, S: S };
    // gotoState(_('#btnSaveView').dataset['view'], false, true);
  }, false);

  btn.appendChild(telt);

  btn.title = btn.dataset.view;
  btn.draggable = true;

  btn.ondragstart = function (e) {
    console.log('btn drag start');
    console.log(e);
    e.dataTransfer.effectAllowed = 'all';
    _PLACES_dragContent = 'Tap to [View](' + this.dataset.view + ' "Saved View")';
    e.dataTransfer.setData('text', _PLACES_dragContent);
    console.log(e);
  };

  btn.ondragend = function (e) {
    console.log('btn ondragend');
    _PLACES_dragContent = null;
    console.log(e);
  };

  btn.ondrop = function (e) {
    console.log('btn drop');
    _PLACES_dragContent = null;
    console.log(e);
  };
};
