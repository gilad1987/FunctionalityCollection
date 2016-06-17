import 'assets/stylesheets/scss/application.scss';

import { GtFunctionalityCollection } from 'components/GtFunctionalityCollection';
import { GtState } from 'components/GtState';
import { GtEditorContent } from 'components/GtEditorContent';
import { GtToolbar } from 'components/GtToolbar';

let states = [
  new GtState('toggleBold',false,true),
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




let toolbarFunctionalityCollection = new GtFunctionalityCollection();
toolbarFunctionalityCollection.addActionCollection(states);
let toolbar = new GtToolbar(toolbarFunctionalityCollection,null,toolbarTemplateStateData);

let toolbar1FunctionalityCollection = new GtFunctionalityCollection();
toolbar1FunctionalityCollection.addActionCollection(states);
let toolbar1 = new GtToolbar(toolbar1FunctionalityCollection,null,toolbarTemplateStateData);

let toolbar2FunctionalityCollection = new GtFunctionalityCollection();
toolbar2FunctionalityCollection.addActionCollection([states[0]]);
let toolbar2 = new GtToolbar(toolbar2FunctionalityCollection,null,toolbarTemplateStateData);

let editorStateCollection = new GtFunctionalityCollection();
editorStateCollection.addActionCollection(states);
let editor = new GtEditorContent(editorStateCollection,null,toolbarTemplateStateData);

let editor2StateCollection = new GtFunctionalityCollection();
editor2StateCollection.addActionCollection(states);
let editor2 = new GtEditorContent(editor2StateCollection,null,toolbarTemplateStateData);


document.addEventListener('DOMContentLoaded',()=>{
  let editorParentElement = document.getElementById('GtTextEditor');
  let wrapper1 = document.getElementById('GtTextEditor1');
  let wrapper2 = document.getElementById('GtTextEditor2');

  toolbar.render(editorParentElement);
  editor.render(editorParentElement);


  toolbar1.render(wrapper1);
  editor2.render(wrapper1);


  toolbar2.render(wrapper2);





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