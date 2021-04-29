

function _(s){
  if(s[0]=='#'){
    return document.getElementById(s.slice(1));
  }else
  if(s[0]=='.'){
    return document.getElementsByClassName(s.slice(1));
  }else{
    throw Error('Not Implemented: selector=['+s+']')
  }
}
  
// create element
function _ce(tag, plopName="className", plopVal="class"){
  var elt = document.createElement(tag);
  for(var j=1; j<arguments.length; j+=2){
    elt[arguments[j]] = arguments[j+1];
  }
  return elt;
}

function isInBox(xMin,xMax,yMin,yMax,bxMin,bxMax,byMin,byMax){
  return (
    (xMin <= bxMax)
  &&(yMin <= byMax)
  &&(xMax >= bxMin)
  &&(yMax >= byMin)  
  )
}

__isin = (q, s)=>s.indexOf(q)>=0;
__isin_all = (q,s)=>q.split(' ').every(jq=>__isin(jq, s));

function now(){
  return new Date().getTime();
}

function toStr(a){
  return(typeof(a)=="number")?
    a.toExponential(2)
    :
    (Array.isArray(a)?
      ('['+a.map(toStr).join(', ')+']')
      :
      ((typeof(a)=='object')?
      '{'+Object.keys(a).map((k)=>k+':'+toStr(a[k])).join(', ')+'}'
      :a)
    );
}

image_file_types = [
  'image/apng'
  ,'image/avif'
  ,'image/gif'
  ,'image/jpeg'
  ,'image/png'
  ,'image/svg+xml'
  ,'image/webp'
  ,'image/bmp'
  ,'image/x-icon'
  ,'image/tiff'
]
function isImage(file){
  return image_file_types.indexOf(file.type)>=0;
}

// :::::::::   ::::::::  ::::    ::::  
// :+:    :+: :+:    :+: +:+:+: :+:+:+ 
// +:+    +:+ +:+    +:+ +:+ +:+:+ +:+ 
// +#+    +:+ +#+    +:+ +#+  +:+  +#+ 
// +#+    +#+ +#+    +#+ +#+       +#+ 
// #+#    #+# #+#    #+# #+#       #+# 
// #########   ########  ###       ### 
                                    
const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  el.style.opacity=0;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};


function selectAllContent(el){
  var el = getG(tnode);
  var range = document.createRange()
  var sel = window.getSelection()
  
  //range.setStart(el.childNodes[0], 0)
  range.selectNodeContents(el.childNodes[0])
  // range.collapse(true)
  
  sel.removeAllRanges()
  sel.addRange(range)
}


// https://gist.github.com/simondahla/0c324ba8e6ed36055787
function addOnContentChange(elt, fun){
  if(window.addEventListener) {
    // Normal browsers
    elt.addEventListener('DOMSubtreeModified', fun, false);
  } else
   if(window.attachEvent) {
      // IE
      elt.attachEvent('DOMSubtreeModified', fun);
   }
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}