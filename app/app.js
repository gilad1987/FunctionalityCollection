import 'assets/stylesheets/scss/application.scss';


import { GtFunctionalityCollection } from 'components/GtFunctionalityCollection';
import { GtState } from 'components/GtState';
import { GtEditor } from 'components/GtEditor';
import { GtToolbar } from 'components/GtToolbar';


let states = {};
states['toggleBold'] = new GtState('toggleBold',true,true,'font-weight',400,'bold','b');
states['toggleUnderline'] = new GtState('toggleUnderline',true,true,'text-decoration','underline','italic','u');
states['toggleItalic'] = new GtState('toggleItalic',true,true,'font-style','italic','italic','i');

let toolbarStateCollection = new GtFunctionalityCollection();
toolbarStateCollection.addAction(states['toggleBold']);
toolbarStateCollection.addAction(states['toggleUnderline']);
toolbarStateCollection.addAction(states['toggleItalic']);
let toolbar = new GtToolbar(toolbarStateCollection);


let editorStateCollection = new GtFunctionalityCollection();
editorStateCollection.addAction(states['toggleBold']);
editorStateCollection.addAction(states['toggleUnderline']);
editorStateCollection.addAction(states['toggleItalic']);
let editor = new GtEditor(editorStateCollection);


document.addEventListener('DOMContentLoaded',()=>{
  let toolbarElement = document.getElementById('tool-bar');
  let editorElement = document.getElementById('editor-content');
  toolbar.render(toolbarElement);
  editor.render(editorElement);
});



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