import '../node_modules/font-awesome/scss/font-awesome.scss';
import 'assets/stylesheets/scss/application.scss';

import { GtFunctionalityCollection } from 'components/GtFunctionalityCollection';
import { GtState } from 'components/GtState';
import { GtEditorContent } from 'components/GtEditorContent';
import { GtToolbar } from 'components/GtToolbar';

let states = [
    new GtState('font-weight',true),
    new GtState('text-decoration',true),
    new GtState('font-style',true),
    new GtState('font-size',true),
    new GtState('text-align',true),
    new GtState('color',true),
    new GtState('background-color',true),
];


let statesGroup = [];

statesGroup.push({
    'color': states[5],
    'background-color': states[6],
});

statesGroup.push({
    'font-weight': states[0],
    'text-decoration': states[1],
    'font-style': states[2],
});

statesGroup.push({
    'font-size': states[3],
});

statesGroup.push({
    'text-align': states[4],
});

let toolbarTemplateStateData = {

    'font-weight':{
        type:'toggle', // options --> toggle / group / list
        style: {
            key: "font-weight",
            values: ['300', '700']
        },
        buttons: {
            700:{
                nodeName:'button',
                elementAttrs:{
                    type:'button',
                    title:'bold'
                },

                icon:'<span style="font-weight: 700">B</span>'
            }
        }

    },

    'font-style':{
        type:'toggle', // options --> toggle / group / list
        style: {
            key: "font-style",
            values: ['', 'italic']
        },
        buttons: {
            italic:{
                nodeName:'button',
                elementAttrs:{
                    type:'button',
                    title:'italic'
                },

                icon:'<span style="font-style: italic">I</span>'
            }
        }

    },


    'text-decoration':{
        type:'toggle', // options --> toggle / group / list
        style: {
            key: "text-decoration",
            values: ['', 'underline']
        },
        buttons: {
            underline:{
                nodeName:'button',
                elementAttrs:{
                    type:'button',
                    title:'underline'
                },

                icon:'<span style="text-decoration: underline">U</span>'
            }
        }

    },

    'font-size':{
        type:'list', // options --> toggle / group / list
        label:'size',
        style: {
            key: "font-size",
            values: (function(){
                let sizes = [];
                for(let i=10;i<50;i++){
                    if(i%2==0){
                        sizes.push( (i+'px') );
                    }
                }
                return sizes;
            })()
        },
        buttons: (function(){
            let buttons = {};

            for(let i=10;i<50;i++){
                if(i%2==0){
                    buttons[i+'px'] = {
                        nodeName:'button',
                        elementAttrs:{
                            type:'button',
                            title:'font-size: '+i+'px'
                        },

                        icon:i+'px'
                    };
                }
            }

            return buttons;
        })()

    },

    'color':{
        type:'list', // options --> toggle / group / list
        label:'color',
        style: {
            key: "color",
            values: (function(){
                let values = [];

                ['#2088ca','#184f9a','#222222','#444444','#fd6d2a'].forEach(function(hex){

                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    result = result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;

                    values.push( 'rgb('+result['r']+', '+result['g']+', '+result['b']+')' );
                });

                return values;
            })()
        },
        buttons: (function(){
            let buttons = {};
            ['#2088ca','#184f9a','#222222','#444444','#fd6d2a'].forEach(function(hex,index){

                let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                let rgb;

                result = result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;

                rgb = 'rgb('+result['r']+', '+result['g']+', '+result['b']+')';

                buttons[rgb] = {
                    nodeName:'button',
                    elementAttrs:{
                        type:'button',
                        title:'color: '+hex
                    },

                    icon:'<span class="color" style="color: '+rgb+'">A</span>'
                }
            });

            return buttons;
        })()

    },

    'background-color':{
        type:'list', // options --> toggle / group / list
        label:'color',
        style: {
            key: "background-color",
            values: (function(){
                let values = [];

                ['transparent','#2088ca','#184f9a','#222222','#444444','#fd6d2a'].forEach(function(color){

                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                    result = result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;

                    if(result==null){
                        values.push(color);
                    }else{
                        values.push( 'rgb('+result['r']+', '+result['g']+', '+result['b']+')' );
                    }

                });

                return values;
            })()
        },
        buttons: (function(){
            let buttons = {};
            ['transparent','#2088ca','#184f9a','#222222','#444444','#fd6d2a'].forEach(function(color,index){

                let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                let rgb;

                result = result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;

                if(result==null){
                    rgb = color;
                }else{
                    rgb = 'rgb('+result['r']+', '+result['g']+', '+result['b']+')';
                }

                buttons[rgb] = {
                    nodeName:'button',
                    elementAttrs:{
                        type:'button',
                        title:'color: '+ rgb
                    },

                    icon:'<span class="color" style="background-color: '+rgb+'">A</span>'
                }
            });

            return buttons;
        })()

    },

    'text-align':{
        type:'group', // options --> toggle / group / list
        label:'align',
        style: {
            key: "text-align",
            values: ['left', 'right','center','justify']
        },
        buttons: {
            'left':{
                nodeName:'button',
                elementAttrs:{
                    type:'button',
                    title:'Text align left'
                },

                icon:'<i class="fa fa-align-left" aria-hidden="true"></i>'
            },
            'right':{
                nodeName:'button',
                elementAttrs:{
                    title:'Text align right',
                    type:'button'
                },

                icon:'<i class="fa fa-align-right" aria-hidden="true"></i>'
            },
            'center':{
                nodeName:'button',
                elementAttrs:{
                    title:'Text align center',
                    type:'button'
                },

                icon:'<i class="fa fa-align-center" aria-hidden="true"></i>'
            },
            'justify':{
                nodeName:'button',
                elementAttrs:{
                    title:'Text align justify',
                    type:'button'
                },

                icon:'<i class="fa fa-align-justify" aria-hidden="true"></i>'
            }

        }

    }
};





let toolbarFunctionalityCollection = new GtFunctionalityCollection();
toolbarFunctionalityCollection.addStateCollection(states);
let toolbar = new GtToolbar(toolbarFunctionalityCollection,null,toolbarTemplateStateData);


let editorStateCollection = new GtFunctionalityCollection();
editorStateCollection.addStateCollection(states);
let editor = new GtEditorContent(editorStateCollection,null,toolbarTemplateStateData);


//
// let toolbar1FunctionalityCollection = new GtFunctionalityCollection();
// toolbar1FunctionalityCollection.addStateCollection(states);
// let toolbar1 = new GtToolbar(toolbar1FunctionalityCollection,null,toolbarTemplateStateData);
//
// let toolbar2FunctionalityCollection = new GtFunctionalityCollection();
// toolbar2FunctionalityCollection.addStateCollection( [states[0]] );
// let toolbar2 = new GtToolbar(toolbar2FunctionalityCollection,null,toolbarTemplateStateData);
//
// let editor2StateCollection = new GtFunctionalityCollection();
// editor2StateCollection.addStateCollection(states);
// let editor2 = new GtEditorContent(editor2StateCollection,null,toolbarTemplateStateData);



document.addEventListener('DOMContentLoaded',()=>{
    let editorParentElement = document.getElementById('GtTextEditor');
    let wrapper1 = document.getElementById('GtTextEditor1');
    let wrapper2 = document.getElementById('GtTextEditor2');

    toolbar.render(editorParentElement,statesGroup);
    editor.render(editorParentElement);


    // toolbar1.render(wrapper1);
    // editor2.render(wrapper1);
    // toolbar2.render(wrapper2);


  document.addEventListener('keydown',(event) => {

    return ;

      event = event || window.event;
      var key = event.which || event.keyCode; // keyCode detection
      var ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false); // ctrl detection

      if(!ctrl){
          return false;
      }

      // Ctrl + V Pressed !
      if ( key == 86 && ctrl ) {}
      //
      // Ctrl + C Pressed !
      if ( key == 67 && ctrl ) {}
      //
      // Ctrl + B Pressed !
      if ( key == 66 && ctrl ) {
          states[0].action();
      }
      //
      // Ctrl + U Pressed !
      if ( key == 85 && ctrl ) {
        states[1].action();
      }
      //
      // Ctrl + I Pressed !
      if ( key == 73 && ctrl ) {
        states[2].action();
      }
  });


});