

_SEARCH = {
  page_results:10,
  q:'',
  results:[],
  last_checked_nodej:-1,
  current_page:0,
  dom:[],
}
_NODES_searchRes = []



function fillSearchResults(){
  root = _('#searchResultContainer');

  root.innerHTML = '';

  _SEARCH.results.forEach((n)=>{
    var div = _ce('div'
      ,'className','container'
      ,'onmouseenter',function(e){
        console.log('enter!' + n.text);
        previewNode(n);
        console.log(currentState());
      }
      ,'onmouseleave',function(e){
        console.log('leave! '+n.text);
        exitPreview();
        depreviewNode();
        console.log(currentState());
      }
      ,'onclick',function(e){
        console.log('click! '+n.text);
        depreviewNode();
        gotoNode(n);
        console.log(currentState());
      }
    )
    var row = _ce('div'
      ,'className','row np-sr-row'
    )

    var col = _ce('div'
      ,'className','col'
      ,'innerHTML',n.text
    )

    row.appendChild(col);
    div.appendChild(row);

    root.appendChild(div);
  })
}

function searchMatch(q, s){
  return q.split(' ').every(jq=>RegExp(jq,'gi').test(s))
  // simpler:
  // q.split(' ').every(jq=>s.toLowerCase().indexOf(jq)>=0)
}

function findSearchResults(n=null){
  console.log('findSearchResults')
  if(n==null){
    n = _SEARCH.page_results;
  }

  n = n + _SEARCH.results.length;
  while((_SEARCH.results.length < n)
      &&(_SEARCH.last_checked_nodej<_NODES.length-1)){
    _SEARCH.last_checked_nodej++;
    if(searchMatch(_SEARCH.q, _NODES[_SEARCH.last_checked_nodej].text)){
      _SEARCH.results.push(_NODES[_SEARCH.last_checked_nodej]);
    }
  }
  console.log('/findSearchResults _SEARCH.results.length='+_SEARCH.results.length)
}

function onSearchInput(q){
  console.log('onSearchInput q='+q)
  _SEARCH.q = q;
  if(q){
    _SEARCH.results = [];
    _SEARCH.last_checked_nodej = -1;
    findSearchResults();
    // _SEARCH.results = _NODES.filter((n)=>__isin_all(q,n.text))
  }else{
    _SEARCH.results = _NODES;
    _SEARCH.last_checked_nodej = -1;
  }
  
  fillSearchResults();
}

_('#searchInput').addEventListener('input',function(e){
  onSearchInput(e.target.value);
})

_("#search-toggle").onclick = function(e) {
  e.preventDefault();
  e.stopPropagation();
  if(_("#searchSideBar").classList.contains("toggled")){
    _("#searchSideBar").classList.remove("toggled");
    _('#searchInput').focus();
  }else{
    _("#searchSideBar").classList.add("toggled");
  }
  e.stopPropagation();
}

_('#searchSideBar').onmousedown = function(e){
  e.stopPropagation();  
}
_('#searchSideBar').onmouseup = function(e){
  e.stopPropagation();  
}

