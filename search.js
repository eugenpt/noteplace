/*
 *
 *
 *
 *
 *
 */

let _SEARCH = {
  page_results: 20,
  q: '',
  results: [],
  last_checked_nodej: -1,
  last_dom_nodej: -1,
  current_page: 0,
  dom: []
};

let _NODES_searchRes = [];

function findPlaces(q, places=null){
  const R = [];
  if( places === null ) {
    places = _PLACES.items;
  }
  for( let place of places ) {
    if (searchMatch(q, place.name)){
      R.push(place);   
    }    
    if ('items' in place) {
      findPlaces(q, place.items).forEach( x => R.push(x) )
    }    
  }
  return R;
}

function fillPlaceSearchResults () {
  const root = _('#searchResultContainer');
  const placeSearchResults = findPlaces(_SEARCH.q);

  for( let place of placeSearchResults) {
    const div = _ce('div'
      , 'className', 'container btn btn-outline-secondary my-1'
    );
    

    if ('items' in place) {
      div.dataset['path'] = place.dom.hBtn.dataset['path'];
      div.title = "Places folder, click to see it in places tree"
      div.onmouseenter = function (e) {
        previewPlacePath(this.dataset.path);
      }
      div.onmouseleave = function (e) {
        depreviewPlace();
      }
      div.onclick = function (e) {
        showPlacePath(this.dataset.path);
      }
    } else {
      div.dataset['path'] = place.dom.a.dataset['path'];
      div.onmouseenter = function (e) {
        previewState(pathPlace(this.dataset['path']).state);
        previewPlacePath(this.dataset['path']);
      }
      div.onmouseleave = function (e) {
        exitPreview();
        depreviewPlace();
      }
      div.onclick = function (e) {
        gotoState(pathPlace(this.dataset.path).state, false, true);
      }
    }

    const row = _ce('div'
      , 'className', 'row np-sr-row align-items-center justify-content-between'
    );

    const col1 = _ce('div'
      , 'className', 'col'
      , 'innerHTML', '<i class="bi-fullscreen" title="It\'s a Place"></i>'
        + ('items' in place ? '&nbsp<i class="bi-folder"></i>':'&nbsp&nbsp')  
    )

    const col2 = _ce('div'
      , 'className', 'col'
      , 'innerHTML', place.name
    );


    row.appendChild(col1);
    row.appendChild(col2);
    // if (!('items' in place)) {
      const col3 = _ce('div'
        , 'className', 'col p-0'
        , 'innerHTML', ''
      );
      const ti = _ce('i'
        ,'className', "bi-folder-symlink"
        ,'title', 'Show in places tree'
        ,'onclick', function (e) {
          showPlacePath(div.dataset.path);
          e.stopPropagation();
        }
        , 'onmouseenter', function (e) {
          this.classList.add('text-secondary');
          this.classList.add('bg-light');
        }
        , 'onmouseleave', function (e) {
          this.classList.remove('text-secondary');
          this.classList.remove('bg-light');
        }
      )
      col3.appendChild(ti);
      row.appendChild(col3);
    // }
    
    div.appendChild(row);

    root.appendChild(div);    
  }
  
}

function fillSearchResults () {
  const root = _('#searchResultContainer');

  if (_SEARCH.last_dom_nodej < 0) {
    root.innerHTML = '';
    fillPlaceSearchResults();
  }
  // for(var j=_SEARCH.last_dom_nodej+1; j<_SEARCH.results.length; j++){
  _SEARCH.results.slice(_SEARCH.last_dom_nodej + 1).forEach((n) => {
    // var n=_SEARCH.results[j];
  // _SEARCH.results.forEach((n)=>{
    const div = _ce('div'
      , 'className', 'container btn btn-outline-secondary my-1'
      , 'onmouseenter', function (e) {
        console.log('enter!' + n.text);
        previewNode(n);
        console.log(currentState());
      }
      , 'onmouseleave', function (e) {
        console.log('leave! ' + n.text);
        depreviewNode();
        console.log(currentState());
      }
      , 'onclick', function (e) {
        console.log('click! ' + n.text);
        depreviewNode();
        gotoNode(n);
        console.log(currentState());
      }
    );
    const row = _ce('div'
      , 'className', 'row np-sr-row'
    );

    const col = _ce('div'
      , 'className', 'col'
      , 'innerHTML', n.text
    );

    row.appendChild(col);
    div.appendChild(row);

    root.appendChild(div);

    _SEARCH.last_dom_nodej++;
  });
}

function searchMatch (q, s) {
  return q.split(' ').every(jq => RegExp(jq, 'gi').test(s));
  // simpler:
  // q.split(' ').every(jq=>s.toLowerCase().indexOf(jq)>=0)
}

function findSearchResults (n = null) {
  console.log('findSearchResults');
  if (n === null) {
    n = _SEARCH.page_results;
  }

  n = n + _SEARCH.results.length;
  while ((_SEARCH.results.length < n)
       &&(_SEARCH.last_checked_nodej < _NODES.length - 1)) {
    _SEARCH.last_checked_nodej++;
    if (searchMatch(_SEARCH.q, _NODES[_SEARCH.last_checked_nodej].text)) {
      _SEARCH.results.push(_NODES[_SEARCH.last_checked_nodej]);
    }
  }
  console.log('/findSearchResults _SEARCH.results.length=' + _SEARCH.results.length);
}

function onSearchInput (q) {
  exitPreview();
  depreviewNode();
  depreviewPlace();

  console.log('onSearchInput q=' + q);
  _SEARCH.q = q;
  _SEARCH.last_dom_nodej = -1; // to restart
  if (q) {
    _SEARCH.results = [];
    _SEARCH.last_checked_nodej = -1;
    findSearchResults();
    // _SEARCH.results = _NODES.filter((n)=>__isin_all(q,n.text))
  } else {
    _SEARCH.results = _NODES;
    _SEARCH.last_checked_nodej = -1;
  }

  fillSearchResults();
}

_('#searchInput').addEventListener('input', function (e) {
  onSearchInput(e.target.value);
});

_('#searchInput').addEventListener('keydown', function (e) {
  console.log('searchInput keydown');
  console.log(e);
  if (e.code == 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    _('#search-toggle').click();
  }
});

_('#search-toggle').onclick = function (e) {
  e.preventDefault();
  e.stopPropagation();
  if (_('#searchSideBar').classList.contains('toggled')) {
    _('#searchSideBar').classList.remove('toggled');
    _('#searchInput').focus();
  } else {
    _('#searchSideBar').classList.add('toggled');
  }
  e.stopPropagation();
};

_('#searchSideBar').onmousedown = function (e) {
  e.stopPropagation();
};
_('#searchSideBar').onmouseup = function (e) {
  e.stopPropagation();
};
_('#searchSideBar').onmousewheel = function (e) {
  e.stopPropagation();
};

_('#searchResultContainer').addEventListener('scroll', function (e) {
  console.log(e);
  console.log(this.scrollTop);
  console.log(this.scrollHeight);

  if (this.scrollTop + this.clientHeight + this.scrollHeight - 100) {
    findSearchResults();
    fillSearchResults();
  }
});
