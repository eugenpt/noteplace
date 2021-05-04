const ALPHANUMERIC = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

function rand0Z () {
  return ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
}

//
function newID(start, checkfun, addfun=null, maxTries=1000) {
  let id = start || '';
  addfun = addfun || rand0Z;

  let nTries = 0;
  while (checkfun(id)) {
    id = id + addfun();
    nTries++;
    if (nTries > maxTries) {
      throw Error('newID: Maximum number of tries exceeded, check your checkfun!');
    }
  }
  return id;
}

function log (a) {
  console.log(a);
}

function now () {
  return new Date().getTime();
}

function int2strwz(i, length) {
  return (Array(10).join('0')+i).slice(-length);
}

function date2str(d) {
  return d.getFullYear() + ''
          + int2strwz(d.getMonth()+1,2) + ''
          + int2strwz(d.getDate(), 2) + '-'
          + int2strwz(d.getHours(), 2) + ''
          + int2strwz(d.getMinutes(), 2) + ''
          + int2strwz(d.getSeconds(), 2)
}

// if property is dot-separated (style.color for example)
//  take obj.style.color instead of just obj['style.color']
function dotProp(obj, prop){
  const propParts = prop.split('.');
  let h = obj;
  for(let propPart of propParts){
    if(!(propPart in h)){
      h[propPart] = {};
    }
    h = h[propPart];
  }
  return h;
}

function setDotProp(obj, prop, value){
  const propParts = prop.split('.');
  dotProp(obj, propParts.slice(0,-1).join('.'))[propParts[propParts.length-1]] = value;
}

function delete_defaults (obj, def) {
  const r = {};
  for (let p of Object.keys(obj)) {
    if ((def[p] === undefined) || (obj[p] !== def[p])) {
      r[p] = obj[p];
    }
  }
  return Object.keys(r).length > 0 ? r : undefined;
}

function isInBox (xMin, xMax, yMin, yMax, bxMin, bxMax, byMin, byMax) {
  return (
     (xMin <= bxMax)
  && (yMin <= byMax)
  && (xMax >= bxMin)
  && (yMax >= byMin)
  );
}

__isin = (q, s) => s.indexOf(q) >= 0
__isin_all = (q, s) => q.split(' ').every(jq => __isin(jq, s))

function toStr (a) {
  return (typeof (a) === 'number')
    ? a.toExponential(2)
    : (Array.isArray(a)
        ? ('[' + a.map(toStr).join(', ') + ']')
        : ((typeof (a) === 'object')
            ? '{' + Object.keys(a).map(k => k + ':' + toStr(a[k])).join(', ') + '}'
            : a)
      );
}

const imageFileTypes = [
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

function isImage (file) {
  return imageFileTypes.indexOf(file.type) >= 0;
}

function localStorageSize (verbose=false) {
  let _lsTotal = 0;
  let _xLen = 0;
  let _x = 0;
  for (_x in localStorage) {
    if (!localStorage.hasOwnProperty(_x)) {
      continue
    }
    _xLen = ((localStorage[_x].length + _x.length) * 2);
    _lsTotal += _xLen;
    if (verbose) {
      console.log(_x.substr(0, 50) + ' = ' + (_xLen / 1024).toFixed(2) + ' KB');
    }
  }
  if (verbose) {
    console.log('Total = ' + (_lsTotal / 1024).toFixed(2) + ' KB');
  }
  return _lsTotal;
}

// :::::::::   ::::::::  ::::    ::::  
// :+:    :+: :+:    :+: +:+:+: :+:+:+ 
// +:+    +:+ +:+    +:+ +:+ +:+:+ +:+ 
// +#+    +:+ +#+    +:+ +#+  +:+  +#+ 
// +#+    +#+ +#+    +#+ +#+       +#+ 
// #+#    #+# #+#    #+# #+#       #+# 
// #########   ########  ###       ### 

function _ (s) {
  if (s[0] === '#') {
    return document.getElementById(s.slice(1));
  } else if (s[0] === '.') {
    return document.getElementsByClassName(s.slice(1));
  } else {
    throw Error('Not Implemented: selector=[' + s + ']');
  }
}

// create element
function _ce (tag, plopName='className', plopVal='class') {
  const elt = document.createElement(tag);
  for (let j = 1; j < arguments.length; j += 2) {
    elt[arguments[j]] = arguments[j + 1];
  }
  return elt;
}

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  el.style.opacity = 0;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

// https://gist.github.com/simondahla/0c324ba8e6ed36055787
function addOnContentChange (elt, fun) {
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  // Options for the observer (which mutations to observe)
  const config = {
    // attributes: true,
    childList: true,
    subtree: true
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(fun);

  // Start observing the target node for configured mutations
  observer.observe(elt, config);
  return observer;
}

function download (filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}