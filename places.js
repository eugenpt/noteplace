// _PLACES = {}

_PLACES_default = {
  name:'Places',
  items:[ 
    {name:'Home?', state:{T:[0,0],S:1}},
    // {name:'Test folder', items:[
    //   {name:'test 1', state:{T:[-4000,-2000], S:0.1}},
    //   {name:'Test sub-folder..', items:[
    //     {name:'test 2', state:{T:[-400000,-200000], S:0.001}},
    //     {name:'test 3', state:{T:[-400000,-250000], S:0.001}},
    //   ]}
    // ]}
]}


function stripPlace(place=null){
  if(place===null)
    place = _PLACES;
    
  if('items' in place){
    return {
      name:place.name
      ,items:place.items.map(stripPlace)
    }
  }else{
    return {
      name:place.name
      ,state:{
        T:place.state.T.slice()
        ,S:place.state.S
      }
    }
  }
}

function placeOKNewName(path, new_name){
  console.log('placeOKNewName path='+path+' new_name='+new_name)
  if(!Array.isArray(path))
    path = JSON.parse(path);

  return (pathPlace(path)//.slice(0,-1))
            .items
            .map(s=>s.name)
            .indexOf(new_name)
          == -1)
}


// returns _PLACES for path
function pathPlace(path){
  var p = _PLACES;
  path = ((typeof(path)=="string")?JSON.parse(path):path).forEach((e)=>{
    p=p.items[p.items.map(jp=>jp.name).indexOf(e)];
  })
  return p;
}


function placesUpdatePaths(places=null, _path=[]){
  if(!places){
    places = _PLACES.items;
  }
  for(var place of places){
    var path = _path.slice();
    path.push(place.name);
    if('items' in place){
      place.dom.hBtn.dataset['path'] = JSON.stringify(path);

      placesUpdatePaths(place.items, path);
    }else{
      place.dom.a.dataset['path'] = JSON.stringify(path);
    }
  }
}

function placeNewName(path, folder=false){
  _name = 'New ' + (folder?'Folder':'Place')
  j=0;
  while(!placeOKNewName(path, _name)){
    j++
    _name = 'New ' + (folder?'Folder':'Place')+' '+j;
  }
  return _name;
}

function addPlaceFolder(path){
  console.log('addPlaceFolder path='+path);
  var place = {'name':placeNewName(path, folder=true), items:[]}
  var hpath = JSON.parse(path);
  hpath.push(place.name);  
  
  rli = createPlaceFolderDOM(place,JSON.stringify(hpath));

  pathPlace(path).dom.ul.appendChild(rli);
  pathPlace(path).items.push(place);

  save('places');

  place.dom.btnEdit.click();
}



function addPlace(path){
  console.log('addPlace path='+path);

  var place = {'name':placeNewName(path), state:{T:T,S:S}}
  var hpath = JSON.parse(path);
  hpath.push(place.name);  
  
  rli = createPlaceDOM(place,JSON.stringify(hpath));

  pathPlace(path).dom.ul.appendChild(rli);
  pathPlace(path).items.push(place);

  save('places');

  place.dom.btnEdit.click();
}

function fillPlaces(){
  createPlaceFolderDOM.N=0;
  _('#places-root').innerHTML = "";
  _PLACES.dom = {
    hBtn:_('#btnPlaces')
    ,ul:_('#places-root')
  } 
  rec_fillPlace(_PLACES.items, _('#places-root'));
}

function rec_fillPlace(places, root_dom, _P_path=''){
  console.log('rec_fillPlace path='+_P_path)
  for(var place of places){
    var path = _P_path?JSON.parse(_P_path):[]
    path.push(place.name);
    path = JSON.stringify(path);

    if('items' in place){
      // Folder
      var rli = createPlaceFolderDOM(place, path);

      console.log(' >rec_fillPlace with path='+path);
      rec_fillPlace(place.items, place.dom.ul, path);

      root_dom.appendChild(rli);
    }else{
      // place, not a Folder
      root_dom.appendChild(createPlaceDOM(place, path));
    }
  }
}

function createPlaceFolderDOM(place, path){
  createPlaceFolderDOM.N++;

  var rli = document.createElement('li');
  var hid = 'places-collapse-'+createPlaceFolderDOM.N;

  var hdiv = _ce('div');

  var hBtn = _ce('span'
    ,'className','btn btn-toggle align-items-center collapsed places-folder places-name'
    ,'ariaExpanded','false'
    ,'innerHTML',place.name
    ,'title', 'Edit name'
    ,'onmouseenter',function(e){
      console.log('mouseenter');
      console.log(e);
    }
    ,'onmouseleave',function(e){
      console.log('onmouseleave');
      console.log(e);
    }
  );
  hBtn.dataset['bsToggle'] = 'collapse';
  hBtn.dataset['bsTarget'] = '#' + hid;
  hBtn.dataset['path'] = path;


  var btnEdit = _ce('button'
    ,'className',"btn p-1"
    ,'innerHTML','<i class="bi-pencil"></i>'
    ,'onclick',function(e){
      var elt = this.parentNode.getElementsByClassName('places-name')[0];
      elt.contentEditable="true";
      elt.dataset['originalName'] = elt.innerHTML;
      elt.focus();
      elt.addEventListener('focusout', function(){
        console.log('focusout1!');
        console.log(this);
        console.log(this.innerHTML);
        this.contentEditable = "false";
        if(this.innerHTML != this.dataset['originalName']){
          var thisplace = pathPlace(this.dataset['path']);
          var tpath = JSON.parse(this.dataset['path']).slice(0,-1);
          if(placeOKNewName(tpath, this.innerHTML)){
            tpath.push(this.innerHTML);
            this.dataset['path'] = JSON.stringify(tpath);
            thisplace.name = this.innerHTML;
            placesUpdatePaths(thisplace.items, tpath);
            save('places');
          }else{
            // return to original
            this.innerHTML = this.dataset['originalName'];
          }
        }
      })
      elt.addEventListener('keydown', function(e){
        console.log(e);
        if(e.key=='Enter'){
          // end editing
          this.contentEditable = "false";
        }else if(e.key==' '){
          // e.preventDefault();
          // this.innerHTML+=' ';
          // e.stopPropagation();
        }
      });
    }
  );

  var btnDel = _ce('button'
    ,'className',"btn text-danger p-1"
    ,'innerHTML','<i class="bi-folder-x"></i>'
    ,'title','Delete folder'
    ,'onclick', function(e){
      showModalYesNo(
        'Really?'
        ,'Are you sure you want to delete folder <b>' + place.name+'</b> with <i>all</i> it\'s contents???'
        ,function(){
          // find parent place
          var path = place.dom.hBtn.dataset['path'];
          parent_place = pathPlace(JSON.parse(path).slice(0,-1));

          if('items' in parent_place){
            parent_place = parent_place.items;
          }
          // remove place
          parent_place.splice(parent_place.indexOf(place),1);
          
          //remove dom
          place.dom.hBtn.parentNode.parentNode.parentNode.removeChild(place.dom.hBtn.parentNode.parentNode);

          save('places');
        }
      )
    }
  );

  var btnAddFolder = _ce('button'
    ,'className',"btn p-1"
    ,'innerHTML','<i class="bi-folder-plus"></i>'
    ,'title','Add sub-folder'
    ,'onclick', function(e){
      if(hBtn.ariaExpanded=="false"){
        hBtn.click();
      }
      addPlaceFolder(place.dom.hBtn.dataset['path']);
    }
  );      

  var btnAddPlace = _ce('button'
    ,'className',"btn p-1"
    ,'innerHTML','<i class="bi-plus-square-dotted"></i>'
    ,'title','Add place to folder'
    ,'onclick', function(e){
      if(hBtn.ariaExpanded=="false"){
        hBtn.click();
      }
      addPlace(place.dom.hBtn.dataset['path']);
    }
  );      


  var bdiv = _ce('div'
    ,'className','collapse'
    ,'id',hid
  )

  var tul = _ce('ul'
    ,'className', "btn-toggle-nav list-unstyled fw-normal pb-1 small"
  )
  bdiv.appendChild(tul);

  hdiv.appendChild(hBtn);
  hdiv.appendChild(btnEdit);
  hdiv.appendChild(btnDel);
  hdiv.appendChild(btnAddFolder);
  hdiv.appendChild(btnAddPlace);

  place.dom = {
    hBtn:hBtn
    ,btnEdit:btnEdit
    ,btnDel:btnDel
    ,btnAddFolder:btnAddFolder
    ,btnAddPlace:btnAddPlace
    ,ul:tul
  }
  rli.appendChild(hdiv);
  rli.appendChild(bdiv);

  return rli;
}

function createPlaceDOM(place, path){
  var rli = document.createElement('li');

  var ta = _ce('a'
    ,'className', "btn align-items-center places-place places-name"
    ,'innerHTML', place.name
    ,'onclick', function(e){
      var pl = pathPlace(this.dataset['path']);
      applyZoom(pl.state.T,pl.state.S,smooth=false,no_temp=true);
    }
    ,'onmouseenter', function(e){
      console.log('enter');
      __previewOldState = {T:T,S:S};
      state = pathPlace(this.dataset['path']).state;
      applyZoom(state.T,state.S,false);
    }
    ,'onmouseleave', function(e){
      console.log('leave');
      applyZoom(__previewOldState.T,__previewOldState.S,false)
    }
  )
  ta.dataset['path'] = path;


  var btnEdit = _ce('button'
    ,'className','btn'
    ,'innerHTML','<i class="bi-pencil"></i>'
    ,'title', 'Edit name'
    ,'onclick',function(e){
        var elt = this.parentNode.getElementsByClassName('places-name')[0];
        elt.contentEditable="true";
        //save for probable collision check
        elt.dataset['originalName'] = elt.innerHTML;
        elt.focus();
        elt.addEventListener('focusout', function(){
          console.log('focusout1!');
          console.log(this);
          this.contentEditable = "false";
          if(this.innerHTML != this.dataset['originalName']){
            console.log(this.dataset['path']);
            var thisplace = pathPlace(this.dataset['path']);
            var tpath = JSON.parse(this.dataset['path']).slice(0,-1);
            if(placeOKNewName(tpath, this.innerHTML)){
              console.log('OK NAME!')
              console.log(this.dataset['path'])
              tpath.push(this.innerHTML);
              this.dataset['path'] = JSON.stringify(tpath);
              thisplace.name = this.innerHTML;
              console.log(this.dataset['path'])
              save('places');
            }else{
              this.innerHTML = this.dataset['originalName'];
            }
          }
        });
        elt.addEventListener('keydown', function(e){
          if(e.key=='Enter'){
            // end editing
            this.contentEditable = "false";
            e.preventDefault();
            e.stopPropagation();
          }
        });
      }
  );

  var btnDel = _ce('button'
    ,'className',"btn text-danger p-1"
    ,'innerHTML','<i class="bi-file-x"></i>'
    ,'title','Delete place'
    ,'onclick', function(e){
      showModalYesNo(
        'Really?'
        ,'Are you sure you want to delete <b>' + place.name+'</b>?'
        ,function(){
          // find parent place
          var path = place.dom.a.dataset['path'];
          parent_place = pathPlace(JSON.parse(path).slice(0,-1));

          if('items' in parent_place){
            parent_place = parent_place.items;
          }
          // remove place
          parent_place.splice(parent_place.indexOf(place),1);
          
          //remove dom
          place.dom.a.parentNode.parentNode.removeChild(place.dom.a.parentNode);

          save('places');
        }
      )
    }
  );

  var btnSubs = _ce('button'
    ,'className','btn'
    ,'innerHTML','<i class="bi-fullscreen"></i>'
    ,'title','Save current here'
    ,'onclick', function(e){
      showModalYesNo(
        'Rewrite?'
        ,'Are you sure you want to save current position as <b>' + place.name + "</b>?"
        ,function(){
          place.state={T:T, S:S};
          save('places');
        }
      )
    }
  )

  rli.appendChild(ta);
  rli.appendChild(btnEdit);
  rli.appendChild(btnDel);
  rli.appendChild(btnSubs);

  place.dom = {
     a:ta
    ,btnEdit:btnEdit
    ,btnDel:btnDel
    ,btnSubs:btnSubs
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

_('#btnNewHomeSubFolder').addEventListener('click',(e)=>{
  
  domwpath = _('#btnPlaces');
  if(domwpath.ariaExpanded=='false'){
    domwpath.click();
  }

  addPlaceFolder('[]');
})

_('#btnNewHomeSubPlace').addEventListener('click',(e)=>{
  domwpath = _('#btnPlaces');
  if(domwpath.ariaExpanded=='false'){
    domwpath.click();
  }
  addPlace('[]');
})