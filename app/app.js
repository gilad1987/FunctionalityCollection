import 'assets/stylesheets/scss/application.scss';


import { GtFunctionalityCollection } from 'components/GtFunctionalityCollection';
import { GtState } from 'components/GtState';
import { GtEditorContent } from 'components/GtEditorContent';
import { GtToolbar } from 'components/GtToolbar';


let states = [
  new GtState('toggleBold',true,true),
  new GtState('toggleUnderline',true,true),
  new GtState('toggleItalic',true,true)
];

let toolbarTemplateStateData = {
  toggleBold:{
    'nodeType':'button',
    'nodeName':'button',
    'buttonClassName':'Button',
    'id':null,
    'styleKey':'font-weight',
    'styleValue':'400',
    'wordWrapperClassName':'bold',
    'iconHtml':'b',
    'buttonTitle':'bold'
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


let editorStateCollection = new GtFunctionalityCollection();
editorStateCollection.addActionCollection(states);
let editor = new GtEditorContent(editorStateCollection,null,toolbarTemplateStateData);


document.addEventListener('DOMContentLoaded',()=>{
  let editorParentElement = document.getElementById('GtTextEditor');
  toolbar.render(editorParentElement);
  editor.render(editorParentElement);
});


/*


var keys = {
   BOLD_BUTTON_CAPTION: "Bold"
}

app/templates/toolbar.php?lang=en
Template:
<span class=""><%= BOLD_BUTTON_CAPTION  %></span>


Widget (Toolbar, Editor)

Controller (FunctionStates)

.render() {
   template = resolvetemplate(this.templateName)
   html = template.toHTML(this.widgetModel, this.viewData)
}







 */
// let fc = new GtFunctionalityCollection(GtEventManager);
// let state = new GtState('toggleBold');
// state.setOptions(true,true,'font-weight',500,'bold');
// fc.addAction(state.actionType,state);
//
//
// boldButtonElement.on('click',() => {
//     state.action();
// });
//
//
//
// var states = {
//     "setBoold": new State(.....)
//     "setItalic":
//     "topgleBold":
// "save":
// "changeFont":
//     "void"
// }
//
// var toolbarStateCollection = new GtFunctionalityCollection();
// toolbarStateCollection.add(states.toggleItalic, states.toggleBold, null, states.saveDoc);
//
// var toolbar1 = new Toolbar(toolbarStateCollection, renderelement, .....);
// toobar1.render();
//
// contextMenuStateCollection.add(states.save, state.changeFont, states.setBold);
// var contextMenu = new ContextMenu(contextMenuStateCollection);
//
// class ContextMenu{
//     render(){
//         click => state.action();
//     }
// }
//
//
//
//
//
//
//
// console.log(fc);