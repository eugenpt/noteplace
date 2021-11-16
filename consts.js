// yeah, I don't like limits, but..
//  without proper custom infinitely precise numbers
//   this is what I can do with js
//
// Which seems OK, 26 orders of magnitude..
//  is ~ the size of observable universe in meters
//
//   I know, I know, it would've been
//     way cooler if it was ~ size(universe)/size(atom nucleus)
//       which is.. ~ 10^26/(10^-15) ~ 10^41
const zoomMax = 1e14;
const zoomMin = 1e-15;

const zoomK = 1.6;

const container = _('#container');
const node_container = _('#node_container');

const md = new Remarkable('full', {
  html: true,
  typographer: true
});
  
const BODY = document.getElementsByTagName('body')[0];

