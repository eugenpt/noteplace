/*


I propose hyper-links as natural occurence in the moteplace
    ( simplest example - logical AND/OR, taking 2 inputs and having 1 output)

_LINKS should be saved and used later as templates

Basic types should include "is part of" as a type of link.
What else..

Logic?
Time??


TODO:
[ ] Link render
[ ] Link adding interface
[ ] Link styles? 
[ ] Link types

[ ] wikidata link types?

.. hmm
Why not omit the whole noteplace concept entirely and just make a wikidata graph viewer?
hmm ..
*/

let _LINKS = [];
let _LINK_TYPES = [
    {
        name:'is part of',
        style:{

        },
    }
];

//


_LINKS_default = [
	{
		ns: [_NODES[0].id, _NODES[1].id],
        connect_style: {
            type: undefined,
        },
	    style: {
            color:'black',
            
            },
	},
];


function newLink(link){
    log("newLink");
    let tdom = link;
    if ('className' in link){
        // link is a DOM element already
        log('DOM provided');

    } else {
        

    }

    
}

function _RESTART_links(){
_LINKS = [
	{
		ns: [_NODES[0].id, _NODES[1].id],
        connect_to: ["center","center"],
        connect_style: {
            type: undefined,


        },
	    style: {
            color:'black',
            
            },
	},
];

}
//
