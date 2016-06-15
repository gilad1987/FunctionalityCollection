import 'assets/stylesheets/scss/application.scss';

import { GtFunctionalityCollection } from 'components/GtFunctionalityCollection';
import { GtState } from 'components/GtState';
import { GtEditorContent } from 'components/GtEditorContent';
import { GtToolbar } from 'components/GtToolbar';
import { GtSelection } from "components/GtSelection";

let states = [
  new GtState('toggleBold',false,true),
  // new GtState('toggleStrike',false,true),
  new GtState('toggleUnderline',false,true),
  new GtState('toggleItalic',false,true)
];

let toolbarTemplateStateData = {
  toggleBold:{
    'nodeType':'button',
    'nodeName':'button',
    'buttonClassName':'Button',
    'id':null,
    'styleKey':'font-weight',
    'styleValue':'700',
    'wordWrapperClassName':'bold',
    'iconHtml':'b',
    'buttonTitle':'bold'
  },
  toggleStrike:{
    'nodeType':'button',
    'nodeName':'button',
    'buttonClassName':'Button',
    'id':null,
    'styleKey':'text-decoration',
    'styleValue':'line-through',
    'wordWrapperClassName':'strike',
    'iconHtml':'<span style="text-decoration: line-through">s</span>',
    'buttonTitle':'strike'
  },
  toggleUnderline:{
    'nodeType':'button',
    'nodeName':'button',
    'buttonClassName':'Button',
    'id':null,
    'styleKey':'text-decoration',
    'styleValue':'underline',
    'wordWrapperClassName':'underline',
    'iconHtml':'u',
    'buttonTitle':'underline'
  },
  toggleItalic:{
    'nodeType':'button',
    'nodeName':'button',
    'buttonClassName':'Button',
    'id':null,
    'styleKey':'font-style',
    'styleValue':'italic',
    'wordWrapperClassName':'italic',
    'iconHtml':'i',
    'buttonTitle':'italic'
  }
};




let toolbarStateCollection = new GtFunctionalityCollection();
toolbarStateCollection.addActionCollection(states);
let toolbar = new GtToolbar(toolbarStateCollection,null,toolbarTemplateStateData);

let toolbarStateCollection1 = new GtFunctionalityCollection();
toolbarStateCollection1.addActionCollection(states);
let toolbar1 = new GtToolbar(toolbarStateCollection1,null,toolbarTemplateStateData);

let toolbarStateCollection2 = new GtFunctionalityCollection();
toolbarStateCollection2.addActionCollection(states);
let toolbar2 = new GtToolbar(toolbarStateCollection2,null,toolbarTemplateStateData);

let editorStateCollection = new GtFunctionalityCollection();
editorStateCollection.addActionCollection(states);
let editor = new GtEditorContent(editorStateCollection,null,toolbarTemplateStateData);


document.addEventListener('DOMContentLoaded',()=>{
  let editorParentElement = document.getElementById('GtTextEditor');
  let wrapper1 = document.getElementById('GtTextEditor1');
  let wrapper2 = document.getElementById('GtTextEditor2');

  toolbar.render(editorParentElement);
  toolbar1.render(wrapper1);
  toolbar2.render(wrapper2);
  editor.render(editorParentElement);



  let selection = new GtSelection();
  document.addEventListener('selectionchange',(event) => {

    // console.log('selectionchange');


    let {startNode,endNode} = selection.getStartAndEndNode(),
        i=0,
        len=states.length,
        currentState,
        actionType,
        hasStyle,
        isStateOn;

    if(startNode.nodeName != 'SPAN'){
      return;
    }


    for(;i<len;i++){
      currentState = states[i];
      actionType = currentState['actionType'];
      hasStyle = selection.hasStyle(startNode, toolbarTemplateStateData[actionType].styleKey);
      isStateOn = currentState.isOn();

      if(hasStyle && !isStateOn || !hasStyle && isStateOn){
          currentState.action('selectionchange');
      }
    }


  });

  // document.addEventListener('keydown',(event) => {
  //     event = event || window.event;
  //     var key = event.which || event.keyCode; // keyCode detection
  //     var ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false); // ctrl detection
  //
  //     if(!ctrl){
  //         return false;
  //     }
  //
  //     // Ctrl + V Pressed !
  //     if ( key == 86 && ctrl ) {}
  //
  //     // Ctrl + C Pressed !
  //     if ( key == 67 && ctrl ) {}
  //
  //     // Ctrl + B Pressed !
  //     if ( key == 66 && ctrl ) {
  //         states[0].action();
  //     }
  //
  //     // Ctrl + U Pressed !
  //     if ( key == 85 && ctrl ) {
  //       states[1].action();
  //     }
  //
  //     // Ctrl + I Pressed !
  //     if ( key == 73 && ctrl ) {
  //       states[2].action();
  //     }
  // });


});